"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useI18n } from "@/lib/i18n";

type SheetProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  side?: "bottom" | "right";
  title?: ReactNode;
  ariaLabel?: string;
};

export default function Sheet({
  open,
  onClose,
  children,
  side = "bottom",
  title,
  ariaLabel,
}: SheetProps) {
  const [mounted, setMounted] = useState(false);
  const { t, isRTL } = useI18n();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!mounted) return null;

  const isBottom = side === "bottom";
  const panelMotion = isBottom
    ? { initial: { y: "100%" }, animate: { y: 0 }, exit: { y: "100%" } }
    : {
        initial: { x: isRTL ? "-100%" : "100%" },
        animate: { x: 0 },
        exit: { x: isRTL ? "-100%" : "100%" },
      };

  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          className={`fixed inset-0 z-[100] flex ${
            isBottom ? "items-end justify-center" : "justify-end"
          }`}
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel}
        >
          <motion.div
            className="absolute inset-0 bg-espresso/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
          />

          <motion.div
            {...panelMotion}
            transition={{ type: "spring", damping: 32, stiffness: 340 }}
            className={`relative flex max-h-[94dvh] w-full flex-col overflow-hidden border-brass/25 bg-espresso text-plaster ${
              isBottom
                ? "border-t sm:max-w-2xl"
                : "h-dvh border-s sm:max-w-[460px]"
            }`}
          >
            {/* 3% plaster grain across the sheet */}
            <div className="pointer-events-none absolute inset-0 bg-grain opacity-[0.03]" />

            {isBottom && (
              <div className="relative flex justify-center pt-3">
                <span className="h-px w-12 bg-brass/45" />
              </div>
            )}

            <div className="relative flex items-start justify-between gap-4 border-b border-brass/15 px-5 py-4 sm:px-7">
              <div className="min-w-0">{title}</div>
              <button
                type="button"
                onClick={onClose}
                aria-label={t("common.close")}
                className="grid size-9 shrink-0 place-items-center border border-brass/30 text-plaster/60 transition hover:border-brass hover:text-brass-light"
              >
                <X className="size-[18px]" strokeWidth={1.6} />
              </button>
            </div>

            <div className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 sm:px-7">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
