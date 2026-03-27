import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useState } from 'react';
import { type Product, formatPrice, isProductSoldOut } from '@/data/products';
import { useWishlist } from '@/hooks/useWishlist';

interface Props {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: Props) {
  const soldOut        = isProductSoldOut(product);
  const availableSizes = product.sizes.filter(s => s.stock > 0 && s.isEnabled);
  const lowStock       = !soldOut && availableSizes.some(s => s.stock <= 3 && s.stock > 0);
  const hasSecondImage = product.images.length > 1;
  const [hovered, setHovered] = useState(false);
  const { toggle, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="block product-card group relative">
        {/* Image */}
        <Link
          to={`/product/${product.slug}`}
          className="block"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div className="relative overflow-hidden bg-cream-dark aspect-[4/5]">
            {/* Primary image */}
            <img
              src={product.images[0]}
              alt={product.name}
              loading="lazy"
              className={`product-image w-full h-full object-cover transition-opacity duration-500 ${
                hovered && hasSecondImage ? 'opacity-0' : 'opacity-100'
              }`}
            />
            {/* Hover image */}
            {hasSecondImage && (
              <img
                src={product.images[1]}
                alt={`${product.name} alternate`}
                loading="lazy"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                  hovered ? 'opacity-100' : 'opacity-0'
                }`}
              />
            )}

            {/* Sold out overlay */}
            {soldOut && (
              <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                <span className="section-subheading text-muted-foreground">Sold Out</span>
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {product.isNew && !soldOut && (
                <span className="text-xs uppercase tracking-[0.15em] bg-primary text-primary-foreground px-3 py-1">
                  New
                </span>
              )}
              {lowStock && !soldOut && (
                <span className="text-xs uppercase tracking-[0.1em] bg-amber-500 text-white px-3 py-1">
                  Low Stock
                </span>
              )}
            </div>
          </div>
        </Link>

        {/* Wishlist button */}
        <button
          onClick={() => toggle(product.id)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform shadow-sm"
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            size={15}
            className={wishlisted ? 'text-red-500 fill-red-500' : 'text-muted-foreground'}
          />
        </button>

        {/* Info */}
        <Link to={`/product/${product.slug}`}>
          <div className="pt-4 pb-2">
            <h3 className="font-serif text-lg font-medium text-foreground">{product.name}</h3>
            <p className="price-text mt-1">{formatPrice(product.pricePaise)}</p>
            {!soldOut && (
              <p className="text-xs text-muted-foreground mt-2">
                {lowStock
                  ? `Only ${Math.min(...availableSizes.map(s => s.stock))} left!`
                  : `Sizes: ${availableSizes.map(s => s.size).join(', ')}`}
              </p>
            )}
          </div>
        </Link>
      </div>
    </motion.div>
  );
}