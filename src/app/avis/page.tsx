"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Star } from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { CLIENT_CONFIG } from "@/config/client";
import { useI18n } from "@/lib/i18n";
import { buildWaUrl } from "@/lib/whatsapp";

export default function AvisPage() {
  const { t, locale } = useI18n();
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [table, setTable] = useState("");
  const [comment, setComment] = useState("");
  const [sent, setSent] = useState(false);
  const positive = rating >= 4;

  const sendPrivate = () => {
    const message = [
      `${t("review.table")}: ${table.trim() || "—"}`,
      `${t("review.comment")}: ${comment.trim()}`,
      `⭐ ${rating}/5 — ${CLIENT_CONFIG.restaurantName}`,
    ].join("\n");
    window.open(
      buildWaUrl(CLIENT_CONFIG.whatsappNumber, message),
      "_blank",
      "noopener,noreferrer"
    );
    setSent(true);
  };

  return (
    <main className="relative z-10 min-h-screen bg-espresso px-5 py-16 text-plaster sm:px-8">
      <div className="pointer-events-none absolute inset-0 bg-grain opacity-[0.03]" />
      <div className="relative mx-auto max-w-xl">
        <div className="mb-12 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[11px] text-plaster/60 transition hover:text-brass-light"
          >
            <ArrowLeft className="size-4 rtl:rotate-180" />
            {t("menuPage.back")}
          </Link>
          <LanguageSwitcher compact />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="border border-brass/25 bg-coal/80 p-7 sm:p-10"
        >
          <p className="text-[10px] font-semibold tracking-[0.28em] text-brass">
            {CLIENT_CONFIG.restaurantName}
          </p>
          <h1
            className={`mt-4 font-display text-3xl leading-tight sm:text-4xl ${
              locale === "ar" ? "font-arabic leading-[1.4]" : ""
            }`}
          >
            {t("review.ask")}
          </h1>

          <div
            className="mt-8 flex items-center gap-2"
            onMouseLeave={() => setHovered(0)}
          >
            {[1, 2, 3, 4, 5].map((n) => {
              const active = n <= (hovered || rating);
              return (
                <button
                  key={n}
                  type="button"
                  aria-label={`${n} / 5`}
                  onMouseEnter={() => setHovered(n)}
                  onClick={() => {
                    setRating(n);
                    setSent(false);
                  }}
                  className="p-1"
                >
                  <Star
                    className={`size-9 sm:size-11 ${
                      active ? "fill-brass text-brass" : "text-brass/40"
                    }`}
                    strokeWidth={1.4}
                  />
                </button>
              );
            })}
          </div>

          {rating > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="mt-9 border-t border-brass/20 pt-7"
            >
              {positive ? (
                <>
                  <h2 className="font-display text-2xl text-brass-light">
                    {t("review.positive")}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-plaster/55">
                    {t("review.positiveHint")}
                  </p>
                  <a
                    href={CLIENT_CONFIG.googleReviewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-flex items-center gap-2 bg-saffron px-6 py-3.5 text-[11px] font-bold tracking-[0.12em] text-white transition hover:bg-brass hover:text-espresso"
                  >
                    {t("review.cta")}
                    <ArrowUpRight className="size-4 rtl:rotate-180" />
                  </a>
                </>
              ) : (
                <>
                  <h2 className="font-display text-2xl text-brass-light">
                    {t("review.negative")}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-plaster/55">
                    {t("review.negativeHint")}
                  </p>
                  <div className="mt-6 grid gap-3">
                    <label className="block">
                      <span className="mb-1.5 block text-[10px] tracking-[0.14em] text-plaster/50">
                        {t("review.table")}
                      </span>
                      <input
                        className="field"
                        inputMode="numeric"
                        value={table}
                        onChange={(e) => setTable(e.target.value)}
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-[10px] tracking-[0.14em] text-plaster/50">
                        {t("review.comment")}
                      </span>
                      <textarea
                        className="field min-h-24 resize-none"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={sendPrivate}
                      className="inline-flex items-center justify-center gap-2 bg-brass px-6 py-3.5 text-[11px] font-bold tracking-[0.12em] text-espresso transition hover:bg-brass-light"
                    >
                      {t("review.send")}
                      <ArrowUpRight className="size-4 rtl:rotate-180" />
                    </button>
                    {sent && (
                      <p className="text-center text-xs text-brass-light">
                        {t("review.sent")}
                      </p>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
