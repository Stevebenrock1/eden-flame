"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { commerceApiEnabled } from "@/lib/bag";
import { apiFetch, getAccessToken, hasSessionHint, onSessionChange, refreshSession, setAccessToken } from "@/lib/session";

export interface Profile {
  firstName: string | null;
  lastName: string | null;
  plainPackaging: boolean;
  paperlessReceipt: boolean;
  marketingOptIn: boolean;
}

export interface Me {
  id: string;
  email: string;
  role: "CUSTOMER" | "SUPPORT" | "ADMIN";
  createdAt: string;
  profile: Profile | null;
}

type Status = "loading" | "signedOut" | "signedIn";

interface SessionResponse {
  accessToken: string;
  expiresIn: number;
}

interface AuthContextValue {
  status: Status;
  me: Me | null;
  /** False when the storefront runs without the API (design mode). */
  available: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, marketingOptIn: boolean) => Promise<string>;
  verifyEmail: (token: string) => Promise<void>;
  requestReset: (email: string) => Promise<string>;
  resetPassword: (token: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (patch: Partial<Profile>) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<Status>(commerceApiEnabled ? "loading" : "signedOut");
  const [me, setMe] = useState<Me | null>(null);

  const loadMe = useCallback(async () => {
    try {
      setMe(await apiFetch<Me>("/api/me"));
      setStatus("signedIn");
    } catch {
      setAccessToken(null);
      setMe(null);
      setStatus("signedOut");
    }
  }, []);

  // Silent sign-in on page load, only for visitors who signed in before on this device.
  useEffect(() => {
    if (!commerceApiEnabled) return;
    if (!hasSessionHint()) {
      setStatus("signedOut");
      return;
    }
    void refreshSession().then((t) => (t ? loadMe() : setStatus("signedOut")));
  }, [loadMe]);

  // Keep the access token fresh while the tab is open (it lives 15 minutes).
  useEffect(() => {
    if (status !== "signedIn") return;
    const id = window.setInterval(() => void refreshSession(), 12 * 60_000);
    return () => window.clearInterval(id);
  }, [status]);

  // Another part of the app (e.g. a failed refresh) signed us out.
  useEffect(
    () =>
      onSessionChange((token) => {
        if (!token) {
          setMe(null);
          setStatus("signedOut");
        }
      }),
    [],
  );

  const startSession = useCallback(
    async (res: SessionResponse) => {
      setAccessToken(res.accessToken);
      await loadMe();
    },
    [loadMe],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      me,
      available: commerceApiEnabled,
      signIn: async (email, password) =>
        startSession(await apiFetch<SessionResponse>("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) })),
      register: async (email, password, marketingOptIn) =>
        (await apiFetch<{ message: string }>("/api/auth/register", { method: "POST", body: JSON.stringify({ email, password, marketingOptIn }) })).message,
      verifyEmail: async (token) =>
        startSession(await apiFetch<SessionResponse>("/api/auth/verify-email", { method: "POST", body: JSON.stringify({ token }) })),
      requestReset: async (email) =>
        (await apiFetch<{ message: string }>("/api/auth/password/forgot", { method: "POST", body: JSON.stringify({ email }) })).message,
      resetPassword: async (token, password) => {
        await apiFetch("/api/auth/password/reset", { method: "POST", body: JSON.stringify({ token, password }) });
      },
      signOut: async () => {
        await apiFetch("/api/auth/logout", { method: "POST" }).catch(() => undefined);
        setAccessToken(null);
      },
      updateProfile: async (patch) => {
        setMe(await apiFetch<Me>("/api/me/profile", { method: "PATCH", body: JSON.stringify(patch) }));
      },
      deleteAccount: async () => {
        await apiFetch("/api/me", { method: "DELETE" });
        setAccessToken(null);
      },
    }),
    [status, me, startSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

export { getAccessToken };
