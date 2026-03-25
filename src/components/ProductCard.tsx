import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { type Product, formatPrice, isProductSoldOut } from '@/data/products';

interface Props {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: Props) {
  const soldOut = isProductSoldOut(product);
  const availableSizes = product.sizes.filter(s => s.stock > 0 && s.isEnabled);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={`/product/${product.slug}`} className="block product-card group">
        <div className="relative overflow-hidden bg-cream-dark aspect-[4/5]">
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="product-image w-full h-full object-cover"
          />
          {soldOut && (
            <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
              <span className="section-subheading text-muted-foreground">Sold Out</span>
            </div>
          )}
          {product.isNew && !soldOut && (
            <span className="absolute top-3 left-3 text-xs uppercase tracking-[0.15em] bg-primary text-primary-foreground px-3 py-1">
              New
            </span>
          )}
        </div>
        <div className="pt-4 pb-2">
          <h3 className="font-serif text-lg font-medium text-foreground">{product.name}</h3>
          <p className="price-text mt-1">{formatPrice(product.pricePaise)}</p>
          {!soldOut && (
            <p className="text-xs text-muted-foreground mt-2">
              Sizes: {availableSizes.map(s => s.size).join(', ')}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
