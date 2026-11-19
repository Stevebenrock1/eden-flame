"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { commerceApiEnabled } from "@/lib/bag";
import { ApiError, apiFetch } from "@/lib/session";

/** Reached from the link in our emails. One press, no sign-in needed. */
export function Unsubscribe() {
  const params = useSearchParams();
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function confirm() {
    setState("busy");
    setError(null);
    try {
      if (commerceApiEnabled) {
        await apiFetch("/api/newsletter/unsubscribe", {
          method: "POST",
          body: JSON.stringify({ id: params.get("id") ?? "", token: params.get("token") ?? "" }),
        });
      }
      setState("done");
    } catch (err) {
      setError(err instanceof ApiError ? "This unsubscribe link isn't valid. Reply to any of our emails and we'll remove you by hand." : "Something went wrong. Please try again.");
      setState("idle");
    }
  }

  return (
    <div className="container flex min-h-[80svh] flex-col items-center justify-center pb-24 pt-40 text-center">
      <p className="eyebrow mb-5">Private letters</p>
      {state === "done" ? (
        <>
          <h1 className="font-serif text-display-md font-light">You&rsquo;re unsubscribed</h1>
          <p className="mt-5 max-w-md text-ivory/60" role="status">You won&rsquo;t receive further letters from us. Order emails about purchases still arrive as usual.</p>
          <ButtonLink href="/" variant="ghost" className="mt-10">Return home</ButtonLink>
        </>
      ) : (
        <>
          <h1 className="font-serif text-display-md font-light">Unsubscribe</h1>
          <p className="mt-5 max-w-md text-ivory/60">Stop receiving our letters on new pieces and offers.</p>
          {error && <p role="alert" className="mt-5 max-w-md text-sm text-rosegold">{error}</p>}
          <button
            type="button"
            onClick={() => void confirm()}
            disabled={state === "busy"}
            className="mt-10 flex h-14 items-center justify-center px-10 gold-foil text-[0.75rem] uppercase tracking-luxe text-obsidian disabled:opacity-70"
          >
            {state === "busy" ? "One moment…" : "Unsubscribe me"}
          </button>
        </>
      )}
    </div>
  );
}
