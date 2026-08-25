export const BRAND = {
  name: "Tiaan's Aircon",
  owner: "Tiaan Grimbacher",
  descriptor: "Cooling • Heating • Vehicle Aircon",
  tel: "021 917 1620",
  cell: "082 776 2393",
  whatsapp: "076 848 0829",
  whatsappIntl: "27768480829",
  email: "tiaansaircon.appliance@gmail.com",
  address: "32 Old Paarl Road, Bellville, 7530",
  addressLines: ["32 Old Paarl Road", "Bellville, 7530", "South Africa"],
  area: "Bellville • Northern Suburbs • Cape Town",
  mapsQuery: "32+Old+Paarl+Road+Bellville+7530+South+Africa",
};

export const WA_MESSAGES = {
  general: "Hi Tiaan, I found Tiaan's Aircon online and need some help with my aircon.",
  installation: "Hi Tiaan, I'd like to get a quote for an aircon installation.",
  sales: "Hi Tiaan, I'm looking at buying a new aircon and would like some advice.",
  repair: "Hi Tiaan, my aircon isn't working properly and I'd like some help.",
  service: "Hi Tiaan, I'd like to book an aircon service.",
  car: "Hi Tiaan, I'd like some help with my car's aircon.",
  regas: "Hi Tiaan, my car's aircon isn't getting cold and I'd like to have it checked.",
};

export function waLink(key = "general", extra) {
  const base = WA_MESSAGES[key] || WA_MESSAGES.general;
  const text = extra ? `${base} (${extra})` : base;
  return `https://wa.me/${BRAND.whatsappIntl}?text=${encodeURIComponent(text)}`;
}

export const telLink = `tel:+27827762393`;
export const telLandline = `tel:+27219171620`;
export const directionsLink = `https://www.google.com/maps/dir/?api=1&destination=${BRAND.mapsQuery}`;
export const mapEmbed = `https://www.google.com/maps?q=${BRAND.mapsQuery}&output=embed`;