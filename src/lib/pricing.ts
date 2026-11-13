/** Placeholder store policies. Replace with Steve's real numbers. */
export const FREE_SHIPPING_THRESHOLD = 100;
export const STANDARD_SHIPPING = 12;

export function shippingFor(subtotal: number) {
  return subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
}
