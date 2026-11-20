"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Package, X } from "lucide-react";
import { formatPrice, type Product } from "@/lib/commerce";
import { useBag } from "@/lib/bag";
import { ColourSwatches } from "@/components/product/ColourSwatches";
import { luxeEase } from "@/lib/motion";

export function QuickView({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const { add } = useBag();
  const [added, setAdded] = useState(false);
  const [colour, setColour] = useState("");
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!product) return;
    setAdded(false);
    setColour(product.colors?.[0]?.name ?? "");
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [product, onClose]);

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-obsidian/70 backdrop-blur-md md:items-center md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="qv-title"
            className="relative grid max-h-[92svh] w-full max-w-4xl overflow-y-auto border border-ivory/10 bg-obsidian-800 shadow-soft md:grid-cols-2"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.6, ease: luxeEase }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close quick view"
              className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center text-ivory/70 hover:text-champagne"
            >
              <X strokeWidth={1.25} className="h-5 w-5" />
            </button>

            <div className="relative aspect-[4/5] bg-charcoal">
              <Image src={product.images[0].src} alt={product.images[0].alt} fill sizes="(min-width: 768px) 450px, 100vw" className="object-cover" />
            </div>

            <div className="flex flex-col p-7 md:p-10">
              <p className="eyebrow mb-4">{product.brand ?? product.materials.join(" · ")}</p>
              <h2 id="qv-title" className="font-serif text-4xl font-light">
                {product.title}
              </h2>
              <p className="mt-1 text-sm text-ivory/55">{product.subtitle}</p>
              <p className="mt-6 text-xl">{formatPrice(product.price)}</p>
              <p className="mt-6 text-sm leading-relaxed text-ivory/70">{product.description}</p>

              {product.colors && product.colors.length > 1 && (
                <ColourSwatches className="mt-8" colors={product.colors} value={colour} onChange={(c) => { setColour(c); setAdded(false); }} name={`qv-colour-${product.handle}`} />
              )}

              <div className="mt-auto pt-10">
                <button
                  type="button"
                  disabled={product.availability === "sold_out"}
                  onClick={() => {
                    add(product.handle, 1, colour || undefined);
                    setAdded(true);
                  }}
                  className="flex w-full disabled:cursor-not-allowed disabled:opacity-50 items-center justify-center gap-2 gold-foil py-4 text-[0.75rem] uppercase tracking-luxe text-obsidian transition-colors"
                >
                  {product.availability === "sold_out" ? (
                    "Sold out"
                  ) : added ? (
                    <>
                      <Check strokeWidth={1.5} className="h-4 w-4" /> Added to bag
                    </>
                  ) : (
                    "Add to bag"
                  )}
                </button>
                <Link
                  href={`/products/${product.handle}`}
                  className="mt-4 block text-center text-[0.7rem] uppercase tracking-luxe text-ivory/60 underline-offset-4 hover:text-champagne hover:underline"
                >
                  View full details
                </Link>
                <p className="mt-6 flex items-center justify-center gap-2 text-xs text-ivory/45">
                  <Package strokeWidth={1.25} className="h-3.5 w-3.5" />
                  Ships in plain, unmarked packaging
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
