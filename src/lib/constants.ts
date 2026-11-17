import { CLIENT_CONFIG } from "@/config/client";
import type { DeliveryZone, SeatingPreference } from "./types";

/** Demo phone number in international format (no +, no spaces). */
export const WHATSAPP_NUMBER = CLIENT_CONFIG.whatsappNumber;

/** Google Business / Maps links for the demo venue (Maarif, Casablanca). */
export const GOOGLE_MAPS_URL = CLIENT_CONFIG.googleMapsUrl;
export const GOOGLE_REVIEW_URL = CLIENT_CONFIG.googleReviewUrl;
export const CALL_URL = `tel:+${CLIENT_CONFIG.whatsappNumber}`;
export const CONTACT_EMAIL = "reservation@maisonzaytoun.ma";

/** Absolute origin used when generating QR codes. Override via env in production. */
export const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://maison-zaytoun.pages.dev";

export const TABLE_NUMBERS = Array.from({ length: 20 }, (_, i) => i + 1);

const ZONE_AR: Record<string, string> = {
  maarif: "المعارية",
  anfa: "أنفا",
  gueliz: "القيليز",
  hivernage: "هيفرناج",
};

export const DELIVERY_ZONES: DeliveryZone[] = CLIENT_CONFIG.deliveryZones.map(
  (zone) => ({
    id: zone.id,
    name: {
      fr: zone.name,
      ar: ZONE_AR[zone.id] ?? zone.name,
      en: zone.name,
    },
    fee: zone.fee,
  })
);

export const EXTRA_PRICE = 8;

export const EXTRAS = [
  { id: "olives", labelKey: "drawer.extra.olives" as const },
  { id: "cheese", labelKey: "drawer.extra.cheese" as const },
  { id: "sauce", labelKey: "drawer.extra.sauce" as const },
];

export const PREFERENCE_KEYS = [
  "drawer.pref.normal",
  "drawer.pref.spicy",
  "drawer.pref.mild",
] as const;

export const PREFERENCES = PREFERENCE_KEYS.map((key) => ({ id: key, labelKey: key }));

export const SEATING_OPTIONS: {
  id: SeatingPreference;
  labelKey: "reserve.terrace" | "reserve.salle" | "reserve.salonPrive";
}[] = [
  { id: "terrace", labelKey: "reserve.terrace" },
  { id: "salle", labelKey: "reserve.salle" },
  { id: "salon-prive", labelKey: "reserve.salonPrive" },
];

export const OCCASIONS = [
  { id: "none", labelKey: "reserve.occasionNone" as const },
  { id: "birthday", labelKey: "reserve.birthday" as const },
  { id: "family", labelKey: "reserve.family" as const },
  { id: "anniversary", labelKey: "reserve.anniversary" as const },
  { id: "business", labelKey: "reserve.business" as const },
];

export const TIME_SLOTS = [
  "12:00", "12:30", "13:00", "13:30", "14:00",
  "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00",
];

/** High-contrast overhead tagines over charcoal — hero arch shot. */
export const HERO_IMAGE =
  "https://images.unsplash.com/photo-1761168955192-d710bf401325?auto=format&fit=crop&w=1400&q=88";

/** Editorial photography (royalty-free, curated Unsplash). */
const u = (id: string, w = 1400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;

const RIAD = "photo-1767029617862-d2552d9a1850";
const TERRACE = "photo-1501661178644-a86e54f360d7";
const SKYLINE = "photo-1597212618440-806262de4f6b";
const MINT_TEA = "photo-1567708415681-d1d249e182eb";
const DINING = "photo-1517248135467-4c7edcad34c4";

export const PHOTOS = {
  hero: u(RIAD, 2000),
  patio: u(RIAD),
  terrace: u(TERRACE),
  story: u(SKYLINE),
  spaces: [
    u(RIAD, 1100),
    u(SKYLINE, 1100),
    u(TERRACE, 1100),
    u(DINING, 1100),
    u("photo-1600607687920-4e2a09cf159d", 1100),
  ],
  menuRestaurant: u("photo-1547592180-85f173990554", 1200),
  menuTea: u(MINT_TEA, 1200),
  booking: u("photo-1414235077428-338989a2e8c0", 1600),
  gallery: [
    { src: u(RIAD), caption: { fr: "Le patio, cœur de la maison", ar: "الباحة، قلب البيت", en: "The patio, heart of the house" } },
    { src: u(DINING), caption: { fr: "Une table dressée", ar: "طاولة مُعدّة", en: "A set table" } },
    { src: u(TERRACE), caption: { fr: "La terrasse au soleil", ar: "الشرفة تحت الشمس", en: "The terrace in the sun" } },
    { src: u(SKYLINE), caption: { fr: "Vue sur la ville", ar: "إطلالة على المدينة", en: "View over the city" } },
    { src: u(MINT_TEA), caption: { fr: "Thé à la menthe", ar: "شاي بالنعناع", en: "Mint tea" } },
    { src: u("photo-1600607687920-4e2a09cf159d"), caption: { fr: "Salon des Sultans", ar: "قاعة السلاطين", en: "Sultans' Salon" } },
    { src: u("photo-1600566752355-35792bedcfea"), caption: { fr: "Salon du Maarif", ar: "قاعة المعاريف", en: "Maarif Salon" } },
    { src: u("photo-1616486338812-3dadae4b4ace"), caption: { fr: "Détails d'artisanat", ar: "تفاصيل حرفية", en: "Craft details" } },
    { src: u("photo-1547592180-85f173990554"), caption: { fr: "Spécialités de la maison", ar: "تخصصات البيت", en: "House specialities" } },
    { src: u("photo-1414235077428-338989a2e8c0"), caption: { fr: "Une table à partager", ar: "طاولة للمشاركة", en: "A table to share" } },
  ],
};
