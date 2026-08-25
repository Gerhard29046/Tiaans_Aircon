import { mapProject, mapRow, mapRows, mapTip } from "./db.js";
import { HttpError, parseLimit } from "./http.js";

const configs = {
  projects: {
    table: "projects",
    fields: ["title", "description", "category", "location", "project_date", "cover_media_id", "before_media_id", "after_media_id", "show_before_after", "featured", "published"],
    booleans: new Set(["show_before_after", "featured", "published"]),
    required: new Set(["title", "category"]),
    order: "COALESCE(project_date, created_at) DESC",
    map: mapProject,
  },
  tips: {
    table: "tips",
    fields: ["title", "slug", "excerpt", "content", "category", "cover_media_id", "read_time", "featured", "published", "published_at"],
    booleans: new Set(["featured", "published"]),
    required: new Set(["title", "slug", "category"]),
    order: "COALESCE(published_at, created_at) DESC",
    map: mapTip,
  },
  reviews: {
    table: "reviews",
    fields: ["customer_name", "review", "rating", "service", "review_date", "published"],
    booleans: new Set(["published"]),
    required: new Set(["customer_name", "review"]),
    order: "COALESCE(review_date, created_at) DESC",
    map: mapRow,
  },
};

function configFor(resource) {
  const config = configs[resource];
  if (!config) throw new HttpError(404, "not_found", "Resource not found.");
  return config;
}

async function bodyObject(request) {
  if (!request.headers.get("Content-Type")?.includes("application/json")) throw new HttpError(415, "unsupported_media_type", "Use JSON.");
  const body = await request.json();
  if (!body || typeof body !== "object" || Array.isArray(body)) throw new HttpError(400, "validation_failed", "A JSON object is required.");
  return body;
}

function writable(config, body, create) {
  const unknown = Object.keys(body).filter((field) => !config.fields.includes(field));
  if (unknown.length) throw new HttpError(400, "unknown_field", `Unknown field: ${unknown[0]}`);
  if (create) {
    for (const field of config.required) {
      if (typeof body[field] !== "string" || !body[field].trim()) throw new HttpError(400, "validation_failed", `${field} is required.`);
    }
  }
  const result = {};
  for (const field of config.fields) {
    if (!(field in body)) continue;
    result[field] = config.booleans.has(field) ? (body[field] ? 1 : 0) : body[field];
  }
  if (!Object.keys(result).length) throw new HttpError(400, "validation_failed", "At least one writable field is required.");
  return result;
}

function audit(env, actor, action, resource, entityId, requestId, fields, now) {
  return env.DB.prepare(`INSERT INTO admin_audit_log
    (id, actor_email, action, entity_type, entity_id, request_id, summary_json, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
    .bind(crypto.randomUUID(), actor.email, action, resource, entityId, requestId, JSON.stringify({ fields }), now);
}

export async function listResource(resource, request, env) {
  const config = configFor(resource);
  const limit = parseLimit(request, 100, 200);
  const select = resource === "projects"
    ? `SELECT p.*, (SELECT group_concat(media_id, char(31)) FROM (SELECT media_id FROM project_images WHERE project_id = p.id ORDER BY sort_order)) AS image_ids FROM projects p ORDER BY ${config.order} LIMIT ?`
    : `SELECT * FROM ${config.table} ORDER BY ${config.order} LIMIT ?`;
  const result = await env.DB.prepare(select).bind(limit).all();
  return resource === "reviews" ? mapRows(result.results) : result.results.map(config.map);
}

export async function createResource(resource, request, env, actor, requestId) {
  const config = configFor(resource);
  const values = writable(config, await bodyObject(request), true);
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const fields = Object.keys(values);
  const placeholders = fields.map(() => "?").join(", ");
  const statement = env.DB.prepare(`INSERT INTO ${config.table} (id, ${fields.join(", ")}, created_at, updated_at) VALUES (?, ${placeholders}, ?, ?)`)
    .bind(id, ...fields.map((field) => values[field]), now, now);
  await env.DB.batch([statement, audit(env, actor, "create", resource, id, requestId, fields, now)]);
  return getResource(resource, id, env);
}

export async function updateResource(resource, id, request, env, actor, requestId) {
  const config = configFor(resource);
  const values = writable(config, await bodyObject(request), false);
  const now = new Date().toISOString();
  const fields = Object.keys(values);
  const update = env.DB.prepare(`UPDATE ${config.table} SET ${fields.map((field) => `${field} = ?`).join(", ")}, updated_at = ? WHERE id = ?`)
    .bind(...fields.map((field) => values[field]), now, id);
  const results = await env.DB.batch([update, audit(env, actor, "update", resource, id, requestId, fields, now)]);
  if (!results[0].meta.changes) throw new HttpError(404, "not_found", "Record not found.");
  return getResource(resource, id, env);
}

export async function deleteResource(resource, id, env, actor, requestId) {
  const config = configFor(resource);
  const now = new Date().toISOString();
  const results = await env.DB.batch([
    env.DB.prepare(`DELETE FROM ${config.table} WHERE id = ?`).bind(id),
    audit(env, actor, "delete", resource, id, requestId, [], now),
  ]);
  if (!results[0].meta.changes) throw new HttpError(404, "not_found", "Record not found.");
}

async function getResource(resource, id, env) {
  const config = configFor(resource);
  const row = await env.DB.prepare(`SELECT * FROM ${config.table} WHERE id = ?`).bind(id).first();
  if (!row) throw new HttpError(404, "not_found", "Record not found.");
  return config.map(row);
}
