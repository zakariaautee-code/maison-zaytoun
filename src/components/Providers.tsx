"use client";

import { useEffect, type ReactNode } from "react";
import GlobalOverlays from "@/components/GlobalOverlays";
import { I18nProvider } from "@/lib/i18n";
import { DishesContext } from "@/lib/dishes-context";
import { useAdmin, useCart } from "@/lib/store";
import type { Dish } from "@/lib/types";

export default function Providers({
  children,
  dishes,
}: {
  children: ReactNode;
  dishes: Dish[];
}) {
  useEffect(() => {
    // Rehydrate persisted stores after mount to avoid SSR/client mismatches.
    void useAdmin.persist.rehydrate();
    void useCart.persist.rehydrate();

    // Keep the customer menu in sync when the owner edits it in another tab.
    const onStorage = (event: StorageEvent) => {
      if (event.key === "mz-admin") void useAdmin.persist.rehydrate();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Readex+Pro:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <I18nProvider>
        <DishesContext.Provider value={dishes}>
          {children}
          <GlobalOverlays />
        </DishesContext.Provider>
      </I18nProvider>
    </>
  );
}
