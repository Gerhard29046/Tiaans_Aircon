import React, { useState } from "react";
import { Camera, Loader2, X } from "lucide-react";
import { adminApi } from "@/api/admin";

export default function ImageUpload({ label, value, onChange, multiple = false }) {
  const [busy, setBusy] = useState(false);
  const list = multiple ? value || [] : value ? [value] : [];

  const handle = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setBusy(true);
    try {
      const media = [];
      for (const file of files) media.push(await adminApi.uploadImage(file));
      onChange(multiple ? [...(value || []), ...media] : media[0]);
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  };

  const remove = (item) => {
    onChange(multiple ? (value || []).filter((candidate) => candidate !== item) : null);
  };

  return (
    <div>
      <p className="text-sm font-semibold text-white/80 mb-2">{label}</p>
      <div className="flex flex-wrap gap-3">
        {list.map((item) => (
          <div key={item.id || item.url || item} className="relative w-24 h-24 rounded-2xl overflow-hidden bg-white/10">
            <img src={item.url || item} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => remove(item)}
              aria-label="Remove photo"
              className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        <label className="w-24 h-24 grid place-items-center rounded-2xl border border-dashed border-white/25 cursor-pointer hover:border-[#6DD5F7]">
          {busy ? (
            <Loader2 className="w-5 h-5 animate-spin text-[#6DD5F7]" />
          ) : (
            <Camera className="w-6 h-6 text-[#6DD5F7]" />
          )}
          <input type="file" accept="image/*" multiple={multiple} className="sr-only" onChange={handle} />
        </label>
      </div>
    </div>
  );
}
