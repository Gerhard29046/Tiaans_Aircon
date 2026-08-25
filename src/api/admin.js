import { apiRequest } from "./http";

function resource(name) {
  const base = `/api/admin/${name}`;
  return {
    list(limit = 200) {
      return apiRequest(`${base}?limit=${limit}`);
    },
    create(values) {
      return apiRequest(base, { method: "POST", body: values });
    },
    update(id, values) {
      return apiRequest(`${base}/${encodeURIComponent(id)}`, { method: "PUT", body: values });
    },
    remove(id) {
      return apiRequest(`${base}/${encodeURIComponent(id)}`, { method: "DELETE" });
    },
  };
}

export const adminApi = {
  session() {
    return apiRequest("/api/admin/session");
  },
  projects: resource("projects"),
  tips: resource("tips"),
  reviews: resource("reviews"),
  enquiries: {
    list(limit = 200) {
      return apiRequest(`/api/admin/enquiries?limit=${limit}`);
    },
    update(id, values) {
      return apiRequest(`/api/admin/enquiries/${encodeURIComponent(id)}`, { method: "PATCH", body: values });
    },
  },
  async uploadImage(file) {
    const form = new FormData();
    form.set("file", file);
    return apiRequest("/api/admin/media", { method: "POST", body: form });
  },
};
