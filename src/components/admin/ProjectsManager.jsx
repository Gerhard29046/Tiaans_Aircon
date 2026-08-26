import React, { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { adminApi } from "@/api/admin";
import ImageUpload from "@/components/admin/ImageUpload";
import { Field, fieldCls, Toggle, AdminButton, Card } from "@/components/admin/ui";

const CATEGORIES = ["Installation", "Repair", "Service", "Car Aircon", "Other"];
const EMPTY = {
  title: "",
  description: "",
  category: "Installation",
  location: "Bellville",
  project_date: "",
  cover_image: null,
  images: [],
  before_image: null,
  after_image: null,
  show_before_after: false,
  featured: false,
  published: true,
};

export default function ProjectsManager({ projects, reload }) {
  const [editing, setEditing] = useState(null);

  const save = async (e) => {
    e.preventDefault();
    const { id, cover_image, images, before_image, after_image, ...data } = editing;
    const payload = {
      ...data,
      cover_media_id: cover_image?.id || null,
      image_ids: (images || []).map((item) => item.id).filter(Boolean),
      before_media_id: before_image?.id || null,
      after_media_id: after_image?.id || null,
    };
    if (id) await adminApi.projects.update(id, payload);
    else await adminApi.projects.create(payload);
    setEditing(null);
    reload();
  };

  const remove = async (p) => {
    if (!window.confirm(`Delete "${p.title}"?`)) return;
    await adminApi.projects.remove(p.id);
    reload();
  };

  if (editing) {
    return (
      <form onSubmit={save} className="space-y-5 max-w-2xl">
        <h2 className="font-heading font-extrabold text-2xl text-white">
          {editing.id ? "Edit project" : "New project"}
        </h2>
        <Field label="Project title">
          <input required className={fieldCls} value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
        </Field>
        <Field label="Description">
          <textarea rows={4} className={fieldCls} value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Category">
            <select className={fieldCls} value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="text-black">{c}</option>
              ))}
            </select>
          </Field>
          <Field label="Area / location">
            <input className={fieldCls} value={editing.location || ""} onChange={(e) => setEditing({ ...editing, location: e.target.value })} />
          </Field>
        </div>
        <Field label="Completion date">
          <input type="date" className={fieldCls} value={editing.project_date || ""} onChange={(e) => setEditing({ ...editing, project_date: e.target.value })} />
        </Field>
        <ImageUpload label="Cover photo" value={editing.cover_image} onChange={(v) => setEditing({ ...editing, cover_image: v })} />
        <ImageUpload label="More photos" multiple value={editing.images} onChange={(v) => setEditing({ ...editing, images: v })} />
        <div className="grid gap-5 sm:grid-cols-2">
          <ImageUpload label="Before photo" value={editing.before_image} onChange={(v) => setEditing({ ...editing, before_image: v })} />
          <ImageUpload label="After photo" value={editing.after_image} onChange={(v) => setEditing({ ...editing, after_image: v })} />
        </div>
        <div className="flex flex-wrap gap-2">
          <Toggle label="Show Before & After" checked={!!editing.show_before_after} onChange={(v) => setEditing({ ...editing, show_before_after: v })} />
          <Toggle label="Featured" checked={!!editing.featured} onChange={(v) => setEditing({ ...editing, featured: v })} />
          <Toggle label="Published" checked={!!editing.published} onChange={(v) => setEditing({ ...editing, published: v })} />
        </div>
        <div className="flex gap-3 pt-2">
          <AdminButton type="submit">Save project</AdminButton>
          <AdminButton variant="ghost" onClick={() => setEditing(null)}>Cancel</AdminButton>
        </div>
      </form>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <h2 className="font-heading font-extrabold text-2xl text-white">Our Work</h2>
        <AdminButton onClick={() => setEditing({ ...EMPTY })}>
          <span className="inline-flex items-center gap-2"><Plus className="w-4 h-4" /> Add project</span>
        </AdminButton>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {projects.map((p) => (
          <Card key={p.id} className="flex gap-4">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white/10 shrink-0">
              {p.cover_image && <img src={p.cover_image} alt="" className="w-full h-full object-cover" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-heading font-bold text-white truncate">{p.title}</p>
              <p className="text-xs text-white/50 mt-1">
                {p.category} · {p.location} · {p.published ? "Published" : "Draft"}{p.featured ? " · Featured" : ""}
              </p>
              <div className="mt-3 flex gap-2">
                <button onClick={() => setEditing({
                  ...EMPTY,
                  ...p,
                  cover_image: p.cover_media_id ? { id: p.cover_media_id, url: p.cover_image } : null,
                  images: (p.image_ids || []).map((id, index) => ({ id, url: p.images?.[index] || "" })),
                  before_image: p.before_media_id ? { id: p.before_media_id, url: p.before_image } : null,
                  after_image: p.after_media_id ? { id: p.after_media_id, url: p.after_image } : null,
                })} className="p-2 rounded-xl bg-white/10 text-white" aria-label="Edit">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => remove(p)} className="p-2 rounded-xl bg-[#C8102E]/80 text-white" aria-label="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}
        {projects.length === 0 && <p className="text-white/50">No projects yet — add your first job.</p>}
      </div>
    </div>
  );
}
