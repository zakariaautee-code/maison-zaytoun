"use client";

import { useState } from "react";
import { CalendarDays, Share2, Star } from "lucide-react";
import Sheet from "./ui/Sheet";
import DishShareModal from "./DishShareModal";
import { availableFor, priceFor, useAdmin, useCart, useUI } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import type { Dish } from "@/lib/types";

type DishDrawerProps = {
  dish: Dish | null;
  onClose: () => void;
  orderable?: boolean;
};

export default function DishDrawer({ dish, onClose, orderable = false }: DishDrawerProps) {
  const { t, locale, formatPrice } = useI18n();
  const priceOverrides = useAdmin((s) => s.priceOverrides);
  const availabilityOverrides = useAdmin((s) => s.availabilityOverrides);
  const openReserve = useUI((s) => s.openReserve);
  const addItem = useCart((s) => s.addItem);
  const [shareOpen, setShareOpen] = useState(false);

  if (!dish) return null;

  const price = priceFor(dish, priceOverrides);
  const available = availableFor(dish, availabilityOverrides);

  return (
    <>
      <Sheet
        open={Boolean(dish)}
        onClose={onClose}
        ariaLabel={dish.name[locale]}
        tone="aubergine"
        title={
          <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="eyebrow text-[#E6CFA0]">{t("dish.ingredients")}</p>
              <h2 className="mt-1.5 truncate font-display text-2xl text-zellige">
                {dish.name[locale]}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setShareOpen(true)}
              aria-label={t("share.title")}
              className="grid size-9 shrink-0 place-items-center border border-[#C9A870]/45 text-[#E6CFA0] transition-colors hover:bg-[#C9A870] hover:text-aubergine-deep"
            >
              <Share2 className="size-4" strokeWidth={1.5} />
            </button>
          </div>
        }
      >
        <div className="pt-5">
          <div className="relative aspect-[4/3] overflow-hidden border border-brass/25">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={dish.image}
              alt={dish.name[locale]}
              className={`size-full object-cover ${available ? "" : "opacity-55 grayscale"}`}
            />
            {available && (
              <span className="absolute start-3 top-3 inline-flex items-center gap-1.5 bg-[#C9A870] px-2.5 py-1 text-[11px] text-aubergine-deep">
                <Star className="size-3 fill-current" />
                {t("menu.available")}
              </span>
            )}
            {!available && (
              <div className="absolute inset-0 grid place-items-center bg-espresso/45">
                <span className="border border-brass/70 bg-espresso/90 px-4 py-2 text-[11px] text-brass-light">
                  {t("menu.soldOut")}
                </span>
              </div>
            )}
          </div>

          <div className="mt-5 flex items-start justify-between gap-4 border-b border-brass/15 pb-5">
            <p className="max-w-md text-[15px] leading-[1.8] text-zellige/75">
              {dish.description[locale]}
            </p>
            <p className="shrink-0 font-display text-2xl text-[#E6CFA0]">
              {formatPrice(price)}
            </p>
          </div>

          <div className="mt-6 space-y-6">
            <div>
              <p className="text-[12px] text-[#E6CFA0]">{t("dish.ingredients")}</p>
              <p className="mt-2 text-[14px] leading-[1.8] text-zellige/70">
                {dish.description[locale]}
              </p>
            </div>
            <div>
              <p className="text-[12px] text-[#E6CFA0]">{t("dish.allergens")}</p>
              <p className="mt-2 text-[14px] text-zellige/65">
                {dish.tags.length
                  ? dish.tags
                      .map((tag) =>
                        tag === "vegetarian"
                          ? t("filter.vegetarian")
                          : tag === "spicy"
                            ? t("filter.spicy")
                            : t("filter.glutenFree")
                      )
                      .join(" · ")
                  : t("dish.allergensNone")}
              </p>
            </div>
          </div>

          <div className="sticky bottom-0 -mx-5 mt-8 space-y-2 border-t border-[#C9A870]/25 bg-aubergine-deep px-5 pb-2 pt-4 sm:-mx-7 sm:px-7">
            {orderable && available && (
              <button
                type="button"
                onClick={() => {
                  addItem(dish, price);
                  onClose();
                }}
                className="flex w-full items-center justify-center gap-2 bg-[#C9A870] px-5 py-3.5 text-[12px] font-medium text-aubergine-deep transition-colors hover:bg-[#E6CFA0]"
              >
                {t("cart.add")} · {formatPrice(price)}
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                onClose();
                openReserve();
              }}
              className="flex w-full items-center justify-center gap-2 bg-terracotta px-5 py-3.5 text-[12px] font-medium text-white transition-colors hover:bg-brass hover:text-espresso"
            >
              <CalendarDays className="size-4" strokeWidth={1.5} />
              {t("hero.ctaReserve")}
            </button>
          </div>
        </div>
      </Sheet>
      {shareOpen && (
        <DishShareModal dish={dish} onClose={() => setShareOpen(false)} />
      )}
    </>
  );
}
