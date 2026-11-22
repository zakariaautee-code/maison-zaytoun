import type { Metadata, Viewport } from "next";
import "./globals.css";
import ClarityScript from "@/components/ClarityScript";
import Providers from "@/components/Providers";
import { getDishes } from "@/lib/sanity";

export const metadata: Metadata = {
  title: "Maison Zaytoun — Luxury Moroccan Restaurant & Grill",
  description:
    "L'art du feu, des épices et du partage. Carte digitale trilingue et réservation de table. Maison Zaytoun, Casablanca & Marrakech.",
  keywords: [
    "restaurant marocain",
    "Maison Zaytoun",
    "Casablanca",
    "Marrakech",
    "menu digital",
    "QR menu",
    "tagine",
    "grillades",
    "WhatsApp ordering",
  ],
};

export const viewport: Viewport = {
  themeColor: "#121A15",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const dishes = await getDishes();
  return (
    <html lang="fr" dir="ltr" suppressHydrationWarning>
      <body className="min-h-screen bg-plaster text-espresso antialiased">
        <ClarityScript />
        <Providers dishes={dishes}>{children}</Providers>
      </body>
    </html>
  );
}
