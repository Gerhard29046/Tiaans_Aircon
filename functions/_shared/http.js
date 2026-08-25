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
