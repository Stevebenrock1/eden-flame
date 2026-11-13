"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { QuickView } from "@/components/product/QuickView";
import type { Product } from "@/lib/commerce";
import { fadeUp, stagger } from "@/lib/motion";

/** A short row of the most-loved pieces: bestsellers first, then the house's featured picks. */
export function MostLoved({ products }: { products: Product[] }) {
  const [quick, setQuick] = useState<Product | null>(null);
  const close = useCallback(() => setQuick(null), []);
  if (!products.length) return null;

  return (
    <section aria-labelledby="loved-heading" className="bg-obsidian py-24 md:py-32">
      <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-10%" }} variants={stagger(0.1, 0)} className="container">
        <div className="mb-12 flex flex-col justify-between gap-6 md:mb-16 md:flex-row md:items-end">
          <div>
            <motion.p variants={fadeUp} className="eyebrow mb-5">Most loved</motion.p>
            <motion.h2 id="loved-heading" variants={fadeUp} className="font-serif text-display-md font-light md:text-display-lg">
              The pieces our clients <em className="text-gold">return to</em>
            </motion.h2>
          </div>
          <motion.div variants={fadeUp}>
            <Link href="/shop" className="group inline-flex items-center gap-2 text-[0.72rem] uppercase tracking-luxe text-ivory/70 transition-colors hover:text-champagne">
              Shop all pieces
              <ArrowUpRight strokeWidth={1.25} className="h-4 w-4 transition-transform duration-500 ease-luxe group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </div>

        <ul className="grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6 lg:grid-cols-4">
          {products.map((p) => (
            <motion.li key={p.id} variants={fadeUp}>
              <ProductCard product={p} onQuickView={setQuick} />
            </motion.li>
          ))}
        </ul>
      </motion.div>
      <QuickView product={quick} onClose={close} />
    </section>
  );
}
