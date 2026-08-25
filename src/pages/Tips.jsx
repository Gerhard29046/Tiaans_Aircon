import React from "react";
import { useQuery } from "@tanstack/react-query";
import { publicApi } from "@/api/public";
import PageHero from "@/components/site/PageHero";
import TipCard from "@/components/tips/TipCard";
import AskTiaanBox from "@/components/tips/AskTiaanBox";
import Reveal from "@/components/site/Reveal";

export default function Tips() {
  const { data: tips = [], isLoading } = useQuery({
    queryKey: ["tips", "published", 100],
    queryFn: () => publicApi.listTips({ limit: 100 }),
  });

  return (
    <>
      <PageHero
        eyebrow="ADVICE FROM TIAAN"
        title="Tiaan's Tips"
        sub="Simple advice to help you understand your aircon, look after it and know when it's time to call someone."
      />
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-80 rounded-3xl bg-[#F2F8FC] animate-pulse" />
              ))}
            </div>
          ) : tips.length === 0 ? (
            <p className="text-[#0A2948]/60">Tiaan's first tips are on the way.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {tips.map((t, i) => (
                <Reveal key={t.id} delay={(i % 3) * 0.07}>
                  <TipCard tip={t} />
                </Reveal>
              ))}
            </div>
          )}
          <AskTiaanBox />
        </div>
      </section>
    </>
  );
}
