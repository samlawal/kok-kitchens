"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
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

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in">
        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-orange-600" />
            <h2 className="text-lg font-bold text-stone-900">
              Your Order ({totalItems})
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-stone-400 hover:text-stone-600 transition-colors"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <div className="text-6xl mb-4">🍽️</div>
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
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.map((item) => (
                <div
                  key={item.menuItem.id}
                  className="flex gap-4 rounded-xl bg-stone-50 p-3"
                >
                  <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-orange-100 to-amber-50 flex items-center justify-center text-2xl shrink-0">
                    🍛
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-stone-900 text-sm truncate">
                      {item.menuItem.name}
                    </h4>
                    <p className="text-sm font-semibold text-orange-600 mt-0.5">
                      {formatPrice(item.menuItem.price)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.menuItem.id,
                            item.quantity - 1
                          )
                        }
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-stone-300 text-stone-500 hover:border-orange-400 hover:text-orange-600 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-sm font-semibold text-stone-900 w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.menuItem.id,
                            item.quantity + 1
                          )
                        }
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-stone-300 text-stone-500 hover:border-orange-400 hover:text-orange-600 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => removeItem(item.menuItem.id)}
                        className="ml-auto p-1 text-stone-400 hover:text-red-500 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-stone-200 px-6 py-4 space-y-4">
              <div className="flex justify-between text-base">
                <span className="font-medium text-stone-600">Subtotal</span>
                <span className="font-bold text-stone-900">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="block w-full rounded-full bg-orange-600 py-3.5 text-center text-sm font-semibold text-white hover:bg-orange-700 active:scale-[0.98] transition-all"
              >
                Proceed to Checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
