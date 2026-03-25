import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, RefreshCw } from 'lucide-react';
import { getOrders, updateOrderStatus } from '@/lib/api';
import { toast } from 'sonner';

const statusColors: Record<string, string> = {
  pending:   'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  packed:    'bg-purple-100 text-purple-700',
  shipped:   'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const ALL_STATUSES = ['pending','confirmed','packed','shipped','delivered','cancelled'];

export default function AdminOrdersPage() {
  const [filter, setFilter]     = useState('All');
  const [orders, setOrders]     = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getOrders();
      setOrders(data || []);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  const filtered = filter === 'All'
    ? orders
    : orders.filter(o => o.status === filter);

  async function handleStatusChange(orderId: string, newStatus: string) {
    try {
      setUpdating(orderId);
      await updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      toast.success(`Order marked as ${newStatus}`);
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl font-medium">Orders</h1>
        <button onClick={loadOrders}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['All', ...ALL_STATUSES].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 text-xs border transition-colors capitalize ${
              filter === s
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border text-muted-foreground hover:border-primary'
            }`}
          >{s}</button>
        ))}
      </div>

      {loading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border border-border p-6 animate-pulse">
              <div className="h-4 bg-muted rounded w-1/3 mb-3" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-12 bg-muted rounded" />
                <div className="h-12 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && (
        <div className="space-y-4">
          {filtered.map((order, i) => (
            <motion.div key={order.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="border border-border bg-card p-4 md:p-6"
            >
              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <p className="font-mono text-sm font-medium">{order.order_number}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(order.created_at).toLocaleString('en-IN', {
                      timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short',
                      year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>

                {/* Status dropdown */}
                <select
                  value={order.status}
                  disabled={updating === order.id}
                  onChange={e => handleStatusChange(order.id, e.target.value)}
                  className={`text-xs px-3 py-1.5 rounded border-0 cursor-pointer font-medium capitalize focus:outline-none disabled:opacity-50 ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}
                >
                  {ALL_STATUSES.map(s => (
                    <option key={s} value={s} className="bg-white text-gray-800 capitalize">{s}</option>
                  ))}
                </select>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Customer</p>
                  <p className="font-medium">{order.customer_name}</p>
                  <p className="text-muted-foreground">+91 {order.customer_phone}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Address</p>
                  <p>{order.address_line1}{order.address_line2 ? `, ${order.address_line2}` : ''}</p>
                  <p>{order.city}, {order.state} — {order.pincode}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Items</p>
                  {(order.order_items || []).map((item: any, idx: number) => (
                    <p key={idx}>{item.product_name} · Size {item.size} · ₹{(item.price_paise/100).toFixed(0)}</p>
                  ))}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Total</p>
                  <p className="font-medium text-lg">₹{(order.total_paise/100).toFixed(0)}</p>
                  <p className="text-xs text-muted-foreground">incl. ₹99 shipping</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-border">
                <a href={`https://wa.me/91${order.customer_phone}?text=${encodeURIComponent(`Hi ${order.customer_name}! Your HM Bangles order ${order.order_number} status: ${order.status}. Thank you!`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="btn-whatsapp text-xs py-2 px-4 inline-flex items-center gap-1"
                >
                  <MessageCircle size={14} />{' '}WhatsApp Customer
                </a>
              </div>
            </motion.div>
          ))}

          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No orders found.</p>
          )}
        </div>
      )}
    </div>
  );
}