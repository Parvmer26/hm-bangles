import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface AdminContextType {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);
const ADMIN_KEY = 'hm-admin-session';
const SESSION_HOURS = 8;

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checked, setChecked] = useState(false);

  // Check session on mount — never auto-authenticate from URL
  useEffect(() => {
    try {
      const stored = localStorage.getItem(ADMIN_KEY);
      if (stored) {
        const { expiry, token } = JSON.parse(stored);
        // Validate both expiry AND secret token
        const validToken = import.meta.env.VITE_ADMIN_SESSION_TOKEN || 'hm-bangles-admin-2024';
        if (Date.now() < expiry && token === validToken) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem(ADMIN_KEY);
        }
      }
    } catch {
      localStorage.removeItem(ADMIN_KEY);
    }
    setChecked(true);
  }, []);

  const login = useCallback((password: string) => {
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'HMBangles@Rajkot2024';
    if (password === adminPassword) {
      const token  = import.meta.env.VITE_ADMIN_SESSION_TOKEN || 'hm-bangles-admin-2024';
      const expiry = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
      localStorage.setItem(ADMIN_KEY, JSON.stringify({ expiry, token }));
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(ADMIN_KEY);
    setIsAuthenticated(false);
  }, []);

  // Check session expiry every minute
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const stored = localStorage.getItem(ADMIN_KEY);
        if (stored) {
          const { expiry } = JSON.parse(stored);
          if (Date.now() >= expiry) logout();
        }
      } catch { logout(); }
    }, 60000);
    return () => clearInterval(interval);
  }, [logout]);

  // Don't render until session is checked
  if (!checked) return null;

  return (
    <AdminContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}