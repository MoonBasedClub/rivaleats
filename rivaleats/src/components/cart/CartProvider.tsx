"use client";

import { createContext, useContext, useMemo, useState } from "react";

export type CartItemNotes = {
  allergies: string;
  dietaryPreferences: string;
  specialRequests: string;
};

export type CartItem = {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  notes: CartItemNotes;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity" | "notes">) => void;
  increment: (itemId: string) => void;
  decrement: (itemId: string) => void;
  updateNotes: (itemId: string, notes: CartItemNotes) => void;
  subtotal: number;
  totalItems: number;
};

const CartContext = createContext<CartContextValue | null>(null);

const emptyNotes = (): CartItemNotes => ({
  allergies: "",
  dietaryPreferences: "",
  specialRequests: "",
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: Omit<CartItem, "quantity" | "notes">) => {
    setItems((prev) => {
      const existing = prev.find((entry) => entry.itemId === item.itemId);
      if (existing) {
        return prev.map((entry) =>
          entry.itemId === item.itemId
            ? { ...entry, quantity: entry.quantity + 1 }
            : entry
        );
      }
      return [...prev, { ...item, quantity: 1, notes: emptyNotes() }];
    });
  };

  const increment = (itemId: string) => {
    setItems((prev) =>
      prev.map((entry) =>
        entry.itemId === itemId
          ? { ...entry, quantity: entry.quantity + 1 }
          : entry
      )
    );
  };

  const decrement = (itemId: string) => {
    setItems((prev) =>
      prev
        .map((entry) =>
          entry.itemId === itemId
            ? { ...entry, quantity: entry.quantity - 1 }
            : entry
        )
        .filter((entry) => entry.quantity > 0)
    );
  };

  const updateNotes = (itemId: string, notes: CartItemNotes) => {
    setItems((prev) =>
      prev.map((entry) =>
        entry.itemId === itemId ? { ...entry, notes } : entry
      )
    );
  };

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      addItem,
      increment,
      decrement,
      updateNotes,
      subtotal,
      totalItems,
    }),
    [items, subtotal, totalItems]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
