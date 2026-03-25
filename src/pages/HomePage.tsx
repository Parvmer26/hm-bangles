import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import heroImage from '@/assets/hero-bangles.jpg';
import { products } from '@/data/products';
import ProductCard from '@/components/ProductCard';

const newArrivals = products.filter(p => p.isNew && p.isActive).slice(0, 4);

export default function HomePage() {
  return (
    <>
      {/* SEO */}
      <title>HM Bangles — Premium Acrylic Bangles from Rajkot</title>
      <meta name="description" content="Discover handcrafted premium acrylic bangles from Rajkot, Gujarat. Curated statements crafted for the modern woman. Shop now." />

      {/* Hero */}
      <section className="relative h-[85vh] md:h-[90vh] overflow-hidden">
        <img
          src={heroImage}
          alt="Premium acrylic bangles by HM Bangles"
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
        <div className="relative h-full flex items-end pb-16 md:pb-24">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light text-foreground leading-[1.1] mb-4">
                The Art of<br />the <span className="italic gold-text">Bangle</span>
              </h2>
              <p className="text-base md:text-lg text-muted-foreground max-w-md mb-8 leading-relaxed">
                Curated acrylic statements crafted for the modern woman
              </p>
              <Link to="/shop" className="btn-gold inline-block">
                Shop Now
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
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

      {/* New Arrivals */}
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
            {newArrivals.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* About teaser */}
      <section className="py-20 md:py-28 bg-cream-dark">
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
            <Link to="/about" className="btn-outline-gold inline-block">
              Learn More
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
