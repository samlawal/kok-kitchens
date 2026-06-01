"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { menuItems } from "@/lib/menu-data";
import MealCard from "./MealCard";
import { FadeIn, StaggerContainer, StaggerItem } from "./MotionWrapper";

export default function BudgetPicks() {
  // Items under £5 — perfect for students and quick bites
  const budgetItems = menuItems
    .filter((item) => item.price <= 5)
    .sort((a, b) => a.price - b.price)
    .slice(0, 6);

  if (budgetItems.length === 0) return null;

  return (
    <section className="bg-stone-50 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <FadeIn>
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                Under £5
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
              Quick Bites & Student Deals
            </h2>
            <p className="mt-2 text-stone-500 max-w-md">
              Big flavour, small price — perfect for a quick lunch or snack
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <Link
              href="/menu"
              className="hidden sm:flex items-center gap-1 text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors group"
            >
              Full Menu
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </FadeIn>
        </div>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgetItems.map((item) => (
            <StaggerItem key={item.id}>
              <MealCard item={item} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
