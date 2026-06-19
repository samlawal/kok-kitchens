"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getFeaturedItems } from "@/lib/menu-data";
import MealCard from "./MealCard";
import { FadeIn, StaggerContainer, StaggerItem } from "./MotionWrapper";

export default function FeaturedMeals() {
  const featured = getFeaturedItems();

  return (
    <section className="bg-stone-50 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
              Most Popular
            </h2>
            <p className="mt-2 text-stone-500 max-w-md">
              Our customers&apos; favourite dishes — tried, tested, and loved
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <Link
              href="/menu"
              className="hidden sm:flex items-center gap-1 text-sm font-semibold text-orange-700 hover:text-orange-700 transition-colors group"
            >
              View Full Menu
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </FadeIn>
        </div>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((item) => (
            <StaggerItem key={item.id}>
              <MealCard item={item} />
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeIn delay={0.2} className="mt-8 text-center sm:hidden">
          <Link
            href="/menu"
            className="inline-flex items-center gap-1 text-sm font-semibold text-orange-700"
          >
            View Full Menu
            <ArrowRight className="h-4 w-4" />
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
