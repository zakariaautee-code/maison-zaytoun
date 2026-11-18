"use client";

import Link from "next/link";
import { Leaf } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import { CLIENT_CONFIG } from "@/config/client";
import { useI18n } from "@/lib/i18n";
import { useUI } from "@/lib/store";

export default function Header() {
  const { t, locale } = useI18n();
  const openReserve = useUI((s) => s.openReserve);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex h-[76px] max-w-[1400px] items-center justify-between gap-4 border-b border-brass/20 bg-espresso px-4 text-plaster sm:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3" aria-label={CLIENT_CONFIG.restaurantName}>
          <span className="grid size-9 shrink-0 place-items-center border border-brass/50 text-brass">
            <Leaf className="size-[17px]" strokeWidth={1.5} />
          </span>
          <span className="flex min-w-0 flex-col leading-none">
            <span
              className={`whitespace-nowrap font-display text-xl italic text-plaster sm:text-2xl ${
                locale === "ar" ? "font-arabic not-italic" : ""
              }`}
            >
              {locale === "ar" ? t("brand.arabic") : CLIENT_CONFIG.restaurantName}
            </span>
            <span className="mt-1 hidden text-[10px] tracking-[0.18em] text-brass sm:block">
              {CLIENT_CONFIG.tagline}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-[11px] tracking-[0.12em] text-plaster/60 lg:flex">
          <Link href="/" className="transition-colors hover:text-brass-light">{t("nav.home")}</Link>
          <Link href="/menu" className="transition-colors hover:text-brass-light">{t("nav.menu")}</Link>
          <Link href="/#terroir" className="transition-colors hover:text-brass-light">{t("nav.terroir")}</Link>
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <LanguageSwitcher compact />
          <button
            type="button"
            onClick={openReserve}
            className="bg-terracotta px-5 py-2.5 text-[11px] font-medium tracking-[0.1em] text-white transition-colors hover:bg-brass hover:text-espresso"
          >
            {t("nav.reserve")}
          </button>
        </div>
      </div>
    </header>
  );
}
