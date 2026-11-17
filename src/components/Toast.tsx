"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useCartSummary } from "@/lib/store";

export default function Toast() {
  const { t } = useI18n();
  const { count } = useCartSummary();
  const previous = useRef(count);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (count > previous.current) {
      setVisible(true);
      const id = window.setTimeout(() => setVisible(false), 2000);
      previous.current = count;
      return () => window.clearTimeout(id);
    }
    previous.current = count;
  }, [count]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="fixed bottom-28 start-1/2 z-50 -translate-x-1/2 border border-brass/40 bg-espresso px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-brass-light shadow-lift rtl:translate-x-1/2 sm:bottom-28"
        >
          <span className="flex items-center gap-2 whitespace-nowrap">
            <Check className="size-3.5" strokeWidth={2.5} />
            {t("toast.added")}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
