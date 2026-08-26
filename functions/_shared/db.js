const booleanFields = new Set(["published", "featured", "show_before_after"]);

export function mapRow(row) {
  if (!row) return null;
  const mapped = { ...row };
  for (const field of booleanFields) {
    if (field in mapped) mapped[field] = mapped[field] === 1;
  }
  if ("created_at" in mapped) mapped.created_date = mapped.created_at;
  if ("updated_at" in mapped) mapped.updated_date = mapped.updated_at;
  return mapped;
}

export function mapRows(rows) {
  return rows.map(mapRow);
}

export function mediaUrl(id) {
  return id ? `/api/public/media/${encodeURIComponent(id)}` : "";
}

export function mapProject(row, includeMediaIds = false) {
  const mapped = mapRow(row);
  if (!mapped) return null;
  mapped.cover_image = mediaUrl(mapped.cover_media_id);
  mapped.before_image = mediaUrl(mapped.before_media_id);
  mapped.after_image = mediaUrl(mapped.after_media_id);
  mapped.images = mapped.image_ids ? String(mapped.image_ids).split("\u001f").filter(Boolean).map(mediaUrl) : [];
  mapped.image_ids = mapped.image_ids ? String(mapped.image_ids).split("\u001f").filter(Boolean) : [];
  if (!includeMediaIds) {
    delete mapped.cover_media_id;
    delete mapped.before_media_id;
    delete mapped.after_media_id;
    delete mapped.image_ids;
  }
  return mapped;
}

export function mapTip(row, includeMediaIds = false) {
  const mapped = mapRow(row);
  if (!mapped) return null;
  mapped.cover_image = mediaUrl(mapped.cover_media_id);
  if (!includeMediaIds) delete mapped.cover_media_id;
  return mapped;
}
