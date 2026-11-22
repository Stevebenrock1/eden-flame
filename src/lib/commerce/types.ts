/**
 * Commerce types, filled from Shopify (see shopify.ts), the Eden Flame API (see api.ts) or the sample catalog.
 */
export type CategorySlug = "sculptural-essentials" | "silk-and-senses" | "aromatics";

/** Who a piece is for. A piece can suit more than one. */
export type Audience = "her" | "him" | "two";

export type Feature = "App controlled" | "Remote controlled" | "Hands-free" | "Waterproof" | "Rechargeable" | "Warming";

export type Material =
  | "Medical-grade silicone"
  | "24k gold plating"
  | "Borosilicate glass"
  | "Mulberry silk"
  | "Plant-based botanicals"
  | "Body-safe ABS";

/** A colourway a customer can choose. */
export interface Colour {
  name: string;
  /** Swatch fill; a CSS colour or gradient. */
  hex: string;
}

export interface Money {
  amount: number;
  /** Shown as a plain "$" whatever the code (see formatPrice). */
  currencyCode: string;
}

export interface Product {
  id: string;
  handle: string;
  /** Maker shown above the title. Eden Flame for our own pieces. */
  brand?: string;
  title: string;
  subtitle: string;
  description: string;
  category: CategorySlug;
  audience: Audience[];
  features: Feature[];
  materials: Material[];
  price: Money;
  images: { src: string; alt: string }[];
  /** Colourways, first is the default. Absent or one entry: no choice is shown. */
  colors?: Colour[];
  /** Spec sheet for the product page; falls back to the category defaults when absent. */
  specs?: { label: string; value: string }[];
  badge?: "New" | "Bestseller" | "Limited";
  /** Higher sorts first under "Featured". */
  featured: number;
  /** ISO date, used for "Newest" sorting. */
  createdAt: string;
  /** Stock state from the API (exact counts are never exposed). Absent in mock mode. */
  availability?: "in_stock" | "low_stock" | "sold_out";
  /** Shopify variants (one per colourway), used to build the Shopify cart. Shopify mode only. */
  variants?: { id: string; available: boolean; color?: string }[];
}
