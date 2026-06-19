"use client";

import { useState } from "react";
import { Plus, Minus, ShoppingBag, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/cart-context";
import type { MenuItem } from "@/lib/types";

export default function AddToCartButton({ item }: { item: MenuItem }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(item, qty);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setQty(1);
    }, 1500);
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-3 rounded-full border border-stone-200 bg-white px-2">
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={() => setQty(Math.max(1, qty - 1))}
          className="flex h-10 w-10 items-center justify-center text-stone-500 hover:text-orange-700 transition-colors"
          aria-label="Decrease quantity"
        >
          <Minus className="h-4 w-4" />
        </motion.button>
        <motion.span
          key={qty}
          initial={{ scale: 1.3, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-8 text-center font-semibold text-stone-900"
        >
          {qty}
        </motion.span>
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={() => setQty(qty + 1)}
          className="flex h-10 w-10 items-center justify-center text-stone-500 hover:text-orange-700 transition-colors"
          aria-label="Increase quantity"
        >
          <Plus className="h-4 w-4" />
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        {added ? (
          <motion.div
            key="success"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="flex-1 flex items-center justify-center gap-2 rounded-full bg-green-600 py-3.5 px-6 text-sm font-semibold text-white"
          >
            <Check className="h-4 w-4" />
            Added to Cart!
          </motion.div>
        ) : (
          <motion.button
            key="add"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAdd}
            className="flex-1 flex items-center justify-center gap-2 rounded-full bg-orange-600 py-3.5 px-6 text-sm font-semibold text-white hover:bg-orange-700 transition-colors"
          >
            <ShoppingBag className="h-4 w-4" />
            Add to Cart
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
