"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Star,
} from "lucide-react";
import {
  CALL_URL,
  CONTACT_EMAIL,
  GOOGLE_MAPS_URL,
  GOOGLE_REVIEW_URL,
  WHATSAPP_NUMBER,
} from "@/lib/constants";
import { useI18n } from "@/lib/i18n";
import { buildWaUrl } from "@/lib/whatsapp";
import LanguageSwitcher from "./LanguageSwitcher";

const QUICK_LINKS = [
  { id: "menu", labelKey: "footer.linkMenu" },
  { id: "story", labelKey: "footer.linkStory" },
  { id: "spaces", labelKey: "footer.linkSpaces" },
  { id: "gallery", labelKey: "footer.linkGallery" },
  { id: "booking", labelKey: "footer.linkBooking" },
] as const;

export default function LocationFooter() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <footer id="contact" className="relative scroll-mt-24 overflow-hidden bg-espresso text-plaster">
      <div className="pointer-events-none absolute inset-0 bg-grain opacity-[0.03]" />

      {/* ── Google review strip ──────────────────────────────────────────── */}
      <div className="relative border-y border-brass/20 bg-coal">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-5 px-5 py-6 sm:px-8 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <span className="grid size-10 shrink-0 place-items-center border border-brass/40 text-brass-light">
              <Star className="size-4 fill-current" />
            </span>
            <div className="text-start">
              <p className="text-sm font-semibold text-plaster">{t("footer.reviewLine")}</p>
              <p className="mt-0.5 text-[11px] text-plaster/45">{t("footer.reviewCount")}</p>
            </div>
          </div>

          <a
            href={GOOGLE_REVIEW_URL}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 border border-brass/50 px-4 py-2.5 text-[9px] font-extrabold uppercase tracking-[0.16em] text-brass-light transition hover:bg-brass hover:text-espresso"
          >
            {t("footer.leaveReview")}
            <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:rotate-180" />
          </a>
        </div>
      </div>

      {/* ── Practical information ────────────────────────────────────────── */}
      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          {/* Brand */}
          <div className="lg:col-span-4">
            <a href="#top" className="group inline-flex flex-col items-start">
              <span className="font-arabic text-3xl leading-none text-brass-light sm:text-4xl">
                {t("brand.arabic")}
              </span>
              <span className="mt-2 text-[10px] font-semibold uppercase tracking-[0.4em] text-plaster/70">
                {t("brand.name")}
              </span>
            </a>

            <p className="mt-6 max-w-xs font-display text-2xl leading-snug text-plaster/90">
              {t("footer.tagline1")}
              <br />
              <em className="text-brass-light">{t("footer.tagline2")}</em>
            </p>

            <p className="mt-4 max-w-xs text-[11px] leading-relaxed text-plaster/40">
              {t("brand.tagline")} · {t("brand.location")}
            </p>
          </div>

          {/* Hours */}
          <div className="lg:col-span-3">
            <p className="eyebrow flex items-center gap-2 text-brass">
              <Clock className="size-3.5" strokeWidth={1.8} />
              {t("footer.hours")}
            </p>
            <p className="mt-4 text-sm text-plaster/80">{t("footer.hoursWeek")}</p>
            <p className="mt-1.5 text-[11px] leading-relaxed text-plaster/40">
              {t("footer.hoursNote")}
            </p>
            <p className="mt-3 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-brass-light">
              <span className="size-1.5 bg-saffron" />
              {t("footer.openStatus")}
            </p>
          </div>

          {/* Address + contact */}
          <div className="lg:col-span-3">
            <p className="eyebrow flex items-center gap-2 text-brass">
              <MapPin className="size-3.5" strokeWidth={1.8} />
              {t("footer.addressTitle")}
            </p>
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-4 block text-sm leading-relaxed text-plaster/80 underline-offset-4 transition hover:text-brass-light hover:underline"
            >
              {t("brand.address")}
            </a>

            <div className="mt-5 flex flex-col items-start gap-2.5 text-sm text-plaster/60">
              <a
                href={CALL_URL}
                className="inline-flex items-center gap-2 transition hover:text-brass-light"
              >
                <Phone className="size-3.5 text-brass" strokeWidth={1.8} />
                {t("brand.phone")}
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center gap-2 transition hover:text-brass-light"
              >
                <Mail className="size-3.5 text-brass" strokeWidth={1.8} />
                {CONTACT_EMAIL}
              </a>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 border border-brass/35 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-plaster/70 transition hover:border-brass hover:text-brass-light"
              >
                <MapPin className="size-3" />
                {t("footer.directions")}
              </a>
              <a
                href={buildWaUrl(
                  WHATSAPP_NUMBER,
                  `السلام عليكم — ${t("brand.name")}`
                )}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 border border-brass/35 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-plaster/70 transition hover:border-brass hover:text-brass-light"
              >
                <MessageCircle className="size-3" />
                {t("footer.whatsapp")}
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="lg:col-span-2">
            <p className="eyebrow text-brass">{t("footer.quickTitle")}</p>
            <ul className="mt-4 space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.id}>
                  <button
                    type="button"
                    onClick={() => scrollTo(link.id)}
                    className="group inline-flex items-center gap-1.5 text-sm text-plaster/55 transition hover:text-brass-light"
                  >
                    <span className="h-px w-0 bg-brass transition-[width] duration-200 group-hover:w-3" />
                    {t(link.labelKey)}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ───────────────────────────────────────────────────── */}
      <div className="relative border-t border-brass/15">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-6 sm:flex-row sm:px-8">
          <p className="text-center text-[10px] tracking-[0.06em] text-plaster/35 sm:text-start">
            © {year} {t("brand.name")}. {t("footer.rights")}
          </p>

          <div className="flex items-center gap-3">
            <LanguageSwitcher compact />
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 border border-brass/35 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-brass-light transition hover:bg-brass hover:text-espresso"
            >
              <ShieldCheck className="size-3.5" />
              {t("footer.ownerDemo")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
