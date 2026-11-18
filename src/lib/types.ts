export type Locale = "fr" | "ar" | "en";

export type LocalizedText = Record<Locale, string>;

export type CategoryId =
  | "starters"
  | "tagines"
  | "grills"
  | "desserts"
  | "drinks";

export type DietaryTag = "vegetarian" | "spicy" | "gluten-free";

export type Category = {
  id: CategoryId;
  label: LocalizedText;
  icon: string;
};

export type Dish = {
  id: string;
  category: CategoryId;
  name: LocalizedText;
  description: LocalizedText;
  price: number;
  image: string;
  tags: DietaryTag[];
  available: boolean;
  popular?: boolean;
};

export type SeatingPreference =
  | "terrace"
  | "salle"
  | "salon-prive";

export type Reservation = {
  guests: number;
  date: string;
  time: string;
  seating: SeatingPreference;
  occasion: string;
  note: string;
  name: string;
  phone: string;
};
