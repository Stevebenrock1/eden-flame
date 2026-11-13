"use client";

/**
 * Client session plumbing for the Eden Flame API.
 *
 * - The short-lived access token lives only in memory (never in localStorage), so a
 *   malicious script can't lift a long-lived credential from storage.
 * - The long-lived refresh token is an HTTP-only cookie the browser sends to /api/auth only.
 * - A harmless "signed in" hint in localStorage just tells us whether to try a silent
 *   refresh on page load, so anonymous visitors make no auth calls at all.
 */
const HINT_KEY = "ef-session";

let accessToken: string | null = null;
let refreshing: Promise<string | null> | null = null;
const listeners = new Set<(token: string | null) => void>();

export function getAccessToken() {
  return accessToken;
}

export function setAccessToken(token: string | null) {
  const changed = Boolean(token) !== Boolean(accessToken);
  accessToken = token;
  try {
    if (token) localStorage.setItem(HINT_KEY, "1");
    else localStorage.removeItem(HINT_KEY);
  } catch {
    /* storage blocked */
  }
  if (changed) listeners.forEach((fn) => fn(token));
}

/** Notified when the visitor signs in or out (used by the bag to reload). */
export function onSessionChange(fn: (token: string | null) => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function hasSessionHint() {
  try {
    return localStorage.getItem(HINT_KEY) === "1";
  } catch {
    return false;
  }
}

/** Swaps the refresh cookie for a new access token. Concurrent callers share one request. */
export function refreshSession(): Promise<string | null> {
  refreshing ??= fetch("/api/auth/refresh", { method: "POST", credentials: "same-origin" })
    .then(async (res) => {
      if (!res.ok) {
        setAccessToken(null);
        return null;
      }
      const body = (await res.json()) as { accessToken: string };
      setAccessToken(body.accessToken);
      return body.accessToken;
    })
    .catch(() => accessToken)
    .finally(() => {
      refreshing = null;
    });
  return refreshing;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: unknown,
  ) {
    super(message);
  }
}

/**
 * fetch() for the API: JSON in and out, the access token attached when signed in, and one
 * transparent retry after a silent refresh if the token has just expired.
 */
export async function apiFetch<T = unknown>(path: string, init: RequestInit = {}, retry = true): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

  const res = await fetch(path, { ...init, headers, credentials: "same-origin" });
  if (res.status === 401 && retry && accessToken) {
    const fresh = await refreshSession();
    if (fresh) return apiFetch<T>(path, init, false);
  }
  if (res.status === 204) return undefined as T;
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const e = (body as { error?: { code?: string; message?: string; details?: unknown } }).error;
    throw new ApiError(res.status, e?.code ?? "ERROR", e?.message ?? "Something went wrong. Please try again.", e?.details);
  }
  return body as T;
}
