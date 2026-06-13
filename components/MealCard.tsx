"use client";

import Link from "next/link";
import Image from "next/image";
import { Plus, Flame } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/menu-data";
import type { MenuItem } from "@/lib/types";

const categoryEmoji: Record<string, string> = {
  "rice-dishes": "🍚",
  "soups-swallows": "🥘",
  "grills-proteins": "🍖",
  sides: "🍌",
  snacks: "🥟",
  drinks: "🥤",
  "party-packs": "🎉",
};

export default function MealCard({ item }: { item: MenuItem }) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const isUnavailable = item.availability === "unavailable";

  function handleAdd() {
    if (isUnavailable) return;
    addItem(item);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  }

  const emoji = categoryEmoji[item.category] || "🍛";
  const hasImage = item.image && !imgError;

  return (
    <motion.div
      className={`group relative flex flex-col overflow-hidden rounded-2xl bg-white border shadow-sm transition-shadow duration-300 ${
        isUnavailable
          ? "border-stone-300 opacity-75"
          : "border-stone-200 hover:shadow-xl"
      }`}
      whileHover={isUnavailable ? {} : { y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <Link href={`/menu/${item.slug}`} className="block">
        <div className={`aspect-[4/3] overflow-hidden bg-gradient-to-br from-orange-50 to-amber-50 relative meal-img-wrap ${isUnavailable ? "grayscale" : ""}`}>
          {hasImage ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <motion.span
                className="text-6xl select-none"
                whileHover={{ scale: 1.2, rotate: 5 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                {emoji}
              </motion.span>
            </div>
          )}
          {item.spicy && (
            <span className="absolute top-3 right-3 bg-red-500/90 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 z-10">
              <Flame className="h-3 w-3" /> Spicy
            </span>
          )}
          {item.servings && (
            <span className="absolute bottom-3 left-3 bg-orange-600/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full z-10">
              {item.servings}
            </span>
          )}
          {isUnavailable && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20">
              <span className="bg-stone-900/90 backdrop-blur-sm text-white text-xs font-bold px-4 py-2 rounded-full">
                Temporarily Unavailable
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link href={`/menu/${item.slug}`}>
          <h3 className="font-semibold text-stone-900 group-hover:text-orange-600 transition-colors">
            {item.name}
          </h3>
        </Link>

        <p className="mt-1 text-sm text-stone-500 line-clamp-2 flex-1">
          {item.description}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-stone-900">
            {formatPrice(item.price)}
          </span>

          {isUnavailable ? (
            <span className="rounded-full bg-stone-200 px-4 py-2 text-sm font-medium text-stone-400 cursor-not-allowed">
              Unavailable
            </span>
          ) : (
            <AnimatePresence mode="wait">
              {justAdded ? (
                <motion.span
                  key="added"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex items-center gap-1 rounded-full bg-green-600 px-4 py-2 text-sm font-medium text-white"
                >
                  Added!
                </motion.span>
              ) : (
                <motion.button
                  key="add"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  onClick={handleAdd}
                  whileTap={{ scale: 0.9 }}
                  className="flex items-center gap-1.5 rounded-full bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </motion.button>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </motion.div>
  );
}
