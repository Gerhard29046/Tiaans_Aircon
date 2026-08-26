import React from "react";
import { Phone, MessageCircle, Paperclip } from "lucide-react";
import { format } from "date-fns";
import { adminApi } from "@/api/admin";
import { fieldCls, Card } from "@/components/admin/ui";

const STATUSES = ["New", "Contacted", "Quote Sent", "Booked", "Completed", "Closed"];

const waFor = (e) =>
  `https://wa.me/${(e.phone || "").replace(/\D/g, "").replace(/^0/, "27")}?text=${encodeURIComponent(
    `Hi ${e.name}, it's Tiaan from Tiaan's Aircon about your ${e.service || "aircon"} enquiry.`
  )}`;

export default function EnquiriesManager({ enquiries, reload }) {
  const update = async (id, data) => {
    await adminApi.enquiries.update(id, data);
    reload();
  };

  return (
    <div>
      <h2 className="font-heading font-extrabold text-2xl text-white mb-6">Enquiries</h2>
      <div className="grid gap-4 lg:grid-cols-2">
        {enquiries.map((e) => (
          <Card key={e.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-heading font-bold text-white text-lg">{e.name}</p>
                <p className="text-xs text-white/50 mt-1">
                  {[e.service, e.customer_type, e.created_date && format(new Date(e.created_date), "d MMM yyyy")]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
              <span className="text-[10px] font-bold tracking-wider px-3 py-1.5 rounded-full bg-[#2D8CCB]/25 text-[#6DD5F7] shrink-0">
                {e.status || "New"}
              </span>
            </div>

            {e.message && <p className="mt-4 text-white/70 whitespace-pre-line">{e.message}</p>}
            {e.email && <p className="mt-2 text-sm text-white/50 break-all">{e.email}</p>}

            {e.attachment && (
              <a href={e.attachment} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 text-sm text-[#6DD5F7]">
                <Paperclip className="w-4 h-4" /> View attached photo
              </a>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              <a href={`tel:${e.phone}`} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 text-white text-sm font-bold">
                <Phone className="w-4 h-4" /> {e.phone}
              </a>
              <a href={waFor(e)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#2D8CCB] text-white text-sm font-bold">
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
            </div>

            <div className="mt-4 grid gap-3">
              <select className={fieldCls} value={e.status || "New"} onChange={(ev) => update(e.id, { status: ev.target.value })}>
                {STATUSES.map((s) => (
                  <option key={s} value={s} className="text-black">{s}</option>
                ))}
              </select>
              <textarea
                rows={2}
                placeholder="Private notes…"
                className={fieldCls}
                defaultValue={e.private_notes || ""}
                onBlur={(ev) => ev.target.value !== (e.private_notes || "") && update(e.id, { private_notes: ev.target.value })}
              />
            </div>
          </Card>
        ))}
        {enquiries.length === 0 && <p className="text-white/50">No enquiries yet.</p>}
      </div>
    </div>
  );
}
