"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye } from "lucide-react";
import { formatPrice, type Product } from "@/lib/commerce";
import { ColourDots } from "@/components/product/ColourSwatches";

interface Props {
  product: Product;
  onQuickView: (p: Product) => void;
  priority?: boolean;
}

export function ProductCard({ product, onQuickView, priority }: Props) {
  const [front, back] = product.images;
  return (
    <article className="group relative">
      <div className="relative aspect-[4/5] overflow-hidden bg-charcoal">
        <Link href={`/products/${product.handle}`} aria-label={product.title} className="absolute inset-0 z-[1]">
          <Image
            src={front.src}
            alt={front.alt}
            fill
            priority={priority}
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="object-cover transition-all duration-[1.2s] ease-luxe group-hover:scale-[1.04] group-hover:opacity-0"
          />
          {back && (
            <Image
              src={back.src}
              alt=""
              fill
              sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
              className="scale-[1.04] object-cover opacity-0 transition-all duration-[1.2s] ease-luxe group-hover:scale-100 group-hover:opacity-100"
            />
          )}
        </Link>

        {product.badge && (
          <span className="pointer-events-none absolute left-3 top-3 z-[2] border border-champagne/40 bg-obsidian/50 px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.2em] text-champagne backdrop-blur-sm">
            {product.badge}
          </span>
        )}

        {/* Quick view slides up on hover (always visible on touch screens) */}
        <button
          type="button"
          onClick={() => onQuickView(product)}
          className="absolute inset-x-3 bottom-3 z-[2] flex translate-y-0 items-center justify-center gap-2 bg-ivory/90 py-3 text-[0.65rem] uppercase tracking-luxe text-obsidian opacity-100 backdrop-blur-md transition-all duration-500 ease-luxe hover:bg-champagne focus-visible:translate-y-0 focus-visible:opacity-100 md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
        >
          <Eye strokeWidth={1.25} className="h-3.5 w-3.5" />
          Quick view
          <span className="sr-only">of {product.title}</span>
        </button>
      </div>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          {product.brand && <p className="mb-1 text-[0.62rem] uppercase tracking-[0.22em] text-champagne/80">{product.brand}</p>}
          <h3 className="font-serif text-xl font-normal text-ivory">
            <Link href={`/products/${product.handle}`} className="hover:text-champagne">
              {product.title}
            </Link>
          </h3>
          <p className="mt-1 text-xs text-ivory/55">{product.subtitle}</p>
        </div>
        <p className="shrink-0 text-sm text-champagne-light">{formatPrice(product.price)}</p>
      </div>
      <div className="mt-2 flex items-center justify-between gap-3">
        <p className="text-[0.65rem] uppercase tracking-[0.16em] text-ivory/35">{product.materials.join(" · ")}</p>
        {product.colors && product.colors.length > 1 && <ColourDots colors={product.colors} />}
      </div>
    </article>
  );
}
