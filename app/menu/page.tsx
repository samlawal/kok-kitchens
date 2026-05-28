"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { menuItems } from "@/lib/menu-data";
import type { Category } from "@/lib/types";
import CategoryFilter from "@/components/CategoryFilter";
import MealCard from "@/components/MealCard";

export default function MenuPage() {
  const [category, setCategory] = useState<Category | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = menuItems.filter((item) => {
    const matchesCategory =
      category === "all" || item.category === category;
    const matchesSearch =
      !search ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-stone-50 min-h-screen">
      <div className="bg-gradient-to-b from-stone-900 to-stone-800 py-16 text-center">
        <h1 className="text-4xl font-bold text-white tracking-tight">
          Our Menu
        </h1>
        <p className="mt-3 text-stone-400 max-w-md mx-auto">
          Authentic Nigerian dishes made with love — pick your favourites
          and order in minutes
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search dishes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-stone-200 bg-white py-2.5 pl-10 pr-4 text-sm text-stone-900 placeholder:text-stone-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:outline-none transition-colors"
            />
          </div>
          <CategoryFilter selected={category} onChange={setCategory} />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">😔</div>
            <p className="text-stone-500 text-lg">
              No dishes found — try a different search or category
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((item) => (
              <MealCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
