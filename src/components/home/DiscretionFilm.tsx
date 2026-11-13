"use client";

import { motion } from "framer-motion";
import { Lock, Mail, Package, ShieldCheck } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { LoopFilm } from "@/components/ui/LoopFilm";
import { siteConfig } from "@/config/site";
import { fadeUp, stagger } from "@/lib/motion";

const points = [
  { icon: Package, title: "A plain, unmarked box", body: "No logo, no product names, a neutral return address." },
  { icon: Lock, title: "Private billing", body: "Your statement reads only “EF Studio.”" },
  { icon: Mail, title: "Quiet emails", body: "Neutral subject lines. Nothing revealing in your inbox." },
  { icon: ShieldCheck, title: "Your data stays yours", body: "Never sold, never shared. Encrypted checkout." },
];

const film = siteConfig.discretionFilm;

export function DiscretionFilm() {
  return (
    <section id="discretion" aria-labelledby="discretion-heading" className="relative overflow-hidden bg-obsidian py-24 md:py-36">
      <div className="container grid items-center gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-20">
        <motion.div
          initial={{ opacity: 0, scale: 1.03 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <LoopFilm {...film} className="aspect-video" />
          {/* Fine champagne frame offset behind the film */}
          <div aria-hidden className="absolute -bottom-4 -right-4 -z-10 hidden h-full w-full border border-champagne/25 lg:block" />
        </motion.div>

        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-15%" }} variants={stagger(0.12, 0.1)}>
          <motion.p variants={fadeUp} className="eyebrow mb-6">The Discreet Promise</motion.p>
          <motion.h2 id="discretion-heading" variants={fadeUp} className="font-serif text-display-lg font-light">
            Discretion, <em className="text-gold">by design.</em>
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-6 max-w-md leading-relaxed text-ivory/70">
            What you choose is your business alone. From the moment you browse to the moment it arrives, every detail is
            designed so that no one else ever needs to know.
          </motion.p>

          <ul className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2">
            {points.map(({ icon: Icon, title, body }) => (
              <motion.li key={title} variants={fadeUp} className="flex gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-champagne/25 text-champagne">
                  <Icon strokeWidth={1.1} className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-serif text-lg text-ivory">{title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ivory/55">{body}</p>
                </div>
              </motion.li>
            ))}
          </ul>

          <motion.div variants={fadeUp} className="mt-12">
            <ButtonLink href="/discretion" variant="ghost">How we protect your privacy</ButtonLink>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
