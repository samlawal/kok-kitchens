"use client";

import Link from "next/link";
import { Plus, Flame } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/menu-data";
import type { MenuItem } from "@/lib/types";

export default function MealCard({ item }: { item: MenuItem }) {
  const { addItem } = useCart();

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-stone-200 shadow-sm hover:shadow-lg transition-shadow duration-300">
      <Link href={`/menu/${item.slug}`} className="block">
        <div className="aspect-[4/3] overflow-hidden bg-stone-100">
          <div className="h-full w-full bg-gradient-to-br from-orange-100 to-amber-50 flex items-center justify-center text-6xl">
            🍛
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/menu/${item.slug}`}>
            <h3 className="font-semibold text-stone-900 group-hover:text-orange-600 transition-colors">
              {item.name}
            </h3>
          </Link>
          {item.spicy && (
            <Flame className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
          )}
        </div>

        <p className="mt-1 text-sm text-stone-500 line-clamp-2 flex-1">
          {item.description}
        </p>

        {item.servings && (
          <p className="mt-1 text-xs font-medium text-orange-600">
            {item.servings}
          </p>
        )}

        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-stone-900">
            {formatPrice(item.price)}
          </span>
          <button
            onClick={() => addItem(item)}
            className="flex items-center gap-1.5 rounded-full bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 active:scale-95 transition-all"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
