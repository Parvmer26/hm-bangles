import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, MessageCircle, Truck, ArrowLeft } from 'lucide-react';
import { formatPrice, WHATSAPP_LINK, BANGLE_SIZES, type BangleSize } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { getProductBySlug } from '@/lib/api';
import { toast } from 'sonner';

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

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<BangleSize | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    async function loadProduct() {
      if (!slug) return;
      try {
        setLoading(true);
        const data = await getProductBySlug(slug);
        setProduct(data);
      } catch (err) {
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [slug]);

  // Loading state
  if (loading) {
    return (
      <div className="container-custom py-8 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          <div className="aspect-[4/5] bg-muted animate-pulse rounded" />
          <div className="space-y-4">
            <div className="h-8 bg-muted animate-pulse rounded w-3/4" />
            <div className="h-6 bg-muted animate-pulse rounded w-1/4" />
            <div className="h-24 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </div>
    );
  }

  // Error / not found state
  if (error || !product) {
    return (
      <div className="container-custom py-20 text-center">
        <h1 className="section-heading mb-4">Product Not Found</h1>
        <Link to="/shop" className="btn-gold inline-block">Back to Shop</Link>
      </div>
    );
  }

  const soldOut = product.product_sizes.every(
    s => s.stock === 0 || !s.is_enabled
  );

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    addItem({
      productId: product.id,
      name: product.name,
      size: selectedSize,
      pricePaise: product.price_paise,
      image: product.images[0],
    });
    toast.success(`${product.name} (${selectedSize}) added to cart`);
  };

  return (
    <div className="container-custom py-8 md:py-16">
      <Link
        to="/shop"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
      >
        <ArrowLeft size={14} /> Back to Shop
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">

        {/* Images */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Main image */}
          <div className="aspect-[4/5] overflow-hidden bg-cream-dark mb-3">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnails — only show if more than 1 image */}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`flex-shrink-0 w-16 h-16 overflow-hidden border transition-colors ${
                    selectedImage === i
                      ? 'border-primary'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col"
        >
          <h1 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-2">
            {product.name}
          </h1>
          <p className="price-text text-xl mb-6">
            {formatPrice(product.price_paise)}
          </p>
          <p className="text-muted-foreground leading-relaxed mb-8">
            {product.description}
          </p>

          {/* Size selector */}
          <div className="mb-8">
            <p className="section-subheading mb-3">Select Size</p>
            <div className="flex flex-wrap gap-2">
              {BANGLE_SIZES.map(size => {
                const sizeData = product.product_sizes.find(
                  s => s.size === size
                );
                const outOfStock =
                  !sizeData || sizeData.stock === 0 || !sizeData.is_enabled;
                return (
                  <button
                    key={size}
                    disabled={outOfStock}
                    onClick={() => setSelectedSize(size)}
                    className={`w-14 h-14 border text-sm transition-all duration-300 ${
                      outOfStock
                        ? 'border-border text-muted-foreground/40 line-through cursor-not-allowed'
                        : selectedSize === size
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'border-border text-foreground hover:border-primary'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
            {!selectedSize && !soldOut && (
              <p className="text-xs text-muted-foreground mt-2">
                Please select a size to add to cart
              </p>
            )}
          </div>

          {/* Actions */}
          {!soldOut && (
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                className="btn-gold flex items-center justify-center gap-2 flex-1"
              >
                <ShoppingBag size={16} /> Add to Cart
              </button>
              <Link
                to="/cart"
                onClick={handleAddToCart}
                className="btn-outline-gold flex items-center justify-center gap-2 flex-1"
              >
                Buy Now
              </Link>
            </div>
          )}

          {soldOut && (
            <p className="section-subheading text-destructive mb-8">
              Currently Sold Out
            </p>
          )}

          {/* Info */}
          <div className="border-t border-border pt-6 space-y-4">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Truck size={16} />
              <span>Flat ₹99 shipping · 3–6 business days</span>
            </div>
            <a
              href={`${WHATSAPP_LINK}?text=${encodeURIComponent(
                `Hi! I have a question about ${product.name}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <MessageCircle size={16} />
              <span>Questions? Chat on WhatsApp</span>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}