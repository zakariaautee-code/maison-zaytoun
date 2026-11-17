"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function MenuPreviewBanner() {
  const { t, locale } = useI18n();
  return (
    <section className="relative z-10 border-t border-brass/20 bg-espresso py-20 text-plaster sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-grain opacity-[0.02]" />
      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="flex items-start justify-between gap-6 border-b border-brass/20 pb-6">
          <p className="text-[12px] text-brass-light">06 — {t("preview.eyebrow")}</p>
          <span className="hidden font-display text-6xl text-plaster/15 sm:block">06</span>
        </div>
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_0.6fr] lg:items-end">
          <h2
            className={`font-display text-[clamp(2.5rem,6vw,5rem)] leading-[1.02] ${
              locale === "ar" ? "font-arabic leading-[1.35]" : ""
            }`}
          >
            {t("preview.title")}
          </h2>
          <div>
            <p className="max-w-md text-[15px] leading-[1.8] text-cream/70">
              {t("preview.subtitle")}
            </p>
            <Link
              href="/menu"
              className="mt-6 inline-flex w-fit items-center gap-2 bg-terracotta px-6 py-3.5 text-[12px] font-medium text-white transition-colors hover:bg-plaster hover:text-ink"
            >
              {t("preview.cta")}
              <ArrowUpRight className="size-4 transition-transform hover:translate-x-0.5 rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
