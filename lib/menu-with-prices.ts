import { menuItems } from "./menu-data";
import type { MenuItem } from "./types";

// Re-export for convenience
export type { MenuItem } from "./types";
export { formatPrice, getMenuItemBySlug, getMenuItemsByCategory, getFeaturedItems } from "./menu-data";

/**
 * Get menu items with live price overrides from the database.
 * Use this in server components / API routes for real-time pricing.
 * Falls back to static prices if DB is unavailable.
 */
export async function getMenuItemsWithPrices(): Promise<MenuItem[]> {
  try {
    const { getDb } = await import("./db");
    const sql = getDb();
    const overrides = await sql`
      SELECT menu_item_id, price FROM price_overrides
    `;

    const priceMap = new Map<string, number>();
    for (const row of overrides) {
      priceMap.set(row.menu_item_id as string, Number(row.price));
    }

    if (priceMap.size === 0) return menuItems;

    return menuItems.map((item) => {
      const override = priceMap.get(item.id);
      if (override !== undefined) {
        return { ...item, price: override };
      }
      return item;
    });
  } catch {
    // DB unavailable — return static prices
    return menuItems;
  }
}
