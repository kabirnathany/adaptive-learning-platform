import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { get, post } from '../api';

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
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const refreshToken = useCallback(async () => {
    try {
      await post('/api/auth/refresh');
      return loadUser();
    } catch (_) {
      setUser(null);
      return null;
    }
  }, [loadUser]);

  const login = async (email, password) => {
    const data = await post('/api/auth/login', { email, password });
    setUser(data.user);
    return data.user;
  };

  const signup = async (email, password, name) => {
    const data = await post('/api/auth/signup', { email, password, name });
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    try {
      await post('/api/auth/logout');
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    refreshToken,
    loadUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
