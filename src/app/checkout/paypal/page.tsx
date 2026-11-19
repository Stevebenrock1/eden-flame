import type { Metadata } from "next";
import { Suspense } from "react";
import { PayPalReturn } from "@/components/cart/PayPalReturn";

export const metadata: Metadata = { title: "Confirming payment", robots: { index: false } };

/** PayPal sends the shopper back here (?order=EF-…&token=<PayPal order id>) after they approve the payment. */
export default function PayPalReturnPage() {
  return (
    <Suspense fallback={<div className="min-h-[80svh]" aria-busy="true" />}>
      <PayPalReturn />
    </Suspense>
  );
}
