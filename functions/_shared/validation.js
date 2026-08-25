import { HttpError } from "./http.js";

export const SERVICES = new Set([
  "New Aircon Installation", "Aircon Sales", "Aircon Repair", "Aircon Service",
  "Car Aircon Regas", "Car Aircon Repair", "Other",
]);
export const CUSTOMER_TYPES = new Set(["Home", "Business", "Vehicle"]);
export const ENQUIRY_STATUSES = new Set(["New", "Contacted", "Quote Sent", "Booked", "Completed", "Closed"]);

function text(form, name, maximum, required = false) {
  const value = String(form.get(name) || "").trim();
  if ((required && !value) || value.length > maximum) throw new HttpError(400, "validation_failed", "One or more fields are invalid.", { [name]: "invalid" });
  return value;
}

export function parseEnquiry(form) {
  const name = text(form, "name", 120, true);
  const phone = text(form, "phone", 30, true);
  if (phone.length < 5) throw new HttpError(400, "validation_failed", "One or more fields are invalid.", { phone: "invalid" });
  const email = text(form, "email", 254);
  const service = text(form, "service", 160, true);
  const customerType = text(form, "customer_type", 20, true);
  if (!SERVICES.has(service) || !CUSTOMER_TYPES.has(customerType)) throw new HttpError(400, "validation_failed", "One or more fields are invalid.");
  return { name, phone, email, service, customer_type: customerType, message: text(form, "message", 4000) };
}

const signatures = [
  { type: "image/jpeg", ext: "jpg", match: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  { type: "image/png", ext: "png", match: (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 },
  { type: "image/webp", ext: "webp", match: (b) => String.fromCharCode(...b.slice(0, 4)) === "RIFF" && String.fromCharCode(...b.slice(8, 12)) === "WEBP" },
];

export async function validateImage(file, maximumBytes) {
  if (!(file instanceof File) || file.size === 0 || file.size > maximumBytes) throw new HttpError(400, "invalid_attachment", "The uploaded image is empty or too large.");
  const bytes = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  const signature = signatures.find((item) => item.type === file.type && item.match(bytes));
  if (!signature) throw new HttpError(400, "invalid_attachment", "Only valid JPEG, PNG, or WebP images are accepted.");
  return signature;
}
