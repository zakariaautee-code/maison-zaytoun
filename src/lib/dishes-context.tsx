"use client";

import { createContext, useContext } from "react";
import { MENU } from "./menu-data";
import type { Dish } from "./types";

export const DishesContext = createContext<Dish[]>(MENU);

export function useDishes(): Dish[] {
  return useContext(DishesContext);
}
