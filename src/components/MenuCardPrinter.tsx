"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Download, FileCode, Printer } from "lucide-react";
import { CLIENT_CONFIG } from "@/config/client";
import { HERO_IMAGE } from "@/lib/constants";
import { useDishes } from "@/lib/dishes-context";
import { useI18n } from "@/lib/i18n";
import { CATEGORIES } from "@/lib/menu-data";
import { priceFor, useAdmin } from "@/lib/store";
import { useUI } from "@/lib/store";
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

function short(value: string, max: number): string {
  if (value.length <= max) return value;
  return value.slice(0, max - 1).trimEnd() + "…";
}

type CardDishes = Dish[];

function cardSvg(
  dishes: CardDishes,
  categoryLabel: string,
  locale: "fr" | "ar" | "en",
  imageUrls: string[] = []
): string {
  const rtl = locale === "ar";
  const photos = [
    dishes[0]?.image || HERO_IMAGE,
    dishes[1]?.image || dishes[0]?.image || HERO_IMAGE,
    dishes[2]?.image || dishes[0]?.image || HERO_IMAGE,
  ].map((url, i) => imageUrls[i] || url);

  const listRight = rtl ? W - 100 : 660;
  const listLeft = rtl ? 100 : 660;
  const nameX = rtl ? W - 100 : 100;
  const priceX = rtl ? 660 : W - 100;
  const nameAnchor = rtl ? "end" : "start";
  const priceAnchor = rtl ? "start" : "end";
  const photoCx = rtl ? 360 : 880;

  const rows = dishes
    .slice(0, 7)
    .map((dish, i) => {
      const y = 400 + i * 158;
      return `
        <text x="${nameX}" y="${y}" text-anchor="${nameAnchor}" font-family="Cormorant Garamond, Georgia, serif" font-size="36" fill="#F4EBDD">${esc(dish.name[locale])}</text>
        <text x="${priceX}" y="${y}" text-anchor="${priceAnchor}" font-family="Cormorant Garamond, Georgia, serif" font-size="30" fill="#C9A253">${dish.price} MAD</text>
        <text x="${nameX}" y="${y + 34}" text-anchor="${nameAnchor}" font-family="Plus Jakarta Sans, sans-serif" font-size="20" fill="#B9C7B8">${esc(short(dish.description[locale], 58))}</text>
        <line x1="${listLeft}" y1="${y + 58}" x2="${listRight}" y2="${y + 58}" stroke="#C9A253" stroke-opacity="0.28" stroke-width="1" />`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs>
      <clipPath id="mainPhoto"><circle cx="${photoCx}" cy="540" r="212" /></clipPath>
      <clipPath id="smallPhotoA"><circle cx="${photoCx - 130}" cy="900" r="66" /></clipPath>
      <clipPath id="smallPhotoB"><circle cx="${photoCx + 150}" cy="940" r="54" /></clipPath>
    </defs>
    <rect width="${W}" height="${H}" fill="#121A15" />
    <circle cx="${rtl ? 1080 : 160}" cy="${rtl ? 110 : 1650}" r="420" fill="#1B261F" opacity="0.55" />
    <rect x="46" y="46" width="${W - 92}" height="${H - 92}" fill="none" stroke="#C9A253" stroke-opacity="0.7" stroke-width="2" />
    <rect x="62" y="62" width="${W - 124}" height="${H - 124}" fill="none" stroke="#C9A253" stroke-opacity="0.25" stroke-width="1" />

    <text x="100" y="130" font-family="Plus Jakarta Sans, sans-serif" font-size="20" fill="#C9A253">${esc(CLIENT_CONFIG.restaurantName)}</text>
    <text x="100" y="225" font-family="Cormorant Garamond, Georgia, serif" font-style="italic" font-size="96" fill="#F4EBDD">Menu</text>
    <text x="100" y="275" font-family="Plus Jakarta Sans, sans-serif" font-size="19" fill="#C9A253">${esc(categoryLabel)}</text>
    <line x1="100" y1="310" x2="1140" y2="310" stroke="#C9A253" stroke-width="2" />

    <image href="${esc(photos[0])}" x="${photoCx - 212}" y="328" width="424" height="424" preserveAspectRatio="xMidYMid slice" clip-path="url(#mainPhoto)" />
    <circle cx="${photoCx}" cy="540" r="212" fill="none" stroke="#C9A253" stroke-width="4" />
    <image href="${esc(photos[1])}" x="${photoCx - 196}" y="834" width="132" height="132" preserveAspectRatio="xMidYMid slice" clip-path="url(#smallPhotoA)" />
    <circle cx="${photoCx - 130}" cy="900" r="66" fill="none" stroke="#C9A253" stroke-width="3" />
    <image href="${esc(photos[2])}" x="${photoCx + 96}" y="886" width="108" height="108" preserveAspectRatio="xMidYMid slice" clip-path="url(#smallPhotoB)" />
    <circle cx="${photoCx + 150}" cy="940" r="54" fill="none" stroke="#C9A253" stroke-width="3" />

    ${rows}

    <line x1="100" y1="${H - 130}" x2="1140" y2="${H - 130}" stroke="#C9A253" stroke-width="2" />
    <text x="100" y="${H - 82}" font-family="Plus Jakarta Sans, sans-serif" font-size="16" fill="#9AAE9F">${esc(CLIENT_CONFIG.city)} · ${esc(CLIENT_CONFIG.tagline)}</text>
    <text x="1140" y="${H - 82}" text-anchor="end" font-family="Plus Jakarta Sans, sans-serif" font-size="16" fill="#C9A253">Prix en MAD</text>
  </svg>`;
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

  const downloadPng = async () => {
    const photos = await Promise.all(
      dishes.slice(0, 3).map((dish) => imageToDataUrl(dish.image))
    );
    const finalSvg = cardSvg(dishes, activeLabel, locale, photos);
    const blob = new Blob([finalSvg], { type: "image/svg+xml;charset=utf-8" });
    const objectUrl = URL.createObjectURL(blob);
    const image = new Image();
    image.crossOrigin = "anonymous";
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
          list.slice(0, 3).map(async (dish) => {
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
      <style>@page{size:A5 portrait;margin:0}html,body{margin:0;padding:0;background:#fff}.page{width:148mm;height:210mm;overflow:hidden;break-after:page;page-break-after:always}.page svg{width:148mm;height:210mm;display:block}</style>
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
        className="menu-card-preview mx-auto mt-6 w-full max-w-[300px] border border-brass/30 bg-white"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </section>
  );
}
