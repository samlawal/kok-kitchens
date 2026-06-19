import { ChevronDown } from "lucide-react";

// Accessible FAQ list built on native <details>/<summary> — keyboard and
// screen-reader friendly out of the box, no client JS required. Also emits
// FAQPage structured data so the questions can surface as Google rich results.
export default function FaqAccordion({
  items,
  title = "Frequently asked questions",
  className = "",
}: {
  items: { q: string; a: string }[];
  title?: string;
  className?: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <section className={className}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h2 className="text-2xl font-bold text-stone-900 mb-6">{title}</h2>
      <div className="space-y-3">
        {items.map((item) => (
          <details
            key={item.q}
            className="group rounded-2xl bg-white border border-stone-200 px-5 sm:px-6 open:border-orange-200 open:bg-orange-50/40 transition-colors"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left font-semibold text-stone-900 marker:hidden [&::-webkit-details-marker]:hidden">
              {item.q}
              <ChevronDown className="h-5 w-5 shrink-0 text-orange-600 transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <p className="-mt-1 pb-5 text-sm leading-relaxed text-stone-600">
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
