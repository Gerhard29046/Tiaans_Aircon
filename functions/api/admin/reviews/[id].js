import { deleteResource, updateResource } from "../../../_shared/admin-resources.js";
import { json, withErrors } from "../../../_shared/http.js";

export const onRequestPut = withErrors(async ({ request, env, data, params }, requestId) => json(await updateResource("reviews", String(params.id), request, env, data.admin, requestId), 200, requestId));
export const onRequestDelete = withErrors(async ({ env, data, params }, requestId) => {
  await deleteResource("reviews", String(params.id), env, data.admin, requestId);
  return json({ deleted: true }, 200, requestId);
});
