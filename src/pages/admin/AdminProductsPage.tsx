import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, Upload } from 'lucide-react';
import { formatPrice, BANGLE_SIZES } from '@/data/products';
import { getAllProducts, toggleProductActive, updateSizeStock, updateProductPrice } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface ProductSize { size: string; stock: number; is_enabled: boolean; }
interface Product { id: string; name: string; slug: string; description: string; price_paise: number; images: string[]; is_active: boolean; product_sizes: ProductSize[]; }

export default function AdminProductsPage() {
  const [products, setProducts]           = useState<Product[]>([]);
  const [loading, setLoading]             = useState(true);
  const [editingPrice, setEditingPrice]   = useState<string | null>(null);
  const [newPrice, setNewPrice]           = useState('');
  const [editingStock, setEditingStock]   = useState<{productId:string;size:string}|null>(null);
  const [newStock, setNewStock]           = useState('');
  const [showAddForm, setShowAddForm]     = useState(false);
  const [uploading, setUploading]         = useState(false);

  const [form, setForm] = useState({
    name: '', slug: '', description: '', price: '', image: ''
  });

  const [deleteTarget, setDeleteTarget] = useState<{id:string; name:string} | null>(null);

  useEffect(() => {
  loadProducts();

  const channel = supabase
    .channel('product-sizes-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'product_sizes',
      },
      () => {
        loadProducts(); // 🔥 auto refresh when DB changes
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);

  async function loadProducts() {
    try {
      setLoading(true);
      const data = await getAllProducts();
      setProducts(data || []);
    } catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  }

  async function handleToggleActive(id: string, current: boolean) {
    try {
      await toggleProductActive(id, !current);
      setProducts(prev => prev.map(p => p.id === id ? { ...p, is_active: !current } : p));
      toast.success(`Product ${!current ? 'activated' : 'deactivated'}`);
    } catch { toast.error('Failed to update'); }
  }

  async function handleSavePrice(productId: string) {
    const paise = Math.round(parseFloat(newPrice) * 100);
    if (isNaN(paise) || paise < 20000 || paise > 50000) {
      toast.error('Price must be between ₹200 and ₹500'); return;
    }
    try {
      await updateProductPrice(productId, paise);
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, price_paise: paise } : p));
      setEditingPrice(null);
      toast.success('Price updated');
    } catch { toast.error('Failed to update price'); }
  }

 async function handleSaveStock(productId: string, size: string) {
  const stock = parseInt(newStock);

  if (isNaN(stock) || stock < 0) {
    toast.error('Invalid stock number');
    return;
  }

  try {
    // ✅ DB update
    await updateSizeStock(productId, size, stock);

    // ✅ INSTANT UI UPDATE (handles missing sizes too)
    setProducts(prev =>
      prev.map(p => {
        if (p.id !== productId) return p;

        const existingSizes = p.product_sizes || [];

        const updatedSizes = existingSizes.some(s => s.size === size)
          ? existingSizes.map(s =>
              s.size === size
                ? { ...s, stock, is_enabled: stock > 0 }
                : s
            )
          : [
              ...existingSizes,
              { size, stock, is_enabled: stock > 0 }
            ];

        return {
          ...p,
          product_sizes: updatedSizes,
        };
      })
    );

    setEditingStock(null);
    toast.success('Stock updated');

  } catch (err) {
    console.error(err);
    toast.error('Failed to update stock');
  }
}

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const ext      = file.name.split('.').pop();
      const fileName = `${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from('products').upload(fileName, file);
      if (error) throw error;
      const { data } = supabase.storage.from('products').getPublicUrl(fileName);
      setForm(f => ({ ...f, image: data.publicUrl }));
      toast.success('Image uploaded!');
    } catch { toast.error('Image upload failed'); }
    finally { setUploading(false); }
  }

  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();
    const paise = Math.round(parseFloat(form.price) * 100);
    if (!form.name || !form.slug || !form.description || !form.image) {
      toast.error('Fill all fields and upload an image'); return;
    }
    if (isNaN(paise) || paise < 20000 || paise > 50000) {
      toast.error('Price must be between ₹200 and ₹500'); return;
    }
    try {
      const { data: newProduct, error } = await supabase
        .from('products')
        .insert({ name: form.name, slug: form.slug, description: form.description, price_paise: paise, images: [form.image], is_active: true })
        .select('id').single();
      if (error) throw error;

      await supabase.from('product_sizes').insert(
        BANGLE_SIZES.map(size => ({ product_id: newProduct.id, size, stock: 0, is_enabled: false }))
      );

      toast.success('Product added! Update stock for each size.');
      setForm({ name: '', slug: '', description: '', price: '', image: '' });
      setShowAddForm(false);
      loadProducts();
    } catch (err: any) {
      toast.error(err.message || 'Failed to add product');
    }
  }

 function handleDeleteProduct(id: string, name: string) {
  setDeleteTarget({ id, name });
}

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl font-medium">Products</h1>
        <button onClick={() => setShowAddForm(!showAddForm)} className="btn-gold text-xs py-2 px-4 flex items-center gap-2">
          <Plus size={14} /> Add Product
        </button>
      </div>

      {/* Add product form */}
      {showAddForm && (
        <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}
          className="border border-border bg-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg font-medium">New Product</h2>
            <button onClick={() => setShowAddForm(false)}><X size={18} /></button>
          </div>
          <form onSubmit={handleAddProduct} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs uppercase tracking-wide text-muted-foreground mb-1 block">Product Name</label>
                <input value={form.name} onChange={e => setForm(f=>({...f, name:e.target.value}))}
                  className="w-full px-3 py-2 border border-border bg-background text-sm focus:outline-none focus:border-primary"
                  placeholder="e.g. Amber Glow" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide text-muted-foreground mb-1 block">Slug (URL)</label>
                <input value={form.slug} onChange={e => setForm(f=>({...f, slug:e.target.value.toLowerCase().replace(/\s+/g,'-')}))}
                  className="w-full px-3 py-2 border border-border bg-background text-sm focus:outline-none focus:border-primary"
                  placeholder="e.g. amber-glow" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide text-muted-foreground mb-1 block">Price (₹)</label>
                <input type="number" value={form.price} onChange={e => setForm(f=>({...f, price:e.target.value}))}
                  className="w-full px-3 py-2 border border-border bg-background text-sm focus:outline-none focus:border-primary"
                  placeholder="e.g. 299" min="200" max="500" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide text-muted-foreground mb-1 block">Product Image</label>
                <div className="flex gap-2 items-center">
                  <label className="btn-outline-gold text-xs py-2 px-3 cursor-pointer flex items-center gap-1">
                    <Upload size={12} /> {uploading ? 'Uploading...' : 'Upload Image'}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                  {form.image && <img src={form.image} alt="preview" className="w-10 h-10 object-cover border border-border" />}
                </div>
              </div>
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-muted-foreground mb-1 block">Description</label>
              <textarea value={form.description} onChange={e => setForm(f=>({...f, description:e.target.value}))}
                className="w-full px-3 py-2 border border-border bg-background text-sm focus:outline-none focus:border-primary resize-none"
                rows={3} placeholder="Describe the bangle..." />
            </div>
            <p className="text-xs text-muted-foreground">Stock for each size will default to 0. Update stock after adding.</p>
            <button type="submit" className="btn-gold text-xs py-2 px-6">Add Product</button>
          </form>
        </motion.div>
      )}

      {/* Products list */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_,i) => (
            <div key={i} className="border border-border p-6 animate-pulse">
              <div className="flex gap-4"><div className="w-16 h-20 bg-muted rounded" /><div className="flex-1 space-y-3"><div className="h-4 bg-muted rounded w-1/3" /><div className="h-3 bg-muted rounded w-1/4" /></div></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product, i) => (
            <motion.div key={product.id}
              initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
              transition={{ delay: i*0.05 }}
              className="border border-border bg-card p-4 md:p-6"
            >
              <div className="flex gap-4">
                <div className="w-16 h-20 flex-shrink-0 bg-muted overflow-hidden">
                  {product.images[0] && <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-serif text-lg font-medium">{product.name}</h3>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button onClick={() => handleToggleActive(product.id, product.is_active)}
                        className={`text-xs px-2 py-1 rounded transition-colors ${product.is_active ? 'bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700' : 'bg-red-100 text-red-700 hover:bg-green-100 hover:text-green-700'}`}>
                        {product.is_active ? 'Active' : 'Inactive'}
                      </button>
                      <button onClick={() => handleDeleteProduct(product.id, product.name)}
                        className="text-xs px-2 py-1 rounded bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Price edit */}
                  <div className="flex items-center gap-2 mb-4">
                    {editingPrice === product.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm">₹</span>
                        <input type="number" value={newPrice} onChange={e => setNewPrice(e.target.value)}
                          className="w-20 border border-border px-2 py-1 text-sm focus:outline-none focus:border-primary" />
                        <button onClick={() => handleSavePrice(product.id)} className="text-xs btn-gold py-1 px-3">Save</button>
                        <button onClick={() => setEditingPrice(null)} className="text-xs text-muted-foreground hover:text-foreground">Cancel</button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="price-text">{formatPrice(product.price_paise)}</span>
                        <button onClick={() => { setEditingPrice(product.id); setNewPrice(String(product.price_paise/100)); }}
                          className="text-xs text-muted-foreground hover:text-primary underline">Edit price</button>
                      </div>
                    )}
                  </div>

                  {/* Stock per size */}
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Stock by Size — click number to edit</p>
                    <div className="flex flex-wrap gap-2">
                      {BANGLE_SIZES.map(size => {
                        const sd = product.product_sizes.find(s => s.size === size);
                        const isEditing = editingStock?.productId === product.id && editingStock?.size === size;
                        return (
                          <div key={size} className="border border-border text-center px-2 py-2 text-xs min-w-[56px]">
                            <div className="font-medium mb-1">{size}</div>
                            {isEditing ? (
                              <div className="flex flex-col gap-1">
                                <input type="number" value={newStock} onChange={e => setNewStock(e.target.value)}
                                  className="w-12 border border-border px-1 py-0.5 text-xs text-center focus:outline-none" min="0" autoFocus />
                                <button onClick={() => handleSaveStock(product.id, size, sd?.is_enabled ?? true)}
                                  className="text-[10px] text-primary hover:underline">Save</button>
                                <button onClick={() => setEditingStock(null)}
                                  className="text-[10px] text-muted-foreground hover:underline">Cancel</button>
                              </div>
                            ) : (
                              <button onClick={() => { setEditingStock({productId:product.id,size}); setNewStock(String(sd?.stock||0)); }}
                                className={`block w-full text-center hover:text-primary transition-colors ${sd && sd.stock > 0 && sd.is_enabled ? 'text-foreground' : 'text-muted-foreground/40'}`}>
                                {sd?.stock || 0}
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          {products.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p className="mb-2">No products yet.</p>
              <p className="text-sm">Click "Add Product" to add your first bangle.</p>
            </div>
          )}
        </div>
      )}

      {deleteTarget && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-card border border-border rounded-lg p-6 w-full max-w-sm">
      <h3 className="font-medium text-lg mb-2">Delete Product</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Are you sure you want to delete "<b>{deleteTarget.name}</b>"?
      </p>

      <div className="flex justify-end gap-2">
        <button
          onClick={() => setDeleteTarget(null)}
          className="text-sm px-4 py-2 border border-border rounded hover:bg-muted"
        >
          Cancel
        </button>

        <button
          onClick={async () => {
            try {
              await supabase
                .from('products')
                .delete()
                .eq('id', deleteTarget.id);

              setProducts(prev =>
                prev.filter(p => p.id !== deleteTarget.id)
              );

              toast.success('Product deleted');
              setDeleteTarget(null);
            } catch (err) {
              console.error(err);
              toast.error('Failed to delete');
            }
          }}
          className="text-sm px-4 py-2 bg-destructive text-white rounded hover:opacity-90"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}