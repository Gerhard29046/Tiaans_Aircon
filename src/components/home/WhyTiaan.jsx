import React from "react";
import { Home, MapPin, PhoneCall, Images } from "lucide-react";
import AirflowBg from "@/components/brand/AirflowBg";
import Reveal from "@/components/site/Reveal";
import SectionHeading from "@/components/site/SectionHeading";

const PILLARS = [
  { Icon: Home, title: "Home, Business & Vehicle", text: "One business for multiple airconditioning needs." },
  { Icon: MapPin, title: "Local Service", text: "Based in Bellville and serving Cape Town and surrounding areas." },
  { Icon: PhoneCall, title: "Speak Directly to Tiaan", text: "Customers can call or WhatsApp Tiaan directly." },
  { Icon: Images, title: "See the Work", text: "Browse real completed installations, services and repairs." },
];

export default function WhyTiaan() {
  return (
    <section className="relative overflow-hidden bg-[#174A7E] py-20 sm:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(100%_80%_at_80%_0%,#2D8CCB33_0%,transparent_60%)]" />
      <AirflowBg opacity={0.4} />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading eyebrow="WHY TIAAN'S AIRCON" title="Straightforward Aircon Service." light />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map(({ Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 0.08}>
              <div className="h-full p-7 rounded-3xl bg-white/8 border border-white/12 backdrop-blur-sm hover:bg-white/12 transition-colors">
                <Icon className="w-7 h-7 text-[#6DD5F7]" />
                <h3 className="mt-5 font-heading font-bold text-lg text-white leading-snug">{title}</h3>
                <p className="mt-3 text-white/70 leading-relaxed">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}