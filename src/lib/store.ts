"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { DISH_BY_ID } from "./menu-data";
import type { Dish } from "./types";

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

/** Price with owner pitch overrides, falling back to the live dish value. */
export function priceFor(dish: Dish, overrides: Record<string, number>): number {
  return overrides[dish.id] ?? dish.price;
}

/** Availability with owner pitch overrides, falling back to the live dish value. */
export function availableFor(
  dish: Dish,
  overrides: Record<string, boolean>
): boolean {
  return overrides[dish.id] ?? dish.available;
}

// ── Global UI state shared across every route ─────────────────────────────────
type UIState = {
  reserveOpen: boolean;
  toast: string | null;
  openReserve: () => void;
  closeReserve: () => void;
  showToast: (message: string) => void;
  clearToast: () => void;
};

export const useUI = create<UIState>((set) => ({
  reserveOpen: false,
  toast: null,
  openReserve: () => set({ reserveOpen: true }),
  closeReserve: () => set({ reserveOpen: false }),
  showToast: (toast) => set({ toast }),
  clearToast: () => set({ toast: null }),
}));
