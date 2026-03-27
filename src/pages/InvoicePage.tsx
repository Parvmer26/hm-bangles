import { useSearchParams, Link } from 'react-router-dom';
import { formatPrice, SHIPPING_PAISE } from '@/data/products';

interface OrderItem {
  name: string;
  size: string;
  price: number;
}

export default function InvoicePage() {
  const [params]     = useSearchParams();
  const orderNumber  = params.get('order')   || '—';
  const customerName = params.get('name')    || '—';
  const address      = params.get('address') || '—';
  const totalPaise   = parseInt(params.get('total') || '0');
  const orderDate    = params.get('date')    || new Date().toLocaleDateString('en-IN');
  const itemsRaw     = params.get('items')   || '[]';

  let items: OrderItem[] = [];
  try { items = JSON.parse(itemsRaw); } catch { items = []; }

  const subtotalPaise = totalPaise - SHIPPING_PAISE;

  return (
    <div className="min-h-screen bg-white">

      {/* Print button — hidden when printing */}
      <div className="print:hidden flex items-center justify-between p-4 border-b bg-cream-dark">
        <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
          ← Back to site
        </Link>
        <button
          onClick={() => window.print()}
          className="btn-gold text-xs py-2 px-6"
        >
          Print / Save as PDF
        </button>
      </div>

      {/* Invoice */}
      <div className="max-w-2xl mx-auto p-8 md:p-12">

        {/* Header */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-gray-900 mb-1">
              HM <span style={{ color: '#c49a3c' }}>Bangles</span>
            </h1>
            <p className="text-sm text-gray-500">Rajkot, Gujarat, India</p>
            <p className="text-sm text-gray-500">WhatsApp: +91 94272 71597</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900 mb-1">INVOICE</p>
            <p className="text-sm text-gray-500">{orderDate}</p>
          </div>
        </div>

        {/* Order + Customer info */}
        <div className="grid grid-cols-2 gap-8 mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Bill To</p>
            <p className="font-semibold text-gray-900">{customerName}</p>
            <p className="text-sm text-gray-600 mt-1 leading-relaxed">{address}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Order Details</p>
            <p className="text-sm text-gray-600">Order No.</p>
            <p className="font-mono font-semibold text-gray-900">{orderNumber}</p>
            <p className="text-sm text-gray-600 mt-2">Date</p>
            <p className="text-sm text-gray-900">{orderDate}</p>
          </div>
        </div>

        {/* Items table */}
        <table className="w-full mb-8">
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
              <th className="text-left py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Item</th>
              <th className="text-center py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Size</th>
              <th className="text-right py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Price</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td className="py-4 text-sm text-gray-900">{item.name}</td>
                <td className="py-4 text-sm text-gray-600 text-center">{item.size}</td>
                <td className="py-4 text-sm text-gray-900 text-right">{formatPrice(item.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mb-10">
          <div className="w-64">
            <div className="flex justify-between py-2 text-sm text-gray-600">
              <span>Subtotal</span>
              <span>{formatPrice(subtotalPaise)}</span>
            </div>
            <div className="flex justify-between py-2 text-sm text-gray-600">
              <span>Shipping</span>
              <span>{formatPrice(SHIPPING_PAISE)}</span>
            </div>
            <div className="flex justify-between py-3 font-bold text-gray-900 text-base"
              style={{ borderTop: '2px solid #e5e7eb' }}>
              <span>Total</span>
              <span style={{ color: '#c49a3c' }}>{formatPrice(totalPaise)}</span>
            </div>
          </div>
        </div>

        {/* Payment note */}
        <div className="p-4 rounded mb-8 text-sm text-amber-800"
          style={{ backgroundColor: '#fffbeb', border: '1px solid #fcd34d' }}>
          <p className="font-semibold mb-1">Payment Pending</p>
          <p className="text-xs">
            Our team will contact you on WhatsApp (+91 94272 71597) to collect payment
            via UPI/bank transfer before your order is dispatched.
          </p>
        </div>

        {/* Footer */}
        <div className="text-center pt-8" style={{ borderTop: '1px solid #e5e7eb' }}>
          <p className="font-serif text-lg text-gray-900 mb-1">Thank you for your order!</p>
          <p className="text-sm text-gray-500">
            HM Bangles · Rajkot, Gujarat · hmbangles.in
          </p>
        </div>

      </div>
    </div>
  );
}