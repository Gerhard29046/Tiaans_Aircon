import React from "react";
import { Check } from "lucide-react";
import { Image } from "@/components/ui/image";
import Reveal from "@/components/site/Reveal";
import { waLink } from "@/lib/brand";
import { IMG } from "@/lib/images";

const SIDES = [
  {
    kicker: "HOME & BUSINESS",
    img: IMG.home,
    alt: "Wall-mounted split unit aircon installed in a modern Bellville home",
    items: ["Installation", "Sales", "Repairs", "Servicing", "Fault finding", "Cooling & heating"],
    btn: "Get a Quote",
    wa: "installation",
    dark: false,
  },
  {
    kicker: "VEHICLE AIRCON",
    img: IMG.car,
    alt: "Car aircon being serviced with pressure gauges at Tiaan's Aircon workshop",
    items: ["Aircon servicing", "Regassing", "Diagnostics", "Repairs", "Fault finding"],
    btn: "Book Car Aircon",
    wa: "car",
    dark: true,
  },
];

export default function TwoWorlds() {
  return (
    <section className="py-20 sm:py-28 bg-[#F2F8FC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <Reveal>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#0A2948] tracking-[-0.02em] leading-[1.05]">
            Home Aircon or Car Aircon?
          </h2>
          <p className="mt-3 font-heading font-bold text-2xl sm:text-3xl text-[#2D8CCB]">Tiaan Does Both.</p>
        </Reveal>
      </div>

      <div className="mt-14 max-w-7xl mx-auto px-4 sm:px-6 grid gap-6 lg:grid-cols-2">
        {SIDES.map((s, i) => (
          <Reveal key={s.kicker} delay={i * 0.1}>
            <article
              className={`group relative h-full overflow-hidden rounded-[2rem] ${
                s.dark ? "bg-[#0A2948]" : "bg-white"
              } border border-[#0A2948]/8`}
            >
              <div className="relative h-64 sm:h-80 overflow-hidden">
                <Image
                  src={s.img}
                  alt={s.alt}
                  className="w-full h-full transition-transform duration-700 group-hover:scale-105"
                  fittingType="fill"
                />
                <div
                  className={`absolute inset-0 ${
                    s.dark
                      ? "bg-gradient-to-t from-[#0A2948] via-[#0A2948]/40 to-transparent"
                      : "bg-gradient-to-t from-white via-white/20 to-transparent"
                  }`}
                />
              </div>
              <div className="relative p-7 sm:p-9 -mt-10">
                <h3
                  className={`font-heading font-extrabold text-sm tracking-[0.24em] ${
                    s.dark ? "text-[#6DD5F7]" : "text-[#2D8CCB]"
                  }`}
                >
                  {s.kicker}
                </h3>
                <ul className="mt-6 grid grid-cols-2 gap-y-3 gap-x-4">
                  {s.items.map((it) => (
                    <li
                      key={it}
                      className={`flex items-center gap-2 text-sm font-medium ${
                        s.dark ? "text-white/80" : "text-[#0A2948]/75"
                      }`}
                    >
                      <Check className="w-4 h-4 text-[#2D8CCB] shrink-0" /> {it}
                    </li>
                  ))}
                </ul>
                <a
                  href={waLink(s.wa)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-8 inline-flex px-6 py-3.5 rounded-full font-bold transition-colors ${
                    s.dark
                      ? "bg-[#2D8CCB] text-white hover:bg-[#6DD5F7] hover:text-[#0A2948]"
                      : "bg-[#0A2948] text-white hover:bg-[#174A7E]"
                  }`}
                >
                  {s.btn}
                </a>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}