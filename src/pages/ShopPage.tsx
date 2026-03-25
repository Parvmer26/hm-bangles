import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BANGLE_SIZES, type BangleSize } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import { getProducts } from '@/lib/api';

interface ProductSize {
  size: string;
  stock: number;
  is_enabled: boolean;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price_paise: number;
  images: string[];
  is_active: boolean;
  product_sizes: ProductSize[];
}

export default function ShopPage() {
  const [selectedSize, setSelectedSize] = useState<BangleSize | 'all'>('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data || []);
      } catch (err) {
        console.error('Failed to load products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const filtered = selectedSize === 'all'
    ? products.filter(p => p.is_active)
    : products.filter(p =>
        p.is_active &&
        p.product_sizes.some(s =>
          s.size === selectedSize && s.stock > 0 && s.is_enabled
        )
      );

  // Convert Supabase product to format ProductCard expects
  const toCardFormat = (p: Product) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    pricePaise: p.price_paise,
    images: p.images,
    isActive: p.is_active,
    sizes: p.product_sizes.map(s => ({
      size: s.size as BangleSize,
      stock: s.stock,
      isEnabled: s.is_enabled,
    })),
  });

  return (
    <div className="container-custom py-12 md:py-20">
      <div className="text-center mb-12">
        <p className="section-subheading mb-2">Collection</p>
        <h1 className="section-heading">The Acrylic Series</h1>
      </div>

      {/* Size filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        <button
          onClick={() => setSelectedSize('all')}
          className={`px-4 py-2 text-xs uppercase tracking-[0.15em] border transition-all duration-300 ${
            selectedSize === 'all'
              ? 'bg-primary text-primary-foreground border-primary'
              : 'border-border text-muted-foreground hover:border-primary hover:text-primary'
          }`}
        >
          All
        </button>
        {BANGLE_SIZES.map(size => (
          <button
            key={size}
            onClick={() => setSelectedSize(size)}
            className={`px-4 py-2 text-xs uppercase tracking-[0.15em] border transition-all duration-300 ${
              selectedSize === size
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border text-muted-foreground hover:border-primary hover:text-primary'
            }`}
          >
            {size}
          </button>
        ))}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-muted rounded mb-3" />
              <div className="h-4 bg-muted rounded mb-2 w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 border border-border text-sm hover:border-primary transition-colors"
          >
            Try again
          </button>
        </div>
      )}

      {/* Products grid */}
      {!loading && !error && (
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedSize}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
          >
            {filtered.map((product, i) => (
              <ProductCard
                key={product.id}
                product={toCardFormat(product)}
                index={i}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Empty state */}
      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {selectedSize === 'all'
              ? 'No products available right now. Check back soon!'
              : `No bangles available in size ${selectedSize} right now.`}
          </p>
          {selectedSize !== 'all' && (
            <button
              onClick={() => setSelectedSize('all')}
              className="mt-4 px-6 py-2 border border-border text-sm hover:border-primary transition-colors"
            >
              View all sizes
            </button>
          )}
        </div>
      )}
    </div>
  );
}