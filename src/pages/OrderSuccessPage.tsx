import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Printer, Package } from 'lucide-react';
import { WHATSAPP_LINK, formatPrice, SHIPPING_PAISE } from '@/data/products';

interface OrderItem {
  name: string;
  size: string;
  price: number;
}

export default function OrderSuccessPage() {
  const [params]    = useSearchParams();
  const orderNumber = params.get('order') || 'HMB-XXXXXXXX-XXXX';
  const customerName = params.get('name') || '';
  const address      = params.get('address') || '';
  const totalPaise   = parseInt(params.get('total') || '0');
  const itemsRaw     = params.get('items') || '[]';
  const orderDate    = new Date().toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  let items: OrderItem[] = [];
  try { items = JSON.parse(itemsRaw); } catch { items = []; }

  const subtotalPaise = totalPaise - SHIPPING_PAISE;

  const whatsappMsg = encodeURIComponent(
    `Hi HM Bangles! I just placed order ${orderNumber}. Please confirm my order and share payment details.`
  );

  const invoiceParams = new URLSearchParams({
    order:   orderNumber,
    name:    customerName,
    address: address,
    total:   totalPaise.toString(),
    items:   itemsRaw,
    date:    orderDate,
  });

  return (
    <div className="container-custom py-20 md:py-28 max-w-lg mx-auto">

      {/* Success animation */}
      <div className="text-center mb-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-20 h-20 mx-auto mb-8 rounded-full bg-green-100 flex items-center justify-center"
        >
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <motion.path
              d="M10 20L18 28L30 12"
              stroke="#22c55e"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            />
          </svg>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h1 className="font-serif text-3xl md:text-4xl font-medium mb-4">Order Confirmed!</h1>
          <p className="text-sm text-muted-foreground uppercase tracking-[0.15em] mb-2">Order Number</p>
          <p className="font-serif text-xl gold-text mb-2">{orderNumber}</p>
          <p className="text-xs text-muted-foreground">{orderDate}</p>
        </motion.div>
      </div>

      {/* Order receipt */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="border border-border bg-cream-dark p-6 mb-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Package size={16} className="text-muted-foreground" />
          <h2 className="font-medium text-sm uppercase tracking-wide">Order Receipt</h2>
        </div>

        {customerName && (
          <div className="mb-4 text-sm">
            <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Customer</p>
            <p className="font-medium">{customerName}</p>
            {address && <p className="text-muted-foreground text-xs mt-0.5">{address}</p>}
          </div>
        )}

        {items.length > 0 && (
          <div className="mb-4">
            <p className="text-muted-foreground text-xs uppercase tracking-wide mb-2">Items</p>
            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.name} (Size {item.size})</span>
                  <span>{formatPrice(item.price)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-border pt-3 space-y-1 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>{formatPrice(subtotalPaise > 0 ? subtotalPaise : totalPaise - SHIPPING_PAISE)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Shipping</span>
            <span>{formatPrice(SHIPPING_PAISE)}</span>
          </div>
          <div className="flex justify-between font-medium text-base border-t border-border pt-2 mt-2">
            <span>Total</span>
            <span className="price-text">{formatPrice(totalPaise)}</span>
          </div>
        </div>

        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-700">
          Our team will contact you on WhatsApp to collect payment before dispatching your order.
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="space-y-3"
      >
        <a
          href={`${WHATSAPP_LINK}?text=${whatsappMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp w-full flex items-center justify-center gap-2"
        >
          Confirm Order on WhatsApp
        </a>

        <Link
          to={`/invoice?${invoiceParams.toString()}`}
          className="w-full flex items-center justify-center gap-2 border border-border py-3 px-4 text-sm hover:border-primary transition-colors"
        >
          <Printer size={16} /> View & Print Invoice
        </Link>

        <Link to="/order-tracking" className="block text-center text-sm text-muted-foreground hover:text-primary transition-colors">
          Track this order
        </Link>

        <Link to="/shop" className="btn-outline-gold inline-block w-full text-center mt-2">
          Continue Shopping
        </Link>
      </motion.div>
    </div>
  );
}