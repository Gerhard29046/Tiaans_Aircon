export class ApiError extends Error {
  constructor(message, status, code, fields) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.fields = fields;
  }
}

export async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers);
  let body = options.body;
  if (body && !(body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(body);
  }
  const response = await fetch(path, { ...options, body, headers, credentials: "same-origin" });
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const error = payload?.error;
    throw new ApiError(error?.message || `Request failed with status ${response.status}.`, response.status, error?.code || "request_failed", error?.fields);
  }
  return payload?.data;
}
