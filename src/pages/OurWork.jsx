import React from "react";
import { useQuery } from "@tanstack/react-query";
import { publicApi } from "@/api/public";
import PageHero from "@/components/site/PageHero";
import WorkGallery from "@/components/work/WorkGallery";
import CtaBanner from "@/components/home/CtaBanner";

export default function OurWork() {
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects", "published", 100],
    queryFn: () => publicApi.listProjects({ limit: 100 }),
  });

  return (
    <>
      <PageHero
        eyebrow="RECENT PROJECTS"
        title="See Tiaan's Work."
        sub="Real installations, repairs and aircon jobs completed for customers around Bellville and Cape Town."
      />
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-80 rounded-3xl bg-[#F2F8FC] animate-pulse" />
              ))}
            </div>
          ) : (
            <WorkGallery projects={projects} />
          )}
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
