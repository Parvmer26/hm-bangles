import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Truck, RefreshCw, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import heroImage from '@/assets/hero-bangles.jpg';
import { products } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import { useState, useEffect } from 'react';
import { getProducts } from '@/lib/api';

const newArrivals = products.filter(p => p.isNew && p.isActive).slice(0, 4);

const reviews = [
  { name: 'Priya S.',    location: 'Ahmedabad', rating: 5, text: 'Absolutely stunning bangles! The quality is amazing and they look so elegant. Delivered super fast too!' },
  { name: 'Meera P.',   location: 'Surat',      rating: 5, text: 'Ordered size 2.4 and the fit is perfect. The acrylic is premium quality. Will definitely order again!' },
  { name: 'Anita J.',   location: 'Mumbai',     rating: 5, text: 'Beautiful bangles at a great price. Packaging was lovely too. Highly recommend HM Bangles!' },
  { name: 'Kavita D.',  location: 'Rajkot',     rating: 5, text: 'Love these bangles! They go with everything. The WhatsApp support was very helpful too.' },
];

const trustBadges = [
  { icon: Shield,    title: 'Premium Quality',    desc: 'High-grade acrylic, hand-inspected' },
  { icon: Truck,     title: 'Fast Shipping',      desc: 'Flat ₹99 · 3–6 business days' },
  { icon: RefreshCw, title: 'Easy Returns',       desc: '3-day return for damaged items' },
  { icon: Star,      title: 'Secure Payment',     desc: 'Prepaid via Razorpay · 100% safe' },
];

const faqs = [
  { q: 'How do I find my bangle size?',    a: 'Measure the widest part of your hand (knuckles). 2.2 = 5.5cm, 2.4 = 6cm, 2.6 = 6.5cm, 2.8 = 7cm, 2.10 = 7.5cm, 2.12 = 8cm.' },
  { q: 'Do you accept returns?',            a: 'We accept replacements for damaged or wrong items reported within 3 days of delivery. Contact us on WhatsApp with a photo.' },
  { q: 'How long does delivery take?',      a: '3–6 business days after dispatch. We dispatch within 1–2 business days of payment confirmation.' },
  { q: 'Do you offer cash on delivery?',   a: 'No, we accept prepaid orders only via UPI, debit/credit card, and net banking through Razorpay.' },
  { q: 'Do you sell wholesale?',            a: 'Yes! For bulk/wholesale enquiries please message us on WhatsApp and we will share pricing.' },
];

