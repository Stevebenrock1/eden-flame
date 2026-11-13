"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Lock, RotateCcw } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { QuickView } from "@/components/product/QuickView";
import { siteConfig } from "@/config/site";
import type { Audience, Feature, Product } from "@/lib/commerce";
import { BUDGETS, MUSTS, SENSATIONS, rankProducts, shopLinkFor, type Budget, type FinderAnswers, type Sensation } from "@/lib/finder";
import { cn } from "@/lib/cn";
import { luxeEase } from "@/lib/motion";

const EMPTY: FinderAnswers = { audience: null, sensation: null, musts: [], budget: null };

const STEPS = [
  { key: "audience", eyebrow: "First", question: "Who are you choosing for?" },
  { key: "sensation", eyebrow: "Then", question: "Which sensation draws you?" },
  { key: "musts", eyebrow: "Next", question: "Anything it must have?", note: "Choose any, or none at all." },
  { key: "budget", eyebrow: "Finally", question: "What would you like to spend?" },
] as const;

/** Four questions, then three recommendations with the reasons behind each. Nothing is stored or sent. */
export function FinderView({ products }: { products: Product[] }) {
  const [step, setStep] = useState(0);
  const [a, setA] = useState<FinderAnswers>(EMPTY);
  const [quick, setQuick] = useState<Product | null>(null);
  const closeQuick = useCallback(() => setQuick(null), []);
  // Move focus to each new question once it appears, so keyboard and screen-reader users follow along.
  // (A callback ref, because the next question mounts only after the previous one has faded out.)
  const moved = useRef(false);
  const focusHeading = useCallback((el: HTMLHeadingElement | null) => {
    if (el && moved.current) el.focus({ preventScroll: true });
  }, []);
  const done = step === STEPS.length;


  const answered = [a.audience !== null, a.sensation !== null, true, a.budget !== null][step] ?? true;
  const matches = useMemo(() => (done ? rankProducts(products, a) : []), [done, products, a]);

  const go = (to: number) => {
    moved.current = true;
    setStep(Math.max(0, Math.min(STEPS.length, to)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const next = () => go(step + 1);
  const back = () => go(step - 1);
  const restart = () => {
    setA(EMPTY);
    moved.current = true;
    setStep(0);
  };

  return (
    <div className="container pb-32 pt-40 md:pt-48">
      <header className="mx-auto mb-14 max-w-2xl text-center">
        <p className="eyebrow mb-5">Find your piece</p>
        <p className="text-sm text-ivory/55">
          Four quiet questions, three considered recommendations.{" "}
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
            <Lock aria-hidden strokeWidth={1.25} className="h-3 w-3" /> Private: nothing is saved.
          </span>
        </p>
      </header>

      {/* Progress */}
      <div className="mx-auto mb-12 flex max-w-xl items-center gap-2" aria-hidden>
        {STEPS.map((s, i) => (
          <span key={s.key} className="h-px flex-1 overflow-hidden bg-ivory/15">
            <motion.span
              className="block h-full bg-gold-line"
              initial={false}
              animate={{ width: i < step || done ? "100%" : i === step ? "45%" : "0%" }}
              transition={{ duration: 0.6, ease: luxeEase }}
            />
          </span>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!done ? (
          <motion.section
            key={step}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45, ease: luxeEase }}
            className="mx-auto max-w-4xl"
            aria-labelledby="finder-q"
          >
            <p className="eyebrow mb-4 text-center">
              {STEPS[step].eyebrow} <span className="text-ivory/35">&middot; {step + 1} of {STEPS.length}</span>
            </p>
            <h1 id="finder-q" ref={focusHeading} tabIndex={-1} className="text-center font-serif text-display-md font-light focus:outline-none md:text-display-lg">
              {STEPS[step].question}
            </h1>
            {"note" in STEPS[step] && <p className="mt-4 text-center text-sm text-ivory/50">{STEPS[step].note}</p>}

            <fieldset className="mt-12">
              <legend className="sr-only">{STEPS[step].question}</legend>
              {step === 0 && (
                <div className="grid gap-4 sm:grid-cols-3">
                  {siteConfig.audiences.map((x) => (
                    <Option key={x.id} type="radio" name="audience" checked={a.audience === x.id} onChange={() => setA({ ...a, audience: x.id as Audience })} title={x.title} hint={x.blurb} />
                  ))}
                </div>
              )}
              {step === 1 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {SENSATIONS.map((x) => (
                    <Option key={x.id} type="radio" name="sensation" checked={a.sensation === x.id} onChange={() => setA({ ...a, sensation: x.id as Sensation })} title={x.title} hint={x.hint} />
                  ))}
                </div>
              )}
              {step === 2 && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {MUSTS.map((x) => (
                    <Option
                      key={x.id}
                      type="checkbox"
                      name="musts"
                      checked={a.musts.includes(x.id)}
                      onChange={() => setA({ ...a, musts: a.musts.includes(x.id) ? a.musts.filter((m) => m !== x.id) : [...a.musts, x.id as Feature] })}
                      title={x.title}
                    />
                  ))}
                </div>
              )}
              {step === 3 && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {BUDGETS.map((x) => (
                    <Option key={x.id} type="radio" name="budget" checked={a.budget === x.id} onChange={() => setA({ ...a, budget: x.id as Budget })} title={x.title} />
                  ))}
                </div>
              )}
            </fieldset>

            <div className="mt-12 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={back}
                disabled={step === 0}
                className="flex items-center gap-2 text-[0.7rem] uppercase tracking-luxe text-ivory/60 transition-colors hover:text-champagne disabled:invisible"
              >
                <ArrowLeft strokeWidth={1.25} className="h-4 w-4" /> Back
              </button>
              <button
                type="button"
                onClick={next}
                disabled={!answered}
                className="gold-foil flex h-14 items-center gap-3 px-10 text-[0.72rem] uppercase tracking-luxe text-obsidian transition-opacity disabled:cursor-not-allowed disabled:opacity-35"
              >
                {step === STEPS.length - 1 ? "Reveal my pieces" : step === 2 && a.musts.length === 0 ? "No preference" : "Continue"}
                <ArrowRight strokeWidth={1.25} className="h-4 w-4" />
              </button>
            </div>
          </motion.section>
        ) : (
          <motion.section
            key="results"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: luxeEase }}
            aria-labelledby="finder-q"
          >
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow mb-4">Chosen for you</p>
              <h1 id="finder-q" ref={focusHeading} tabIndex={-1} className="font-serif text-display-md font-light focus:outline-none md:text-display-lg">
                Three pieces, <em className="text-gold">considered</em>
              </h1>
            </div>

            {matches.length === 0 ? (
              <p className="mt-12 text-center text-ivory/60">The collection is being restocked. Please look again shortly.</p>
            ) : (
              <ol className="mx-auto mt-14 grid max-w-6xl gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                {matches.map((m, i) => (
                  <motion.li key={m.product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: luxeEase, delay: 0.15 + i * 0.12 }}>
                    <p className="mb-3 font-serif text-sm italic text-champagne/80">{i === 0 ? "Our first choice" : `0${i + 1}`}</p>
                    <ProductCard product={m.product} onQuickView={setQuick} priority={i === 0} />
                    {m.reasons.length > 0 && (
                      <ul className="mt-4 space-y-1.5 border-t border-ivory/[0.08] pt-4" aria-label="Why we chose it">
                        {m.reasons.map((r) => (
                          <li key={r} className="flex items-center gap-2 text-xs text-ivory/60">
                            <Check aria-hidden strokeWidth={1.5} className="h-3 w-3 text-champagne" /> {r}
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.li>
                ))}
              </ol>
            )}

            <div className="mt-16 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href={shopLinkFor(a)} className="gold-foil flex h-14 items-center gap-3 px-10 text-[0.72rem] uppercase tracking-luxe text-obsidian">
                See every match <ArrowRight strokeWidth={1.25} className="h-4 w-4" />
              </Link>
              <button type="button" onClick={restart} className="flex h-14 items-center gap-2 border border-ivory/25 px-8 text-[0.72rem] uppercase tracking-luxe text-ivory/80 transition-colors hover:border-champagne hover:text-champagne">
                <RotateCcw strokeWidth={1.25} className="h-4 w-4" /> Start again
              </button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <QuickView product={quick} onClose={closeQuick} />
    </div>
  );
}

/** A large answer card. A real radio or checkbox underneath keeps keyboard and screen-reader use native. */
function Option({ type, name, checked, onChange, title, hint }: { type: "radio" | "checkbox"; name: string; checked: boolean; onChange: () => void; title: string; hint?: string }) {
  return (
    <label className="group block cursor-pointer">
      <input type={type} name={name} checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        className={cn(
          "relative flex h-full min-h-[6.5rem] flex-col justify-center border px-6 py-6 transition-all duration-500 ease-luxe",
          "border-ivory/15 bg-ivory/[0.015] group-hover:-translate-y-0.5 group-hover:border-champagne/60 group-hover:shadow-gold motion-reduce:group-hover:translate-y-0",
          "peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-champagne",
          "peer-checked:border-champagne peer-checked:bg-champagne/[0.07]",
        )}
      >
        <span className="pr-8 font-serif text-2xl font-light text-ivory">{title}</span>
        {hint && <span className="mt-2 pr-6 text-sm text-ivory/50">{hint}</span>}
        <span
          aria-hidden
          className={cn(
            "absolute right-5 top-5 grid h-5 w-5 place-items-center border transition-all duration-500",
            type === "radio" && "rounded-full",
            checked ? "border-transparent bg-gold-foil text-obsidian" : "border-ivory/25 group-hover:border-champagne",
          )}
        >
          {checked && <Check strokeWidth={2} className="h-3 w-3" />}
        </span>
      </span>
    </label>
  );
}
