"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Package } from "lucide-react";
import { Toggle } from "@/components/ui/Toggle";
import { useAuth, type Profile } from "@/lib/auth";
import { formatPrice } from "@/lib/commerce";
import { fadeUp, stagger } from "@/lib/motion";
import { apiFetch } from "@/lib/session";
import { Field, Notice, errorText } from "./ui";

interface Order {
  number: string;
  status: "PAID" | "CANCELLED" | "REFUNDED" | "PENDING_PAYMENT";
  fulfillmentStatus: "UNFULFILLED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "RETURNED";
  totalCents: number;
  trackingNumber: string | null;
  createdAt: string;
  items: { titleSnapshot: string; quantity: number; lineTotalCents: number; product: { slug: string } | null }[];
}

const money = (cents: number) => formatPrice({ amount: cents / 100, currencyCode: "USD" });
const date = (iso: string) => new Date(iso).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });

function orderState(o: Order) {
  if (o.status === "REFUNDED") return "Refunded";
  if (o.status === "CANCELLED") return "Cancelled";
  return { UNFULFILLED: "Being prepared", PROCESSING: "Being prepared", SHIPPED: "On its way", DELIVERED: "Delivered", RETURNED: "Returned" }[o.fulfillmentStatus];
}

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

export function AccountDashboard() {
  const { me, signOut, updateProfile, deleteAccount } = useAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ tone: "info" | "error"; text: string } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    apiFetch<{ items: Order[] }>("/api/orders")
      .then((r) => setOrders(r.items))
      .catch(() => setOrders([]));
  }, []);

  if (!me) return null;
  const p: Profile = me.profile ?? { firstName: null, lastName: null, plainPackaging: true, paperlessReceipt: true, marketingOptIn: false };

  async function save(patch: Partial<Profile>, done = "Saved") {
    setSaving(true);
    setMessage(null);
    try {
      await updateProfile(patch);
      setMessage({ tone: "info", text: done });
    } catch (err) {
      setMessage({ tone: "error", text: errorText(err) });
    } finally {
      setSaving(false);
    }
  }

  return (
    <motion.div initial="hidden" animate="show" variants={stagger()} className="grid gap-16 lg:grid-cols-[1fr_380px] lg:gap-20">
      <div className="space-y-16">
        <motion.header variants={fadeUp}>
          <p className="eyebrow mb-5">Your account</p>
          <h1 className="font-serif text-display-md font-light">
            {greeting()}
            {p.firstName ? `, ${p.firstName}` : ""}
          </h1>
          <p className="mt-3 text-sm text-ivory/50">{me.email}</p>
        </motion.header>

        <motion.section variants={fadeUp} aria-labelledby="orders-h">
          <h2 id="orders-h" className="eyebrow mb-6">Orders</h2>
          {orders === null ? (
            <div className="h-24 animate-pulse border border-ivory/10 bg-obsidian-800" aria-busy="true" />
          ) : orders.length === 0 ? (
            <div className="border border-ivory/10 bg-obsidian-800 p-8">
              <p className="font-serif text-2xl font-light">No orders yet</p>
              <p className="mt-2 text-sm text-ivory/55">When you order, it will appear here, privately.</p>
              <Link href="/shop" className="mt-6 inline-block text-xs uppercase tracking-luxe text-champagne underline-offset-4 hover:underline">
                Explore the collection
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-ivory/10 border-y border-ivory/10">
              {orders.map((o) => (
                <li key={o.number} className="py-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                    <p className="font-serif text-xl">Order {o.number}</p>
                    <p className="text-sm">{money(o.totalCents)}</p>
                  </div>
                  <p className="mt-1 flex items-center gap-2 text-xs text-ivory/50">
                    <Package strokeWidth={1.25} className="h-3.5 w-3.5" />
                    {orderState(o)} &middot; {date(o.createdAt)}
                    {o.trackingNumber && <> &middot; Tracking {o.trackingNumber}</>}
                  </p>
                  <ul className="mt-4 space-y-1 text-sm text-ivory/70">
                    {o.items.map((i) => (
                      <li key={i.titleSnapshot} className="flex justify-between gap-4">
                        <span>
                          {i.product ? <Link href={`/products/${i.product.slug}`} className="hover:text-champagne">{i.titleSnapshot}</Link> : i.titleSnapshot}
                          {i.quantity > 1 && <span className="text-ivory/40"> &times; {i.quantity}</span>}
                        </span>
                        <span className="text-ivory/50">{money(i.lineTotalCents)}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </motion.section>

        <motion.section variants={fadeUp} aria-labelledby="details-h">
          <h2 id="details-h" className="eyebrow mb-6">Your details</h2>
          <form
            className="grid gap-x-6 gap-y-5 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              const clean = (v: FormDataEntryValue | null) => (String(v ?? "").trim() || null);
              void save({ firstName: clean(f.get("firstName")), lastName: clean(f.get("lastName")) }, "Your details are saved");
            }}
          >
            <Field label="First name" name="firstName" defaultValue={p.firstName ?? ""} autoComplete="given-name" maxLength={80} />
            <Field label="Last name" name="lastName" defaultValue={p.lastName ?? ""} autoComplete="family-name" maxLength={80} />
            <div className="sm:col-span-2">
              <button type="submit" disabled={saving} className="border border-ivory/20 px-8 py-3 text-[0.7rem] uppercase tracking-luxe text-ivory/80 transition-colors hover:border-champagne hover:text-champagne disabled:opacity-60">
                Save details
              </button>
            </div>
          </form>
          <p className="mt-4 text-xs text-ivory/40">Names are optional and stored encrypted. Delivery addresses are entered at checkout.</p>
        </motion.section>
      </div>

      <motion.aside variants={fadeUp} className="space-y-8 lg:sticky lg:top-28 lg:self-start">
        <section aria-labelledby="disc-h" className="border border-ivory/10 bg-obsidian-800 p-7">
          <h2 id="disc-h" className="eyebrow mb-6">Discretion preferences</h2>
          <div className="space-y-5">
            <Toggle disabled={saving} checked={p.plainPackaging} onChange={(v) => void save({ plainPackaging: v })} label="Plain shipping label" hint="Sender shows as “EF Studio” with a neutral return address." />
            <Toggle disabled={saving} checked={p.paperlessReceipt} onChange={(v) => void save({ paperlessReceipt: v })} label="No printed receipt in the parcel" hint="Your receipt is emailed instead." />
            <Toggle disabled={saving} checked={p.marketingOptIn} onChange={(v) => void save({ marketingOptIn: v })} label="Private previews by email" hint="Occasional, with plain subject lines." />
          </div>
          {message && <div className="mt-6"><Notice tone={message.tone}>{message.text}</Notice></div>}
        </section>

        <section aria-labelledby="priv-h" className="border border-ivory/10 p-7">
          <h2 id="priv-h" className="eyebrow mb-4">Privacy</h2>
          <p className="text-sm text-ivory/55">Your email, name and address are encrypted. You can sign out of every device by resetting your password, or close your account at any time.</p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-xs uppercase tracking-luxe">
            <button type="button" onClick={() => void signOut()} className="text-ivory/80 underline-offset-4 hover:text-champagne hover:underline">
              Sign out
            </button>
            {!confirmDelete ? (
              <button type="button" onClick={() => setConfirmDelete(true)} className="text-ivory/40 underline-offset-4 hover:text-rosegold hover:underline">
                Close account
              </button>
            ) : (
              <span className="flex flex-wrap items-center gap-x-4 gap-y-2 normal-case tracking-normal">
                <span className="text-ivory/60">This permanently deletes your account.</span>
                <button
                  type="button"
                  onClick={() => void deleteAccount().catch((err) => setMessage({ tone: "error", text: errorText(err) }))}
                  className="uppercase tracking-luxe text-rosegold underline-offset-4 hover:underline"
                >
                  Delete
                </button>
                <button type="button" onClick={() => setConfirmDelete(false)} className="uppercase tracking-luxe text-ivory/50 hover:text-ivory">
                  Keep
                </button>
              </span>
            )}
          </div>
        </section>
      </motion.aside>
    </motion.div>
  );
}
