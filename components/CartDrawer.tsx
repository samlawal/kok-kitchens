"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/menu-data";

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeItem,
    updateQuantity,
    totalPrice,
    totalItems,
  } = useCart();

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-[60]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-orange-600" />
                <h2 className="text-lg font-bold text-stone-900">
                  Your Order ({totalItems})
                </h2>
              </div>
              <motion.button
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-600 transition-colors"
                aria-label="Close cart"
                whileTap={{ scale: 0.85 }}
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.1 }}
                  className="text-6xl mb-4"
                >
                  🍽️
                </motion.div>
                <p className="text-stone-500 text-lg font-medium">
                  Your cart is empty
                </p>
                <p className="text-stone-400 text-sm mt-1">
                  Add some delicious Nigerian dishes to get started
                </p>
                <Link
                  href="/menu"
                  onClick={() => setIsCartOpen(false)}
                  className="mt-6 rounded-full bg-orange-600 px-6 py-3 text-sm font-medium text-white hover:bg-orange-700 transition-colors"
                >
                  Browse Menu
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.div
                        key={item.menuItem.id}
                        layout
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.25 }}
                        className="flex gap-4 rounded-xl bg-stone-50 p-3"
                      >
                        <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-orange-100 to-amber-50 overflow-hidden relative shrink-0">
                          {item.menuItem.image ? (
                            <Image
                              src={item.menuItem.image}
                              alt={item.menuItem.name}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-2xl">
                              🍛
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-stone-900 text-sm truncate">
                            {item.menuItem.name}
                          </h4>
                          <p className="text-sm font-semibold text-orange-600 mt-0.5">
                            {formatPrice(item.menuItem.price * item.quantity)}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              onClick={() =>
                                updateQuantity(item.menuItem.id, item.quantity - 1)
                              }
                              className="flex h-7 w-7 items-center justify-center rounded-full border border-stone-300 text-stone-500 hover:border-orange-400 hover:text-orange-600 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </motion.button>
                            <motion.span
                              key={item.quantity}
                              initial={{ scale: 1.3 }}
                              animate={{ scale: 1 }}
                              className="text-sm font-semibold text-stone-900 w-6 text-center"
                            >
                              {item.quantity}
                            </motion.span>
                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              onClick={() =>
                                updateQuantity(item.menuItem.id, item.quantity + 1)
                              }
                              className="flex h-7 w-7 items-center justify-center rounded-full border border-stone-300 text-stone-500 hover:border-orange-400 hover:text-orange-600 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </motion.button>
                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              onClick={() => removeItem(item.menuItem.id)}
                              className="ml-auto p-1 text-stone-400 hover:text-red-500 transition-colors"
                              aria-label="Remove item"
                            >
                              <Trash2 className="h-4 w-4" />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <motion.div
                  layout
                  className="border-t border-stone-200 px-6 py-4 space-y-4"
                >
                  <div className="flex justify-between text-base">
                    <span className="font-medium text-stone-600">Subtotal</span>
                    <motion.span
                      key={totalPrice}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      className="font-bold text-stone-900"
                    >
                      {formatPrice(totalPrice)}
                    </motion.span>
                  </div>
                  <Link
                    href="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="block w-full rounded-full bg-orange-600 py-3.5 text-center text-sm font-semibold text-white hover:bg-orange-700 active:scale-[0.98] transition-all"
                  >
                    Proceed to Checkout
                  </Link>
                </motion.div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
