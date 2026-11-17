import type { Category, Dish } from "./types";

export const CATEGORIES: Category[] = [
  {
    id: "starters",
    icon: "🥗",
    label: { fr: "Entrées", ar: "المقبلات", en: "Starters" },
  },
  {
    id: "tagines",
    icon: "🍲",
    label: { fr: "Tagines & Couscous", ar: "الطواجن والكسكس", en: "Tagines & Couscous" },
  },
  {
    id: "grills",
    icon: "🍢",
    label: {
      fr: "Grillades au Feu de Bois",
      ar: "مشويات على الفحم",
      en: "Wood-Fire Grills",
    },
  },
  {
    id: "desserts",
    icon: "🍮",
    label: { fr: "Desserts", ar: "الحلويات", en: "Desserts" },
  },
  {
    id: "drinks",
    icon: "🍹",
    label: { fr: "Boissons", ar: "المشروبات", en: "Drinks" },
  },
];

export const MENU: Dish[] = [
  // ── Starters ─────────────────────────────────────────────────────────────
  {
    id: "zaalouk",
    category: "starters",
    price: 45,
    image: "/dishes/zaalouk.jpg",
    tags: ["vegetarian", "gluten-free"],
    available: true,
    popular: true,
    name: { fr: "Zaalouk aux aubergines", ar: "زعلوك الباذنجان", en: "Aubergine Zaalouk" },
    description: {
      fr: "Aubergines grillées, tomates, ail et paprika, servies avec du pain khobz chaud.",
      ar: "باذنجان مشوي وطماطم وثوم وبابريكا، يُقدَّم مع خبز الخبز الساخن.",
      en: "Grilled aubergine, tomato, garlic and paprika, served with warm khobz bread.",
    },
  },
  {
    id: "taktouka",
    category: "starters",
    price: 42,
    image: "/dishes/taktouka.jpg",
    tags: ["vegetarian", "gluten-free"],
    available: true,
    name: { fr: "Taktouka de poivrons", ar: "تكتوكة الفلفل", en: "Pepper Taktouka" },
    description: {
      fr: "Poivrons verts rôtis et tomates confites aux herbes fraîches.",
      ar: "فلفل أخضر مشوي وطماطم مطهية ببطء مع الأعشاب الطازجة.",
      en: "Roasted green peppers and slow-cooked tomatoes with fresh herbs.",
    },
  },
  {
    id: "bssara",
    category: "starters",
    price: 38,
    image: "/dishes/bssara.jpg",
    tags: ["vegetarian", "spicy"],
    available: true,
    name: { fr: "Bssara épicée", ar: "بصارة حارة", en: "Spicy Bssara" },
    description: {
      fr: "Purée de fèves à l'huile d'olive, cumin et piment rouge.",
      ar: "هريس الفافاء بزيت الزيتون والكمون والفلفل الأحمر.",
      en: "Fava bean purée with olive oil, cumin and red chilli.",
    },
  },
  {
    id: "maquouda",
    category: "starters",
    price: 48,
    image: "/dishes/maquouda.jpg",
    tags: ["vegetarian"],
    available: true,
    name: { fr: "Maquouda de pommes de terre", ar: "مقودة البطاطس", en: "Potato Maquouda" },
    description: {
      fr: "Beignets de pommes de terre épicés, croustillants et dorés.",
      ar: "قطع بطاطس مقلية حارة، مقرمشة وذهبية.",
      en: "Crisp golden spiced potato fritters.",
    },
  },

  // ── Tagines & Couscous ───────────────────────────────────────────────────
  {
    id: "tagine-lamb",
    category: "tagines",
    price: 145,
    image: "/dishes/tagine-lamb.jpg",
    tags: [],
    available: true,
    popular: true,
    name: { fr: "Tagine d'agneau aux pruneaux", ar: "طاجين الغنم بالبرقوق", en: "Lamb & Prune Tagine" },
    description: {
      fr: "Agneau fondant, pruneaux, amandes et sauce safranée, cuit 4 heures.",
      ar: "لحم غنم طري، برقوق ولوز وصلصة بالزعفران، مطبوخ 4 ساعات.",
      en: "Tender lamb, prunes, almonds and saffron sauce, slow-cooked for 4 hours.",
    },
  },
  {
    id: "tagine-chicken",
    category: "tagines",
    price: 125,
    image: "/dishes/tagine-chicken.jpg",
    tags: ["gluten-free"],
    available: true,
    name: { fr: "Tagine de poulet aux olives", ar: "طاجين الدجاج بالزيتون", en: "Chicken & Olive Tagine" },
    description: {
      fr: "Poulet fermier, olives vertes, citron confit et épices douces.",
      ar: "دجاج بلدي وزيتون أخضر وليمون مملح وتوابل حلوة.",
      en: "Free-range chicken, green olives, preserved lemon and warm spices.",
    },
  },
  {
    id: "couscous-royal",
    category: "tagines",
    price: 160,
    image: "/dishes/couscous-royal.jpg",
    tags: [],
    available: true,
    popular: true,
    name: { fr: "Couscous royal", ar: "كسكسي ملكي", en: "Royal Couscous" },
    description: {
      fr: "Semoule fine, agneau, poulet, merguez et légumes de saison au bouillon épicé.",
      ar: "سميد ناعم ولحم غنم ودجاج ومرقاز وخضار موسمية بمرق حار.",
      en: "Fine semolina with lamb, chicken, merguez and seasonal vegetables in spiced broth.",
    },
  },
  {
    id: "tagine-veg",
    category: "tagines",
    price: 98,
    image: "/dishes/tagine-veg.jpg",
    tags: ["vegetarian", "gluten-free"],
    available: true,
    name: { fr: "Tagine de légumes", ar: "طاجين الخضار", en: "Vegetable Tagine" },
    description: {
      fr: "Courgettes, carottes, pois chiches et raisins secs aux épices douces.",
      ar: "كوسا وجزر وحمص وزبيب مع توابل حلوة.",
      en: "Courgette, carrot, chickpeas and raisins with gentle spices.",
    },
  },

  // ── Grills ───────────────────────────────────────────────────────────────
  {
    id: "brochette-lamb",
    category: "grills",
    price: 135,
    image: "/dishes/brochette-lamb.jpg",
    tags: ["gluten-free"],
    available: true,
    popular: true,
    name: { fr: "Brochettes d'agneau", ar: "أسياخ الغنم", en: "Lamb Skewers" },
    description: {
      fr: "Agneau mariné au cumin et paprika, grillé au charbon, servi avec frites.",
      ar: "لحم غنم متبل بالكمون والبابريكا، مشوي على الفحم، مع البطاطس المقلية.",
      en: "Cumin and paprika marinated lamb, charcoal-grilled, served with fries.",
    },
  },
  {
    id: "cotelettes",
    category: "grills",
    price: 155,
    image: "/dishes/cotelettes.jpg",
    tags: ["gluten-free"],
    available: true,
    name: { fr: "Côtelettes d'agneau grillées", ar: "ريش الغنم المشوي", en: "Grilled Lamb Chops" },
    description: {
      fr: "Côtelettes au romarin et ail, grillées à la perfection au feu de bois.",
      ar: "ريش غنم بالروزماني والثوم، مشوية على الحطب.",
      en: "Rosemary and garlic lamb chops, grilled to perfection over wood fire.",
    },
  },
  {
    id: "poulet-grille",
    category: "grills",
    price: 110,
    image: "/dishes/poulet-grille.jpg",
    tags: ["gluten-free"],
    available: true,
    name: { fr: "Poulet grillé au citron", ar: "دجاج مشوي بالليمون", en: "Lemon Grilled Chicken" },
    description: {
      fr: "Poulet fermier mariné au citron confit et za'atar, servi avec salade.",
      ar: "دجاج بلدي متبل بالليمون المملح والزعتر، مع السلطة.",
      en: "Free-range chicken marinated in preserved lemon and za'atar, with salad.",
    },
  },
  {
    id: "merguez",
    category: "grills",
    price: 95,
    image: "/dishes/merguez.jpg",
    tags: ["spicy", "gluten-free"],
    available: false,
    name: { fr: "Merguez au feu de bois", ar: "مرقاز على الحطب", en: "Wood-Fired Merguez" },
    description: {
      fr: "Saucisses épicées au harissa, grillées au charbon, servies avec harissa maison.",
      ar: "نقانق حارة بالحرارة، مشوية على الفحم، مع حرارة منزلية.",
      en: "Harissa-spiced sausages, charcoal-grilled, served with house harissa.",
    },
  },

  // ── Desserts ─────────────────────────────────────────────────────────────
  {
    id: "cornes-gazelle",
    category: "desserts",
    price: 55,
    image: "/dishes/cornes-gazelle.jpg",
    tags: ["vegetarian"],
    available: true,
    popular: true,
    name: { fr: "Cornes de gazelle", ar: "قرون الغزال", en: "Gazelle Horns" },
    description: {
      fr: "Pâtisseries aux amandes et fleur d'oranger, fourrées à la pâte d'amande.",
      ar: "حلويات باللوز وماء الورد، محشوة بمعجون اللوز.",
      en: "Almond and orange-blossom pastries filled with marzipan.",
    },
  },
  {
    id: "baklava",
    category: "desserts",
    price: 50,
    image: "/dishes/baklava.jpg",
    tags: ["vegetarian"],
    available: true,
    name: { fr: "Baklava aux pistaches", ar: "بقلاوة الفستق", en: "Pistachio Baklava" },
    description: {
      fr: "Feuilletages croustillants, pistaches et sirop de miel parfumé.",
      ar: "طبقات مقرمشة وفستق وشراب عسل معطر.",
      en: "Crisp layers of filo, pistachios and perfumed honey syrup.",
    },
  },
  {
    id: "panna-cotta",
    category: "desserts",
    price: 58,
    image: "/dishes/panna-cotta.jpg",
    tags: ["vegetarian", "gluten-free"],
    available: true,
    name: { fr: "Panna cotta à la rose", ar: "بانا كوتا بالورد", en: "Rose Panna Cotta" },
    description: {
      fr: "Crème vanille délicate, coulis de framboise et pétales de rose.",
      ar: "كريما فانيلا ناعمة وصلصة توت العليق وبتلات الورد.",
      en: "Delicate vanilla cream, raspberry coulis and rose petals.",
    },
  },

  // ── Drinks ───────────────────────────────────────────────────────────────
  {
    id: "the-mante",
    category: "drinks",
    price: 20,
    image: "/dishes/the-mante.jpg",
    tags: ["vegetarian", "gluten-free"],
    available: true,
    popular: true,
    name: { fr: "Thé à la menthe", ar: "شاي بالنعناع", en: "Mint Tea" },
    description: {
      fr: "Thé vert chinois, menthe fraîche et sucre — servi en théière traditionnelle.",
      ar: "شاي أخضر صيني ونعناع طازج وسكر — يُقدَّم في إبريق تقليدي.",
      en: "Chinese green tea, fresh mint and sugar — served in a traditional teapot.",
    },
  },
  {
    id: "jus-orange",
    category: "drinks",
    price: 25,
    image: "/dishes/jus-orange.jpg",
    tags: ["vegetarian", "gluten-free"],
    available: true,
    name: { fr: "Jus d'orange frais", ar: "عصير برتقال طازج", en: "Fresh Orange Juice" },
    description: {
      fr: "Oranges pressées à la minute, sans sucre ajouté.",
      ar: "برتقال معصور على الفور، دون سكر مضاف.",
      en: "Oranges freshly squeezed to order, no added sugar.",
    },
  },
  {
    id: "limonade",
    category: "drinks",
    price: 22,
    image: "/dishes/limonade.jpg",
    tags: ["vegetarian", "gluten-free"],
    available: true,
    name: { fr: "Limonade maison", ar: "ليمونادة منزلية", en: "House Lemonade" },
    description: {
      fr: "Citron, menthe et eau pétillante — rafraîchissante et légère.",
      ar: "ليمون ونعناع وماء فوار — منعش وخفيف.",
      en: "Lemon, mint and sparkling water — light and refreshing.",
    },
  },
  {
    id: "cafe",
    category: "drinks",
    price: 15,
    image: "/dishes/cafe.jpg",
    tags: ["vegetarian", "gluten-free"],
    available: true,
    name: { fr: "Café expresso", ar: "قهوة إسبريسو", en: "Espresso Coffee" },
    description: {
      fr: "Café torréfié localement, servie chaud ou glacé.",
      ar: "قهوة محمصة محلياً، ساخنة أو مثلجة.",
      en: "Locally roasted coffee, served hot or iced.",
    },
  },
];

export const DISH_BY_ID: Record<string, Dish> = Object.fromEntries(
  MENU.map((dish) => [dish.id, dish])
);
