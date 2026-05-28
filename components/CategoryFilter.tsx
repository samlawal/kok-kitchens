"use client";

import { CATEGORY_LABELS, type Category } from "@/lib/types";

interface CategoryFilterProps {
  selected: Category | "all";
  onChange: (category: Category | "all") => void;
}

export default function CategoryFilter({
  selected,
  onChange,
}: CategoryFilterProps) {
  const categories = Object.entries(CATEGORY_LABELS) as [Category, string][];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => onChange("all")}
        className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
          selected === "all"
            ? "bg-orange-600 text-white shadow-sm"
            : "bg-white text-stone-600 border border-stone-200 hover:border-orange-300 hover:text-orange-600"
        }`}
      >
        All
      </button>
      {categories.map(([key, label]) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
            selected === key
              ? "bg-orange-600 text-white shadow-sm"
              : "bg-white text-stone-600 border border-stone-200 hover:border-orange-300 hover:text-orange-600"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
