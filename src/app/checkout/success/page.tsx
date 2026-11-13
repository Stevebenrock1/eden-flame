import type { Metadata } from "next";
import { OrderConfirmed } from "@/components/cart/OrderConfirmed";

export const metadata: Metadata = { title: "Thank you", robots: { index: false } };

type Search = Promise<{ order?: string }>;

export default async function CheckoutSuccessPage({ searchParams }: { searchParams: Search }) {
  const { order } = await searchParams;
  // Only show something that looks like one of our order numbers.
  const number = order && /^EF-[A-Z0-9]{8}$/.test(order) ? order : null;
  return <OrderConfirmed orderNumber={number} />;
}
