# Maison Zaytoun — Luxury Moroccan Restaurant & Grill

An editorial Moroccan restaurant site with a complete zero-commission digital menu layered on top. **Design direction:** deep espresso (`#11100E`), Tadelakt plaster cream (`#F5EFE6`), saffron (`#C6532B`) and antique brass (`#B88A44`), with Cormorant Garamond / Amiri / Plus Jakarta Sans and a 3% plaster grain. Trilingual FR / AR / EN with full RTL, WhatsApp ordering and reservations, and a live owner demo panel — no backend, no hosting cost.

## Stack

- **Next.js 15** (App Router) + **TypeScript** + **Tailwind CSS**
- **Framer Motion** for section reveals, drawers and gallery transitions
- **Zustand** (persisted to `localStorage`) for cart + owner demo edits
- **lucide-react** icons, **qrcode.react** for printable table QR codes
- Client-side i18n context with typed keys and automatic `<html dir>` switching

## Run locally

```bash
npm install
npm run dev
# http://localhost:3000
# http://localhost:3000/admin   ← owner demo
```

```bash
npm run typecheck   # strict TS, zero errors
npm run build       # production build
```

Deploy to **Cloudflare Pages** or **Vercel** with the default Next.js preset. No env vars required for the demo.

## Page structure (maQam-inspired)

| Section | File |
| --- | --- |
| Brown top strip (address / phone / email) + sticky nav + slide-in menu | `src/components/Header.tsx` |
| Full-bleed hero — *Come for a meal, Leave with a memory* | `src/components/Hero.tsx` |
| Immersion — brown section, zellige pattern, Arabic watermark, outlined text blocks, patio/terrace cards | `src/components/EditorialSections.tsx` |
| Story — image + editorial paragraphs | `src/components/EditorialSections.tsx` |
| The Spaces — 5 salon cards | `src/components/EditorialSections.tsx` |
| Our Menu — two menu cards that jump to the digital menu | `src/components/EditorialSections.tsx` |
| **Interactive QR menu** — sticky pills, search, dietary filters, sold-out states | `src/components/MenuSection.tsx`, `DishCard.tsx` |
| Dish customization bottom sheet | `src/components/DishDrawer.tsx` |
| Immersive gallery — 10 images, counter, dots | `src/components/EditorialSections.tsx` |
| Book your table — hours, address, contact | `src/components/EditorialSections.tsx` |
| Explore + footer | `src/components/EditorialSections.tsx`, `Footer.tsx` |
| Cart with dine-in / takeaway / zoned delivery → WhatsApp receipt | `src/components/CartDrawer.tsx`, `src/lib/whatsapp.ts` |
| Table reservation → manager WhatsApp | `src/components/ReservationModal.tsx` |
| Owner panel — live price/sold-out edits + table QR codes | `src/components/admin/AdminPanel.tsx` |
| Agent rules | `SKILL.md`, `.cursor/rules/restaurant-morocco.mdc` |

## Before a real client demo

Edit `src/lib/constants.ts`:

- `WHATSAPP_NUMBER` — replace `212522444404` with the owner's number (`2126XXXXXXXX`, no `+`).
- `GOOGLE_MAPS_URL` / `GOOGLE_REVIEW_URL` — point to the real Google Business Profile (replace the `placeid` placeholder).
- `CONTACT_EMAIL`, `brand.address` in `src/lib/i18n.tsx` — update contact details.
- `DELIVERY_ZONES` — adjust neighbourhoods and fees.
- `SITE_ORIGIN` (or `NEXT_PUBLIC_SITE_URL`) — the deployed domain baked into QR codes.
- `PHOTOS` — currently royalty-free Unsplash placeholders; swap for the client's own riad and dishes.

Everything customer-facing lives in the three dictionaries in `src/lib/i18n.tsx`; menu items are in `src/lib/menu-data.ts`.

## 60-second pitch

1. Scan a table QR code (or open `/admin` → download Table 1 → scan with your phone).
2. Switch language to AR — the whole layout flips to RTL instantly.
3. Open a dish, add extras, add to cart — fixed bottom cart bar appears.
4. Open `/admin` in another tab: sell out that dish and change its price. The customer menu updates live in both tabs.
5. Checkout → a clean WhatsApp receipt with items, mode, zone fee and MAD total.
6. Reserve a table → pre-filled request straight to the manager's WhatsApp.
7. Tap the floating review and directions buttons.

> Original copy and royalty-free imagery only — no maQam photos or wording were reused.
