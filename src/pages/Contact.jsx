import React from "react";
import { Phone, MessageCircle, Mail, MapPin, Navigation } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import ContactForm from "@/components/contact/ContactForm";
import Reveal from "@/components/site/Reveal";
import { BRAND, waLink, telLink, telLandline, directionsLink, mapEmbed } from "@/lib/brand";

export default function Contact() {
  return (
    <>
      <PageHero
        eyebrow="CONTACT TIAAN'S AIRCON"
        title="Let's Get Your Aircon Sorted."
        sub="Call, WhatsApp or send an enquiry — Tiaan will help you work out exactly what you need."
      />

      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <h2 className="font-heading font-extrabold text-2xl text-[#0A2948]">{BRAND.name}</h2>
            <p className="mt-1 font-semibold text-[#2D8CCB]">{BRAND.owner}</p>
            <address className="mt-5 not-italic text-[#0A2948]/70 leading-relaxed">
              {BRAND.addressLines.map((l) => (
                <span key={l} className="block">{l}</span>
              ))}
            </address>

            <div className="mt-8 space-y-4">
              <div className="p-5 rounded-3xl bg-[#F2F8FC]">
                <p className="text-xs font-bold tracking-[0.24em] text-[#0A2948]/45">CALL</p>
                <a href={telLandline} className="mt-2 block font-heading font-bold text-lg text-[#0A2948] hover:text-[#2D8CCB]">
                  {BRAND.tel}
                </a>
                <a href={telLink} className="mt-1 block font-heading font-bold text-lg text-[#0A2948] hover:text-[#2D8CCB]">
                  {BRAND.cell}
                </a>
              </div>
              <a
                href={waLink("general")}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-5 rounded-3xl bg-[#2D8CCB] text-white hover:bg-[#174A7E] transition-colors"
              >
                <p className="text-xs font-bold tracking-[0.24em] text-white/70">WHATSAPP</p>
                <p className="mt-2 font-heading font-bold text-lg inline-flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" /> {BRAND.whatsapp}
                </p>
              </a>
              <a href={`mailto:${BRAND.email}`} className="block p-5 rounded-3xl bg-[#F2F8FC] hover:bg-[#e2eef8] transition-colors">
                <p className="text-xs font-bold tracking-[0.24em] text-[#0A2948]/45">EMAIL</p>
                <p className="mt-2 font-heading font-bold text-[#0A2948] inline-flex items-center gap-2 break-all">
                  <Mail className="w-5 h-5 shrink-0" /> {BRAND.email}
                </p>
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href={telLink} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#0A2948] text-white font-bold">
                <Phone className="w-4 h-4" /> Call Tiaan
              </a>
              <a
                href={directionsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-[#0A2948]/15 text-[#0A2948] font-semibold hover:border-[#2D8CCB]"
              >
                <Navigation className="w-4 h-4" /> Get Directions
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="p-7 sm:p-9 rounded-[2rem] bg-[#F2F8FC] border border-[#0A2948]/8">
              <h2 className="font-heading font-extrabold text-2xl text-[#0A2948]">Send Tiaan an enquiry</h2>
              <p className="mt-2 text-[#0A2948]/60">Add a photo if it helps explain the problem.</p>
              <div className="mt-7">
                <ContactForm />
              </div>
            </div>
          </Reveal>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-16">
          <Reveal>
            <div className="flex items-center gap-2 mb-4 text-[#0A2948] font-semibold">
              <MapPin className="w-5 h-5 text-[#2D8CCB]" /> {BRAND.address}
            </div>
            <iframe
              title="Map of Tiaan's Aircon, 32 Old Paarl Road, Bellville"
              src={mapEmbed}
              loading="lazy"
              className="w-full h-80 sm:h-[420px] rounded-[2rem] border border-[#0A2948]/10"
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}