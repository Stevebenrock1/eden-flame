import { allProducts } from "./products";
import type { Audience, CategorySlug, Colour, Feature, Material, Product } from "./types";

/**
 * Shopify, run "headless": Shopify holds products, stock, orders and payments; this site
 * keeps its own look and reads everything through the Storefront API.
 *
 * Set SHOPIFY_STORE_DOMAIN (e.g. eden-flame.myshopify.com) and SHOPIFY_STOREFRONT_TOKEN
 * (the Storefront API access token from Shopify admin > Settings > Apps > Develop apps).
 *
 * How products map onto the site (so supplier-imported products work without extra setup):
 * - Vendor      -> maker shown above the title ("Eden Flame" for own-label pieces)
 * - Product type -> collection: "Sculptural Essentials", "Silk & Senses" or "Aromatics"
 * - Tags        -> "for:her" / "for:him" / "for:two", "feature:Waterproof", "material:Mulberry silk",
 *                  "badge:New" / "badge:Bestseller" / "badge:Limited"
 * - Option "Colour" (or "Color") -> the colour swatches
 * - Metafields eden.subtitle (text) and eden.specs (JSON list of {label, value}), when present
 * Anything missing falls back to this site's own listing with the same handle, so the
 * launch range looks exactly as it does today.
 */
export const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN?.replace(/\/$/, "") ?? "";
/** https unless a scheme is given (a local test server, for instance). */
const ORIGIN = /^https?:\/\//.test(SHOPIFY_DOMAIN) ? SHOPIFY_DOMAIN : `https://${SHOPIFY_DOMAIN}`;
const TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN ?? "";
const VERSION = process.env.SHOPIFY_API_VERSION ?? "2026-07";
export const shopifyEnabled = Boolean(SHOPIFY_DOMAIN && TOKEN);

