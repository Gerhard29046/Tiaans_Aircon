import { HttpError } from "./http.js";

export async function verifyTurnstile(token, request, env) {
  const secret = env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) throw new HttpError(503, "turnstile_not_configured", "Enquiry verification is not configured.");
  if (!token || token.length > 2048) throw new HttpError(400, "turnstile_required", "Please complete the verification challenge.");

  const body = new FormData();
  body.set("secret", secret);
  body.set("response", token);
  body.set("remoteip", request.headers.get("CF-Connecting-IP") || "");
  body.set("idempotency_key", crypto.randomUUID());
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
  if (!response.ok) throw new HttpError(502, "verification_unavailable", "Verification is temporarily unavailable.");
  const result = await response.json();
  const allowedHosts = new Set(String(env.TURNSTILE_ALLOWED_HOSTNAMES || "").split(",").map((item) => item.trim().toLowerCase()).filter(Boolean));
  if (!result.success || result.action !== "contact_enquiry" || !allowedHosts.has(String(result.hostname || "").toLowerCase())) {
    throw new HttpError(400, "turnstile_failed", "The verification challenge was not accepted.");
  }
}
