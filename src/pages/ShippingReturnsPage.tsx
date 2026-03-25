import { motion } from 'framer-motion';
import { WHATSAPP_LINK } from '@/data/products';

export default function ShippingReturnsPage() {
  return (
    <div className="container-custom py-12 md:py-20 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="section-heading text-3xl md:text-4xl mb-10">Shipping & Returns</h1>

        <div className="space-y-8 text-muted-foreground leading-relaxed text-sm">
          <section>
            <h2 className="font-serif text-xl font-medium text-foreground mb-3">Shipping</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>Flat ₹99 shipping on all orders, pan-India</li>
              <li>Estimated delivery: 3–6 business days</li>
              <li>Orders are dispatched within 1–2 business days</li>
              <li>You'll receive a WhatsApp update when your order ships</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-medium text-foreground mb-3">Returns</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>Returns accepted only for damaged or wrong items</li>
              <li>You must contact us within 3 days of delivery</li>
              <li>Share photo evidence on WhatsApp for quick processing</li>
              <li>No returns for change of mind, wrong size selection, or personal preference</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-medium text-foreground mb-3">How to Initiate a Return</h2>
            <p>
              Contact us on{' '}
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="gold-text hover:underline">
                WhatsApp
              </a>{' '}
              with your order number and photos of the damaged/wrong item. We'll process your return within 2 business days.
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
