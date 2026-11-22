"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight, CalendarDays, Check } from "lucide-react";
import { CLIENT_CONFIG } from "@/config/client";
import { clarityEvent } from "@/lib/clarity";
import { HERO_IMAGE, GOOGLE_REVIEW_URL } from "@/lib/constants";
import { useI18n } from "@/lib/i18n";
import { useUI } from "@/lib/store";

const stage = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const line = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Hero() {
  const { t, locale } = useI18n();
  const openReserve = useUI((s) => s.openReserve);

  return (
    <section id="top" className="relative isolate flex min-h-svh items-center overflow-hidden bg-espresso pt-16 text-plaster">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={HERO_IMAGE} alt="" className="absolute inset-0 size-full object-cover" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/55 to-ink/20 rtl:bg-gradient-to-l" />

      <div className="relative mx-auto w-full max-w-[1400px] px-5 py-16 sm:px-8">
        <motion.div variants={stage} initial="hidden" animate="show" className="max-w-4xl">
          <motion.p variants={line} className="mb-5 text-[12px] tracking-[0.14em] text-brass-light">
            01 — {CLIENT_CONFIG.restaurantName} · {t("hero.eyebrow")}
          </motion.p>

          <motion.h1
            variants={line}
            className={`font-display text-[clamp(3rem,7vw,6.5rem)] leading-[0.92] text-plaster ${
              locale === "ar" ? "font-arabic leading-[1.3]" : ""
            }`}
          >
            <span className="block">{t("hero.headline1")}</span>
            <span className="block">{t("hero.headline2")}</span>
            <span className="block">{t("hero.headline3")}</span>
          </motion.h1>

          <motion.p variants={line} className="mt-6 max-w-xl text-[15px] leading-[1.8] text-plaster/80">
            {t("hero.subtitle")}
          </motion.p>
          <motion.p variants={line} className="mt-2 inline-flex items-center gap-2 text-[12px] text-brass-light">
            <span className="inline-flex size-4 items-center justify-center rounded-full bg-mint text-plaster">
              <Check className="size-2.5" strokeWidth={2.6} />
            </span>
            {t("hero.directLine")}
          </motion.p>

          <motion.div variants={line} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/menu"
              className="inline-flex items-center justify-center gap-2 bg-terracotta px-6 py-3.5 text-[12px] font-medium text-plaster transition-colors hover:bg-brass hover:text-espresso"
            >
              {t("hero.ctaDirect")}
              <ArrowUpRight className="size-4 transition-transform hover:translate-x-0.5 rtl:rotate-180" />
            </Link>
            <button
              type="button"
              onClick={() => {
                clarityEvent("book_now_click");
                openReserve();
              }}
              className="inline-flex items-center justify-center gap-2 border border-brass/60 px-6 py-3.5 text-[12px] font-medium text-plaster transition-colors hover:bg-brass hover:text-espresso"
            >
              <CalendarDays className="size-4" strokeWidth={1.5} />
              {t("hero.ctaReserve")}
            </button>
          </motion.div>

          <motion.a
            variants={line}
            href={GOOGLE_REVIEW_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-2 border-t border-brass/25 pt-4 text-[12px] text-plaster/70 transition-colors hover:text-plaster"
          >
            <strong className="font-medium tabular-nums text-plaster">{t("hero.rating")}</strong>
            <span>{t("hero.reviews")}</span>
            <span className="text-plaster/30">·</span>
            <span>{t("hero.status")}</span>
          </motion.a>
        </motion.div>
      </div>

      <div className="pointer-events-none absolute bottom-6 start-5 flex items-center gap-3 text-plaster/70 sm:start-8">
        <span className="font-display text-4xl leading-none">01</span>
        <span className="h-px w-10 bg-brass/50" />
        <a href="#immersion" className="pointer-events-auto inline-flex items-center gap-2 text-[11px] transition-colors hover:text-plaster">
          {t("hero.scroll")}
          <ArrowDown className="size-3.5" />
        </a>
      </div>
    </section>
  );
}
