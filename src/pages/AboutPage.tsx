import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import aboutImage from '@/assets/about-craft.jpg';

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-20 md:py-28 bg-cream-dark">
        <div className="container-custom text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="section-subheading mb-4">Our Story</p>
            <h1 className="section-heading text-4xl md:text-5xl">Crafted in Rajkot, Gujarat</h1>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="container-custom grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <img src={aboutImage} alt="Crafting bangles" className="w-full" loading="lazy" width={1200} height={800} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="font-serif text-3xl font-light text-foreground">A Small Workshop, A Big Dream</h2>
            <p className="text-muted-foreground leading-relaxed">
              From a modest workshop in Rajkot, Gujarat, HM Bangles was born from a simple belief — that everyday accessories should feel extraordinary. We work exclusively with premium acrylic materials, crafting each bangle with meticulous attention to detail.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Every piece passes through careful hands, shaped and polished until it catches the light just right. Our bangles aren't just accessories — they're wearable art that celebrates the beauty of modern craftsmanship.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Commitments */}
      <section className="py-16 md:py-24 bg-cream-dark">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="section-subheading mb-2">What We Stand For</p>
            <h2 className="section-heading text-3xl">Our Commitments</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Quality First', desc: 'Premium acrylic materials, hand-polished to perfection. Every bangle undergoes quality checks before it reaches you.' },
              { title: 'Transparency', desc: 'Honest pricing, clear policies, and no hidden costs. What you see is what you pay — always.' },
              { title: 'Support', desc: 'We\'re just a WhatsApp message away. Real humans, real help, Mon–Sat, 10am–7pm IST.' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center p-8"
              >
                <h3 className="font-serif text-xl font-medium text-foreground mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 text-center">
        <div className="container-custom">
          <h2 className="font-serif text-3xl font-light text-foreground mb-6">Explore the Collection</h2>
          <Link to="/shop" className="btn-gold inline-block">Shop Now</Link>
        </div>
      </section>
    </div>
  );
}
