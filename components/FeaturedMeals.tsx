import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getFeaturedItems } from "@/lib/menu-data";
import MealCard from "./MealCard";

export default function FeaturedMeals() {
  const featured = getFeaturedItems();

  return (
    <section className="bg-stone-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-stone-900 tracking-tight">
              Most Popular
            </h2>
            <p className="mt-2 text-stone-500">
              Our customers' favourite dishes — tried, tested, and loved
            </p>
          </div>
          <Link
            href="/menu"
            className="hidden sm:flex items-center gap-1 text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors"
          >
            View Full Menu
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((item) => (
            <MealCard key={item.id} item={item} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/menu"
            className="inline-flex items-center gap-1 text-sm font-semibold text-orange-600"
          >
            View Full Menu
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
