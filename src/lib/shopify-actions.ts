"use server";

import { getProducts } from "@/lib/commerce";
import { createShopifyCheckout, isCartCompleted, shopifyEnabled, type CheckoutLine } from "@/lib/commerce/shopify";

/** Opens Shopify's secure checkout for the bag. Prices and stock are re-read from Shopify. */
export async function startShopifyCheckout(lines: CheckoutLine[], opts: { plainPackaging: boolean; paperlessReceipt: boolean }) {
  if (!shopifyEnabled) return { error: "Checkout isn't available just now." };
  try {
    return await createShopifyCheckout(await getProducts(), lines.slice(0, 50), opts);
  } catch {
    return { error: "We couldn't reach our secure checkout. Please check your connection and try again." };
  }
}

/** Lets the bag empty itself once the shopper has paid on Shopify. */
export async function shopifyCartCompleted(cartId: string): Promise<boolean> {
  if (!shopifyEnabled || !cartId.startsWith("gid://shopify/Cart/")) return false;
  try {
    return await isCartCompleted(cartId);
  } catch {
    return false;
  }
}
