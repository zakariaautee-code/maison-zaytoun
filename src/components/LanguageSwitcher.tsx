"use client";

import { useI18n } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

const OPTIONS: { id: Locale; label: string; title: string }[] = [
  { id: "fr", label: "FR", title: "Français" },
  { id: "ar", label: "AR", title: "العربية" },
  { id: "en", label: "EN", title: "English" },
];

export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale } = useI18n();

  return (
    <div
      role="group"
      aria-label="Language"
      className={`inline-flex items-center border border-brass/30 p-px ${
        compact ? "text-[9px]" : "text-[11px]"
      }`}
    >
      {OPTIONS.map((option) => {
        const active = locale === option.id;
        return (
          <button
            key={option.id}
            type="button"
            title={option.title}
            aria-pressed={active}
            onClick={() => setLocale(option.id)}
            className={`px-2 py-1 font-semibold tracking-[0.08em] transition-colors ${
              active
                ? "bg-brass text-espresso"
                : "text-plaster/55 hover:text-plaster"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
