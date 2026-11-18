/**
 * White-label client configuration.
 * Clone this file and edit the values below to rebrand the whole experience.
 */
export const CLIENT_CONFIG = {
  restaurantName: "Maison Zaytoun",
  tagline: "Luxury Moroccan Restaurant & Grill",
  city: "Casablanca",
  address: "12 Rue de la Liberté, Maarif, Casablanca",
  whatsappNumber: "212600000000",
  googleMapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Maison+Zaytoun+Maarif+Casablanca",
  googleReviewUrl:
    "https://www.google.com/maps/search/?api=1&query=Maison+Zaytoun+Maarif+Casablanca",
  instagramHandle: "@maisonzaytoun",
  openingHours: {
    week: "Lundi – Dimanche · 12h00 – 23h30",
    note: "Accueil continu jusqu'à 23h00",
  },
} as const;

export type ClientConfig = typeof CLIENT_CONFIG;
