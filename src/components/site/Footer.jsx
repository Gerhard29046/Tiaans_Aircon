import React from "react";
import { Link } from "react-router-dom";
import { Phone, MessageCircle, Mail, MapPin } from "lucide-react";
import Logo from "@/components/brand/logo";
import AirflowBg from "@/components/brand/AirflowBg";
import { BRAND, waLink, telLink, telLandline } from "@/lib/brand";

const LINKS = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Our Work", to: "/our-work" },
  { label: "Tiaan's Tips", to: "/tips" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#0A2948] text-white pb-28 sm:pb-14 pt-16">
      <AirflowBg opacity={0.35} />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 grid gap-12 md:grid-cols-3">
        <div>
          <Logo light />
          <p className="mt-4 text-sm text-[#6DD5F7] tracking-wide">{BRAND.descriptor}</p>
          <p className="mt-6 text-sm text-white/60 max-w-xs">
            Airconditioning installations, sales, repairs, servicing and car aircon in Bellville, Cape Town.
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="font-heading font-bold text-sm tracking-[0.2em] text-white/50 mb-5">EXPLORE</h2>
          <ul className="space-y-3">
            {LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-white/85 hover:text-[#6DD5F7] transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-heading font-bold text-sm tracking-[0.2em] text-white/50 mb-5">GET IN TOUCH</h2>
          <ul className="space-y-3 text-white/85">
            <li>
              <a href={telLandline} className="inline-flex items-center gap-3 hover:text-[#6DD5F7]">
                <Phone className="w-4 h-4 text-[#6DD5F7]" /> {BRAND.tel}
              </a>
            </li>
            <li>
              <a href={telLink} className="inline-flex items-center gap-3 hover:text-[#6DD5F7]">
                <Phone className="w-4 h-4 text-[#6DD5F7]" /> {BRAND.cell}
              </a>
            </li>
            <li>
              <a href={waLink("general")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 hover:text-[#6DD5F7]">
                <MessageCircle className="w-4 h-4 text-[#6DD5F7]" /> WhatsApp: {BRAND.whatsapp}
              </a>
            </li>
            <li>
              <a href={`mailto:${BRAND.email}`} className="inline-flex items-center gap-3 hover:text-[#6DD5F7] break-all">
                <Mail className="w-4 h-4 text-[#6DD5F7] shrink-0" /> {BRAND.email}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#6DD5F7] mt-1 shrink-0" /> {BRAND.address}
            </li>
          </ul>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-3 text-sm text-white/50">
        <p>{BRAND.area}</p>
        <p>
          © {new Date().getFullYear()} {BRAND.name} · {BRAND.owner}
        </p>
      </div>
    </footer>
  );
}
