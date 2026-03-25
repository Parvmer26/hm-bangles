import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export function useRealtimeOrders(onNewOrder?: () => void) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create notification sound
    audioRef.current = new Audio(
      'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAA' +
      'EAAQAAgD4AAAB9AAACABAAZGF0YQoGAACBhYqFbF1fdJivrJBhN' +
      'jVgodDbq2EzNFuh0uaxYi0uYp/WwqZdLi9jntayoFkuMGCg2b2t' +
      'aEI3Pa+xt4ZOISmOsNW7kFAnI4Gny8mpbzwxY5TR4LZ5QC0mdon' +
      'W6sKBTikYa4fO3LWNWS8cVnq+5tKaWC0OSmK05MOZA'
    );

    const channel = supabase
      .channel('orders-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        (payload) => {
          const order = payload.new as { order_number: string; customer_name: string; total_paise: number };
          toast.success(
            `New order received! ${order.order_number} — ₹${(order.total_paise / 100).toFixed(0)}`,
            {
              duration: 8000,
              description: `From ${order.customer_name}`,
            }
          );
          // Try to play sound
          audioRef.current?.play().catch(() => {});
          // Refresh orders list
          onNewOrder?.();
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [onNewOrder]);
}