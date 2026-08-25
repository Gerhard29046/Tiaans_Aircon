import React from "react";
import ServicesGrid from "@/components/home/ServicesGrid";
import TwoWorlds from "@/components/home/TwoWorlds";
import CtaBanner from "@/components/home/CtaBanner";
import PageHero from "@/components/site/PageHero";

export default function Services() {
  return (
    <>
      <PageHero
        eyebrow="OUR SERVICES • BELLVILLE"
        title="Aircon Services for Home, Business & Vehicle"
        sub="Installations, sales, repairs, servicing, car aircon regas and car aircon repairs across Bellville, the Northern Suburbs and Cape Town."
      />
      <ServicesGrid />
      <TwoWorlds />
      <CtaBanner />
    </>
  );
}