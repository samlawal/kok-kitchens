import HeroSection from "@/components/HeroSection";
import FeaturedMeals from "@/components/FeaturedMeals";
import WhyUsSection from "@/components/WhyUsSection";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedMeals />
      <WhyUsSection />

      <section className="bg-gradient-to-br from-orange-600 to-orange-700 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Planning an Event?
          </h2>
          <p className="mt-4 text-lg text-orange-100 leading-relaxed">
            From weddings and birthdays to corporate gatherings — our catering
            team will create a menu your guests won't stop talking about.
          </p>
          <Link
            href="/catering"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-orange-700 hover:bg-orange-50 active:scale-[0.97] transition-all shadow-lg"
          >
            Get a Catering Quote
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
