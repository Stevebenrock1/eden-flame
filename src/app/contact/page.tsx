import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Mail, ShieldCheck } from "lucide-react";
import { legal } from "@/config/legal";

export const metadata: Metadata = {
  title: "Contact the Concierge",
  description: "Private, personal help with orders, products and returns. We reply within one business day.",
};

const cards = [
  { icon: Mail, title: "Write to us", body: <a href={`mailto:${legal.email}`} className="text-champagne underline-offset-4 hover:underline">{legal.email}</a> },
  { icon: Clock, title: "Reply time", body: <>Within one business day, Monday to Friday, {legal.state} time.</> },
  { icon: ShieldCheck, title: "Always discreet", body: <>Our replies come from {legal.statementName} with a neutral subject line.</> },
];

export default function Page() {
  return (
    <>
      <header className="relative isolate overflow-hidden pb-16 pt-40 md:pb-20 md:pt-48">
        <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,rgba(221,187,120,0.10),transparent_60%)]" />
        <div className="container">
          <p className="eyebrow mb-6">The Concierge</p>
          <h1 className="max-w-3xl font-serif text-display-lg font-light">At your <em className="text-gold">service</em>, privately</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ivory/70">
            Questions about a piece, an order or a return? Write to us and a real person will reply. Nothing you share leaves our team.
          </p>
        </div>
      </header>

      <section className="container pb-20">
        <ul className="grid gap-px overflow-hidden border border-ivory/[0.08] bg-ivory/[0.08] md:grid-cols-3">
          {cards.map(({ icon: Icon, title, body }) => (
            <li key={title} className="bg-obsidian p-8 md:p-10">
              <Icon strokeWidth={1} className="mb-10 h-6 w-6 text-champagne" />
              <h2 className="font-serif text-2xl font-normal">{title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-ivory/60">{body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="container pb-28">
        <div className="border border-champagne/20 bg-obsidian-800 p-8 md:p-12">
          <p className="eyebrow mb-4">Before you write</p>
          <p className="max-w-2xl text-sm leading-relaxed text-ivory/65">
            For an order, include your order number so we can help straight away. You may find a quicker answer in our{" "}
            <Link href="/faq" className="text-champagne underline-offset-4 hover:underline">FAQ</Link>, or on our{" "}
            <Link href="/shipping" className="text-champagne underline-offset-4 hover:underline">Shipping</Link> and{" "}
            <Link href="/returns" className="text-champagne underline-offset-4 hover:underline">Returns</Link> pages.
          </p>
        </div>
      </section>
    </>
  );
}
