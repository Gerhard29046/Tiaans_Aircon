import { json } from "../../_shared/http.js";

export const onRequestGet = async ({ data }) => json({ user: { email: data.admin.email } });
