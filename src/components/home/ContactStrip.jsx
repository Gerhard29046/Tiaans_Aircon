import React from "react";
import { Phone, MessageCircle, MapPin, ArrowUpRight } from "lucide-react";
import Reveal from "@/components/site/Reveal";
import { BRAND, waLink, telLink, directionsLink } from "@/lib/brand";

export default function ContactStrip() {
  const items = [
    { label: "Call", value: BRAND.cell, href: telLink, Icon: Phone, external: false },
    { label: "WhatsApp", value: BRAND.whatsapp, href: waLink("general"), Icon: MessageCircle, external: true },
    { label: "Workshop", value: BRAND.address, href: directionsLink, Icon: MapPin, external: true },
  ];

  return (
    <section className="bg-[#F2F8FC] py-14 sm:py-20 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Reveal>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#0A2948] tracking-tight">
            Need your aircon sorted?
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {items.map(({ label, value, href, Icon, external }, i) => (
            <Reveal key={label} delay={i * 0.08}>
              <a
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group h-full flex items-start gap-4 p-6 rounded-3xl bg-white border border-[#0A2948]/8 hover:border-[#2D8CCB]/50 hover:-translate-y-1 hover:shadow-[0_20px_45px_-25px_rgba(10,41,72,0.35)] transition-all duration-300"
              >
                <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#F2F8FC] text-[#2D8CCB] group-hover:bg-[#2D8CCB] group-hover:text-white transition-colors">
                  <Icon className="w-5 h-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-bold tracking-[0.2em] text-[#0A2948]/45">{label.toUpperCase()}</span>
                  <span className="block mt-1 font-heading font-bold text-lg text-[#0A2948] leading-snug">{value}</span>
                </span>
              </a>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2}>
          <a
            href={directionsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#174A7E] hover:text-[#2D8CCB]"
          >
            Get Directions <ArrowUpRight className="w-4 h-4" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}