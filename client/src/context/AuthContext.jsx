/**
 * Auth context – signup/login return user + accessToken; token stored in localStorage and sent via Authorization header.
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { get, post, setToken, clearToken } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      const { user: u } = await get('/api/auth/me');
      setUser(u);
      return u;
    } catch (_) {
      setUser(null);
      clearToken();
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password) => {
    const data = await post('/api/auth/login', { email, password });
    setToken(data.accessToken);
    setUser(data.user);
    return data.user;
  };

  const signup = async (email, password, name) => {
    const data = await post('/api/auth/signup', { email, password, name });
    setToken(data.accessToken);
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    try {
      await post('/api/auth/logout');
    } finally {
      clearToken();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
