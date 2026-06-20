import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Allergen Information",
  description:
    "Allergen information for KOK Kitchens. If you have a food allergy or intolerance, please tell us before you order and we'll confirm what we can safely provide.",
};

const ALLERGENS = [
  "Celery",
  "Cereals containing gluten (wheat, barley, rye, oats)",
  "Crustaceans (e.g. crab, prawns, crayfish)",
  "Eggs",
  "Fish",
  "Lupin",
  "Milk",
  "Molluscs (e.g. mussels, squid)",
  "Mustard",
  "Tree nuts",
  "Peanuts",
  "Sesame seeds",
  "Soya",
  "Sulphur dioxide / sulphites",
];

export default function AllergensPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-stone-900">
          Allergen Information
        </h1>

        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
          <p className="text-sm text-amber-900 leading-relaxed">
            If you have a food allergy or intolerance,{" "}
            <strong>please tell us before you order</strong>{" "}so we can
            confirm what we&apos;re able to prepare safely for you.
          </p>
        </div>

        <div className="mt-8 space-y-8 text-stone-700 leading-relaxed">
          <section>
            <p>
              Our dishes are freshly prepared in a kitchen that handles peanuts,
              tree nuts, crustaceans (crayfish), fish, gluten, eggs, milk, soya,
              sesame and other allergens. Because of this, we cannot guarantee
              that any dish is completely free from traces of an allergen.
            </p>
            <p className="mt-3">
              Many of our recipes use ingredients common in Nigerian cooking —
              such as ground crayfish, dried fish and groundnut (peanut) — so if
              you have an allergy, it&apos;s important to check with us about a
              specific dish before ordering.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 mb-3">
              The 14 allergens
            </h2>
            <p className="mb-3">
              UK law requires us to tell you if our food contains any of these
              14 allergens. Ask us about any dish and we&apos;ll let you know
              which apply:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 list-disc pl-5">
              {ALLERGENS.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 mb-3">
              Tell us about your allergy
            </h2>
            <p>
              Before you order — online, by phone or for catering — please get
              in touch and tell us about any allergies or dietary requirements.
              We&apos;ll confirm exactly what we can safely provide.
            </p>
            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <a
                href="https://wa.me/447447982712?text=Hi%20KOK%20Kitchens!%20I%20have%20a%20food%20allergy%20—%20can%20you%20help%3F"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp us
              </a>
              <a
                href="tel:+447447982712"
                className="inline-flex items-center justify-center rounded-full border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-700 hover:border-orange-400 hover:text-orange-700 hover:bg-orange-50 active:bg-orange-100 transition-colors"
              >
                Call +44 7447 982712
              </a>
              <a
                href="mailto:orders@kokkitchens.com?subject=Allergy%20enquiry"
                className="inline-flex items-center justify-center rounded-full border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-700 hover:border-orange-400 hover:text-orange-700 hover:bg-orange-50 active:bg-orange-100 transition-colors"
              >
                Email us
              </a>
            </div>
          </section>

          <p className="text-sm text-stone-500">
            See also our{" "}
            <Link href="/terms" className="text-orange-700 font-medium">
              Terms &amp; Conditions
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
