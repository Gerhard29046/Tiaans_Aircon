import React from "react";
import { Image } from "@/components/ui/image";
import PageHero from "@/components/site/PageHero";
import TiaanSection from "@/components/home/TiaanSection";
import WhyTiaan from "@/components/home/WhyTiaan";
import CtaBanner from "@/components/home/CtaBanner";
import Reveal from "@/components/site/Reveal";
import { BRAND } from "@/lib/brand";
import { IMG } from "@/lib/images";

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="ABOUT TIAAN'S AIRCON"
        title="A Local Aircon Specialist in Bellville."
        sub="Tiaan's Aircon is run by Tiaan Grimbacher from the workshop at 32 Old Paarl Road, Bellville — serving homes, businesses and vehicle owners across Cape Town and surrounding areas."
      />

      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid gap-12 lg:grid-cols-2 items-center">
          <Reveal>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#0A2948] tracking-[-0.02em]">
              Cooling, heating and vehicle aircon — under one name.
            </h2>
            <div className="mt-6 space-y-5 text-lg text-[#0A2948]/70 leading-relaxed">
              <p>
                Tiaan's Aircon specialises in airconditioning service, sales, repairs and installations, along with car
                aircon servicing, repairs and regassing.
              </p>
              <p>
                Whether it's a new split unit for a bedroom, an office system that needs a proper service, or a vehicle
                that stopped blowing cold, the approach is the same: find the actual cause of the problem and fix it
                properly.
              </p>
              <p>
                You deal with Tiaan directly — call or WhatsApp, describe what's happening, and get a straight answer on
                the next step.
              </p>
            </div>
            <div className="mt-8 p-6 rounded-3xl bg-[#F2F8FC] border border-[#0A2948]/8">
              <p className="text-xs font-bold tracking-[0.24em] text-[#2D8CCB]">WORKSHOP</p>
              <p className="mt-2 font-heading font-bold text-[#0A2948]">{BRAND.address}</p>
              <p className="mt-1 text-[#0A2948]/60 text-sm">{BRAND.area}</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <Image
              src={IMG.tools}
              alt="Organised aircon service tools at Tiaan's Aircon workshop in Bellville"
              className="w-full h-[340px] sm:h-[440px] rounded-[2rem]"
              fittingType="fill"
            />
          </Reveal>
        </div>
      </section>

      <TiaanSection />
      <WhyTiaan />
      <CtaBanner />
    </>
  );
}