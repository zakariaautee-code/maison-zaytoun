"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import DishDrawer from "@/components/DishDrawer";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import MenuSection from "@/components/MenuSection";
import SpecialBanner from "@/components/SpecialBanner";
import { CLIENT_CONFIG } from "@/config/client";
import { useI18n } from "@/lib/i18n";
import { DISH_BY_ID } from "@/lib/menu-data";
import { useUI } from "@/lib/store";
import type { Dish } from "@/lib/types";

export default function MenuPage() {
  const { t } = useI18n();
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [table, setTable] = useState("");
  const openReserve = useUI((s) => s.openReserve);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const value = params.get("table");
    if (value && /^\d+$/.test(value)) setTable(value);
    const dishId = params.get("dish");
    if (dishId && DISH_BY_ID[dishId]) setSelectedDish(DISH_BY_ID[dishId]);
  }, []);

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
            <h1 className="hidden truncate font-display text-lg text-plaster sm:block">
              {t("menuPage.title")}
            </h1>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <LanguageSwitcher compact />
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
        <MenuSection onOpenDish={setSelectedDish} />
        <div className="bg-espresso py-10 text-center text-[12px] text-plaster/50">
          {CLIENT_CONFIG.restaurantName} · {CLIENT_CONFIG.city}
        </div>
      </div>

      <div className="sticky bottom-0 z-30 border-t border-brass/30 bg-espresso p-3">
        <button
          type="button"
          onClick={openReserve}
          className="mx-auto flex w-full max-w-md items-center justify-center gap-2 bg-terracotta px-5 py-3.5 text-[12px] font-medium text-white transition-colors hover:bg-brass hover:text-espresso"
        >
          <CalendarDays className="size-4" strokeWidth={1.5} />
          {t("hero.ctaReserve")}
        </button>
      </div>

      <DishDrawer dish={selectedDish} onClose={() => setSelectedDish(null)} />
    </main>
  );
}
