"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";
import { fadeUp, stagger, wordReveal } from "@/lib/motion";

const headline = [
  { text: "Desire,", italic: false },
  { text: "refined.", italic: true },
];

const media = siteConfig.heroMedia;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const [playing, setPlaying] = useState(true);
  const [poster, setPoster] = useState<string>(media.poster);

  // Use the portrait still on phones so the paused or loading frame is framed correctly
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px) and (orientation: portrait)");
    const apply = () => setPoster(mq.matches ? media.mobilePoster : media.poster);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // Slow push-in on the film and a gentle lift of the copy as the visitor scrolls
  const filmScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.12]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-18%"]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.6], [1, reduce ? 1 : 0]);

  // Respect "reduce motion": show the still poster instead of the looping film
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (reduce) {
      v.pause();
      setPlaying(false);
    }
  }, [reduce]);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) {
      void v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <section
      ref={ref}
      aria-labelledby="hero-heading"
      className="grain relative isolate flex min-h-[100svh] items-end overflow-hidden bg-obsidian"
    >
      {/* Full-bleed slow-motion film, looping silently */}
      <motion.div aria-hidden style={{ scale: filmScale }} className="absolute inset-0 -z-20">
        <video
          ref={video}
          className="h-full w-full object-cover"
          autoPlay={!reduce}
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster}
        >
          {/* Portrait cut for phones, landscape for everything wider */}
          <source src={media.mobileWebm} type="video/webm" media="(max-width: 767px) and (orientation: portrait)" />
          <source src={media.mobileMp4} type="video/mp4" media="(max-width: 767px) and (orientation: portrait)" />
          <source src={media.webm} type="video/webm" />
          <source src={media.mp4} type="video/mp4" />
        </video>
      </motion.div>

      {/* Shading so the copy always reads: darker at the bottom and left */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/25 to-obsidian/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian/70 via-obsidian/10 to-transparent" />
        {/* Phones: the copy sits over the busiest part of the frame, so deepen the lower two thirds */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-obsidian via-obsidian/75 to-transparent md:hidden" />
      </div>

      <motion.div style={{ y: copyY, opacity: copyOpacity }} className="container relative pb-24 pt-40 md:pb-28">
        <motion.div initial="hidden" animate="show" variants={stagger(0.18, 0.4)} className="max-w-3xl">
          {siteConfig.constructionNotice && (
            <motion.p variants={fadeUp} className="mb-8 inline-flex items-center gap-3 border border-champagne/40 bg-obsidian/50 px-4 py-2.5 text-xs text-ivory/80 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-champagne" aria-hidden />
              <span><span className="uppercase tracking-[0.22em] text-champagne">Opening soon</span> &middot; Our site is still under construction. Orders aren&rsquo;t open yet.</span>
            </motion.p>
          )}
          <motion.p variants={fadeUp} className="eyebrow mb-6">
            The Eden Collection &middot; New Season
          </motion.p>

          <h1 id="hero-heading" className="font-serif text-display-xl font-light text-ivory">
            {headline.map((word, i) => (
              <span key={word.text} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
                <motion.span
                  variants={wordReveal}
                  className={word.italic ? "inline-block italic text-gold" : "inline-block"}
                >
                  {word.text}
                  {i < headline.length - 1 && " "}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p variants={fadeUp} className="mt-6 max-w-lg text-base leading-relaxed text-ivory/75 md:text-lg">
            Sculptural objects for pleasure and self-care, crafted from body-safe materials and delivered with absolute
            discretion.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-10 flex flex-col gap-4 sm:flex-row sm:gap-5">
            <ButtonLink href="/shop" className="w-full sm:w-auto">
              Explore the Collection
            </ButtonLink>
            <ButtonLink href="/discretion" variant="ghost" className="w-full sm:w-auto">
              Our Discreet Promise
            </ButtonLink>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Refined seal: rotating ring of text, a quiet nod to the brand promise */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.6, duration: 1.2 }}
        className="absolute right-[6%] top-[24%] hidden h-36 w-36 lg:block"
      >
        <svg viewBox="0 0 100 100" className="h-full w-full animate-[spin_40s_linear_infinite] text-champagne/80">
          <defs>
            <path id="seal" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
          </defs>
          <text className="fill-current text-[6.6px] uppercase tracking-[0.2em]">
            <textPath href="#seal">Body-safe &middot; Discreet &middot; Crafted &middot; Eden Flame &middot;</textPath>
          </text>
        </svg>
        <span className="absolute inset-0 grid place-items-center font-serif text-2xl italic text-gold">EF</span>
      </motion.div>

      {/* Pause control: autoplaying motion should always be stoppable (WCAG 2.2.2) */}
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause background film" : "Play background film"}
        className="absolute bottom-8 right-5 grid h-10 w-10 place-items-center rounded-full border border-ivory/20 text-ivory/70 backdrop-blur-sm transition-colors hover:border-champagne hover:text-champagne md:right-10"
      >
        {playing ? <Pause strokeWidth={1.25} className="h-4 w-4" /> : <Play strokeWidth={1.25} className="h-4 w-4" />}
      </button>
    </section>
  );
}
