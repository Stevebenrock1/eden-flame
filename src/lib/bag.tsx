"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { apiFetch, hasSessionHint, onSessionChange, refreshSession } from "@/lib/session";

export interface BagLine {
  handle: string;
  quantity: number;
  /** Set when the bag lives on the API. */
  productId?: string;
}

interface BagContextValue {
  lines: BagLine[];
  count: number;
  /** False until the bag has loaded, so pages don't flash "empty" on first paint. */
  ready: boolean;
  /** Last error from the server (e.g. a piece sold out), cleared on the next change. */
  error: string | null;
  add: (handle: string, quantity?: number) => void;
  remove: (handle: string) => void;
  setQuantity: (handle: string, quantity: number) => void;
  clear: () => void;
  /** Re-reads the bag from the server (e.g. after returning from payment). */
  refresh: () => Promise<void>;
}

const BagContext = createContext<BagContextValue | null>(null);
const STORAGE_KEY = "ef-bag";
const USE_API = process.env.NEXT_PUBLIC_COMMERCE_API === "1";

interface ApiCartView {
  items: { productId: string; slug: string; quantity: number }[];
}

/** Signed in: the account's bag (access token attached). Guest: the bag in the HTTP-only cookie. */
const api = (path: string, init?: RequestInit) => apiFetch<ApiCartView>(`/api/cart${path}`, init);

const fromView = (v: ApiCartView): BagLine[] => v.items.map((i) => ({ handle: i.slug, quantity: i.quantity, productId: i.productId }));

/**
 * The bag.
 * - With the Eden Flame API: the bag lives on the server (guest cookie, merged into the account
 *   at sign-in). Changes show instantly, then the server's version replaces them.
 * - Without it: a browser-only bag in localStorage, for design work.
 */
export function BagProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<BagLine[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const linesRef = useRef(lines);
  linesRef.current = lines;
  // Server calls run one at a time, so the first add creates exactly one guest bag.
  const queue = useRef<Promise<unknown>>(Promise.resolve());

  const sync = useCallback((call: () => Promise<ApiCartView>) => {
    setError(null);
    queue.current = queue.current
      .then(call)
      .then((view) => {
        view.items.forEach((i) => serverIds.current.set(i.slug, i.productId));
        setLines(fromView(view));
      })
      .catch(async (err: Error) => {
        setError(err.message);
        try {
          setLines(fromView(await api("")));
        } catch {
          /* keep what we have */
        }
      });
    return queue.current as Promise<void>;
  }, []);

  const refresh = useCallback(async () => {
    if (!USE_API) return;
    await sync(() => api(""));
  }, [sync]);

  useEffect(() => {
    if (USE_API) {
      // Returning signed-in visitors: restore the session first so we load the account's bag,
      // not an empty guest one. (The auth provider shares this same refresh request.)
      const session = hasSessionHint() ? refreshSession() : Promise.resolve(null);
      void session.then(() => refresh()).finally(() => setReady(true));
      return;
    }
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setLines(JSON.parse(saved));
    } catch {
      /* private mode or blocked storage: start empty */
    }
    setReady(true);
  }, [refresh]);

  // Signing in merges the guest bag into the account; signing out returns to a guest bag.
  useEffect(() => (USE_API ? onSessionChange(() => void refresh()) : undefined), [refresh]);

  useEffect(() => {
    if (USE_API || !ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines, ready]);

  const idOf = (handle: string) => linesRef.current.find((l) => l.handle === handle)?.productId;
  // Server lines seen most recently (kept even after an optimistic removal hides the line).
  const serverIds = useRef(new Map<string, string>());
  const withId = (handle: string, known: string | undefined, call: (id: string) => Promise<ApiCartView>) => {
    const id = known ?? serverIds.current.get(handle);
    return id ? call(id) : api("");
  };

  const add = useCallback(
    (handle: string, quantity = 1) => {
      setLines((prev) => {
        const hit = prev.find((l) => l.handle === handle);
        return hit ? prev.map((l) => (l.handle === handle ? { ...l, quantity: l.quantity + quantity } : l)) : [...prev, { handle, quantity }];
      });
      if (USE_API) void sync(() => api("/items", { method: "POST", body: JSON.stringify({ slug: handle, quantity }) }));
    },
    [sync],
  );

  const remove = useCallback(
    (handle: string) => {
      // Capture the id before removing the line; a just-added line gets its id from the server
      // response, which arrives before this queued call runs.
      const known = idOf(handle);
      setLines((prev) => prev.filter((l) => l.handle !== handle));
      if (USE_API) void sync(() => withId(handle, known, (id) => api(`/items/${id}`, { method: "DELETE" })));
    },
    [sync],
  );

  const setQuantity = useCallback(
    (handle: string, quantity: number) => {
      const known = idOf(handle);
      setLines((prev) =>
        quantity <= 0 ? prev.filter((l) => l.handle !== handle) : prev.map((l) => (l.handle === handle ? { ...l, quantity } : l)),
      );
      if (USE_API)
        void sync(() => withId(handle, known, (id) => api(`/items/${id}`, { method: "PATCH", body: JSON.stringify({ quantity: Math.max(0, quantity) }) })));
    },
    [sync],
  );

  const clear = useCallback(() => {
    setLines([]);
    if (USE_API) void sync(() => api("", { method: "DELETE" }));
  }, [sync]);

  const value = useMemo(
    () => ({ lines, ready, error, add, remove, setQuantity, clear, refresh, count: lines.reduce((n, l) => n + l.quantity, 0) }),
    [lines, ready, error, add, remove, setQuantity, clear, refresh],
  );

  return <BagContext.Provider value={value}>{children}</BagContext.Provider>;
}

export function useBag() {
  const ctx = useContext(BagContext);
  if (!ctx) throw new Error("useBag must be used inside <BagProvider>");
  return ctx;
}

export const commerceApiEnabled = USE_API;
