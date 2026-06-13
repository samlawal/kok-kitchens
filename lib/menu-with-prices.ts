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

    // Fetch price overrides and availability in parallel
    const [overrides, availability] = await Promise.all([
      sql`SELECT menu_item_id, price FROM price_overrides`,
      sql`SELECT menu_item_id, status FROM item_availability`,
    ]);

    const priceMap = new Map<string, number>();
    for (const row of overrides) {
      priceMap.set(row.menu_item_id as string, Number(row.price));
    }

    type AvailStatus = "available" | "unavailable" | "hidden";
    const availabilityMap = new Map<string, AvailStatus>();
    for (const row of availability) {
      availabilityMap.set(row.menu_item_id as string, row.status as AvailStatus);
    }

    if (priceMap.size === 0 && availabilityMap.size === 0) return menuItems;

    return menuItems.map((item) => {
      const priceOverride = priceMap.get(item.id);
      const statusOverride = availabilityMap.get(item.id);
      return {
        ...item,
        ...(priceOverride !== undefined && { price: priceOverride }),
        availability: statusOverride || "available",
      };
    });
  } catch {
    // DB unavailable — return static prices, all available
    return menuItems;
  }
}
