"use client";

import { ArrowUpRight } from "lucide-react";
import { useI18n, type TranslationKey } from "@/lib/i18n";
import { useAdmin, useCart, useUI } from "@/lib/store";

export default function SpecialBanner() {
  const special = useAdmin((s) => s.special);
  const addItem = useCart((s) => s.addItem);
  const openCart = useUI((s) => s.openCart);
  const { t } = useI18n();
  if (!special.active) return null;

  return (
    <div className="border-y border-brass/50 bg-brass/10 px-4 py-3 text-plaster">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="text-[9px] font-semibold tracking-[0.22em] text-brass-light">
            {t("special.badge")}
          </span>
          <span className="truncate font-display text-lg text-plaster">
            {special.title}
          </span>
          <span className="font-display text-lg text-brass-light">
            {special.price} MAD
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            addItem(
              "special",
              {
                preference: "drawer.pref.normal" as TranslationKey,
                extras: [],
                notes: special.title,
              },
              1,
              special.price
            );
            openCart();
          }}
          className="inline-flex items-center gap-2 border border-brass/60 px-4 py-2 text-[10px] font-bold tracking-[0.14em] transition-colors hover:bg-brass hover:text-espresso"
        >
          {t("special.cta")}
          <ArrowUpRight className="size-3.5 rtl:rotate-180" />
        </button>
      </div>
    </div>
  );
}
