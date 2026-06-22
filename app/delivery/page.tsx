import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import {
  DELIVERY_AREAS,
  DELIVERY_FEES,
} from "@/lib/delivery-areas";

export const metadata: Metadata = {
  title: "Delivery Areas — Where We Cover",
  description:
    "KOK Kitchens delivers authentic Nigerian food across North London & Hertfordshire — Borehamwood, Radlett, Bushey, Watford, St Albans, Edgware, Hendon, Mill Hill, Finchley and Barnet. See your area for fees, postcodes and delivery times.",
};

export default function DeliveryHubPage() {
  const local = DELIVERY_AREAS.filter((a) => a.zone === "local");
  const extended = DELIVERY_AREAS.filter((a) => a.zone === "extended");

  return (
    <div className="min-h-screen bg-stone-50">
      <PageHero
        image="/banners/about-spices.webp"
        eyebrow="Where we cover"
        title="Delivery Areas"
        subtitle="Nigerian food delivered fresh across North London &amp; Hertfordshire — see your area for postcodes, fees and timings."
      />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <Zone
          heading="Local zone"
          fee={DELIVERY_FEES.local}
          areas={local}
          note="A short hop from our Borehamwood kitchen — quickest delivery times."
        />
        <Zone
          heading="Extended zone"
          fee={DELIVERY_FEES.extended}
          areas={extended}
          note="Further out across North London &amp; Hertfordshire — a few extra minutes on the road."
        />

        <div className="rounded-2xl bg-orange-50 border border-orange-100 p-5 text-sm text-stone-700">
          <p>
            <strong>Not sure about your postcode?</strong> Pop it into the
            checkout postcode checker — we&apos;ll tell you instantly which
            zone you&apos;re in (or message us on WhatsApp and we&apos;ll
            confirm).
          </p>
        </div>
      </div>
    </div>
  );
}

function Zone({
  heading,
  fee,
  areas,
  note,
}: {
  heading: string;
  fee: number;
  areas: typeof DELIVERY_AREAS;
  note: string;
}) {
  return (
    <section>
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="text-2xl font-bold text-stone-900">{heading}</h2>
        <p className="text-sm font-semibold text-orange-700">£{fee.toFixed(2)} delivery</p>
      </div>
      <p
        className="text-sm text-stone-500 mb-5"
        dangerouslySetInnerHTML={{ __html: note }}
      />
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {areas.map((a) => (
          <li key={a.slug}>
            <Link
              href={`/delivery/${a.slug}`}
              className="group flex items-center justify-between rounded-2xl border border-stone-200 bg-white p-4 hover:border-orange-400 hover:bg-orange-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <MapPin aria-hidden="true" className="h-5 w-5 text-orange-700 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-stone-900">
                    {a.name}
                  </p>
                  <p className="text-xs text-stone-500">
                    {a.postcodes.join(", ")} · {a.county}
                  </p>
                </div>
              </div>
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 text-stone-400 group-hover:text-orange-700 group-hover:translate-x-0.5 transition-all"
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
