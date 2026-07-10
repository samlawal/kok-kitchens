import type { MenuItem } from "./types";
import { menuItems } from "./menu-data";

// Canonical category order = the order categories first appear in the source
// data (so "all" view keeps Rice → Soups → … while going A–Z inside each).
const categoryOrder = Array.from(new Set(menuItems.map((i) => i.category)));

/**
 * Sort menu items alphabetically by name WITHIN each category, keeping the
 * categories in their canonical order. `names` carries admin renames so the
 * customer-facing (possibly renamed) name drives the ordering.
 *
 * Customer request — KOK Kitchen, 2026-07-09 (Taiwo): dishes should read A–Z
 * in each menu / sub-menu.
 */
export function sortMenuForDisplay(
  items: MenuItem[],
  names: Record<string, string> = {}
): MenuItem[] {
  return [...items].sort((a, b) => {
    const ca = categoryOrder.indexOf(a.category);
    const cb = categoryOrder.indexOf(b.category);
    if (ca !== cb) return ca - cb;
    const na = names[a.id] ?? a.name;
    const nb = names[b.id] ?? b.name;
    return na.localeCompare(nb, "en", { sensitivity: "base" });
  });
}
