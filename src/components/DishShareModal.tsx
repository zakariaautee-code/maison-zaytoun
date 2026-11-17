"use client";

import { useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";
import Sheet from "@/components/ui/Sheet";
import { CLIENT_CONFIG } from "@/config/client";
import { useI18n } from "@/lib/i18n";
import type { Dish } from "@/lib/types";

export default function DishShareModal({
  dish,
  onClose,
}: {
  dish: Dish;
  onClose: () => void;
}) {
  const { t, locale } = useI18n();
  const [copied, setCopied] = useState(false);
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/menu?dish=${dish.id}`
      : `/menu?dish=${dish.id}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: dish.name[locale], url });
      } catch {
        /* user cancelled */
      }
    } else {
      void copy();
    }
  };

  return (
    <Sheet open onClose={onClose} side="right" ariaLabel={t("share.title")} title={<h2 className="font-display text-2xl text-plaster">{t("share.title")}</h2>}>
      <div className="pt-5">
        <div className="relative mx-auto aspect-[9/16] w-full max-w-[300px] overflow-hidden border border-brass/40 bg-espresso">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={dish.image} alt={dish.name[locale]} className="size-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-espresso via-espresso/80 to-transparent p-5 pt-16">
            <p className="text-[9px] tracking-[0.24em] text-brass-light">
              {CLIENT_CONFIG.restaurantName}
            </p>
            <h3 className="mt-2 font-display text-3xl leading-tight text-plaster">
              {dish.name[locale]}
            </h3>
            <p className="mt-2 text-[10px] text-plaster/50">{CLIENT_CONFIG.city} · {CLIENT_CONFIG.instagramHandle}</p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => void copy()}
            className="inline-flex items-center justify-center gap-2 border border-brass/40 px-4 py-3 text-[10px] font-bold tracking-[0.12em] text-plaster transition-colors hover:bg-brass hover:text-espresso"
          >
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? t("share.copied") : t("share.copy")}
          </button>
          <button
            type="button"
            onClick={() => void share()}
            className="inline-flex items-center justify-center gap-2 bg-saffron px-4 py-3 text-[10px] font-bold tracking-[0.12em] text-white transition-colors hover:bg-brass hover:text-espresso"
          >
            <Share2 className="size-4" />
            {t("share.webShare")}
          </button>
        </div>
      </div>
    </Sheet>
  );
}
