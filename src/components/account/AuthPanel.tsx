"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Lock } from "lucide-react";
import { Checkbox } from "@/components/ui/Choice";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/cn";
import { Field, Notice, SubmitButton, errorText } from "./ui";

type Mode = "signin" | "register" | "forgot";

/** Sign in, create an account, or ask for a password reset link. */
export function AuthPanel() {
  const { signIn, register, requestReset } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const go = (m: Mode) => {
    setMode(m);
    setError(null);
    setInfo(null);
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget; // React clears currentTarget after the first await
    const f = new FormData(form);
    const email = String(f.get("email") ?? "");
    const password = String(f.get("password") ?? "");
    setBusy(true);
    setError(null);
    setInfo(null);
    try {
      if (mode === "signin") await signIn(email, password);
      else if (mode === "register") {
        if (password.length < 12) throw new Error("Please use at least 12 characters. A short phrase works well.");
        setInfo(await register(email, password, f.get("marketing") === "on"));
        form.reset();
      } else setInfo(await requestReset(email));
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      {mode !== "forgot" && (
        <div role="tablist" aria-label="Account" className="mb-12 grid grid-cols-2 border-b border-ivory/10">
          {(["signin", "register"] as const).map((m) => (
            <button
              key={m}
              role="tab"
              type="button"
              aria-selected={mode === m}
              onClick={() => go(m)}
              className={cn(
                "relative pb-4 text-[0.72rem] uppercase tracking-luxe transition-colors",
                mode === m ? "text-ivory" : "text-ivory/40 hover:text-ivory/70",
              )}
            >
              {m === "signin" ? "Sign in" : "Create account"}
              {mode === m && <motion.span layoutId="auth-tab" className="absolute inset-x-0 -bottom-px h-px bg-champagne" />}
            </button>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.form
          key={mode}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35 }}
          onSubmit={onSubmit}
          className="space-y-6"
        >
          {mode === "forgot" && (
            <div className="mb-4">
              <h2 className="font-serif text-3xl font-light">Reset your password</h2>
              <p className="mt-3 text-sm text-ivory/55">Enter your email and we&rsquo;ll send a private link to choose a new one.</p>
            </div>
          )}

          <Field label="Email address" name="email" type="email" required autoComplete="email" />
          {mode !== "forgot" && (
            <Field
              label="Password"
              name="password"
              type="password"
              required
              minLength={mode === "register" ? 12 : undefined}
              autoComplete={mode === "register" ? "new-password" : "current-password"}
              placeholder={mode === "register" ? "Password (at least 12 characters)" : "Password"}
            />
          )}

          {mode === "register" && (
            <Checkbox
              name="marketing"
              className="items-start text-xs"
              labelClassName="text-ivory/55 leading-relaxed"
              label="Send me occasional private previews of new pieces. Plain subject lines, unsubscribe any time."
            />
          )}

          {error && <Notice tone="error">{error}</Notice>}
          {info && <Notice>{info}</Notice>}

          <SubmitButton busy={busy}>
            {busy ? "One moment…" : mode === "signin" ? "Sign in" : mode === "register" ? "Create account" : "Send reset link"}
          </SubmitButton>

          <div className="flex items-center justify-between pt-2 text-xs text-ivory/45">
            {mode === "signin" && (
              <button type="button" onClick={() => go("forgot")} className="underline-offset-4 hover:text-champagne hover:underline">
                Forgotten your password?
              </button>
            )}
            {mode === "forgot" && (
              <button type="button" onClick={() => go("signin")} className="underline-offset-4 hover:text-champagne hover:underline">
                Back to sign in
              </button>
            )}
            <span className="ml-auto flex items-center gap-1.5">
              <Lock strokeWidth={1.25} className="h-3 w-3" /> Encrypted &amp; private
            </span>
          </div>
        </motion.form>
      </AnimatePresence>
    </div>
  );
}
