import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice, SHIPPING_PAISE } from '@/data/products';

export default function CartPage() {
  const { items, removeItem, subtotalPaise } = useCart();
  const totalPaise = subtotalPaise + (items.length > 0 ? SHIPPING_PAISE : 0);

  if (items.length === 0) {
    return (
      <div className="container-custom py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <ShoppingBag size={48} className="mx-auto mb-6 text-muted-foreground" />
          <h1 className="section-heading mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">Discover our handcrafted acrylic bangles</p>
          <Link to="/shop" className="btn-gold inline-block">Browse Shop</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container-custom py-12 md:py-20">
      <h1 className="section-heading mb-10">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Items */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item, i) => (
            <motion.div
              key={`${item.productId}-${item.size}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-4 md:gap-6 border-b border-border pb-6"
            >
              <div className="w-20 h-24 md:w-28 md:h-32 flex-shrink-0 bg-cream-dark overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-lg font-medium text-foreground">{item.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">Size: {item.size}</p>
                </div>
                <p className="price-text">{formatPrice(item.pricePaise)}</p>
              </div>
              <button
                onClick={() => removeItem(item.productId, item.size)}
                className="self-start p-2 text-muted-foreground hover:text-destructive transition-colors"
                aria-label="Remove item"
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-cream-dark p-6 md:p-8 h-fit">
          <h2 className="font-serif text-xl font-medium text-foreground mb-6">Order Summary</h2>
          <div className="space-y-3 text-sm mb-6">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal ({items.length} item{items.length > 1 ? 's' : ''})</span>
              <span>{formatPrice(subtotalPaise)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span>
              <span>{formatPrice(SHIPPING_PAISE)}</span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between font-medium text-foreground">
              <span>Total</span>
              <span className="price-text text-base">{formatPrice(totalPaise)}</span>
            </div>
          </div>
          <Link to="/checkout" className="btn-gold w-full flex items-center justify-center gap-2">
            Proceed to Checkout <ArrowRight size={14} />
          </Link>
          <p className="text-xs text-muted-foreground text-center mt-4">Prepaid only · No COD</p>
        </div>
      </div>
    </div>
  );
}
