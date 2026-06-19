// Equipment & tableware hire catalogue (from KOK KITCHEN PRICE LIST HIRE.pdf).
// Food/catering items in that PDF (oxtail stew etc.) are intentionally excluded
// — those belong to the menu, not hire.

export type HireCategory =
  | "chafing"
  | "tableware"
  | "charger-plates"
  | "coolers";

export interface HireItem {
  id: string;
  name: string;
  price: number;
  /** e.g. "each", "per can" — shown after the price where it adds clarity. */
  unit?: string;
  category: HireCategory;
  note?: string;
}

export const HIRE_CATEGORY_LABELS: Record<HireCategory, string> = {
  chafing: "Chafing Dishes & Fuel",
  tableware: "Cutlery & Tableware",
  "charger-plates": "Charger Plates",
  coolers: "Coolers & Cool Boxes",
};

export const HIRE_CATEGORY_ORDER: HireCategory[] = [
  "chafing",
  "charger-plates",
  "tableware",
  "coolers",
];

export const hireItems: HireItem[] = [
  // Chafing dishes & fuel
  { id: "chafing-single", name: "Chafing Dish — Single", price: 10, unit: "13L", category: "chafing" },
  { id: "chafing-double", name: "Chafing Dish — Double", price: 10, unit: "13L", category: "chafing" },
  { id: "chafing-gold-9l", name: "Chafing Dish — Gold (9L)", price: 20, category: "chafing" },
  { id: "chafing-gold-13l", name: "Chafing Dish — Gold (13L)", price: 30, category: "chafing" },
  { id: "chafing-gold-round", name: "Chafing Dish — Gold Round (9L)", price: 40, category: "chafing" },
  { id: "chafing-fuel-2-5h", name: "Chafing Dish Fuel", price: 3, unit: "2.5 hrs", category: "chafing" },
  { id: "chafing-fuel-6h", name: "Chafing Dish Fuel", price: 4.99, unit: "6 hrs", category: "chafing" },

  // Charger plates
  { id: "charger-gold", name: "Charger Plate — Gold", price: 3, unit: "each", category: "charger-plates" },
  { id: "charger-silver", name: "Charger Plate — Silver", price: 3, unit: "each", category: "charger-plates" },
  { id: "charger-clear", name: "Charger Plate — Clear", price: 3, unit: "each", category: "charger-plates" },
  { id: "charger-wine", name: "Charger Plate — Wine", price: 3, unit: "each", category: "charger-plates" },
  { id: "charger-red", name: "Charger Plate — Red", price: 3, unit: "each", category: "charger-plates" },
  { id: "charger-blue", name: "Charger Plate — Blue", price: 3, unit: "each", category: "charger-plates" },
  { id: "charger-multi", name: "Charger Plate — Multi Colour", price: 3, unit: "each", category: "charger-plates" },
  { id: "charger-with-cutlery", name: "Charger Plate with Cutlery", price: 5, category: "charger-plates" },
  { id: "charger-set", name: "Charger Plate Set", price: 5, category: "charger-plates" },
  { id: "charger-gold-set", name: "Gold Charger Plate Set", price: 5, category: "charger-plates" },

  // Cutlery & tableware
  { id: "cutlery-set", name: "Cutlery Set", price: 1.8, category: "tableware" },
  { id: "cutlery-gold-set", name: "Gold Cutlery Set", price: 2, category: "tableware" },
  { id: "party-cutlery-set", name: "Party Cutlery Set", price: 4, category: "tableware" },
  { id: "glass-cups", name: "Glass Cups", price: 0.45, unit: "each", category: "tableware" },
  { id: "wine-cups", name: "Wine Cups", price: 0.5, unit: "each", category: "tableware" },
  { id: "soup-bowl", name: "Soup Bowl", price: 1, unit: "each", category: "tableware" },
  { id: "food-plate", name: "Food Plate", price: 0.45, unit: "28cm", category: "tableware" },
  { id: "wood-plates", name: "Wood Plates", price: 1, unit: "each", category: "tableware" },

  // Coolers
  { id: "food-cooler-24l", name: "Food Cooler", price: 20, unit: "24L", category: "coolers" },
  { id: "drinks-cooler-100l", name: "Drinks Cooler", price: 20, unit: "100L", category: "coolers" },
  { id: "cool-box-170l", name: "Cool Box", price: 30, unit: "170L", category: "coolers" },
];

export interface HireSelection {
  item: HireItem;
  quantity: number;
}

/** Estimated subtotal for a set of hire selections. */
export function hireTotal(selections: HireSelection[]): number {
  return selections.reduce((sum, s) => sum + s.item.price * s.quantity, 0);
}
