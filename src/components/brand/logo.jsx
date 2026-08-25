import React from "react";

export default function Logo({ light = false, className = "" }) {
  const main = light ? "text-white" : "text-[#0A2948]";
  return (
    <div className={`flex flex-col items-start leading-none ${className}`}>
      <svg viewBox="0 0 120 18" className="w-24 h-3 mb-1" aria-hidden="true">
        <path d="M2 16 C 30 -2, 90 -2, 118 16" fill="none" stroke="#0A2948" strokeWidth="3" opacity={light ? 0.5 : 1} />
        <path d="M8 17 C 34 3, 86 3, 112 17" fill="none" stroke="#6DD5F7" strokeWidth="2.2" />
        <circle cx="60" cy="6" r="2.4" fill="#2D8CCB" />
      </svg>
      <span className={`font-heading font-extrabold tracking-tight text-lg sm:text-xl ${main}`}>TIAAN'S</span>
      <span className={`font-heading font-bold text-[10px] tracking-[0.28em] ${light ? "text-[#6DD5F7]" : "text-[#2D8CCB]"}`}>
        AIRCON
      </span>
    </div>
  );
}