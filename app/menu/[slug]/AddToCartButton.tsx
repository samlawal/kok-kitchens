"use client";

import { useState } from "react";
import { Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import type { MenuItem } from "@/lib/types";

export default function AddToCartButton({ item }: { item: MenuItem }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-3 rounded-full border border-stone-200 bg-white px-2">
        <button
          onClick={() => setQty(Math.max(1, qty - 1))}
          className="flex h-10 w-10 items-center justify-center text-stone-500 hover:text-orange-600 transition-colors"
          aria-label="Decrease quantity"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-8 text-center font-semibold text-stone-900">
          {qty}
        </span>
        <button
          onClick={() => setQty(qty + 1)}
          className="flex h-10 w-10 items-center justify-center text-stone-500 hover:text-orange-600 transition-colors"
          aria-label="Increase quantity"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <button
        onClick={() => {
          addItem(item, qty);
          setQty(1);
        }}
        className="flex-1 flex items-center justify-center gap-2 rounded-full bg-orange-600 py-3.5 px-6 text-sm font-semibold text-white hover:bg-orange-700 active:scale-[0.97] transition-all"
      >
        <ShoppingBag className="h-4 w-4" />
        Add to Cart
      </button>
    </div>
  );
}
