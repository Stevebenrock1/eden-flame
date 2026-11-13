import type { Metadata } from "next";
import { FinderView } from "@/components/finder/FinderView";
import { getProducts } from "@/lib/commerce";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Find your piece",
  description: "Four quiet questions, three considered recommendations. Private, and nothing is saved.",
};

export default async function FindPage() {
  let products: Awaited<ReturnType<typeof getProducts>> = [];
  try {
    products = await getProducts();
  } catch {
    /* API unreachable at build time; the page revalidates within a minute */
  }
  return <FinderView products={products} />;
}
