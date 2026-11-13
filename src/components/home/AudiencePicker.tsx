"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";
import { fadeUp, stagger } from "@/lib/motion";

/** "Who are you shopping for?" The leading stores open their shops this way. */
export function AudiencePicker() {
  return (
    <section aria-labelledby="audience-heading" className="bg-obsidian pt-24 md:pt-32">
      <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-15%" }} variants={stagger(0.12, 0)} className="container">
        <motion.p variants={fadeUp} className="eyebrow mb-5 text-center">Begin here</motion.p>
        <motion.h2 id="audience-heading" variants={fadeUp} className="text-center font-serif text-display-md font-light md:text-display-lg">
          Who are you <em className="text-gold">choosing for?</em>
        </motion.h2>

        <ul className="mt-12 grid grid-cols-3 gap-3 md:mt-16 md:gap-6">
          {siteConfig.audiences.map((a) => (
            <motion.li key={a.id} variants={fadeUp}>
              <Link href={`/shop?for=${a.id}`} className="group block focus-visible:outline-none">
                <div className="relative aspect-[3/4] overflow-hidden bg-charcoal ring-1 ring-inset ring-ivory/[0.06] transition-shadow duration-700 group-hover:shadow-gold group-focus-visible:ring-champagne md:aspect-[4/3]">
                  <Image src={a.image} alt="" fill sizes="(min-width: 768px) 33vw, 33vw" className="object-cover transition-transform duration-[1.6s] ease-luxe group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian/85 via-obsidian/10 to-transparent" />
                  <div className="absolute inset-x-3 bottom-4 text-center md:inset-x-6 md:bottom-7">
                    <h3 className="font-serif text-xl font-light text-ivory md:text-4xl">{a.title}</h3>
                    <p className="mx-auto mt-2 hidden max-w-[30ch] text-sm text-ivory/60 md:block">{a.blurb}</p>
                    <span className="mx-auto mt-3 block h-px w-8 bg-champagne/70 transition-all duration-700 ease-luxe group-hover:w-16 md:mt-5" />
                  </div>
                </div>
              </Link>
            </motion.li>
          ))}
        </ul>

        <motion.p variants={fadeUp} className="mt-10 text-center text-sm text-ivory/55">
          Not sure where to begin?{" "}
          <Link href="/find" className="text-champagne underline-offset-4 hover:underline">
            Find your piece in four questions
          </Link>
        </motion.p>
      </motion.div>
    </section>
  );
}
