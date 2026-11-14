import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { AccordionItem } from "@/components/ui/Accordion";
import { ButtonLink } from "@/components/ui/Button";
import { legal } from "@/config/legal";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Questions, Answered",
  description: "Discretion, delivery, returns, materials and care: everything you might wonder about Eden Flame, answered privately.",
};

const a = "text-champagne underline-offset-4 hover:underline";

const groups: { title: string; items: { q: string; a: ReactNode }[] }[] = [
  {
    title: "Discretion",
    items: [
      { q: "Will anyone know what I ordered?", a: <>No. Parcels are plain and unbranded, your statement shows only &ldquo;{legal.statementName}&rdquo;, and our emails use neutral subject lines. See <Link href="/discretion" className={a}>The Discreet Promise</Link>.</> },
      { q: "Do I need an account to order?", a: "No. You can check out as a guest. An account simply lets you follow orders and save your discretion preferences." },
      { q: "Do you share my details?", a: <>Never for marketing, and we never sell them. Read our <Link href="/privacy" className={a}>Privacy Policy</Link> for the few providers who help us deliver your order.</> },
    ],
  },
  {
    title: "Delivery",
    items: [
      { q: "How much is delivery?", a: <>Standard tracked delivery is complimentary on orders over ${FREE_SHIPPING_THRESHOLD}. Full rates are on our <Link href="/shipping" className={a}>Shipping</Link> page.</> },
      { q: "How quickly will it arrive?", a: `We dispatch ${legal.dispatch}. Standard delivery takes ${legal.standardDelivery}, and express ${legal.expressDelivery}.` },
      { q: "Can I send it to a parcel locker or PO Box?", a: "Yes, for standard delivery. It is a popular choice for complete privacy." },
    ],
  },
  {
    title: "Returns",
    items: [
      { q: "Can I return something I've opened?", a: <>For hygiene reasons, change-of-mind returns are for unopened items only, within {legal.returnDays} days. Faulty items are always covered. See <Link href="/returns" className={a}>Returns &amp; warranty</Link>.</> },
      { q: "What if a piece stops working?", a: "Email us with your order number. We will repair, replace or refund it under the Australian Consumer Law and the maker's warranty." },
    ],
  },
  {
    title: "Materials & care",
    items: [
      { q: "Are your pieces body-safe?", a: "We choose pieces made from body-safe materials such as medical-grade silicone, glass and stainless steel, and list the materials on every product page." },
      { q: "Which lubricant should I use?", a: "A water-based lubricant suits every piece. Avoid silicone-based lubricant with silicone pieces, as it can damage the surface." },
      { q: "How do I clean and store my piece?", a: "Wash before and after use with warm water and a mild, fragrance-free soap or a toy cleaner, dry fully, and store it in its pouch away from other pieces." },
    ],
  },
  {
    title: "Payment",
    items: [
      { q: "How can I pay?", a: "All major credit and debit cards, plus Apple Pay and Google Pay where available, processed securely by Stripe." },
      { q: "Are prices inclusive of GST?", a: "Yes. Prices include GST where it applies, and delivery costs are shown before you pay." },
    ],
  },
];

export default function Page() {
  return (
    <>
      <header className="relative isolate overflow-hidden border-b border-ivory/[0.06] pb-16 pt-40 md:pb-24 md:pt-48">
        <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,rgba(221,187,120,0.10),transparent_60%)]" />
        <div className="container">
          <p className="eyebrow mb-6">Questions, answered</p>
          <h1 className="max-w-3xl font-serif text-display-lg font-light">Everything you might <em className="text-gold">wonder</em>, privately</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ivory/70">If your question isn&rsquo;t here, our concierge replies within one business day.</p>
        </div>
      </header>

      <div className="container space-y-20 py-20 md:py-28">
        {groups.map((g) => (
          <section key={g.title} aria-labelledby={`faq-${g.title}`} className="grid gap-8 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
            <h2 id={`faq-${g.title}`} className="font-serif text-display-md font-light">{g.title}</h2>
            <div className="divide-y divide-ivory/[0.08] border-y border-ivory/[0.08]">
              {g.items.map((it) => (
                <AccordionItem key={it.q} q={it.q}><p>{it.a}</p></AccordionItem>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="pb-28 text-center">
        <p className="font-serif text-display-md font-light">Still curious?</p>
        <ButtonLink href="/contact" className="mt-10">Contact the Concierge</ButtonLink>
      </section>
    </>
  );
}
