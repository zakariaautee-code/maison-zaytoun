"use client";

import { useI18n } from "@/lib/i18n";

const ITEMS = [
  "marquee.direct",
  "marquee.halal",
  "marquee.delivery",
  "marquee.google",
] as const;

/** Static trust strip — no looping ticker. */
export default function BrandMarquee() {
  const { t } = useI18n();

  return (
    <section className="border-y border-brass/20 bg-espresso py-4 text-plaster">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-center gap-x-8 gap-y-2 px-5 sm:px-8">
        {ITEMS.map((key) => (
          <span key={key} className="text-[12px] text-plaster/60">
            {t(key)}
          </span>
        ))}
      </div>
    </section>
  );
}
