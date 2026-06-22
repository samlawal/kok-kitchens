import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Truck, Clock, MapPin, MessageCircle, ArrowRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import FaqAccordion from "@/components/FaqAccordion";
import {
  DELIVERY_AREAS,
  DELIVERY_FEES,
  getDeliveryArea,
  getDeliveryFaqs,
  getNearbyAreas,
  type DeliveryArea,
} from "@/lib/delivery-areas";
import { SITE_URL } from "@/lib/site-url";

export function generateStaticParams() {
  return DELIVERY_AREAS.map((a) => ({ town: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ town: string }>;
}): Promise<Metadata> {
  const { town } = await params;
  const area = getDeliveryArea(town);
  if (!area) return { title: "Delivery area" };

  const postcodes = area.postcodes.join(", ");
  const title = `Nigerian Food Delivery in ${area.name} (${postcodes})`;
  const description = `Authentic Nigerian food delivered across ${area.name} — ${postcodes}. Jollof, egusi, suya, peppered chicken and more, fresh from our Borehamwood kitchen. Order online or by WhatsApp.`;
  const url = `${SITE_URL}/delivery/${area.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website" },
  };
}

// Per-page Service JSON-LD — references the site-wide Restaurant by @id so
// Google links the area-specific service to the main business, instead of
// duplicating LocalBusiness markers across 10 URLs.
function ServiceSchema({ area }: { area: DeliveryArea }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}/delivery/${area.slug}#service`,
    name: `Nigerian Food Delivery in ${area.name}`,
    serviceType: "Food delivery",
    provider: { "@id": `${SITE_URL}/#restaurant` },
    url: `${SITE_URL}/delivery/${area.slug}`,
    areaServed: {
      "@type": "Place",
      name: area.name,
      address: {
        "@type": "PostalAddress",
        addressRegion: area.county,
        addressCountry: "GB",
        postalCode: area.postcodes.join(", "),
      },
    },
    offers: {
      "@type": "Offer",
      price: DELIVERY_FEES[area.zone].toFixed(2),
      priceCurrency: "GBP",
      description: `${area.zone === "local" ? "Local" : "Extended"} zone delivery fee`,
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default async function DeliveryAreaPage({
  params,
}: {
  params: Promise<{ town: string }>;
}) {
  const { town } = await params;
  const area = getDeliveryArea(town);
  if (!area) notFound();

  const fee = DELIVERY_FEES[area.zone];
  const typicalTime = area.zone === "local" ? "30–45 min" : "45–60 min";
  const postcodes = area.postcodes.join(", ");
  const nearby = getNearbyAreas(area.nearby);
  const faqs = getDeliveryFaqs(area);

  return (
    <div className="min-h-screen bg-stone-50">
      <ServiceSchema area={area} />

      <PageHero
        image="/banners/about-spices.webp"
        eyebrow={`${area.county} · ${postcodes}`}
        title={`Nigerian Food Delivery in ${area.name}`}
        subtitle={`Authentic Nigerian food delivered across ${postcodes}. Jollof, egusi, suya & more — fresh from our Borehamwood kitchen.`}
      />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="rounded-2xl border border-stone-200 bg-white p-5">
            <Truck aria-hidden="true" className="h-5 w-5 text-orange-700 mb-2" />
            <p className="text-xs uppercase tracking-wider text-stone-500">Delivery fee</p>
            <p className="text-2xl font-bold text-stone-900 mt-1">£{fee.toFixed(2)}</p>
            <p className="text-xs text-stone-500 mt-1 capitalize">{area.zone} zone</p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-5">
            <Clock aria-hidden="true" className="h-5 w-5 text-orange-700 mb-2" />
            <p className="text-xs uppercase tracking-wider text-stone-500">Typical delivery</p>
            <p className="text-2xl font-bold text-stone-900 mt-1">{typicalTime}</p>
            <p className="text-xs text-stone-500 mt-1">From order start</p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-5">
            <MapPin aria-hidden="true" className="h-5 w-5 text-orange-700 mb-2" />
            <p className="text-xs uppercase tracking-wider text-stone-500">Postcodes</p>
            <p className="text-2xl font-bold text-stone-900 mt-1">{postcodes}</p>
            <p className="text-xs text-stone-500 mt-1">{area.county}</p>
          </div>
        </div>

        <p className="text-stone-700 leading-relaxed text-lg mb-8">
          {area.localContext}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mb-12">
          <Link
            href="/menu"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-600 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-700 transition-colors"
          >
            View menu &amp; order
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
          <Link
            href="/catering"
            className="inline-flex items-center justify-center rounded-full border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-700 hover:border-orange-400 hover:text-orange-700 hover:bg-orange-50 active:bg-orange-100 transition-colors"
          >
            Catering in {area.name}
          </Link>
          <a
            href="https://wa.me/447447982712"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-green-700/40 px-6 py-3 text-sm font-semibold text-green-700 hover:bg-green-600 hover:text-white hover:border-green-600 transition-colors"
          >
            <MessageCircle aria-hidden="true" className="h-4 w-4" />
            WhatsApp us
          </a>
        </div>

        <FaqAccordion
          items={faqs}
          title={`Delivery to ${area.name} — FAQs`}
          className="mb-12"
        />

        {nearby.length > 0 && (
          <section className="mt-4">
            <h2 className="text-xl font-bold text-stone-900 mb-4">
              We also deliver to nearby areas
            </h2>
            <div className="flex flex-wrap gap-3">
              {nearby.map((n) => (
                <Link
                  key={n.slug}
                  href={`/delivery/${n.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:border-orange-400 hover:text-orange-700 hover:bg-orange-50 transition-colors"
                >
                  {n.name}
                  <span className="text-xs text-stone-500">{n.postcodes[0]}</span>
                </Link>
              ))}
            </div>
            <p className="text-xs text-stone-500 mt-4">
              <Link href="/delivery" className="underline hover:text-orange-700">
                See all delivery areas →
              </Link>
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
