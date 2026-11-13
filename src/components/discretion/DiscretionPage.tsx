"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CreditCard, Mail, Package, Plus, ShieldCheck, UserX } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { LoopFilm } from "@/components/ui/LoopFilm";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/cn";
import { fadeUp, luxeEase, stagger } from "@/lib/motion";

const film = siteConfig.discretionFilm;

const journey = [
  { icon: UserX, step: "01", title: "Browse privately", body: "No account needed. Check out as a guest and we keep only what's required to deliver your order." },
  { icon: CreditCard, step: "02", title: "Pay discreetly", body: "Encrypted checkout. Your bank statement shows a neutral name, never the product." },
  { icon: Package, step: "03", title: "Delivered unmarked", body: "A plain, sturdy box with no branding, no product names and a neutral return address." },
  { icon: Mail, step: "04", title: "Quiet correspondence", body: "Order emails use neutral subject lines and never show product images in the preview." },
];

const faqs = [
  { q: "Will anything on the parcel reveal what's inside?", a: "No. Every order ships in a plain outer box. The label shows your name and address, and the sender as “EF Studio” with a neutral return address. There is no logo, tape or wording that hints at the contents." },
  { q: "What will appear on my bank or card statement?", a: "Only “EF Studio” and the amount. The word Eden Flame and the products you bought never appear." },
  { q: "Is there a receipt inside the box?", a: "Only if you want one. By default we email your receipt and leave the box free of paperwork." },
  { q: "Can someone see my order in my inbox?", a: "Our emails use neutral subject lines such as “Your EF Studio order has shipped” and contain no product photos in the preview." },
  { q: "Do you share or sell my information?", a: "Never. We use your details only to fulfil your order. You can ask us to delete your data at any time." },
  { q: "Can I return something discreetly?", a: "Yes. Returns use the same plain packaging and a pre-paid neutral label. Unopened items can be returned within 100 days." },
];

