import React from "react";
import Reveal from "@/components/site/Reveal";

/** @param {{eyebrow?: React.ReactNode, title: React.ReactNode, sub?: React.ReactNode, light?: boolean, center?: boolean, children?: React.ReactNode}} props */
export default function SectionHeading({ eyebrow, title, sub, light = false, center = false, children }) {
  return (
    <Reveal className={`${center ? "text-center mx-auto" : ""} max-w-3xl`}>
      {eyebrow && (
        <p className={`text-xs font-bold tracking-[0.28em] mb-4 ${light ? "text-[#6DD5F7]" : "text-[#2D8CCB]"}`}>
          {eyebrow}
        </p>
      )}
      <h2
        className={`font-heading font-extrabold tracking-[-0.02em] text-3xl sm:text-4xl lg:text-5xl leading-[1.05] ${
          light ? "text-white" : "text-[#0A2948]"
        }`}
      >
        {title}
      </h2>
      {sub && (
        <p className={`mt-5 text-lg leading-relaxed ${light ? "text-white/70" : "text-[#0A2948]/65"}`}>{sub}</p>
      )}
      {children}
    </Reveal>
  );
}
