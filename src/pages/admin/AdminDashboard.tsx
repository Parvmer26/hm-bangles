import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, ShoppingBag, Users, TrendingUp } from 'lucide-react';
import { getOrders, getProductCount } from '@/lib/api';
import { Link } from 'react-router-dom';
import { useRealtimeOrders } from '@/hooks/useRealtimeOrders';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const statusColors: Record<string, string> = {
  pending:   'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  packed:    'bg-purple-100 text-purple-700',
  shipped:   'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

function getMonthlyData(orders: any[]) {
  const months: Record<string, { month: string; revenue: number; orders: number }> = {};
  const now = new Date();
  for (let i = 7; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = d.toLocaleString('en-IN', { month: 'short' });
    months[key] = { month: key, revenue: 0, orders: 0 };
  }
  orders.forEach(o => {
    if (['pending','cancelled'].includes(o.status)) return;
    const key = new Date(o.created_at).toLocaleString('en-IN', { month: 'short' });
    if (months[key]) {
      months[key].revenue += o.total_paise / 100;
      months[key].orders  += 1;
    }
  });
  return Object.values(months);
}

function getTopProducts(orders: any[]) {
  const counts: Record<string, { name: string; image: string; sales: number }> = {};
  orders.forEach(o => {
    (o.order_items || []).forEach((item: any) => {
      if (!counts[item.product_name]) {
        counts[item.product_name] = { name: item.product_name, image: '', sales: 0 };
      }
      counts[item.product_name].sales += 1;
    });
  });
  return Object.values(counts).sort((a, b) => b.sales - a.sales).slice(0, 3);
}

export default function AdminDashboard() {
  const [orders, setOrders]           = useState<any[]>([]);
  const [productCount, setProductCount] = useState(0);
  const [loading, setLoading]         = useState(true);

  async function loadData() {
    try {
      const [ordersData, count] = await Promise.all([getOrders(), getProductCount()]);
      setOrders(ordersData || []);
      setProductCount(count);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);
  useRealtimeOrders(loadData);

  const today      = new Date().toDateString();
  const thisWeek   = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const newToday   = orders.filter(o => new Date(o.created_at).toDateString() === today).length;
  const newWeek    = orders.filter(o => new Date(o.created_at) >= thisWeek).length;
  const totalCust  = new Set(orders.map(o => o.customer_phone)).size;
  const revenue    = orders.filter(o => !['pending','cancelled'].includes(o.status)).reduce((s, o) => s + o.total_paise, 0);
  const chartData  = getMonthlyData(orders);
  const topProducts = getTopProducts(orders);

  const stats = [
    { label: 'Total Products', value: productCount, sub: 'In catalogue',         icon: Package,     color: 'bg-violet-100 text-violet-600' },
    { label: 'New Orders',     value: newToday,     sub: `+${newWeek} This Week`, icon: ShoppingBag, color: 'bg-green-100 text-green-600' },
    { label: 'Total Customers',value: totalCust,    sub: `+0 This Week`,          icon: Users,       color: 'bg-orange-100 text-orange-600' },
    { label: 'Total Revenue',  value: `₹${(revenue/100).toLocaleString('en-IN')}`, sub: 'Delivered orders', icon: TrendingUp, color: 'bg-pink-100 text-pink-600' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-medium text-foreground">Welcome, Admin</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your HM Bangles store</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div key={stat.label}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="border border-border bg-card p-5 rounded-lg"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon size={20} />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {loading ? <span className="animate-pulse bg-muted rounded w-16 h-6 inline-block" /> : stat.value}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            <p className="text-xs text-green-600 mt-0.5">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Chart + Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

        {/* Revenue Chart */}
        <div className="lg:col-span-2 border border-border bg-card p-6 rounded-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-lg font-medium">Sales Overview</h2>
            <span className="text-xs text-muted-foreground border border-border px-3 py-1 rounded-full">Last 8 Months</span>
          </div>
          {loading ? (
            <div className="h-48 bg-muted animate-pulse rounded" />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(val: number, name: string) => [name === 'revenue' ? `₹${val.toLocaleString('en-IN')}` : val, name === 'revenue' ? 'Revenue' : 'Orders']} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#7c3aed" strokeWidth={2} dot={{ r: 4 }} name="Revenue (₹)" />
                <Line type="monotone" dataKey="orders"  stroke="#a78bfa" strokeWidth={1.5} dot={{ r: 3 }} strokeDasharray="4 4" name="Orders" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top Products */}
        <div className="border border-border bg-card p-6 rounded-lg">
          <h2 className="font-serif text-lg font-medium mb-4">Top Products</h2>
          {loading ? (
            <div className="space-y-3">{[...Array(3)].map((_,i) => <div key={i} className="h-12 bg-muted animate-pulse rounded" />)}</div>
          ) : topProducts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No sales data yet.</p>
          ) : (
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package size={16} className="text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.sales} units sold</p>
                  </div>
                  <span className="text-xs bg-violet-100 text-violet-700 px-2 py-1 rounded-full flex-shrink-0">{p.sales} Sales</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders + New Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Orders */}
        <div className="lg:col-span-2 border border-border bg-card rounded-lg overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <h2 className="font-serif text-lg font-medium">Recent Orders</h2>
            <Link to="/admin/orders" className="text-xs text-violet-600 hover:underline">View All</Link>
          </div>
          {loading ? (
            <div className="p-5"><div className="h-32 bg-muted animate-pulse rounded" /></div>
          ) : orders.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">No orders yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/30">
                    {['Order','Customer','Total','Status','Date'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map(order => (
                    <tr key={order.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-violet-600">{order.order_number}</td>
                      <td className="px-4 py-3 font-medium">{order.customer_name}</td>
                      <td className="px-4 py-3 font-medium">₹{(order.total_paise/100).toFixed(0)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full capitalize ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">
                        {new Date(order.created_at).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* New Customers */}
        <div className="border border-border bg-card rounded-lg overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <h2 className="font-serif text-lg font-medium">New Customers</h2>
            <span className="text-xs text-muted-foreground">This week</span>
          </div>
          {loading ? (
            <div className="p-5 space-y-3">{[...Array(4)].map((_,i) => <div key={i} className="h-10 bg-muted animate-pulse rounded" />)}</div>
          ) : (
            <div className="divide-y divide-border">
              {orders.filter(o => new Date(o.created_at) >= thisWeek)
                .filter((o, i, arr) => arr.findIndex(x => x.customer_phone === o.customer_phone) === i)
                .slice(0, 5)
                .map(order => (
                  <div key={order.id} className="flex items-center gap-3 px-5 py-3">
                    <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-violet-600">
                        {order.customer_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{order.customer_name}</p>
                      <p className="text-xs text-muted-foreground">+91 {order.customer_phone}</p>
                    </div>
                  </div>
                ))}
              {orders.filter(o => new Date(o.created_at) >= thisWeek).length === 0 && (
                <div className="p-5 text-center text-sm text-muted-foreground">No new customers this week.</div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}