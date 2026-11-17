"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { DELIVERY_ZONES, EXTRA_PRICE } from "./constants";
import { DISH_BY_ID } from "./menu-data";
import type { CartItem, DishCustomization, ServiceMode } from "./types";

export function makeItemKey(
  dishId: string,
  customization: DishCustomization
): string {
  return [
    dishId,
    customization.preference,
    [...customization.extras].sort().join("+"),
    customization.notes.trim(),
  ].join("|");
}

// ── Cart store ───────────────────────────────────────────────────────────────
type CartState = {
  items: CartItem[];
  mode: ServiceMode;
  tableNumber: string;
  deliveryZoneId: string;
  address: string;
  orderNote: string;
  addItem: (dishId: string, customization: DishCustomization, quantity: number, unitPrice: number) => void;
  removeItem: (key: string) => void;
  setQuantity: (key: string, quantity: number) => void;
  clear: () => void;
  setMode: (mode: ServiceMode) => void;
  setTableNumber: (value: string) => void;
  setDeliveryZoneId: (value: string) => void;
  setAddress: (value: string) => void;
  setOrderNote: (value: string) => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      mode: "dine-in",
      tableNumber: "",
      deliveryZoneId: "maarif",
      address: "",
      orderNote: "",
      addItem: (dishId, customization, quantity, unitPrice) =>
        set((state) => {
          const key = makeItemKey(dishId, customization);
          const existing = state.items.find((item) => item.key === key);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.key === key
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          const next: CartItem = {
            key,
            dishId,
            quantity,
            ...customization,
            unitPrice,
          };
          return { items: [...state.items, next] };
        }),
      removeItem: (key) =>
        set((state) => ({ items: state.items.filter((item) => item.key !== key) })),
      setQuantity: (key, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((item) => item.key !== key)
              : state.items.map((item) =>
                  item.key === key ? { ...item, quantity } : item
                ),
        })),
      clear: () => set({ items: [] }),
      setMode: (mode) => set({ mode }),
      setTableNumber: (tableNumber) => set({ tableNumber }),
      setDeliveryZoneId: (deliveryZoneId) => set({ deliveryZoneId }),
      setAddress: (address) => set({ address }),
      setOrderNote: (orderNote) => set({ orderNote }),
    }),
    {
      name: "mz-cart",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
);

// ── Admin (owner demo) store ─────────────────────────────────────────────────
export type SpecialMode = {
  active: boolean;
  title: string;
  price: number;
};

type AdminState = {
  priceOverrides: Record<string, number>;
  availabilityOverrides: Record<string, boolean>;
  special: SpecialMode;
  setPrice: (dishId: string, price: number) => void;
  toggleAvailability: (dishId: string) => void;
  setSpecial: (patch: Partial<SpecialMode>) => void;
  reset: () => void;
};

export const useAdmin = create<AdminState>()(
  persist(
    (set) => ({
      priceOverrides: {},
      availabilityOverrides: {},
      special: { active: false, title: "Formule Midi", price: 120 },
      setSpecial: (patch) =>
        set((state) => ({ special: { ...state.special, ...patch } })),
      setPrice: (dishId, price) =>
        set((state) => ({
          priceOverrides: { ...state.priceOverrides, [dishId]: price },
        })),
      toggleAvailability: (dishId) =>
        set((state) => ({
          availabilityOverrides: {
            ...state.availabilityOverrides,
            [dishId]: !isAvailable(dishId, state.availabilityOverrides),
          },
        })),
      reset: () =>
        set({
          priceOverrides: {},
          availabilityOverrides: {},
          special: { active: false, title: "Formule Midi", price: 120 },
        }),
    }),
    {
      name: "mz-admin",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
);

export function getEffectivePrice(
  dishId: string,
  overrides: Record<string, number>
): number {
  return overrides[dishId] ?? DISH_BY_ID[dishId]?.price ?? 0;
}

export function isAvailable(
  dishId: string,
  overrides: Record<string, boolean>
): boolean {
  return overrides[dishId] ?? DISH_BY_ID[dishId]?.available ?? true;
}

/** Combined, reactive cart summary used by the UI. */
export function useCartSummary() {
  const items = useCart((s) => s.items);
  const mode = useCart((s) => s.mode);
  const zoneId = useCart((s) => s.deliveryZoneId);
  const priceOverrides = useAdmin((s) => s.priceOverrides);

  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => {
    const base = DISH_BY_ID[item.dishId]
      ? getEffectivePrice(item.dishId, priceOverrides)
      : item.unitPrice;
    return sum + (base + item.extras.length * EXTRA_PRICE) * item.quantity;
  }, 0);
  const zone = DELIVERY_ZONES.find((z) => z.id === zoneId);
  const deliveryFee = mode === "delivery" ? (zone?.fee ?? 0) : 0;

  return {
    items,
    mode,
    zoneId,
    zone,
    count,
    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee,
  };
}

// ── Global UI overlays (shared across every route) ────────────────────────────
type UIState = {
  cartOpen: boolean;
  reserveOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  openReserve: () => void;
  closeReserve: () => void;
};

export const useUI = create<UIState>((set) => ({
  cartOpen: false,
  reserveOpen: false,
  openCart: () => set({ cartOpen: true }),
  closeCart: () => set({ cartOpen: false }),
  openReserve: () => set({ reserveOpen: true }),
  closeReserve: () => set({ reserveOpen: false }),
}));
