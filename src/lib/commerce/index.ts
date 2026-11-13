import { cache } from "react";
import { API_URL, fetchAllProducts } from "./api";
import { products } from "./products";
import type { Audience, CategorySlug, Feature, Material, Product } from "./types";

export * from "./types";

/**
 * The single entry point for product data.
 * With EDEN_API_URL set, products come from the Eden Flame API; without it the
 * built-in sample catalog is used (handy for design work with no backend running).
 */
export const getProducts = cache(async (): Promise<Product[]> => (API_URL ? fetchAllProducts() : products));

export async function getProduct(handle: string): Promise<Product | undefined> {
  return (await getProducts()).find((p) => p.handle === handle);
}

export const MATERIALS: Material[] = [
  "Medical-grade silicone",
  "24k gold plating",
  "Borosilicate glass",
  "Mulberry silk",
  "Plant-based botanicals",
  "Body-safe ABS",
];

export const AUDIENCES: Audience[] = ["her", "him", "two"];

export const FEATURES: Feature[] = ["App controlled", "Remote controlled", "Hands-free", "Waterproof", "Rechargeable", "Warming"];

/** Every maker in the catalogue, Eden Flame first, then alphabetical. */
export function brandsOf(list: Product[]): string[] {
  const all = [...new Set(list.map((p) => p.brand ?? "Eden Flame"))];
  return all.sort((a, b) => (a === "Eden Flame" ? -1 : b === "Eden Flame" ? 1 : a.localeCompare(b)));
}

export const PRICE_RANGES = [
  { id: "under-100", label: "Under $100", min: 0, max: 99.99 },
  { id: "100-250", label: "$100 to $250", min: 100, max: 250 },
  { id: "over-250", label: "Over $250", min: 250.01, max: Infinity },
] as const;

export type PriceRangeId = (typeof PRICE_RANGES)[number]["id"];

export const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "newest", label: "Newest" },
  { id: "price-asc", label: "Price, low to high" },
  { id: "price-desc", label: "Price, high to low" },
] as const;

export type SortId = (typeof SORTS)[number]["id"];

export interface ProductFilters {
  categories: CategorySlug[];
  materials: Material[];
  brands?: string[];
  /** Matches pieces for any of these people. */
  audience?: Audience[];
  /** Matches pieces that have every one of these features. */
  features?: Feature[];
  prices: PriceRangeId[];
  sort: SortId;
  /** Free-text search across name, description and materials. */
  q?: string;
}

/** Pure filter + sort, shared by the client UI and (later) server rendering. */
export function filterProducts(list: Product[], f: ProductFilters): Product[] {
  const terms = (f.q ?? "").toLowerCase().split(/\s+/).filter(Boolean);
  const out = list.filter((p) => {
    if (terms.length) {
      const hay = [p.brand ?? "", p.title, p.subtitle, p.description, ...p.materials].join(" ").toLowerCase();
      if (!terms.every((t) => hay.includes(t))) return false;
    }
    if (f.categories.length && !f.categories.includes(p.category)) return false;
    if (f.materials.length && !p.materials.some((m) => f.materials.includes(m))) return false;
    if (f.brands?.length && !f.brands.includes(p.brand ?? "Eden Flame")) return false;
    if (f.audience?.length && !p.audience.some((a) => f.audience!.includes(a))) return false;
    if (f.features?.length && !f.features.every((x) => p.features.includes(x))) return false;
    if (f.prices.length) {
      const ok = f.prices.some((id) => {
        const r = PRICE_RANGES.find((x) => x.id === id)!;
        return p.price.amount >= r.min && p.price.amount <= r.max;
      });
      if (!ok) return false;
    }
    return true;
  });

  const sorters: Record<SortId, (a: Product, b: Product) => number> = {
    featured: (a, b) => b.featured - a.featured,
    newest: (a, b) => b.createdAt.localeCompare(a.createdAt),
    "price-asc": (a, b) => a.price.amount - b.price.amount,
    "price-desc": (a, b) => b.price.amount - a.price.amount,
  };
  return [...out].sort(sorters[f.sort]);
}

export function formatPrice({ amount, currencyCode }: { amount: number; currencyCode: string }) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currencyCode, maximumFractionDigits: 0 }).format(amount);
}

/** Spec sheet shown on the product page. Product metadata from the API can supply these later. */
export function getSpecs(p: Product): { label: string; value: string }[] {
  if (p.specs?.length) return [{ label: "Maker", value: p.brand ?? "Eden Flame" }, { label: "Material", value: p.materials.join(", ") }, ...p.specs];
  const material = p.materials.join(", ");
  switch (p.category) {
    case "sculptural-essentials":
      return [
        { label: "Material", value: material },
        { label: "Finish", value: p.materials.includes("24k gold plating") ? "Hand-polished 24k gold over surgical steel" : "Satin-touch, non-porous" },
        { label: "Water resistance", value: p.materials.includes("Borosilicate glass") ? "Fully waterproof" : "IPX7, fully submersible" },
        { label: "Power", value: p.materials.includes("Borosilicate glass") || p.handle === "halo" ? "None required" : "USB magnetic charging, up to 2 hours use" },
        { label: "Noise", value: "Under 40 dB, whisper-quiet" },
        { label: "Warranty", value: "2 years" },
      ];
    case "silk-and-senses":
      return [
        { label: "Material", value: material },
        { label: "Weight", value: p.materials.includes("Mulberry silk") ? "22 momme, grade 6A" : "Lightweight, balanced handle" },
        { label: "Care", value: "Hand wash cold, dry flat" },
        { label: "Presentation", value: "Silk pouch in a plain keepsake box" },
      ];
    case "aromatics":
      return [
        { label: "Ingredients", value: "Plant-based, vegan, paraben-free" },
        { label: "Size", value: p.handle === "ember" ? "200 g, 40-hour burn" : "100 ml" },
        { label: "Skin safety", value: "Dermatologically tested" },
        { label: "Made in", value: "Small batches, hand-poured" },
      ];
  }
}
