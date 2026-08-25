import { verifyAdmin } from "../../_shared/access.js";
import { assertSameOrigin, errorResponse } from "../../_shared/http.js";

export const onRequest = async (context) => {
  const requestId = crypto.randomUUID();
  try {
    context.data.admin = await verifyAdmin(context.request, context.env);
    if (!["GET", "HEAD", "OPTIONS"].includes(context.request.method)) assertSameOrigin(context.request);
    return await context.next();
  } catch (error) {
    return errorResponse(error, requestId);
  }
};
