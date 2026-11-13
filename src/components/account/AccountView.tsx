"use client";

import { useAuth } from "@/lib/auth";
import { AccountDashboard } from "./AccountDashboard";
import { AuthPanel } from "./AuthPanel";

export function AccountView() {
  const { status, available } = useAuth();

  if (!available) {
    return (
      <div className="container flex min-h-[70svh] flex-col items-center justify-center pt-40 text-center">
        <p className="eyebrow mb-5">Your account</p>
        <h1 className="font-serif text-display-md font-light">Accounts open at launch</h1>
        <p className="mt-4 max-w-sm text-sm text-ivory/55">This preview runs without the store backend.</p>
      </div>
    );
  }

  return (
    <div className="container min-h-[80svh] pb-28 pt-36 md:pt-44">
      {status === "loading" && <div className="min-h-[50svh]" aria-busy="true" />}
      {status === "signedIn" && <AccountDashboard />}
      {status === "signedOut" && (
        <div className="grid items-start gap-16 lg:grid-cols-2 lg:gap-24">
          <div className="max-w-md">
            <p className="eyebrow mb-5">Your account</p>
            <h1 className="font-serif text-display-md font-light">Welcome back</h1>
            <p className="mt-5 text-ivory/60">
              Sign in to see your orders and set your discretion preferences once. Prefer not to? You can always check out as a guest.
            </p>
            <ul className="mt-10 space-y-3 text-sm text-ivory/55">
              <li>&mdash; Your details are encrypted, never sold or shared</li>
              <li>&mdash; Emails arrive from &ldquo;EF Studio&rdquo; with plain subject lines</li>
              <li>&mdash; Close your account at any time, in one step</li>
            </ul>
          </div>
          <AuthPanel />
        </div>
      )}
    </div>
  );
}
