"use client"

import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "@/lib/axios";

type AuthUser = {
  _id?: string;
  name?: string;
  profileURL?: string;
  email?: string;
  username?: string;
  googleConnected?: boolean;
  isVerified?: boolean;
};

type MeResponse = {
  data?: {
    user?: AuthUser;
  };
};

type AuthContextType = {
  isAuthenticated: boolean;
  loading: boolean;
  refresh: () => Promise<void>;
  user: AuthUser | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);

  const check = async () => {
    setLoading(true);
    try {
      // use the new /me endpoint to validate session and fetch basic user info
      const res = await axios.get<MeResponse>("/api/user/me");
      const userData = res.data?.data?.user;
      const ok = res.status === 200 && userData;
      if (!ok || !userData) throw new Error("Not authenticated");
      setUser(res?.data?.data?.user ?? null);
      setIsAuthenticated(true);
    } catch (err: unknown) {
      setUser(null);
      setIsAuthenticated(false);
      console.warn("Auth check failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    check();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, refresh: check, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) return {
    isAuthenticated: false,
    loading: true,
    refresh: async () => {},
    user: null,
  };
  return ctx;
}

export default AuthContext;
