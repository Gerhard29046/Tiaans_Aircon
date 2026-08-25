import React from "react";
import { MessageCircle } from "lucide-react";
import { waLink } from "@/lib/brand";

export default function AskTiaanBox({ topic }) {
  return (
    <div className="mt-14 p-8 sm:p-10 rounded-[2rem] bg-[#0A2948] text-white">
      <h2 className="font-heading font-extrabold text-2xl sm:text-3xl tracking-tight">Not sure what's wrong?</h2>
      <p className="mt-4 text-white/70 leading-relaxed">
        Send Tiaan a WhatsApp and tell him what's happening.
      </p>
      <a
        href={waLink("general", topic ? `reading: ${topic}` : undefined)}
        target="_blank"
        rel="noopener noreferrer"
        className="wa-pulse mt-7 inline-flex items-center gap-2 px-7 py-4 rounded-full bg-[#2D8CCB] font-bold hover:bg-[#6DD5F7] hover:text-[#0A2948] transition-colors"
      >
        <MessageCircle className="w-5 h-5" /> Ask Tiaan on WhatsApp
      </a>
    </div>
  );
}