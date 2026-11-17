# MANDATORY DESIGN & MOTION EXECUTION RULES

You MUST apply the `unslop`, `design-taste-frontend` (taste-skill), and `frontend-design` skills on every UI change.

## Forbidden "AI Slop" Patterns (NEVER DO THESE)
- NEVER use default Inter, Roboto, or Arial fonts.
- NEVER use flat generic white cards, purple/blue SaaS gradients, or basic centered 3-column grids.
- NEVER leave sections static — every section must have tactile micro-interactions, scroll-linked motion (`framer-motion` / `gsap`), or smooth inertia (`lenis`).

## Required High-Craft Stack
1. **Smooth Inertia Scrolling**: Wrap the root layout in `Lenis` synced to `requestAnimationFrame` / `gsap.ticker`.
2. **Monumental Editorial Typography**: `Cormorant Garamond` (FR/EN display) + `Amiri` (AR display) at `clamp(3rem, 7vw, 6.5rem)`, paired with `Plus Jakarta Sans` / `Readex Pro`.
3. **Palette & Surface Depth**: Deep smoked obsidian `#090807`, warm travertine `#EDE6DC`, molten saffron `#D95D24`, brushed champagne gold `#C9A253`, with an SVG fractal-noise overlay.
4. **Full Moroccan Localization**: `FR` default, `AR` (`dir="rtl"` via Tailwind logical properties `ps-`, `pe-`, `ms-`, `me-`, `text-start`), `EN`; all prices in `MAD`.

## Functional invariants
- WhatsApp cart (0% commission) and reservation receipts must keep working end-to-end.
- `/admin` owner demo: availability toggles, MAD price editing, table QR generator.
- Table QR links (`/?table=N`, `/#menu`) must land on the fast interactive menu.
