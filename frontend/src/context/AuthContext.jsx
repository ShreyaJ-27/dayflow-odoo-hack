import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, session } from '../services/api';

const AuthContext = createContext(null);

/**
 * AuthProvider — manages authentication state, session restore, login/logout.
 * Wraps the entire application.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!session.token); // true only if we have a stored token to restore

  // ── Session restore on mount ───────────────────────────────────────────────
  useEffect(() => {
    if (!session.token) {
      setLoading(false);
      return;
    }

    api.me()
      .then((result) => {
        setUser(result.data);
      })
      .catch(() => {
        session.clear();
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // ── Listen for session-expired events (e.g., refresh token invalid) ────────
  useEffect(() => {
    const handleExpired = () => {
      session.clear();
      setUser(null);
    };
    window.addEventListener('dayflow:session-expired', handleExpired);
    return () => window.removeEventListener('dayflow:session-expired', handleExpired);
  }, []);

  // ── Login ─────────────────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    const result = await api.login({ email, password });
    session.set({
      accessToken: result.data.accessToken,
      refreshToken: result.data.refreshToken
    });
    setUser(result.data.user);
    return result.data.user;
  }, []);

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await api.logout();
    } catch {
      // Ignore logout errors — still clear local state
    }
    session.clear();
    setUser(null);
  }, []);

  // ── Signup ────────────────────────────────────────────────────────────────
  const signup = useCallback(async (body) => {
    return api.signup(body);
  }, []);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const isAuthenticated = !!user;
  const role = user?.role || null; // 'ADMIN' | 'HR' | 'EMPLOYEE'

  const isAdmin = role === 'ADMIN';
  const isHR = role === 'HR';
  const isEmployee = role === 'EMPLOYEE';
  const isAdminOrHR = isAdmin || isHR;

  const roleRoot = role ? `/${role.toLowerCase()}` : '/login';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        role,
        isAdmin,
        isHR,
        isEmployee,
        isAdminOrHR,
        roleRoot,
        login,
        logout,
        signup,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
