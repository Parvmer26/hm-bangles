import { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { motion } from 'framer-motion';

export default function AdminLoginPage() {
  const { login } = useAdmin();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!login(password)) {
      setError('Incorrect password');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm p-8"
      >
        <h1 className="font-serif text-2xl font-medium text-foreground text-center mb-2">
          HM <span className="gold-text">Bangles</span>
        </h1>
        <p className="text-sm text-muted-foreground text-center mb-8">Admin Panel</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError(''); }}
            placeholder="Enter admin password"
            className="w-full px-4 py-3 border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary"
          />
          {error && <p className="text-xs text-destructive">{error}</p>}
          <button type="submit" className="btn-gold w-full">Login</button>
        </form>
      </motion.div>
    </div>
  );
}
