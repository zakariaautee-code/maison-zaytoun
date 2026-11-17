"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ShoppingBag } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useCartSummary } from "@/lib/store";

type CartBarProps = { onOpenCart: () => void };

export default function CartBar({ onOpenCart }: CartBarProps) {
  const { t, formatPrice } = useI18n();
  const { count, total } = useCartSummary();

  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ y: 92, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 92, opacity: 0 }}
          transition={{ type: "spring", damping: 28, stiffness: 320 }}
          className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6"
        >
          <div className="mx-auto flex max-w-2xl items-stretch gap-2 border border-brass/30 bg-espresso p-2">
            <button
              type="button"
              onClick={onOpenCart}
              className="flex min-w-0 flex-1 items-center gap-3 px-1.5 py-1 text-start transition hover:bg-plaster/5"
            >
              <span className="relative grid size-9 shrink-0 place-items-center border border-brass/40 text-brass-light">
                <ShoppingBag className="size-4" strokeWidth={1.7} />
                <span className="absolute -end-2 -top-2 grid min-w-[18px] place-items-center bg-saffron px-1 text-[9px] font-bold text-white">
                  {count}
                </span>
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[9px] font-semibold uppercase tracking-[0.18em] text-plaster/45">
                  {count} {count === 1 ? t("cart.item") : t("cart.items")}
                </span>
                <span className="block font-display text-xl leading-tight text-plaster">
                  {formatPrice(total)}
                </span>
              </span>
            </button>

            <button
              type="button"
              onClick={onOpenCart}
              className="group inline-flex shrink-0 items-center gap-2 bg-saffron px-4 py-3 text-[9px] font-extrabold uppercase tracking-[0.14em] text-white transition hover:bg-brass hover:text-espresso sm:px-6 sm:text-[10px]"
            >
              <span className="hidden sm:inline">{t("cart.viewOrder")}</span>
              <span className="sm:hidden">{t("cart.title")}</span>
              <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:rotate-180" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
