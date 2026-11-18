"use client";

import { useState } from "react";
import BrandMarquee from "@/components/BrandMarquee";
import DishDrawer from "@/components/DishDrawer";
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
import type { Dish } from "@/lib/types";

export default function Home() {
  const openReserve = useUI((s) => s.openReserve);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);

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
        <ScrollCardStack onOpenDish={setSelectedDish} />
        <TerroirOriginSection onOpenDish={setSelectedDish} />
        <GallerySection />
        <BookingSection onReserve={openReserve} />
        <ExploreSection />
        <MenuPreviewBanner />
        <RiadDoorIntro />
        <DishDrawer dish={selectedDish} onClose={() => setSelectedDish(null)} />
      </main>
      <RevealFooter />
    </>
  );
}
