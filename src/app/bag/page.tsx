import type { Metadata } from "next";
import { Suspense } from "react";
import { BagView } from "@/components/cart/BagView";
import { getProducts } from "@/lib/commerce";

export const revalidate = 60;

export const metadata: Metadata = { title: "Your Bag", robots: { index: false } };

export default async function BagPage() {
  const products = await getProducts();
  return (
    // BagView reads ?checkout=cancelled, which needs a Suspense boundary for static rendering
    <Suspense fallback={<div className="min-h-[80svh]" />}>
      <BagView products={products} />
    </Suspense>
  );
}
