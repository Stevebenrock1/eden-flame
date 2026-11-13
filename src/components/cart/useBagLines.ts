"use client";

import { useMemo } from "react";
import type { Product } from "@/lib/commerce";
import { useBag } from "@/lib/bag";
import { shippingFor } from "@/lib/pricing";

/** Joins bag lines with product data and works out the totals. */
export function useBagLines(products: Product[]) {
  const { lines } = useBag();
  return useMemo(() => {
    const items = lines
      .map((l) => ({ ...l, product: products.find((p) => p.handle === l.handle) }))
      .filter((l): l is typeof l & { product: Product } => Boolean(l.product));
    const subtotal = items.reduce((n, l) => n + l.product.price.amount * l.quantity, 0);
    const shipping = shippingFor(subtotal);
    return { items, subtotal, shipping, total: subtotal + shipping };
  }, [lines, products]);
}
