import React from "react";
import { Phone, MessageCircle } from "lucide-react";
import { waLink, telLink } from "@/lib/brand";

export default function FloatingActions() {
  return (
    <>
      <a
        href={waLink("general")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp Tiaan"
        className="wa-pulse hidden sm:flex fixed bottom-6 right-6 z-40 items-center justify-center w-14 h-14 rounded-full bg-[#2D8CCB] text-white shadow-lg hover:bg-[#174A7E] transition-colors"
      >
        <MessageCircle className="w-6 h-6" />
      </a>

      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 flex gap-2 p-3 bg-white/90 backdrop-blur-xl border-t border-[#0A2948]/10">
        <a
          href={telLink}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#0A2948] text-white font-bold text-sm"
        >
          <Phone className="w-4 h-4" /> Call Tiaan
        </a>
        <a
          href={waLink("general")}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-[1.4] flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#2D8CCB] text-white font-bold text-sm"
        >
          <MessageCircle className="w-4 h-4" /> WhatsApp
        </a>
      </div>
    </>
  );
}