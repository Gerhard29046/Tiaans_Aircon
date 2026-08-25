import React, { useRef, useState } from "react";
import { Image } from "@/components/ui/image";

export default function BeforeAfter({ before, after, alt = "Before and after aircon work" }) {
  const [pos, setPos] = useState(50);
  const ref = useRef(null);

  const move = (clientX) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPos(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)));
  };

  return (
    <div
      ref={ref}
      className="relative select-none overflow-hidden rounded-3xl bg-[#0A2948] touch-none"
      onMouseMove={(e) => e.buttons === 1 && move(e.clientX)}
      onMouseDown={(e) => move(e.clientX)}
      onTouchMove={(e) => move(e.touches[0].clientX)}
      onTouchStart={(e) => move(e.touches[0].clientX)}
    >
      <Image src={after} alt={`${alt} — after`} className="w-full h-64 sm:h-96" fittingType="fill" />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <Image src={before} alt={`${alt} — before`} className="w-full h-64 sm:h-96" fittingType="fill" />
      </div>

      <span className="absolute top-4 left-4 text-[10px] font-bold tracking-[0.2em] px-3 py-1.5 rounded-full bg-[#0A2948]/80 text-white">
        BEFORE
      </span>
      <span className="absolute top-4 right-4 text-[10px] font-bold tracking-[0.2em] px-3 py-1.5 rounded-full bg-[#2D8CCB] text-white">
        AFTER
      </span>

      <div className="absolute top-0 bottom-0 w-px bg-[#6DD5F7]" style={{ left: `${pos}%` }}>
        <span className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-white shadow-[0_0_20px_rgba(109,213,247,0.9)] flex items-center justify-center">
          <span className="text-[#174A7E] text-xs font-bold">⇄</span>
        </span>
      </div>

      <input
        type="range"
        min="0"
        max="100"
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label="Reveal before and after"
        className="absolute bottom-3 left-1/2 -translate-x-1/2 w-2/3 accent-[#2D8CCB] opacity-0 focus:opacity-100"
      />
    </div>
  );
}