async function storefront<T>(query: string, variables: Record<string, unknown> = {}, cache: "catalog" | "none" = "catalog"): Promise<T> {
  const res = await fetch(`${ORIGIN}/api/${VERSION}/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Storefront-Access-Token": TOKEN },
    body: JSON.stringify({ query, variables }),
    ...(cache === "catalog" ? { next: { revalidate: 60, tags: ["catalog"] } } : { cache: "no-store" as const }),
  });
  if (!res.ok) throw new Error(`Shopify responded ${res.status}`);
  const json = (await res.json()) as { data?: T; errors?: { message: string }[] };
  if (json.errors?.length) throw new Error(`Shopify: ${json.errors.map((e) => e.message).join("; ")}`);
  return json.data as T;
}

interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  vendor: string;
  productType: string;
  tags: string[];
  publishedAt: string;
  availableForSale: boolean;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  images: { nodes: { url: string; altText: string | null }[] };
  options: { name: string; optionValues: { name: string; swatch: { color: string | null } | null }[] }[];
  variants: { nodes: { id: string; availableForSale: boolean; selectedOptions: { name: string; value: string }[] }[] };
  subtitle: { value: string } | null;
  specs: { value: string } | null;
}

const PRODUCT_FIELDS = `
  id handle title description vendor productType tags publishedAt availableForSale
  priceRange { minVariantPrice { amount currencyCode } }
  images(first: 10) { nodes { url altText } }
  options { name optionValues { name swatch { color } } }
  variants(first: 50) { nodes { id availableForSale selectedOptions { name value } } }
  subtitle: metafield(namespace: "eden", key: "subtitle") { value }
  specs: metafield(namespace: "eden", key: "specs") { value }
`;

const CATEGORY_OF: Record<string, CategorySlug> = {
  "sculptural essentials": "sculptural-essentials",
  "silk & senses": "silk-and-senses",
  "silk and senses": "silk-and-senses",
  aromatics: "aromatics",
};

const isColourOption = (name: string) => /^colou?r$/i.test(name.trim());
const tagged = (tags: string[], prefix: string) =>
  tags.filter((t) => t.toLowerCase().startsWith(`${prefix}:`)).map((t) => t.slice(prefix.length + 1).trim());

function parseSpecs(raw: string | undefined): Product["specs"] {
  if (!raw) return undefined;
  try {
    const list = JSON.parse(raw) as { label?: string; value?: string }[];
    const ok = list.filter((s) => s.label && s.value) as { label: string; value: string }[];
    return ok.length ? ok : undefined;
  } catch {
    return undefined;
  }
}

function toProduct(s: ShopifyProduct, order: number): Product {
  const local = allProducts.find((p) => p.handle === s.handle);
  const colourOption = s.options.find((o) => isColourOption(o.name));
  const colours: Colour[] | undefined = colourOption?.optionValues.length
    ? colourOption.optionValues.map((v) => ({
        name: v.name,
        hex: v.swatch?.color ?? local?.colors?.find((c) => c.name.toLowerCase() === v.name.toLowerCase())?.hex ?? "#3a3330",
      }))
    : local?.colors;
  const audience = tagged(s.tags, "for").filter((a): a is Audience => ["her", "him", "two"].includes(a));
  const features = tagged(s.tags, "feature") as Feature[];
  const materials = tagged(s.tags, "material") as Material[];
  const badge = tagged(s.tags, "badge")[0] as Product["badge"] | undefined;

  return {
    id: s.id,
    handle: s.handle,
    brand: s.vendor || local?.brand || "Eden Flame",
    title: s.title,
    subtitle: s.subtitle?.value ?? local?.subtitle ?? "",
    description: s.description || local?.description || "",
    category: CATEGORY_OF[s.productType.trim().toLowerCase()] ?? local?.category ?? "sculptural-essentials",
    audience: audience.length ? audience : local?.audience ?? ["two"],
    features: features.length ? features : local?.features ?? [],
    materials: materials.length ? materials : local?.materials ?? [],
    price: { amount: Number(s.priceRange.minVariantPrice.amount), currencyCode: s.priceRange.minVariantPrice.currencyCode },
    images: s.images.nodes.length
      ? s.images.nodes.map((i, n) => ({ src: i.url, alt: i.altText || (n ? `${s.title}, alternate view` : s.title) }))
      : local?.images ?? [{ src: "/media/products/placeholder.jpg", alt: s.title }],
    colors: colours,
    specs: parseSpecs(s.specs?.value) ?? local?.specs,
    badge: badge ?? local?.badge,
    featured: local?.featured ?? order,
    createdAt: (s.publishedAt ?? "").slice(0, 10) || local?.createdAt || "2026-01-01",
    availability: s.availableForSale ? "in_stock" : "sold_out",
    variants: s.variants.nodes.map((v) => ({
      id: v.id,
      available: v.availableForSale,
      color: v.selectedOptions.find((o) => isColourOption(o.name))?.value,
    })),
  };
}

/** Every product published to the site's sales channel, in Shopify's "Best selling" order. */
export async function fetchShopifyProducts(): Promise<Product[]> {
  const all: ShopifyProduct[] = [];
  let after: string | null = null;
  do {
    const data: { products: { nodes: ShopifyProduct[]; pageInfo: { hasNextPage: boolean; endCursor: string | null } } } = await storefront(
      `query Products($after: String) @inContext(country: AU) {
        products(first: 100, after: $after, sortKey: BEST_SELLING) {
          nodes { ${PRODUCT_FIELDS} }
          pageInfo { hasNextPage endCursor }
        }
      }`,
      { after },
    );
    all.push(...data.products.nodes);
    after = data.products.pageInfo.hasNextPage ? data.products.pageInfo.endCursor : null;
  } while (after);
  return all.map((p, i) => toProduct(p, all.length - i));
}

export interface CheckoutLine {
  handle: string;
  quantity: number;
  color?: string;
}

/**
 * Turns the bag into a Shopify cart and returns its secure checkout address.
 * Discretion choices travel as cart attributes, so they show on the order in Shopify admin
 * (and in the supplier's order sync, where their app passes attributes on).
 */
export async function createShopifyCheckout(
  products: Product[],
  lines: CheckoutLine[],
  opts: { plainPackaging: boolean; paperlessReceipt: boolean },
): Promise<{ checkoutUrl: string; cartId: string } | { error: string }> {
  const missing: string[] = [];
  const cartLines = lines.flatMap((l) => {
    const p = products.find((x) => x.handle === l.handle);
    const variant =
      p?.variants?.find((v) => (l.color ? v.color?.toLowerCase() === l.color.toLowerCase() : true) && v.available) ??
      p?.variants?.find((v) => v.available);
    if (!p || !variant) {
      missing.push(p?.title ?? l.handle);
      return [];
    }
    return [{ merchandiseId: variant.id, quantity: Math.max(1, Math.min(10, Math.floor(l.quantity))) }];
  });
  if (missing.length) return { error: `Sorry, these pieces are no longer available: ${missing.join(", ")}. Please remove them from your bag.` };
  if (!cartLines.length) return { error: "Your bag is empty." };

  const data = await storefront<{
    cartCreate: { cart: { id: string; checkoutUrl: string } | null; userErrors: { message: string }[] };
  }>(
    `mutation Checkout($input: CartInput!) @inContext(country: AU) {
      cartCreate(input: $input) { cart { id checkoutUrl } userErrors { message } }
    }`,
    {
      input: {
        lines: cartLines,
        buyerIdentity: { countryCode: "AU" },
        attributes: [
          { key: "Plain shipping label", value: opts.plainPackaging ? "Yes" : "No" },
          { key: "Printed receipt in parcel", value: opts.paperlessReceipt ? "No" : "Yes" },
        ],
      },
    },
    "none",
  );
  const { cart, userErrors } = data.cartCreate;
  if (!cart) return { error: userErrors[0]?.message ?? "We couldn't open checkout just now. Please try again." };
  return { checkoutUrl: cart.checkoutUrl, cartId: cart.id };
}

/** True once a cart has been checked out (Shopify stops returning completed carts). */
export async function isCartCompleted(cartId: string): Promise<boolean> {
  const data = await storefront<{ cart: { id: string } | null }>(`query Cart($id: ID!) { cart(id: $id) { id } }`, { id: cartId }, "none");
  return data.cart === null;
}
