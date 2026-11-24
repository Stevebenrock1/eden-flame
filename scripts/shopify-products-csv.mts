/**
 * Writes the launch range as a Shopify product import file.
 *   node --experimental-strip-types scripts/shopify-products-csv.mts > shopify-products.csv
 * Then in Shopify admin: Products > Import > choose the file.
 *
 * - Colourways become variants of a "Colour" option (the site's swatches read them back).
 * - Audience, features, materials and badges become tags (for:her, feature:Waterproof, ...).
 * - Own photos are linked from the live site so Shopify copies them in. Pieces shown with
 *   borrowed retailer photos get no image here; the site keeps showing its current photo
 *   until you upload the maker's official one in Shopify.
 * - Stock isn't tracked, which suits dropshipping (the supplier's app manages its own items).
 * - Prices are the site's current prices, entered as AUD. Check them before launch.
 */
import { LAUNCH_RANGE, allProducts } from "../src/lib/commerce/products.ts";

const SITE = "https://www.edenflame.com.au";
const TYPE: Record<string, string> = {
  "sculptural-essentials": "Sculptural Essentials",
  "silk-and-senses": "Silk & Senses",
  aromatics: "Aromatics",
};

const cols = [
  "Handle", "Title", "Body (HTML)", "Vendor", "Type", "Tags", "Published",
  "Option1 Name", "Option1 Value", "Variant SKU", "Variant Inventory Tracker", "Variant Inventory Policy",
  "Variant Fulfillment Service", "Variant Price", "Variant Requires Shipping", "Variant Taxable",
  "Image Src", "Image Position", "Image Alt Text", "Status",
] as const;
type Row = Partial<Record<(typeof cols)[number], string>>;

const esc = (v: string | undefined) => (v === undefined ? "" : /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
const html = (s: string) => `<p>${s.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</p>`;
const sku = (handle: string, colour?: string) =>
  `EF-${handle}${colour ? `-${colour}` : ""}`.toUpperCase().replace(/[^A-Z0-9]+/g, "-").slice(0, 60);

const rows: Row[] = [];
for (const p of allProducts.filter((x) => LAUNCH_RANGE.has(x.handle))) {
  const tags = [
    ...p.audience.map((a) => `for:${a}`),
    ...p.features.map((f) => `feature:${f}`),
    ...p.materials.map((m) => `material:${m}`),
    ...(p.badge ? [`badge:${p.badge}`] : []),
  ].join(", ");
  const ownPhotos = p.images.filter((i) => i.src.startsWith("/"));
  const colours = p.colors?.length ? p.colors.map((c) => c.name) : [undefined];
  const n = Math.max(colours.length, ownPhotos.length);
  for (let i = 0; i < n; i++) {
    const colour = colours[i];
    const img = ownPhotos[i];
    const row: Row = { Handle: p.handle };
    if (i === 0)
      Object.assign(row, {
        Title: p.title, "Body (HTML)": html(p.description), Vendor: p.brand ?? "Eden Flame", Type: TYPE[p.category],
        Tags: tags, Published: "TRUE", "Option1 Name": p.colors?.length ? "Colour" : "Title", Status: "active",
      });
    if (i < colours.length)
      Object.assign(row, {
        "Option1 Value": colour ?? "Default Title", "Variant SKU": sku(p.handle, colour), "Variant Inventory Tracker": "",
        "Variant Inventory Policy": "continue", "Variant Fulfillment Service": "manual", "Variant Price": p.price.amount.toFixed(2),
        "Variant Requires Shipping": "TRUE", "Variant Taxable": "TRUE",
      });
    if (img) Object.assign(row, { "Image Src": SITE + img.src, "Image Position": String(i + 1), "Image Alt Text": img.alt });
    rows.push(row);
  }
}

process.stdout.write([cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n") + "\n");
