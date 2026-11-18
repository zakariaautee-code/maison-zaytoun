"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";
import { useI18n, type TranslationKey } from "@/lib/i18n";
import { getEffectivePrice, useAdmin } from "@/lib/store";
import { DISH_BY_ID } from "@/lib/menu-data";
import type { Dish } from "@/lib/types";

type Origin = {
  id: string;
  dishId: string;
  image: string;
  title: TranslationKey;
  place: TranslationKey;
  story: TranslationKey;
  coords: TranslationKey;
};

const ORIGINS: Origin[] = [
  {
    id: "taliouine",
    dishId: "tagine-lamb",
    image: "/dishes/tagine-lamb.jpg",
    title: "terroir.p1.title",
    place: "terroir.p1.place",
    story: "terroir.p1.story",
    coords: "terroir.p1.coords",
  },
  {
    id: "atlas",
    dishId: "brochette-lamb",
    image: "/dishes/brochette-lamb.jpg",
    title: "terroir.p2.title",
    place: "terroir.p2.place",
    story: "terroir.p2.story",
    coords: "terroir.p2.coords",
  },
  {
    id: "haouz",
    dishId: "zaalouk",
    image: "/dishes/zaalouk.jpg",
    title: "terroir.p3.title",
    place: "terroir.p3.place",
    story: "terroir.p3.story",
    coords: "terroir.p3.coords",
  },
  {
    id: "essaouira",
    dishId: "cornes-gazelle",
    image: "/dishes/cornes-gazelle.jpg",
    title: "terroir.p4.title",
    place: "terroir.p4.place",
    story: "terroir.p4.story",
    coords: "terroir.p4.coords",
  },
];

export default function TerroirOriginSection({
  onOpenDish,
}: {
  onOpenDish?: (dish: Dish) => void;
}) {
  const { t, locale, formatPrice } = useI18n();
  const [selected, setSelected] = useState(0);
  const priceOverrides = useAdmin((s) => s.priceOverrides);
  const active = ORIGINS[selected];
  const price = getEffectivePrice(active.dishId, priceOverrides);

  return (
    <section id="terroir" className="scroll-mt-24 bg-plaster py-20 text-ink sm:py-28">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="flex items-start justify-between gap-6 border-b border-ink/12 pb-6">
          <div>
            <p className="text-[12px] text-ink-soft">05 — {t("terroir.eyebrow")}</p>
            <h2
              className={`mt-3 max-w-2xl font-display text-4xl sm:text-5xl ${
                locale === "ar" ? "font-arabic leading-[1.35]" : ""
              }`}
            >
              {t("terroir.title")}
            </h2>
          </div>
          <span className="hidden font-display text-6xl text-ink/15 sm:block">05</span>
        </div>
        <p className="mt-5 max-w-2xl text-[15px] leading-[1.8] text-ink-soft">
          {t("terroir.subtitle")}
        </p>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ORIGINS.map((origin, index) => (
            <button
              key={origin.id}
              type="button"
              onClick={() => setSelected(index)}
              className={`group border bg-paper text-start transition-colors ${
                selected === index
                  ? "border-terracotta"
                  : "border-ink/12 hover:border-ink/40"
              }`}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={origin.image}
                  alt={t(origin.title)}
                  className="size-full object-cover"
                />
                <span className="absolute start-0 top-0 bg-ink px-2.5 py-1 font-display text-lg text-plaster">
                  0{index + 1}
                </span>
              </div>
              <div className="p-4">
                <p className="font-display text-xl text-ink">{t(origin.title)}</p>
                <p className="mt-1 text-[12px] text-ink-soft">{t(origin.place)}</p>
                {selected === index && (
                  <p className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-mint">
                    <Check className="size-3" strokeWidth={2.4} />
                    {t("terroir.tapHint")}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="mt-8 grid gap-8 border border-ink/12 bg-sand p-6 sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center"
          >
            <div className="relative aspect-[16/10] overflow-hidden border border-ink/12">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={active.image} alt={t(active.title)} className="size-full object-cover" />
            </div>
            <div>
              <p className="text-[12px] text-mint">{t(active.place)}</p>
              <h3
                className={`mt-2 font-display text-3xl sm:text-4xl ${
                  locale === "ar" ? "font-arabic leading-[1.35]" : ""
                }`}
              >
                {t(active.title)}
              </h3>
              <p className="mt-4 text-[15px] leading-[1.8] text-ink-soft">{t(active.story)}</p>
              <p dir="ltr" className="mt-2 text-[11px] text-ink-soft/70">
                {t(active.coords)}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => {
                    const dish = DISH_BY_ID[active.dishId];
                    if (dish) onOpenDish?.(dish);
                  }}
                  className="inline-flex items-center gap-2 border-b border-brass/50 pb-1 text-[12px] text-ink transition-colors hover:text-terracotta"
                >
                  {t("dish.view")}
                  <ArrowUpRight className="size-4 transition-transform hover:translate-x-0.5 rtl:rotate-180" />
                </button>
                <span className="font-display text-xl text-ink">{formatPrice(price)}</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
