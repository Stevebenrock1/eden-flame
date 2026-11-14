import Link from "next/link";
import type { ReactNode } from "react";
import { legal } from "@/config/legal";

export type PolicySection = { id: string; title: string; body: ReactNode };

/** Shared layout for policy pages: serif header, sticky contents on desktop, gold hairline sections. */
export function PolicyPage({
  eyebrow,
  title,
  intro,
  sections,
  updated = legal.updated,
}: {
  eyebrow: string;
  title: ReactNode;
  intro: ReactNode;
  sections: PolicySection[];
  updated?: string;
}) {
  return (
    <>
      <header className="relative isolate overflow-hidden border-b border-ivory/[0.06] pb-16 pt-40 md:pb-24 md:pt-48">
        <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,rgba(221,187,120,0.10),transparent_60%)]" />
        <div className="container">
          <p className="eyebrow mb-6">{eyebrow}</p>
          <h1 className="max-w-3xl font-serif text-display-lg font-light">{title}</h1>
          <div className="mt-6 max-w-2xl text-lg leading-relaxed text-ivory/70">{intro}</div>
          <p className="mt-8 text-xs uppercase tracking-[0.24em] text-ivory/40">Last updated {updated}</p>
        </div>
      </header>

      <div className="container grid gap-12 py-20 md:py-28 lg:grid-cols-[220px_1fr] lg:gap-20">
        <nav aria-label="On this page" className="hidden lg:block">
          <div className="sticky top-32">
            <p className="eyebrow mb-5">On this page</p>
            <ol className="space-y-3 text-sm">
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-ivory/55 transition-colors hover:text-champagne">{s.title}</a>
                </li>
              ))}
            </ol>
          </div>
        </nav>

        <div className="max-w-3xl">
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className="scroll-mt-32 border-t border-champagne/15 py-10 first:border-t-0 first:pt-0">
              <div className="flex items-baseline gap-5">
                <span className="font-serif text-sm italic text-champagne/60">{String(i + 1).padStart(2, "0")}</span>
                <h2 id={`${s.id}-h`} className="font-serif text-3xl font-light">{s.title}</h2>
              </div>
              <div className="policy-body mt-5 space-y-4 text-[0.95rem] leading-relaxed text-ivory/70">{s.body}</div>
            </section>
          ))}

          <aside className="mt-10 border border-champagne/20 bg-obsidian-800 p-8">
            <p className="font-serif text-2xl font-light">Questions about this policy?</p>
            <p className="mt-3 text-sm leading-relaxed text-ivory/60">
              Write to our concierge at{" "}
              <a href={`mailto:${legal.email}`} className="text-champagne underline-offset-4 hover:underline">{legal.email}</a>
              {" "}or visit our <Link href="/contact" className="text-champagne underline-offset-4 hover:underline">contact page</Link>. We reply within one business day, always discreetly.
            </p>
          </aside>
        </div>
      </div>
    </>
  );
}

/** Small helpers so policy copy stays readable in the page files. */
export const Ul = ({ children }: { children: ReactNode }) => (
  <ul className="space-y-2 pl-5 marker:text-champagne/70 [list-style:square]">{children}</ul>
);
export const Strong = ({ children }: { children: ReactNode }) => <strong className="font-normal text-ivory">{children}</strong>;
