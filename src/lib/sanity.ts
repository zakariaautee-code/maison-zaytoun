import { createImageUrlBuilder } from "@sanity/image-url";
import { createClient } from "next-sanity";
import { MENU } from "./menu-data";
import type { CategoryId, Dish, DietaryTag, LocalizedText } from "./types";

export const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
export const SANITY_DATASET =
  process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const sanityConfigured = Boolean(SANITY_PROJECT_ID);

const SANITY_TOKEN = process.env.SANITY_API_READ_TOKEN;

const config = {
  projectId: SANITY_PROJECT_ID || "placeholder",
  dataset: SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: !SANITY_TOKEN,
  ...(SANITY_TOKEN ? { token: SANITY_TOKEN } : {}),
};

const client = createClient(config);
const builder = createImageUrlBuilder(config);

type SanityImage = {
  _type?: string;
  asset?: { _ref?: string; _type?: string };
  crop?: unknown;
  hotspot?: unknown;
};

type SanityDish = {
  id?: string;
  _id?: string;
  category?: CategoryId;
  price?: number;
  image?: SanityImage;
  tags?: DietaryTag[];
  available?: boolean;
  popular?: boolean;
  name?: Partial<LocalizedText>;
  description?: Partial<LocalizedText>;
};

const DISHES_QUERY = `*[_type == "dish"]{
  "id": id.current,
  _id,
  category,
  price,
  image,
  tags,
  available,
  popular,
  name,
  description
}`;

function imageUrl(image?: SanityImage): string {
  if (!image?.asset?._ref) return "";
  try {
    return builder
      .image(image)
      .width(800)
      .height(1000)
      .fit("crop")
      .auto("format")
      .url();
  } catch {
    return "";
  }
}

function localized(value: Partial<LocalizedText> | undefined, fallback: string): LocalizedText {
  return {
    fr: value?.fr || fallback,
    ar: value?.ar || fallback,
    en: value?.en || fallback,
  };
}

function toDish(doc: SanityDish, index: number): Dish | null {
  const id = doc.id || doc._id;
  if (!id) return null;
  const photo = imageUrl(doc.image);
  if (!photo) return null;
  return {
    id,
    category: doc.category || "starters",
    price: Number(doc.price) || 0,
    image: photo,
    tags: (doc.tags || []).filter((tag): tag is DietaryTag =>
      ["vegetarian", "spicy", "gluten-free"].includes(tag)
    ),
    available: doc.available !== false,
    popular: Boolean(doc.popular),
    name: localized(doc.name, id),
    description: localized(doc.description, ""),
  };
}

/** ISR-cached dishes with a static fallback for local demos and setup errors. */
export async function getDishes(): Promise<Dish[]> {
  if (!sanityConfigured) return MENU;
  try {
    const docs = await client.fetch<SanityDish[]>(
      DISHES_QUERY,
      {},
      { next: { revalidate: 30 } }
    );
    if (!Array.isArray(docs) || docs.length === 0) return MENU;
    const dishes = docs
      .map((doc, index) => toDish(doc, index))
      .filter((dish): dish is Dish => Boolean(dish));
    return dishes.length ? dishes : MENU;
  } catch {
    return MENU;
  }
}
