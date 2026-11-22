"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Lock } from "lucide-react";
import { DiscretionPromise } from "@/components/cart/DiscretionPromise";
import { useBagLines } from "@/components/cart/useBagLines";
import { ButtonLink } from "@/components/ui/Button";
import { LoopFilm } from "@/components/ui/LoopFilm";
import { Checkbox, RadioGroup } from "@/components/ui/Choice";
import { Toggle } from "@/components/ui/Toggle";
import { siteConfig } from "@/config/site";
import { formatPrice, type Product } from "@/lib/commerce";
import { shippingFor, WELCOME_PERCENT } from "@/lib/pricing";
import { commerceApiEnabled, SHOPIFY_CART_KEY, shopifyCheckoutEnabled, useBag } from "@/lib/bag";
import { startShopifyCheckout } from "@/lib/shopify-actions";
import { useAuth } from "@/lib/auth";
import { ApiError, apiFetch } from "@/lib/session";
import { fadeUp } from "@/lib/motion";

const usd = (amount: number) =>
  Number.isInteger(amount)
    ? formatPrice({ amount, currencyCode: "USD" })
    : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", currencyDisplay: "narrowSymbol", minimumFractionDigits: 2 }).format(amount);

/** Shopify or the Eden Flame API collects contact, delivery and payment on a secure hosted page. */
const hosted = commerceApiEnabled || shopifyCheckoutEnabled;

/** We currently deliver within Australia only (see /shipping). */
const COUNTRIES = ["Australia"];

type PaymentMethod = "card" | "paypal";
interface PaymentOptions { card: boolean; applePay: boolean; googlePay: boolean; paypal: boolean }

/** Design mode shows every option so the page can be reviewed; with the API, the server decides. */
const DEMO_OPTIONS: PaymentOptions = { card: true, applePay: false, googlePay: false, paypal: true };

interface AppliedCode { code: string; type: "PERCENT" | "FIXED"; value: number; minSubtotalCents: number }

/** Design mode has no server, so welcome codes are recognised by their shape to preview the flow. */
const demoCode = (code: string): AppliedCode | null =>
  /^WELCOME-[A-Z2-9]{6}$/.test(code) ? { code, type: "PERCENT", value: WELCOME_PERCENT, minSubtotalCents: 0 } : null;

const field =
  "ef-field w-full border-b border-ivory/20 bg-transparent py-3 text-sm text-ivory placeholder:text-ivory/35 focus:border-champagne focus:outline-none";

/**
 * Checkout.
 * On Shopify, "Continue to secure checkout" turns the bag into a Shopify cart and hands over
 * to Shopify's checkout (contact, delivery, codes, shipping rates and payment).
 * With the Eden Flame API, "Continue to payment" reserves the pieces and hands over to
 * Stripe's secure hosted page, which collects contact, delivery and payment details.
 * Without the API (design mode) it places a sample order locally.
 */
