"use client";

import { ArrowUpRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useAdmin, useUI } from "@/lib/store";

export default function SpecialBanner() {
  const special = useAdmin((s) => s.special);
  const openReserve = useUI((s) => s.openReserve);
  const { t } = useI18n();
  if (!special.active) return null;

  return (
    <div className="border-y border-[#C9A870]/40 bg-aubergine px-4 py-3 text-zellige">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="text-[9px] font-medium tracking-[0.22em] text-[#E6CFA0]">
            {t("special.badge")}
          </span>
          <span className="truncate font-display text-lg text-zellige">
            {special.title}
          </span>
          <span className="font-display text-lg text-[#E6CFA0]">
            {special.price} MAD
          </span>
        </div>
        <button
          type="button"
          onClick={openReserve}
          className="inline-flex items-center gap-2 border border-[#C9A870]/60 px-4 py-2 text-[10px] font-medium tracking-[0.14em] transition-colors hover:bg-[#C9A870] hover:text-aubergine-deep"
        >
          {t("special.cta")}
          <ArrowUpRight className="size-3.5 rtl:rotate-180" />
        </button>
      </div>
    </div>
  );
}
