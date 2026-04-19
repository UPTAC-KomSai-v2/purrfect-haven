import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate session on page refresh
  useEffect(() => {
    async function checkSession() {
      try {
        // Add timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const { data } = await api.get('/users/profile', { signal: controller.signal });
        setUser(data.user);
        clearTimeout(timeoutId);
      } catch (error) {
        // Log the error but don't break
        console.warn('Failed to fetch user profile:', error.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    checkSession();
  }, []);

  // Called after successful POST /api/auth/login 
  function login(userData) {
    setUser(userData);
  }

  // Called after successful POST /api/auth/logout
  function logout() {
    setUser(null);
  }

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return context;
}