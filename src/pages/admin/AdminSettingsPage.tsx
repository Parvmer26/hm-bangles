import { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Shield, Bell, Moon, Globe } from 'lucide-react';

export default function AdminSettingsPage() {
  const { logout } = useAdmin();
  const navigate   = useNavigate();

  const [currentPw, setCurrentPw]   = useState('');
  const [newPw, setNewPw]           = useState('');
  const [confirmPw, setConfirmPw]   = useState('');
  const [saving, setSaving]         = useState(false);
  const [darkMode, setDarkMode]     = useState(false);
  const [language, setLanguage]     = useState('English');
  const [notifications, setNotifications] = useState({
    newOrder:  true,
    lowStock:  true,
    delivered: false,
    whatsapp:  true,
  });

  function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'HMBangles@Rajkot2024';
    if (currentPw !== adminPassword) { toast.error('Current password is incorrect'); return; }
    if (newPw.length < 8)             { toast.error('New password must be at least 8 characters'); return; }
    if (newPw !== confirmPw)          { toast.error('Passwords do not match'); return; }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Password updated. Update VITE_ADMIN_PASSWORD in your .env file to make it permanent.');
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
    }, 800);
  }

  function handleLogout() {
    logout();
    navigate('/admin');
    toast.success('Logged out successfully');
  }

  const inputCls = "w-full px-4 py-2.5 border border-border bg-background text-sm focus:outline-none focus:border-primary rounded transition-colors";
  const labelCls = "text-xs uppercase tracking-wide text-muted-foreground mb-1.5 block font-medium";

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="font-serif text-2xl font-medium">Settings</h1>

      {/* Security — Change Password */}
      <div className="border border-border bg-card rounded-lg p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
  <Shield size={16} className="text-foreground" />
</div>
          <h2 className="font-serif text-lg font-medium">Security</h2>
        </div>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className={labelCls}>Current Password</label>
            <input type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} className={inputCls} placeholder="Enter current password" required />
          </div>
          <div>
            <label className={labelCls}>New Password</label>
            <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} className={inputCls} placeholder="Min 8 characters" required />
          </div>
          <div>
            <label className={labelCls}>Confirm New Password</label>
            <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} className={inputCls} placeholder="Repeat new password" required />
          </div>
          <div className="flex items-center gap-3">
            <button type="submit" disabled={saving} className="btn-gold text-xs py-2.5 px-6 rounded disabled:opacity-50">
              {saving ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded text-amber-700 text-xs">
          Admin session auto-expires after 8 hours. Direct URL access is blocked without login.
        </div>
      </div>

      {/* Notifications */}
      <div className="border border-border bg-card rounded-lg p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
  <Bell size={16} className="text-foreground" />
</div>
          <h2 className="font-serif text-lg font-medium">Notifications</h2>
        </div>
        <div className="space-y-1">
          {[
            { key: 'newOrder',  label: 'New order received',     desc: 'Real-time alert when customer places order' },
            { key: 'lowStock',  label: 'Low stock warning',      desc: 'When any size stock drops to 2 or below' },
            { key: 'delivered', label: 'Order delivered',        desc: 'When order is marked as delivered' },
            { key: 'whatsapp',  label: 'WhatsApp notifications', desc: 'Get WhatsApp message for new orders' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
              </div>
              <button
  type="button"
  onClick={() =>
    setNotifications(n => ({
      ...n,
      [key]: !n[key as keyof typeof n],
    }))
  }
  className={`relative w-11 h-6 rounded-full transition-all duration-300 flex items-center ${
    notifications[key as keyof typeof notifications]
      ? 'bg-primary'
      : 'bg-muted'
  }`}
>
  <span
    className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-all duration-300 ${
      notifications[key as keyof typeof notifications]
        ? 'translate-x-5'
        : 'translate-x-1'
    }`}
  />
</button>
            </div>
          ))}
        </div>
      </div>

      {/* Appearance */}
      <div className="border border-border bg-card rounded-lg p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
  <Moon size={16} className="text-foreground" />
</div>
          <h2 className="font-serif text-lg font-medium">Appearance</h2>
        </div>
        <div className="flex items-center justify-between py-3 border-b border-border">
          <div>
            <p className="text-sm font-medium">Dark mode</p>
            <p className="text-xs text-muted-foreground mt-0.5">Switch admin panel to dark theme</p>
          </div>
          <button
  type="button"
  onClick={() => setDarkMode(!darkMode)}
  className={`relative w-11 h-6 rounded-full transition-all duration-300 flex items-center ${
    darkMode ? 'bg-primary' : 'bg-muted'
  }`}
>
  <span
    className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-all duration-300 ${
      darkMode ? 'translate-x-5' : 'translate-x-1'
    }`}
  />
</button>
        </div>
        <div className="flex items-center justify-between py-3">
          <div>
            <p className="text-sm font-medium">Language</p>
            <p className="text-xs text-muted-foreground mt-0.5">Admin panel display language</p>
          </div>
          <select value={language} onChange={e => setLanguage(e.target.value)}
            className="text-xs border border-border px-3 py-1.5 bg-background focus:outline-none rounded">
            <option>English</option>
            <option>Gujarati</option>
            <option>Hindi</option>
          </select>
        </div>
      </div>

      {/* Account */}
      <div className="border border-border bg-card rounded-lg p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
  <Globe size={16} className="text-foreground" />
</div>
          <h2 className="font-serif text-lg font-medium">Account</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium">Session</p>
              <p className="text-xs text-muted-foreground">Auto-expires after 8 hours of inactivity</p>
            </div>
            <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">Active</span>
          </div>
          <div className="pt-2 border-t border-border">
            <button onClick={handleLogout}
              className="w-full text-sm text-destructive border border-destructive/30 hover:bg-destructive hover:text-white transition-colors py-2.5 px-4 rounded">
              Sign Out
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
