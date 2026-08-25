import React from "react";
import { Link } from "react-router-dom";
import { Clock, Calendar } from "lucide-react";
import { Image } from "@/components/ui/image";
import { format } from "date-fns";

export default function TipCard({ tip }) {
  return (
    <Link
      to={`/tips/${tip.slug || tip.id}`}
      className="group flex flex-col h-full overflow-hidden rounded-3xl bg-white border border-[#0A2948]/8 hover:border-[#2D8CCB]/40 hover:-translate-y-1.5 hover:shadow-[0_25px_60px_-30px_rgba(10,41,72,0.4)] transition-all duration-300"
    >
      <div className="relative h-48 overflow-hidden bg-[#F2F8FC]">
        {tip.cover_image ? (
          <Image
            src={tip.cover_image}
            alt={tip.title}
            className="w-full h-full transition-transform duration-700 group-hover:scale-105"
            fittingType="fill"
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-[#0A2948]/25 text-sm">Tiaan's Tips</div>
        )}
        <span className="absolute top-4 left-4 text-[10px] font-bold tracking-[0.18em] px-3 py-1.5 rounded-full bg-white/90 text-[#174A7E]">
          {(tip.category || "Advice").toUpperCase()}
        </span>
      </div>
      <div className="flex flex-col flex-1 p-6">
        <h3 className="font-heading font-extrabold text-lg text-[#0A2948] tracking-tight leading-snug">{tip.title}</h3>
        {tip.excerpt && <p className="mt-3 flex-1 text-[#0A2948]/65 leading-relaxed line-clamp-3">{tip.excerpt}</p>}
        <div className="mt-5 flex items-center gap-4 text-xs font-semibold text-[#0A2948]/45">
          {tip.published_at && (
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> {format(new Date(tip.published_at), "d MMM yyyy")}
            </span>
          )}
          {tip.read_time && (
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> {tip.read_time}
            </span>
          )}
        </div>
        <span className="mt-5 text-sm font-bold text-[#174A7E] group-hover:text-[#2D8CCB]">Read more →</span>
      </div>
    </Link>
  );
}