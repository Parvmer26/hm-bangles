import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAdmin } from '@/context/AdminContext';
import { LayoutDashboard, Package, ShoppingCart, Settings, LogOut } from 'lucide-react';
import AdminLoginPage from './AdminLoginPage';

const adminNav = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout() {
  const { isAuthenticated, logout } = useAdmin();
  const location = useLocation();
  const navigate = useNavigate();

  if (!isAuthenticated) return <AdminLoginPage />;

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-60 border-r border-border bg-cream-dark hidden md:flex flex-col">
        <div className="p-6 border-b border-border">
          <Link to="/admin" className="font-serif text-lg font-semibold text-foreground">
            HM <span className="gold-text">Admin</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {adminNav.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-4 py-3 text-sm rounded transition-colors ${
                location.pathname === to
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon size={18} /> {label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <button
            onClick={() => { logout(); navigate('/admin'); }}
            className="flex items-center gap-3 px-4 py-3 text-sm text-muted-foreground hover:text-destructive w-full transition-colors"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b border-border flex items-center justify-between px-4 h-14">
        <span className="font-serif text-lg font-semibold">HM <span className="gold-text">Admin</span></span>
        <button onClick={() => { logout(); navigate('/admin'); }} className="text-sm text-muted-foreground">Logout</button>
      </div>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8 md:pt-8 pt-20">
          <Outlet />
        </div>
        {/* Mobile nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border flex">
          {adminNav.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs ${
                location.pathname === to ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Icon size={18} /> {label}
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
