"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { fadeUp, stagger } from "@/lib/motion";

export function CategoryGrid() {
  return (
    <section aria-labelledby="categories-heading" className="bg-obsidian py-24 md:py-36">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-15%" }}
        variants={stagger(0.15, 0)}
        className="container"
      >
        <div className="mb-14 flex flex-col justify-between gap-6 md:mb-20 md:flex-row md:items-end">
          <div>
            <motion.p variants={fadeUp} className="eyebrow mb-5">
              The Collections
            </motion.p>
            <motion.h2 id="categories-heading" variants={fadeUp} className="font-serif text-display-lg font-light">
              Composed for the <em className="text-gold">senses</em>
            </motion.h2>
          </div>
          <motion.div variants={fadeUp}>
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 text-[0.72rem] uppercase tracking-luxe text-ivory/70 transition-colors hover:text-champagne"
            >
              View all pieces
              <ArrowUpRight strokeWidth={1.25} className="h-4 w-4 transition-transform duration-500 ease-luxe group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </div>

        <ul className="grid gap-5 md:grid-cols-3 md:gap-6">
          {siteConfig.categories.map((cat, i) => (
            <motion.li key={cat.slug} variants={fadeUp} className={i === 1 ? "md:mt-16" : undefined}>
              <Link href={`/shop?category=${cat.slug}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden bg-charcoal">
                  <Image
                    src={cat.image}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-[1.6s] ease-luxe group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-transparent" />
                  <span className="absolute left-6 top-6 font-serif text-sm italic text-champagne/80">
                    0{i + 1}
                  </span>
                  <div className="absolute inset-x-6 bottom-6">
                    <h3 className="font-serif text-3xl font-light text-ivory md:text-[2.1rem]">{cat.title}</h3>
                    <p className="mt-2 max-w-[28ch] text-sm text-ivory/65">{cat.blurb}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-[0.68rem] uppercase tracking-luxe text-champagne opacity-0 transition-all duration-700 ease-luxe group-hover:opacity-100 group-focus-visible:opacity-100 max-md:opacity-100">
                      Discover
                      <span className="h-px w-8 bg-champagne transition-all duration-700 ease-luxe group-hover:w-14" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}
