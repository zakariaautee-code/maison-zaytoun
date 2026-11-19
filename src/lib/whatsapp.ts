import { GOOGLE_MAPS_URL, WHATSAPP_NUMBER } from "./constants";
import type { TranslationKey } from "./i18n";
import type { Locale, Reservation } from "./types";

type TFunc = (key: TranslationKey) => string;

export function buildWaUrl(phone: string, message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export const reservationWaUrl = (message: string) =>
  buildWaUrl(WHATSAPP_NUMBER, message);

export const orderWaUrl = reservationWaUrl;

/** Compact dine-in order receipt for the QR menu. */
export function buildOrderMessage(args: {
  t: TFunc;
  locale: Locale;
  items: Array<{ name: string; price: number; quantity: number }>;
  tableNumber: string;
  total: number;
}): string {
  const { t, locale, items, tableNumber, total } = args;
  const l = LABELS[locale];
  return [
    `🍽️ ${t("cart.receiptTitle")}`,
    "━━━━━━━━━━━━━━━━━━━━",
    `${l.table}: ${tableNumber || "—"}`,
    "",
    ...items.flatMap((item) => [
      `${item.quantity} × ${item.name}`,
      `   ${item.quantity * item.price} MAD`,
    ]),
    "━━━━━━━━━━━━━━━━━━━━",
    `${l.total}: ${total} MAD`,
    t("cart.checkoutHint"),
  ].join("\n");
}

const LABELS: Record<
  Locale,
  {
    guests: string;
    date: string;
    time: string;
    seating: string;
    occasion: string;
    name: string;
    phone: string;
    note: string;
    map: string;
    table: string;
    total: string;
  }
> = {
  fr: {
    guests: "Personnes",
    date: "Date",
    time: "Heure",
    seating: "Atmosphère",
    occasion: "Occasion",
    name: "Nom",
    phone: "Tél",
    note: "Note",
    map: "Itinéraire",
    table: "Table n°",
    total: "TOTAL",
  },
  ar: {
    guests: "الأشخاص",
    date: "التاريخ",
    time: "الوقت",
    seating: "الأجواء",
    occasion: "المناسبة",
    name: "الاسم",
    phone: "الهاتف",
    note: "ملاحظة",
    map: "الاتجاهات",
    table: "طاولة رقم",
    total: "المجموع",
  },
  en: {
    guests: "Guests",
    date: "Date",
    time: "Time",
    seating: "Atmosphere",
    occasion: "Occasion",
    name: "Name",
    phone: "Phone",
    note: "Note",
    map: "Directions",
    table: "Table no.",
    total: "TOTAL",
  },
};

export function buildReservationMessage(args: {
  t: TFunc;
  locale: Locale;
  reservation: Reservation;
}): string {
  const { t, locale, reservation } = args;
  const l = LABELS[locale];
  const seatingLabel = t(
    `reserve.${reservation.seating === "salon-prive" ? "salonPrive" : reservation.seating}` as TranslationKey
  );
  const occasionLabel = t(
    (reservation.occasion === "none"
      ? "reserve.occasionNone"
      : `reserve.${reservation.occasion}`) as TranslationKey
  );

  return [
    `🕌 ${t("reserve.receiptTitle")}`,
    "━━━━━━━━━━━━━━━━━━━━",
    `${l.guests}: ${reservation.guests}`,
    `${l.date}: ${reservation.date}`,
    `${l.time}: ${reservation.time}`,
    `${l.seating}: ${seatingLabel}`,
    `${l.occasion}: ${occasionLabel}`,
    `${l.name}: ${reservation.name.trim() || "—"}`,
    `${l.phone}: ${reservation.phone.trim() || "—"}`,
    ...(reservation.note.trim() ? [`${l.note}: ${reservation.note.trim()}`] : []),
    "━━━━━━━━━━━━━━━━━━━━",
    `🤝 ${t("reserve.note")}`,
    `📍 ${l.map}: ${GOOGLE_MAPS_URL}`,
  ].join("\n");
}
