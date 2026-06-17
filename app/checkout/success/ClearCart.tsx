"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart-context";

// Clears the cart on the confirmation page. Needed for the card flow, which
// returns from Stripe (so the cart wasn't cleared before leaving the site).
export default function ClearCart() {
  const { clearCart } = useCart();
  useEffect(() => {
    clearCart();
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
