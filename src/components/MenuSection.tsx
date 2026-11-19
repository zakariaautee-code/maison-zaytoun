"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Flame, Leaf, Search, WheatOff, X } from "lucide-react";
import { useMemo, useState } from "react";
import DishCard from "./DishCard";
import { CATEGORIES } from "@/lib/menu-data";
import { availableFor, priceFor, useAdmin } from "@/lib/store";
import { useDishes } from "@/lib/dishes-context";
import { useI18n } from "@/lib/i18n";
import type { CategoryId, DietaryTag, Dish } from "@/lib/types";

const FILTERS: {
  id: DietaryTag;
  labelKey: "filter.vegetarian" | "filter.spicy" | "filter.glutenFree";
  icon: typeof Leaf;
}[] = [
  { id: "vegetarian", labelKey: "filter.vegetarian", icon: Leaf },
  { id: "spicy", labelKey: "filter.spicy", icon: Flame },
  { id: "gluten-free", labelKey: "filter.glutenFree", icon: WheatOff },
];

type MenuSectionProps = {
  onOpenDish: (dish: Dish) => void;
  orderable?: boolean;
};

export default function MenuSection({ onOpenDish, orderable = false }: MenuSectionProps) {
  const { t, locale } = useI18n();
  const allDishes = useDishes();
  const [category, setCategory] = useState<CategoryId | "all">("all");
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<DietaryTag[]>([]);
  const priceOverrides = useAdmin((s) => s.priceOverrides);
  const availabilityOverrides = useAdmin((s) => s.availabilityOverrides);

  const toggleFilter = (tag: DietaryTag) =>
    setFilters((prev) =>
      prev.includes(tag) ? prev.filter((f) => f !== tag) : [...prev, tag]
    );

  const dishes = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allDishes.filter((dish) => {
      if (category !== "all" && dish.category !== category) return false;
      if (filters.length && !filters.every((f) => dish.tags.includes(f))) return false;
      if (!q) return true;
      return (
        dish.name.fr.toLowerCase().includes(q) ||
        dish.name.en.toLowerCase().includes(q) ||
        dish.name.ar.includes(q) ||
        dish.description[locale].toLowerCase().includes(q)
      );
    });
  }, [allDishes, category, query, filters, locale]);

  const tabs: { id: CategoryId | "all"; label: string }[] = [
    { id: "all", label: t("menu.all") },
    ...CATEGORIES.map((cat) => ({ id: cat.id, label: cat.label[locale] })),
  ];

  return (
    <section id="menu" className="heritage relative scroll-mt-[76px] bg-zellige">
      {/* ── Section head ─────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-5 pt-16 sm:px-8 sm:pt-20">
        <div className="flex flex-col items-center gap-6 border-b border-[#C9A870]/30 pb-10 text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#C9A870]/60" />
            <span className="text-[11px] font-medium tracking-[0.3em] text-aubergine-soft">
              {t("menu.eyebrow")}
            </span>
            <span className="h-px w-8 bg-[#C9A870]/60" />
          </div>
          <h2 className="font-display text-4xl leading-[1.03] text-aubergine sm:text-5xl">
            {t("menu.title")}
          </h2>
          <p className="max-w-xl text-[14px] leading-[1.9] text-aubergine-soft">
            {t("menu.subtitle")}
          </p>
        </div>
      </div>

      {/* ── Sticky editorial category bar ────────────────────────────────── */}
      <div className="sticky top-16 z-30 mt-10 border-y border-[#C9A870]/25 bg-aubergine">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div
            role="tablist"
            aria-label={t("common.menu")}
            className="no-scrollbar flex gap-6 overflow-x-auto pt-4 [mask-image:linear-gradient(to_right,transparent_0,black_10px,black_calc(100%-10px),transparent_100%)] sm:gap-8"
          >
            {tabs.map((tab) => {
              const active = category === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  type="button"
                  aria-selected={active}
                  onClick={() => setCategory(tab.id)}
                  className={`relative shrink-0 whitespace-nowrap pb-3 text-[11px] font-medium tracking-[0.14em] transition-colors ${
                    active ? "text-[#E6CFA0]" : "text-zellige/55 hover:text-zellige/90"
                  }`}
                >
                  {tab.label}
                  {active && (
                    <motion.span
                      layoutId="menu-tab-underline"
                      transition={{ type: "spring", stiffness: 400, damping: 34 }}
                      className="absolute inset-x-0 bottom-0 h-px bg-[#C9A870]"
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-3 border-t border-[#C9A870]/15 py-3 lg:flex-row lg:items-center lg:gap-5">
            <div className="relative w-full lg:max-w-xs">
              <Search className="pointer-events-none absolute start-3 top-1/2 size-3.5 -translate-y-1/2 text-[#C9A870]" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("menu.search")}
                className="w-full border border-[#C9A870]/30 bg-transparent py-2 ps-9 pe-3 text-xs text-zellige transition placeholder:text-zellige/35 focus:border-[#C9A870] focus:bg-[#C9A870]/10 focus:outline-none"
              />
            </div>

            <div className="no-scrollbar flex items-center gap-2 overflow-x-auto">
              {FILTERS.map((filter) => {
                const Icon = filter.icon;
                const active = filters.includes(filter.id);
                return (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => toggleFilter(filter.id)}
                    aria-pressed={active}
                    className={`inline-flex shrink-0 items-center gap-1.5 border px-2.5 py-1.5 text-[10px] font-medium tracking-[0.1em] transition ${
                      active
                        ? "border-[#C9A870] bg-[#C9A870] text-aubergine-deep"
                        : "border-[#C9A870]/30 text-zellige/60 hover:border-[#C9A870]/70 hover:text-zellige"
                    }`}
                  >
                    <Icon className="size-3" strokeWidth={1.8} />
                    {t(filter.labelKey)}
                  </button>
                );
              })}
              {(filters.length > 0 || query) && (
                <button
                  type="button"
                  onClick={() => {
                    setFilters([]);
                    setQuery("");
                  }}
                  className="inline-flex shrink-0 items-center gap-1 text-[10px] font-medium tracking-[0.1em] text-zellige/45 transition hover:text-[#E6CFA0]"
                >
                  <X className="size-3" />
                  {t("filter.clear")}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Dish grid ────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-5 pb-20 pt-8 sm:px-8 sm:pb-28">
        <p className="mb-6 flex items-center gap-3 text-[10px] font-medium tracking-[0.16em] text-aubergine-soft">
          <span className="h-px w-8 bg-[#C9A870]/70" />
          {dishes.length} {t("menu.results")}
        </p>

        {dishes.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 gap-x-6 gap-y-11 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {dishes.map((dish) => (
                <DishCard
                  key={dish.id}
                  dish={dish}
                  price={priceFor(dish, priceOverrides)}
                  available={availableFor(dish, availabilityOverrides)}
                  onOpen={onOpenDish}
                  orderable={orderable}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="border border-dashed border-[#C9A870]/50 px-6 py-20 text-center">
            <p className="font-display text-2xl text-aubergine">{t("menu.noResults")}</p>
            <p className="mt-2 text-sm text-aubergine-soft">{t("menu.noResultsHint")}</p>
          </div>
        )}
      </div>
    </section>
  );
}
