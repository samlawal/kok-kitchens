import type { MenuItem } from "./types";

export const menuItems: MenuItem[] = [
  // ── Rice Dishes ──────────────────────────────────────────────
  {
    id: "jollof-rice-small-tray",
    slug: "jollof-rice-small-tray",
    name: "Jollof Rice (Small Tray)",
    description:
      "Our signature smoky party jollof cooked low and slow with ripe tomatoes, scotch bonnets, and a blend of aromatic spices. Perfect for sharing.",
    price: 25,
    image: "/meals/jollof-rice.webp",
    category: "rice-dishes",
    tags: ["popular", "party-favourite"],
    featured: true,
    spicy: true,
    servings: "Small tray — serves 4-6",
  },
  {
    id: "fried-rice-small-tray",
    slug: "fried-rice-small-tray",
    name: "Fried Rice (Small Tray)",
    description:
      "Colourful stir-fried rice loaded with mixed vegetables, liver, and prawns. A party staple seasoned to perfection.",
    price: 30,
    image: "/meals/fried-rice.webp",
    category: "rice-dishes",
    tags: ["popular"],
    servings: "Small tray — serves 4-6",
  },
  {
    id: "ofada-rice",
    slug: "ofada-rice",
    name: "Ofada Rice",
    description:
      "Local unpolished ofada rice served with your choice of stew. Earthy, aromatic, and full of traditional flavour.",
    price: 50,
    image: "/meals/ofada-rice.webp",
    category: "rice-dishes",
    tags: ["traditional"],
    servings: "Small tray",
  },
  {
    id: "noodles-small-tray",
    slug: "noodles-small-tray",
    name: "Noodles (Small Tray)",
    description:
      "Stir-fried noodles tossed with vegetables, seasoning, and your choice of protein. A quick, satisfying crowd-pleaser.",
    price: 50,
    image: "/meals/noodles.webp",
    category: "rice-dishes",
    tags: ["comfort-food"],
    servings: "Small tray — serves 4-6",
  },

  // ── Soups & Swallows ────────────────────────────────────────
  {
    id: "egusi-soup",
    slug: "egusi-soup",
    name: "Egusi Soup (Melon Soup)",
    description:
      "Thick melon seed soup loaded with spinach, stockfish, assorted meats, and shaki. Rich, hearty, and deeply satisfying.",
    price: 50,
    image: "/meals/egusi-soup.webp",
    category: "soups-swallows",
    tags: ["popular", "traditional"],
    featured: true,
    servings: "Small tray",
  },
  {
    id: "efo-riro",
    slug: "efo-riro",
    name: "Efo Riro (Spinach Stew)",
    description:
      "Yoruba-style spinach stew cooked with palm oil, scotch bonnets, locust beans, and assorted meats or fish.",
    price: 45,
    image: "/meals/efo-riro.webp",
    category: "soups-swallows",
    tags: ["traditional"],
    spicy: true,
    servings: "Small pot",
  },
  {
    id: "okra-soup",
    slug: "okra-soup",
    name: "Okra Soup (Ila-Alasepo)",
    description:
      "Draw-style okra soup cooked with assorted meats, dried fish, palm oil, and a blend of traditional spices. Perfect with any swallow.",
    price: 45,
    image: "/meals/okra-soup.webp",
    category: "soups-swallows",
    tags: ["traditional"],
    servings: "Small pot",
  },
  {
    id: "ogbono-soup",
    slug: "ogbono-soup",
    name: "Ogbono Soup",
    description:
      "Rich, draw ogbono soup cooked with palm oil, assorted meats, dried fish, and leafy vegetables. Silky smooth and full of flavour.",
    price: 45,
    image: "/meals/ogbono-soup.webp",
    category: "soups-swallows",
    tags: ["traditional"],
    servings: "Small pot",
  },
  {
    id: "gbegiri-soup",
    slug: "gbegiri-soup",
    name: "Gbegiri Soup",
    description:
      "Smooth Yoruba bean soup traditionally paired with ewedu and amala. Creamy, comforting, and rich in protein.",
    price: 45,
    image: "/meals/gbegiri-soup.webp",
    category: "soups-swallows",
    tags: ["traditional"],
    servings: "From small pot",
  },
  {
    id: "pepper-soup",
    slug: "pepper-soup",
    name: "Pepper Soup",
    description:
      "Aromatic and fiery pepper soup with a potent spice blend. Warming, deeply flavoured, and perfect for cold evenings.",
    price: 50,
    image: "/meals/pepper-soup.webp",
    category: "soups-swallows",
    tags: ["spicy"],
    spicy: true,
  },
  {
    id: "ayamase",
    slug: "ayamase",
    name: "Ayamase (Designer Stew)",
    description:
      "Rich green pepper sauce made with assorted meats, locust beans, and palm oil. A Yoruba delicacy with a fiery kick.",
    price: 50,
    image: "/meals/ayamase.webp",
    category: "soups-swallows",
    tags: ["traditional", "spicy"],
    spicy: true,
    servings: "Small pot",
  },
  {
    id: "goat-meat-stew",
    slug: "goat-meat-stew",
    name: "Goat Meat Stew",
    description:
      "Tender goat meat slow-cooked in a rich tomato and pepper stew. Hearty, warming, and full of bold Nigerian flavour.",
    price: 55,
    image: "/meals/goat-meat-stew.webp",
    category: "soups-swallows",
    tags: ["popular"],
    servings: "Small tray",
  },
  {
    id: "fish-stew",
    slug: "fish-stew",
    name: "Fish Stew",
    description:
      "Flavourful fish stew made with fresh fish, tomatoes, peppers, and onions. Light yet deeply satisfying.",
    price: 55,
    image: "/meals/fish-stew.webp",
    category: "soups-swallows",
    tags: [],
    servings: "Small pot",
  },
  {
    id: "oxtail-stew",
    slug: "oxtail-stew",
    name: "Oxtail Stew",
    description:
      "Fall-off-the-bone oxtail braised in a rich, flavourful tomato and pepper stew. A premium comfort classic.",
    price: 55,
    image: "/meals/oxtail-stew.webp",
    category: "soups-swallows",
    tags: ["premium"],
    servings: "Small tray",
  },
  {
    id: "pounded-yam",
    slug: "pounded-yam",
    name: "Pounded Yam",
    description:
      "Smooth, stretchy pounded yam — the king of Nigerian swallows. Perfect paired with any of our soups.",
    price: 2,
    image: "/meals/pounded-yam.webp",
    category: "soups-swallows",
    tags: ["traditional"],
    servings: "Per wrap",
  },
  {
    id: "amala",
    slug: "amala",
    name: "Amala (Yam Flour)",
    description:
      "Silky yam flour swallow — a Yoruba staple best enjoyed with ewedu, gbegiri, or any draw soup.",
    price: 2,
    image: "/meals/amala.webp",
    category: "soups-swallows",
    tags: ["traditional"],
    servings: "Per wrap",
  },

  // ── Grills & Proteins ───────────────────────────────────────
  {
    id: "peppered-fish",
    slug: "peppered-fish",
    name: "Peppered Fish (Tray)",
    description:
      "Whole fish seasoned and grilled to perfection, then tossed in a fiery pepper and onion sauce. A true showstopper.",
    price: 130,
    image: "/meals/peppered-fish.webp",
    category: "grills-proteins",
    tags: ["premium", "party-favourite"],
    spicy: true,
    servings: "Large tray",
  },
  {
    id: "peppered-chicken",
    slug: "peppered-chicken",
    name: "Peppered Chicken",
    description:
      "Crispy fried chicken smothered in a thick, spicy bell pepper and onion sauce. Finger-licking good.",
    price: 45,
    image: "/meals/peppered-chicken.webp",
    category: "grills-proteins",
    tags: ["popular"],
    spicy: true,
    featured: true,
  },
  {
    id: "peppered-beef",
    slug: "peppered-beef",
    name: "Peppered Beef",
    description:
      "Tender beef pieces cooked in a rich, fiery pepper sauce with onions and spices. Bold and satisfying.",
    price: 40,
    image: "/meals/peppered-beef.webp",
    category: "grills-proteins",
    tags: ["popular"],
    spicy: true,
  },
  {
    id: "peppered-goat-meat",
    slug: "peppered-goat-meat",
    name: "Peppered Goat Meat",
    description:
      "Succulent goat meat cooked in a smoky, fiery pepper sauce. Rich, bold, and deeply flavoured — a Nigerian favourite.",
    price: 70,
    image: "/meals/peppered-goat-meat.webp",
    category: "grills-proteins",
    tags: ["premium"],
    spicy: true,
  },
  {
    id: "peppered-smoked-turkey",
    slug: "peppered-smoked-turkey",
    name: "Peppered Smoked Turkey",
    description:
      "Smoked turkey tossed in a spicy pepper sauce with onions and bell peppers. Smoky, spicy, and irresistible.",
    price: 65,
    image: "/meals/peppered-smoked-turkey.webp",
    category: "grills-proteins",
    tags: ["party-favourite"],
    spicy: true,
  },
  {
    id: "peppered-snail",
    slug: "peppered-snail",
    name: "Peppered Snail",
    description:
      "Giant African snails cooked in a fiery blend of scotch bonnets, onions, and aromatic spices. A true delicacy.",
    price: 7,
    image: "/meals/peppered-snail.webp",
    category: "grills-proteins",
    tags: ["premium"],
    spicy: true,
    servings: "From £7 each",
  },
  {
    id: "asun",
    slug: "asun",
    name: "Asun (Designer Beef)",
    description:
      "Smoky grilled meat tossed in a fiery pepper sauce with onions and bell peppers. A Lagos party classic you won't forget.",
    price: 55,
    image: "/meals/asun.webp",
    category: "grills-proteins",
    tags: ["party-favourite"],
    spicy: true,
  },
  {
    id: "assorted-meat",
    slug: "assorted-meat",
    name: "Assorted Meat (Small Tray)",
    description:
      "A generous mix of beef, tripe (shaki), cow skin (ponmo), and cow foot in rich pepper sauce. Perfect for sharing.",
    price: 55,
    image: "/meals/assorted-meat.webp",
    category: "grills-proteins",
    tags: ["popular"],
    servings: "Small tray",
  },
  {
    id: "dodo-gizzard",
    slug: "dodo-gizzard",
    name: "Dodo Gizzard (Small Tray)",
    description:
      "Spicy fried gizzard tossed with sweet fried plantain cubes in a pepper and onion sauce. Addictively good.",
    price: 55,
    image: "/meals/dodo-gizzard.webp",
    category: "grills-proteins",
    tags: ["popular", "party-favourite"],
    spicy: true,
    servings: "Small tray",
  },
  {
    id: "suya",
    slug: "suya",
    name: "Suya",
    description:
      "Thinly sliced beef marinated in ground peanuts and suya spice, grilled over open flame. Served with sliced onions and extra yaji.",
    price: 2.5,
    image: "/meals/suya.webp",
    category: "grills-proteins",
    tags: ["street-food", "popular"],
    spicy: true,
    featured: true,
    servings: "Per stick",
  },
  {
    id: "stick-meat",
    slug: "stick-meat",
    name: "Stick Meat",
    description:
      "Seasoned beef skewers grilled to perfection. Simple, smoky, and satisfying — a true street food favourite.",
    price: 2.5,
    image: "/meals/stick-meat.webp",
    category: "grills-proteins",
    tags: ["street-food"],
    servings: "Per stick",
  },

  // ── Sides ───────────────────────────────────────────────────
  {
    id: "fried-plantain",
    slug: "fried-plantain",
    name: "Fried Plantain (Dodo)",
    description:
      "Sweet ripe plantain sliced and fried until golden and caramelised. The perfect side to any Nigerian meal.",
    price: 20,
    image: "/meals/fried-plantain.webp",
    category: "sides",
    tags: ["popular"],
    featured: true,
    servings: "From £20",
  },
  {
    id: "fried-yam",
    slug: "fried-yam",
    name: "Fried Yam",
    description:
      "Chunky yam pieces deep-fried until crispy and golden. Served with pepper sauce for dipping.",
    price: 25,
    image: "/meals/fried-yam.webp",
    category: "sides",
    tags: ["popular"],
    servings: "From £25",
  },
  {
    id: "beans-ewa-riro",
    slug: "beans-ewa-riro",
    name: "Beans (Ewa Riro)",
    description:
      "Slow-cooked honey beans in a rich pepper and palm oil sauce with onions and crayfish. Hearty and satisfying.",
    price: 25,
    image: "/meals/beans.webp",
    category: "sides",
    tags: ["traditional"],
    servings: "From £25",
  },
  {
    id: "yam-pottage",
    slug: "yam-pottage",
    name: "Yam Pottage (Asaro)",
    description:
      "Soft yam cooked in a rich pepper and tomato sauce with palm oil, onions, and crayfish. Comfort food at its best.",
    price: 40,
    image: "/meals/yam-pottage.webp",
    category: "sides",
    tags: ["comfort-food"],
    servings: "Small tray",
  },
  {
    id: "moi-moi",
    slug: "moi-moi",
    name: "Moi Moi (Elewe)",
    description:
      "Steamed bean pudding wrapped in leaves, made from blended peeled beans with peppers, onions, and boiled eggs. Soft and savoury.",
    price: 2.5,
    image: "/meals/moi-moi.webp",
    category: "sides",
    tags: ["traditional"],
    servings: "Per wrap",
  },
  {
    id: "salad",
    slug: "salad",
    name: "Fresh Salad",
    description:
      "Crisp mixed greens with fresh vegetables, perfect as a light side to balance your meal.",
    price: 15,
    image: "/meals/salad.webp",
    category: "sides",
    tags: [],
  },

  // ── Snacks ──────────────────────────────────────────────────
  {
    id: "puff-puff",
    slug: "puff-puff",
    name: "Puff Puff",
    description:
      "Golden, fluffy Nigerian doughnuts lightly sweetened and deep-fried to perfection. A beloved party snack.",
    price: 20,
    image: "/meals/puff-puff.webp",
    category: "snacks",
    tags: ["street-food", "sweet"],
    servings: "From £20 per tray",
  },
  {
    id: "meat-pie-big",
    slug: "meat-pie-big",
    name: "Meat Pie (Big)",
    description:
      "Flaky golden pastry filled with seasoned minced beef, potatoes, and carrots. A bakery classic.",
    price: 2,
    image: "/meals/meat-pie.webp",
    category: "snacks",
    tags: ["popular"],
  },
  {
    id: "meat-pie-mini",
    slug: "meat-pie-mini",
    name: "Meat Pie (Mini)",
    description:
      "Bite-sized version of the classic meat pie — perfect for parties and events. Flaky pastry, savoury filling.",
    price: 1.2,
    image: "/meals/meat-pie-mini.webp",
    category: "snacks",
    tags: ["party-favourite"],
  },
  {
    id: "fish-pie-big",
    slug: "fish-pie-big",
    name: "Fish Pie (Big)",
    description:
      "Flaky golden pastry filled with seasoned fish, onions, and peppers. A delicious alternative to the classic meat pie.",
    price: 2,
    image: "/meals/fish-pie.webp",
    category: "snacks",
    tags: [],
  },
  {
    id: "fish-pie-mini",
    slug: "fish-pie-mini",
    name: "Fish Pie (Mini)",
    description:
      "Bite-sized fish pie — perfect finger food for parties and gatherings. Light, flaky, and packed with flavour.",
    price: 1.2,
    image: "/meals/fish-pie-mini.webp",
    category: "snacks",
    tags: ["party-favourite"],
  },
  {
    id: "spring-rolls",
    slug: "spring-rolls",
    name: "Spring Rolls",
    description:
      "Crispy pastry rolls filled with seasoned minced chicken and vegetables. A must-have party snack.",
    price: 15,
    image: "/meals/spring-rolls.webp",
    category: "snacks",
    tags: ["party-favourite"],
    servings: "Per platter",
  },
  {
    id: "samosa",
    slug: "samosa",
    name: "Samosa",
    description:
      "Golden fried pastry parcels filled with spiced minced meat and vegetables. Crispy, savoury, and irresistible.",
    price: 15,
    image: "/meals/samosa.webp",
    category: "snacks",
    tags: ["party-favourite"],
    servings: "Per platter",
  },
  {
    id: "sausage-roll",
    slug: "sausage-roll",
    name: "Sausage Roll",
    description:
      "Flaky pastry wrapped around seasoned sausage meat, baked until golden. A classic party favourite.",
    price: 15,
    image: "/meals/sausage-roll.webp",
    category: "snacks",
    tags: ["party-favourite"],
    servings: "Per platter",
  },

  // ── Drinks ──────────────────────────────────────────────────
  {
    id: "chapman",
    slug: "chapman",
    name: "Chapman",
    description:
      "Nigeria's favourite mocktail — a refreshing mix of Fanta, Sprite, grenadine, Angostura bitters, and cucumber slices.",
    price: 4.99,
    image: "/meals/chapman.webp",
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
    image: "/meals/zobo.webp",
    category: "drinks",
    tags: ["non-alcoholic", "natural"],
  },
  {
    id: "water",
    slug: "water",
    name: "Bottled Water",
    description:
      "Still mineral water — the perfect palate cleanser alongside your meal.",
    price: 1.5,
    image: "/meals/water.webp",
    category: "drinks",
    tags: ["non-alcoholic"],
  },
  {
    id: "coca-cola",
    slug: "coca-cola",
    name: "Coca-Cola",
    description:
      "The classic. Ice-cold Coca-Cola — the perfect companion to any Nigerian dish.",
    price: 2,
    image: "/meals/coke.webp",
    category: "drinks",
    tags: ["non-alcoholic"],
  },
  {
    id: "fanta",
    slug: "fanta",
    name: "Fanta Orange",
    description:
      "Fizzy, fruity Fanta Orange — refreshing and sweet. A crowd favourite.",
    price: 2,
    image: "/meals/fanta.webp",
    category: "drinks",
    tags: ["non-alcoholic"],
  },
  {
    id: "kunu",
    slug: "kunu",
    name: "Kunu (Millet Drink)",
    description:
      "Smooth, spiced millet drink with ginger, cloves, and a hint of sweetness. A Northern Nigerian favourite served chilled.",
    price: 3.99,
    image: "/meals/kunu.webp",
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
    image: "/meals/tiger-nut.webp",
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
    image: "/meals/ginger-drink.webp",
    category: "drinks",
    tags: ["non-alcoholic", "natural"],
    spicy: true,
  },

  // ── Party Packs ─────────────────────────────────────────────
  {
    id: "jollof-rice-half-cooler",
    slug: "jollof-rice-half-cooler",
    name: "Jollof Rice (Half Cooler)",
    description:
      "Our signature party jollof in a half cooler — enough to feed a crowd. Smoky, spicy, and unforgettable.",
    price: 50,
    image: "/meals/jollof-rice-half-cooler.webp",
    category: "party-packs",
    tags: ["catering", "party-favourite"],
    spicy: true,
    servings: "Half cooler — serves 10-15",
  },
  {
    id: "jollof-rice-cooler",
    slug: "jollof-rice-cooler",
    name: "Jollof Rice (Full Cooler)",
    description:
      "Full cooler of our legendary party jollof. The centrepiece of any celebration — smoky, perfectly seasoned, and cooked to perfection.",
    price: 100,
    image: "/meals/jollof-rice-cooler.webp",
    category: "party-packs",
    tags: ["catering", "party-favourite", "best-value"],
    spicy: true,
    servings: "Full cooler — serves 25-30",
  },
  {
    id: "fried-rice-half-cooler",
    slug: "fried-rice-half-cooler",
    name: "Fried Rice (Half Cooler)",
    description:
      "Colourful Nigerian fried rice in a half cooler, loaded with vegetables and seasoned to perfection for your event.",
    price: 60,
    image: "/meals/fried-rice-half-cooler.webp",
    category: "party-packs",
    tags: ["catering"],
    servings: "Half cooler — serves 10-15",
  },
  {
    id: "fried-rice-cooler",
    slug: "fried-rice-cooler",
    name: "Fried Rice (Full Cooler)",
    description:
      "Full cooler of vibrant Nigerian fried rice. Packed with mixed vegetables, liver, and prawns — a party essential.",
    price: 120,
    image: "/meals/fried-rice-cooler.webp",
    category: "party-packs",
    tags: ["catering", "best-value"],
    servings: "Full cooler — serves 25-30",
  },
  {
    id: "chicken-beef-stew-big-pot",
    slug: "chicken-beef-stew-big-pot",
    name: "Chicken/Beef Stew (Big Pot)",
    description:
      "Large pot of rich tomato and pepper stew with your choice of chicken or beef. Perfect for catering and events.",
    price: 90,
    image: "/meals/chicken-beef-stew.webp",
    category: "party-packs",
    tags: ["catering"],
    servings: "Big pot — serves 15-20",
  },
  {
    id: "small-chops-platter",
    slug: "small-chops-platter",
    name: "Small Chops Platter",
    description:
      "The ultimate party starter — a mix of spring rolls, samosas, crab claws, tempura king prawns, coated prawns, and sausage rolls.",
    price: 50,
    image: "/meals/small-chops.webp",
    category: "party-packs",
    tags: ["party-favourite", "catering"],
    featured: true,
    servings: "Serves 10-15",
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
