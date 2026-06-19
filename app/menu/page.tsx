"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { menuItems } from "@/lib/menu-data";
import type { Category } from "@/lib/types";
import CategoryFilter from "@/components/CategoryFilter";
import MealCard from "@/components/MealCard";
import { useMenuOverrides } from "@/lib/use-menu-overrides";
import { FadeIn } from "@/components/MotionWrapper";

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
        const matchesSearch =
          !search ||
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.description.toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesSearch;
      }),
    [category, search, visibleItems]
  );

  return (
    <div className="bg-stone-50 min-h-screen">
      <div className="relative overflow-hidden bg-gradient-to-b from-stone-950 via-stone-900 to-stone-800 py-20 text-center">
        {/* Animated mesh gradient */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 left-1/4 w-80 h-80 rounded-full bg-orange-600/[0.06] blur-[100px]"
          />
          <motion.div
            animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-amber-500/[0.05] blur-[80px]"
          />
        </div>
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs font-semibold text-orange-400 uppercase tracking-[0.25em] mb-4"
          >
            {menuItems.length}+ Dishes
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-bold text-white tracking-tight"
          >
            Our Menu
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-3 text-stone-300 max-w-md mx-auto"
          >
            Authentic Nigerian dishes made with love — pick
            your favourites and order in minutes
          </motion.p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
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
