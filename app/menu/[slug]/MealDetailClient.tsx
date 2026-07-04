"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Flame, ArrowLeft } from "lucide-react";
import { formatPrice } from "@/lib/menu-data";
import { useMenuOverrides } from "@/lib/use-menu-overrides";
import { resolveItem } from "@/lib/menu-overrides";
import type { MenuItem } from "@/lib/types";
import AddToCartButton from "./AddToCartButton";
import MealCard from "@/components/MealCard";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/MotionWrapper";

const categoryEmoji: Record<string, string> = {
  "rice-dishes": "🍚",
  "soups-swallows": "🥘",
  "grills-proteins": "🍖",
  sides: "🍌",
  snacks: "🥟",
  drinks: "🥤",
  "party-packs": "🎉",
};

export default function MealDetailClient({
  item,
  related,
}: {
  item: MenuItem;
  related: MenuItem[];
}) {
  const emoji = categoryEmoji[item.category] || "🍛";
  const overrides = useMenuOverrides();
  const resolved = resolveItem(item, overrides);
  const [imgError, setImgError] = useState(false);
  const imageSrc = resolved.image;
  const hasImage = imageSrc && !imgError;

  useEffect(() => setImgError(false), [imageSrc]);

  return (
    <div className="bg-stone-50 min-h-screen">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link
            href="/menu"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-orange-700 transition-colors mb-8 group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Menu
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-orange-100 to-amber-50 relative meal-img-wrap"
          >
            {hasImage ? (
              <Image
                src={imageSrc}
                alt={resolved.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <motion.span
                  className="text-[140px] select-none"
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {emoji}
                </motion.span>
              </div>
            )}
            {item.spicy && (
              <span className="absolute top-4 right-4 bg-red-500/90 text-white text-sm font-bold px-3 py-1.5 rounded-full flex items-center gap-1 z-10">
                <Flame className="h-4 w-4" /> Spicy
              </span>
            )}
          </motion.div>

          <div className="flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <h1 className="text-3xl sm:text-4xl font-bold text-stone-900">
                {resolved.name}
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="mt-4 text-stone-600 leading-relaxed text-lg"
            >
              {item.description}
            </motion.p>

            {item.servings && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-2 text-sm font-medium text-orange-700"
              >
                {item.servings}
              </motion.p>
            )}

            {item.tags.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="mt-4 flex flex-wrap gap-2"
              >
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700"
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8"
            >
              <p className="text-3xl font-bold text-stone-900">
                {formatPrice(resolved.price)}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6"
            >
              <AddToCartButton item={resolved} />
            </motion.div>
          </div>
        </div>

        {/* Related items */}
        {related.length > 0 && (
          <div className="mt-20">
            <FadeIn>
              <h2 className="text-2xl font-bold text-stone-900 mb-6">
                You Might Also Like
              </h2>
            </FadeIn>
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((r) => (
                <StaggerItem key={r.id}>
                  <MealCard item={r} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        )}
      </div>
    </div>
  );
}
