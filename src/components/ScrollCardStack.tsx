"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { DISH_BY_ID } from "@/lib/menu-data";
import { getEffectivePrice, isAvailable, useAdmin, useCart } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import type { Dish } from "@/lib/types";

const SIGNATURE_IDS = [
  "zaalouk",
  "tagine-lamb",
  "brochette-lamb",
  "cornes-gazelle",
];
const SIGNATURES = SIGNATURE_IDS.map((id) => DISH_BY_ID[id]).filter(
  (dish): dish is Dish => Boolean(dish)
);

export default function ScrollCardStack() {
  const { t, locale, formatPrice } = useI18n();
  const priceOverrides = useAdmin((s) => s.priceOverrides);
  const availability = useAdmin((s) => s.availabilityOverrides);
  const addItem = useCart((s) => s.addItem);

  return (
    <section className="bg-espresso py-20 text-plaster sm:py-28">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="flex items-start justify-between gap-6 border-b border-brass/20 pb-6">
          <div>
            <p className="text-[12px] tracking-[0.14em] text-brass">04 — {t("stack.eyebrow")}</p>
            <h2
              className={`mt-3 font-display text-4xl sm:text-5xl ${
                locale === "ar" ? "font-arabic leading-[1.35]" : ""
              }`}
            >
              {t("stack.title")}
            </h2>
          </div>
          <span className="hidden font-display text-6xl text-plaster/15 sm:block">04</span>
        </div>
        <p className="mt-5 max-w-xl text-[15px] leading-[1.8] text-plaster/65">
          {t("stack.subtitle")}
        </p>

        <div className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2">
          {SIGNATURES.map((dish, index) => {
            const price = getEffectivePrice(dish.id, priceOverrides);
            const available = isAvailable(dish.id, availability);
            return (
              <article key={dish.id}>
                <div className="relative aspect-[4/3] overflow-hidden border border-brass/20 bg-coal">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={dish.image}
                    alt={dish.name[locale]}
                    className="size-full object-cover"
                  />
                  <span className="absolute start-0 top-0 bg-brass px-2.5 py-1 font-display text-lg text-espresso">
                    0{index + 1}
                  </span>
                </div>
                <div className="mt-4 flex items-start justify-between gap-4 border-b border-brass/20 pb-4">
                  <div className="min-w-0">
                    <h3 className="font-display text-2xl text-plaster">{dish.name[locale]}</h3>
                    <p className="mt-2 max-w-md text-[13px] leading-[1.7] text-plaster/55">
                      {dish.description[locale]}
                    </p>
                  </div>
                  <span className="shrink-0 font-display text-xl text-brass-light">
                    {formatPrice(price)}
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <button
                    type="button"
                    disabled={!available}
                    onClick={() =>
                      available &&
                      addItem(
                        dish.id,
                        { preference: "drawer.pref.normal", extras: [], notes: "" },
                        1,
                        price
                      )
                    }
                    className="inline-flex items-center gap-2 bg-terracotta px-4 py-2.5 text-[12px] font-medium text-white transition-colors hover:bg-brass hover:text-espresso disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {t("stack.add")}
                  </button>
                  <Link
                    href="/menu"
                    className="inline-flex items-center gap-1 text-[12px] text-brass-light transition-colors hover:text-plaster"
                  >
                    {t("stack.viewAll")}
                    <ArrowUpRight className="size-3.5 rtl:rotate-180" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
