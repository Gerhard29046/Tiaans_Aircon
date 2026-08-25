import React from "react";
import { MapPin, Calendar } from "lucide-react";
import { Image } from "@/components/ui/image";
import { format } from "date-fns";

export default function ProjectCard({ project, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group text-left w-full overflow-hidden rounded-3xl bg-white border border-[#0A2948]/8 hover:border-[#2D8CCB]/40 hover:-translate-y-1.5 hover:shadow-[0_25px_60px_-30px_rgba(10,41,72,0.4)] transition-all duration-300"
    >
      <div className="relative h-56 overflow-hidden bg-[#F2F8FC]">
        {project.cover_image ? (
          <Image
            src={project.cover_image}
            alt={`${project.title} — aircon work in ${project.location || "Cape Town"}`}
            className="w-full h-full transition-transform duration-700 group-hover:scale-105"
            fittingType="fill"
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-[#0A2948]/30 text-sm">No photo yet</div>
        )}
        <span className="absolute top-4 left-4 text-[10px] font-bold tracking-[0.18em] px-3 py-1.5 rounded-full bg-white/90 text-[#174A7E]">
          {(project.category || "Other").toUpperCase()}
        </span>
        {project.featured && (
          <span className="absolute top-4 right-4 text-[10px] font-bold tracking-[0.18em] px-3 py-1.5 rounded-full bg-[#C8102E] text-white">
            FEATURED
          </span>
        )}
      </div>
      <div className="p-6">
        <h3 className="font-heading font-extrabold text-lg text-[#0A2948] tracking-tight">{project.title}</h3>
        {project.description && (
          <p className="mt-2 text-[#0A2948]/65 leading-relaxed line-clamp-2">{project.description}</p>
        )}
        <div className="mt-4 flex flex-wrap gap-4 text-xs font-semibold text-[#0A2948]/50">
          {project.location && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> {project.location}
            </span>
          )}
          {project.project_date && (
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> {format(new Date(project.project_date), "MMM yyyy")}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}