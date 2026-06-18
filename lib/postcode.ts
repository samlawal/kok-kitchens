// UK postcode validation, autocomplete and delivery-zone resolution via the
// free postcodes.io API (no key, CORS-enabled — safe to call from the browser).

export const KITCHEN = { lat: 51.675027, lng: -0.330252 }; // WD7 8PQ, Radlett

// Curated delivery areas — authoritative (fees are intentional). Distance only
// decides UNLISTED postcodes, so these never get reclassified.
export const LOCAL_POSTCODES = [
  "WD6", "WD7", "WD23", "WD25", // Borehamwood, Radlett, Bushey, Watford
  "EN5", "EN6",                 // Barnet, Potters Bar
];
export const EXTENDED_POSTCODES = [
  "WD1", "WD2", "WD3", "WD4", "WD5", "WD17", "WD18", "WD19", "WD24",
  "HA0", "HA1", "HA2", "HA3", "HA4", "HA5", "HA6", "HA7", "HA8", "HA9",
  "NW4", "NW7", "NW9", "NW11",
  "N2", "N3", "N11", "N12", "N14", "N20",
  "EN1", "EN2", "EN3", "EN4", "EN7", "EN8",
  "AL1", "AL2", "AL3", "AL4", "AL10",
  "HP1", "HP2", "HP3",
];

// Furthest we'll deliver to an unlisted postcode before treating it as out of
// area (the curated extended set reaches ~12 miles).
export const MAX_DELIVERY_MILES = 13;

export type Zone = "local" | "extended" | "unknown";

export interface PostcodeLookup {
  valid: boolean;
  latitude?: number;
  longitude?: number;
  area?: string; // admin_district, e.g. "Hertsmere" / "Watford"
}

/**
 * Outward prefix used for zone matching, e.g. "WD7 8PQ" -> "WD7".
 * The inward/outward boundary is the space; without one, the inward code is
 * always the last 3 chars (digit + 2 letters), so a simple `^[A-Z]+\d+` regex
 * is wrong — it greedily merges the two ("WD78PQ" -> "WD78").
 */
export function outwardPrefix(postcode: string): string {
  const trimmed = postcode.toUpperCase().trim();
  if (trimmed.includes(" ")) return trimmed.split(/\s+/)[0];
  const pc = trimmed.replace(/\s/g, "");
  return pc.length >= 5 ? pc.slice(0, -3) : pc;
}

/** Great-circle distance in miles. */
export function haversineMiles(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 3958.8;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(a));
}

/**
 * Resolve the delivery zone. Curated lists win; for unlisted postcodes, fall
 * back to distance from the kitchen (needs coords from a lookup).
 */
export function zoneFromPostcode(
  postcode: string,
  coords?: { latitude: number; longitude: number }
): Zone {
  const prefix = outwardPrefix(postcode);
  if (LOCAL_POSTCODES.includes(prefix)) return "local";
  if (EXTENDED_POSTCODES.includes(prefix)) return "extended";
  if (coords) {
    const miles = haversineMiles(
      KITCHEN.lat,
      KITCHEN.lng,
      coords.latitude,
      coords.longitude
    );
    if (miles <= MAX_DELIVERY_MILES) return "extended";
  }
  return "unknown";
}

/** Look up a full postcode — validates it exists and returns coords + area. */
export async function fetchPostcode(postcode: string): Promise<PostcodeLookup> {
  const pc = postcode.replace(/\s/g, "");
  try {
    const res = await fetch(
      `https://api.postcodes.io/postcodes/${encodeURIComponent(pc)}`
    );
    if (!res.ok) return { valid: false };
    const data = await res.json();
    const r = data?.result;
    if (!r) return { valid: false };
    return {
      valid: true,
      latitude: r.latitude,
      longitude: r.longitude,
      area: r.admin_district,
    };
  } catch {
    return { valid: false };
  }
}

/** Suggest valid full postcodes for a partial entry (predictive). */
export async function autocompletePostcode(partial: string): Promise<string[]> {
  const q = partial.replace(/\s/g, "");
  if (q.length < 2) return [];
  try {
    const res = await fetch(
      `https://api.postcodes.io/postcodes/${encodeURIComponent(q)}/autocomplete`
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data?.result) ? data.result : [];
  } catch {
    return [];
  }
}
