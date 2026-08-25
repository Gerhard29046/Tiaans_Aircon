import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, MessageCircle } from "lucide-react";
import Logo from "@/components/brand/logo";
import { waLink, telLink } from "@/lib/brand";

const NAV = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Our Work", to: "/our-work" },
  { label: "Tiaan's Tips", to: "/tips" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/85 backdrop-blur-xl shadow-[0_4px_30px_rgba(10,41,72,0.08)]" : "bg-white/60 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-20">
        <Link to="/" aria-label="Tiaan's Aircon home">
          <Logo />
        </Link>

        <nav className="hidden lg:flex items-center gap-7" aria-label="Main">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className={`text-sm font-semibold tracking-tight transition-colors ${
                pathname === n.to ? "text-[#174A7E]" : "text-[#0A2948]/70 hover:text-[#174A7E]"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden sm:flex items-center gap-3">
          <a
            href={telLink}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0A2948] px-4 py-2.5 rounded-full border border-[#0A2948]/15 hover:border-[#2D8CCB] hover:text-[#174A7E] transition-colors"
          >
            <Phone className="w-4 h-4" /> Call Tiaan
          </a>
          <a
            href={waLink("general")}
            target="_blank"
            rel="noopener noreferrer"
            className="wa-pulse inline-flex items-center gap-2 text-sm font-bold text-white px-5 py-2.5 rounded-full bg-[#2D8CCB] hover:bg-[#174A7E] transition-colors"
          >
            <MessageCircle className="w-4 h-4" /> WhatsApp Tiaan
          </a>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden p-2 -mr-2 text-[#0A2948]"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-[#0A2948]/10 bg-white px-4 py-4 space-y-1">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="block px-3 py-3 rounded-xl text-base font-semibold text-[#0A2948] hover:bg-[#F2F8FC]"
            >
              {n.label}
            </Link>
          ))}
          <a
            href={waLink("general")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center gap-2 px-3 py-3.5 rounded-xl bg-[#2D8CCB] text-white font-bold"
          >
            <MessageCircle className="w-5 h-5" /> WhatsApp Tiaan
          </a>
        </div>
      )}
    </header>
  );
}
