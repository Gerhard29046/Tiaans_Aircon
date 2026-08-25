import { createRemoteJWKSet, jwtVerify } from "jose";
import { HttpError } from "./http.js";

function required(env, name) {
  const value = env[name]?.trim();
  if (!value) throw new HttpError(503, "auth_not_configured", "Administrator authentication is not configured.");
  return value;
}

export async function verifyAdmin(request, env) {
  const token = request.headers.get("Cf-Access-Jwt-Assertion");
  if (!token) throw new HttpError(401, "authentication_required", "Administrator authentication is required.");

  const teamDomain = required(env, "ACCESS_TEAM_DOMAIN").replace(/^https?:\/\//, "").replace(/\/$/, "");
  const audience = required(env, "ACCESS_AUD");
  const issuer = `https://${teamDomain}`;
  const jwks = createRemoteJWKSet(new URL(`${issuer}/cdn-cgi/access/certs`));
  let payload;
  try {
    ({ payload } = await jwtVerify(token, jwks, { issuer, audience, algorithms: ["RS256"] }));
  } catch {
    throw new HttpError(401, "invalid_access_token", "Administrator authentication is invalid or expired.");
  }

  const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
  const allowlist = new Set(required(env, "ADMIN_EMAILS").split(",").map((item) => item.trim().toLowerCase()).filter(Boolean));
  if (!email || !allowlist.has(email)) {
    throw new HttpError(403, "administrator_required", "This identity is not authorized as an administrator.");
  }
  return { email };
}
