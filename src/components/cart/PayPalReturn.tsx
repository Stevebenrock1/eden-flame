"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Lock } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { useBag } from "@/lib/bag";
import { ApiError, apiFetch } from "@/lib/session";

/**
 * Confirms a PayPal payment when the shopper returns from PayPal.
 * The server captures the approved payment (it never trusts the browser for the amount),
 * then we show the usual thank-you page. Safe to reload: a second capture is a no-op.
 */
export function PayPalReturn() {
  const params = useSearchParams();
  const router = useRouter();
  const { refresh } = useBag();
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const orderNumber = params.get("order") ?? "";
    const token = params.get("token") ?? "";
    if (!/^EF-[A-Z0-9]{8}$/.test(orderNumber) || !token) {
      setError("This payment link isn't complete. If you were charged, your confirmation email will follow shortly.");
      return;
    }
    apiFetch<{ orderNumber: string; status: "paid" | "pending" }>("/api/checkout/paypal/capture", {
      method: "POST",
      body: JSON.stringify({ orderNumber, token }),
    })
      .then(async (r) => {
        await refresh().catch(() => undefined);
        router.replace(`/checkout/success?order=${encodeURIComponent(r.orderNumber)}`);
      })
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : "We couldn't confirm your payment just now. Please refresh this page in a moment. You won't be charged twice.");
      });
  }, [params, refresh, router]);

  return (
    <div className="container flex min-h-[80svh] flex-col items-center justify-center pb-24 pt-40 text-center">
      {error ? (
        <>
          <p className="eyebrow mb-5">PayPal</p>
          <h1 className="font-serif text-display-md font-light">Payment not completed</h1>
          <p role="alert" className="mt-5 max-w-md text-ivory/60">{error}</p>
          <ButtonLink href="/checkout" className="mt-10">Return to checkout</ButtonLink>
        </>
      ) : (
        <>
          <Lock strokeWidth={1.25} className="mb-8 h-6 w-6 text-champagne" />
          <h1 className="font-serif text-display-md font-light">Confirming your payment</h1>
          <p className="mt-5 max-w-md text-ivory/60" aria-live="polite">One moment while PayPal confirms. Please don&rsquo;t close this page.</p>
        </>
      )}
    </div>
  );
}
