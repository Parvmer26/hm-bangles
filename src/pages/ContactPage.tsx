import { motion } from 'framer-motion';
import { MessageCircle, Phone, MapPin, Clock } from 'lucide-react';
import { WHATSAPP_LINK } from '@/data/products';

const faqs = [
  {
    q: 'How do I find my bangle size?',
    a: 'Measure the widest part of your knuckles with a tape measure. Size guide: 2.2 = 5.5cm, 2.4 = 6.0cm, 2.6 = 6.5cm, 2.8 = 7.0cm, 2.10 = 7.5cm, 2.12 = 8.0cm knuckle width.',
  },
  {
    q: 'What is the return policy?',
    a: 'We accept returns only for damaged or wrong items within 3 days of delivery. Contact us on WhatsApp with photo evidence.',
  },
  {
    q: 'What is the delivery time?',
    a: '3–6 business days pan-India. All orders include ₹99 flat shipping.',
  },
  {
    q: 'Is COD available?',
    a: 'No, we accept prepaid orders only. Payment via UPI, card, or net banking through Razorpay.',
  },
  {
    q: 'Do you accept wholesale enquiries?',
    a: 'Yes! WhatsApp us directly for wholesale pricing and bulk orders.',
  },
];

export default function ContactPage() {
  return (
    <div>
      <section className="py-20 md:py-28 bg-cream-dark">
        <div className="container-custom text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="section-subheading mb-4">Get In Touch</p>
            <h1 className="section-heading text-4xl md:text-5xl">Contact Us</h1>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container-custom max-w-3xl mx-auto">
          {/* WhatsApp CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-16"
          >
            <p className="text-muted-foreground mb-6">WhatsApp is our primary support channel</p>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp inline-flex items-center gap-2"
            >
              <MessageCircle size={16} /> Chat on WhatsApp
            </a>
          </motion.div>

          {/* Contact details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16">
            {[
              { icon: Phone, label: 'Phone', value: '+91 94272 71597' },
              { icon: MapPin, label: 'Location', value: 'Rajkot, Gujarat' },
              { icon: Clock, label: 'Hours', value: 'Mon–Sat, 10am–7pm IST' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="text-center">
                <Icon size={20} className="mx-auto mb-3 gold-text" />
                <p className="section-subheading mb-1">{label}</p>
                <p className="text-sm text-foreground">{value}</p>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div>
            <h2 className="font-serif text-2xl font-medium text-foreground text-center mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="border-b border-border pb-6"
                >
                  <h3 className="font-serif text-lg font-medium text-foreground mb-2">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
