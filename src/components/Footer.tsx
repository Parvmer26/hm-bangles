import { Link } from 'react-router-dom';
import { WHATSAPP_LINK } from '@/data/products';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-cream-dark">
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="font-serif text-2xl font-semibold text-foreground mb-2">
              HM <span className="gold-text">Bangles</span>
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Crafted in Rajkot, Gujarat
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="section-subheading mb-4">Shop</h4>
            <div className="flex flex-col gap-2">
              <Link to="/shop" className="text-sm text-muted-foreground hover:text-primary transition-colors">All Bangles</Link>
              <Link to="/shop" className="text-sm text-muted-foreground hover:text-primary transition-colors">New Arrivals</Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="section-subheading mb-4">Company</h4>
            <div className="flex flex-col gap-2">
              <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About</Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link>
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">WhatsApp</a>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="section-subheading mb-4">Legal</h4>
            <div className="flex flex-col gap-2">
              <Link to="/shipping-returns" className="text-sm text-muted-foreground hover:text-primary transition-colors">Shipping & Returns</Link>
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-xs text-muted-foreground tracking-wide">
            © {new Date().getFullYear()} HM Bangles. Rajkot, Gujarat.
          </p>
        </div>
      </div>
    </footer>
  );
}
