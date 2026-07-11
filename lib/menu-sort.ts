import type { MenuItem } from "./types";
import { menuItems } from "./menu-data";

// Canonical category order = the order categories first appear in the source
// data (so "all" view keeps Rice → Soups → … while going A–Z inside each).
const categoryOrder = Array.from(new Set(menuItems.map((i) => i.category)));

/**
 * Sort menu items alphabetically by (possibly renamed) name.
 *
 * - `flat: true`  → pure A–Z across all items (used for the "All" view).
 * - `flat: false`  → A–Z within each category, categories in canonical order
 *                    (used when a single category is selected).
 */
export function sortMenuForDisplay(
  items: MenuItem[],
  names: Record<string, string> = {},
  flat = false
): MenuItem[] {
  return [...items].sort((a, b) => {
    if (!flat) {
      const ca = categoryOrder.indexOf(a.category);
      const cb = categoryOrder.indexOf(b.category);
      if (ca !== cb) return ca - cb;
    }
    const na = names[a.id] ?? a.name;
    const nb = names[b.id] ?? b.name;
    return na.localeCompare(nb, "en", { sensitivity: "base" });
  });
}
