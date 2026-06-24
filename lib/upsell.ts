// Customer-facing upsell logic — pure & testable.
//
// Two touchpoints (per the food-vertical playbook §12 H4 pattern):
//   • First-add toast    — slides in when the customer adds a "main" item
//                          that has a canonical pair; auto-dismisses in 8s.
//   • Cart-drawer card   — sits above the totals; persists while the cart
//                          has a "trigger" item without its canonical pair.
//
// Pairing rules for KOK's Nigerian menu:
//   1) Rice / party-pack / grill mains  →  Fried Plantain (Dodo).
//      The quintessential Nigerian companion — the "mushy peas" of jollof.
//   2) Any food without a drink         →  a popular drink (Chapman by default).
//
// Tests in upsell.test.ts cover every rule + edge case.

import type { CartItem, MenuItem } from "./types";

const TRIGGER_CATEGORIES: readonly string[] = [
  "rice-dishes",
  "party-packs",
  "grills-proteins",
];
const PLANTAIN_SLUG = "fried-plantain";
const DRINK_CATEGORY = "drinks";
const DEFAULT_DRINK_SLUG = "chapman";

function hasSlug(cart: CartItem[], slug: string): boolean {
  return cart.some((i) => i.menuItem.slug === slug);
}
function hasAnyInCategory(cart: CartItem[], category: string): boolean {
  return cart.some((i) => i.menuItem.category === category);
}
function hasAnyOutsideCategory(cart: CartItem[], category: string): boolean {
  return cart.some((i) => i.menuItem.category !== category);
}
function findInCatalogue(catalogue: MenuItem[], slug: string): MenuItem | null {
  return catalogue.find((i) => i.slug === slug) ?? null;
}

function needsPlantain(cart: CartItem[]): boolean {
  const hasTrigger = cart.some((i) =>
    TRIGGER_CATEGORIES.includes(i.menuItem.category),
  );
  return hasTrigger && !hasSlug(cart, PLANTAIN_SLUG);
}

function needsDrink(cart: CartItem[]): boolean {
  return (
    hasAnyOutsideCategory(cart, DRINK_CATEGORY) &&
    !hasAnyInCategory(cart, DRINK_CATEGORY)
  );
}

export interface UpsellOpts {
  /** Override the default drink suggestion (defaults to Chapman). */
  drinkSlug?: string;
}

/**
 * The single best upsell suggestion for the cart's current state.
 * Plantain takes priority over drinks — it's the higher-AOV pairing.
 * Returns null when the cart is empty or already complete.
 */
export function getCartUpsell(
  cart: CartItem[],
  catalogue: MenuItem[],
  opts: UpsellOpts = {},
): MenuItem | null {
  if (cart.length === 0) return null;
  if (needsPlantain(cart)) return findInCatalogue(catalogue, PLANTAIN_SLUG);
  if (needsDrink(cart)) {
    return findInCatalogue(catalogue, opts.drinkSlug ?? DEFAULT_DRINK_SLUG);
  }
  return null;
}

/**
 * The suggestion to flash after a specific item is added to the cart.
 * Only triggers for "main" categories that have a canonical pair, and only
 * when that pair isn't already in the cart. Returns null otherwise — so
 * we never toast for sides, drinks, snacks, or items the customer already
 * added the pair for.
 *
 * `cart` should include the just-added item (i.e. the post-add state).
 */
export function getFirstAddUpsell(
  addedItem: MenuItem,
  cart: CartItem[],
  catalogue: MenuItem[],
): MenuItem | null {
  if (!TRIGGER_CATEGORIES.includes(addedItem.category)) return null;
  if (hasSlug(cart, PLANTAIN_SLUG)) return null;
  return findInCatalogue(catalogue, PLANTAIN_SLUG);
}
