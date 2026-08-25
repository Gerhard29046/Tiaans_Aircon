import React from "react";
import { Star } from "lucide-react";
import { format } from "date-fns";
import Reveal from "@/components/site/Reveal";
import SectionHeading from "@/components/site/SectionHeading";

export default function Reviews({ reviews = [] }) {
  if (!reviews.length) return null;
  return (
    <section className="py-20 sm:py-28 bg-[#F2F8FC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading eyebrow="IN THEIR WORDS" title="What Customers Say" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r, i) => (
            <Reveal key={r.id} delay={(i % 3) * 0.07}>
              <figure className="h-full p-7 rounded-3xl bg-white border border-[#0A2948]/8">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${s < (r.rating || 5) ? "text-[#2D8CCB] fill-[#2D8CCB]" : "text-[#0A2948]/15"}`}
                    />
                  ))}
                </div>
                <blockquote className="mt-5 text-[#0A2948]/75 leading-relaxed">"{r.review}"</blockquote>
                <figcaption className="mt-5 text-sm font-bold text-[#0A2948]">
                  {r.customer_name}
                  <span className="block font-medium text-[#0A2948]/45">
                    {[r.service, r.review_date && format(new Date(r.review_date), "MMM yyyy")].filter(Boolean).join(" · ")}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}