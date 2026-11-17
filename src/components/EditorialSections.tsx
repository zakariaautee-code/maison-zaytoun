"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { useState } from "react";
import { CALL_URL, CONTACT_EMAIL, GOOGLE_MAPS_URL, PHOTOS } from "@/lib/constants";
import { useI18n, type TranslationKey } from "@/lib/i18n";

const fadeUp = {};

function Watermark({ text }: { text: string }) {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute -top-16 end-[-2%] select-none font-arabic text-[16rem] leading-none text-cream/[0.045] sm:text-[22rem]"
    >
      {text}
    </span>
  );
}

function Eyebrow({ children, center = false }: { children: React.ReactNode; center?: boolean }) {
  return (
    <p className={`eyebrow text-gold-light ${center ? "text-center" : ""}`}>{children}</p>
  );
}

// ── Immersion ────────────────────────────────────────────────────────────────
export function ImmersionSection() {
  const { t } = useI18n();
  return (
    <section id="immersion" className="relative overflow-hidden bg-espresso py-20 text-plaster sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-zellige opacity-25" />
      <div className="pointer-events-none absolute inset-0 bg-grain opacity-[0.03]" />
      <Watermark text={t("brand.arabic")} />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div {...fadeUp} className="mx-auto max-w-3xl text-center">
          <p className="text-[12px] text-brass-light">02 — {t("immersion.eyebrow")}</p>
          <h2 className="mt-5 font-display text-4xl leading-tight sm:text-6xl">
            {t("immersion.title")}
          </h2>
          <p className="mx-auto mt-7 max-w-2xl text-[15px] leading-[1.9] text-cream/75">
            {t("immersion.p1")}
          </p>
          <p className="mx-auto mt-5 max-w-2xl font-display text-xl text-gold-light sm:text-2xl">
            {t("immersion.intro")}
          </p>
        </motion.div>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {[
            { title: t("immersion.hospitalityTitle"), body: t("immersion.hospitality") },
            { title: t("immersion.heritageTitle"), body: t("immersion.heritage") },
          ].map((block, i) => (
            <motion.div
              key={block.title}
              {...fadeUp}
              transition={{ duration: 0.65, delay: i * 0.1 }}
              className="frame-outline p-7 sm:p-9"
            >
              <p className="eyebrow text-gold-light">{block.title}</p>
              <p className="mt-5 text-[15px] leading-[1.9] text-cream/75">{block.body}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {[
            { src: PHOTOS.patio, label: t("immersion.patio") },
            { src: PHOTOS.terrace, label: t("immersion.terrace") },
          ].map((card, i) => (
            <motion.div
              key={card.label}
              {...fadeUp}
              transition={{ duration: 0.7, delay: i * 0.12 }}
              className="group"
            >
              <div className="aspect-[4/3] overflow-hidden border border-brass/20">
                <img
                  src={card.src}
                  alt={card.label}
                  loading="lazy"
                  className="size-full object-cover"
                />
              </div>
              <p className="mt-3 text-[13px] text-plaster">{card.label}</p>
            </motion.div>
          ))}
        </div>
        <p className="mt-6 text-center text-xs uppercase tracking-caption text-cream/40">
          {t("immersion.caption")}
        </p>
      </div>
    </section>
  );
}

// ── Story ────────────────────────────────────────────────────────────────────
export function StorySection() {
  const { t } = useI18n();
  const paragraphs = [t("story.p1"), t("story.p2"), t("story.p3")];
  return (
    <section id="story" className="pattern-cream scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20">
        <motion.div {...fadeUp} className="relative">
          <div className="aspect-[4/5] overflow-hidden border border-brass/25">
            <img
              src={PHOTOS.story}
              alt={t("story.title")}
              loading="lazy"
              className="size-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -end-4 hidden border border-brass/50 bg-espresso px-7 py-5 text-plaster sm:block lg:-end-8">
            <p className="font-display text-3xl text-brass-light">1950</p>
            <p className="mt-1 text-[10px] uppercase tracking-caption text-plaster/60">Casablanca</p>
          </div>
        </motion.div>

        <motion.div {...fadeUp}>
          <Eyebrow>{t("story.eyebrow")}</Eyebrow>
          <h2 className="mt-5 font-display text-4xl leading-tight text-mocha sm:text-5xl">
            {t("story.title")}
          </h2>
          <div className="mt-7 space-y-5 text-[15px] leading-[1.9] text-ink-soft">
            {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
            <p className="border-s-2 border-gold ps-5 font-display text-lg leading-relaxed text-mocha">
              {t("story.p4")}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Spaces ───────────────────────────────────────────────────────────────────
export function SpacesSection() {
  const { t } = useI18n();
  const spaces = [1, 2, 3, 4, 5].map((n) => ({
    name: t(`spaces.s${n}` as TranslationKey),
    description: t(`spaces.d${n}` as TranslationKey),
    image: PHOTOS.spaces[n - 1],
  }));

  return (
    <section id="spaces" className="relative scroll-mt-24 bg-espresso py-20 text-plaster sm:py-28">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="flex items-start justify-between gap-6 border-b border-brass/20 pb-6">
          <div>
            <p className="text-[12px] text-brass-light">03 — {t("spaces.eyebrow")}</p>
            <h2 className="mt-3 max-w-2xl font-display text-4xl sm:text-6xl">{t("spaces.title")}</h2>
          </div>
          <span className="hidden font-display text-6xl text-plaster/15 sm:block">03</span>
        </div>
        <p className="mt-5 max-w-2xl text-[15px] leading-[1.9] text-cream/70">
          {t("spaces.subtitle")}
        </p>

        <div className="mt-12 grid gap-6 lg:grid-cols-12">
          <figure className="lg:col-span-7">
            <div className="aspect-[16/10] overflow-hidden border border-brass/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={spaces[0].image} alt={spaces[0].name} loading="lazy" className="size-full object-cover" />
            </div>
            <figcaption className="mt-4 flex items-start justify-between gap-4 border-t border-brass/20 pt-4">
              <span className="font-display text-2xl">{spaces[0].name}</span>
              <span className="max-w-xs text-right text-[13px] leading-relaxed text-cream/60 rtl:text-left">
                {spaces[0].description}
              </span>
            </figcaption>
          </figure>

          <div className="grid gap-6 lg:col-span-5 sm:grid-cols-2">
            {spaces.slice(1, 3).map((space) => (
              <figure key={space.name}>
                <div className="aspect-[4/5] overflow-hidden border border-brass/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={space.image} alt={space.name} loading="lazy" className="size-full object-cover" />
                </div>
                <figcaption className="mt-3 text-[13px] text-plaster">{space.name}</figcaption>
              </figure>
            ))}
          </div>

          <figure className="lg:col-span-12">
            <div className="aspect-[21/8] overflow-hidden border border-brass/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={spaces[3].image} alt={spaces[3].name} loading="lazy" className="size-full object-cover" />
            </div>
            <figcaption className="mt-4 flex items-start justify-between gap-4 border-t border-brass/20 pt-4">
              <span className="font-display text-2xl">{spaces[3].name}</span>
              <span className="max-w-md text-right text-[13px] leading-relaxed text-cream/60 rtl:text-left">
                {spaces[3].description}
              </span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

// ── Menu intro ───────────────────────────────────────────────────────────────
export function MenuIntro() {
  const { t } = useI18n();
  const scrollToMenu = () =>
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });

  const cards = [
    { title: t("menuintro.restaurant"), desc: t("menuintro.restaurantDesc"), image: PHOTOS.menuRestaurant },
    { title: t("menuintro.tea"), desc: t("menuintro.teaDesc"), image: PHOTOS.menuTea },
  ];

  return (
    <section id="menuintro" className="pattern-cream scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 text-center sm:px-8">
        <motion.div {...fadeUp}>
          <Eyebrow center>{t("menuintro.eyebrow")}</Eyebrow>
          <h2 className="mt-5 font-display text-4xl text-mocha sm:text-6xl">{t("menuintro.title")}</h2>
          <p className="mx-auto mt-6 max-w-2xl text-[15px] leading-[1.9] text-ink-soft">
            {t("menuintro.subtitle")}
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              {...fadeUp}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group overflow-hidden border border-brass/20 bg-plaster text-start"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <img
                  src={card.image}
                  alt={card.title}
                  loading="lazy"
                  className="size-full object-cover"
                />
                <div className="absolute inset-0 bg-mocha-deep/10" />
              </div>
              <div className="p-7">
                <h3 className="font-display text-2xl text-mocha">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{card.desc}</p>
                <button
                  type="button"
                  onClick={scrollToMenu}
                  className="mt-6 inline-flex items-center gap-2 border-b border-terra pb-1 text-xs font-semibold uppercase tracking-[0.16em] text-terra transition hover:text-mocha"
                >
                  {t("menuintro.view")}
                  <ArrowRight className="size-4 rtl:rotate-180" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Gallery ──────────────────────────────────────────────────────────────────
export function GallerySection() {
  const { t, locale } = useI18n();
  const [index, setIndex] = useState(0);
  const photos = PHOTOS.gallery;
  const current = photos[index];

  const move = (direction: number) =>
    setIndex((prev) => (prev + direction + photos.length) % photos.length);

  return (
    <section id="gallery" className="relative scroll-mt-24 overflow-hidden bg-espresso py-20 text-plaster sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-grain opacity-[0.03]" />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div {...fadeUp} className="text-center">
          <Eyebrow center>{t("gallery.eyebrow")}</Eyebrow>
          <h2 className="mt-5 font-display text-4xl sm:text-6xl">{t("gallery.title")}</h2>
        </motion.div>

        <div className="relative mt-14">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="relative aspect-[16/9] overflow-hidden"
            >
              <img
                key={current.src}
                src={current.src}
                alt={current.caption[locale]}
                className="size-full animate-arch-zoom object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-mocha-deep/80 to-transparent px-5 py-8 text-center sm:py-10">
                <p className="text-[11px] font-semibold uppercase tracking-caption text-cream sm:text-xs">
                  {current.caption[locale]}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          <button
            type="button"
            onClick={() => move(-1)}
            aria-label="Previous"
            className="absolute start-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center border border-brass/50 text-plaster transition hover:bg-brass hover:text-espresso sm:start-5"
          >
            <ChevronLeft className="size-5 rtl:rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            aria-label="Next"
            className="absolute end-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center border border-brass/50 text-plaster transition hover:bg-brass hover:text-espresso sm:end-5"
          >
            <ChevronRight className="size-5 rtl:rotate-180" />
          </button>
        </div>

        <div className="mt-8 flex flex-col items-center gap-5">
          <div className="no-scrollbar flex max-w-full gap-2 overflow-x-auto px-2">
            {photos.map((photo, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Photo ${i + 1}`}
                className={`size-2 shrink-0 rounded-full border transition ${
                  i === index ? "scale-125 border-gold-light bg-gold-light" : "border-cream/35"
                }`}
              />
            ))}
          </div>
          <p className="text-xs tracking-[0.2em] text-cream/60">
            {index + 1} / {photos.length}
          </p>
        </div>
      </div>
    </section>
  );
}

// ── Booking ──────────────────────────────────────────────────────────────────
export function BookingSection({ onReserve }: { onReserve: () => void }) {
  const { t } = useI18n();
  return (
    <section id="booking" className="pattern-cream scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-stretch gap-10 px-5 sm:px-8 lg:grid-cols-2">
        <motion.div {...fadeUp} className="flex flex-col justify-center">
          <Eyebrow>{t("booking.eyebrow")}</Eyebrow>
          <h2 className="mt-5 font-display text-4xl text-mocha sm:text-6xl">{t("booking.title")}</h2>
          <p className="mt-4 font-display text-xl italic text-terra sm:text-2xl">{t("booking.subtitle")}</p>

          <div className="mt-10 grid gap-7 sm:grid-cols-2">
            <div>
              <p className="eyebrow text-terra">{t("booking.hours")}</p>
              <p className="mt-3 text-sm text-ink-soft">{t("booking.closed")}</p>
              <p className="mt-1 text-sm text-ink-soft">{t("booking.days")} · 09:00 – 23:00</p>
            </div>
            <div>
              <p className="eyebrow text-terra">{t("booking.address")}</p>
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-3 flex items-start gap-2 text-sm leading-relaxed text-ink-soft transition hover:text-terra"
              >
                <MapPin className="mt-0.5 size-4 shrink-0 text-terra" />
                {t("brand.address")}
              </a>
            </div>
            <div className="sm:col-span-2">
              <p className="eyebrow text-terra">{t("booking.contact")}</p>
              <div className="mt-3 flex flex-wrap gap-x-8 gap-y-2 text-sm text-ink-soft">
                <a href={CALL_URL} className="flex items-center gap-2 transition hover:text-terra">
                  <Phone className="size-4 text-terra" />
                  {t("brand.phone")}
                </a>
                <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center gap-2 transition hover:text-terra">
                  <Mail className="size-4 text-terra" />
                  {CONTACT_EMAIL}
                </a>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onReserve}
            className="mt-10 inline-flex w-fit items-center gap-3 bg-saffron px-8 py-4 text-[10px] font-extrabold uppercase tracking-[0.18em] text-white transition hover:bg-espresso hover:text-plaster"
          >
            <CalendarDays className="size-[18px]" />
            {t("booking.cta")}
          </button>
        </motion.div>

        <motion.div {...fadeUp} className="relative min-h-[320px] overflow-hidden lg:min-h-[520px]">
          <img src={PHOTOS.booking} alt="Table" loading="lazy" className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-0 bg-mocha/10" />
        </motion.div>
      </div>
    </section>
  );
}

// ── Explore ──────────────────────────────────────────────────────────────────
export function ExploreSection() {
  const { t } = useI18n();
  const links = [
    { label: t("explore.linkMenu"), id: "menu", href: "/menu" },
    { label: t("explore.linkSpaces"), id: "spaces", href: "" },
    { label: t("explore.linkTea"), id: "terroir", href: "" },
    { label: t("explore.linkContact"), id: "booking", href: "" },
  ];
  return (
    <section className="border-t border-gold/20 bg-cream-deep py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <h2 className="font-display text-3xl text-mocha sm:text-4xl">{t("explore.title")}</h2>
        <p className="mt-5 max-w-4xl text-[15px] leading-[1.9] text-ink-soft">{t("explore.text")}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          {links.map((link) =>
            link.href ? (
              <Link
                key={link.id}
                href={link.href}
                className="group inline-flex items-center gap-2 border-b border-brass/40 pb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-espresso transition hover:border-saffron hover:text-saffron"
              >
                {link.label}
                <ArrowRight className="size-3.5 rtl:rotate-180" />
              </Link>
            ) : (
              <button
                key={link.id}
                type="button"
                onClick={() => document.getElementById(link.id)?.scrollIntoView({ behavior: "smooth" })}
                className="group inline-flex items-center gap-2 border-b border-brass/40 pb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-espresso transition hover:border-saffron hover:text-saffron"
              >
                {link.label}
                <ArrowRight className="size-3.5 rtl:rotate-180" />
              </button>
            )
          )}
        </div>
      </div>
    </section>
  );
}

// Re-exported arrow for any consumer that needs directional hints.
export const DirectionArrows = { ArrowLeft, ArrowRight };
