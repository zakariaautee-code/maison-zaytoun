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
  const { t } = useI18n();
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
    <main className="relative z-10 min-h-screen bg-plaster">
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="mx-auto flex h-[68px] max-w-[1400px] items-center justify-between gap-3 border-b border-brass/20 bg-espresso px-4 text-plaster sm:px-7">
          <div className="flex min-w-0 items-center gap-4">
            <Link
              href="/"
              className="whitespace-nowrap text-[11px] text-plaster/60 transition-colors hover:text-brass-light"
            >
              {t("menuPage.back")}
            </Link>
            <span className="hidden h-4 w-px bg-brass/25 sm:block" />
            <h1 className="hidden truncate font-display text-lg sm:block">
              {t("menuPage.title")}
            </h1>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            {table && (
              <span className="hidden border border-brass/40 px-3 py-1.5 text-[10px] tracking-[0.14em] text-brass-light sm:inline">
                {t("menuPage.table")} {table}
              </span>
            )}
            <LanguageSwitcher compact />
            <button
              type="button"
              onClick={openCart}
              aria-label={t("cart.title")}
              className="relative flex items-center gap-2 text-plaster/70 transition-colors hover:text-brass-light"
            >
              <ShoppingBag className="size-[18px]" strokeWidth={1.5} />
              {count > 0 && (
                <span className="border border-brass/40 px-1.5 text-[11px] tabular-nums text-brass-light">
                  {count}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={openReserve}
              className="bg-terracotta px-4 py-2.5 text-[11px] font-medium text-white transition-colors hover:bg-brass hover:text-espresso"
            >
              {t("nav.reserve")}
            </button>
          </div>
        </div>
      </header>

      <div className="pt-[80px]">
        {table && (
          <div className="border-b border-brass/20 bg-plaster-deep px-5 py-3 text-center text-[12px] text-ink">
            {t("menuPage.table")} {table}
          </div>
        )}
        <SpecialBanner />
        <MenuSection onOpenDish={setSelectedDish} orderable />
        <div className="bg-espresso py-10 text-center text-[12px] text-plaster/50">
          {CLIENT_CONFIG.restaurantName} · {CLIENT_CONFIG.city}
        </div>
      </div>

      <div className="sticky bottom-0 z-30 grid grid-cols-2 gap-2 border-t border-brass/30 bg-espresso p-3">
        <button
          type="button"
          onClick={openCart}
          className="inline-flex items-center justify-center gap-2 bg-terracotta px-4 py-3.5 text-[12px] font-medium text-white transition-colors hover:bg-brass hover:text-espresso"
        >
          <ShoppingBag className="size-4" />
          {t("cart.title")} {count > 0 ? `(${count})` : ""}
        </button>
        <button
          type="button"
          onClick={openReserve}
          className="inline-flex items-center justify-center gap-2 border border-brass/50 px-4 py-3.5 text-[12px] text-plaster transition-colors hover:bg-brass hover:text-espresso"
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
