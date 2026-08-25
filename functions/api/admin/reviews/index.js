import { createResource, listResource } from "../../../_shared/admin-resources.js";
import { json, withErrors } from "../../../_shared/http.js";

export const onRequestGet = withErrors(async ({ request, env }, requestId) => json(await listResource("reviews", request, env), 200, requestId));
export const onRequestPost = withErrors(async ({ request, env, data }, requestId) => json(await createResource("reviews", request, env, data.admin, requestId), 201, requestId));
