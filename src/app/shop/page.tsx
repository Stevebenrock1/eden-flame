import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopView } from "@/components/shop/ShopView";
import { getProducts } from "@/lib/commerce";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "The Collection",
  description: "Shop Eden Flame: sculptural essentials, silk accessories and aromatics, all shipped discreetly.",
};

export default async function ShopPage() {
  const products = await getProducts();
  return (
    // useSearchParams needs a Suspense boundary for static rendering
    <Suspense fallback={<div className="min-h-screen" />}>
      <ShopView products={products} />
    </Suspense>
  );
}
