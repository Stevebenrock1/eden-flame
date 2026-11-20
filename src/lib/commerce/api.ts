import type { Audience, CategorySlug, Feature, Material, Product } from "./types";

/**
 * Server-side client for the Eden Flame API (eden-flame-api).
 * Product data is fetched on the server with a short revalidation window, so pages stay
 * fast and static-like while stock and prices refresh within a minute.
 */
export const API_URL = process.env.EDEN_API_URL?.replace(/\/$/, "") ?? "";

interface ApiProduct {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string;
  price: { amountCents: number; currency: string };
  materials: string[];
  category: { slug: string; name: string } | null;
  availability: "in_stock" | "low_stock" | "sold_out";
  metadata: { images?: { src: string; alt: string }[]; badge?: Product["badge"] | null; brand?: string; specs?: Product["specs"]; colors?: Product["colors"]; audience?: Audience[]; features?: Feature[] } | null;
  createdAt: string;
}

interface ApiPage {
  items: ApiProduct[];
  total: number;
  page: number;
  pageSize: number;
}

const PAGE_SIZE = 48;

function toProduct(p: ApiProduct, featured: number): Product {
  const images = p.metadata?.images?.length ? p.metadata.images : [{ src: "/media/products/placeholder.jpg", alt: p.title }];
  return {
    id: p.id,
    handle: p.slug,
    brand: p.metadata?.brand ?? "Eden Flame",
    title: p.title,
    subtitle: p.subtitle ?? "",
    description: p.description,
    category: (p.category?.slug ?? "sculptural-essentials") as CategorySlug,
    audience: p.metadata?.audience?.length ? p.metadata.audience : ["two"],
    features: p.metadata?.features ?? [],
    materials: p.materials as Material[],
    price: { amount: p.price.amountCents / 100, currencyCode: "USD" },
    images,
    badge: p.metadata?.badge ?? undefined,
    specs: p.metadata?.specs?.length ? p.metadata.specs : undefined,
    colors: p.metadata?.colors?.length ? p.metadata.colors : undefined,
    featured,
    createdAt: p.createdAt.slice(0, 10),
    availability: p.availability,
  };
}

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { next: { revalidate: 60, tags: ["catalog"] } });
  if (!res.ok) throw new Error(`Eden Flame API ${path} responded ${res.status}`);
  return (await res.json()) as T;
}

/** Every active product, in the API's featured order (which becomes the `featured` score). */
export async function fetchAllProducts(): Promise<Product[]> {
  const all: ApiProduct[] = [];
  for (let page = 1; ; page++) {
    const data = await getJson<ApiPage>(`/api/products?sort=featured&pageSize=${PAGE_SIZE}&page=${page}`);
    all.push(...data.items);
    if (all.length >= data.total || data.items.length === 0) break;
  }
  return all.map((p, i) => toProduct(p, all.length - i));
}
