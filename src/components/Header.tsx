import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, Search, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useWishlist } from '@/hooks/useWishlist';
import { getProducts } from '@/lib/api';

const navLinks = [
  { to: '/shop',           label: 'Shop' },
  { to: '/order-tracking', label: 'My Orders' },
  { to: '/about',          label: 'About' },
  { to: '/contact',        label: 'Contact' },
];

interface SearchProduct {
  id: string;
  name: string;
  slug: string;
  price_paise: number;
  images: string[];
}

export default function Header() {
  const { itemCount }             = useCart();
  const { wishlist }              = useWishlist();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchProduct[]>([]);
  const [allProducts, setAllProducts] = useState<SearchProduct[]>([]);
  const location  = useLocation();
  const navigate  = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  // Load products for search
  useEffect(() => {
    getProducts().then(data => setAllProducts(data || [])).catch(() => {});
  }, []);

  // Filter on query change
  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    const q = searchQuery.toLowerCase();
    setSearchResults(
      allProducts.filter(p => p.name.toLowerCase().includes(q)).slice(0, 5)
    );
  }, [searchQuery, allProducts]);

  // Close search on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setSearchQuery('');
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleSearchSelect(slug: string) {
    setSearchOpen(false);
    setSearchQuery('');
    navigate(`/product/${slug}`);
  }

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container-custom flex items-center justify-between h-16 md:h-20">

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-foreground"
          aria-label="Menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Logo */}
        <Link to="/" className="flex-1 flex justify-center md:flex-none md:justify-start">
          <h1 className="font-serif text-xl md:text-2xl font-semibold tracking-wide text-foreground">
            HM <span className="gold-text">Bangles</span>
          </h1>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link ${location.pathname === link.to ? 'gold-text' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right icons */}
        <div className="flex items-center gap-1 md:gap-2">

          {/* Search */}
          <div ref={searchRef} className="relative">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-foreground hover:text-primary transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            <AnimatePresence>
              {searchOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-72 bg-background border border-border shadow-lg"
                >
                  <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
                    <Search size={14} className="text-muted-foreground flex-shrink-0" />
                    <input
                      autoFocus
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search bangles..."
                      className="flex-1 text-sm bg-transparent outline-none"
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} className="text-muted-foreground hover:text-foreground">
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  {searchResults.length > 0 && (
                    <div>
                      {searchResults.map(product => (
                        <button
                          key={product.id}
                          onClick={() => handleSearchSelect(product.slug)}
                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted/50 transition-colors text-left"
                        >
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-10 h-10 object-cover flex-shrink-0"
                          />
                          <div>
                            <p className="text-sm font-medium">{product.name}</p>
                            <p className="text-xs text-muted-foreground">
                              ₹{(product.price_paise / 100).toFixed(0)}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {searchQuery && searchResults.length === 0 && (
                    <p className="px-3 py-4 text-sm text-muted-foreground text-center">
                      No bangles found for "{searchQuery}"
                    </p>
                  )}

                  {!searchQuery && (
                    <p className="px-3 py-4 text-xs text-muted-foreground text-center">
                      Type to search bangles...
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Wishlist */}
          <Link to="/wishlist" className="relative p-2 text-foreground hover:text-primary transition-colors" aria-label="Wishlist">
            <Heart size={20} />
            {wishlist.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-medium">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link to="/cart" className="relative p-2 text-foreground hover:text-primary transition-colors" aria-label="Cart">
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden border-t border-border bg-background"
          >
            <div className="container-custom py-4 flex flex-col gap-4">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`nav-link py-2 ${location.pathname === link.to ? 'gold-text' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
              {/* Mobile search */}
              <div className="flex items-center gap-2 border border-border px-3 py-2">
                <Search size={14} className="text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search bangles..."
                  className="flex-1 text-sm bg-transparent outline-none"
                  onChange={e => {
                    const q = e.target.value.toLowerCase();
                    setSearchResults(
                      q ? allProducts.filter(p => p.name.toLowerCase().includes(q)).slice(0, 5) : []
                    );
                  }}
                />
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}