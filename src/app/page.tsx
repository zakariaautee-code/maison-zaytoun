"use client";

import BrandMarquee from "@/components/BrandMarquee";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import MenuPreviewBanner from "@/components/MenuPreviewBanner";
import {
  BookingSection,
  ExploreSection,
  GallerySection,
  ImmersionSection,
  SpacesSection,
  StorySection,
} from "@/components/EditorialSections";
import RevealFooter from "@/components/RevealFooter";
import RiadDoorIntro from "@/components/RiadDoorIntro";
import ScrollCardStack from "@/components/ScrollCardStack";
import SpecialBanner from "@/components/SpecialBanner";
import TerroirOriginSection from "@/components/TerroirOriginSection";
import { useUI } from "@/lib/store";

export default function Home() {
  const openReserve = useUI((s) => s.openReserve);

  return (
    <>
      <main className="relative z-10 min-h-screen bg-espresso">
        <Header />
        <SpecialBanner />
        <Hero />
        <BrandMarquee />
        <ImmersionSection />
        <StorySection />
        <SpacesSection />
        <ScrollCardStack />
        <TerroirOriginSection />
        <GallerySection />
        <BookingSection onReserve={openReserve} />
        <ExploreSection />
        <MenuPreviewBanner />
        <RiadDoorIntro />
      </main>
      <RevealFooter />
    </>
  );
}
