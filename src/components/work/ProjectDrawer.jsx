import React from "react";
import { X, MapPin, Calendar, MessageCircle } from "lucide-react";
import { Image } from "@/components/ui/image";
import { format } from "date-fns";
import BeforeAfter from "@/components/work/BeforeAfter";
import { waLink } from "@/lib/brand";

export default function ProjectDrawer({ project, onClose }) {
  if (!project) return null;
  const gallery = [project.cover_image, ...(project.images || [])].filter(Boolean);

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <div className="absolute inset-0 bg-[#0A2948]/60 backdrop-blur-sm" onClick={onClose} />
      <aside className="relative w-full max-w-xl h-full overflow-y-auto bg-white shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="sticky top-0 flex items-center justify-between px-6 py-4 bg-white/90 backdrop-blur border-b border-[#0A2948]/10">
          <span className="text-[11px] font-bold tracking-[0.2em] text-[#2D8CCB]">
            {(project.category || "Other").toUpperCase()}
          </span>
          <button onClick={onClose} aria-label="Close project" className="p-2 text-[#0A2948]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 pb-32 pt-6">
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#0A2948] tracking-tight">
            {project.title}
          </h2>
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-[#0A2948]/55 font-semibold">
            {project.location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> {project.location}
              </span>
            )}
            {project.project_date && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-4 h-4" /> {format(new Date(project.project_date), "d MMM yyyy")}
              </span>
            )}
          </div>
          {project.description && (
            <p className="mt-5 text-[#0A2948]/70 leading-relaxed whitespace-pre-line">{project.description}</p>
          )}

          {project.show_before_after && project.before_image && project.after_image && (
            <div className="mt-8">
              <h3 className="font-heading font-bold text-sm tracking-[0.2em] text-[#0A2948]/50 mb-3">
                BEFORE &amp; AFTER
              </h3>
              <BeforeAfter before={project.before_image} after={project.after_image} alt={project.title} />
            </div>
          )}

          {gallery.length > 0 && (
            <div className="mt-8 grid grid-cols-2 gap-3">
              {gallery.map((src, i) => (
                <Image
                  key={i}
                  src={src}
                  alt={`${project.title} photo ${i + 1}`}
                  className="w-full h-36 rounded-2xl"
                  fittingType="fill"
                />
              ))}
            </div>
          )}

          <a
            href={waLink("general", `about a job like: ${project.title}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center gap-2 px-6 py-4 rounded-full bg-[#2D8CCB] text-white font-bold hover:bg-[#174A7E] transition-colors"
          >
            <MessageCircle className="w-5 h-5" /> Ask Tiaan about a job like this
          </a>
        </div>
      </aside>
    </div>
  );
}