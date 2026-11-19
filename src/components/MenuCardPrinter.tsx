"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Download, FileCode, Printer } from "lucide-react";
import { CLIENT_CONFIG } from "@/config/client";
import { HERO_IMAGE } from "@/lib/constants";
import { useDishes } from "@/lib/dishes-context";
import { useI18n } from "@/lib/i18n";
import { CATEGORIES } from "@/lib/menu-data";
import { priceFor, useAdmin, useUI } from "@/lib/store";
import type { CategoryId, Dish } from "@/lib/types";

const W = 1240;
const H = 1754;

const PAPER = "#F7F2E9";
const AUBERGINE = "#5A3A38";
const DEEP = "#3E2725";
const GOLD = "#C9A870";
const GOLD_INK = "#8A692F";
const MUTED = "#6B5545";

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function short(value: string, max: number): string {
  if (value.length <= max) return value;
  return value.slice(0, max - 1).trimEnd() + "…";
}

async function imageToDataUrl(url: string): Promise<string> {
  try {
    const response = await fetch(url, { mode: "cors" });
    const blob = await response.blob();
    return await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => resolve(url);
      reader.readAsDataURL(blob);
    });
  } catch {
    return url;
  }
}

/** A small zellige diamond used as a section ornament. */
function diamond(cx: number, cy: number, r: number): string {
  return `<path d="M${cx} ${cy - r} L${cx + r} ${cy} L${cx} ${cy + r} L${cx - r} ${cy} Z" fill="none" stroke="${GOLD}" stroke-width="1.6" />
    <path d="M${cx} ${cy - r / 2} L${cx + r / 2} ${cy} L${cx} ${cy + r / 2} L${cx - r / 2} ${cy} Z" fill="${GOLD}" fill-opacity="0.55" />`;
}

