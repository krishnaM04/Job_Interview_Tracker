import React, { useContext, useEffect, useState, useCallback, useRef } from 'react';
import * as authService from '../services/authService';

const AuthContext = React.createContext(null);

export function useAuthContext() {
  return useContext(AuthContext);
}

// Role-based inactivity timeout (ms)
const TIMEOUT_BY_ROLE = {
  ADMIN: 15 * 60 * 1000,
  CAREER_COUNSELOR: 30 * 60 * 1000,
  PREMIUM_CANDIDATE: 60 * 60 * 1000,
  STANDARD_CANDIDATE: 60 * 60 * 1000,
};
const WARN_BEFORE = 2 * 60 * 1000; // warn 2 min before timeout

function loadSession() {
  try {
    return {
      token: sessionStorage.getItem('auth_token') || null,
      user: JSON.parse(sessionStorage.getItem('auth_user') || 'null'),
    };
  } catch { return { token: null, user: null }; }
}

export function AuthProvider({ children }) {
  const saved = loadSession();
  const [token, setToken] = useState(saved.token);
  const [user, setUser] = useState(saved.user);
  const [loading, setLoading] = useState(false);
  const [sessionWarning, setSessionWarning] = useState(false);

  const timeoutRef = useRef(null);
  const warnRef = useRef(null);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setSessionWarning(false);
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_user');
    clearTimeout(timeoutRef.current);
    clearTimeout(warnRef.current);
  }, []);

  const resetInactivityTimer = useCallback((role) => {
    clearTimeout(timeoutRef.current);
    clearTimeout(warnRef.current);
    setSessionWarning(false);
    const timeout = TIMEOUT_BY_ROLE[role] || TIMEOUT_BY_ROLE.STANDARD_CANDIDATE;
    warnRef.current = setTimeout(() => setSessionWarning(true), timeout - WARN_BEFORE);
    timeoutRef.current = setTimeout(() => logout(), timeout);
  }, [logout]);

  // Track user activity
  useEffect(() => {
    if (!token || !user) return;
    const events = ['mousemove', 'keydown', 'pointerdown', 'scroll'];
    const handler = () => resetInactivityTimer(user.role);
    events.forEach(e => window.addEventListener(e, handler, { passive: true }));
    resetInactivityTimer(user.role);
    return () => {
      events.forEach(e => window.removeEventListener(e, handler));
      clearTimeout(timeoutRef.current);
      clearTimeout(warnRef.current);
    };
  }, [token, user, resetInactivityTimer]);

  // Token auto-refresh every 14 minutes
  useEffect(() => {
    if (!token) return;
    const timer = setInterval(async () => {
      try {
        const data = await authService.refreshToken(token);
        if (data?.token) {
          setToken(data.token);
          sessionStorage.setItem('auth_token', data.token);
        }
        // If refresh fails (backend down), keep existing token — don't logout
      } catch {
        // only logout on explicit 401, not network errors
      }
    }, 14 * 60 * 1000);
    return () => clearInterval(timer);
  }, [token, logout]);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const data = await authService.login(credentials);
      const normalizedUser = data.user || {
        username: credentials?.username,
        role: data.role,
      };

      setToken(data.token);
      setUser(normalizedUser);
      sessionStorage.setItem('auth_token', data.token);
      sessionStorage.setItem('auth_user', JSON.stringify(normalizedUser));
      return { ...data, user: normalizedUser };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (payload) => {
    setLoading(true);
    try {
      return await authService.register(payload);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = { token, user, login, logout, register, loading, sessionWarning, resetInactivityTimer };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
