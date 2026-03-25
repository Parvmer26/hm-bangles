import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { WHATSAPP_LINK } from '@/data/products';

export default function OrderSuccessPage() {
  const [params] = useSearchParams();
  const orderNumber = params.get('order') || 'HMB-XXXXXXXX-XXXX';

  const whatsappMsg = encodeURIComponent(
    `Hi HM Bangles! I just placed order ${orderNumber}. Please confirm.`
  );

  return (
    <div className="container-custom py-20 md:py-28 text-center max-w-lg mx-auto">
      {/* Checkmark animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="w-20 h-20 mx-auto mb-8 rounded-full bg-success/10 flex items-center justify-center"
      >
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <motion.path
            d="M10 20L18 28L30 12"
            stroke="hsl(var(--success))"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          />
        </svg>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h1 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-4">
          Order Confirmed
        </h1>
        <p className="text-sm text-muted-foreground uppercase tracking-[0.15em] mb-2">
          Order Number
        </p>
        <p className="font-serif text-xl gold-text mb-6">{orderNumber}</p>
        <p className="text-muted-foreground leading-relaxed mb-10">
          Thank you for your order! Your bangles will be delivered within 3–6 business days.
        </p>

        <div className="space-y-4">
          <a
            href={`${WHATSAPP_LINK}?text=${whatsappMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp w-full flex items-center justify-center gap-2"
          >
            Send Order Details on WhatsApp
          </a>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Contact Support on WhatsApp
          </a>
          <Link to="/shop" className="btn-outline-gold inline-block mt-4">
            Continue Shopping
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
