import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatPrice, SHIPPING_PAISE } from '@/data/products';
import html2pdf from 'html2pdf.js';
import { Package } from 'lucide-react';
// import { WHATSAPP_LINK, formatPrice, SHIPPING_PAISE } from '@/data/products';
// import { buildOrderConfirmationMessage } from '@/lib/constants';

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

  

//   const whatsappMsg = encodeURIComponent(
//   buildOrderConfirmationMessage(
//     customerName || 'Customer',
//     orderNumber,
//     totalPaise / 100
//   )
// );


  function copyOrderId() {
  navigator.clipboard.writeText(orderNumber);
}
  


const handleDownloadInvoice = async () => {
  const element = document.getElementById('invoice-download');
  if (!element) return;

  // temporarily bring it on screen
  element.style.position = 'static';
  element.style.left = '0';
  element.style.top = '0';

  await new Promise((res) => setTimeout(res, 300)); // wait render

  const opt = {
    margin: 0,
    filename: `Invoice-${orderNumber}.pdf`,
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

  // hide it again
  element.style.position = 'fixed';
  element.style.left = '-9999px';
};

  return (
  <>
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

          <div className="flex items-center justify-center gap-2 mb-2">
            <p className="font-serif text-xl gold-text">{orderNumber}</p>

            <button
              onClick={copyOrderId}
              className="text-xs border px-2 py-1 hover:border-primary"
            >
              Copy
            </button>
          </div>

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

      <button
  onClick={handleDownloadInvoice}
  className="btn-outline-gold inline-block w-full text-center"
>
  Download Invoice
</button>

        <Link to="/order-tracking" className="block text-center text-sm text-muted-foreground hover:text-primary transition-colors">
          Track this order
        </Link>

        <Link to="/shop" className="btn-outline-gold inline-block w-full text-center mt-2">
          Continue Shopping
        </Link>
      </motion.div>
    </div>

    {/* Hidden Invoice */}
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
      <p style={{ fontWeight: '600' }}>{customerName}</p>
      <p style={{ fontSize: '12px', color: '#555' }}>{address}</p>
    </div>

    <div style={{ textAlign: 'right' }}>
      <p style={{ fontSize: '10px', color: '#999', marginBottom: '6px' }}>ORDER DETAILS</p>
      <p style={{ fontSize: '12px', color: '#666' }}>Order No.</p>
      <p style={{ fontWeight: '600' }}>{orderNumber}</p>
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
      {items.map((item, i) => (
        <tr key={i} style={{ borderBottom: '1px solid #f3f3f3' }}>
          <td style={{ padding: '12px 0' }}>{item.name}</td>
          <td style={{ textAlign: 'center', fontSize: '12px' }}>{item.size}</td>
          <td style={{ textAlign: 'right' }}>₹{(item.price / 100).toFixed(2)}</td>
        </tr>
      ))}
    </tbody>
  </table>

  {/* Totals */}
  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '30px' }}>
    <div style={{ width: '200px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
        <span>Subtotal</span>
        <span>₹{(subtotalPaise / 100).toFixed(2)}</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
        <span>Shipping</span>
        <span>₹{(SHIPPING_PAISE / 100).toFixed(2)}</span>
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
          ₹{(totalPaise / 100).toFixed(2)}
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
  </>
);


 
}