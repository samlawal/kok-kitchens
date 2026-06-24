"use client";

import { createContext, useContext, useState, useCallback } from "react";
import type { CartItem, MenuItem } from "./types";

// `lastAdd` carries a fresh id on every addItem call so an effect watching it
// re-fires even when the same item is added twice in a row. Used by the
// UpsellToast so re-adding jollof doesn't silently skip the upsell.
export interface LastAddEvent {
  item: MenuItem;
  id: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (menuItem: MenuItem, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  lastAdd: LastAddEvent | null;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [lastAdd, setLastAdd] = useState<LastAddEvent | null>(null);

  const addItem = useCallback((menuItem: MenuItem, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.menuItem.id === menuItem.id);
      if (existing) {
        return prev.map((i) =>
          i.menuItem.id === menuItem.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { menuItem, quantity }];
    });
    setLastAdd((prev) => ({ item: menuItem, id: (prev?.id ?? 0) + 1 }));
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setItems((prev) => prev.filter((i) => i.menuItem.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.menuItem.id !== itemId));
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.menuItem.id === itemId ? { ...i, quantity } : i
      )
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce(
    (sum, i) => sum + i.menuItem.price * i.quantity,
    0
  );

  return (
    <CartContext value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
      isCartOpen,
      setIsCartOpen,
      lastAdd,
    }}>
      {children}
    </CartContext>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
