import type { MenuItem } from "./types";

export const menuItems: MenuItem[] = [
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
    id: "moi-moi",
    slug: "moi-moi",
    name: "Moi Moi",
    description:
      "Steamed bean pudding made from blended peeled beans with peppers, onions, boiled eggs, and mackerel. Soft and savoury.",
    price: 5.99,
    image: "/meals/moi-moi.jpg",
    category: "snacks",
    tags: ["vegetarian-option"],
  },
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
    id: "chapman",
    slug: "chapman",
    name: "Chapman",
    description:
      "Nigeria's favourite cocktail — a refreshing mix of Fanta, Sprite, grenadine, Angostura bitters, and cucumber slices.",
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
