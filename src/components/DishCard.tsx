"use client";

import { motion } from "framer-motion";
import { Flame, Leaf, WheatOff } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useCart } from "@/lib/store";
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
  orderable?: boolean;
};

export default function DishCard({
  dish,
  price,
  available,
  onOpen,
  orderable = false,
}: DishCardProps) {
  const { t, locale, formatPrice } = useI18n();
  const addItem = useCart((s) => s.addItem);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="group flex flex-col border border-[#C9A870]/35 bg-[#FFFDF8]"
    >
      <div className="relative aspect-[4/5] overflow-hidden border-b border-[#C9A870]/35 bg-zellige">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={dish.image}
          alt={dish.name[locale]}
          loading="lazy"
          className={`size-full object-cover ${
            available ? "" : "opacity-55 grayscale-[65%]"
          }`}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-aubergine-deep/25 via-transparent to-transparent" />

        <div className="absolute inset-x-3 top-3 flex flex-wrap gap-1.5">
          {dish.tags.slice(0, 2).map((tag) => {
            const style = TAG_STYLES[tag];
            const Icon = style.icon;
            return (
              <span
                key={tag}
                className="inline-flex items-center gap-1 border border-[#C9A870]/45 bg-aubergine-deep/75 px-2 py-1 text-[9px] font-medium tracking-[0.1em] text-zellige"
              >
                <Icon className="size-2.5" strokeWidth={1.8} />
                {t(style.label)}
              </span>
            );
          })}
        </div>

        {dish.popular && available && (
          <span className="absolute bottom-3 start-3 inline-flex items-center gap-1 border border-[#C9A870]/60 bg-aubergine-deep/80 px-2 py-1 text-[9px] font-medium tracking-[0.14em] text-[#E6CFA0]">
            ★ {t("menu.popular")}
          </span>
        )}

        {!available && (
          <div className="absolute inset-0 grid place-items-center bg-aubergine-deep/45">
            <span className="-rotate-3 border border-[#C9A870]/70 bg-aubergine-deep/90 px-4 py-2 text-[9px] font-medium tracking-[0.2em] text-[#E6CFA0]">
              {t("menu.soldOut")}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col border-b border-[#C9A870]/25 pt-4">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-[1.35rem] leading-tight text-aubergine transition-colors group-hover:text-[#C9A870]">
            {dish.name[locale]}
          </h3>
          <span className="shrink-0 font-display text-lg text-[#8A692F]">
            {formatPrice(price)}
          </span>
        </div>

        <p className="mt-2 line-clamp-2 text-[13px] leading-[1.7] text-aubergine-soft">
          {dish.description[locale]}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 pb-4 pt-4">
          <button
            type="button"
            onClick={() => onOpen(dish)}
            className="inline-flex items-center gap-1 border-b border-[#C9A870]/60 pb-1 text-[12px] text-aubergine transition-colors hover:text-[#A9813F]"
          >
            {t("dish.view")}
          </button>
          {orderable && available && (
            <button
              type="button"
              onClick={() => addItem(dish, price)}
              className="inline-flex items-center bg-aubergine px-3 py-2 text-[11px] font-medium text-zellige transition-colors hover:bg-[#C9A870] hover:text-aubergine-deep"
            >
              {t("cart.add")}
            </button>
          )}
          {!available && (
            <span className="border border-[#C9A870]/30 px-3 py-1.5 text-[11px] text-aubergine-soft">
              {t("menu.soldOut")}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}
