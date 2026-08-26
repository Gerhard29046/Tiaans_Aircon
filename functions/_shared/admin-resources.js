import { mapProject, mapRow, mapRows, mapTip } from "./db.js";
import { HttpError, parseLimit } from "./http.js";

const configs = {
  projects: {
    table: "projects",
    fields: ["title", "description", "category", "location", "project_date", "cover_media_id", "before_media_id", "after_media_id", "show_before_after", "featured", "published"],
    booleans: new Set(["show_before_after", "featured", "published"]),
    virtualFields: new Set(["image_ids"]),
    enums: { category: new Set(["Installation", "Repair", "Service", "Car Aircon", "Other"]) },
    limits: { title: 160, description: 10000, category: 40, location: 120, project_date: 40 },
    required: new Set(["title", "category"]),
    order: "COALESCE(project_date, created_at) DESC",
    map: (row) => mapProject(row, true),
  },
  tips: {
    table: "tips",
    fields: ["title", "slug", "excerpt", "content", "category", "cover_media_id", "read_time", "featured", "published", "published_at"],
    booleans: new Set(["featured", "published"]),
    virtualFields: new Set(),
    enums: { category: new Set(["Home Aircon", "Car Aircon", "Maintenance", "Troubleshooting", "Energy Saving"]) },
    limits: { title: 160, slug: 80, excerpt: 500, content: 50000, category: 40, read_time: 40, published_at: 40 },
    required: new Set(["title", "slug", "category"]),
    order: "COALESCE(published_at, created_at) DESC",
    map: (row) => mapTip(row, true),
  },
  reviews: {
    table: "reviews",
    fields: ["customer_name", "review", "rating", "service", "review_date", "published"],
    booleans: new Set(["published"]),
    virtualFields: new Set(),
    enums: {},
    limits: { customer_name: 120, review: 3000, service: 160, review_date: 40 },
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
  const unknown = Object.keys(body).filter((field) => !config.fields.includes(field) && !config.virtualFields.has(field));
  if (unknown.length) throw new HttpError(400, "unknown_field", `Unknown field: ${unknown[0]}`);
  if (create) {
    for (const field of config.required) {
      if (typeof body[field] !== "string" || !body[field].trim()) throw new HttpError(400, "validation_failed", `${field} is required.`);
    }
  }
  const result = {};
  for (const field of config.fields) {
    if (!(field in body)) continue;
    const value = body[field];
    if (config.booleans.has(field)) {
      if (typeof value !== "boolean") throw new HttpError(400, "validation_failed", `${field} must be a boolean.`);
      result[field] = value ? 1 : 0;
      continue;
    }
    if (field.endsWith("_media_id")) {
      if (value !== null && (typeof value !== "string" || !value.trim() || value.length > 128)) throw new HttpError(400, "validation_failed", `${field} is invalid.`);
      result[field] = value;
      continue;
    }
    if (field === "rating") {
      if (!Number.isInteger(value) || value < 1 || value > 5) throw new HttpError(400, "validation_failed", "rating must be an integer from 1 to 5.");
      result[field] = value;
      continue;
    }
    if (typeof value !== "string") throw new HttpError(400, "validation_failed", `${field} must be a string.`);
    if (config.required.has(field) && !value.trim()) throw new HttpError(400, "validation_failed", `${field} is required.`);
    if (config.limits[field] && value.length > config.limits[field]) throw new HttpError(400, "validation_failed", `${field} is too long.`);
    if (config.enums[field] && !config.enums[field].has(value)) throw new HttpError(400, "validation_failed", `${field} is invalid.`);
    result[field] = value === "" && (field.endsWith("_date") || field.endsWith("_at")) ? null : value;
  }
  let imageIds;
  if (config.virtualFields.has("image_ids") && "image_ids" in body) {
    if (!Array.isArray(body.image_ids) || body.image_ids.length > 50 || body.image_ids.some((id) => typeof id !== "string" || !id.trim() || id.length > 128)) {
      throw new HttpError(400, "validation_failed", "image_ids is invalid.");
    }
    imageIds = [...new Set(body.image_ids)];
  }
  if (!Object.keys(result).length && imageIds === undefined) throw new HttpError(400, "validation_failed", "At least one writable field is required.");
  return { values: result, imageIds };
}

async function assertPublicMedia(env, values, imageIds) {
  const ids = [...new Set([
    ...Object.entries(values).filter(([field, value]) => field.endsWith("_media_id") && value).map(([, value]) => value),
    ...(imageIds || []),
  ])];
  if (!ids.length) return;
  const placeholders = ids.map(() => "?").join(", ");
  const result = await env.DB.prepare(`SELECT id FROM media_objects WHERE bucket_kind = 'public_content' AND state = 'ready' AND id IN (${placeholders})`).bind(...ids).all();
  if (result.results.length !== ids.length) throw new HttpError(400, "validation_failed", "One or more media references are invalid.");
}

function galleryStatements(env, projectId, imageIds) {
  if (imageIds === undefined) return [];
  return [
    env.DB.prepare("DELETE FROM project_images WHERE project_id = ?").bind(projectId),
    ...imageIds.map((mediaId, index) => env.DB.prepare("INSERT INTO project_images (project_id, media_id, sort_order) VALUES (?, ?, ?)").bind(projectId, mediaId, index)),
  ];
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
  const { values, imageIds } = writable(config, await bodyObject(request), true);
  await assertPublicMedia(env, values, imageIds);
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const fields = Object.keys(values);
  const placeholders = fields.map(() => "?").join(", ");
  const statement = env.DB.prepare(`INSERT INTO ${config.table} (id, ${fields.join(", ")}, created_at, updated_at) VALUES (?, ${placeholders}, ?, ?)`)
    .bind(id, ...fields.map((field) => values[field]), now, now);
  await env.DB.batch([statement, ...galleryStatements(env, id, imageIds), audit(env, actor, "create", resource, id, requestId, imageIds === undefined ? fields : [...fields, "image_ids"], now)]);
  return getResource(resource, id, env);
}

export async function updateResource(resource, id, request, env, actor, requestId) {
  const config = configFor(resource);
  const exists = await env.DB.prepare(`SELECT id FROM ${config.table} WHERE id = ?`).bind(id).first();
  if (!exists) throw new HttpError(404, "not_found", "Record not found.");
  const { values, imageIds } = writable(config, await bodyObject(request), false);
  await assertPublicMedia(env, values, imageIds);
  const now = new Date().toISOString();
  const fields = Object.keys(values);
  const statements = [];
  if (fields.length) {
    statements.push(env.DB.prepare(`UPDATE ${config.table} SET ${fields.map((field) => `${field} = ?`).join(", ")}, updated_at = ? WHERE id = ?`)
      .bind(...fields.map((field) => values[field]), now, id));
  }
  statements.push(...galleryStatements(env, id, imageIds));
  statements.push(audit(env, actor, "update", resource, id, requestId, imageIds === undefined ? fields : [...fields, "image_ids"], now));
  await env.DB.batch(statements);
  return getResource(resource, id, env);
}

export async function deleteResource(resource, id, env, actor, requestId) {
  const config = configFor(resource);
  const exists = await env.DB.prepare(`SELECT id FROM ${config.table} WHERE id = ?`).bind(id).first();
  if (!exists) throw new HttpError(404, "not_found", "Record not found.");
  const now = new Date().toISOString();
  await env.DB.batch([
    env.DB.prepare(`DELETE FROM ${config.table} WHERE id = ?`).bind(id),
    audit(env, actor, "delete", resource, id, requestId, [], now),
  ]);
}

async function getResource(resource, id, env) {
  const config = configFor(resource);
  const select = resource === "projects"
    ? "SELECT p.*, (SELECT group_concat(media_id, char(31)) FROM (SELECT media_id FROM project_images WHERE project_id = p.id ORDER BY sort_order)) AS image_ids FROM projects p WHERE p.id = ?"
    : `SELECT * FROM ${config.table} WHERE id = ?`;
  const row = await env.DB.prepare(select).bind(id).first();
  if (!row) throw new HttpError(404, "not_found", "Record not found.");
  return config.map(row);
}
