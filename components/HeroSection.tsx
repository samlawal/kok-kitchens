import Link from "next/link";
import { ArrowRight, Utensils } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-stone-900 via-stone-800 to-orange-950">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_rgba(251,146,60,0.3),_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_rgba(234,88,12,0.2),_transparent_50%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-6">
            <Utensils className="h-5 w-5 text-orange-400" />
            <span className="text-sm font-medium text-orange-400 uppercase tracking-widest">
              Authentic Nigerian Cuisine
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
            Taste the Soul of{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
              Nigeria
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-stone-300 leading-relaxed max-w-xl">
            From smoky party jollof to rich egusi soup — order
            authentic Nigerian meals for delivery across Hertfordshire,
            or let us cater your next event with unforgettable flavours.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              href="/menu"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-600 px-8 py-4 text-base font-semibold text-white hover:bg-orange-500 active:scale-[0.97] transition-all shadow-lg shadow-orange-600/25"
            >
              Order Now
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/catering"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-stone-600 px-8 py-4 text-base font-semibold text-white hover:border-orange-500 hover:text-orange-400 transition-colors"
            >
              Catering Services
            </Link>
          </div>

          <div className="mt-12 flex items-center gap-8 text-sm text-stone-400">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔥</span>
              <span>Made Fresh Daily</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🚚</span>
              <span>Fast Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎉</span>
              <span>Event Catering</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
