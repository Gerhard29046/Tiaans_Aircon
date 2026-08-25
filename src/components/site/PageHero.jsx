import React from "react";
import { motion } from "framer-motion";
import AirflowBg from "@/components/brand/AirflowBg";

export default function PageHero({ eyebrow, title, sub }) {
  return (
    <section className="relative overflow-hidden bg-[#0A2948] py-16 sm:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(110%_90%_at_15%_0%,#174A7E_0%,#0A2948_60%,#071c31_100%)]" />
      <AirflowBg opacity={0.55} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-w-7xl mx-auto px-4 sm:px-6"
      >
        {eyebrow && <p className="text-[11px] font-bold tracking-[0.3em] text-[#6DD5F7]">{eyebrow}</p>}
        <h1 className="mt-5 max-w-3xl font-heading font-extrabold text-white tracking-[-0.03em] text-4xl sm:text-5xl lg:text-6xl leading-[1]">
          {title}
        </h1>
        {sub && <p className="mt-6 max-w-2xl text-white/70 text-lg leading-relaxed">{sub}</p>}
      </motion.div>
    </section>
  );
}