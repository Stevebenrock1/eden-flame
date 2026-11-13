"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth";
import { Field, Notice, SubmitButton, errorText } from "./ui";

function Shell({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <div className="container flex min-h-[80svh] flex-col items-center justify-center pb-24 pt-40">
      <div className="w-full max-w-md text-center">
        <p className="eyebrow mb-5">{eyebrow}</p>
        <h1 className="font-serif text-display-md font-light">{title}</h1>
        <div className="mt-10 text-left">{children}</div>
      </div>
    </div>
  );
}

/** Landing page for the "confirm your account" email link. */
export function VerifyEmail({ token }: { token: string | null }) {
  const { verifyEmail } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(token ? null : "This link is incomplete. Please use the link from your email.");
  const started = useRef(false);

  useEffect(() => {
    if (!token || started.current) return; // one-time token: never submit it twice
    started.current = true;
    verifyEmail(token)
      .then(() => router.replace("/account"))
      .catch((err) => setError(errorText(err)));
  }, [token, verifyEmail, router]);

  return (
    <Shell eyebrow="Your account" title={error ? "Link expired" : "Confirming…"}>
      {error ? (
        <>
          <Notice tone="error">{error}</Notice>
          <Link href="/account" className="mt-8 inline-block text-xs uppercase tracking-luxe text-champagne underline-offset-4 hover:underline">
            Back to your account
          </Link>
        </>
      ) : (
        <p className="text-center text-sm text-ivory/55">One moment while we open your account.</p>
      )}
    </Shell>
  );
}

/** Landing page for the password reset email link. */
export function ResetPassword({ token }: { token: string | null }) {
  const { resetPassword } = useAuth();
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(token ? null : "This link is incomplete. Please use the link from your email.");

  return (
    <Shell eyebrow="Your account" title={done ? "Password updated" : "Choose a new password"}>
      {done ? (
        <>
          <Notice>Your password is changed and every other device has been signed out.</Notice>
          <Link href="/account" className="mt-8 inline-block text-xs uppercase tracking-luxe text-champagne underline-offset-4 hover:underline">
            Sign in
          </Link>
        </>
      ) : (
        <form
          className="space-y-6"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!token) return;
            const f = new FormData(e.currentTarget);
            const password = String(f.get("password") ?? "");
            if (password !== String(f.get("confirm") ?? "")) return setError("The two passwords don't match.");
            setBusy(true);
            setError(null);
            try {
              await resetPassword(token, password);
              setDone(true);
            } catch (err) {
              setError(errorText(err));
            } finally {
              setBusy(false);
            }
          }}
        >
          <Field label="New password" name="password" type="password" required minLength={12} autoComplete="new-password" placeholder="New password (at least 12 characters)" />
          <Field label="Confirm new password" name="confirm" type="password" required minLength={12} autoComplete="new-password" />
          {error && <Notice tone="error">{error}</Notice>}
          <SubmitButton busy={busy}>{busy ? "One moment…" : "Update password"}</SubmitButton>
        </form>
      )}
    </Shell>
  );
}
