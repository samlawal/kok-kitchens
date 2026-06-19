"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollRight, setCanScrollRight] = useState(false);

  function checkScroll() {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
      >
        <button
          onClick={() => onChange("all")}
          className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
            selected === "all"
              ? "bg-orange-600 text-white shadow-sm"
              : "bg-white text-stone-600 border border-stone-200 hover:border-orange-300 hover:text-orange-700"
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
                : "bg-white text-stone-600 border border-stone-200 hover:border-orange-300 hover:text-orange-700"
            }`}
          >
            {label}
          </button>
        ))}
        {/* Spacer so last pill isn't cut off by fade */}
        <div className="shrink-0 w-8" />
      </div>

      {/* Scroll hint — fade + animated chevron */}
      {canScrollRight && (
        <div className="absolute right-0 top-0 bottom-2 flex items-center pointer-events-none">
          <div className="w-16 h-full bg-gradient-to-l from-stone-50 via-stone-50/80 to-transparent" />
          <div className="absolute right-0 flex items-center justify-center w-8 h-8 rounded-full bg-stone-50 animate-[pulse_1.5s_ease-in-out_3]">
            <ChevronRight className="h-4 w-4 text-orange-500" />
          </div>
        </div>
      )}
    </div>
  );
}
