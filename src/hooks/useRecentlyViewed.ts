import { useState, useEffect } from 'react';

const KEY = 'hm_recently_viewed';
const MAX = 4;

export function useRecentlyViewed(currentSlug?: string) {
  const [viewed, setViewed] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(KEY);
    const list: string[] = stored ? JSON.parse(stored) : [];
    setViewed(list.filter(s => s !== currentSlug));
  }, [currentSlug]);

  function addViewed(slug: string) {
    const stored = localStorage.getItem(KEY);
    const list: string[] = stored ? JSON.parse(stored) : [];
    const updated = [slug, ...list.filter(s => s !== slug)].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(updated));
  }

  return { viewed, addViewed };
}