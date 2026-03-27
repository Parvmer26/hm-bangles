import { useState, useEffect, useCallback } from 'react';

const KEY = 'hm_wishlist';

// Global state so all components sync instantly without page refresh
let globalWishlist: string[] = JSON.parse(localStorage.getItem(KEY) || '[]');
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach(fn => fn());
}

export function useWishlist() {
  const [, rerender] = useState(0);

  useEffect(() => {
    const fn = () => rerender(n => n + 1);
    listeners.add(fn);
    return () => { listeners.delete(fn); };
  }, []);

  const toggle = useCallback((productId: string) => {
    globalWishlist = globalWishlist.includes(productId)
      ? globalWishlist.filter(id => id !== productId)
      : [...globalWishlist, productId];
    localStorage.setItem(KEY, JSON.stringify(globalWishlist));
    notify();
  }, []);

  const isWishlisted = useCallback(
    (productId: string) => globalWishlist.includes(productId),
    []
  );

  return { wishlist: globalWishlist, toggle, isWishlisted };
}