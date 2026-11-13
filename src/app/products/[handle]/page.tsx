import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product/ProductDetail";
import { getProduct, getProducts, getSpecs } from "@/lib/commerce";

type Params = Promise<{ handle: string }>;

// Pages refresh every minute so prices and stock stay current; new products render on first visit.
export const revalidate = 60;

export async function generateStaticParams() {
  try {
    return (await getProducts()).map((p) => ({ handle: p.handle }));
  } catch {
    return []; // API unreachable at build time: render each product on first request instead
  }
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const product = await getProduct((await params).handle);
  if (!product) return {};
  return {
    title: `${product.title}, ${product.subtitle}`,
    description: product.description,
    openGraph: { images: [product.images[0].src] },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) notFound();

  const all = await getProducts();
  // Same collection first, then best-featured from elsewhere
  const related = [
    ...all.filter((p) => p.category === product.category && p.id !== product.id),
    ...all.filter((p) => p.category !== product.category).sort((a, b) => b.featured - a.featured),
  ].slice(0, 4);

  return <ProductDetail product={product} specs={getSpecs(product)} related={related} />;
}
