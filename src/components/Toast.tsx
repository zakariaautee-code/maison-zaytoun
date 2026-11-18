"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { useUI } from "@/lib/store";

export default function Toast() {
  const toast = useUI((s) => s.toast);
  const clearToast = useUI((s) => s.clearToast);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(clearToast, 4000);
    return () => window.clearTimeout(timer);
  }, [toast, clearToast]);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.25 }}
          role="status"
          className="fixed bottom-6 start-5 z-[60] flex items-center gap-3 border border-brass/40 bg-espresso px-5 py-3 text-[13px] text-plaster shadow-soft sm:start-8"
        >
          <span className="grid size-6 place-items-center rounded-full bg-mint text-white">
            <Check className="size-3.5" strokeWidth={2.4} />
          </span>
          {toast}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
