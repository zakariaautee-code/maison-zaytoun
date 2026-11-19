"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Leaf } from "lucide-react";
import { CLIENT_CONFIG } from "@/config/client";
import { useI18n } from "@/lib/i18n";

const STORAGE_KEY = "mz_door_opened";

/** Carved riad doors that open once per session, revealing the landing hero. */
export default function RiadDoorIntro({ force = false }: { force?: boolean }) {
  const { t, isRTL, locale } = useI18n();
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!force && window.location.pathname !== "/") return;
    const key = force ? "mz_qr_door_opened" : STORAGE_KEY;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      sessionStorage.setItem(key, "1");
      return;
    }
    if (!sessionStorage.getItem(key)) setVisible(true);
  }, [force]);

  useEffect(() => {
    if (!visible) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [visible]);

  const finish = useCallback(() => {
    sessionStorage.setItem(force ? "mz_qr_door_opened" : STORAGE_KEY, "1");
    setOpen(false);
    setVisible(false);
  }, [force]);

  useEffect(() => {
    if (!visible || !open) return;
    const timer = window.setTimeout(finish, 1250);
    return () => window.clearTimeout(timer);
  }, [visible, open, finish]);

  useEffect(() => {
    if (!visible || open) return;
    const trigger = () => setOpen(true);
    const onKey = (event: KeyboardEvent) => {
      if (["Enter", " ", "Escape", "ArrowDown"].includes(event.key)) trigger();
    };
    window.addEventListener("wheel", trigger, { passive: true });
    window.addEventListener("touchstart", trigger, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", trigger);
      window.removeEventListener("touchstart", trigger);
      window.removeEventListener("keydown", onKey);
    };
  }, [visible, open]);

  if (!visible) return null;

  const startOrigin = isRTL ? "right center" : "left center";
  const endOrigin = isRTL ? "left center" : "right center";
  const startRotation = isRTL ? 82 : -82;
  const endRotation = isRTL ? -82 : 82;

  const Door = ({ side }: { side: "start" | "end" }) => (
    <motion.div
      aria-hidden="true"
      style={{
        transformOrigin: side === "start" ? startOrigin : endOrigin,
        backfaceVisibility: "hidden",
      }}
      initial={{ rotateY: 0, opacity: 1 }}
      animate={{
        rotateY: open ? (side === "start" ? startRotation : endRotation) : 0,
        opacity: open ? 0 : 1,
      }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      className={`absolute inset-y-0 w-1/2 overflow-hidden border-brass/60 bg-plaster ${
        side === "start" ? "start-0 border-e" : "end-0 border-s"
      }`}
    >
      <div className="absolute inset-3 border border-brass/50 sm:inset-5">
        <div className="absolute inset-2 border border-brass/30" />
        <svg
          viewBox="0 0 100 200"
          preserveAspectRatio="none"
          className="absolute inset-0 size-full text-brass/40"
          aria-hidden="true"
        >
          <path d="M10 10 H90 V190 H10 Z" fill="none" stroke="currentColor" strokeWidth="0.6" />
          <path d="M10 70 H90 M10 130 H90" stroke="currentColor" strokeWidth="0.4" />
          <path d="M30 10 V190 M50 10 V190 M70 10 V190" stroke="currentColor" strokeWidth="0.4" />
          <path d="M10 40 L30 70 L50 40 L70 70 L90 40 M10 100 L30 130 L50 100 L70 130 L90 100 M10 160 L30 190 L50 160 L70 190 L90 160" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </svg>
        {[16, 50, 84].map((top) => (
          <span key={top} className="absolute start-2 size-1.5 rounded-full bg-brass" style={{ top: `${top}%` }} />
        ))}
        {[16, 50, 84].map((top) => (
          <span key={top} className="absolute end-2 size-1.5 rounded-full bg-brass" style={{ top: `${top}%` }} />
        ))}
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: open ? 0 : 1 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-0 z-50 flex items-center justify-center ${open ? "pointer-events-none" : ""}`}
      style={{ perspective: 1600 }}
      role="dialog"
      aria-modal="true"
      aria-label={t("intro.cta")}
    >
      <div className="absolute inset-0 bg-espresso/40" aria-hidden="true" />
      <Door side="start" />
      <Door side="end" />

      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: open ? 0 : 1, y: open ? 0 : 10 }}
        transition={{ duration: 0.45, delay: 0.15 }}
        className="relative z-10 flex flex-col items-center gap-3 text-ink"
      >
        <span className="grid size-20 place-items-center rounded-full border-2 border-brass bg-plaster shadow-[0_0_0_6px_rgba(184,138,68,0.18)]">
          <Leaf className="size-8 text-brass-deep" strokeWidth={1.4} />
        </span>
        <span className="bg-plaster/90 px-4 py-2 text-[12px] font-medium tracking-[0.08em] text-ink">
          {t("intro.cta")}
        </span>
        <span className="text-[10px] tracking-[0.18em] text-brass-deep">
          {locale === "ar" ? CLIENT_CONFIG.restaurantName : CLIENT_CONFIG.tagline}
        </span>
      </motion.button>

      <button
        type="button"
        onClick={finish}
        className="absolute bottom-5 end-5 z-10 border-b border-brass/60 pb-1 text-[11px] text-plaster transition-colors hover:text-white sm:bottom-8 sm:end-8"
      >
        {t("intro.skip")}
      </button>
    </motion.div>
  );
}
