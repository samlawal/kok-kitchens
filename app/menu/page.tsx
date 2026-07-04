"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { menuItems } from "@/lib/menu-data";
import type { Category } from "@/lib/types";
import CategoryFilter from "@/components/CategoryFilter";
import MealCard from "@/components/MealCard";
import { useMenuOverrides } from "@/lib/use-menu-overrides";
import { FadeIn } from "@/components/MotionWrapper";
import PageHero from "@/components/PageHero";

export default function MenuPage() {
  const [category, setCategory] = useState<Category | "all">("all");
  const [search, setSearch] = useState("");
  const overrides = useMenuOverrides();

  // Hide items the admin marked "hidden". Price/status/image overrides are
  // applied per-card by MealCard, so static items can be passed straight through.
  const visibleItems = useMemo(
    () =>
      menuItems.filter(
        (item) => (overrides.statuses[item.id] || "available") !== "hidden"
      ),
    [overrides]
  );

  const filtered = useMemo(
    () =>
      visibleItems.filter((item) => {
        const matchesCategory =
          category === "all" || item.category === category;
        if (!search) return matchesCategory;
        const q = search.toLowerCase();
        // Match against the current (possibly renamed) name too so a customer
        // searching for the new name finds the dish.
        const currentName = overrides.names[item.id] ?? item.name;
        const matchesSearch =
          item.name.toLowerCase().includes(q) ||
          currentName.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q);
        return matchesCategory && matchesSearch;
      }),
    [category, search, visibleItems, overrides.names]
  );

  return (
    <div className="bg-stone-50 min-h-screen">
      <PageHero
        eyebrow={`${menuItems.length}+ Dishes`}
        title="Our Menu"
        subtitle="Authentic Nigerian dishes made with love — pick your favourites and order in minutes"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/allergens"
          className="mb-6 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 hover:bg-amber-100 transition-colors"
        >
          <Info aria-hidden="true" className="h-4 w-4 shrink-0 text-amber-600" />
          <span>
            <strong>Allergies?</strong> Please tell us before you order — see our{" "}
            <span className="underline">allergen information</span>.
          </span>
        </Link>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8"
        >
          <div className="relative flex-1 max-w-sm" role="search">
            <Search aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500" />
            <input
              type="search"
              aria-label="Search dishes"
              placeholder="Search dishes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-stone-200 bg-white py-2.5 pl-10 pr-4 text-sm text-stone-900 placeholder:text-stone-500 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:outline-none transition-colors"
            />
          </div>
          <CategoryFilter selected={category} onChange={setCategory} />
        </motion.div>

        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="text-5xl mb-4">😔</div>
              <p className="text-stone-500 text-lg">
                No dishes found — try a different search or category
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={category + search}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.04, 0.4) }}
                >
                  <MealCard item={item} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {filtered.length > 0 && (
          <FadeIn delay={0.3} className="mt-6 text-center">
            <p className="text-sm text-stone-500">
              Showing {filtered.length} of {menuItems.length} dishes
            </p>
          </FadeIn>
        )}
      </div>
    </div>
  );
}
