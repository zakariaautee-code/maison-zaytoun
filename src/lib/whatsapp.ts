import type { TranslationKey } from "./i18n";
import { DISH_BY_ID } from "./menu-data";
import { EXTRA_PRICE, GOOGLE_MAPS_URL, WHATSAPP_NUMBER } from "./constants";
import { getEffectivePrice } from "./store";
import type { CartItem, Locale, Reservation, ServiceMode } from "./types";

type TFunc = (key: TranslationKey) => string;

export function buildWaUrl(phone: string, message: string): string {
  // encodeURIComponent turns line breaks into %0A as required.
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export const orderWaUrl = (message: string) =>
  buildWaUrl(WHATSAPP_NUMBER, message);

const LABELS: Record<
  Locale,
  {
    mode: string;
    table: string;
    zone: string;
    address: string;
    qty: string;
    subtotal: string;
    delivery: string;
    total: string;
    prep: string;
    extras: string;
    note: string;
    orderNote: string;
    map: string;
    guests: string;
    date: string;
    time: string;
    seating: string;
    occasion: string;
    name: string;
    phone: string;
  }
> = {
  fr: {
    mode: "Mode", table: "Table n°", zone: "Quartier", address: "Adresse",
    qty: "Qté", subtotal: "Sous-total", delivery: "Livraison", total: "TOTAL",
    prep: "Préparation", extras: "Ajouts", note: "Note", orderNote: "Note cuisine",
    map: "Itinéraire",
    guests: "Personnes", date: "Date", time: "Heure", seating: "Atmosphère",
    occasion: "Occasion", name: "Nom", phone: "Tél",
  },
  ar: {
    mode: "الطريقة", table: "طاولة رقم", zone: "الحي", address: "العنوان",
    qty: "الكمية", subtotal: "المجموع الفرعي", delivery: "التوصيل", total: "المجموع",
    prep: "التحضير", extras: "إضافات", note: "ملاحظة", orderNote: "ملاحظة المطبخ",
    map: "الاتجاهات",
    guests: "الأشخاص", date: "التاريخ", time: "الوقت", seating: "الأجواء",
    occasion: "المناسبة", name: "الاسم", phone: "الهاتف",
  },
  en: {
    mode: "Mode", table: "Table no.", zone: "Area", address: "Address",
    qty: "Qty", subtotal: "Subtotal", delivery: "Delivery", total: "TOTAL",
    prep: "Preparation", extras: "Extras", note: "Note", orderNote: "Kitchen note",
    map: "Directions",
    guests: "Guests", date: "Date", time: "Time", seating: "Atmosphere",
    occasion: "Occasion", name: "Name", phone: "Phone",
  },
};

export function buildOrderMessage(args: {
  t: TFunc;
  locale: Locale;
  items: CartItem[];
  priceOverrides: Record<string, number>;
  mode: ServiceMode;
  tableNumber: string;
  zoneName: string;
  address: string;
  orderNote: string;
  deliveryFee: number;
  subtotal: number;
  total: number;
  splitCount?: number;
}): string {
  const { t, locale, items, priceOverrides, mode, tableNumber, zoneName,
    address, orderNote, deliveryFee, subtotal, total, splitCount } = args;
  const l = LABELS[locale];

  const modeLabel =
    mode === "dine-in"
      ? t("cart.dineIn")
      : mode === "takeaway"
        ? t("cart.takeaway")
        : t("cart.delivery");

  const lines: string[] = [];
  lines.push(`🕌 ${t("cart.receiptTitle")}`);
  lines.push("━━━━━━━━━━━━━━━━━━━━");
  lines.push(`${l.mode}: ${modeLabel}`);
  if (mode === "dine-in" && tableNumber.trim()) {
    lines.push(`${l.table}: ${tableNumber.trim()}`);
  }
  if (mode === "delivery") {
    lines.push(`${l.zone}: ${zoneName} (+${deliveryFee} MAD)`);
    if (address.trim()) lines.push(`${l.address}: ${address.trim()}`);
  }
  lines.push("");

  items.forEach((item, index) => {
    const dish = DISH_BY_ID[item.dishId];
    const name = dish ? dish.name[locale] : item.dishId;
    const base = DISH_BY_ID[item.dishId]
      ? getEffectivePrice(item.dishId, priceOverrides)
      : item.unitPrice;
    const unit = base + item.extras.length * EXTRA_PRICE;
    lines.push(`${index + 1}. ${name}`);
    lines.push(`   ${l.qty} ${item.quantity} × ${unit} MAD = ${unit * item.quantity} MAD`);
    if (item.preference) {
      const prefLabel = t(item.preference as TranslationKey);
      lines.push(`   ${l.prep}: ${prefLabel}`);
    }
    if (item.extras.length) {
      const extrasLabels = item.extras
        .map((id) => {
          const map: Record<string, TranslationKey> = {
            olives: "drawer.extra.olives",
            cheese: "drawer.extra.cheese",
            sauce: "drawer.extra.sauce",
          };
          return t(map[id] ?? (id as TranslationKey));
        })
        .join(", ");
      lines.push(`   ${l.extras}: ${extrasLabels}`);
    }
    if (item.notes.trim()) lines.push(`   ${l.note}: ${item.notes.trim()}`);
    lines.push("");
  });

  lines.push("━━━━━━━━━━━━━━━━━━━━");
  lines.push(`${l.subtotal}: ${subtotal} MAD`);
  if (mode === "delivery") lines.push(`${l.delivery}: ${deliveryFee} MAD`);
  lines.push(`${l.total}: ${total} MAD`);
  if (splitCount && splitCount > 1) {
    const per = Math.round((total / splitCount) * 100) / 100;
    lines.push(`${t("cart.receiptSplit")}: ${splitCount} × ${per} MAD ${t("cart.perPerson")}`);
  }
  if (orderNote.trim()) {
    lines.push("");
    lines.push(`${l.orderNote}: ${orderNote.trim()}`);
  }
  lines.push("");
  lines.push(`✅ ${t("cart.zeroCommission")} — Maison Zaytoun`);
  lines.push(`📍 ${l.map}: ${GOOGLE_MAPS_URL}`);

  return lines.join("\n");
}

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
