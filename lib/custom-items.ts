import { getDb, ensureSchema } from "@/lib/db";
import type { MenuItem } from "@/lib/types";

// ─────────────────────────────────────────────────────────────────────────────
// Single source of truth for the custom_menu_items table (admin-added menu
// items). BEFORE this module, five consumers each wrote their own raw SQL and
// coerced `price` by hand — and the admin read path forgot to, so Neon's
// string NUMERIC crashed the admin (bug-2026-07-21-Jc0pDnIObaI, DESIGN D-006).
// Now: one row type, one mapper (the ONLY place coercion happens), one reader.
// ─────────────────────────────────────────────────────────────────────────────

/** A row exactly as Neon RETURNS it — note `price` is a string (NUMERIC). */
export interface CustomItemRow {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number | string;
  category: string;
  image: string;
  spicy: boolean;
  servings: string | null;
}

/** The clean domain type every consumer uses — `price` is guaranteed a number. */
export interface CustomItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  spicy: boolean;
  servings: string | null;
}

const SELECT_COLUMNS =
  "id, slug, name, description, price, category, image, spicy, servings";

/**
 * The ONLY place a raw custom_menu_items row becomes a CustomItem. All coercion
 * lives here — above all `Number(price)`, because Neon returns NUMERIC as a
 * string and calling `.toFixed()` on it crashes any render.
 */
export function mapCustomItemRow(row: CustomItemRow): CustomItem {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    category: row.category,
    image: row.image || "",
    spicy: Boolean(row.spicy),
    servings: row.servings ?? null,
  };
}

/** Adapt a CustomItem to the public menu's MenuItem shape (adds empty tags). */
export function customItemToMenuItem(item: CustomItem): MenuItem {
  return {
    id: item.id,
    slug: item.slug,
    name: item.name,
    description: item.description,
    price: item.price,
    category: item.category as MenuItem["category"],
    image: item.image,
    spicy: item.spicy,
    servings: item.servings || undefined,
    tags: [],
  };
}

/** All custom items, newest first — the single read path (SELECT + heal + map). */
export async function getCustomItems(): Promise<CustomItem[]> {
  const sql = getDb();
  const rows = (await ensureSchema(
    () => sql`
      SELECT id, slug, name, description, price, category, image, spicy, servings
      FROM custom_menu_items
      ORDER BY created_at DESC
    `
  )) as CustomItemRow[];
  return rows.map(mapCustomItemRow);
}

/**
 * One custom item by slug, or null. Public-facing (the menu page), so it must
 * never throw — a DB/query failure degrades to "not a custom item".
 */
export async function getCustomItemBySlug(slug: string): Promise<CustomItem | null> {
  try {
    const sql = getDb();
    const rows = (await ensureSchema(
      () => sql`
        SELECT id, slug, name, description, price, category, image, spicy, servings
        FROM custom_menu_items
        WHERE slug = ${slug}
        LIMIT 1
      `
    )) as CustomItemRow[];
    return rows[0] ? mapCustomItemRow(rows[0]) : null;
  } catch {
    return null;
  }
}

export { SELECT_COLUMNS };
