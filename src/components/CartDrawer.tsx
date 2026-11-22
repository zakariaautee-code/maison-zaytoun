"use client";

import { MessageCircle, Minus, Plus, Trash2 } from "lucide-react";
import Sheet from "./ui/Sheet";
import { clarityEvent } from "@/lib/clarity";
import { useI18n } from "@/lib/i18n";
import { useAdmin, useCart, useUI } from "@/lib/store";
import { buildOrderMessage, orderWaUrl } from "@/lib/whatsapp";

export default function CartDrawer() {
  const { t, locale, formatPrice } = useI18n();
  const open = useUI((s) => s.cartOpen);
  const close = useUI((s) => s.closeCart);
  const { items, tableNumber, addItem: _, removeItem, setQuantity, clear } = useCart();
  const showToast = useUI((s) => s.showToast);
  const priceOverrides = useAdmin((s) => s.priceOverrides);
  void _;
  void priceOverrides;

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const checkout = () => {
    if (!items.length) return;
    const message = buildOrderMessage({
      t,
      locale,
      items,
      tableNumber,
      total,
    });
    clarityEvent("order_click");
    window.open(orderWaUrl(message), "_blank", "noopener,noreferrer");
    showToast(t("cart.checkoutHint"));
  };

  return (
    <Sheet
      open={open}
      onClose={close}
      side="right"
      ariaLabel={t("cart.title")}
      title={
        <div>
          <p className="eyebrow text-brass">
            {t("cart.table")} {tableNumber || "—"}
          </p>
          <h2 className="mt-1 font-display text-2xl text-plaster">{t("cart.title")}</h2>
        </div>
      }
    >
      {items.length === 0 ? (
        <p className="py-20 text-center text-[15px] text-plaster/50">{t("cart.empty")}</p>
      ) : (
        <div className="pt-5">
          <div className="divide-y divide-brass/15 border-y border-brass/15">
            {items.map((item) => (
              <div key={item.key} className="flex items-center gap-3 py-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-lg text-plaster">{item.name}</p>
                  <p className="text-[12px] text-brass-light">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
                <div className="flex items-center border border-brass/25">
                  <button
                    type="button"
                    aria-label="Decrease"
                    onClick={() => setQuantity(item.key, item.quantity - 1)}
                    className="grid size-8 place-items-center text-plaster/70 transition hover:bg-brass/10"
                  >
                    <Minus className="size-3" />
                  </button>
                  <span className="w-7 text-center text-xs font-semibold tabular-nums text-plaster">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase"
                    onClick={() => setQuantity(item.key, item.quantity + 1)}
                    className="grid size-8 place-items-center text-plaster/70 transition hover:bg-brass/10"
                  >
                    <Plus className="size-3" />
                  </button>
                </div>
                <button
                  type="button"
                  aria-label="Remove"
                  onClick={() => removeItem(item.key)}
                  className="text-plaster/35 transition hover:text-saffron"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              onClick={clear}
              className="text-[11px] text-plaster/40 underline-offset-4 hover:underline"
            >
              {t("cart.clear")}
            </button>
            <span className="font-display text-2xl text-brass-light">
              {t("cart.total")} · {formatPrice(total)}
            </span>
          </div>

          <button
            type="button"
            onClick={checkout}
            className="mt-6 flex w-full items-center justify-center gap-2 bg-terracotta px-5 py-3.5 text-[12px] font-medium text-white transition-colors hover:bg-brass hover:text-espresso"
          >
            <MessageCircle className="size-4" />
            {t("cart.checkout")}
          </button>
          <p className="mt-2 text-center text-[11px] text-plaster/40">
            {t("cart.checkoutHint")}
          </p>
        </div>
      )}
    </Sheet>
  );
}