export function DiscretionPage() {
  return (
    <>
      {/* Film hero */}
      <section className="relative isolate flex min-h-[88svh] items-end overflow-hidden">
        <LoopFilm {...film} className="absolute inset-y-0 right-0 -z-20 h-full w-full md:w-[68%]" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-obsidian via-obsidian/50 to-obsidian/30" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-obsidian/80 via-obsidian/20 to-transparent" />
        <motion.div initial="hidden" animate="show" variants={stagger(0.15, 0.3)} className="container pb-20 pt-40 md:pb-28">
          <motion.p variants={fadeUp} className="eyebrow mb-6">The Discreet Promise</motion.p>
          <motion.h1 variants={fadeUp} className="max-w-3xl font-serif text-display-xl font-light">
            Your secret is <em className="text-gold">safe</em> with us.
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-6 max-w-lg text-lg leading-relaxed text-ivory/75">
            Privacy isn&rsquo;t a feature at Eden Flame. It&rsquo;s the foundation of everything we do, from the first click to the
            moment the box arrives at your door.
          </motion.p>
        </motion.div>
      </section>

      {/* Journey */}
      <section aria-labelledby="journey-heading" className="py-24 md:py-32">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-15%" }} variants={stagger(0.12, 0)} className="container">
          <motion.p variants={fadeUp} className="eyebrow mb-5">From click to doorstep</motion.p>
          <motion.h2 id="journey-heading" variants={fadeUp} className="mb-16 max-w-2xl font-serif text-display-lg font-light">
            Private at every step
          </motion.h2>
          <ol className="grid gap-px overflow-hidden border border-ivory/[0.08] bg-ivory/[0.08] sm:grid-cols-2 lg:grid-cols-4">
            {journey.map(({ icon: Icon, step, title, body }) => (
              <motion.li key={step} variants={fadeUp} className="bg-obsidian p-8 md:p-10">
                <div className="mb-10 flex items-center justify-between">
                  <Icon strokeWidth={1} className="h-6 w-6 text-champagne" />
                  <span className="font-serif text-sm italic text-ivory/35">{step}</span>
                </div>
                <h3 className="font-serif text-2xl font-normal">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ivory/60">{body}</p>
              </motion.li>
            ))}
          </ol>
        </motion.div>
      </section>

      {/* What others see */}
      <section aria-labelledby="see-heading" className="border-y border-ivory/[0.06] bg-obsidian-800 py-24 md:py-32">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-15%" }} variants={stagger(0.15, 0)} className="container">
          <motion.p variants={fadeUp} className="eyebrow mb-5 text-center">What everyone else sees</motion.p>
          <motion.h2 id="see-heading" variants={fadeUp} className="mx-auto mb-16 max-w-2xl text-center font-serif text-display-lg font-light">
            Absolutely <em className="text-gold">nothing</em> to see
          </motion.h2>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Parcel */}
            <motion.figure variants={fadeUp} className="flex flex-col">
              <div className="grid flex-1 place-items-center border border-ivory/[0.08] bg-obsidian p-10">
                <div className="relative aspect-[4/3] w-full max-w-[260px] bg-[#b89a78] shadow-soft">
                  <div className="absolute inset-x-0 top-1/2 h-3 -translate-y-1/2 bg-[#a3876a]" />
                  <div className="absolute bottom-5 right-5 w-[58%] bg-[#f6f2ea] p-3 font-mono text-[0.55rem] leading-relaxed text-obsidian/80 shadow">
                    <p className="text-obsidian/50">FROM: EF STUDIO</p>
                    <p className="mt-1">TO: A. CUSTOMER</p>
                    <p>12 EXAMPLE STREET</p>
                    <div className="mt-1.5 h-4 bg-[repeating-linear-gradient(90deg,#111_0_1px,transparent_1px_3px)]" />
                  </div>
                </div>
              </div>
              <figcaption className="mt-5">
                <p className="font-serif text-xl">At your door</p>
                <p className="mt-1 text-sm text-ivory/55">A plain brown box. No logo, no clues.</p>
              </figcaption>
            </motion.figure>

            {/* Statement */}
            <motion.figure variants={fadeUp} className="flex flex-col">
              <div className="grid flex-1 place-items-center border border-ivory/[0.08] bg-obsidian p-10">
                <div className="w-full max-w-[300px] bg-[#f6f2ea] p-5 font-mono text-[0.65rem] text-obsidian/80 shadow-soft">
                  <p className="mb-3 border-b border-obsidian/15 pb-2 text-obsidian/50">CARD STATEMENT</p>
                  <div className="flex justify-between py-1 text-obsidian/40"><span>COFFEE HOUSE</span><span>4.50</span></div>
                  <div className="flex justify-between bg-champagne/40 px-1 py-1"><span>EF STUDIO</span><span>189.00</span></div>
                  <div className="flex justify-between py-1 text-obsidian/40"><span>CITY TRANSIT</span><span>2.80</span></div>
                </div>
              </div>
              <figcaption className="mt-5">
                <p className="font-serif text-xl">On your statement</p>
                <p className="mt-1 text-sm text-ivory/55">Just &ldquo;EF Studio&rdquo; and the amount.</p>
              </figcaption>
            </motion.figure>

            {/* Inbox */}
            <motion.figure variants={fadeUp} className="flex flex-col">
              <div className="grid flex-1 place-items-center border border-ivory/[0.08] bg-obsidian p-10">
                <div className="w-full max-w-[300px] divide-y divide-obsidian/10 bg-[#f6f2ea] text-[0.7rem] text-obsidian shadow-soft">
                  <div className="p-3 opacity-40"><p className="font-medium">Newsletter</p><p className="truncate">This week&rsquo;s top stories</p></div>
                  <div className="bg-champagne/30 p-3"><p className="font-medium">EF Studio</p><p className="truncate">Your order has shipped</p></div>
                  <div className="p-3 opacity-40"><p className="font-medium">Calendar</p><p className="truncate">Reminder: dinner on Friday</p></div>
                </div>
              </div>
              <figcaption className="mt-5">
                <p className="font-serif text-xl">In your inbox</p>
                <p className="mt-1 text-sm text-ivory/55">Neutral subject lines, nothing revealing.</p>
              </figcaption>
            </motion.figure>
          </div>
        </motion.div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq-heading" className="py-24 md:py-32">
        <div className="container grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <p className="eyebrow mb-5">Questions, answered</p>
            <h2 id="faq-heading" className="font-serif text-display-md font-light">Everything you might wonder, privately</h2>
            <p className="mt-6 flex items-center gap-2 text-sm text-ivory/55">
              <ShieldCheck strokeWidth={1.1} className="h-4 w-4 text-champagne" />
              Still unsure? Our concierge replies within a day.
            </p>
          </div>
          <div className="divide-y divide-ivory/[0.08] border-y border-ivory/[0.08]">
            {faqs.map((f, i) => (
              <Faq key={f.q} q={f.q} a={f.a} defaultOpen={i === 0} />
            ))}
          </div>
        </div>
      </section>

      <section className="pb-28 text-center">
        <p className="font-serif text-display-md font-light">Explore, with complete peace of mind.</p>
        <ButtonLink href="/shop" className="mt-10">Explore the Collection</ButtonLink>
      </section>
    </>
  );
}

function Faq({ q, a, defaultOpen }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div>
      <button type="button" aria-expanded={open} onClick={() => setOpen((o) => !o)} className="flex w-full items-center gap-4 py-6 text-left font-serif text-xl text-ivory hover:text-champagne">
        <span className="flex-1">{q}</span>
        <Plus strokeWidth={1.25} className={cn("h-4 w-4 shrink-0 transition-transform duration-500 ease-luxe", open && "rotate-45")} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease: luxeEase }} className="overflow-hidden">
            <p className="max-w-xl pb-6 text-sm leading-relaxed text-ivory/60">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
