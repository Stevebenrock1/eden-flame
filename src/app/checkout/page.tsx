import type { Metadata } from "next";
import { CheckoutView } from "@/components/cart/CheckoutView";
import { getProducts } from "@/lib/commerce";

export const revalidate = 60;

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default async function CheckoutPage() {
  return <CheckoutView products={await getProducts()} />;
}
