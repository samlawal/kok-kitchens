export type Category =
  | "rice-dishes"
  | "soups-swallows"
  | "grills-proteins"
  | "snacks"
  | "drinks"
  | "party-packs";

export interface MenuItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: Category;
  tags: string[];
  featured?: boolean;
  spicy?: boolean;
  servings?: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
}

export interface OrderDetails {
  items: CartItem[];
  customer: CustomerInfo;
  deliveryType: "delivery" | "pickup";
  total: number;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  notes?: string;
}

export const CATEGORY_LABELS: Record<Category, string> = {
  "rice-dishes": "Rice Dishes",
  "soups-swallows": "Soups & Swallows",
  "grills-proteins": "Grills & Proteins",
  snacks: "Snacks",
  drinks: "Drinks",
  "party-packs": "Party Packs",
};
