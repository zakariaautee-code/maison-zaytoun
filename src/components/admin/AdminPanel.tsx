"use client";

import Link from "next/link";
import { QRCodeCanvas } from "qrcode.react";
import {
  ArrowLeft,
  Check,
  Copy,
  Download,
  Leaf,
  Printer,
  RotateCcw,
  ShieldCheck,
  Star,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { SITE_ORIGIN, TABLE_NUMBERS } from "@/lib/constants";
import { useI18n, type TranslationKey } from "@/lib/i18n";
import { CATEGORIES, MENU } from "@/lib/menu-data";
import { getEffectivePrice, isAvailable, useAdmin } from "@/lib/store";

export default function AdminPanel() {
  const { t, locale, formatPrice } = useI18n();
  const {
    priceOverrides,
    availabilityOverrides,
    setPrice,
    toggleAvailability,
    special,
    setSpecial,
    reset,
  } = useAdmin();
  const [table, setTable] = useState(1);
  const [origin, setOrigin] = useState(SITE_ORIGIN);
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") setOrigin(window.location.origin);
  }, []);

  const qrValue = `${origin}/menu?table=${table}`;

  const downloadQr = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `maison-zaytoun-table-${table}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(qrValue);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  const tips: TranslationKey[] = ["admin.tip1", "admin.tip2", "admin.tip3"];

  return (
    <div className="relative min-h-screen bg-espresso pb-20 text-plaster">
      <div className="pointer-events-none fixed inset-0 bg-grain opacity-[0.03]" />

      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-40 border-b border-brass/20 bg-espresso print:hidden">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center border border-brass/50 text-brass">
              <ShieldCheck className="size-[17px]" strokeWidth={1.7} />
            </span>
            <div className="leading-tight">
              <p className="font-display text-sm text-plaster sm:text-base">
                {t("brand.name")}
              </p>
              <p className="text-[8px] font-semibold uppercase tracking-[0.22em] text-brass">
                {t("admin.eyebrow")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitcher compact />
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 border border-brass/30 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-plaster/60 transition hover:border-brass hover:text-brass-light"
            >
              <ArrowLeft className="size-3.5 rtl:rotate-180" />
              <span className="hidden sm:inline">{t("admin.back")}</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        {/* ── Intro ──────────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-6 border-b border-brass/20 pb-8 md:flex-row md:items-end md:justify-between print:hidden">
          <div className="max-w-2xl">
            <p className="eyebrow flex items-center gap-2 text-brass">
              <Leaf className="size-3.5" strokeWidth={1.8} />
              {t("admin.live")}
            </p>
            <h1 className="mt-4 font-display text-4xl leading-tight text-plaster sm:text-5xl">
              {t("admin.title")}
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-plaster/50">
              {t("admin.subtitle")}
            </p>
          </div>

          <button
            type="button"
            onClick={reset}
            className="inline-flex w-fit items-center gap-2 whitespace-nowrap border border-brass/30 px-4 py-2.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-plaster/60 transition hover:border-saffron hover:text-saffron"
          >
            <RotateCcw className="size-3.5" />
            {t("admin.reset")}
          </button>
        </div>

        {/* ── Special mode ─────────────────────────────────────────────────── */}
        <section className="mt-8 border border-brass/25 bg-coal/80 p-5 print:hidden">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-xl text-plaster">{t("admin.special")}</h2>
              <p className="mt-1 text-[10px] text-plaster/40">{t("admin.specialHint")}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={special.active}
              onClick={() => setSpecial({ active: !special.active })}
              className={`relative h-6 w-11 shrink-0 border transition-colors ${
                special.active ? "border-brass bg-brass/40" : "border-brass/30 bg-espresso"
              }`}
            >
              <span
                className={`absolute top-0.5 size-4 bg-brass transition-[inset-inline-start] ${
                  special.active ? "start-[22px]" : "start-0.5"
                }`}
              />
            </button>
          </div>
          {special.active && (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-[10px] tracking-[0.14em] text-plaster/50">
                  {t("admin.specialTitle")}
                </span>
                <input
                  className="field"
                  value={special.title}
                  onChange={(e) => setSpecial({ title: e.target.value })}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[10px] tracking-[0.14em] text-plaster/50">
                  {t("admin.specialPrice")}
                </span>
                <input
                  type="number"
                  min={0}
                  className="field"
                  value={special.price}
                  onChange={(e) => setSpecial({ price: Number(e.target.value) })}
                />
              </label>
            </div>
          )}
        </section>

        <div className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          {/* ── Menu editor ──────────────────────────────────────────────── */}
          <section className="border border-brass/20 bg-coal/80 print:hidden">
            <div className="flex items-center justify-between border-b border-brass/20 px-5 py-4">
              <h2 className="font-display text-2xl text-plaster">
                {t("admin.menuEditor")}
              </h2>
              <span className="text-[10px] uppercase tracking-[0.18em] text-plaster/35">
                {MENU.length} {t("menu.results")}
              </span>
            </div>

            <p className="border-b border-brass/10 px-5 py-2.5 text-[10px] text-plaster/35">
              {t("admin.priceNote")}
            </p>

            {CATEGORIES.map((category) => (
              <div key={category.id}>
                <div className="flex items-center gap-2 border-y border-brass/10 bg-espresso/60 px-5 py-2">
                  <span className="size-1 bg-brass" />
                  <h3 className="text-[9px] font-semibold uppercase tracking-[0.2em] text-brass/80">
                    {category.label[locale]}
                  </h3>
                </div>

                {MENU.filter((dish) => dish.category === category.id).map(
                  (dish) => {
                    const price = getEffectivePrice(dish.id, priceOverrides);
                    const available = isAvailable(dish.id, availabilityOverrides);
                    const overridden = priceOverrides[dish.id] !== undefined;

                    return (
                      <div
                        key={dish.id}
                        className="flex flex-col gap-3 border-b border-brass/10 px-5 py-4 last:border-b-0 sm:flex-row sm:items-center sm:gap-5"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-plaster/90">
                            {dish.name[locale]}
                          </p>
                          <p className="mt-0.5 text-[10px] text-plaster/30">
                            {overridden ? (
                              <>
                                {formatPrice(dish.price)} →{" "}
                                <span className="text-brass-light">
                                  {formatPrice(price)}
                                </span>
                              </>
                            ) : (
                              <>{formatPrice(price)}</>
                            )}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <label
                            htmlFor={`price-${dish.id}`}
                            className="sr-only"
                          >
                            {t("admin.price")}
                          </label>
                          <div className="relative">
                            <input
                              id={`price-${dish.id}`}
                              type="number"
                              min={0}
                              value={price}
                              onChange={(e) =>
                                setPrice(
                                  dish.id,
                                  Math.max(0, Number(e.target.value))
                                )
                              }
                              className="w-24 border border-brass/25 bg-transparent py-2 pe-9 ps-2.5 text-sm font-semibold text-plaster transition focus:border-brass focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                            />
                            <span className="pointer-events-none absolute end-2.5 top-1/2 -translate-y-1/2 text-[9px] uppercase tracking-[0.1em] text-plaster/30">
                              MAD
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => toggleAvailability(dish.id)}
                            aria-pressed={available}
                            className={`inline-flex w-[112px] items-center justify-center gap-2 border px-2.5 py-2 text-[9px] font-bold uppercase tracking-[0.1em] transition ${
                              available
                                ? "border-brass/50 text-brass-light hover:bg-brass/10"
                                : "border-saffron/60 text-saffron hover:bg-saffron/10"
                            }`}
                          >
                            <span
                              className={`size-1.5 shrink-0 ${
                                available ? "bg-brass" : "bg-saffron"
                              }`}
                            />
                            {available ? t("admin.available") : t("admin.soldOut")}
                          </button>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            ))}
          </section>

          {/* ── QR generator ─────────────────────────────────────────────── */}
          <div className="space-y-6">
            <section className="border border-brass/20 bg-coal/80 p-5 sm:p-6 print:border-0 print:bg-white print:p-0">
              <div className="print:hidden">
                <h2 className="font-display text-2xl text-plaster">
                  {t("admin.qrTitle")}
                </h2>
                <p className="mt-2 text-xs leading-relaxed text-plaster/45">
                  {t("admin.qrSubtitle")}
                </p>
              </div>

              {/* Printable table card */}
              <div
                ref={qrRef}
                className="mx-auto mt-6 w-full max-w-[300px] border border-brass/40 bg-plaster p-3 text-espresso print:mt-0 print:max-w-[420px] print:border-black"
              >
                <div className="border border-espresso/20 p-5 text-center print:border-black">
                  <div className="flex items-center justify-center gap-2 text-brass-deep">
                    <Leaf className="size-3.5" strokeWidth={1.8} />
                    <span className="text-[8px] font-bold uppercase tracking-[0.28em]">
                      {t("brand.name")}
                    </span>
                  </div>

                  <p className="mt-3 font-arabic text-2xl leading-none text-espresso">
                    {t("brand.arabic")}
                  </p>

                  <div className="mx-auto mt-4 h-px w-10 bg-brass/60" />

                  <p className="mt-4 text-[9px] font-semibold uppercase tracking-[0.24em] text-espresso/50">
                    {t("admin.table")}
                  </p>
                  <p className="font-display text-4xl leading-none text-espresso [font-variant-numeric:lining-nums_tabular-nums]">
                    {String(table).padStart(2, "0")}
                  </p>

                  <div className="mx-auto mt-4 flex w-fit items-center justify-center bg-white p-2">
                    <QRCodeCanvas
                      value={qrValue}
                      size={200}
                      level="H"
                      fgColor="#121A15"
                      bgColor="#FFFFFF"
                      className="h-[168px] w-[168px] sm:h-[180px] sm:w-[180px] print:h-[200px] print:w-[200px]"
                    />
                  </div>

                  <p className="mt-4 text-[10px] leading-snug text-espresso/60">
                    {t("admin.qrCardHint")}
                  </p>
                  <div className="mt-1 flex items-center justify-center gap-1 text-[9px] text-espresso/40">
                    <Star className="size-2.5 fill-current text-brass" />
                    {t("footer.reviewLine")}
                  </div>
                </div>
              </div>

              <div className="mt-5 print:hidden">
                <label
                  htmlFor="table-select"
                  className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-plaster/50"
                >
                  {t("admin.tableRange")}
                </label>
                <select
                  id="table-select"
                  value={table}
                  onChange={(e) => setTable(Number(e.target.value))}
                  className="field [color-scheme:dark]"
                >
                  {TABLE_NUMBERS.map((n) => (
                    <option key={n} value={n}>
                      {t("admin.table")} {n}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={copyLink}
                  className="mt-2.5 flex w-full items-center gap-2 border border-brass/20 px-3 py-2 text-start text-[10px] text-plaster/40 transition hover:border-brass/50 hover:text-plaster/70"
                >
                  {copied ? (
                    <Check className="size-3 shrink-0 text-brass-light" />
                  ) : (
                    <Copy className="size-3 shrink-0" />
                  )}
                  <span className="truncate">{qrValue}</span>
                </button>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={downloadQr}
                    className="inline-flex items-center justify-center gap-1.5 bg-brass px-3 py-2.5 text-[9px] font-extrabold uppercase tracking-[0.12em] text-espresso transition hover:bg-brass-light"
                  >
                    <Download className="size-3.5" />
                    {t("admin.download")}
                  </button>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center justify-center gap-1.5 border border-brass/30 px-3 py-2.5 text-[9px] font-extrabold uppercase tracking-[0.12em] text-plaster/70 transition hover:border-brass hover:text-brass-light"
                  >
                    <Printer className="size-3.5" />
                    {t("admin.print")}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => window.open(qrValue, "_blank", "noopener,noreferrer")}
                  className="mt-2 flex w-full items-center justify-center gap-1.5 border border-brass/30 px-3 py-2.5 text-[9px] font-bold uppercase tracking-[0.12em] text-plaster/70 transition hover:border-brass hover:text-brass-light"
                >
                  {t("admin.testQr")}
                </button>

                <p className="mt-2.5 text-[10px] leading-relaxed text-plaster/30">
                  {t("admin.qrPrintHint")}
                </p>
              </div>
            </section>

            {/* ── Pitch tips ─────────────────────────────────────────────── */}
            <section className="border border-brass/20 bg-espresso-soft/60 p-6 print:hidden">
              <h2 className="flex items-center gap-2 font-display text-xl text-brass-light">
                <Leaf className="size-4" strokeWidth={1.8} />
                {t("admin.tipTitle")}
              </h2>
              <ol className="mt-5 space-y-4">
                {tips.map((key, i) => (
                  <li key={key} className="flex gap-3">
                    <span className="grid size-7 shrink-0 place-items-center border border-brass/40 font-display text-sm text-brass-light">
                      {i + 1}
                    </span>
                    <p className="text-sm leading-relaxed text-plaster/55">
                      {t(key)}
                    </p>
                  </li>
                ))}
              </ol>
              <p className="mt-6 border-t border-brass/15 pt-4 text-[10px] leading-relaxed text-plaster/30">
                {t("admin.resetHint")}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
