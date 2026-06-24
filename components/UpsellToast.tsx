"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Plus, X } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { menuItems, formatPrice } from "@/lib/menu-data";
import { useMenuOverrides } from "@/lib/use-menu-overrides";
import { resolveItem } from "@/lib/menu-overrides";
import { getFirstAddUpsell } from "@/lib/upsell";
import type { MenuItem } from "@/lib/types";

const SHOWN_KEY = "kok_upsell_shown_v1";
const AUTO_DISMISS_MS = 8000;

function readShown(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    return new Set(JSON.parse(sessionStorage.getItem(SHOWN_KEY) ?? "[]"));
  } catch {
    return new Set();
  }
}
function markShown(slug: string) {
  if (typeof window === "undefined") return;
  const s = readShown();
  s.add(slug);
  try {
    sessionStorage.setItem(SHOWN_KEY, JSON.stringify([...s]));
  } catch {
    /* private mode — fine to drop */
  }
}

// Slide-in suggestion that appears after the customer adds a "main" item with
// a canonical pair (rice/grill → plantain). Auto-dismisses after 8s, hides
// itself once the pair is in the cart, and dedupes per session via
// sessionStorage so we don't pester someone who's already seen it.
//
// Effect split intentional (per the food-vertical playbook §12 H4): the
// auto-dismiss timer lives in its own useEffect, separate from the trigger
// and the visibility-cleanup logic, so cleanup doesn't fire on every state
// change.
export default function UpsellToast() {
  const { items, addItem, lastAdd } = useCart();
  const overrides = useMenuOverrides();
  const [visible, setVisible] = useState(false);
  const [suggestion, setSuggestion] = useState<MenuItem | null>(null);

  // Trigger: react to every add event.
  useEffect(() => {
    if (!lastAdd) return;
    const available = menuItems
      .map((i) => resolveItem(i, overrides))
      .filter((i) => i.availability !== "unavailable" && i.availability !== "hidden");
    const pair = getFirstAddUpsell(lastAdd.item, items, available);
    if (!pair) return;
    if (readShown().has(pair.slug)) return;
    setSuggestion(pair);
    setVisible(true);
    markShown(pair.slug);
    // Only depend on the add id — items/overrides changing later shouldn't
    // re-trigger the toast.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastAdd?.id]);

  // Auto-dismiss timer — its own effect so cleanup doesn't fire on every
  // unrelated state change.
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setVisible(false), AUTO_DISMISS_MS);
    return () => clearTimeout(t);
  }, [visible]);

  // Hide as soon as the pair is in the cart (the suggestion is no longer relevant).
  useEffect(() => {
    if (!suggestion) return;
    if (items.some((i) => i.menuItem.slug === suggestion.slug)) setVisible(false);
  }, [items, suggestion]);

  function handleAdd() {
    if (!suggestion) return;
    addItem(suggestion);
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && suggestion && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
          className="fixed bottom-24 left-4 right-4 z-[80] sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-sm"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-3 shadow-lg shadow-stone-900/10">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-orange-50 to-amber-50">
              {suggestion.image && (
                <Image
                  src={suggestion.image}
                  alt=""
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-orange-700">
                Most order it with
              </p>
              <p className="truncate text-sm font-semibold text-stone-900">
                {suggestion.name}
              </p>
              <p className="text-xs text-stone-500">{formatPrice(suggestion.price)}</p>
            </div>
            <button
              type="button"
              onClick={handleAdd}
              className="inline-flex items-center gap-1 rounded-full bg-orange-600 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-700 active:scale-[0.97] transition-colors"
              aria-label={`Add ${suggestion.name} to your order`}
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add
            </button>
            <button
              type="button"
              onClick={() => setVisible(false)}
              className="rounded-full p-1.5 text-stone-400 hover:text-stone-600"
              aria-label="Dismiss suggestion"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
