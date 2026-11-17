"use client";

import Link from "next/link";
import { legal } from "@/config/legal";
import { useState } from "react";
import { ArrowRight, Lock } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { siteConfig } from "@/config/site";

const columns = [
  {
    title: "Shop",
    links: [
      { label: "All pieces", href: "/shop" },
      { label: "Find your piece", href: "/find" },
      ...siteConfig.categories.map((c) => ({ label: c.title, href: `/shop?category=${c.slug}` })),
      { label: "Gift cards", href: "/gift-cards" },
    ],
  },
  {
    title: "Care",
    links: [
      { label: "The Discreet Promise", href: "/discretion" },
      { label: "Discreet shipping", href: "/shipping" },
      { label: "Returns & warranty", href: "/returns" },
      { label: "Materials guide", href: "/materials" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "House",
    links: [
      { label: "Our philosophy", href: "/#manifesto" },
      { label: "Journal", href: "/journal" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  return (
    <footer className="relative bg-obsidian pt-24 text-ivory">
      <div aria-hidden className="gold-rule absolute inset-x-0 top-0" />
      <div className="container">
        <div className="grid gap-16 border-b border-ivory/[0.08] pb-20 lg:grid-cols-[1.3fr_2fr]">
          {/* Newsletter */}
          <div>
            <Logo />
            <p className="mt-8 max-w-sm font-serif text-2xl font-light leading-snug text-ivory/90">
              Private letters on new pieces, rituals and quiet indulgence.
            </p>
            {joined ? (
              <p className="mt-8 text-sm text-champagne" role="status">
                Thank you. Your first letter is on its way.
              </p>
            ) : (
              <form
                className="mt-8 flex max-w-sm items-center border-b border-ivory/25 focus-within:border-champagne"
                onSubmit={(e) => {
                  e.preventDefault();
                  // Newsletter sign-up: connect to an email provider (e.g. Klaviyo) when chosen
                  if (email) setJoined(true);
                }}
              >
                <label htmlFor="footer-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="footer-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="w-full bg-transparent py-3 text-sm text-ivory placeholder:text-ivory/40 focus:outline-none"
                />
                <button type="submit" aria-label="Subscribe" className="p-2 text-ivory/70 transition-colors hover:text-champagne">
                  <ArrowRight strokeWidth={1.25} className="h-5 w-5" />
                </button>
              </form>
            )}
            <p className="mt-3 text-xs text-ivory/40">Sent discreetly. Unsubscribe anytime.</p>
          </div>

          {/* Link columns */}
          <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.title}>
                <h2 className="eyebrow mb-6">{col.title}</h2>
                <ul className="space-y-3.5">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-sm text-ivory/65 transition-colors hover:text-ivory">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Reassurance + legal */}
        <div className="flex flex-col gap-6 py-10 text-xs text-ivory/45 md:flex-row md:items-center md:justify-between">
          <p className="flex items-center gap-2">
            <Lock strokeWidth={1.25} className="h-3.5 w-3.5" />
            Secure checkout &middot; Plain packaging &middot; Billed as &ldquo;EF Studio&rdquo;
          </p>
          <p>For adults 18+ only &middot; ABN {legal.abn}</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-ivory">Privacy</Link>
            <Link href="/terms" className="hover:text-ivory">Terms</Link>
            <span>&copy; {new Date().getFullYear()} Eden Flame</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
