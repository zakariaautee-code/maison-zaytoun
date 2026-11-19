"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, ShoppingBag } from "lucide-react";
import DishDrawer from "@/components/DishDrawer";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import MenuSection from "@/components/MenuSection";
import RiadDoorIntro from "@/components/RiadDoorIntro";
import SpecialBanner from "@/components/SpecialBanner";
import { CLIENT_CONFIG } from "@/config/client";
import { useI18n } from "@/lib/i18n";
import { DISH_BY_ID } from "@/lib/menu-data";
import { useCart, useUI } from "@/lib/store";
import type { Dish } from "@/lib/types";

export default function MenuPage() {
  const { t, locale } = useI18n();
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [table, setTable] = useState("");
  const openReserve = useUI((s) => s.openReserve);
  const openCart = useUI((s) => s.openCart);
  const setTableNumber = useCart((s) => s.setTableNumber);
  const count = useCart((s) => s.items.reduce((sum, item) => sum + item.quantity, 0));

  useEffect(() => {
    void Promise.resolve(useCart.persist.rehydrate()).then(() => {
      const params = new URLSearchParams(window.location.search);
      const value = params.get("table");
      if (value && /^\d+$/.test(value)) {
        setTable(value);
        setTableNumber(value);
      }
      const dishId = params.get("dish");
      if (dishId && DISH_BY_ID[dishId]) setSelectedDish(DISH_BY_ID[dishId]);
    });
  }, [setTableNumber]);

  return (
    <main className="heritage relative z-10 min-h-screen bg-zellige">
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="mx-auto flex h-[68px] max-w-[1400px] items-center justify-between gap-3 border-b border-[#C9A870]/30 bg-aubergine-deep px-4 text-zellige sm:px-7">
          <div className="flex min-w-0 items-center gap-4">
            <Link
              href="/"
              className="whitespace-nowrap text-[11px] text-zellige/70 transition-colors hover:text-[#E6CFA0]"
            >
              {t("menuPage.back")}
            </Link>
            <span className="hidden h-4 w-px bg-[#C9A870]/35 sm:block" />
            <h1 className="hidden truncate font-display text-lg sm:block">
              {t("menuPage.title")}
            </h1>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            {table && (
              <span className="hidden border border-[#C9A870]/45 px-3 py-1.5 text-[11px] tracking-[0.14em] text-[#E6CFA0] sm:inline">
                {t("menuPage.table")} {table}
              </span>
            )}
            <LanguageSwitcher compact />
            <button
              type="button"
              onClick={openCart}
              aria-label={t("cart.title")}
              className="relative flex items-center gap-2 text-zellige/75 transition-colors hover:text-[#E6CFA0]"
            >
              <ShoppingBag className="size-[18px]" strokeWidth={1.5} />
              {count > 0 && (
                <span className="border border-[#C9A870]/45 px-1.5 text-[11px] tabular-nums text-[#E6CFA0]">
                  {count}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={openReserve}
              className="bg-[#C9A870] px-4 py-2.5 text-[11px] font-medium text-aubergine-deep transition-colors hover:bg-[#E6CFA0]"
            >
              {t("nav.reserve")}
            </button>
          </div>
        </div>
      </header>

      <div className="pt-[80px]">
        {table && (
          <div className="border-b border-[#C9A870]/25 bg-zellige px-5 py-3 text-center text-[12px] text-aubergine">
            {t("menuPage.table")} {table}
          </div>
        )}
        <section className="pattern-riad relative overflow-hidden border-b border-[#C9A870]/25">
          <div className="pointer-events-none absolute inset-0 bg-aubergine/85" aria-hidden="true" />
          <div className="relative mx-auto max-w-[1400px] px-5 py-14 text-center sm:px-8 sm:py-20">
            <p className="text-[11px] font-medium tracking-[0.32em] text-[#E6CFA0]">
              {CLIENT_CONFIG.restaurantName}
            </p>
            <div className="mx-auto mt-5 flex items-center justify-center gap-4">
              <span className="h-px w-10 bg-[#C9A870]/60" />
              <span className="text-[#C9A870]">✦</span>
              <span className="h-px w-10 bg-[#C9A870]/60" />
            </div>
            <h2 className="mx-auto mt-5 max-w-3xl font-display text-4xl leading-[1.1] text-zellige sm:text-6xl">
              {t("menu.title")}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[14px] leading-[1.9] text-zellige/70">
              {t("menu.subtitle")}
            </p>
            <p className="mt-6 text-[11px] tracking-[0.22em] text-[#E6CFA0]">
              {locale === "ar" ? "دار زيتون" : CLIENT_CONFIG.tagline}
            </p>
          </div>
        </section>
        <SpecialBanner />
        <MenuSection onOpenDish={setSelectedDish} orderable />
        <div className="bg-aubergine-deep py-10 text-center text-[12px] text-zellige/55">
          {CLIENT_CONFIG.restaurantName} · {CLIENT_CONFIG.city}
        </div>
      </div>

      <div className="sticky bottom-0 z-30 grid grid-cols-2 gap-2 border-t border-[#C9A870]/30 bg-aubergine-deep p-3">
        <button
          type="button"
          onClick={openCart}
          className="inline-flex items-center justify-center gap-2 bg-[#C9A870] px-4 py-3.5 text-[12px] font-medium text-aubergine-deep transition-colors hover:bg-[#E6CFA0]"
        >
          <ShoppingBag className="size-4" />
          {t("cart.title")} {count > 0 ? `(${count})` : ""}
        </button>
        <button
          type="button"
          onClick={openReserve}
          className="inline-flex items-center justify-center gap-2 border border-[#C9A870]/60 px-4 py-3.5 text-[12px] text-zellige transition-colors hover:bg-[#C9A870]/15"
        >
          <CalendarDays className="size-4" strokeWidth={1.5} />
          {t("hero.ctaReserve")}
        </button>
      </div>

      <DishDrawer
        dish={selectedDish}
        onClose={() => setSelectedDish(null)}
        orderable
      />
      <RiadDoorIntro force={Boolean(table)} />
    </main>
  );
}
