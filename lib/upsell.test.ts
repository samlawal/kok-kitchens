import { describe, it, expect } from "vitest";
import { getCartUpsell, getFirstAddUpsell } from "./upsell";
import type { CartItem, MenuItem } from "./types";

// Minimal catalogue stand-in — only the fields the upsell logic touches.
const item = (
  slug: string,
  category: string,
  price = 10,
): MenuItem => ({
  id: slug,
  slug,
  name: slug,
  description: "",
  price,
  image: "",
  category: category as MenuItem["category"],
  tags: [],
});

const PLANTAIN = item("fried-plantain", "sides", 20);
const CHAPMAN = item("chapman", "drinks", 4.99);
const ZOBO = item("zobo", "drinks", 3.99);
const JOLLOF = item("jollof-rice-small-tray", "rice-dishes", 25);
const FRIED_RICE = item("fried-rice-small-tray", "rice-dishes", 30);
const PARTY_PACK = item("party-pack-jollof", "party-packs", 80);
const SUYA = item("suya", "grills-proteins", 2.5);
const EGUSI = item("egusi", "soups-swallows", 35);
const SMALL_CHOPS = item("small-chops", "snacks", 30);
const SALAD = item("salad", "sides", 15);

const CATALOGUE = [PLANTAIN, CHAPMAN, ZOBO, JOLLOF, FRIED_RICE, PARTY_PACK, SUYA, EGUSI, SMALL_CHOPS, SALAD];

const cart = (...items: { menuItem: MenuItem; quantity?: number }[]): CartItem[] =>
  items.map((i) => ({ menuItem: i.menuItem, quantity: i.quantity ?? 1 }));

describe("getCartUpsell — pairing rules", () => {
  it("returns null for an empty cart (don't push food on no-one)", () => {
    expect(getCartUpsell([], CATALOGUE)).toBeNull();
  });

  it("suggests Plantain for a rice main", () => {
    expect(getCartUpsell(cart({ menuItem: JOLLOF }), CATALOGUE)?.slug).toBe("fried-plantain");
  });

  it("suggests Plantain for a grill main", () => {
    expect(getCartUpsell(cart({ menuItem: SUYA }), CATALOGUE)?.slug).toBe("fried-plantain");
  });

  it("suggests Plantain for a party-pack main", () => {
    expect(getCartUpsell(cart({ menuItem: PARTY_PACK }), CATALOGUE)?.slug).toBe("fried-plantain");
  });

  it("Plantain takes priority over the drink upsell", () => {
    // Rice main, no plantain, no drink → Plantain wins.
    expect(getCartUpsell(cart({ menuItem: JOLLOF }), CATALOGUE)?.slug).toBe("fried-plantain");
  });

  it("after Plantain is added, switches to suggesting a drink", () => {
    const c = cart({ menuItem: JOLLOF }, { menuItem: PLANTAIN });
    expect(getCartUpsell(c, CATALOGUE)?.slug).toBe("chapman");
  });

  it("respects an override drink slug", () => {
    const c = cart({ menuItem: JOLLOF }, { menuItem: PLANTAIN });
    expect(getCartUpsell(c, CATALOGUE, { drinkSlug: "zobo" })?.slug).toBe("zobo");
  });

  it("suggests a drink for a soup (soup + swallow already pairs itself)", () => {
    expect(getCartUpsell(cart({ menuItem: EGUSI }), CATALOGUE)?.slug).toBe("chapman");
  });

  it("suggests a drink for snacks (small chops)", () => {
    expect(getCartUpsell(cart({ menuItem: SMALL_CHOPS }), CATALOGUE)?.slug).toBe("chapman");
  });

  it("no upsell when cart is complete (main + plantain + drink)", () => {
    const c = cart(
      { menuItem: JOLLOF },
      { menuItem: PLANTAIN },
      { menuItem: CHAPMAN },
    );
    expect(getCartUpsell(c, CATALOGUE)).toBeNull();
  });

  it("no upsell when cart is only drinks", () => {
    expect(getCartUpsell(cart({ menuItem: CHAPMAN }), CATALOGUE)).toBeNull();
  });

  it("suggests a drink even for a side-only cart (drinks pair with anything)", () => {
    expect(getCartUpsell(cart({ menuItem: SALAD }), CATALOGUE)?.slug).toBe("chapman");
  });

  it("returns null when the suggested item isn't in the catalogue (e.g. plantain marked unavailable upstream)", () => {
    const noPlantain = CATALOGUE.filter((i) => i.slug !== "fried-plantain");
    expect(getCartUpsell(cart({ menuItem: JOLLOF }), noPlantain)).toBeNull();
  });
});

describe("getFirstAddUpsell — toast after a specific add", () => {
  it("suggests Plantain when a rice main is added (and no Plantain in cart yet)", () => {
    const c = cart({ menuItem: JOLLOF });
    expect(getFirstAddUpsell(JOLLOF, c, CATALOGUE)?.slug).toBe("fried-plantain");
  });

  it("suggests Plantain on a grill add", () => {
    const c = cart({ menuItem: SUYA });
    expect(getFirstAddUpsell(SUYA, c, CATALOGUE)?.slug).toBe("fried-plantain");
  });

  it("no toast for sides — they ARE the upsell", () => {
    const c = cart({ menuItem: PLANTAIN });
    expect(getFirstAddUpsell(PLANTAIN, c, CATALOGUE)).toBeNull();
  });

  it("no toast for drinks", () => {
    const c = cart({ menuItem: CHAPMAN });
    expect(getFirstAddUpsell(CHAPMAN, c, CATALOGUE)).toBeNull();
  });

  it("no toast for snacks (they get the drink suggestion via the cart card)", () => {
    const c = cart({ menuItem: SMALL_CHOPS });
    expect(getFirstAddUpsell(SMALL_CHOPS, c, CATALOGUE)).toBeNull();
  });

  it("no toast when the cart already has the suggested pair", () => {
    const c = cart({ menuItem: PLANTAIN }, { menuItem: JOLLOF });
    expect(getFirstAddUpsell(JOLLOF, c, CATALOGUE)).toBeNull();
  });

  it("no toast for soups (already self-pairing with their swallow)", () => {
    const c = cart({ menuItem: EGUSI });
    expect(getFirstAddUpsell(EGUSI, c, CATALOGUE)).toBeNull();
  });
});
