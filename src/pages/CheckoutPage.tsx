import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { formatPrice, SHIPPING_PAISE, generateOrderNumber } from '@/data/products';
import { INDIAN_STATES } from '@/data/states';
import { createOrder } from '@/lib/api';
import { toast } from 'sonner';
import { z } from 'zod';

const checkoutSchema = z.object({
  fullName:     z.string().trim().min(2, 'Name is required').max(100),
  phone:        z.string().regex(/^[6-9]\d{9}$/, 'Enter valid 10-digit Indian phone number'),
  addressLine1: z.string().trim().min(5, 'Address is required').max(200),
  addressLine2: z.string().max(200).optional(),
  city:         z.string().trim().min(2, 'City is required').max(100),
  state:        z.string().min(2, 'Select a state'),
  pincode:      z.string().regex(/^\d{6}$/, 'Enter valid 6-digit pincode'),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { items, subtotalPaise, clearCart } = useCart();
  const navigate    = useNavigate();
  const totalPaise  = subtotalPaise + SHIPPING_PAISE;
  const [errors, setErrors]   = useState<Partial<Record<keyof CheckoutForm, string>>>({});
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<CheckoutForm>({
    fullName:     '',
    phone:        '',
    addressLine1: '',
    addressLine2: '',
    city:         '',
    state:        'Gujarat',
    pincode:      '',
  });

  const updateField = (field: keyof CheckoutForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const result = checkoutSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof CheckoutForm, string>> = {};
      result.error.errors.forEach(err => {
        const field = err.path[0] as keyof CheckoutForm;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    try {
      const orderNumber = generateOrderNumber();

      // Save order to Supabase
      await createOrder({
        orderNumber,
        subtotalPaise,
        shippingPaise: SHIPPING_PAISE,
        totalPaise,
        customerName:  form.fullName,
        customerPhone: form.phone,
        addressLine1:  form.addressLine1,
        addressLine2:  form.addressLine2,
        city:          form.city,
        state:         form.state,
        pincode:       form.pincode,
        items: items.map(item => ({
          productId:   item.productId,
          productName: item.name,
          size:        item.size,
          pricePaise:  item.pricePaise,
        })),
      });

      // Clear cart and redirect to success page with all order info
      clearCart();

      // Pass order details via URL params for receipt
      const params = new URLSearchParams({
        order:    orderNumber,
        name:     form.fullName,
        phone:    form.phone,
        address:  `${form.addressLine1}${form.addressLine2 ? ', ' + form.addressLine2 : ''}, ${form.city}, ${form.state} - ${form.pincode}`,
        total:    totalPaise.toString(),
        items:    JSON.stringify(items.map(i => ({ name: i.name, size: i.size, price: i.pricePaise }))),
      });

      localStorage.setItem('lastOrderId', orderNumber);
localStorage.setItem('lastOrderPhone', form.phone);
      navigate(`/order-success?${params.toString()}`);
      toast.success('Order placed successfully!');

    } catch (err) {
      console.error('Order creation failed:', err);
      toast.error('Failed to place order. Please try again or contact us on WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const inputClass = (field: keyof CheckoutForm) =>
    `w-full px-4 py-3 border bg-background text-foreground text-sm transition-colors duration-200 focus:outline-none focus:border-primary ${
      errors[field] ? 'border-destructive' : 'border-border'
    }`;

  return (
    <div className="container-custom py-12 md:py-20">
      <h1 className="section-heading mb-10">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Shipping form */}
          <motion.div
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="font-serif text-xl font-medium text-foreground mb-4">Shipping Details</h2>

            <div>
              <label className="text-xs uppercase tracking-[0.1em] text-muted-foreground mb-1 block">Full Name *</label>
              <input type="text" value={form.fullName}
                onChange={e => updateField('fullName', e.target.value)}
                className={inputClass('fullName')} placeholder="Your full name" />
              {errors.fullName && <p className="text-xs text-destructive mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <label className="text-xs uppercase tracking-[0.1em] text-muted-foreground mb-1 block">Phone Number *</label>
              <input type="tel" value={form.phone}
                onChange={e => updateField('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                className={inputClass('phone')} placeholder="10-digit mobile number" />
              {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="text-xs uppercase tracking-[0.1em] text-muted-foreground mb-1 block">Address Line 1 *</label>
              <input type="text" value={form.addressLine1}
                onChange={e => updateField('addressLine1', e.target.value)}
                className={inputClass('addressLine1')} placeholder="House/flat number, street" />
              {errors.addressLine1 && <p className="text-xs text-destructive mt-1">{errors.addressLine1}</p>}
            </div>

            <div>
              <label className="text-xs uppercase tracking-[0.1em] text-muted-foreground mb-1 block">Address Line 2</label>
              <input type="text" value={form.addressLine2}
                onChange={e => updateField('addressLine2', e.target.value)}
                className={inputClass('addressLine2')} placeholder="Landmark, area (optional)" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs uppercase tracking-[0.1em] text-muted-foreground mb-1 block">City *</label>
                <input type="text" value={form.city}
                  onChange={e => updateField('city', e.target.value)}
                  className={inputClass('city')} placeholder="City" />
                {errors.city && <p className="text-xs text-destructive mt-1">{errors.city}</p>}
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.1em] text-muted-foreground mb-1 block">State *</label>
                <select value={form.state}
                  onChange={e => updateField('state', e.target.value)}
                  className={inputClass('state')}>
                  {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.1em] text-muted-foreground mb-1 block">Pincode *</label>
                <input type="text" value={form.pincode}
                  onChange={e => updateField('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className={inputClass('pincode')} placeholder="6-digit pincode" />
                {errors.pincode && <p className="text-xs text-destructive mt-1">{errors.pincode}</p>}
              </div>
            </div>

            <div className="border-t border-border pt-6 mt-6">
              <h2 className="font-serif text-xl font-medium text-foreground mb-2">Payment</h2>
              <div className="bg-amber-50 border border-amber-200 p-4 rounded">
                <p className="text-sm font-medium text-amber-800 mb-1">Payment gateway coming soon</p>
                <p className="text-xs text-amber-700">
                  Your order will be confirmed. Our team will contact you on WhatsApp
                  to collect payment via UPI/bank transfer before dispatch.
                </p>
              </div>
              <p className="text-xs text-muted-foreground mt-3 uppercase tracking-wide">
                Prepaid only — No COD
              </p>
            </div>
          </motion.div>

          {/* Order summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="h-fit"
          >
            <div className="bg-cream-dark p-6 md:p-8">
              <h2 className="font-serif text-xl font-medium text-foreground mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                {items.map(item => (
                  <div key={`${item.productId}-${item.size}`} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.name} ({item.size})</span>
                    <span className="text-foreground">{formatPrice(item.pricePaise)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotalPaise)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>{formatPrice(SHIPPING_PAISE)}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between font-medium text-foreground text-base">
                  <span>Total</span>
                  <span className="price-text">{formatPrice(totalPaise)}</span>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-gold w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
              {loading && (
                <p className="text-xs text-center text-muted-foreground mt-2">
                  Saving your order...
                </p>
              )}
            </div>
          </motion.div>

        </div>
      </form>
    </div>
  );
}