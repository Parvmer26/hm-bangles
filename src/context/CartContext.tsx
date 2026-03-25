import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { type BangleSize } from '@/data/products';

export interface CartItem {
  productId: string;
  name: string;
  size: BangleSize;
  pricePaise: number;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size: BangleSize) => void;
  clearCart: () => void;
  itemCount: number;
  subtotalPaise: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_KEY = 'hm-bangles-cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((item: CartItem) => {
    setItems(prev => {
      const exists = prev.find(i => i.productId === item.productId && i.size === item.size);
      if (exists) return prev;
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((productId: string, size: BangleSize) => {
    setItems(prev => prev.filter(i => !(i.productId === productId && i.size === size)));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const itemCount = items.length;
  const subtotalPaise = items.reduce((sum, i) => sum + i.pricePaise, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, itemCount, subtotalPaise }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
