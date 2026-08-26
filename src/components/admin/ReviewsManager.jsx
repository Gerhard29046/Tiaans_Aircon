import React, { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { adminApi } from "@/api/admin";
import { Field, fieldCls, Toggle, AdminButton, Card } from "@/components/admin/ui";

const EMPTY = {
  customer_name: "",
  review: "",
  rating: 5,
  service: "",
  review_date: new Date().toISOString().slice(0, 10),
  published: true,
};

export default function ReviewsManager({ reviews, reload }) {
  const [editing, setEditing] = useState(null);

  const save = async (e) => {
    e.preventDefault();
    const { id, ...data } = editing;
    data.rating = Number(data.rating);
    if (id) await adminApi.reviews.update(id, data);
    else await adminApi.reviews.create(data);
    setEditing(null);
    reload();
  };

  const remove = async (r) => {
    if (!window.confirm(`Delete review by ${r.customer_name}?`)) return;
    await adminApi.reviews.remove(r.id);
    reload();
  };

  if (editing) {
    return (
      <form onSubmit={save} className="space-y-5 max-w-xl">
        <h2 className="font-heading font-extrabold text-2xl text-white">
          {editing.id ? "Edit review" : "Add a real customer review"}
        </h2>
        <Field label="Customer first name">
          <input required className={fieldCls} value={editing.customer_name} onChange={(e) => setEditing({ ...editing, customer_name: e.target.value })} />
        </Field>
        <Field label="Review">
          <textarea required rows={4} className={fieldCls} value={editing.review} onChange={(e) => setEditing({ ...editing, review: e.target.value })} />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Star rating">
            <select className={fieldCls} value={editing.rating} onChange={(e) => setEditing({ ...editing, rating: e.target.value })}>
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n} className="text-black">{n} stars</option>
              ))}
            </select>
          </Field>
          <Field label="Service">
            <input className={fieldCls} value={editing.service || ""} onChange={(e) => setEditing({ ...editing, service: e.target.value })} />
          </Field>
        </div>
        <Field label="Date">
          <input type="date" className={fieldCls} value={editing.review_date || ""} onChange={(e) => setEditing({ ...editing, review_date: e.target.value })} />
        </Field>
        <Toggle label={editing.published ? "Published" : "Unpublished"} checked={!!editing.published} onChange={(v) => setEditing({ ...editing, published: v })} />
        <div className="flex gap-3 pt-2">
          <AdminButton type="submit">Save review</AdminButton>
          <AdminButton variant="ghost" onClick={() => setEditing(null)}>Cancel</AdminButton>
        </div>
      </form>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <h2 className="font-heading font-extrabold text-2xl text-white">Reviews</h2>
        <AdminButton onClick={() => setEditing({ ...EMPTY })}>
          <span className="inline-flex items-center gap-2"><Plus className="w-4 h-4" /> Add review</span>
        </AdminButton>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {reviews.map((r) => (
          <Card key={r.id}>
            <p className="font-heading font-bold text-white">
              {r.customer_name} · {r.rating}★
            </p>
            <p className="mt-2 text-white/70">{r.review}</p>
            <p className="mt-2 text-xs text-white/45">
              {r.service} · {r.published ? "Published" : "Hidden"}
            </p>
            <div className="mt-3 flex gap-2">
              <button onClick={() => setEditing({ ...EMPTY, ...r })} className="p-2 rounded-xl bg-white/10 text-white" aria-label="Edit">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => remove(r)} className="p-2 rounded-xl bg-[#C8102E]/80 text-white" aria-label="Delete">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </Card>
        ))}
        {reviews.length === 0 && (
          <p className="text-white/50">No reviews yet. Only add real reviews from real customers.</p>
        )}
      </div>
    </div>
  );
}
