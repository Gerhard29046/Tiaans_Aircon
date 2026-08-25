import React from "react";
import { Wrench, ShoppingBag, Hammer, Fan, Snowflake, Car } from "lucide-react";
import Reveal from "@/components/site/Reveal";
import SectionHeading from "@/components/site/SectionHeading";
import { SERVICES } from "@/lib/services";
import { waLink } from "@/lib/brand";

const ICONS = { Wrench, ShoppingBag, Hammer, Fan, Snowflake, Car };

export default function ServicesGrid() {
  return (
    <section id="services" className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          eyebrow="WHAT WE DO"
          title="One Call. All Your Aircon Needs."
          sub="From installing a new aircon at home to getting your car blowing cold again, Tiaan provides practical airconditioning solutions across Bellville and Cape Town."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => {
            const Icon = ICONS[s.icon];
            const dark = s.highlight;
            return (
              <Reveal key={s.slug} delay={(i % 3) * 0.08}>
                <article
                  className={`group h-full flex flex-col p-7 rounded-3xl border transition-all duration-300 hover:-translate-y-1.5 ${
                    dark
                      ? "bg-[#0A2948] border-[#2D8CCB]/40 text-white hover:shadow-[0_25px_60px_-25px_rgba(45,140,203,0.6)]"
                      : "bg-white border-[#0A2948]/8 hover:border-[#2D8CCB]/40 hover:shadow-[0_25px_60px_-30px_rgba(10,41,72,0.35)]"
                  }`}
                >
                  <span
                    className={`flex items-center justify-center w-14 h-14 rounded-2xl ${
                      dark ? "bg-[#2D8CCB]/20 text-[#6DD5F7]" : "bg-[#F2F8FC] text-[#2D8CCB]"
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </span>
                  {dark && (
                    <span className="mt-5 self-start text-[10px] font-bold tracking-[0.2em] px-2.5 py-1 rounded-full bg-[#C8102E] text-white">
                      MOST ASKED FOR
                    </span>
                  )}
                  <h3
                    className={`mt-5 font-heading font-extrabold text-xl tracking-tight ${
                      dark ? "text-white" : "text-[#0A2948]"
                    }`}
                  >
                    {s.title}
                  </h3>
                  <p className={`mt-3 flex-1 leading-relaxed ${dark ? "text-white/70" : "text-[#0A2948]/65"}`}>
                    {s.desc}
                  </p>
                  <a
                    href={waLink(s.wa)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-6 inline-flex text-sm font-bold ${
                      dark ? "text-[#6DD5F7] hover:text-white" : "text-[#174A7E] hover:text-[#2D8CCB]"
                    }`}
                  >
                    {s.cta}
                  </a>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}