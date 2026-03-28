import { supabase } from './supabase'

export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*, product_sizes(size, stock, is_enabled)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getProductCount() {
  const { count, error } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);
  if (error) throw error;
  return count || 0;
}

export async function getProductBySlug(slug: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*, product_sizes(size, stock, is_enabled)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
  if (error) throw error
  return data
}

export async function getOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(product_name, size, price_paise)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function updateOrderStatus(orderId: string, status: string) {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId);

  if (error) {
    console.error('UPDATE ERROR:', error);
    throw error;
  }
}

export async function getAllProducts() {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      slug,
      description,
      price_paise,
      images,
      is_active,
      created_at,
      updated_at,
      product_sizes (
        size,
        stock,
        is_enabled
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // 🔥 Ensure product_sizes always exists
  const safeData = (data || []).map(product => ({
    ...product,
    product_sizes: product.product_sizes || [],
  }));

  return safeData;
}

export async function toggleProductActive(id: string, isActive: boolean) {
  const { error } = await supabase
    .from('products')
    .update({ is_active: isActive })
    .eq('id', id)
  if (error) throw error
}

export async function updateProductPrice(id: string, pricePaise: number) {
  const { error } = await supabase
    .from('products')
    .update({ price_paise: pricePaise })
    .eq('id', id)
  if (error) throw error
}

export async function updateSizeStock(
  productId: string,
  size: string,
  stock: number
) {
  const { error } = await supabase
    .from('product_sizes')
    .upsert(
      {
        product_id: productId,
        size: size,
        stock: stock,
        is_enabled: stock > 0,
      },
      { onConflict: 'product_id,size' }
    );

  if (error) throw error;
}

export async function createOrder(order: {
  orderNumber: string
  subtotalPaise: number
  shippingPaise: number
  totalPaise: number
  customerName: string
  customerPhone: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  pincode: string
  items: {
    productId: string
    productName: string
    size: string
    pricePaise: number
  }[]
}) {
  const { data: newOrder, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_number:   order.orderNumber,
      status:         'confirmed',
      subtotal_paise: order.subtotalPaise,
      shipping_paise: order.shippingPaise,
      total_paise:    order.totalPaise,
      customer_name:  order.customerName,
      customer_phone: order.customerPhone,
      address_line1:  order.addressLine1,
      address_line2:  order.addressLine2 || null,
      city:           order.city,
      state:          order.state,
      pincode:        order.pincode,
    })
    .select('id')
    .single()

  if (orderError || !newOrder) throw orderError

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(
      order.items.map(item => ({
        order_id:     newOrder.id,
        product_id:   item.productId,
        product_name: item.productName,
        size:         item.size,
        price_paise:  item.pricePaise,
      }))
    )

  if (itemsError) throw itemsError
  return newOrder.id
}