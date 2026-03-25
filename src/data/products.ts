import product1 from '@/assets/product-1.jpg';
import product2 from '@/assets/product-2.jpg';

export const BANGLE_SIZES = ['2.2', '2.4', '2.6', '2.8', '2.10', '2.12'] as const;
export type BangleSize = typeof BANGLE_SIZES[number];

export const SHIPPING_PAISE = 9900;
export const WHATSAPP_NUMBER = '919427271597';
export const WHATSAPP_LINK = 'https://wa.me/919427271597';

export interface ProductSize {
  size: BangleSize;
  stock: number;
  isEnabled: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  pricePaise: number;
  images: string[];
  isActive: boolean;
  sizes: ProductSize[];
  isNew?: boolean;
}

export function formatPrice(paise: number): string {
  return `₹${(paise / 100).toLocaleString('en-IN')}`;
}

export function generateOrderNumber(): string {
  const d = new Date();
  const date = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  const rand = String(Math.floor(1000 + Math.random() * 9000));
  return `HMB-${date}-${rand}`;
}

export function isProductSoldOut(product: Product): boolean {
  return product.sizes.every(s => s.stock === 0 || !s.isEnabled);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug);
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Amber Glow',
    slug: 'amber-glow',
    description: 'A warm, translucent amber pair that captures golden hour light.',
    pricePaise: 34900,
    images: [product1],
    isActive: true,
    isNew: true,
    sizes: [
      { size: '2.2', stock: 12, isEnabled: true },
      { size: '2.4', stock: 8,  isEnabled: true },
      { size: '2.6', stock: 15, isEnabled: true },
      { size: '2.8', stock: 5,  isEnabled: true },
      { size: '2.10', stock: 0, isEnabled: false },
      { size: '2.12', stock: 3, isEnabled: true },
    ],
  },
  {
    id: '2',
    name: 'Rose Petal',
    slug: 'rose-petal',
    description: 'Soft blush pink with a delicate, feminine charm.',
    pricePaise: 34900,
    images: [product2],
    isActive: true,
    isNew: true,
    sizes: [
      { size: '2.2', stock: 15, isEnabled: true },
      { size: '2.4', stock: 20, isEnabled: true },
      { size: '2.6', stock: 18, isEnabled: true },
      { size: '2.8', stock: 12, isEnabled: true },
      { size: '2.10', stock: 9, isEnabled: true },
      { size: '2.12', stock: 6, isEnabled: true },
    ],
  },
];