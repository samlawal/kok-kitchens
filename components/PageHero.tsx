import Image from "next/image";

// Consistent banner for the secondary pages (menu, catering, hire, about).
// A warm KOK photo behind a brown-orange overlay — one look across every page.
export default function PageHero({
  eyebrow,
  title,
  subtitle,
  image = "/meals/hero-c9.webp",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-stone-950">
      <Image
        src={image}
        alt=""
        fill
        priority
        unoptimized
        className="object-cover object-center"
      />
      {/* Brown-orange warm overlay — lets the photo show through while keeping
          the white text legible (paired with the drop-shadows below). */}
      <div className="absolute inset-0 bg-gradient-to-br from-stone-950/80 via-stone-900/55 to-orange-950/65" />
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-20 sm:py-24 text-center">
        {eyebrow && (
          <p className="text-xs font-semibold text-orange-400 uppercase tracking-[0.25em] mb-3">
            {eyebrow}
          </p>
        )}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.65)]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 text-stone-200 max-w-xl mx-auto text-sm sm:text-base leading-relaxed drop-shadow-[0_1px_6px_rgba(0,0,0,0.75)]">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
