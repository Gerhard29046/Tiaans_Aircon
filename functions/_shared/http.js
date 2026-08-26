export class HttpError extends Error {
  constructor(status, code, message, fields) {
    super(message);
    this.status = status;
    this.code = code;
    this.fields = fields;
  }
}

export function json(data, status = 200, requestId = crypto.randomUUID(), headers = {}) {
  return Response.json(
    { data, meta: { requestId } },
    { status, headers: { "Cache-Control": "private, no-store", ...headers } },
  );
}

export function errorResponse(error, requestId) {
  const known = error instanceof HttpError;
  if (!known) {
    console.error(JSON.stringify({ message: "request failed", requestId, error: error instanceof Error ? error.message : String(error) }));
  }
  const status = known ? error.status : 500;
  const body = {
    error: {
      code: known ? error.code : "internal_error",
      message: known ? error.message : "An unexpected error occurred.",
      requestId,
      ...(known && error.fields ? { fields: error.fields } : {}),
    },
  };
  return Response.json(body, { status, headers: { "Cache-Control": "private, no-store" } });
}

export function parseLimit(request, fallback, maximum = 100) {
  const raw = new URL(request.url).searchParams.get("limit");
  if (raw === null) return fallback;
  const limit = Number.parseInt(raw, 10);
  if (!Number.isInteger(limit) || limit < 1 || limit > maximum) {
    throw new HttpError(400, "validation_failed", `limit must be between 1 and ${maximum}.`);
  }
  return limit;
}

export function assertSameOrigin(request) {
  const origin = request.headers.get("Origin");
  if (!origin || origin !== new URL(request.url).origin) {
    throw new HttpError(403, "origin_not_allowed", "The request origin is not allowed.");
  }
}

export async function formDataWithLimit(request, maximumBytes) {
  const declared = request.headers.get("Content-Length");
  if (declared !== null) {
    const length = Number(declared);
    if (!Number.isFinite(length) || length < 0) throw new HttpError(400, "invalid_content_length", "The request length is invalid.");
    if (length > maximumBytes) throw new HttpError(413, "request_too_large", "The request is too large.");
  }
  if (!request.body) throw new HttpError(400, "empty_request", "The request body is required.");
  const reader = request.body.getReader();
  const chunks = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maximumBytes) {
      await reader.cancel();
      throw new HttpError(413, "request_too_large", "The request is too large.");
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new Response(bytes, { headers: { "Content-Type": request.headers.get("Content-Type") || "" } }).formData();
}

export function withErrors(handler) {
  return async (context) => {
    const requestId = crypto.randomUUID();
    try {
      return await handler(context, requestId);
    } catch (error) {
      return errorResponse(error, requestId);
    }
  };
}
