import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import ProductCard from '@/components/ProductCard';
import { getProducts } from '@/lib/api';
import type { BangleSize } from '@/data/products';

interface SupabaseProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price_paise: number;
  images: string[];
  is_active: boolean;
  product_sizes: { size: string; stock: number; is_enabled: boolean }[];
}

export default function WishlistPage() {
  const { wishlist }                = useWishlist();
  const [allProducts, setAllProducts] = useState<SupabaseProduct[]>([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    getProducts()
      .then(data => setAllProducts(data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const wishlisted = allProducts.filter(p => wishlist.includes(p.id));

  const toCardFormat = (p: SupabaseProduct) => ({
    id:          p.id,
    name:        p.name,
    slug:        p.slug,
    description: p.description,
    pricePaise:  p.price_paise,
    images:      p.images,
    isActive:    p.is_active,
    isNew:       false,
    sizes:       p.product_sizes.map(s => ({
      size:      s.size as BangleSize,
      stock:     s.stock,
      isEnabled: s.is_enabled,
    })),
  });

  return (
    <div className="container-custom py-16 min-h-[60vh]">
      <div className="mb-10">
        <p className="section-subheading mb-2">Saved items</p>
        <h1 className="section-heading text-3xl md:text-4xl">
          Your Wishlist
          {wishlist.length > 0 && (
            <span className="ml-3 text-base font-normal text-muted-foreground font-sans">
              ({wishlist.length} {wishlist.length === 1 ? 'item' : 'items'})
            </span>
          )}
        </h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/5] bg-muted rounded mb-3" />
              <div className="h-4 bg-muted rounded mb-2 w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : wishlist.length === 0 ? (
        <div className="text-center py-20">
          <Heart size={40} className="text-muted-foreground mx-auto mb-4" />
          <p className="font-serif text-xl mb-2">Your wishlist is empty</p>
          <p className="text-sm text-muted-foreground mb-6">
            Tap the heart icon on any product to save it here.
          </p>
          <Link to="/shop" className="btn-gold inline-block">Browse Bangles</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {wishlisted.map((product, i) => (
            <ProductCard key={product.id} product={toCardFormat(product)} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}