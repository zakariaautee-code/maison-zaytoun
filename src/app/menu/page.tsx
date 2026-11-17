"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import DishDrawer from "@/components/DishDrawer";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import MenuSection from "@/components/MenuSection";
import SpecialBanner from "@/components/SpecialBanner";
import TableServiceButton from "@/components/TableServiceModal";
import { useI18n } from "@/lib/i18n";
import { DISH_BY_ID } from "@/lib/menu-data";
import { useCart, useCartSummary, useUI } from "@/lib/store";
import type { Dish } from "@/lib/types";
import { CLIENT_CONFIG } from "@/config/client";

export default function MenuPage() {
  const { t } = useI18n();
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const setTableNumber = useCart((s) => s.setTableNumber);
  const setMode = useCart((s) => s.setMode);
  const tableNumber = useCart((s) => s.tableNumber);
  const { count } = useCartSummary();
  const openCart = useUI((s) => s.openCart);

  useEffect(() => {
    void Promise.resolve(useCart.persist.rehydrate()).then(() => {
      const params = new URLSearchParams(window.location.search);
      const table = params.get("table");
      if (table && /^\d+$/.test(table)) {
        setTableNumber(table);
        setMode("dine-in");
      }
      const dishId = params.get("dish");
      if (dishId && DISH_BY_ID[dishId]) setSelectedDish(DISH_BY_ID[dishId]);
    });
  }, [setMode, setTableNumber]);

  return (
    <main className="relative z-10 min-h-screen bg-plaster">
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
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
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
            {tableNumber.trim() && (
              <span className="hidden border border-brass/40 px-3 py-1.5 text-[10px] tracking-[0.14em] text-brass-light sm:inline">
                {t("menuPage.table")} {tableNumber.trim()}
              </span>
            )}
            <TableServiceButton />
            <LanguageSwitcher compact />
            <button
              type="button"
              onClick={openCart}
              aria-label={t("common.cart")}
              className="relative grid size-9 place-items-center text-plaster/70 transition-colors hover:text-brass-light"
            >
              <ShoppingBag className="size-[18px]" strokeWidth={1.5} />
              {count > 0 && (
                <span className="absolute -end-1 -top-1 grid min-w-[17px] place-items-center rounded-full bg-saffron px-1 text-[9px] font-bold text-white tabular-nums">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="pt-[80px]">
        <SpecialBanner />
        <MenuSection onOpenDish={setSelectedDish} />
        <div className="bg-espresso py-8 text-center text-[10px] tracking-[0.16em] text-plaster/40">
          {CLIENT_CONFIG.restaurantName} · {CLIENT_CONFIG.city} · {t("cart.zeroCommission")}
        </div>
      </div>

      <DishDrawer dish={selectedDish} onClose={() => setSelectedDish(null)} />
    </main>
  );
}
