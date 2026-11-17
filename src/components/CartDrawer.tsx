"use client";

import { useState } from "react";
import {
  Check,
  MapPin,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  Store,
  Trash2,
  Truck,
} from "lucide-react";
import Sheet from "./ui/Sheet";
import { DELIVERY_ZONES, EXTRA_PRICE } from "@/lib/constants";
import { useI18n, type TranslationKey } from "@/lib/i18n";
import { DISH_BY_ID } from "@/lib/menu-data";
import { getEffectivePrice, useAdmin, useCart, useCartSummary } from "@/lib/store";
import type { ServiceMode } from "@/lib/types";
import { buildOrderMessage, orderWaUrl } from "@/lib/whatsapp";

const EXTRA_LABELS: Record<string, TranslationKey> = {
  olives: "drawer.extra.olives",
  cheese: "drawer.extra.cheese",
  sauce: "drawer.extra.sauce",
};

type CartDrawerProps = { open: boolean; onClose: () => void };

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { t, locale, formatPrice } = useI18n();
  const { items, mode, zoneId, zone, count, subtotal, deliveryFee, total } =
    useCartSummary();
  const {
    setMode,
    setTableNumber,
    setDeliveryZoneId,
    setAddress,
    setOrderNote,
    setQuantity,
    removeItem,
    clear,
  } = useCart();
  const tableNumber = useCart((s) => s.tableNumber);
  const address = useCart((s) => s.address);
  const orderNote = useCart((s) => s.orderNote);
  const priceOverrides = useAdmin((s) => s.priceOverrides);
  const [splitCount, setSplitCount] = useState(1);
  const [splitOpen, setSplitOpen] = useState(false);

  const modes: { id: ServiceMode; label: string; icon: typeof Store }[] = [
    { id: "dine-in", label: t("cart.dineIn"), icon: Store },
    { id: "takeaway", label: t("cart.takeaway"), icon: ShoppingBag },
    { id: "delivery", label: t("cart.delivery"), icon: Truck },
  ];

  const addressMissing = mode === "delivery" && address.trim().length < 4;

  const checkout = () => {
    if (!items.length || addressMissing) return;
    const message = buildOrderMessage({
      t,
      locale,
      items,
      priceOverrides,
      mode,
      tableNumber,
      zoneName: zone?.name[locale] ?? "",
      address,
      orderNote,
      deliveryFee,
      subtotal,
      total,
      splitCount,
    });
    window.open(orderWaUrl(message), "_blank", "noopener,noreferrer");
  };

  return (
    <Sheet
      open={open}
      onClose={onClose}
      side="right"
      ariaLabel={t("cart.title")}
      title={
        <div>
          <p className="eyebrow text-brass">{t("cart.zeroCommission")}</p>
          <h2 className="mt-1.5 font-display text-2xl leading-tight text-plaster">
            {t("cart.title")}
          </h2>
        </div>
      }
    >
      {count === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <span className="grid size-16 place-items-center border border-brass/30 text-brass">
            <ShoppingBag className="size-7" strokeWidth={1.4} />
          </span>
          <p className="mt-6 font-display text-2xl text-plaster">{t("cart.empty")}</p>
          <p className="mt-2 max-w-[16rem] text-sm leading-relaxed text-plaster/45">
            {t("cart.emptyHint")}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-7 border border-brass/50 px-6 py-3 text-[10px] font-extrabold uppercase tracking-[0.16em] text-brass-light transition hover:bg-brass hover:text-espresso"
          >
            {t("cart.browse")}
          </button>
        </div>
      ) : (
        <>
          {/* ── Service mode ─────────────────────────────────────────────── */}
          <div className="pt-5">
            <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-plaster/50">
              {t("cart.mode")}
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {modes.map((item) => {
                const Icon = item.icon;
                const active = mode === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setMode(item.id)}
                    aria-pressed={active}
                    className={`relative flex flex-col items-center gap-2 border px-1 py-3 text-center text-[10px] font-semibold uppercase tracking-[0.08em] transition ${
                      active
                        ? "border-brass bg-brass text-espresso"
                        : "border-brass/25 text-plaster/55 hover:border-brass/60 hover:text-plaster"
                    }`}
                  >
                    <Icon className="size-[18px]" strokeWidth={1.7} />
                    {item.label}
                    {active && (
                      <Check className="absolute end-1.5 top-1.5 size-3" strokeWidth={3} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Mode-specific fields ─────────────────────────────────────── */}
          {mode === "dine-in" && (
            <div className="mt-4">
              <label
                htmlFor="table-number"
                className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-plaster/50"
              >
                {t("cart.tableNumber")}
              </label>
              <input
                id="table-number"
                type="number"
                min={1}
                max={20}
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder={t("cart.tablePlaceholder")}
                className="field"
              />
            </div>
          )}

          {mode === "delivery" && (
            <div className="mt-5 space-y-4">
              <div>
                <span className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-plaster/50">
                  <MapPin className="size-3 text-brass" />
                  {t("cart.zone")}
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {DELIVERY_ZONES.map((z) => {
                    const active = zoneId === z.id;
                    return (
                      <button
                        key={z.id}
                        type="button"
                        onClick={() => setDeliveryZoneId(z.id)}
                        aria-pressed={active}
                        className={`flex items-center justify-between gap-2 border px-3 py-2.5 text-start text-[11px] transition ${
                          active
                            ? "border-brass bg-brass/10 text-plaster"
                            : "border-brass/25 text-plaster/55 hover:border-brass/60"
                        }`}
                      >
                        <span className="truncate font-semibold">{z.name[locale]}</span>
                        <span
                          dir="ltr"
                          className={`shrink-0 text-[10px] font-semibold ${
                            active ? "text-brass-light" : "text-plaster/40"
                          }`}
                        >
                          +{z.fee} MAD
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label
                  htmlFor="delivery-address"
                  className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-plaster/50"
                >
                  {t("cart.address")}
                </label>
                <input
                  id="delivery-address"
                  dir="auto"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={t("cart.addressPlaceholder")}
                  className="field"
                />
                {addressMissing && (
                  <p className="mt-1.5 text-[11px] text-saffron">{t("cart.addressRequired")}</p>
                )}
              </div>
            </div>
          )}

          {(mode === "delivery" || mode === "dine-in") && (
            <div className="mt-4">
              <label
                htmlFor="order-note"
                className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-plaster/50"
              >
                {t("cart.orderNote")}
              </label>
              <input
                id="order-note"
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
                placeholder={t("cart.orderNotePlaceholder")}
                className="field"
              />
            </div>
          )}

          {/* ── Items ────────────────────────────────────────────────────── */}
          <div className="mt-7">
            <h3 className="mb-1 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.2em] text-plaster/50">
              <span>
                {t("cart.items")} ({count})
              </span>
            </h3>

            <div className="divide-y divide-brass/15 border-t border-brass/15">
              {items.map((item) => {
                const dish = DISH_BY_ID[item.dishId];
                const name = dish
                  ? dish.name[locale]
                  : item.notes || item.dishId;
                const unit =
                  (dish
                    ? getEffectivePrice(item.dishId, priceOverrides)
                    : item.unitPrice) + item.extras.length * EXTRA_PRICE;
                return (
                  <div key={item.key} className="py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-display text-lg leading-snug text-plaster">
                          {name}
                        </p>
                        {item.preference && (
                          <p className="mt-0.5 text-[11px] text-plaster/40">
                            {t(item.preference as TranslationKey)}
                          </p>
                        )}
                        {item.extras.length > 0 && (
                          <p className="mt-0.5 text-[11px] text-plaster/40">
                            +{" "}
                            {item.extras
                              .map((e) =>
                                t(EXTRA_LABELS[e] ?? (e as TranslationKey))
                              )
                              .join(", ")}
                          </p>
                        )}
                        {item.notes && (
                          <p className="mt-1 text-[11px] italic text-plaster/35">
                            “{item.notes}”
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.key)}
                        aria-label="Remove"
                        className="grid size-7 shrink-0 place-items-center text-plaster/30 transition hover:text-saffron"
                      >
                        <Trash2 className="size-4" strokeWidth={1.6} />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center border border-brass/25">
                        <button
                          type="button"
                          onClick={() => setQuantity(item.key, item.quantity - 1)}
                          aria-label="Decrease"
                          className="grid size-8 place-items-center text-plaster/60 transition hover:bg-brass/10 hover:text-brass-light"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-semibold text-plaster">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity(item.key, item.quantity + 1)}
                          aria-label="Increase"
                          className="grid size-8 place-items-center text-plaster/60 transition hover:bg-brass/10 hover:text-brass-light"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>
                      <span className="font-display text-lg text-brass-light">
                        {formatPrice(unit * item.quantity)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={clear}
              className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-plaster/35 transition hover:text-saffron"
            >
              <Trash2 className="size-3" />
              {t("cart.clear")}
            </button>
          </div>

          {/* ── Summary + checkout ───────────────────────────────────────── */}
          <div className="sticky bottom-0 -mx-5 mt-7 border-t border-brass/20 bg-espresso px-5 pb-2 pt-4 sm:-mx-7 sm:px-7">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-plaster/50">
                <span>{t("cart.subtotal")}</span>
                <span className="text-plaster/75">{formatPrice(subtotal)}</span>
              </div>
              {mode === "delivery" && (
                <div className="flex justify-between text-plaster/50">
                  <span>
                    {t("cart.deliveryFee")}
                    {zone ? ` · ${zone.name[locale]}` : ""}
                  </span>
                  <span className="text-plaster/75">{formatPrice(deliveryFee)}</span>
                </div>
              )}
              <div className="flex items-baseline justify-between border-t border-brass/20 pt-2.5">
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-plaster/60">
                  {t("cart.total")}
                </span>
                <span className="font-display text-2xl text-brass-light">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            <div className="mt-4 border border-brass/20">
              <button
                type="button"
                onClick={() => setSplitOpen((v) => !v)}
                className="flex w-full items-center justify-between px-4 py-3 text-left text-[10px] font-semibold tracking-[0.14em] text-plaster/70 transition-colors hover:text-plaster"
              >
                {t("cart.split")}
                <span className="text-brass-light">{splitCount > 1 ? `×${splitCount}` : "+"}</span>
              </button>
              {splitOpen && (
                <div className="border-t border-brass/20 px-4 py-3">
                  <p className="mb-3 text-[10px] text-plaster/40">{t("cart.splitHint")}</p>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center border border-brass/25">
                      <button
                        type="button"
                        aria-label="Decrease"
                        onClick={() => setSplitCount((n) => Math.max(1, n - 1))}
                        className="grid size-8 place-items-center text-plaster/70 transition hover:bg-brass/10"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-xs font-semibold tabular-nums text-plaster">
                        {splitCount}
                      </span>
                      <button
                        type="button"
                        aria-label="Increase"
                        onClick={() => setSplitCount((n) => Math.min(12, n + 1))}
                        className="grid size-8 place-items-center text-plaster/70 transition hover:bg-brass/10"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-display text-lg text-brass-light">
                      {formatPrice(Math.round((total / splitCount) * 100) / 100)}{" "}
                      <span className="font-sans text-[10px] text-plaster/40">
                        {t("cart.perPerson")}
                      </span>
                    </span>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={checkout}
              disabled={addressMissing}
              className="mt-4 flex w-full items-center justify-center gap-2 bg-saffron px-5 py-4 text-[10px] font-extrabold uppercase tracking-[0.13em] text-white transition hover:bg-brass hover:text-espresso disabled:cursor-not-allowed disabled:bg-espresso-raised disabled:text-plaster/35"
            >
              <MessageCircle className="size-4" strokeWidth={1.9} />
              {t("cart.checkout")}
            </button>
            <p className="mt-2.5 text-center text-[10px] leading-relaxed text-plaster/35">
              {t("cart.checkoutHint")}
            </p>
          </div>
        </>
      )}
    </Sheet>
  );
}
