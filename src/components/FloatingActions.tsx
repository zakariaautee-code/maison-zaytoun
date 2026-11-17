"use client";

import { MapPin, MessageCircle, Phone, Star } from "lucide-react";
import {
  CALL_URL,
  GOOGLE_MAPS_URL,
  GOOGLE_REVIEW_URL,
  WHATSAPP_NUMBER,
} from "@/lib/constants";
import { useI18n } from "@/lib/i18n";
import { useCart } from "@/lib/store";
import { buildWaUrl } from "@/lib/whatsapp";

export default function FloatingActions() {
  const { t } = useI18n();
  const count = useCart((s) => s.items.length);

  const actions = [
    {
      label: t("float.directions"),
      icon: MapPin,
      href: GOOGLE_MAPS_URL,
      className: "border-brass/40 text-brass-light hover:bg-brass/10",
    },
    {
      label: t("float.review"),
      icon: Star,
      href: GOOGLE_REVIEW_URL,
      className: "border-brass/40 text-brass-light hover:bg-brass/10",
    },
    {
      label: t("float.whatsapp"),
      icon: MessageCircle,
      href: buildWaUrl(WHATSAPP_NUMBER, `السلام عليكم — ${t("brand.name")}`),
      className: "border-saffron bg-saffron text-white hover:bg-saffron-dark",
    },
    {
      label: t("quick.call"),
      icon: Phone,
      href: CALL_URL,
      className: "border-brass/40 text-brass-light hover:bg-brass/10",
    },
  ];

  return (
    <div
      className={`fixed bottom-24 end-3 z-30 flex flex-col gap-2 transition-[bottom] duration-300 sm:end-6 ${
        count > 0 ? "sm:bottom-24" : "sm:bottom-6"
      }`}
    >
      {actions.map((action) => {
        const Icon = action.icon;
        const primary = Icon === MessageCircle;
        return (
          <a
            key={action.label}
            href={action.href}
            target={action.href.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer"
            aria-label={action.label}
            className={`group relative place-items-center border bg-espresso/85 transition-colors ${
              primary ? "grid" : "hidden sm:grid"
            } size-10 sm:size-11 ${action.className}`}
          >
            <Icon className="size-4" strokeWidth={1.7} />
            <span className="pointer-events-none absolute end-full me-2 whitespace-nowrap border border-brass/20 bg-coal px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-plaster opacity-0 transition group-hover:opacity-100">
              {action.label}
            </span>
          </a>
        );
      })}
    </div>
  );
}
