// Delivery area data for the per-town SEO landing pages (/delivery/[town]).
// One source of truth so the footer list, sitemap, hub page and town pages
// stay in sync. Anchors are real postcodes + well-known landmarks only —
// nothing invented.

export const DELIVERY_FEES = {
  local: 8.99,
  extended: 13.99,
} as const;

export type DeliveryZone = "local" | "extended";

export interface DeliveryArea {
  slug: string;
  name: string;
  county: "Hertfordshire" | "North London";
  postcodes: string[];
  zone: DeliveryZone;
  // 1–2 sentences of real local anchor (street, area, nearest tube/road) — the
  // distinct content that makes each page non-templated. No invented venues.
  localContext: string;
  // Slugs of nearby towns, for internal-link "we also deliver to" pills.
  nearby: string[];
}

export const DELIVERY_AREAS: DeliveryArea[] = [
  {
    slug: "borehamwood",
    name: "Borehamwood",
    county: "Hertfordshire",
    postcodes: ["WD6"],
    zone: "local",
    localContext:
      "Our home patch. We cook in Borehamwood and deliver across WD6 — from Shenley Road and Elstree Way to the streets around Elstree Studios. Free pickup is available straight from the kitchen.",
    nearby: ["radlett", "bushey", "barnet", "edgware"],
  },
  {
    slug: "radlett",
    name: "Radlett",
    county: "Hertfordshire",
    postcodes: ["WD7"],
    zone: "local",
    localContext:
      "A quick run along Watling Street from our Borehamwood kitchen. We deliver across WD7 — the village, Newberries and the surrounding lanes.",
    nearby: ["borehamwood", "bushey", "st-albans", "watford"],
  },
  {
    slug: "bushey",
    name: "Bushey",
    county: "Hertfordshire",
    postcodes: ["WD23"],
    zone: "local",
    localContext:
      "Just south-west of Borehamwood. We deliver across WD23 — Bushey village, Bushey Heath and Oxhey — inside our local zone.",
    nearby: ["borehamwood", "watford", "edgware", "barnet"],
  },
  {
    slug: "barnet",
    name: "Barnet",
    county: "North London",
    postcodes: ["EN5"],
    zone: "local",
    localContext:
      "High Barnet, Chipping Barnet and the historic market town centre. EN5 sits in our local zone — a short hop from Borehamwood along the A1.",
    nearby: ["borehamwood", "finchley", "hendon", "edgware"],
  },
  {
    slug: "watford",
    name: "Watford",
    county: "Hertfordshire",
    postcodes: ["WD17", "WD18", "WD19", "WD24"],
    zone: "extended",
    localContext:
      "The town centre, the Vicarage Road end, and the wider WD17–24 area. We deliver across central Watford, North Watford and Garston.",
    nearby: ["bushey", "radlett", "st-albans", "borehamwood"],
  },
  {
    slug: "st-albans",
    name: "St Albans",
    county: "Hertfordshire",
    postcodes: ["AL1", "AL2", "AL3", "AL4"],
    zone: "extended",
    localContext:
      "The historic cathedral city. We deliver across AL1–AL4 — the city centre, Marshalswick, Sandridge, and the villages south of the M25.",
    nearby: ["radlett", "watford", "borehamwood", "barnet"],
  },
  {
    slug: "edgware",
    name: "Edgware",
    county: "North London",
    postcodes: ["HA8"],
    zone: "extended",
    localContext:
      "At the top of the Northern Line, on the Hertfordshire border. We deliver across HA8 — Edgware town centre, Burnt Oak and the streets around Edgware Road.",
    nearby: ["mill-hill", "hendon", "borehamwood", "bushey"],
  },
  {
    slug: "hendon",
    name: "Hendon",
    county: "North London",
    postcodes: ["NW4"],
    zone: "extended",
    localContext:
      "NW4 — Hendon Central, Brent Cross and the streets around Middlesex University. A short run down from Borehamwood via the A41.",
    nearby: ["mill-hill", "edgware", "finchley", "barnet"],
  },
  {
    slug: "mill-hill",
    name: "Mill Hill",
    county: "North London",
    postcodes: ["NW7"],
    zone: "extended",
    localContext:
      "NW7 — Mill Hill village, Mill Hill East and Mill Hill Broadway, between Edgware and Finchley.",
    nearby: ["edgware", "hendon", "finchley", "barnet"],
  },
  {
    slug: "finchley",
    name: "Finchley",
    county: "North London",
    postcodes: ["N3", "N12"],
    zone: "extended",
    localContext:
      "Spanning North Finchley (N12) and Finchley Central (N3), along Ballards Lane and the Tally Ho corner.",
    nearby: ["barnet", "hendon", "mill-hill", "edgware"],
  },
];

export function getDeliveryArea(slug: string): DeliveryArea | undefined {
  return DELIVERY_AREAS.find((a) => a.slug === slug);
}

export function getNearbyAreas(slugs: string[]): DeliveryArea[] {
  return slugs
    .map((s) => DELIVERY_AREAS.find((a) => a.slug === s))
    .filter((a): a is DeliveryArea => Boolean(a));
}

// Town-specific FAQ items, with the area's real postcodes + zone fee folded in
// so each page's FAQ block is genuinely distinct (not boilerplate with the
// name swapped). Also drives the per-page FAQPage JSON-LD via FaqAccordion.
export function getDeliveryFaqs(
  area: DeliveryArea,
): { q: string; a: string }[] {
  const fee = DELIVERY_FEES[area.zone].toFixed(2);
  const time = area.zone === "local" ? "30–45 minutes" : "45–60 minutes";
  const postcodeList = area.postcodes.join(", ");
  return [
    {
      q: `Do you deliver Nigerian food to ${area.name}?`,
      a: `Yes — we deliver across ${postcodeList} from our Borehamwood kitchen. Order from the menu or message us on WhatsApp.`,
    },
    {
      q: `How much is delivery to ${area.name}?`,
      a: `£${fee}. ${area.name} sits in our ${area.zone} zone. Free pickup is also available from our Borehamwood kitchen.`,
    },
    {
      q: `How long does delivery to ${area.name} take?`,
      a: `Typically around ${time} from when we start your order. We cook fresh, so it’s worth ordering ahead for busy Friday and Saturday evenings.`,
    },
    {
      q: `Can you cater events in ${area.name}?`,
      a: `Yes — for weddings, birthdays, naming ceremonies and corporate events. Use our catering quote form and we’ll reply within 24 hours with a tailored quote.`,
    },
  ];
}
