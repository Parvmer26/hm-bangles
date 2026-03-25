import { motion } from 'framer-motion';

export default function PrivacyPage() {
  return (
    <div className="container-custom py-12 md:py-20 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="section-heading text-3xl md:text-4xl mb-10">Privacy Policy</h1>

        <div className="space-y-6 text-muted-foreground leading-relaxed text-sm">
          <p>Last updated: {new Date().getFullYear()}</p>

          <section>
            <h2 className="font-serif text-xl font-medium text-foreground mb-3">What We Collect</h2>
            <p>When you place an order, we collect your name, phone number, and delivery address for order fulfillment.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-medium text-foreground mb-3">How We Use Your Data</h2>
            <p>Your information is used solely to process and deliver your orders. We may contact you via WhatsApp for order updates.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-medium text-foreground mb-3">Data Sharing</h2>
            <p>We never sell your personal data to third parties. Your payment information is handled securely by Razorpay — we never see or store your card details.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-medium text-foreground mb-3">Contact</h2>
            <p>For any privacy-related queries, reach us on WhatsApp at +91 94272 71597.</p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
