import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  display_name: string;
  bio: string;
  avatar_url: string;
  cover_photo_url: string;
  interests: string[];
  level: number;
  level_name: string;
  score: number;
  streak: number;
  is_online: boolean;
  location: string;
  occupation: string;
  financial_goals: string[];
  joined_date: string;
  created_at: string;
  updated_at: string;
}

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  signup: (email: string, password: string, name: string) => Promise<string | null>;
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  authHeader: () => Record<string, string>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = 'opto_token';

// ─── Provider ───────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem(TOKEN_KEY),
    loading: true,
  });

  const authHeader = useCallback(
    () => (state.token ? { Authorization: `Bearer ${state.token}` } : {}),
    [state.token],
  );

  // On mount (or token change), try to fetch the current user
  useEffect(() => {
    if (!state.token) {
      setState(s => ({ ...s, loading: false }));
      return;
    }

    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${state.token}` } })
      .then(async res => {
        if (!res.ok) throw new Error();
        const user = await res.json();
        setState({ user, token: state.token, loading: false });
      })
      .catch(() => {
        // Token expired / invalid — clear it
        localStorage.removeItem(TOKEN_KEY);
        setState({ user: null, token: null, loading: false });
      });
  }, [state.token]);

  const signup = async (email: string, password: string, name: string): Promise<string | null> => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      if (!res.ok) return data.error || 'Signup failed';

      localStorage.setItem(TOKEN_KEY, data.token);
      setState({ user: data.user, token: data.token, loading: false });
      return null; // success
    } catch {
      return 'Network error — is the server running?';
    }
  };

  const login = async (email: string, password: string): Promise<string | null> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return data.error || 'Login failed';

      localStorage.setItem(TOKEN_KEY, data.token);
      setState({ user: data.user, token: data.token, loading: false });
      return null;
    } catch {
      return 'Network error — is the server running?';
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setState({ user: null, token: null, loading: false });
  };

  const refreshUser = async () => {
    if (!state.token) return;
    try {
      const res = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${state.token}` } });
      if (res.ok) {
        const user = await res.json();
        setState(s => ({ ...s, user }));
      }
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, signup, login, logout, refreshUser, authHeader }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
