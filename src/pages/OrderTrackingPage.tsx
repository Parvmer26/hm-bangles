import { useState } from 'react';
import { Search, Package, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { buildWhatsAppSupportLink } from '@/lib/constants';

const statusSteps = ['confirmed', 'packed', 'shipped', 'delivered'];

const statusConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  pending:   { icon: Clock,        color: 'text-amber-500',  label: 'Payment Pending' },
  confirmed: { icon: CheckCircle,  color: 'text-blue-500',   label: 'Order Confirmed' },
  packed:    { icon: Package,      color: 'text-purple-500', label: 'Packed' },
  shipped:   { icon: Truck,        color: 'text-indigo-500', label: 'Shipped' },
  delivered: { icon: CheckCircle,  color: 'text-green-500',  label: 'Delivered' },
  cancelled: { icon: XCircle,      color: 'text-red-500',    label: 'Cancelled' },
};

interface Order {
  id: string;
  order_number: string;
  status: string;
  customer_name: string;
  total_paise: number;
  created_at: string;
  city: string;
  state: string;
  order_items: { product_name: string; size: string }[];
}

export default function OrderTrackingPage() {
  const [query, setQuery]     = useState('');
  const [order, setOrder]     = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setOrder(null);

    const { data, error: dbError } = await supabase
      .from('orders')
      .select('*, order_items(product_name, size)')
      .eq('order_number', query.trim().toUpperCase())
      .single();

    if (dbError || !data) {
      setError('Order not found. Please check your order number and try again.');
    } else {
      setOrder(data as Order);
    }
    setLoading(false);
  }

  const currentStepIndex = order ? statusSteps.indexOf(order.status) : -1;

  return (
    <div className="container-custom py-16 md:py-24 max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <p className="section-subheading mb-2">Track Your Order</p>
        <h1 className="section-heading text-3xl md:text-4xl mb-4">Where's My Order?</h1>
        <p className="text-sm text-muted-foreground">
          Enter your order number (e.g. HMB-20240315-4821) to see your order status.
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-3 mb-10">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="HMB-20240315-4821"
          className="flex-1 px-4 py-3 border border-border bg-background text-sm focus:outline-none focus:border-primary uppercase tracking-wider"
        />
        <button type="submit" disabled={loading}
          className="btn-gold px-6 flex items-center gap-2 disabled:opacity-50">
          <Search size={16} />
          {loading ? 'Searching...' : 'Track'}
        </button>
      </form>

      {error && (
        <div className="text-center py-8 border border-border">
          <XCircle size={32} className="text-red-400 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <a href={buildWhatsAppSupportLink(query)}
            target="_blank" rel="noopener noreferrer"
            className="text-xs underline text-muted-foreground hover:text-primary">
            Contact us on WhatsApp for help
          </a>
        </div>
      )}

      {order && (
        <div className="border border-border p-6 space-y-6">
          {/* Order info */}
          <div className="flex justify-between items-start">
            <div>
              <p className="font-mono text-sm font-medium">{order.order_number}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(order.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'long', year: 'numeric'
                })}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium">₹{(order.total_paise / 100).toFixed(0)}</p>
              <p className="text-xs text-muted-foreground">{order.city}, {order.state}</p>
            </div>
          </div>

          {/* Items */}
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Items</p>
            {order.order_items.map((item, i) => (
              <p key={i} className="text-sm">{item.product_name} · Size {item.size}</p>
            ))}
          </div>

          {/* Status tracker */}
          {order.status === 'cancelled' ? (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 text-red-700">
              <XCircle size={20} />
              <div>
                <p className="font-medium text-sm">Order Cancelled</p>
                <p className="text-xs mt-0.5">Please contact us on WhatsApp for refund details.</p>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-4">Order Progress</p>
              <div className="relative">
                {/* Progress line */}
                <div className="absolute top-4 left-4 right-4 h-0.5 bg-muted" />
                <div
                  className="absolute top-4 left-4 h-0.5 bg-primary transition-all duration-500"
                  style={{ width: `${Math.max(0, currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
                />
                <div className="relative flex justify-between">
                  {statusSteps.map((step, i) => {
                    const done    = i <= currentStepIndex;
                    const current = i === currentStepIndex;
                    const cfg     = statusConfig[step];
                    const Icon    = cfg.icon;
                    return (
                      <div key={step} className="flex flex-col items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 border-2 transition-colors ${
                          done
                            ? 'bg-primary border-primary text-primary-foreground'
                            : 'bg-background border-border text-muted-foreground'
                        } ${current ? 'ring-2 ring-primary/30' : ''}`}>
                          <Icon size={14} />
                        </div>
                        <p className={`text-xs text-center max-w-[60px] leading-tight ${done ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                          {cfg.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-border">
            <a
              href={buildWhatsAppSupportLink(order.order_number)}
              target="_blank" rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-primary underline transition-colors"
            >
              Need help? Chat with us on WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  );
}