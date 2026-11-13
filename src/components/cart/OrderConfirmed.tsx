"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { useBag } from "@/lib/bag";

/**
 * Shown when Stripe returns the customer after payment. The order is confirmed by
 * Stripe's webhook on the server, which also empties the bag; we re-read the bag a
 * couple of times so the count in the header clears as soon as that lands.
 */
export function OrderConfirmed({ orderNumber }: { orderNumber: string | null }) {
  const { refresh } = useBag();

  useEffect(() => {
    void refresh();
    const timers = [2000, 6000].map((ms) => window.setTimeout(() => void refresh(), ms));
    return () => timers.forEach(clearTimeout);
  }, [refresh]);

  return (
    <div className="container flex min-h-[80svh] flex-col items-center justify-center pb-24 pt-40 text-center">
      <motion.span initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mb-8 grid h-16 w-16 place-items-center rounded-full border border-champagne/40 text-champagne">
        <Check strokeWidth={1.25} className="h-6 w-6" />
      </motion.span>
      {orderNumber && <p className="eyebrow mb-5">Order {orderNumber}</p>}
      <h1 className="font-serif text-display-lg font-light">Thank you</h1>
      <p className="mt-5 max-w-md text-ivory/60">
        Your order is being prepared with care. It will arrive in plain packaging, and a discreet confirmation from
        &ldquo;EF Studio&rdquo; is on its way to your inbox.
      </p>
      <ButtonLink href="/" variant="ghost" className="mt-10">Return home</ButtonLink>
    </div>
  );
}
