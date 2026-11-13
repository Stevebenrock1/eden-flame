"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TrustRow } from "@/components/home/TrustRow";
import { Check, Minus, Package, Plus, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { Gallery } from "@/components/product/Gallery";
import { ProductCard } from "@/components/product/ProductCard";
import { QuickView } from "@/components/product/QuickView";
import { siteConfig } from "@/config/site";
import { formatPrice, type Product } from "@/lib/commerce";
import { useBag } from "@/lib/bag";
import { cn } from "@/lib/cn";
import { fadeUp, luxeEase, stagger } from "@/lib/motion";

interface Props {
  product: Product;
  specs: { label: string; value: string }[];
  related: Product[];
}

const promises = [
  { icon: Package, title: "Discreet packaging", body: "Shipped in a plain, unbranded outer box with a neutral return address. Nothing on the outside hints at what's inside." },
  { icon: ShieldCheck, title: "Private billing", body: "Your bank statement shows only “EF Studio.” We never share or sell your details." },
  { icon: Truck, title: "Worldwide shipping", body: "Complimentary tracked shipping over $100. Most orders arrive in 2 to 5 business days." },
  { icon: RotateCcw, title: "100-day promise", body: "If it isn't right, return it unopened within 100 days, or contact us about our hygiene-safe exchange." },
];

export function ProductDetail({ product, specs, related }: Props) {
  const { add, error: bagError } = useBag();
  const soldOut = product.availability === "sold_out";
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [showBar, setShowBar] = useState(false);
  const [quick, setQuick] = useState<Product | null>(null);
  const buyRef = useRef<HTMLDivElement>(null);
  const category = siteConfig.categories.find((c) => c.slug === product.category);

  // Reveal the sticky bar once the main Add to Bag button scrolls out of view
  useEffect(() => {
    const el = buyRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShowBar(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const addToBag = () => {
    if (soldOut) return;
    add(product.handle, qty);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2400);
  };

  const AddLabel = () =>
    soldOut ? (
      <span>Sold out</span>
    ) : added ? (
      <span className="flex items-center gap-2">
        <Check strokeWidth={1.5} className="h-4 w-4" /> Added to bag
      </span>
    ) : (
      <span>Add to bag &middot; {formatPrice({ ...product.price, amount: product.price.amount * qty })}</span>
    );

  return (
    <>
      <div className="container pb-24 pt-32 md:pt-40">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 md:mb-8 text-[0.68rem] uppercase tracking-[0.2em] text-ivory/45">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link href="/shop" className="hover:text-champagne">Collection</Link></li>
            <li aria-hidden>/</li>
            {category && (
              <>
                <li><Link href={`/shop?category=${category.slug}`} className="hover:text-champagne">{category.title}</Link></li>
                <li aria-hidden className="hidden sm:list-item">/</li>
              </>
            )}
            <li aria-current="page" className="hidden text-ivory/75 sm:list-item">{product.title}</li>
          </ol>
        </nav>

        <div className="grid gap-10 md:grid-cols-[1.15fr_1fr] lg:gap-20">
          <Gallery images={product.images} title={product.title} />

          {/* Info column stays in view while the gallery scrolls */}
          <div className="md:sticky md:top-28 md:self-start">
            <motion.div initial="hidden" animate="show" variants={stagger(0.1, 0.1)}>
              {(product.brand || product.badge) && (
                <motion.p variants={fadeUp} className="eyebrow mb-4">
                  {[product.brand, product.badge].filter(Boolean).join(" · ")}
                </motion.p>
              )}
              <motion.h1 variants={fadeUp} className="font-serif text-display-lg font-light">{product.title}</motion.h1>
              <motion.p variants={fadeUp} className="mt-2 text-ivory/60">{product.subtitle}</motion.p>
              <motion.p variants={fadeUp} className="mt-6 text-2xl text-champagne-light">{formatPrice(product.price)}</motion.p>
              <motion.p variants={fadeUp} className="mt-8 max-w-md leading-relaxed text-ivory/75">{product.description}</motion.p>

              <motion.div variants={fadeUp} ref={buyRef} className="mt-10 flex gap-3">
                <div className="flex items-center border border-ivory/20" role="group" aria-label="Quantity">
                  <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-14 w-11 place-items-center text-ivory/70 hover:text-champagne">
                    <Minus strokeWidth={1.25} className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-6 text-center text-sm" aria-live="polite">{qty}</span>
                  <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(9, q + 1))} className="grid h-14 w-11 place-items-center text-ivory/70 hover:text-champagne">
                    <Plus strokeWidth={1.25} className="h-3.5 w-3.5" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={addToBag}
                  disabled={soldOut}
                  className="flex h-14 flex-1 disabled:cursor-not-allowed disabled:opacity-50 items-center justify-center gold-foil text-[0.75rem] uppercase tracking-luxe text-obsidian transition-all duration-500"
                >
                  <AddLabel />
                </button>
              </motion.div>
              {product.availability === "low_stock" && <motion.p variants={fadeUp} className="mt-4 text-xs text-rosegold">Only a few left</motion.p>}
              {bagError && <p role="alert" className="mt-4 text-xs text-rosegold">{bagError}</p>}
              <motion.p variants={fadeUp} className="mt-4 flex items-center gap-2 text-xs text-ivory/50">
                <Package strokeWidth={1.25} className="h-3.5 w-3.5" />
                Ships in plain, unmarked packaging &middot; Billed as &ldquo;EF Studio&rdquo;
              </motion.p>
              <motion.div variants={fadeUp} className="mt-8 border-y border-ivory/[0.08] py-6">
                <TrustRow compact />
              </motion.div>

              {/* Materials & specifications */}
              <motion.div variants={fadeUp} className="mt-12">
                <h2 className="eyebrow mb-4">Materials &amp; specifications</h2>
                <dl className="divide-y divide-ivory/[0.08] border-y border-ivory/[0.08] text-sm">
                  {specs.map((s) => (
                    <div key={s.label} className="grid grid-cols-[9rem_1fr] gap-4 py-3.5">
                      <dt className="text-ivory/45">{s.label}</dt>
                      <dd className="text-ivory/85">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              </motion.div>

              {/* Discretion & delivery promises */}
              <motion.div variants={fadeUp} className="mt-12">
                <h2 className="eyebrow mb-4">Our promise to you</h2>
                <div className="divide-y divide-ivory/[0.08] border-y border-ivory/[0.08]">
                  {promises.map((p, i) => (
                    <Accordion key={p.title} icon={p.icon} title={p.title} defaultOpen={i === 0}>
                      {p.body}
                    </Accordion>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* You may also like */}
      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="border-t border-ivory/[0.06] py-24">
          <div className="container">
            <p className="eyebrow mb-4">Complete the ritual</p>
            <h2 id="related-heading" className="mb-12 font-serif text-display-md font-light">You may also like</h2>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6 lg:grid-cols-4">
              {related.map((p) => (
                <li key={p.id}>
                  <ProductCard product={p} onQuickView={setQuick} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Sticky Add to Bag bar */}
      <AnimatePresence>
        {showBar && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.6, ease: luxeEase }}
            className="fixed inset-x-0 bottom-0 z-40 border-t border-ivory/10 bg-obsidian/80 backdrop-blur-xl"
          >
            <div className="container flex items-center gap-4 py-3">
              <div className="hidden min-w-0 flex-1 sm:block">
                <p className="truncate font-serif text-lg">{product.title}</p>
                <p className="truncate text-xs text-ivory/50">{product.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={addToBag}
                disabled={soldOut}
                className="flex h-12 flex-1 disabled:cursor-not-allowed disabled:opacity-50 items-center justify-center gold-foil px-8 text-[0.72rem] uppercase tracking-luxe text-obsidian sm:flex-none"
              >
                <AddLabel />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <QuickView product={quick} onClose={() => setQuick(null)} />
    </>
  );
}

function Accordion({
  icon: Icon,
  title,
  children,
  defaultOpen = false,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 py-4 text-left text-sm text-ivory/85 hover:text-champagne"
      >
        <Icon strokeWidth={1.1} className="h-4 w-4 text-champagne" />
        <span className="flex-1">{title}</span>
        <Plus strokeWidth={1.25} className={cn("h-3.5 w-3.5 transition-transform duration-500 ease-luxe", open && "rotate-45")} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: luxeEase }}
            className="overflow-hidden"
          >
            <p className="pb-5 pl-7 text-sm leading-relaxed text-ivory/60">{children}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
