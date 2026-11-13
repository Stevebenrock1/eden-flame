"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, X } from "lucide-react";
import { DiscretionPromise } from "@/components/cart/DiscretionPromise";
import { useBagLines } from "@/components/cart/useBagLines";
import { ButtonLink } from "@/components/ui/Button";
import { formatPrice, type Product } from "@/lib/commerce";
import { useBag } from "@/lib/bag";
import { luxeEase } from "@/lib/motion";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/pricing";

const usd = (amount: number) => formatPrice({ amount, currencyCode: "USD" });

export function BagView({ products }: { products: Product[] }) {
  const { setQuantity, remove, count, ready, error } = useBag();
  const cancelled = useSearchParams().get("checkout") === "cancelled";
  const { items, subtotal, shipping, total } = useBagLines(products);
  const toFree = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  if (!ready) return <div className="min-h-[80svh]" aria-busy="true" />;

  if (items.length === 0) {
    return (
      <div className="container flex min-h-[80svh] flex-col items-center justify-center pb-24 pt-40 text-center">
        <p className="eyebrow mb-5">Your bag</p>
        <h1 className="font-serif text-display-lg font-light">Quietly empty</h1>
        <p className="mt-5 max-w-sm text-ivory/60">Nothing here yet. Take your time and explore the collection.</p>
        <ButtonLink href="/shop" className="mt-10">Explore the Collection</ButtonLink>
      </div>
    );
  }

  return (
    <div className="container pb-28 pt-36 md:pt-44">
      <p className="eyebrow mb-5">Your bag</p>
      <h1 className="mb-12 font-serif text-display-lg font-light">
        {count} {count === 1 ? "piece" : "pieces"}, chosen with care
      </h1>
      {cancelled && !error && (
        <p role="status" className="-mt-6 mb-10 border-l border-champagne/60 pl-4 text-sm text-ivory/70">
          Payment wasn&rsquo;t completed, so nothing was charged. Your pieces are still here whenever you&rsquo;re ready.
        </p>
      )}
      {error && <p role="alert" className="-mt-6 mb-10 border-l border-rosegold pl-4 text-sm text-rosegold">{error}</p>}

      <div className="grid gap-14 lg:grid-cols-[1fr_380px] lg:gap-20">
        <ul className="divide-y divide-ivory/[0.08] border-y border-ivory/[0.08]">
          <AnimatePresence initial={false}>
            {items.map(({ product: p, quantity }) => (
              <motion.li
                key={p.handle}
                layout
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5, ease: luxeEase }}
                className="flex gap-5 py-6 md:gap-8"
              >
                <Link href={`/products/${p.handle}`} className="relative aspect-[4/5] w-24 shrink-0 overflow-hidden bg-charcoal md:w-32">
                  <Image src={p.images[0].src} alt={p.images[0].alt} fill sizes="128px" className="object-cover" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-serif text-2xl font-normal">
                        <Link href={`/products/${p.handle}`} className="hover:text-champagne">{p.title}</Link>
                      </h2>
                      <p className="mt-1 text-xs text-ivory/50">{p.subtitle}</p>
                    </div>
                    <button type="button" onClick={() => remove(p.handle)} aria-label={`Remove ${p.title}`} className="p-1 text-ivory/40 hover:text-champagne">
                      <X strokeWidth={1.25} className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-auto flex items-end justify-between pt-6">
                    <div className="flex items-center border border-ivory/15" role="group" aria-label={`Quantity of ${p.title}`}>
                      <button type="button" aria-label="Decrease" onClick={() => setQuantity(p.handle, quantity - 1)} className="grid h-10 w-9 place-items-center text-ivory/60 hover:text-champagne">
                        <Minus strokeWidth={1.25} className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center text-sm">{quantity}</span>
                      <button type="button" aria-label="Increase" onClick={() => setQuantity(p.handle, Math.min(9, quantity + 1))} className="grid h-10 w-9 place-items-center text-ivory/60 hover:text-champagne">
                        <Plus strokeWidth={1.25} className="h-3 w-3" />
                      </button>
                    </div>
                    <p className="text-sm">{usd(p.price.amount * quantity)}</p>
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="border border-ivory/10 bg-obsidian-800 p-7">
            {/* Free shipping progress */}
            <p className="text-xs text-ivory/60">
              {toFree > 0 ? <>You&rsquo;re {usd(toFree)} away from complimentary shipping.</> : "Your order ships complimentary."}
            </p>
            <div className="mt-3 h-px w-full bg-ivory/10">
              <motion.div
                className="h-px bg-gold-foil"
                initial={false}
                animate={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
                transition={{ duration: 0.8, ease: luxeEase }}
              />
            </div>

            <dl className="mt-8 space-y-3 text-sm">
              <div className="flex justify-between"><dt className="text-ivory/60">Subtotal</dt><dd>{usd(subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-ivory/60">Shipping</dt><dd>{shipping === 0 ? "Complimentary" : usd(shipping)}</dd></div>
              <div className="flex justify-between border-t border-ivory/10 pt-4 text-base"><dt>Total</dt><dd>{usd(total)}</dd></div>
            </dl>
            <p className="mt-2 text-xs text-ivory/40">Taxes calculated at checkout.</p>

            <ButtonLink href="/checkout" className="mt-8 w-full">Proceed to checkout</ButtonLink>
            <Link href="/shop" className="mt-4 block text-center text-[0.7rem] uppercase tracking-luxe text-ivory/55 hover:text-champagne">
              Continue browsing
            </Link>

            <div className="mt-8 border-t border-ivory/10 pt-7">
              <DiscretionPromise compact />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
