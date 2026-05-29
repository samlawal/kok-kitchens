import type { MenuItem } from "./types";

export const menuItems: MenuItem[] = [
  // ── Rice Dishes ──────────────────────────────────────────────
  {
    id: "jollof-rice",
    slug: "jollof-rice",
    name: "Jollof Rice",
    description:
      "Our signature smoky party jollof cooked low and slow with ripe tomatoes, scotch bonnets, and a blend of aromatic spices. Served with your choice of fried plantain and coleslaw.",
    price: 12.99,
    image: "/meals/jollof-rice.jpg",
    category: "rice-dishes",
    tags: ["popular", "party-favourite"],
    featured: true,
    spicy: true,
  },
  {
    id: "fried-rice",
    slug: "fried-rice",
    name: "Nigerian Fried Rice",
    description:
      "Colourful stir-fried rice loaded with mixed vegetables, liver, and prawns. A party staple seasoned to perfection.",
    price: 12.99,
    image: "/meals/fried-rice.jpg",
    category: "rice-dishes",
    tags: ["popular"],
    featured: true,
  },
  {
    id: "ofada-rice",
    slug: "ofada-rice",
    name: "Ofada Rice & Ayamase",
    description:
      "Local unpolished ofada rice paired with rich green pepper sauce (ayamase) made with assorted meats, locust beans, and palm oil.",
    price: 14.99,
    image: "/meals/ofada-rice.jpg",
    category: "rice-dishes",
    tags: ["traditional"],
    spicy: true,
  },
  {
    id: "coconut-rice",
    slug: "coconut-rice",
    name: "Coconut Rice",
    description:
      "Fragrant rice cooked in creamy coconut milk with a hint of curry and thyme. Served with peppered chicken.",
    price: 13.99,
    image: "/meals/coconut-rice.jpg",
    category: "rice-dishes",
    tags: [],
  },
  {
    id: "jollof-spaghetti",
    slug: "jollof-spaghetti",
    name: "Jollof Spaghetti",
    description:
      "Spaghetti cooked in a rich tomato and pepper base with onions, seasoning, and a touch of curry. A quick Nigerian comfort classic.",
    price: 10.99,
    image: "/meals/jollof-spaghetti.jpg",
    category: "rice-dishes",
    tags: ["comfort-food"],
  },
  {
    id: "native-rice",
    slug: "native-rice",
    name: "Native Jollof (Palm Oil Rice)",
    description:
      "Traditional palm oil rice cooked with crayfish, locust beans, smoked fish, and leafy vegetables. Deep, earthy flavours.",
    price: 13.99,
    image: "/meals/native-rice.jpg",
    category: "rice-dishes",
    tags: ["traditional"],
  },
  {
    id: "rice-beans",
    slug: "rice-beans",
    name: "Rice & Beans",
    description:
      "Fluffy white rice and honey beans cooked together with palm oil, onions, and crayfish. Hearty and satisfying.",
    price: 11.99,
    image: "/meals/rice-beans.jpg",
    category: "rice-dishes",
    tags: ["comfort-food"],
  },

  // ── Soups & Swallows ────────────────────────────────────────
  {
    id: "pounded-yam-egusi",
    slug: "pounded-yam-egusi",
    name: "Pounded Yam & Egusi",
    description:
      "Smooth, stretchy pounded yam served with thick egusi soup loaded with spinach, stockfish, assorted meats, and shaki.",
    price: 15.99,
    image: "/meals/pounded-yam-egusi.jpg",
    category: "soups-swallows",
    tags: ["popular", "traditional"],
    featured: true,
  },
  {
    id: "amala-ewedu",
    slug: "amala-ewedu",
    name: "Amala & Ewedu with Gbegiri",
    description:
      "Silky yam flour amala paired with jute leaf (ewedu) soup and bean soup (gbegiri), served with stew and assorted meats.",
    price: 14.99,
    image: "/meals/amala-ewedu.jpg",
    category: "soups-swallows",
    tags: ["traditional"],
  },
  {
    id: "eba-ogbono",
    slug: "eba-ogbono",
    name: "Eba & Ogbono Soup",
    description:
      "Garri swallow with rich, draw ogbono soup cooked with palm oil, assorted meats, dried fish, and leafy vegetables.",
    price: 13.99,
    image: "/meals/eba-ogbono.jpg",
    category: "soups-swallows",
    tags: ["traditional"],
  },
  {
    id: "pepper-soup",
    slug: "pepper-soup",
    name: "Goat Meat Pepper Soup",
    description:
      "Aromatic and fiery pepper soup made with tender goat meat, uziza, scent leaves, and traditional spices. Perfect for cold evenings.",
    price: 16.99,
    image: "/meals/pepper-soup.jpg",
    category: "soups-swallows",
    tags: ["spicy"],
    spicy: true,
    featured: true,
  },
  {
    id: "edikaikong",
    slug: "edikaikong",
    name: "Edikaikong Soup",
    description:
      "A rich Calabar delicacy made with pumpkin leaves (ugu) and waterleaf, loaded with stockfish, periwinkle, and assorted meats in palm oil.",
    price: 17.99,
    image: "/meals/edikaikong.jpg",
    category: "soups-swallows",
    tags: ["premium", "traditional"],
  },
  {
    id: "afang-soup",
    slug: "afang-soup",
    name: "Afang Soup",
    description:
      "Hearty Cross River soup made with shredded afang leaves and waterleaf, enriched with crayfish, cow skin, and smoked fish.",
    price: 16.99,
    image: "/meals/afang-soup.jpg",
    category: "soups-swallows",
    tags: ["traditional"],
  },
  {
    id: "efo-riro",
    slug: "efo-riro",
    name: "Efo Riro",
    description:
      "Yoruba-style spinach stew cooked with palm oil, scotch bonnets, locust beans, and your choice of assorted meats or fish.",
    price: 14.99,
    image: "/meals/efo-riro.jpg",
    category: "soups-swallows",
    tags: ["traditional"],
    spicy: true,
  },
  {
    id: "banga-soup",
    slug: "banga-soup",
    name: "Banga Soup & Starch",
    description:
      "Creamy palm fruit soup from the Niger Delta, flavoured with banga spice, oburunbebe stick, and fresh catfish. Served with starch.",
    price: 17.99,
    image: "/meals/banga-soup.jpg",
    category: "soups-swallows",
    tags: ["traditional", "premium"],
  },
  {
    id: "oha-soup",
    slug: "oha-soup",
    name: "Oha Soup & Fufu",
    description:
      "Eastern Nigerian classic made with tender oha leaves, cocoyam thickener, and assorted meats in a flavourful palm oil base.",
    price: 15.99,
    image: "/meals/oha-soup.jpg",
    category: "soups-swallows",
    tags: ["traditional"],
  },
  {
    id: "catfish-pepper-soup",
    slug: "catfish-pepper-soup",
    name: "Catfish Pepper Soup",
    description:
      "Fresh catfish simmered in an aromatic broth with utazi, scent leaves, and a potent pepper soup spice blend. Light yet deeply satisfying.",
    price: 15.99,
    image: "/meals/catfish-pepper-soup.jpg",
    category: "soups-swallows",
    tags: ["spicy"],
    spicy: true,
  },

  // ── Grills & Proteins ───────────────────────────────────────
  {
    id: "suya",
    slug: "suya",
    name: "Beef Suya",
    description:
      "Thinly sliced beef marinated in ground peanuts and suya spice, grilled over open flame. Served with sliced onions, tomatoes, and extra yaji.",
    price: 10.99,
    image: "/meals/suya.jpg",
    category: "grills-proteins",
    tags: ["popular", "street-food"],
    spicy: true,
    featured: true,
  },
  {
    id: "chicken-suya",
    slug: "chicken-suya",
    name: "Chicken Suya",
    description:
      "Succulent chicken strips coated in yaji spice and grilled until charred at the edges. Served with onion rings and fresh tomatoes.",
    price: 11.99,
    image: "/meals/chicken-suya.jpg",
    category: "grills-proteins",
    tags: ["popular", "street-food"],
    spicy: true,
  },
  {
    id: "asun",
    slug: "asun",
    name: "Asun (Spicy Goat Meat)",
    description:
      "Smoky grilled goat meat tossed in a fiery pepper sauce with onions and bell peppers. A Lagos party classic.",
    price: 17.99,
    image: "/meals/asun.jpg",
    category: "grills-proteins",
    tags: ["party-favourite"],
    spicy: true,
  },
  {
    id: "peppered-chicken",
    slug: "peppered-chicken",
    name: "Peppered Chicken",
    description:
      "Crispy fried chicken smothered in a thick, spicy bell pepper and onion sauce. Finger-licking good.",
    price: 12.99,
    image: "/meals/peppered-chicken.jpg",
    category: "grills-proteins",
    tags: ["popular"],
    spicy: true,
  },
  {
    id: "grilled-fish",
    slug: "grilled-fish",
    name: "Grilled Croaker Fish",
    description:
      "Whole croaker fish marinated and grilled to perfection with peppered sauce on the side. Served with fried plantain.",
    price: 18.99,
    image: "/meals/grilled-fish.jpg",
    category: "grills-proteins",
    tags: [],
  },
  {
    id: "peppered-snail",
    slug: "peppered-snail",
    name: "Peppered Snail",
    description:
      "Giant African snails cooked in a fiery blend of scotch bonnets, onions, and aromatic spices. A true delicacy.",
    price: 19.99,
    image: "/meals/peppered-snail.jpg",
    category: "grills-proteins",
    tags: ["premium"],
    spicy: true,
  },
  {
    id: "nkwobi",
    slug: "nkwobi",
    name: "Nkwobi",
    description:
      "Tender cow foot in a rich, spicy palm oil sauce made with utazi leaves and traditional Igbo spices. Served warm.",
    price: 16.99,
    image: "/meals/nkwobi.jpg",
    category: "grills-proteins",
    tags: ["premium", "traditional"],
    spicy: true,
  },
  {
    id: "gizdodo",
    slug: "gizdodo",
    name: "Gizdodo",
    description:
      "Spicy fried gizzard tossed with sweet fried plantain cubes in a pepper and onion sauce. Addictively good.",
    price: 11.99,
    image: "/meals/gizdodo.jpg",
    category: "grills-proteins",
    tags: ["popular", "party-favourite"],
    spicy: true,
  },
  {
    id: "peppered-gizzard",
    slug: "peppered-gizzard",
    name: "Peppered Gizzard",
    description:
      "Tender chicken gizzard sauteed in a smoky pepper sauce with onions. Perfect as a starter or bar snack.",
    price: 9.99,
    image: "/meals/peppered-gizzard.jpg",
    category: "grills-proteins",
    tags: ["street-food"],
    spicy: true,
  },

  // ── Sides ───────────────────────────────────────────────────
  {
    id: "fried-plantain",
    slug: "fried-plantain",
    name: "Fried Plantain (Dodo)",
    description:
      "Sweet ripe plantain sliced and fried until golden and caramelised. The perfect side to any Nigerian meal.",
    price: 3.99,
    image: "/meals/fried-plantain.jpg",
    category: "sides",
    tags: ["popular"],
  },
  {
    id: "coleslaw",
    slug: "coleslaw",
    name: "Nigerian Coleslaw",
    description:
      "Creamy coleslaw made with shredded cabbage, carrots, and a mayonnaise dressing with a hint of salad cream.",
    price: 2.99,
    image: "/meals/coleslaw.jpg",
    category: "sides",
    tags: [],
  },
  {
    id: "moi-moi",
    slug: "moi-moi",
    name: "Moi Moi",
    description:
      "Steamed bean pudding made from blended peeled beans with peppers, onions, boiled eggs, and mackerel. Soft and savoury.",
    price: 5.99,
    image: "/meals/moi-moi.jpg",
    category: "sides",
    tags: ["vegetarian-option"],
  },
  {
    id: "plantain-chips",
    slug: "plantain-chips",
    name: "Plantain Chips",
    description:
      "Thinly sliced unripe plantain, lightly salted and fried until perfectly crispy. Addictive and crunchy.",
    price: 4.99,
    image: "/meals/plantain-chips.jpg",
    category: "sides",
    tags: ["snack"],
    servings: "150g bag",
  },
  {
    id: "boli",
    slug: "boli",
    name: "Boli (Roasted Plantain)",
    description:
      "Ripe plantain roasted over charcoal until smoky and soft inside. Served with groundnut and pepper sauce.",
    price: 4.99,
    image: "/meals/boli.jpg",
    category: "sides",
    tags: ["street-food"],
  },
  {
    id: "extra-meat",
    slug: "extra-meat",
    name: "Extra Assorted Meat",
    description:
      "An extra portion of assorted meats — beef, tripe (shaki), cow skin (ponmo), and cow foot. Perfect add-on for any soup.",
    price: 6.99,
    image: "/meals/extra-meat.jpg",
    category: "sides",
    tags: [],
  },

  // ── Snacks ──────────────────────────────────────────────────
  {
    id: "puff-puff",
    slug: "puff-puff",
    name: "Puff Puff",
    description:
      "Golden, fluffy Nigerian doughnuts lightly sweetened and deep-fried to perfection. Served in dozens.",
    price: 6.99,
    image: "/meals/puff-puff.jpg",
    category: "snacks",
    tags: ["street-food", "sweet"],
    servings: "12 pieces",
  },
  {
    id: "chin-chin",
    slug: "chin-chin",
    name: "Chin Chin",
    description:
      "Crunchy, sweet fried pastry strips — a beloved Nigerian snack for all occasions. Perfect for sharing.",
    price: 7.99,
    image: "/meals/chin-chin.jpg",
    category: "snacks",
    tags: ["sweet"],
    servings: "500g pack",
  },
  {
    id: "akara",
    slug: "akara",
    name: "Akara (Bean Cakes)",
    description:
      "Deep-fried bean fritters made from blended peeled beans, onions, and peppers. Crispy outside, fluffy inside.",
    price: 5.99,
    image: "/meals/akara.jpg",
    category: "snacks",
    tags: ["street-food", "vegetarian-option"],
    servings: "8 pieces",
  },
  {
    id: "meat-pie",
    slug: "meat-pie",
    name: "Nigerian Meat Pie",
    description:
      "Flaky golden pastry filled with seasoned minced beef, potatoes, and carrots. A bakery classic.",
    price: 3.99,
    image: "/meals/meat-pie.jpg",
    category: "snacks",
    tags: ["popular"],
  },
  {
    id: "spring-rolls",
    slug: "spring-rolls",
    name: "Spring Rolls",
    description:
      "Crispy pastry rolls filled with seasoned minced chicken and vegetables. Served with sweet chilli dip.",
    price: 6.99,
    image: "/meals/spring-rolls.jpg",
    category: "snacks",
    tags: ["party-favourite"],
    servings: "6 pieces",
  },
  {
    id: "scotch-egg",
    slug: "scotch-egg",
    name: "Nigerian Scotch Egg",
    description:
      "Hard-boiled egg wrapped in spiced minced meat, coated in breadcrumbs, and deep-fried until golden. A party staple.",
    price: 3.49,
    image: "/meals/scotch-egg.jpg",
    category: "snacks",
    tags: ["party-favourite"],
  },

  // ── Drinks ──────────────────────────────────────────────────
  {
    id: "chapman",
    slug: "chapman",
    name: "Chapman",
    description:
      "Nigeria's favourite mocktail — a refreshing mix of Fanta, Sprite, grenadine, Angostura bitters, and cucumber slices.",
    price: 4.99,
    image: "/meals/chapman.jpg",
    category: "drinks",
    tags: ["non-alcoholic"],
  },
  {
    id: "zobo",
    slug: "zobo",
    name: "Zobo Drink",
    description:
      "Chilled hibiscus flower drink infused with pineapple, ginger, and cloves. Naturally tangy and refreshing.",
    price: 3.99,
    image: "/meals/zobo.jpg",
    category: "drinks",
    tags: ["non-alcoholic", "natural"],
  },
  {
    id: "palm-wine",
    slug: "palm-wine",
    name: "Fresh Palm Wine",
    description:
      "Naturally fermented palm sap — sweet, mildly alcoholic, and served chilled. A true taste of tradition.",
    price: 8.99,
    image: "/meals/palm-wine.jpg",
    category: "drinks",
    tags: ["alcoholic", "traditional"],
  },
  {
    id: "kunu",
    slug: "kunu",
    name: "Kunu (Millet Drink)",
    description:
      "Smooth, spiced millet drink with ginger, cloves, and a hint of sweetness. A Northern Nigerian favourite served chilled.",
    price: 3.99,
    image: "/meals/kunu.jpg",
    category: "drinks",
    tags: ["non-alcoholic", "traditional"],
  },
  {
    id: "tiger-nut",
    slug: "tiger-nut",
    name: "Tiger Nut Drink (Kunun Aya)",
    description:
      "Creamy tiger nut milk blended with dates, coconut, and ginger. Naturally sweet and incredibly refreshing.",
    price: 4.99,
    image: "/meals/tiger-nut.jpg",
    category: "drinks",
    tags: ["non-alcoholic", "natural"],
  },
  {
    id: "ginger-drink",
    slug: "ginger-drink",
    name: "Ginger Drink",
    description:
      "Fiery homemade ginger juice with lemon and honey. Warming, zesty, and packed with natural goodness.",
    price: 3.49,
    image: "/meals/ginger-drink.jpg",
    category: "drinks",
    tags: ["non-alcoholic", "natural"],
    spicy: true,
  },

  // ── Party Packs ─────────────────────────────────────────────
  {
    id: "small-chops",
    slug: "small-chops",
    name: "Small Chops Platter",
    description:
      "The ultimate party starter — a mix of spring rolls, samosas, puff puff, peppered gizzard, and chicken strips with dipping sauces.",
    price: 29.99,
    image: "/meals/small-chops.jpg",
    category: "party-packs",
    tags: ["party-favourite"],
    featured: true,
    servings: "Serves 8-10",
  },
  {
    id: "party-jollof-tray",
    slug: "party-jollof-tray",
    name: "Party Jollof Tray",
    description:
      "Large catering tray of our signature smoky jollof rice with fried plantain and coleslaw. Perfect for gatherings.",
    price: 89.99,
    image: "/meals/party-jollof-tray.jpg",
    category: "party-packs",
    tags: ["catering", "party-favourite"],
    servings: "Serves 15-20",
  },
  {
    id: "suya-platter",
    slug: "suya-platter",
    name: "Suya Platter",
    description:
      "Generous sharing platter of mixed beef and chicken suya with extra yaji, onion rings, tomatoes, and suya pepper on the side.",
    price: 34.99,
    image: "/meals/suya-platter.jpg",
    category: "party-packs",
    tags: ["party-favourite"],
    spicy: true,
    servings: "Serves 6-8",
  },
  {
    id: "asun-tray",
    slug: "asun-tray",
    name: "Asun Party Tray",
    description:
      "Large tray of smoky peppered goat meat — the centrepiece of any Nigerian celebration. Comes with extra pepper sauce.",
    price: 69.99,
    image: "/meals/asun-tray.jpg",
    category: "party-packs",
    tags: ["catering", "party-favourite"],
    spicy: true,
    servings: "Serves 10-12",
  },
  {
    id: "combo-party-pack",
    slug: "combo-party-pack",
    name: "Kok Party Bundle",
    description:
      "The full package — jollof rice tray, fried rice tray, assorted grilled meats, small chops platter, fried plantain, and drinks. Let us handle the food so you can enjoy your event.",
    price: 249.99,
    image: "/meals/combo-party-pack.jpg",
    category: "party-packs",
    tags: ["catering", "best-value"],
    servings: "Serves 25-30",
    featured: true,
  },
];

export function getMenuItemBySlug(slug: string): MenuItem | undefined {
  return menuItems.find((item) => item.slug === slug);
}

export function getMenuItemsByCategory(category: string): MenuItem[] {
  return menuItems.filter((item) => item.category === category);
}

export function getFeaturedItems(): MenuItem[] {
  return menuItems.filter((item) => item.featured);
}

export function formatPrice(amount: number): string {
  return `£${amount.toFixed(2)}`;
}
