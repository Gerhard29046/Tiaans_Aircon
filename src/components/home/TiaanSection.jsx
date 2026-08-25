import React from "react";
import { Phone, MessageCircle } from "lucide-react";
import { Image } from "@/components/ui/image";
import Reveal from "@/components/site/Reveal";
import { waLink, telLink } from "@/lib/brand";
import { IMG } from "@/lib/images";

export default function TiaanSection() {
  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid gap-12 lg:grid-cols-[0.85fr_1.15fr] items-center">
        <Reveal>
          <div className="relative">
            <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-[#6DD5F7]/30 to-[#174A7E]/10 blur-xl" />
            <Image
              src={IMG.portrait}
              alt="Tiaan Grimbacher, owner of Tiaan's Aircon in Bellville"
              className="relative w-full h-[380px] sm:h-[460px] rounded-[2rem]"
              fittingType="fill"
              focalPointY={0.35}
            />
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-xs font-bold tracking-[0.28em] text-[#2D8CCB]">THE PERSON BEHIND THE WORK</p>
          <h2 className="mt-4 font-heading font-extrabold text-3xl sm:text-5xl text-[#0A2948] tracking-[-0.02em]">
            Speak to Tiaan.
          </h2>
          <p className="mt-6 text-lg text-[#0A2948]/70 leading-relaxed max-w-xl">
            Have an aircon problem and aren't sure what you need? Give Tiaan a call or send him a WhatsApp. Tell him
            what's happening and he'll help you work out the next step.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={waLink("general")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-[#2D8CCB] text-white font-bold hover:bg-[#174A7E] transition-colors"
            >
              <MessageCircle className="w-5 h-5" /> WhatsApp Tiaan
            </a>
            <a
              href={telLink}
              className="inline-flex items-center gap-2 px-7 py-4 rounded-full border border-[#0A2948]/15 text-[#0A2948] font-semibold hover:border-[#2D8CCB] transition-colors"
            >
              <Phone className="w-5 h-5" /> Call Tiaan
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}