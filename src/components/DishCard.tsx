"use client";

import { motion } from "framer-motion";
import { Flame, Leaf, WheatOff } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import type { DietaryTag, Dish } from "@/lib/types";

const TAG_STYLES: Record<
  DietaryTag,
  { label: "filter.vegetarian" | "filter.spicy" | "filter.glutenFree"; icon: typeof Leaf }
> = {
  vegetarian: { label: "filter.vegetarian", icon: Leaf },
  spicy: { label: "filter.spicy", icon: Flame },
  "gluten-free": { label: "filter.glutenFree", icon: WheatOff },
};

type DishCardProps = {
  dish: Dish;
  price: number;
  available: boolean;
  onOpen: (dish: Dish) => void;
};

export default function DishCard({ dish, price, available, onOpen }: DishCardProps) {
  const { t, locale, formatPrice } = useI18n();

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="group flex flex-col border border-brass/20 bg-paper"
    >
      <div className="relative aspect-[4/5] overflow-hidden border-b border-brass/20 bg-plaster-deep">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={dish.image}
          alt={dish.name[locale]}
          loading="lazy"
          className={`size-full object-cover ${
            available ? "" : "opacity-55 grayscale-[65%]"
          }`}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-espresso/35 via-transparent to-transparent" />

        <div className="absolute inset-x-3 top-3 flex flex-wrap gap-1.5">
          {dish.tags.slice(0, 2).map((tag) => {
            const style = TAG_STYLES[tag];
            const Icon = style.icon;
            return (
              <span
                key={tag}
                className="inline-flex items-center gap-1 border border-plaster/30 bg-espresso/55 px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.14em] text-plaster"
              >
                <Icon className="size-2.5" strokeWidth={1.8} />
                {t(style.label)}
              </span>
            );
          })}
        </div>

        {dish.popular && available && (
          <span className="absolute bottom-3 start-3 inline-flex items-center gap-1 border border-brass/50 bg-espresso/70 px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.18em] text-brass-light">
            ★ {t("menu.popular")}
          </span>
        )}

        {!available && (
          <div className="absolute inset-0 grid place-items-center bg-espresso/45">
            <span className="-rotate-3 border border-brass/70 bg-espresso/90 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.3em] text-brass-light">
              {t("menu.soldOut")}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col border-b border-brass/25 pt-4">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-[1.35rem] leading-tight text-espresso transition-colors group-hover:text-saffron">
            {dish.name[locale]}
          </h3>
          <span className="shrink-0 font-display text-lg text-saffron">
            {formatPrice(price)}
          </span>
        </div>

        <p className="mt-2 line-clamp-2 text-[13px] leading-[1.7] text-ink-soft">
          {dish.description[locale]}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 pb-4 pt-4">
          <button
            type="button"
            onClick={() => onOpen(dish)}
            className="inline-flex items-center gap-1 border-b border-brass/50 pb-1 text-[12px] text-ink transition-colors hover:text-terracotta"
          >
            {t("dish.view")}
          </button>
          {!available && (
            <span className="border border-brass/25 px-3 py-1.5 text-[11px] text-ink-muted">
              {t("menu.soldOut")}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}