export default function HomePage() {
  const [currentReview, setCurrentReview] = useState(0);
  const [openFaq, setOpenFaq]             = useState<number | null>(null);
  const [liveProducts, setLiveProducts]   = useState(newArrivals);

  // Try to load live products from Supabase
  useEffect(() => {
    getProducts().then(data => {
      if (data && data.length > 0) {
        const converted = data.slice(0, 4).map((p: {
          id: string; name: string; slug: string; description: string;
          price_paise: number; images: string[]; is_active: boolean;
          product_sizes: { size: string; stock: number; is_enabled: boolean }[];
        }) => ({
          id:          p.id,
          name:        p.name,
          slug:        p.slug,
          description: p.description,
          pricePaise:  p.price_paise,
          images:      p.images,
          isActive:    p.is_active,
          isNew:       true,
          sizes:       p.product_sizes.map(s => ({
            size:      s.size as '2.2'|'2.4'|'2.6'|'2.8'|'2.10'|'2.12',
            stock:     s.stock,
            isEnabled: s.is_enabled,
          })),
        }));
        setLiveProducts(converted);
      }
    }).catch(() => {});
  }, []);

  // Auto-rotate reviews
  useEffect(() => {
    const t = setInterval(() => {
      setCurrentReview(c => (c + 1) % reviews.length);
    }, 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <title>HM Bangles — Premium Acrylic Bangles from Rajkot</title>
      <meta name="description" content="Discover handcrafted premium acrylic bangles from Rajkot, Gujarat." />

     {/* ── Hero ── */}
<section className="relative h-[85vh] md:h-[90vh] overflow-hidden">
  <img
    src={heroImage}
    alt="Premium acrylic bangles by HM Bangles"
    className="absolute inset-0 w-full h-full object-cover"
  />
  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
  <div className="relative h-full flex items-end pb-16 md:pb-24">
    <div className="container-custom w-full">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="max-w-xl"
      >
        <h2 className="font-serif text-4xl md:text-7xl lg:text-8xl font-light text-foreground leading-[1.1] mb-4">
          The Art of<br />the <span className="italic gold-text">Bangle</span>
        </h2>
        <p className="text-sm md:text-lg text-muted-foreground max-w-md mb-8 leading-relaxed">
          Curated acrylic statements crafted for the modern woman
        </p>
        <Link to="/shop" className="btn-gold inline-block">Shop Now</Link>
      </motion.div>
    </div>
  </div>
</section>

      {/* ── Trust badges ── */}
      <section className="py-10 border-b border-border bg-cream-dark">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustBadges.map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center gap-2"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon size={18} className="text-primary" />
                </div>
                <p className="text-sm font-medium text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Philosophy ── */}
      <section className="py-20 md:py-28">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="section-subheading mb-4">Our Philosophy</p>
            <h2 className="font-serif text-3xl md:text-5xl font-light text-foreground italic">
              "Sculpted by light, refined by hand"
            </h2>
          </motion.div>
        </div>
      </section>

      {/* ── New Arrivals ── */}
      <section className="pb-20 md:pb-28">
        <div className="container-custom">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="section-subheading mb-2">Just In</p>
              <h2 className="section-heading text-3xl md:text-4xl">New Arrivals</h2>
            </div>
            <Link to="/shop" className="nav-link flex items-center gap-2">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {liveProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Reviews ── */}
      <section className="py-20 md:py-28 bg-cream-dark">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="section-subheading mb-2">Testimonials</p>
            <h2 className="section-heading text-3xl md:text-4xl">What our customers say</h2>
          </div>

          <div className="max-w-2xl mx-auto relative">
            <motion.div
              key={currentReview}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="border border-border bg-background p-8 text-center"
            >
              <div className="flex justify-center gap-1 mb-4">
                {[...Array(reviews[currentReview].rating)].map((_, i) => (
                  <Star key={i} size={16} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-foreground leading-relaxed mb-6 italic font-serif text-lg">
                "{reviews[currentReview].text}"
              </p>
              <p className="font-medium text-sm">{reviews[currentReview].name}</p>
              <p className="text-xs text-muted-foreground">{reviews[currentReview].location}</p>
            </motion.div>

            {/* Controls */}
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                onClick={() => setCurrentReview(c => (c - 1 + reviews.length) % reviews.length)}
                className="p-2 border border-border hover:border-primary transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="flex gap-2">
                {reviews.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentReview(i)}
                    className={`w-2 h-2 rounded-full transition-colors ${i === currentReview ? 'bg-primary' : 'bg-border'}`}
                  />
                ))}
              </div>
              <button
                onClick={() => setCurrentReview(c => (c + 1) % reviews.length)}
                className="p-2 border border-border hover:border-primary transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── About teaser ── */}
      <section className="py-20 md:py-28">
        <div className="container-custom text-center max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="section-subheading mb-4">Our Story</p>
            <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground mb-6">
              Crafted in Rajkot, Gujarat
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              From a small workshop in the heart of Gujarat, we create bangles that blend traditional craftsmanship with contemporary design. Each piece is a testament to our commitment to quality and beauty.
            </p>
            <Link to="/about" className="btn-outline-gold inline-block">Learn More</Link>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 md:py-28 bg-cream-dark">
        <div className="container-custom max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <p className="section-subheading mb-2">FAQ</p>
            <h2 className="section-heading text-3xl md:text-4xl">Common questions</h2>
          </div>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-border bg-background">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium hover:text-primary transition-colors"
                >
                  {faq.q}
                  <span className={`ml-4 flex-shrink-0 text-lg transition-transform ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
                </button>
                <AnimatePresenceWrapper show={openFaq === i}>
                  <p className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </AnimatePresenceWrapper>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WhatsApp CTA ── */}
      <section className="py-16 bg-[#25D366]">
        <div className="container-custom text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-light text-white mb-3">
            Questions? We're here to help.
          </h2>
          <p className="text-white/80 text-sm mb-6">Chat with us directly — fast replies, real support.</p>
          <a
            href={`https://wa.me/919427271597?text=${encodeURIComponent('Hi HM Bangles! I have a question.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-[#25D366] font-medium px-8 py-3 hover:opacity-90 transition-opacity text-sm"
          >
            Chat on WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}

// Simple animation wrapper
function AnimatePresenceWrapper({ show, children }: { show: boolean; children: React.ReactNode }) {
  if (!show) return null;
  return <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>{children}</motion.div>;
}