import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { publicApi } from "@/api/public";
import Hero from "@/components/home/Hero";
import ContactStrip from "@/components/home/ContactStrip";
import ServicesGrid from "@/components/home/ServicesGrid";
import TwoWorlds from "@/components/home/TwoWorlds";
import WhyTiaan from "@/components/home/WhyTiaan";
import TiaanSection from "@/components/home/TiaanSection";
import CtaBanner from "@/components/home/CtaBanner";
import Reviews from "@/components/home/Reviews";
import SectionHeading from "@/components/site/SectionHeading";
import WorkGallery from "@/components/work/WorkGallery";
import TipCard from "@/components/tips/TipCard";
import Reveal from "@/components/site/Reveal";

export default function Home() {
  const { data: projects = [] } = useQuery({
    queryKey: ["projects", "published", 50],
    queryFn: () => publicApi.listProjects({ limit: 50 }),
  });
  const { data: tips = [] } = useQuery({
    queryKey: ["tips", "published", 20],
    queryFn: () => publicApi.listTips({ limit: 20 }),
  });
  const { data: reviews = [] } = useQuery({
    queryKey: ["reviews", "published"],
    queryFn: () => publicApi.listReviews({ limit: 12 }),
  });

  const featured = [...projects].sort((a, b) => Number(b.featured) - Number(a.featured)).slice(0, 3);
  const homeTips = [...tips].sort((a, b) => Number(b.featured) - Number(a.featured)).slice(0, 3);

  return (
    <>
      <Hero />
      <ContactStrip />
      <ServicesGrid />
      <TwoWorlds />
      <WhyTiaan />

      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeading
            eyebrow="RECENT PROJECTS"
            title="See Tiaan's Work."
            sub="Real installations, repairs and aircon jobs completed for customers around Bellville and Cape Town."
          />
          <WorkGallery projects={featured} limit={3} />
          <Reveal delay={0.15}>
            <Link
              to="/our-work"
              className="mt-10 inline-flex px-7 py-4 rounded-full bg-[#0A2948] text-white font-bold hover:bg-[#174A7E] transition-colors"
            >
              See all of Tiaan's work
            </Link>
          </Reveal>
        </div>
      </section>

      <TiaanSection />

      {homeTips.length > 0 && (
        <section className="py-20 sm:py-28 bg-[#F2F8FC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <SectionHeading
              eyebrow="ADVICE FROM TIAAN"
              title="Tiaan's Tips"
              sub="Simple advice to help you understand your aircon, look after it and know when it's time to call someone."
            />
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {homeTips.map((t, i) => (
                <Reveal key={t.id} delay={(i % 3) * 0.07}>
                  <TipCard tip={t} />
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.2}>
              <Link to="/tips" className="mt-10 inline-flex text-sm font-bold text-[#174A7E] hover:text-[#2D8CCB]">
                Read all of Tiaan's Tips →
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      <Reviews reviews={reviews} />
      <CtaBanner />
    </>
  );
}
