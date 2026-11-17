"use client";

import { Check, Minus, Plus, Share2, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import Sheet from "./ui/Sheet";
import DishShareModal from "./DishShareModal";
import { EXTRA_PRICE, EXTRAS, PREFERENCES } from "@/lib/constants";
import { getEffectivePrice, isAvailable, useAdmin, useCart } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import type { Dish } from "@/lib/types";

type DishDrawerProps = {
  dish: Dish | null;
  onClose: () => void;
};

export default function DishDrawer({ dish, onClose }: DishDrawerProps) {
  const { t, locale, formatPrice } = useI18n();
  const addItem = useCart((s) => s.addItem);
  const priceOverrides = useAdmin((s) => s.priceOverrides);
  const availabilityOverrides = useAdmin((s) => s.availabilityOverrides);

  const [preference, setPreference] = useState<string>("drawer.pref.normal");
  const [extras, setExtras] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    if (dish) {
      setPreference("drawer.pref.normal");
      setExtras([]);
      setNotes("");
      setQuantity(1);
    }
  }, [dish]);

  if (!dish) return null;

  const basePrice = getEffectivePrice(dish.id, priceOverrides);
  const available = isAvailable(dish.id, availabilityOverrides);
  const unit = basePrice + extras.length * EXTRA_PRICE;
  const total = unit * quantity;

  const toggleExtra = (id: string) =>
    setExtras((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );

  const handleAdd = () => {
    if (!available) return;
    addItem(dish.id, { preference, extras, notes }, quantity, basePrice);
    onClose();
  };

  return (
    <>
    <Sheet
      open={Boolean(dish)}
      onClose={onClose}
      ariaLabel={dish.name[locale]}
      title={
        <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="eyebrow text-brass">{t("drawer.preparation")}</p>
            <h2 className="mt-1.5 truncate font-display text-2xl leading-tight text-plaster">
              {dish.name[locale]}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setShareOpen(true)}
            aria-label={t("share.title")}
            className="grid size-9 shrink-0 place-items-center border border-brass/40 text-brass-light transition-colors hover:bg-brass hover:text-espresso"
          >
            <Share2 className="size-4" strokeWidth={1.5} />
          </button>
        </div>
      }
    >
      <div className="pt-5">
        {/* Photograph */}
        <div className="relative aspect-[16/9] overflow-hidden border border-brass/25">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={dish.image}
            alt={dish.name[locale]}
            className={`size-full object-cover ${available ? "" : "opacity-55 grayscale"}`}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-espresso/60 to-transparent" />
          {available && (
            <span className="absolute start-3 top-3 inline-flex items-center gap-1.5 bg-mint px-2.5 py-1 text-[11px] font-medium text-white">
              <Check className="size-3" strokeWidth={2} />
              {t("menu.available")}
            </span>
          )}
          {!available && (
            <div className="absolute inset-0 grid place-items-center bg-espresso/45">
              <span className="border border-brass/70 bg-espresso/90 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.3em] text-brass-light">
                {t("menu.soldOut")}
              </span>
            </div>
          )}
        </div>

        <div className="mt-5 flex items-start justify-between gap-4 border-b border-brass/15 pb-5">
          <p className="max-w-md text-sm leading-[1.8] text-plaster/60">
            {dish.description[locale]}
          </p>
          <p className="shrink-0 font-display text-2xl text-brass-light">
            {formatPrice(basePrice)}
          </p>
        </div>

        <div className="mt-6 space-y-7">
          {/* Cooking preference */}
          <div>
            <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-plaster/50">
              {t("drawer.preference")}
            </h3>
            <div className="grid gap-2 sm:grid-cols-3">
              {PREFERENCES.map((pref) => {
                const active = preference === pref.id;
                return (
                  <button
                    key={pref.id}
                    type="button"
                    onClick={() => setPreference(pref.id)}
                    className={`inline-flex items-center justify-center gap-1.5 border px-3 py-2.5 text-[11px] font-semibold transition ${
                      active
                        ? "border-brass bg-brass text-espresso"
                        : "border-brass/25 text-plaster/65 hover:border-brass/60 hover:text-plaster"
                    }`}
                  >
                    {active && <Check className="size-3.5" strokeWidth={2.4} />}
                    {t(pref.labelKey)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Extras */}
          <div>
            <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-plaster/50">
              {t("drawer.extras")}
            </h3>
            <div className="divide-y divide-brass/15 border-y border-brass/15">
              {EXTRAS.map((extra) => {
                const active = extras.includes(extra.id);
                return (
                  <button
                    key={extra.id}
                    type="button"
                    onClick={() => toggleExtra(extra.id)}
                    className="flex w-full items-center justify-between gap-3 py-3 text-start transition hover:text-brass-light"
                  >
                    <span className="flex items-center gap-3 text-sm text-plaster/80">
                      <span
                        className={`grid size-4 place-items-center border ${
                          active
                            ? "border-brass bg-brass text-espresso"
                            : "border-brass/35"
                        }`}
                      >
                        {active && <Check className="size-3" strokeWidth={3} />}
                      </span>
                      {t(extra.labelKey)}
                    </span>
                    <span dir="ltr" className="shrink-0 text-[11px] font-semibold text-brass-light">
                      +{formatPrice(EXTRA_PRICE)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Kitchen note */}
          <div>
            <label
              htmlFor="drawer-notes"
              className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-plaster/50"
            >
              {t("drawer.notes")}
            </label>
            <textarea
              id="drawer-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder={t("drawer.notesPlaceholder")}
              className="field resize-none"
            />
          </div>
        </div>
      </div>

      {/* Sticky action rail */}
      <div className="sticky bottom-0 -mx-5 mt-7 border-t border-brass/20 bg-espresso px-5 pb-2 pt-4 sm:-mx-7 sm:px-7">
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-brass/30">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="Decrease"
              className="grid size-10 place-items-center text-plaster/70 transition hover:bg-brass/10 hover:text-brass-light"
            >
              <Minus className="size-3.5" />
            </button>
            <span className="w-8 text-center text-sm font-semibold tabular-nums text-plaster">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              aria-label="Increase"
              className="grid size-10 place-items-center text-plaster/70 transition hover:bg-brass/10 hover:text-brass-light"
            >
              <Plus className="size-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={!available}
            className="flex flex-1 items-center justify-center gap-2 bg-saffron px-4 py-3.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-white transition hover:bg-brass hover:text-espresso disabled:cursor-not-allowed disabled:bg-espresso-raised disabled:text-plaster/40"
          >
            <ShoppingBag className="size-3.5" />
            <span className="truncate">
              {available ? t("drawer.addToCart") : t("menu.soldOut")}
            </span>
            <span className="hidden shrink-0 border border-white/25 px-2 py-0.5 text-[10px] tracking-normal sm:inline">
              {formatPrice(total)}
            </span>
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
