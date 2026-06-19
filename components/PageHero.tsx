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
        className="object-cover object-center brightness-110 saturate-[1.08]"
      />
      {/* A light base keeps the whole photo readable; a soft dark vignette
          centred on the text guarantees the eyebrow/heading/subtitle stay
          legible while the photo stays bright at the edges. */}
      <div className="absolute inset-0 bg-stone-950/20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_64%_80%_at_50%_50%,rgba(12,10,9,0.6)_0%,rgba(12,10,9,0.4)_52%,rgba(12,10,9,0)_85%)]" />
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-20 sm:py-24 text-center">
        {eyebrow && (
          <p className="text-xs font-semibold text-orange-200 uppercase tracking-[0.25em] mb-3 drop-shadow-[0_1px_3px_rgba(0,0,0,1)] [text-shadow:0_0_8px_rgba(0,0,0,0.95)]">
            {eyebrow}
          </p>
        )}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight drop-shadow-[0_2px_14px_rgba(0,0,0,0.9)]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 text-stone-100 max-w-xl mx-auto text-sm sm:text-base leading-relaxed drop-shadow-[0_1px_8px_rgba(0,0,0,0.95)]">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
