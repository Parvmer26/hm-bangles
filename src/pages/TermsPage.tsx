import { motion } from 'framer-motion';

export default function TermsPage() {
  return (
    <div className="container-custom py-12 md:py-20 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="section-heading text-3xl md:text-4xl mb-10">Terms of Service</h1>

        <div className="space-y-6 text-muted-foreground leading-relaxed text-sm">
          <section>
            <h2 className="font-serif text-xl font-medium text-foreground mb-3">Orders & Payment</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>All orders are prepaid only — no Cash on Delivery (COD)</li>
              <li>Payment accepted via UPI, credit/debit card, and net banking through Razorpay</li>
              <li>Prices are listed in Indian Rupees (₹) and are subject to change</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-medium text-foreground mb-3">Shipping</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>Flat ₹99 shipping on every order</li>
              <li>Estimated delivery: 3–6 business days</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-medium text-foreground mb-3">Returns & Refunds</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>Returns accepted within 3 days of delivery for damaged or wrong items only</li>
              <li>No returns for change of mind</li>
              <li>Photo evidence required via WhatsApp</li>
              <li>Refunds processed within 5–7 business days after approval</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-medium text-foreground mb-3">Product Information</h2>
            <p>We strive to display accurate product colors, but slight variations may occur due to screen differences. All bangles are sold in pairs.</p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
