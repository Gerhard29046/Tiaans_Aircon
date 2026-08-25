import React from "react";
import { Phone, MessageCircle } from "lucide-react";
import AirflowBg from "@/components/brand/AirflowBg";
import Reveal from "@/components/site/Reveal";
import { BRAND, waLink, telLink } from "@/lib/brand";

export default function CtaBanner() {
  return (
    <section className="relative overflow-hidden bg-[#0A2948] py-20 sm:py-28">
      <div className="absolute inset-0 bg-[linear-gradient(115deg,#0A2948_0%,#174A7E_55%,#2D8CCB_120%)]" />
      <AirflowBg opacity={0.6} />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <Reveal>
          <h2 className="font-heading font-extrabold text-white text-4xl sm:text-6xl tracking-[-0.03em] leading-[0.98]">
            Too Hot? Let's Fix That.
          </h2>
          <p className="mt-6 text-lg text-white/75">Home, office or car — get in touch with Tiaan's Aircon.</p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a
              href={waLink("general")}
              target="_blank"
              rel="noopener noreferrer"
              className="wa-pulse inline-flex items-center gap-2 px-7 py-4 rounded-full bg-white text-[#0A2948] font-bold hover:bg-[#6DD5F7] transition-colors"
            >
              <MessageCircle className="w-5 h-5" /> WhatsApp {BRAND.whatsapp}
            </a>
            <a
              href={telLink}
              className="inline-flex items-center gap-2 px-7 py-4 rounded-full border border-white/30 text-white font-semibold hover:bg-white/10 transition-colors"
            >
              <Phone className="w-5 h-5" /> Call {BRAND.cell}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}