function cardSvg(
  dishes: Dish[],
  categoryLabel: string,
  locale: "fr" | "ar" | "en",
  photos: string[] = []
): string {
  const rtl = locale === "ar";
  const displayFont =
    locale === "ar" ? "Amiri, Georgia, serif" : "Forum, Cormorant Garamond, Georgia, serif";
  const bodyFont =
    locale === "ar"
      ? "Tajawal, Readex Pro, sans-serif"
      : "DM Sans, Plus Jakarta Sans, sans-serif";

  const thumbX = rtl ? W - 210 : 90;
  const textX = rtl ? W - 250 : 250;
  const priceX = rtl ? 90 : W - 90;
  const textAnchor = rtl ? "end" : "start";
  const priceAnchor = rtl ? "start" : "end";

  const count = Math.min(dishes.length, 7);
  const blockTop = rtl ? 510 : 470;
  const blockHeight = rtl ? 1040 : 1090;
  const rowHeight = Math.min(280, blockHeight / Math.max(count, 1));
  const firstY = blockTop + 60;
  const titleY = rtl ? 240 : 228;
  const titleSize = rtl ? 84 : 104;
  const categoryY = rtl ? 322 : 286;
  const ornamentY = rtl ? 392 : 360;
  const rows = dishes
    .slice(0, 7)
    .map((dish, i) => {
      const y = firstY + i * rowHeight;
      const photo = photos[i] || dish.image || HERO_IMAGE;
      return `
        <g>
          <image href="${esc(photo)}" x="${thumbX}" y="${y - 52}" width="116" height="116" preserveAspectRatio="xMidYMid slice" clip-path="url(#thumb${i})" />
          <rect x="${thumbX}" y="${y - 52}" width="116" height="116" fill="none" stroke="${GOLD}" stroke-width="2" />
          <rect x="${thumbX + 5}" y="${y - 47}" width="106" height="106" fill="none" stroke="${GOLD}" stroke-opacity="0.4" stroke-width="1" />
          <text x="${textX}" y="${y - 12}" text-anchor="${textAnchor}" font-family="${displayFont}" font-size="38" fill="${DEEP}">${esc(dish.name[locale])}</text>
          <text x="${textX}" y="${y + 30}" text-anchor="${textAnchor}" font-family="${bodyFont}" font-size="22" fill="${MUTED}">${esc(short(dish.description[locale], 52))}</text>
          <text x="${priceX}" y="${y + 2}" text-anchor="${priceAnchor}" font-family="${displayFont}" font-size="32" fill="${GOLD_INK}">${dish.price} MAD</text>
          <line x1="90" y1="${y + 86}" x2="${W - 90}" y2="${y + 86}" stroke="${GOLD}" stroke-opacity="0.55" stroke-width="1" />
        </g>`;
    })
    .join("");

  const clipDefs = dishes
    .slice(0, 7)
    .map(
      (_, i) =>
        `<clipPath id="thumb${i}"><rect x="${thumbX}" y="${firstY + i * rowHeight - 52}" width="116" height="116" /></clipPath>`
    )
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="direction:ltr">
    <defs>
      ${clipDefs}
      <pattern id="zellige" width="76" height="76" patternUnits="userSpaceOnUse">
        <g fill="none" stroke="${GOLD}" stroke-opacity="0.12" stroke-width="1">
          <path d="M38 2 74 38 38 74 2 38Z" />
          <path d="M38 15 61 38 38 61 15 38Z" />
          <circle cx="38" cy="38" r="8" />
          <path d="M38 0v15M38 61v15M0 38h15M61 38h15" />
        </g>
      </pattern>
    </defs>

    <rect width="${W}" height="${H}" fill="${PAPER}" />
    <rect width="${W}" height="${H}" fill="url(#zellige)" />
    <rect x="40" y="40" width="${W - 80}" height="${H - 80}" fill="none" stroke="${GOLD}" stroke-width="2.5" />
    <rect x="52" y="52" width="${W - 104}" height="${H - 104}" fill="none" stroke="${GOLD}" stroke-opacity="0.5" stroke-width="1" />

    <text x="${W / 2}" y="118" text-anchor="middle" font-family="${bodyFont}" font-size="20" letter-spacing="5" fill="${GOLD_INK}">${esc(CLIENT_CONFIG.restaurantName.toUpperCase())}</text>
    <text x="${W / 2}" y="${titleY}" text-anchor="middle" font-family="${displayFont}" font-size="${titleSize}" fill="${AUBERGINE}">${esc(locale === "ar" ? "قائمة الطعام" : "Menu")}</text>
    <text x="${W / 2}" y="${categoryY}" text-anchor="middle" font-family="${bodyFont}" font-size="24" letter-spacing="2" fill="${GOLD_INK}">${esc(categoryLabel)}</text>

    <g>${diamond(W / 2 - 96, ornamentY, 9)}${diamond(W / 2, ornamentY, 13)}${diamond(W / 2 + 96, ornamentY, 9)}
      <line x1="${W / 2 - 250}" y1="${ornamentY}" x2="${W / 2 - 130}" y2="${ornamentY}" stroke="${GOLD}" stroke-width="1" />
      <line x1="${W / 2 + 130}" y1="${ornamentY}" x2="${W / 2 + 250}" y2="${ornamentY}" stroke="${GOLD}" stroke-width="1" />
    </g>

    ${rows}

    <line x1="90" y1="${H - 150}" x2="${W - 90}" y2="${H - 150}" stroke="${GOLD}" stroke-width="2" />
    <text x="90" y="${H - 100}" text-anchor="start" font-family="${bodyFont}" font-size="18" fill="${MUTED}">${esc(CLIENT_CONFIG.tagline)}</text>
    <text x="${W - 90}" y="${H - 100}" text-anchor="end" font-family="${bodyFont}" font-size="18" fill="${GOLD_INK}">${esc(CLIENT_CONFIG.city)} · MAD</text>
  </svg>`;
}

export default function MenuCardPrinter() {
  const { t, locale } = useI18n();
  const allDishes = useDishes();
  const priceOverrides = useAdmin((s) => s.priceOverrides);
  const showToast = useUI((s) => s.showToast);
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

  const downloadSvg = () => {
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `maison-zaytoun-carte-${category}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const photosFor = async (list: Dish[]) =>
    Promise.all(list.slice(0, 7).map((dish) => imageToDataUrl(dish.image)));

  const downloadPng = async () => {
    const photos = await photosFor(dishes);
    const finalSvg = cardSvg(dishes, activeLabel, locale, photos);
    const blob = new Blob([finalSvg], { type: "image/svg+xml;charset=utf-8" });
    const objectUrl = URL.createObjectURL(blob);
    const image = new Image();
    image.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = W;
        canvas.height = H;
        canvas.getContext("2d")?.drawImage(image, 0, 0, W, H);
        canvas.toBlob((png) => {
          if (png) {
            const url = URL.createObjectURL(png);
            const link = document.createElement("a");
            link.href = url;
            link.download = `maison-zaytoun-carte-${category}.png`;
            link.click();
            URL.revokeObjectURL(url);
          } else {
            downloadSvg();
          }
        }, "image/png");
      } catch {
        downloadSvg();
      }
      URL.revokeObjectURL(objectUrl);
    };
    image.onerror = () => {
      downloadSvg();
      showToast(t("admin.downloadCard"));
    };
    image.src = objectUrl;
  };

  const printAll = async () => {
    const cache = new Map<string, string>();
    const pages = await Promise.all(
      categories.map(async (c) => {
        const list = allDishes
          .filter((dish) => dish.category === c.id && dish.available)
          .map((dish) => ({ ...dish, price: priceFor(dish, priceOverrides) }));
        const photos = await Promise.all(
          list.slice(0, 7).map(async (dish) => {
            if (!cache.has(dish.image)) cache.set(dish.image, await imageToDataUrl(dish.image));
            return cache.get(dish.image)!;
          })
        );
        return `<div class="page">${cardSvg(list, c.label, locale, photos)}</div>`;
      })
    );
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Maison Zaytoun — Cartes menu</title>
      <style>@page{size:A5 portrait;margin:0}html,body{margin:0;padding:0;background:${PAPER}}.page{width:148mm;height:210mm;overflow:hidden;break-after:page;page-break-after:always}.page svg{width:148mm;height:210mm;display:block}</style>
      </head><body>${pages.join("")}</body></html>`);
    win.document.close();
    win.focus();
    await Promise.all(
      Array.from(win.document.images).map((image) =>
        image.complete
          ? Promise.resolve()
          : new Promise<void>((resolve) => {
              image.onload = () => resolve();
              image.onerror = () => resolve();
            })
      )
    );
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
          onClick={() => void downloadPng()}
          className="inline-flex items-center gap-2 bg-brass px-4 py-2.5 text-[11px] text-espresso transition hover:bg-brass-light"
        >
          <Download className="size-4" />
          {t("admin.downloadCard")}
        </button>
        <button
          type="button"
          onClick={downloadSvg}
          className="inline-flex items-center gap-2 border border-brass/40 px-4 py-2.5 text-[11px] text-plaster transition hover:border-brass"
        >
          <FileCode className="size-4" />
          {t("admin.downloadSvg")}
        </button>
        <button
          type="button"
          onClick={() => void printAll()}
          className="inline-flex items-center gap-2 border border-brass/40 px-4 py-2.5 text-[11px] text-plaster transition hover:border-brass"
        >
          <Printer className="size-4" />
          {t("admin.printAllCards")}
        </button>
      </div>

      <div
        className="menu-card-preview mx-auto mt-6 w-full max-w-[320px] border border-brass/30 bg-white"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </section>
  );
}
