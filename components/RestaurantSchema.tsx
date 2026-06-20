import { SITE_URL } from "@/lib/site-url";

// LocalBusiness/Restaurant structured data — powers rich results and the Google
// local pack. KOK is a single-location business, so this is emitted once
// site-wide from the root layout. (Street address + geo can be added once the
// trading address is confirmed, for stronger local ranking.)
export default function RestaurantSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${SITE_URL}/#restaurant`,
    name: "KOK Kitchens",
    description:
      "Authentic Nigerian food for delivery across Hertfordshire, plus event catering and equipment hire.",
    url: SITE_URL,
    telephone: "+447447982712",
    email: "orders@kokkitchens.com",
    servesCuisine: "Nigerian",
    priceRange: "££",
    image: `${SITE_URL}/og-image.png`,
    hasMenu: `${SITE_URL}/menu`,
    address: {
      "@type": "PostalAddress",
      addressRegion: "Hertfordshire",
      addressCountry: "GB",
    },
    areaServed: { "@type": "AdministrativeArea", name: "Hertfordshire" },
    sameAs: ["https://www.instagram.com/kokkkitchen"],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "10:00",
        closes: "21:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "11:00",
        closes: "22:00",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
