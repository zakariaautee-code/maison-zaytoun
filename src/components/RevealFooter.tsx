"use client";

import { ArrowUpRight, Leaf, MapPin, Phone, Star } from "lucide-react";
import { CLIENT_CONFIG } from "@/config/client";
import { CALL_URL, GOOGLE_MAPS_URL, GOOGLE_REVIEW_URL } from "@/lib/constants";
import { useI18n } from "@/lib/i18n";

export default function RevealFooter() {
  const { t, locale } = useI18n();

  return (
    <footer
      id="contact"
      className="relative z-0 h-[660px] scroll-mt-24 bg-espresso sm:h-[600px]"
    >
      <div className="fixed inset-x-0 bottom-0 z-0 h-[660px] overflow-hidden border-t border-brass/30 bg-espresso text-plaster sm:h-[600px]">
        <div className="pointer-events-none absolute inset-0 bg-grain opacity-[0.03]" />
        <div className="relative mx-auto flex h-full max-w-[1400px] flex-col justify-between px-5 py-8 sm:px-8 sm:py-10">
          <a
            href={GOOGLE_REVIEW_URL}
            target="_blank"
            rel="noreferrer"
            className="mb-6 inline-flex w-fit items-center gap-3 border-b border-brass/30 pb-2.5 text-[11px] tracking-[0.14em] text-plaster/70 transition-colors hover:border-brass hover:text-plaster"
          >
            <Star className="size-4 fill-brass text-brass" />
            <strong className="text-brass-light">{t("footer.reviewLine")}</strong>
            <span className="text-plaster/40">·</span>
            <span>{t("footer.reviewCount")}</span>
            <ArrowUpRight className="size-3.5 rtl:rotate-180" />
          </a>

          <div className="grid flex-1 grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr] lg:gap-14">
            <div>
              <div className="flex items-center gap-4">
                <span className="grid size-12 place-items-center border border-brass/50 text-brass">
                  <Leaf className="size-5" strokeWidth={1.5} />
                </span>
                <span
                  className={`font-display text-3xl text-plaster sm:text-4xl ${
                    locale === "ar" ? "font-arabic" : ""
                  }`}
                >
                  {CLIENT_CONFIG.restaurantName}
                </span>
              </div>
              <p
                className={`mt-5 max-w-sm font-display text-3xl leading-[1.1] text-brass-light sm:text-4xl ${
                  locale === "ar" ? "font-arabic leading-[1.4]" : ""
                }`}
              >
                {t("footer.tagline1")}
                <span className="block">{t("footer.tagline2")}</span>
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-1">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.28em] text-brass">
                  {t("footer.addressTitle")}
                </p>
                <p className="mt-3 max-w-[26ch] text-sm leading-[1.8] text-plaster/65">
                  {t("brand.address")}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold tracking-[0.28em] text-brass">
                  {t("footer.hours")}
                </p>
                <p className="mt-3 text-sm leading-[1.8] text-plaster/65">
                  {t("footer.hoursWeek")}
                  <span className="mt-1 block text-xs text-plaster/45">
                    {t("footer.hoursNote")}
                  </span>
                </p>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-semibold tracking-[0.28em] text-brass">
                {t("footer.contactTitle")}
              </p>
              <div className="mt-4 flex flex-col gap-3">
                <a
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-between gap-3 border border-brass/40 px-5 py-3.5 text-[11px] font-bold tracking-[0.12em] text-plaster transition-colors hover:border-brass hover:bg-brass/10"
                >
                  <span className="flex items-center gap-2.5">
                    <MapPin className="size-4 text-brass" strokeWidth={1.5} />
                    {t("footer.directions")}
                  </span>
                  <ArrowUpRight className="size-4 rtl:rotate-180" />
                </a>
                <a
                  href={CALL_URL}
                  className="inline-flex items-center justify-between gap-3 border border-brass/40 px-5 py-3.5 text-[11px] font-bold tracking-[0.12em] text-plaster transition-colors hover:border-brass hover:bg-brass/10"
                >
                  <span className="flex items-center gap-2.5">
                    <Phone className="size-4 text-brass" strokeWidth={1.5} />
                    {t("footer.call")}
                  </span>
                  <ArrowUpRight className="size-4 rtl:rotate-180" />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-brass/20 pt-5 text-[10px] tracking-[0.14em] text-plaster/40 sm:flex-row sm:items-center sm:justify-between">
            <span>
              © {new Date().getFullYear()} {t("brand.name")} · {t("footer.rights")}
            </span>
            <a
              href="/admin"
              className="w-fit text-brass/70 underline-offset-4 transition-colors hover:text-brass hover:underline"
            >
              {t("footer.ownerDemo")} (/admin)
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
