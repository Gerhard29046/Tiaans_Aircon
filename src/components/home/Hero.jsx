import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Phone, MessageCircle, Wrench, Hammer, Fan, Car, Thermometer } from "lucide-react";
import { Image } from "@/components/ui/image";
import AirflowBg from "@/components/brand/AirflowBg";
import { BRAND, waLink, telLink } from "@/lib/brand";
import { IMG } from "@/lib/images";

const INDICATORS = [
  { label: "Installations", Icon: Wrench },
  { label: "Repairs", Icon: Hammer },
  { label: "Servicing", Icon: Fan },
  { label: "Car Aircon", Icon: Car },
  { label: "Cooling & Heating", Icon: Thermometer },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#0A2948]">
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_10%_0%,#174A7E_0%,#0A2948_55%,#071c31_100%)]" />
      <AirflowBg opacity={0.7} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-14 lg:pt-24 lg:pb-24 grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-[11px] sm:text-xs font-bold tracking-[0.3em] text-[#6DD5F7]">
            TIAAN'S AIRCON • BELLVILLE
          </p>
          <h1 className="mt-5 font-heading font-extrabold text-white tracking-[-0.03em] text-[2.75rem] leading-[0.95] sm:text-6xl lg:text-7xl">
            COOLING<br />DONE RIGHT.
          </h1>
          <p className="mt-6 font-heading font-bold text-lg sm:text-2xl text-[#6DD5F7] tracking-tight">
            Aircon Installations, Repairs, Servicing &amp; Car Aircon
          </p>
          <p className="mt-5 max-w-xl text-white/70 text-base sm:text-lg leading-relaxed">
            Professional airconditioning solutions for your home, business and vehicle. Based in Bellville and serving
            Cape Town and surrounding areas.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href={waLink("general")}
              target="_blank"
              rel="noopener noreferrer"
              className="wa-pulse inline-flex items-center gap-2 px-7 py-4 rounded-full bg-[#2D8CCB] text-white font-bold hover:bg-[#6DD5F7] hover:text-[#0A2948] transition-colors"
            >
              <MessageCircle className="w-5 h-5" /> WhatsApp Tiaan
            </a>
            <a
              href={telLink}
              className="inline-flex items-center gap-2 px-7 py-4 rounded-full border border-white/25 text-white font-semibold hover:bg-white/10 transition-colors"
            >
              <Phone className="w-5 h-5" /> Call {BRAND.cell}
            </a>
            <Link to="/services" className="px-2 py-4 text-sm font-semibold text-[#6DD5F7] hover:text-white transition-colors">
              Explore Our Services →
            </Link>
          </div>

          <ul className="mt-12 flex flex-wrap gap-x-7 gap-y-4">
            {INDICATORS.map(({ label, Icon }) => (
              <li key={label} className="flex items-center gap-2 text-sm text-white/75">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10">
                  <Icon className="w-4 h-4 text-[#6DD5F7]" />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="relative rounded-[2rem] overflow-hidden ring-1 ring-white/15 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">
            <Image
              src={IMG.hero}
              alt="Car airconditioning service machine connected to a vehicle"
              className="w-full h-[260px] sm:h-[360px] lg:h-[420px]"
              fittingType="fill"
              focalPointX={0.5}
              focalPointY={0.5}
              loading="eager"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A2948]/70 via-transparent to-transparent" />
          </div>
          <div className="absolute -bottom-5 left-4 right-4 sm:left-8 sm:right-8 flex items-center gap-3 px-5 py-4 rounded-2xl bg-white/95 backdrop-blur-xl shadow-xl">
            <span className="relative flex w-2.5 h-2.5">
              <span className="absolute inline-flex w-full h-full rounded-full bg-[#2D8CCB] opacity-60 animate-ping" />
              <span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-[#2D8CCB]" />
            </span>
            <p className="text-sm font-semibold text-[#0A2948]">Taking new bookings in Bellville &amp; surrounds</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
