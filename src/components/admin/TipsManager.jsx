import React, { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { base44 } from "@/api/base44client";
import ImageUpload from "@/components/admin/ImageUpload";
import { Field, fieldCls, Toggle, AdminButton, Card } from "@/components/admin/ui";

const CATEGORIES = ["Home Aircon", "Car Aircon", "Maintenance", "Troubleshooting", "Energy Saving"];
const EMPTY = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "Home Aircon",
  cover_image: "",
  read_time: "3 min read",
  featured: false,
  published: true,
  published_at: new Date().toISOString().slice(0, 10),
};

const slugify = (s) =>
  s.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").slice(0, 60);

export default function TipsManager({ tips, reload }) {
  const [editing, setEditing] = useState(null);

  const save = async (e) => {
    e.preventDefault();
    const { id, ...data } = editing;
    data.slug = data.slug || slugify(data.title);
    if (id) await base44.entities.Tip.update(id, data);
    else await base44.entities.Tip.create(data);
    setEditing(null);
    reload();
  };

  const remove = async (t) => {
    if (!window.confirm(`Delete "${t.title}"?`)) return;
    await base44.entities.Tip.delete(t.id);
    reload();
  };

  if (editing) {
    return (
      <form onSubmit={save} className="space-y-5 max-w-2xl">
        <h2 className="font-heading font-extrabold text-2xl text-white">{editing.id ? "Edit tip" : "New tip"}</h2>
        <Field label="Title">
          <input required className={fieldCls} value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
        </Field>
        <Field label="Short description">
          <textarea rows={2} className={fieldCls} value={editing.excerpt || ""} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} />
        </Field>
        <Field label="Article (just type — new lines start new paragraphs)">
          <textarea rows={12} className={fieldCls} value={editing.content || ""} onChange={(e) => setEditing({ ...editing, content: e.target.value })} />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Category">
            <select className={fieldCls} value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="text-black">{c}</option>
              ))}
            </select>
          </Field>
          <Field label="Read time">
            <input className={fieldCls} value={editing.read_time || ""} onChange={(e) => setEditing({ ...editing, read_time: e.target.value })} />
          </Field>
        </div>
        <Field label="Date">
          <input type="date" className={fieldCls} value={editing.published_at || ""} onChange={(e) => setEditing({ ...editing, published_at: e.target.value })} />
        </Field>
        <ImageUpload label="Cover photo" value={editing.cover_image} onChange={(v) => setEditing({ ...editing, cover_image: v })} />
        <div className="flex flex-wrap gap-2">
          <Toggle label="Feature on homepage" checked={!!editing.featured} onChange={(v) => setEditing({ ...editing, featured: v })} />
          <Toggle label={editing.published ? "Published" : "Draft"} checked={!!editing.published} onChange={(v) => setEditing({ ...editing, published: v })} />
        </div>
        <div className="flex gap-3 pt-2">
          <AdminButton type="submit">Save tip</AdminButton>
          <AdminButton variant="ghost" onClick={() => setEditing(null)}>Cancel</AdminButton>
        </div>
      </form>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <h2 className="font-heading font-extrabold text-2xl text-white">Tiaan's Tips</h2>
        <AdminButton onClick={() => setEditing({ ...EMPTY })}>
          <span className="inline-flex items-center gap-2"><Plus className="w-4 h-4" /> Add tip</span>
        </AdminButton>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {tips.map((t) => (
          <Card key={t.id}>
            <p className="font-heading font-bold text-white">{t.title}</p>
            <p className="text-xs text-white/50 mt-1">
              {t.category} · {t.published ? "Published" : "Draft"}{t.featured ? " · Featured" : ""}
            </p>
            <div className="mt-3 flex gap-2">
              <button onClick={() => setEditing({ ...EMPTY, ...t })} className="p-2 rounded-xl bg-white/10 text-white" aria-label="Edit">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => remove(t)} className="p-2 rounded-xl bg-[#C8102E]/80 text-white" aria-label="Delete">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </Card>
        ))}
        {tips.length === 0 && <p className="text-white/50">No tips yet.</p>}
      </div>
    </div>
  );
}