export function CheckoutView({ products }: { products: Product[] }) {
  const { clear, ready, error: bagError, refresh } = useBag();
  const { items, subtotal, lines } = useBagLines(products);
  const [codeInput, setCodeInput] = useState("");
  const [applied, setApplied] = useState<AppliedCode | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [checkingCode, setCheckingCode] = useState(false);
  // Mirrors the server: percent codes round down to the cent, never more than the goods.
  const discount = !applied
    ? 0
    : Math.min(subtotal, applied.type === "PERCENT" ? Math.floor(subtotal * applied.value) / 100 : applied.value / 100);
  // On Shopify the final rate is set by Shopify's shipping settings, which mirror src/lib/pricing.ts.
  const shipping = shippingFor(subtotal - discount);
  const total = subtotal - discount + shipping;

  async function applyCode() {
    const code = codeInput.trim().toUpperCase();
    if (!code) return;
    setCheckingCode(true);
    setCodeError(null);
    try {
      const found = commerceApiEnabled
        ? await apiFetch<AppliedCode>("/api/checkout/discount", { method: "POST", body: JSON.stringify({ code }) })
        : demoCode(code);
      if (!found) throw new ApiError(422, "INVALID", "This code isn't valid");
      if (subtotal * 100 < found.minSubtotalCents) throw new ApiError(422, "MIN", "Your bag doesn't meet the minimum for this code");
      setApplied(found);
      setCodeInput("");
    } catch (err) {
      setCodeError(err instanceof ApiError ? err.message : "We couldn't check that code just now. Please try again.");
    } finally {
      setCheckingCode(false);
    }
  }
  const [placed, setPlaced] = useState<string | null>(null);
  const [noInvoice, setNoInvoice] = useState(true);
  const [plainLabel, setPlainLabel] = useState(true);
  const { me } = useAuth();
  // Signed-in customers start from the discretion preferences saved on their account.
  useEffect(() => {
    if (!me?.profile) return;
    setPlainLabel(me.profile.plainPackaging);
    setNoInvoice(me.profile.paperlessReceipt);
  }, [me]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [method, setMethod] = useState<PaymentMethod>("card");
  const [options, setOptions] = useState<PaymentOptions>(commerceApiEnabled ? { ...DEMO_OPTIONS, paypal: false } : DEMO_OPTIONS);
  useEffect(() => {
    if (!commerceApiEnabled) return;
    apiFetch<PaymentOptions>("/api/checkout/options").then(setOptions).catch(() => undefined);
  }, []);
  const wallets = [options.applePay && "Apple Pay", options.googlePay && "Google Pay"].filter(Boolean).join(" or ");
  const paymentChoices = [
    { value: "card" as const, label: wallets ? `Card, ${wallets}` : "Card", hint: "On our secure payment page, powered by Stripe." },
    ...(options.paypal ? [{ value: "paypal" as const, label: "PayPal", hint: "You’ll approve the payment on PayPal, then return here." }] : []),
  ];

  async function startShopify() {
    setSubmitting(true);
    setError(null);
    const result = await startShopifyCheckout(
      lines.map((l) => ({ handle: l.handle, quantity: l.quantity, color: l.color })),
      { plainPackaging: plainLabel, paperlessReceipt: noInvoice },
    ).catch(() => ({ error: "We couldn't reach our secure checkout. Please check your connection and try again." }));
    if ("checkoutUrl" in result) {
      try {
        localStorage.setItem(SHOPIFY_CART_KEY, result.cartId);
      } catch {
        /* the bag just won't empty itself after payment */
      }
      window.location.assign(result.checkoutUrl);
      return;
    }
    setError(result.error);
    setSubmitting(false);
  }

  async function startPayment() {
    setSubmitting(true);
    setError(null);
    try {
      const { checkoutUrl } = await apiFetch<{ checkoutUrl: string }>("/api/checkout/session", {
        method: "POST",
        body: JSON.stringify({ paymentMethod: method, discountCode: applied?.code, plainPackaging: plainLabel, paperlessReceipt: noInvoice }),
      });
      window.location.assign(checkoutUrl);
    } catch (err) {
      if (err instanceof ApiError) {
        const items = (err.details as { items?: string[] } | undefined)?.items;
        setError(items?.length ? `${err.message}: ${items.join(", ")}.` : err.message);
        await refresh();
      } else {
        setError("We couldn't reach our secure checkout. Please check your connection and try again.");
      }
      setSubmitting(false);
    }
  }

  if (placed) {
    return (
      <div className="container flex min-h-[80svh] flex-col items-center justify-center pb-24 pt-40 text-center">
        <motion.span initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mb-8 grid h-16 w-16 place-items-center rounded-full border border-champagne/40 text-champagne">
          <Check strokeWidth={1.25} className="h-6 w-6" />
        </motion.span>
        <p className="eyebrow mb-5">Order {placed}</p>
        <h1 className="font-serif text-display-lg font-light">Thank you</h1>
        <p className="mt-5 max-w-md text-ivory/60">
          Your order is being prepared with care. It will arrive in plain packaging, and a discreet confirmation is on its way to your inbox.
        </p>
        <ButtonLink href="/" variant="ghost" className="mt-10">Return home</ButtonLink>
      </div>
    );
  }

  if (!ready) return <div className="min-h-[80svh]" aria-busy="true" />;

  if (items.length === 0) {
    return (
      <div className="container flex min-h-[80svh] flex-col items-center justify-center pt-40 text-center">
        <h1 className="font-serif text-display-md font-light">Your bag is empty</h1>
        <ButtonLink href="/shop" className="mt-8">Explore the Collection</ButtonLink>
      </div>
    );
  }

  return (
    <div className="container pb-28 pt-36 md:pt-44">
      <div className="mb-12 flex items-center justify-between">
        <h1 className="font-serif text-display-md font-light">Checkout</h1>
        <p className="flex items-center gap-2 text-xs text-ivory/50"><Lock strokeWidth={1.25} className="h-3.5 w-3.5" /> Secure &amp; encrypted</p>
      </div>

      <div className="grid gap-14 lg:grid-cols-[1fr_400px] lg:gap-20">
        <motion.form
          initial="hidden"
          animate="show"
          variants={fadeUp}
          onSubmit={(e) => {
            e.preventDefault();
            if (shopifyCheckoutEnabled) {
              void startShopify();
              return;
            }
            if (commerceApiEnabled) {
              void startPayment();
              return;
            }
            setPlaced(`EF-${Math.floor(100000 + Math.random() * 900000)}`);
            clear();
          }}
          className="space-y-14"
        >
          {hosted ? (
            <div className="space-y-3 border-l border-champagne/40 pl-5 text-sm text-ivory/65">
              <p className="text-ivory/85">Two quiet steps.</p>
              <p>
                {shopifyCheckoutEnabled
                  ? "Choose your discretion preferences here, then enter your email, delivery address and payment on our secure checkout. We never see or store your card."
                  : "Choose your discretion preferences and how you'd like to pay here, then enter your email, delivery address and payment on the secure payment page. We never see or store your card."}
              </p>
              <p className="text-xs text-ivory/40">Order emails use a neutral subject line. No product names.</p>
            </div>
          ) : (
            <>
          <fieldset>
            <legend className="eyebrow mb-6">1 &middot; Contact</legend>
            <label className="sr-only" htmlFor="co-email">Email</label>
            <input id="co-email" type="email" required autoComplete="email" placeholder="Email address" className={field} />
            <p className="mt-3 text-xs text-ivory/40">Order emails use a neutral subject line. No product names.</p>
          </fieldset>

          <fieldset>
            <legend className="eyebrow mb-6">2 &middot; Delivery</legend>
            <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
              <input aria-label="First name" required autoComplete="given-name" placeholder="First name" className={field} />
              <input aria-label="Last name" required autoComplete="family-name" placeholder="Last name" className={field} />
              <input aria-label="Address" required autoComplete="street-address" placeholder="Address" className={`${field} sm:col-span-2`} />
              <input aria-label="City" required autoComplete="address-level2" placeholder="City" className={field} />
              <input aria-label="Postal code" required autoComplete="postal-code" placeholder="Postal code" className={field} />
              <select aria-label="Country" required defaultValue="Australia" autoComplete="country-name" className={`${field} sm:col-span-2`}>
                <option value="" disabled className="bg-obsidian">Country</option>
                {COUNTRIES.map((c) => <option key={c} className="bg-obsidian">{c}</option>)}
              </select>
            </div>
          </fieldset>

            </>
          )}

          <fieldset>
            <legend className="eyebrow mb-6">{hosted ? "1" : "3"} &middot; Discretion</legend>
            <div className="space-y-4">
              <Toggle checked={plainLabel} onChange={setPlainLabel} label="Plain shipping label" hint="Sender shows as “EF Studio” with a neutral return address." />
              <Toggle checked={noInvoice} onChange={setNoInvoice} label="No printed receipt in the parcel" hint="Your receipt is emailed instead." />
            </div>
          </fieldset>

          <fieldset>
            <legend className="eyebrow mb-6">{hosted ? "2" : "4"} &middot; Payment</legend>
            <div className="border border-ivory/10 bg-obsidian-800 p-6">
              {shopifyCheckoutEnabled ? (
                <p className="text-sm text-ivory/65">You’ll pay on our secure checkout in the next step, where you’ll see every way to pay and the delivery options.</p>
              ) : paymentChoices.length > 1 ? (
                <RadioGroup legend="How would you like to pay?" showLegend={false} name="payment-method" value={method} onChange={setMethod} options={paymentChoices} />
              ) : (
                <p className="text-sm text-ivory/65">{paymentChoices[0].label}. {paymentChoices[0].hint}</p>
              )}
              <p className="mt-5 border-t border-ivory/10 pt-4 text-xs text-ivory/45">
                Your statement will read <span className="text-ivory/80">EF Studio</span>.{shopifyCheckoutEnabled ? "" : " No product names are shared with the payment provider."}
              </p>
            </div>
          </fieldset>

          <Checkbox
            required
            name="age-terms"
            labelClassName="text-sm leading-relaxed text-ivory/70"
            label={<>I confirm I am 18 or over and agree to the <Link href="/terms" target="_blank" className="text-champagne underline-offset-4 hover:underline">Terms of Sale</Link> and <Link href="/privacy" target="_blank" className="text-champagne underline-offset-4 hover:underline">Privacy Policy</Link>.</>}
          />

          {(error ?? bagError) && <p role="alert" className="border-l border-rosegold pl-4 text-sm text-rosegold">{error ?? bagError}</p>}
          <button type="submit" disabled={submitting} className="flex h-14 w-full items-center justify-center gap-2 gold-foil text-[0.75rem] uppercase tracking-luxe text-obsidian transition-all duration-500 disabled:cursor-wait disabled:opacity-70">
            <Lock strokeWidth={1.5} className="h-3.5 w-3.5" /> {submitting ? "Preparing secure checkout…" : <>{shopifyCheckoutEnabled ? "Continue to secure checkout" : method === "paypal" ? "Continue to PayPal" : "Continue to payment"} &middot; {usd(total)}</>}
          </button>
          {!hosted && <p className="-mt-10 text-center text-xs text-ivory/35">Demo only: this places a sample order without charging anything.</p>}
        </motion.form>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          {/* A quiet visual reminder of the discretion promise at the moment it matters most */}
          <div className="relative mb-6 overflow-hidden border border-ivory/10">
            <LoopFilm {...siteConfig.discretionFilm} controls={false} className="aspect-[16/8]" />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-transparent" />
            <div className="absolute inset-x-5 bottom-4">
              <p className="font-serif text-xl">Your secret is safe with us.</p>
              <Link href="/discretion" className="text-xs text-champagne/80 underline-offset-4 hover:underline">How we protect your privacy</Link>
            </div>
          </div>
          <div className="border border-ivory/10 bg-obsidian-800 p-7">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="eyebrow">Order summary</h2>
              <Link href="/bag" className="text-xs text-ivory/50 underline-offset-4 hover:text-champagne hover:underline">Edit</Link>
            </div>
            <ul className="space-y-5">
              {items.map(({ product: p, quantity, color }) => (
                <li key={`${p.handle}::${color ?? ""}`} className="flex items-center gap-4">
                  <div className="relative aspect-[4/5] w-14 shrink-0 overflow-hidden bg-charcoal">
                    <Image src={p.images[0].src} alt="" fill sizes="56px" className="object-cover" />
                    <span className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-rosegold px-1 text-[0.55rem] text-obsidian">{quantity}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-serif text-lg leading-tight">{p.title}</p>
                    <p className="truncate text-xs text-ivory/45">{color ? `${p.subtitle} · ${color}` : p.subtitle}</p>
                  </div>
                  <p className="text-sm">{usd(p.price.amount * quantity)}</p>
                </li>
              ))}
            </ul>
            <div className="mt-8 border-t border-ivory/10 pt-6">
              {shopifyCheckoutEnabled ? (
                <p className="text-xs text-ivory/50">Have a welcome or discount code? You can add it on the next step.</p>
              ) : applied ? (
                <p className="flex items-center justify-between text-sm">
                  <span className="text-ivory/70">Code <span className="tracking-wide text-champagne">{applied.code}</span></span>
                  <button type="button" onClick={() => setApplied(null)} className="text-xs text-ivory/45 underline-offset-4 hover:text-champagne hover:underline">Remove</button>
                </p>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    void applyCode();
                  }}
                  className="flex items-center border-b border-ivory/20 focus-within:border-champagne"
                >
                  <label htmlFor="co-code" className="sr-only">Welcome or discount code</label>
                  <input
                    id="co-code"
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value)}
                    autoComplete="off"
                    autoCapitalize="characters"
                    spellCheck={false}
                    placeholder="Welcome or discount code"
                    className="w-full bg-transparent py-3 text-sm uppercase tracking-wide text-ivory placeholder:normal-case placeholder:tracking-normal placeholder:text-ivory/35 focus:outline-none"
                  />
                  <button type="submit" disabled={checkingCode || !codeInput.trim()} className="shrink-0 px-1 text-[0.7rem] uppercase tracking-luxe text-champagne transition-opacity disabled:opacity-40">
                    {checkingCode ? "Checking" : "Apply"}
                  </button>
                </form>
              )}
              {codeError && <p role="alert" className="mt-2 text-xs text-rosegold">{codeError}</p>}
            </div>
            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between"><dt className="text-ivory/60">Subtotal</dt><dd>{usd(subtotal)}</dd></div>
              {discount > 0 && (
                <div className="flex justify-between text-champagne">
                  <dt>{applied?.type === "PERCENT" ? `${applied.value}% off` : "Discount"}</dt>
                  <dd>&minus;{usd(discount)}</dd>
                </div>
              )}
              <div className="flex justify-between"><dt className="text-ivory/60">Shipping</dt><dd>{shipping === 0 ? "Complimentary" : usd(shipping)}</dd></div>
              <div className="flex justify-between border-t border-ivory/10 pt-4 text-base"><dt>Total</dt><dd>{usd(total)}</dd></div>
            </dl>
            <div className="mt-8 border-t border-ivory/10 pt-7">
              <DiscretionPromise compact />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
