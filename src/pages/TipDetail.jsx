import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Clock, Calendar, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { publicApi } from "@/api/public";
import { Image } from "@/components/ui/image";
import AskTiaanBox from "@/components/tips/AskTiaanBox";

export default function TipDetail() {
  const { slug } = useParams();
  const { data: tips, isLoading } = useQuery({
    queryKey: ["tips", "all"],
    queryFn: () => publicApi.listTips({ limit: 100 }),
  });

  if (isLoading) {
    return <div className="max-w-3xl mx-auto px-4 py-28 text-[#0A2948]/50">Loading…</div>;
  }

  const tip = (tips || []).find((t) => t.slug === slug || t.id === slug);

  if (!tip) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-28">
        <h1 className="font-heading font-extrabold text-3xl text-[#0A2948]">Tip not found</h1>
        <Link to="/tips" className="mt-6 inline-flex text-[#174A7E] font-bold">← Back to Tiaan's Tips</Link>
      </div>
    );
  }

  return (
    <article className="bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 pb-24">
        <Link to="/tips" className="inline-flex items-center gap-2 text-sm font-semibold text-[#174A7E] hover:text-[#2D8CCB]">
          <ArrowLeft className="w-4 h-4" /> Tiaan's Tips
        </Link>
        <p className="mt-8 text-xs font-bold tracking-[0.28em] text-[#2D8CCB]">
          {(tip.category || "ADVICE").toUpperCase()}
        </p>
        <h1 className="mt-4 font-heading font-extrabold text-3xl sm:text-5xl text-[#0A2948] tracking-[-0.02em] leading-[1.05]">
          {tip.title}
        </h1>
        <div className="mt-5 flex flex-wrap gap-5 text-sm font-semibold text-[#0A2948]/45">
          {tip.published_at && (
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> {format(new Date(tip.published_at), "d MMMM yyyy")}
            </span>
          )}
          {tip.read_time && (
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> {tip.read_time}
            </span>
          )}
        </div>

        {tip.cover_image && (
          <Image
            src={tip.cover_image}
            alt={tip.title}
            className="mt-10 w-full h-64 sm:h-96 rounded-[2rem]"
            fittingType="fill"
          />
        )}

        {tip.excerpt && <p className="mt-10 text-xl text-[#0A2948]/75 leading-relaxed">{tip.excerpt}</p>}

        <div className="mt-8 space-y-5 text-[#0A2948]/80 text-lg leading-relaxed">
          {(tip.content || "").split(/\n\s*\n/).map((p, i) => (
            <p key={i} className="whitespace-pre-line">{p}</p>
          ))}
        </div>

        <AskTiaanBox topic={tip.title} />
      </div>
    </article>
  );
}
