import { useState, useEffect, useCallback } from 'react';
import { Search, Package, Truck, CheckCircle, Clock, XCircle, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { buildWhatsAppSupportLink } from '@/lib/constants';
import html2pdf from 'html2pdf.js';


const statusSteps = ['confirmed', 'packed', 'shipped', 'delivered'];



const statusConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  pending:   { icon: Clock,       color: 'text-amber-500',  label: 'Payment Pending' },
  confirmed: { icon: CheckCircle, color: 'text-blue-500',   label: 'Order Confirmed' },
  packed:    { icon: Package,     color: 'text-purple-500', label: 'Packed' },
  shipped:   { icon: Truck,       color: 'text-indigo-500', label: 'Shipped' },
  delivered: { icon: CheckCircle, color: 'text-green-500',  label: 'Delivered' },
  cancelled: { icon: XCircle,     color: 'text-red-500',    label: 'Cancelled' },
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
  subtotal_paise: number;
shipping_paise: number;
address_line1: string;
address_line2?: string;
pincode: string;
}

export default function OrderTrackingPage() {
  const [query, setQuery]     = useState('');
  const [order, setOrder]     = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError]     = useState('');
  const [myOrders, setMyOrders] = useState<any[]>([]);

  // Fetch order from Supabase
  const fetchOrder = useCallback(async (orderNumber: string, silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    setError('');

    const { data, error: dbError } = await supabase
      .from('orders')
      .select('*, order_items(product_name, size)')
      .eq('order_number', orderNumber.trim().toUpperCase())
      .single();

    if (dbError || !data) {
      if (!silent) setError('Order not found. Please check your order number and try again.');
    } else {
      setOrder(data as Order);
    }

    if (!silent) setLoading(false);
    else setRefreshing(false);
  }, []);


  useEffect(() => {
  const stored = JSON.parse(localStorage.getItem('orders') || '[]');
  setMyOrders(stored);
}, []);

  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get('order');

  if (orderId) {
    setQuery(orderId);
    fetchOrder(orderId);
  }
}, [fetchOrder]);

  // Real-time subscription — updates status instantly when admin changes it
  useEffect(() => {
    if (!order?.id) return;

    const channel = supabase
      .channel(`order-${order.id}`)
      .on(
        'postgres_changes',
        {
          event:  'UPDATE',
          schema: 'public',
          table:  'orders',
          filter: `id=eq.${order.id}`,
        },
        (payload) => {
          // Instantly update the order status without re-fetching
          setOrder(prev => prev ? { ...prev, status: (payload.new as Order).status } : prev);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [order?.id]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    await fetchOrder(query);
  }

  const handleDownloadInvoice = async () => {
  const element = document.getElementById('invoice-download');
  if (!element || !order) return;

  // 👇 bring invoice into view
  element.style.position = 'static';
  element.style.left = '0';
  element.style.top = '0';

  await new Promise((res) => setTimeout(res, 600)); // wait render

  const opt = {
    margin: 0,
    filename: `Invoice-${order.order_number}.pdf`,
    image: { type: 'jpeg', quality: 1 },
    html2canvas: {
      scale: 3,
      useCORS: true,
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait',
    },
  };

  await html2pdf().set(opt).from(element).save();

  // 👇 hide again
  element.style.position = 'fixed';
  element.style.left = '-9999px';
};

  const currentStepIndex = order ? statusSteps.indexOf(order.status) : -1;
  const orderDate = order
  ? new Date(order.created_at).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  : '';
  const address = order
  ? `${order.address_line1}${order.address_line2 ? ', ' + order.address_line2 : ''}, ${order.city}, ${order.state} - ${order.pincode}`
  : '';

  return (
    <>
    <div className="container-custom py-16 md:py-24 max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <p className="section-subheading mb-2">Track Your Order</p>
        <h1 className="section-heading text-3xl md:text-4xl mb-4">Where's My Order?</h1>
        <p className="text-sm text-muted-foreground">
          Enter your order number (e.g. HMB-20240315-4821) to see your live order status.
        </p>
      </div>

      {/* Your Orders Section */}
{myOrders.length > 0 && (
  <div className="mb-8 border border-border p-4">
    <p className="text-xs uppercase text-muted-foreground mb-3">Your Orders</p>

    {myOrders.map((o, i) => (
      <div
        key={i}
        onClick={() => {
          setQuery(o.id);
          fetchOrder(o.id);
        }}
        className="text-sm cursor-pointer hover:text-primary mb-2"
      >
        {o.id} — ₹{o.total / 100}
      </div>
    ))}
  </div>
)}


      <form onSubmit={handleSearch} className="flex gap-3 mb-10">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="HMB-20240315-4821"
          className="flex-1 px-4 py-3 border border-border bg-background text-sm focus:outline-none focus:border-primary uppercase tracking-wider"
        />
        <button
          type="submit"
          disabled={loading}
          className="btn-gold px-6 flex items-center gap-2 disabled:opacity-50"
        >
          <Search size={16} />
          {loading ? 'Searching...' : 'Track'}
        </button>
      </form>

      {error && (
        <div className="text-center py-8 border border-border">
          <XCircle size={32} className="text-red-400 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <a
            href={buildWhatsAppSupportLink(query)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs underline text-muted-foreground hover:text-primary"
          >
            Contact us on WhatsApp for help
          </a>
        </div>
      )}

      {order && (
        <div className="border border-border p-6 space-y-6">

          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <p className="font-mono text-sm font-medium">{order.order_number}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(order.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="font-medium">₹{(order.total_paise / 100).toFixed(0)}</p>
                <p className="text-xs text-muted-foreground">{order.city}, {order.state}</p>
              </div>
              {/* Manual refresh button */}
              <button
                onClick={() => fetchOrder(order.order_number, true)}
                disabled={refreshing}
                className="p-2 border border-border hover:border-primary transition-colors text-muted-foreground hover:text-primary"
                title="Refresh status"
              >
                <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>

          {/* Items */}
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Items</p>
            {order.order_items.map((item, i) => (
              <p key={i} className="text-sm">{item.product_name} · Size {item.size}</p>
            ))}
          </div>

          {/* Live status badge */}
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">Current Status:</span>
            <span className={`text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full capitalize ${
              order.status === 'delivered' ? 'bg-green-100 text-green-700' :
              order.status === 'shipped'   ? 'bg-indigo-100 text-indigo-700' :
              order.status === 'packed'    ? 'bg-purple-100 text-purple-700' :
              order.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
              order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
              'bg-amber-100 text-amber-700'
            }`}>
              {statusConfig[order.status]?.label || order.status}
            </span>
            <span className="flex items-center gap-1 text-xs text-green-600">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
              Live
            </span>
          </div>

          {/* Progress tracker */}
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
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-6">Order Progress</p>
              <div className="relative">
                {/* Background line */}
                <div className="absolute top-4 left-4 right-4 h-0.5 bg-muted" />
                {/* Progress fill */}
                <div
                  className="absolute top-4 left-4 h-0.5 bg-primary transition-all duration-700"
                  style={{
                    width: currentStepIndex >= 0
                      ? `${(currentStepIndex / (statusSteps.length - 1)) * (100 - 8)}%`
                      : '0%'
                  }}
                />
                <div className="relative flex justify-between">
                  {statusSteps.map((step, i) => {
                    const done    = i <= currentStepIndex;
                    const current = i === currentStepIndex;
                    const cfg     = statusConfig[step];
                    const Icon    = cfg.icon;
                    
                    return (
                      <div key={step} className="flex flex-col items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 border-2 transition-all duration-500 ${
                          done
                            ? 'bg-primary border-primary text-primary-foreground'
                            : 'bg-background border-border text-muted-foreground'
                        } ${current ? 'ring-4 ring-primary/20 scale-110' : ''}`}>
                          <Icon size={14} />
                        </div>
                        <p className={`text-xs text-center max-w-[60px] leading-tight transition-colors ${
                          done ? 'text-foreground font-medium' : 'text-muted-foreground'
                        }`}>
                          {cfg.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Download Invoice */}
<button
  onClick={handleDownloadInvoice}
  className="btn-outline-gold inline-block w-full text-center"
>
  Download Invoice
</button>

          {/* WhatsApp support */}
          <div className="pt-4 border-t border-border">
            <a
              href={buildWhatsAppSupportLink(order.order_number)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-primary underline transition-colors"
            >
              Need help? Chat with us on WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>

    {/* Hidden Invoice */}
        {order && (
  <div
  id="invoice-download"
     style={{
  position: 'fixed',
  left: '-9999px',
  top: 0,
  width: '800px',
  background: 'white'
}}
    ><div
      style={{
        width: '800px',
        padding: '40px',
        fontFamily: 'serif',
        color: '#111',
        background: '#fff'
      }}
    >
    
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '28px', marginBottom: '4px' }}>
  HM <span style={{ color: '#c49a3c' }}>Bangles</span>
</h1>
          <p style={{ fontSize: '12px', color: '#666' }}>Rajkot, Gujarat, India</p>
          <p style={{ fontSize: '12px', color: '#666' }}>WhatsApp: +91 94272 71597</p>
        </div>
    
        <div style={{ textAlign: 'right' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold' }}>INVOICE</h2>
          <p style={{ fontSize: '12px', color: '#666' }}>{orderDate}</p>
        </div>
      </div>
    
      {/* Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
        <div>
          <p style={{ fontSize: '10px', color: '#999', marginBottom: '6px' }}>BILL TO</p>
          <p style={{ fontWeight: '600' }}>{order?.customer_name}</p>
          <p style={{ fontSize: '12px', color: '#555' }}>{address}</p>
        </div>
    
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '10px', color: '#999', marginBottom: '6px' }}>ORDER DETAILS</p>
          <p style={{ fontSize: '12px', color: '#666' }}>Order No.</p>
          <p style={{ fontWeight: '600' }}>{order?.order_number}</p>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '6px' }}>Date</p>
          <p style={{ fontSize: '12px' }}>{orderDate}</p>
        </div>
      </div>
    
      {/* Table */}
      <table style={{ width: '100%', marginBottom: '30px', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #eee' }}>
            <th style={{ textAlign: 'left', fontSize: '10px', color: '#999', paddingBottom: '8px' }}>ITEM</th>
            <th style={{ textAlign: 'center', fontSize: '10px', color: '#999' }}>SIZE</th>
            <th style={{ textAlign: 'right', fontSize: '10px', color: '#999' }}>PRICE</th>
          </tr>
        </thead>
    
        <tbody>
          {order?.order_items.map((item, i) => (
  <tr key={i}>
    <td style={{ padding: '12px 0' }}>{item.product_name}</td>
    <td style={{ textAlign: 'center' }}>{item.size}</td>
    <td style={{ textAlign: 'right' }}>
      ₹{((order.total_paise / order.order_items.length) / 100).toFixed(2)}
    </td>
  </tr>
))}
        </tbody>
      </table>
    
      {/* Totals */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '30px' }}>
        <div style={{ width: '200px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
            <span>Subtotal</span>
            <span>₹{((order?.subtotal_paise || 0) / 100).toFixed(2)}</span>
          </div>
    
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
            <span>Shipping</span>
            <span>₹{((order?.shipping_paise || 0) / 100).toFixed(2)}</span>
          </div>
    
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontWeight: 'bold',
            borderTop: '2px solid #eee',
            paddingTop: '8px'
          }}>
            <span>Total</span>
            <span style={{ color: '#c49a3c' }}>
             ₹{((order?.total_paise || 0) / 100).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    
      {/* Payment */}
      <div style={{
        background: '#fff8e1',
        border: '1px solid #facc15',
        padding: '12px',
        fontSize: '12px',
        marginBottom: '30px'
      }}>
        <strong>Payment Pending</strong>
        <p style={{ marginTop: '4px' }}>
          Our team will contact you on WhatsApp (+91 94272 71597) to collect payment before dispatch.
        </p>
      </div>
    
      {/* Footer */}
      <div style={{ textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '20px' }}>
        <p style={{ fontSize: '16px', marginBottom: '4px' }}>Thank you for your order!</p>
        <p style={{ fontSize: '12px', color: '#666' }}>
          HM Bangles · Rajkot, Gujarat · hmbangles.in
        </p>
      </div>
    
    </div>
        </div>
        )}
        </>
  );
} 