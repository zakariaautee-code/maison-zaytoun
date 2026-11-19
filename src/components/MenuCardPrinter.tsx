"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Download, Printer } from "lucide-react";
import { CLIENT_CONFIG } from "@/config/client";
import { useDishes } from "@/lib/dishes-context";
import { useI18n } from "@/lib/i18n";
import { CATEGORIES } from "@/lib/menu-data";
import { priceFor, useAdmin } from "@/lib/store";
import type { CategoryId, Dish } from "@/lib/types";

const W = 1240;
const H = 1754;

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function wrap(value: string, max: number): string[] {
  const words = value.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    if ((line + " " + word).trim().length > max && line) {
      lines.push(line);
      line = word;
    } else {
      line = (line ? line + " " : "") + word;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 2);
}

function cardSvg(
  dishes: Dish[],
  categoryLabel: string,
  locale: "fr" | "ar" | "en"
): string {
  const rtl = locale === "ar";
  const nameX = rtl ? W - 100 : 100;
  const priceX = rtl ? 100 : W - 100;
  const anchor = rtl ? "end" : "start";
  const priceAnchor = rtl ? "start" : "end";

  const rows = dishes
    .map((dish, index) => {
      const y = 470 + index * 218;
      const description = wrap(dish.description[locale], 58)
        .map(
          (line, i) =>
            `<text x="${nameX}" y="${y + 44 + i * 28}" text-anchor="${anchor}" font-family="Plus Jakarta Sans, sans-serif" font-size="18" fill="#526057">${esc(line)}</text>`
        )
        .join("");
      return `
        <text x="${nameX}" y="${y}" text-anchor="${anchor}" font-family="Cormorant Garamond, Georgia, serif" font-size="40" fill="#1A241E">${esc(dish.name[locale])}</text>
        <text x="${priceX}" y="${y}" text-anchor="${priceAnchor}" font-family="Cormorant Garamond, Georgia, serif" font-size="34" fill="#9E7432">${dish.price} MAD</text>
        ${description}
        <line x1="100" y1="${y + 100}" x2="1140" y2="${y + 100}" stroke="#C9A253" stroke-opacity="0.35" stroke-width="1" />`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <rect width="${W}" height="${H}" fill="#F6EFE6" />
    <rect x="46" y="46" width="${W - 92}" height="${H - 92}" fill="none" stroke="#C9A253" stroke-width="3" />
    <rect x="62" y="62" width="${W - 124}" height="${H - 124}" fill="none" stroke="#C9A253" stroke-opacity="0.55" stroke-width="1.5" />
    <text x="${W / 2}" y="145" text-anchor="middle" font-family="Cormorant Garamond, Georgia, serif" font-size="36" fill="#1A241E">${esc(CLIENT_CONFIG.restaurantName)}</text>
    <text x="${W / 2}" y="185" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="17" fill="#526057">${esc(CLIENT_CONFIG.city)} · ${esc(CLIENT_CONFIG.tagline)}</text>
    <line x1="420" y1="225" x2="820" y2="225" stroke="#C9A253" stroke-width="2" />
    <text x="${W / 2}" y="325" text-anchor="middle" font-family="Cormorant Garamond, Georgia, serif" font-style="italic" font-size="100" fill="#1A241E">La Carte</text>
    <text x="${W / 2}" y="410" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="24" fill="#9E7432">${esc(categoryLabel)}</text>
    ${rows}
    <line x1="100" y1="${H - 130}" x2="1140" y2="${H - 130}" stroke="#C9A253" stroke-width="2" />
    <text x="100" y="${H - 85}" font-family="Plus Jakarta Sans, sans-serif" font-size="16" fill="#526057">${esc(CLIENT_CONFIG.restaurantName)} · ${esc(CLIENT_CONFIG.city)}</text>
    <text x="1140" y="${H - 85}" text-anchor="end" font-family="Plus Jakarta Sans, sans-serif" font-size="16" fill="#526057">Prix en MAD</text>
  </svg>`;
}

export default function MenuCardPrinter() {
  const { t, locale } = useI18n();
  const allDishes = useDishes();
  const priceOverrides = useAdmin((s) => s.priceOverrides);
  const [category, setCategory] = useState<CategoryId>("starters");

  const categories = CATEGORIES.map((c) => ({ id: c.id, label: c.label[locale] }));
  const activeLabel = categories.find((c) => c.id === category)?.label ?? "";

  const dishes = useMemo(
    () =>
      allDishes
        .filter((dish) => dish.category === category && dish.available)
        .map((dish) => ({ ...dish, price: priceFor(dish, priceOverrides) })),
    [allDishes, category, priceOverrides]
  );

  const svg = useMemo(
    () => cardSvg(dishes, activeLabel, locale),
    [dishes, activeLabel, locale]
  );

  const downloadPng = () => {
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const objectUrl = URL.createObjectURL(blob);
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      canvas.getContext("2d")?.drawImage(image, 0, 0, W, H);
      canvas.toBlob((png) => {
        if (!png) return;
        const url = URL.createObjectURL(png);
        const link = document.createElement("a");
        link.href = url;
        link.download = `maison-zaytoun-carte-${category}.png`;
        link.click();
        URL.revokeObjectURL(url);
      }, "image/png");
      URL.revokeObjectURL(objectUrl);
    };
    image.src = objectUrl;
  };

  const printAll = () => {
    const pages = categories
      .map((c) => {
        const list = allDishes
          .filter((dish) => dish.category === c.id && dish.available)
          .map((dish) => ({ ...dish, price: priceFor(dish, priceOverrides) }));
        return `<div class="page">${cardSvg(list, c.label, locale)}</div>`;
      })
      .join("");
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Maison Zaytoun — Cartes menu</title>
      <style>@page{size:A5 portrait;margin:0}html,body{margin:0;padding:0;background:#fff}.page{width:148mm;height:210mm;overflow:hidden;break-after:page;page-break-after:always}.page svg{width:148mm;height:210mm;display:block}</style>
      </head><body>${pages}</body></html>`);
    win.document.close();
    win.focus();
    win.print();
  };

  return (
    <section className="mt-8 border border-brass/20 bg-coal/80 p-5 sm:p-6 print:hidden">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl text-plaster">{t("admin.menuCardsTitle")}</h2>
          <p className="mt-2 max-w-xl text-xs leading-relaxed text-plaster/45">
            {t("admin.menuCardsHint")}
          </p>
        </div>
        <Link
          href="/studio"
          className="inline-flex border border-brass/50 px-4 py-2.5 text-[11px] text-brass-light transition hover:bg-brass hover:text-espresso"
        >
          {t("admin.editDishes")}
        </Link>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <label htmlFor="menu-card-category" className="text-[11px] text-plaster/50">
          {t("admin.cardCategory")}
        </label>
        <select
          id="menu-card-category"
          value={category}
          onChange={(e) => setCategory(e.target.value as CategoryId)}
          className="field max-w-xs [color-scheme:dark]"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={downloadPng}
          className="inline-flex items-center gap-2 bg-brass px-4 py-2.5 text-[11px] text-espresso transition hover:bg-brass-light"
        >
          <Download className="size-4" />
          {t("admin.downloadCard")}
        </button>
        <button
          type="button"
          onClick={printAll}
          className="inline-flex items-center gap-2 border border-brass/40 px-4 py-2.5 text-[11px] text-plaster transition hover:border-brass"
        >
          <Printer className="size-4" />
          {t("admin.printAllCards")}
        </button>
      </div>

      <div
        className="mx-auto mt-6 w-full max-w-[340px] border border-brass/30 bg-white"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </section>
  );
}
