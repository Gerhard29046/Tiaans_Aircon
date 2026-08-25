import { apiRequest } from "./http";

export const publicApi = {
  listProjects({ limit = 100 } = {}) {
    return apiRequest(`/api/public/projects?limit=${limit}`);
  },
  listTips({ limit = 100 } = {}) {
    return apiRequest(`/api/public/tips?limit=${limit}`);
  },
  getTip(slugOrId) {
    return apiRequest(`/api/public/tips/${encodeURIComponent(slugOrId)}`);
  },
  listReviews({ limit = 12 } = {}) {
    return apiRequest(`/api/public/reviews?limit=${limit}`);
  },
  submitEnquiry(fields, file, turnstileToken) {
    const form = new FormData();
    for (const [key, value] of Object.entries(fields)) form.set(key, value);
    if (file) form.set("attachment", file);
    form.set("turnstile_token", turnstileToken);
    return apiRequest("/api/enquiries", { method: "POST", body: form });
  },
};
