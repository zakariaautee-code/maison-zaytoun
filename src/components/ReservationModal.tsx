"use client";

import { CalendarDays, Check, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import Sheet from "./ui/Sheet";
import { OCCASIONS, SEATING_OPTIONS, TIME_SLOTS } from "@/lib/constants";
import { useI18n } from "@/lib/i18n";
import { useUI } from "@/lib/store";
import type { Reservation } from "@/lib/types";
import { buildReservationMessage, reservationWaUrl } from "@/lib/whatsapp";

type ReservationModalProps = { open: boolean; onClose: () => void };

const today = () => new Date().toISOString().slice(0, 10);
const GUEST_CHOICES = [1, 2, 3, 4, 5, 6, 7, 8];
const LUNCH = TIME_SLOTS.filter((slot) => Number(slot.slice(0, 2)) < 15);
const DINNER = TIME_SLOTS.filter((slot) => Number(slot.slice(0, 2)) >= 15);

export default function ReservationModal({ open, onClose }: ReservationModalProps) {
  const { t, locale } = useI18n();
  const showToast = useUI((s) => s.showToast);
  const [form, setForm] = useState<Reservation>({
    guests: 2,
    date: today(),
    time: "20:00",
    seating: "terrace",
    occasion: "none",
    note: "",
    name: "",
    phone: "",
  });
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    if (open) {
      setForm((prev) => ({ ...prev, date: today() }));
      setInvalid(false);
    }
  }, [open]);

  const update = <K extends keyof Reservation>(key: K, value: Reservation[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const submit = () => {
    if (!form.name.trim() || !form.phone.trim()) {
      setInvalid(true);
      return;
    }
    const message = buildReservationMessage({ t, locale, reservation: form });
    window.open(reservationWaUrl(message), "_blank", "noopener,noreferrer");
    showToast(t("reserve.note"));
  };

  return (
    <Sheet
      open={open}
      onClose={onClose}
      ariaLabel={t("reserve.title")}
      title={
        <div>
          <p className="eyebrow flex items-center gap-2 text-brass">
            <CalendarDays className="size-3.5" strokeWidth={1.8} />
            {t("reserve.title")}
          </p>
          <p className="mt-1.5 text-[11px] leading-relaxed text-plaster/45">
            {t("reserve.subtitle")}
          </p>
        </div>
      }
    >
      <div className="space-y-7 pb-8 pt-5">
        {/* ── Guests ───────────────────────────────────────────────────── */}
        <div>
          <h3 className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-plaster/50">
            {t("reserve.guests")}
          </h3>
          <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-8">
            {GUEST_CHOICES.map((n) => {
              const active = form.guests === n;
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => update("guests", n)}
                  aria-pressed={active}
                  className={`py-2.5 text-xs font-semibold transition ${
                    active
                      ? "bg-brass text-espresso"
                      : "border border-brass/25 text-plaster/60 hover:border-brass/60 hover:text-plaster"
                  }`}
                >
                  {n === 8 ? t("reserve.guestsPlus") : n}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Date ─────────────────────────────────────────────────────── */}
        <div>
          <label
            htmlFor="res-date"
            className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-plaster/50"
          >
            {t("reserve.date")}
          </label>
          <input
            id="res-date"
            type="date"
            min={today()}
            value={form.date}
            onChange={(e) => update("date", e.target.value)}
            className="field [color-scheme:dark]"
          />
        </div>

        {/* ── Time ─────────────────────────────────────────────────────── */}
        <div>
          <h3 className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-plaster/50">
            {t("reserve.time")}
          </h3>
          <div className="space-y-3">
            {[
              { label: t("reserve.lunch"), slots: LUNCH },
              { label: t("reserve.dinner"), slots: DINNER },
            ].map((group) => (
              <div key={group.label}>
                <p className="mb-1.5 text-[11px] text-plaster/35">{group.label}</p>
                <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-6">
                  {group.slots.map((slot) => {
                    const active = form.time === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => update("time", slot)}
                        aria-pressed={active}
                        className={`py-2 text-[11px] font-semibold tabular-nums transition ${
                          active
                            ? "bg-brass text-espresso"
                            : "border border-brass/25 text-plaster/60 hover:border-brass/60 hover:text-plaster"
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Atmosphere ───────────────────────────────────────────────── */}
        <div>
          <h3 className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-plaster/50">
            {t("reserve.seating")}
          </h3>
          <div className="grid gap-1.5 sm:grid-cols-3">
            {SEATING_OPTIONS.map((option) => {
              const active = form.seating === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => update("seating", option.id)}
                  aria-pressed={active}
                  className={`relative px-2 py-3 text-[11px] font-semibold transition ${
                    active
                      ? "bg-brass text-espresso"
                      : "border border-brass/25 text-plaster/60 hover:border-brass/60 hover:text-plaster"
                  }`}
                >
                  {t(option.labelKey)}
                  {active && (
                    <Check className="absolute end-1.5 top-1.5 size-3" strokeWidth={3} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Occasion ─────────────────────────────────────────────────── */}
        <div>
          <h3 className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-plaster/50">
            {t("reserve.occasion")}
          </h3>
          <div className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1">
            {OCCASIONS.map((occasion) => {
              const active = form.occasion === occasion.id;
              return (
                <button
                  key={occasion.id}
                  type="button"
                  onClick={() => update("occasion", occasion.id)}
                  aria-pressed={active}
                  className={`shrink-0 border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.08em] transition ${
                    active
                      ? "border-brass bg-brass/10 text-brass-light"
                      : "border-brass/25 text-plaster/55 hover:border-brass/60"
                  }`}
                >
                  {t(occasion.labelKey)}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Note ─────────────────────────────────────────────────────── */}
        <div>
          <label
            htmlFor="res-note"
            className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-plaster/50"
          >
            {t("reserve.noteLabel")}
          </label>
          <textarea
            id="res-note"
            rows={2}
            value={form.note}
            onChange={(e) => update("note", e.target.value)}
            placeholder={t("reserve.notePlaceholder")}
            className="field resize-none"
          />
        </div>

        {/* ── Contact ──────────────────────────────────────────────────── */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label
              htmlFor="res-name"
              className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-plaster/50"
            >
              {t("reserve.name")}
            </label>
            <input
              id="res-name"
              dir="auto"
              value={form.name}
              onChange={(e) => {
                update("name", e.target.value);
                if (invalid) setInvalid(false);
              }}
              placeholder={t("reserve.namePlaceholder")}
              className="field"
            />
          </div>
          <div>
            <label
              htmlFor="res-phone"
              className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-plaster/50"
            >
              {t("reserve.phone")}
            </label>
            <input
              id="res-phone"
              dir="ltr"
              type="tel"
              value={form.phone}
              onChange={(e) => {
                update("phone", e.target.value);
                if (invalid) setInvalid(false);
              }}
              placeholder={t("reserve.phonePlaceholder")}
              className="field"
            />
          </div>
        </div>

        {invalid && (
          <p className="border-s-2 border-saffron ps-3 text-[11px] text-saffron">
            {t("reserve.required")}
          </p>
        )}

        <div className="border-t border-brass/15 pt-5">
          <button
            type="button"
            onClick={submit}
            className="flex w-full items-center justify-center gap-2 bg-saffron px-5 py-4 text-[10px] font-extrabold uppercase tracking-[0.14em] text-white transition hover:bg-brass hover:text-espresso"
          >
            <MessageCircle className="size-4" strokeWidth={1.9} />
            {t("reserve.submit")}
          </button>
          <p className="mt-2.5 text-center text-[10px] leading-relaxed text-plaster/35">
            {t("reserve.note")}
          </p>
        </div>
      </div>
    </Sheet>
  );
}
