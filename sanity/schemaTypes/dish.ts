import { defineField, defineType } from "sanity";

export const dish = defineType({
  name: "dish",
  title: "Dish",
  type: "document",
  fields: [
    defineField({
      name: "id",
      title: "Dish ID",
      type: "slug",
      description: "Unique, lowercase, used for deep links and share cards.",
      validation: (rule) => rule.required(),
      options: {
        source: "name.fr",
        slugify: (input: string) =>
          input
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, ""),
      },
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Entrées", value: "starters" },
          { title: "Tagines & Couscous", value: "tagines" },
          { title: "Grillades au Feu de Bois", value: "grills" },
          { title: "Desserts", value: "desserts" },
          { title: "Boissons", value: "drinks" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "price",
      title: "Price (MAD)",
      type: "number",
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: "image",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tags",
      title: "Dietary tags",
      type: "array",
      of: [
        {
          type: "string",
          options: {
            list: [
              { title: "Végétarien", value: "vegetarian" },
              { title: "Épicé", value: "spicy" },
              { title: "Sans Gluten", value: "gluten-free" },
            ],
          },
        },
      ],
    }),
    defineField({
      name: "available",
      title: "Available",
      description: "Turn off to show « Épuisé » on the menu.",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "popular",
      title: "Signature / Popular",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "name",
      title: "Name",
      type: "object",
      fields: [
        defineField({ name: "fr", title: "Français", type: "string", validation: (r) => r.required() }),
        defineField({ name: "ar", title: "العربية", type: "string", validation: (r) => r.required() }),
        defineField({ name: "en", title: "English", type: "string", validation: (r) => r.required() }),
      ],
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "object",
      fields: [
        defineField({ name: "fr", title: "Français", type: "text", rows: 3 }),
        defineField({ name: "ar", title: "العربية", type: "text", rows: 3 }),
        defineField({ name: "en", title: "English", type: "text", rows: 3 }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "name.fr",
      subtitle: "category",
      media: "image",
      price: "price",
      available: "available",
    },
    prepare({ title, subtitle, media, price, available }) {
      return {
        title: title || "Untitled dish",
        subtitle: `${subtitle ?? ""} · ${price ?? 0} MAD${available === false ? " · Épuisé" : ""}`,
        media,
      };
    },
  },
});
