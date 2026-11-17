"use client";

import { useState } from "react";
import { Bell, CreditCard, Banknote, UserRound } from "lucide-react";
import Sheet from "@/components/ui/Sheet";
import { CLIENT_CONFIG } from "@/config/client";
import { useI18n } from "@/lib/i18n";
import { useCart } from "@/lib/store";
import { buildWaUrl } from "@/lib/whatsapp";

export default function TableServiceButton() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const tableNumber = useCart((s) => s.tableNumber);
  const mode = useCart((s) => s.mode);
  const visible = Boolean(tableNumber.trim());

  if (!visible) return null;

  const send = (key: "bell.call" | "bell.cash" | "bell.card") => {
    const message = `${t("bell.table")} ${tableNumber.trim()}\n${t(key)} — ${CLIENT_CONFIG.restaurantName}`;
    window.open(
      buildWaUrl(CLIENT_CONFIG.whatsappNumber, message),
      "_blank",
      "noopener,noreferrer"
    );
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("bell.title")}
        className="grid size-9 shrink-0 place-items-center border border-brass/50 text-brass-light transition-colors hover:bg-brass hover:text-espresso"
        title={`${t("bell.table")} ${tableNumber.trim()}`}
      >
        <Bell className="size-4" strokeWidth={1.5} />
      </button>
      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        side="right"
        ariaLabel={t("bell.title")}
        title={
          <div>
            <p className="eyebrow text-brass">
              {t("bell.table")} {tableNumber.trim()} · {mode}
            </p>
            <h2 className="mt-1.5 font-display text-2xl text-plaster">
              {t("bell.title")}
            </h2>
          </div>
        }
      >
        <div className="space-y-3 pt-5">
          {(
            [
              { key: "bell.call" as const, icon: UserRound },
              { key: "bell.cash" as const, icon: Banknote },
              { key: "bell.card" as const, icon: CreditCard },
            ]
          ).map(({ key, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => send(key)}
              className="flex w-full items-center gap-4 border border-brass/30 px-5 py-5 text-start text-sm text-plaster transition-colors hover:border-brass hover:bg-brass/10"
            >
              <Icon className="size-5 text-brass-light" strokeWidth={1.5} />
              {t(key)}
            </button>
          ))}
          <p className="pt-3 text-center text-[10px] text-plaster/40">
            {t("bell.sent")}
          </p>
        </div>
      </Sheet>
    </>
  );
}
