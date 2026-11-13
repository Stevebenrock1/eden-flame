"use client";

import { motion } from "framer-motion";
import { Gem, Package, ShieldCheck } from "lucide-react";
import { fadeUp, stagger } from "@/lib/motion";

const pillars = [
  {
    icon: Package,
    title: "Absolute discretion",
    body: "Every order leaves in plain, unbranded packaging. Your statement reads simply “EF Studio.” No one needs to know but you.",
  },
  {
    icon: ShieldCheck,
    title: "Body-safe, always",
    body: "Only medical-grade silicone, borosilicate glass and hypoallergenic metals. Phthalate-free, non-porous and independently tested.",
  },
  {
    icon: Gem,
    title: "Quiet craftsmanship",
    body: "Designed in small studios, finished by hand, and built to last for years, with a warranty to match.",
  },
];

export function Manifesto() {
  return (
    <section
      id="manifesto"
      aria-labelledby="manifesto-heading"
      className="relative overflow-hidden border-y border-ivory/[0.06] bg-obsidian-800 py-28 md:py-40"
    >
      <div aria-hidden className="absolute -left-[20%] top-1/2 h-[60vmax] w-[60vmax] -translate-y-1/2 rounded-full bg-ember-radial opacity-[0.12] blur-3xl" />

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-15%" }}
        variants={stagger(0.16, 0)}
        className="container relative"
      >
        <motion.p variants={fadeUp} className="eyebrow mb-8 text-center">
          Our Philosophy
        </motion.p>
        <motion.h2
          id="manifesto-heading"
          variants={fadeUp}
          className="mx-auto max-w-4xl text-center font-serif text-display-md font-light leading-snug text-ivory md:text-[3.25rem]"
        >
          We believe pleasure is a form of self-care, and that it deserves the same{" "}
          <em className="text-gold">beauty, intention and respect</em> as everything else you bring into your life.
        </motion.h2>

        <motion.div variants={fadeUp} className="mx-auto my-16 h-px w-40 bg-gold-line md:my-24" />

        <ul className="grid gap-14 md:grid-cols-3 md:gap-10">
          {pillars.map(({ icon: Icon, title, body }) => (
            <motion.li key={title} variants={fadeUp} className="text-center md:px-6">
              <span className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-full border border-champagne/25 text-champagne">
                <Icon strokeWidth={1} className="h-5 w-5" />
              </span>
              <h3 className="font-serif text-2xl font-normal text-ivory">{title}</h3>
              <p className="mx-auto mt-4 max-w-[34ch] text-sm leading-relaxed text-ivory/60">{body}</p>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}
