"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Search, ShoppingBag, Sparkles, User, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/cn";
import { luxeEase } from "@/lib/motion";
import { useBag } from "@/lib/bag";

export function Navbar() {
  const { count: bagCount } = useBag();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const runSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = String(new FormData(e.currentTarget).get("q") ?? "").trim();
    setSearching(false);
    setOpen(false);
    router.push(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
  };

  useEffect(() => {
    if (searching) searchRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSearching(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searching]);

  // Transparent over the hero, frosted glass once the visitor scrolls
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock page scroll while the mobile menu is open, close on Escape
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const iconBtn =
    "relative grid h-10 w-10 place-items-center text-ivory/80 transition-colors duration-300 hover:text-champagne";

  return (
    <>
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-transform duration-700 ease-luxe",
        // Announcement bar slides away once the visitor scrolls
        scrolled ? "-translate-y-10" : "translate-y-0",
      )}
    >
      <AnnouncementBar />
      <div
        className={cn(
          "transition-all duration-700 ease-luxe",
          scrolled ? "glass py-3" : "bg-gradient-to-b from-obsidian/70 to-transparent py-5",
        )}
      >
      <nav aria-label="Main" className="container flex items-center justify-between">
        <button
          type="button"
          className={cn(iconBtn, "-ml-2 xl:hidden")}
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(true)}
        >
          <Menu strokeWidth={1.25} className="h-5 w-5" />
        </button>

        <Logo />

        <ul className="hidden items-center gap-7 whitespace-nowrap xl:flex 2xl:gap-9">
          {siteConfig.nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="group relative text-[0.72rem] uppercase tracking-luxe text-ivory/75 transition-colors duration-300 hover:text-ivory"
              >
                {item.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-champagne transition-transform duration-500 ease-luxe group-hover:scale-x-100" />
              </Link>
            </li>
          ))}
        </ul>

        <div className="-mr-2 flex items-center">
          <button type="button" className={cn(iconBtn, "hidden sm:grid")} aria-label="Search" aria-expanded={searching} onClick={() => setSearching((v) => !v)}>
            <Search strokeWidth={1.25} className="h-[18px] w-[18px]" />
          </button>
          <Link href="/account" className={cn(iconBtn, "hidden sm:grid")} aria-label="Account">
            <User strokeWidth={1.25} className="h-[18px] w-[18px]" />
          </Link>
          <Link href="/bag" className={iconBtn} aria-label={`Bag, ${bagCount} items`}>
            <ShoppingBag strokeWidth={1.25} className="h-[18px] w-[18px]" />
            {bagCount > 0 && (
              <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-rosegold px-1 text-[0.6rem] text-obsidian">
                {bagCount}
              </span>
            )}
          </Link>
        </div>
      </nav>
      </div>

      <AnimatePresence>
        {searching && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: luxeEase }}
            className="glass"
          >
            <form role="search" onSubmit={runSearch} className="container flex items-center gap-4 py-5">
              <Search strokeWidth={1.25} className="h-4 w-4 shrink-0 text-ivory/50" />
              <input
                ref={searchRef}
                name="q"
                type="search"
                placeholder="Search silk, glass, gold, candles…"
                aria-label="Search the collection"
                className="w-full bg-transparent font-serif text-2xl font-light text-ivory placeholder:text-ivory/35 focus:outline-none"
              />
              <button type="button" onClick={() => setSearching(false)} className={iconBtn} aria-label="Close search">
                <X strokeWidth={1.25} className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-[60] flex flex-col bg-obsidian/95 backdrop-blur-2xl xl:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: luxeEase }}
          >
            <div className="container flex items-center justify-between py-6">
              <Logo />
              <button type="button" className={cn(iconBtn, "-mr-2")} aria-label="Close menu" onClick={() => setOpen(false)}>
                <X strokeWidth={1.25} className="h-5 w-5" />
              </button>
            </div>
            <motion.ul
              className="container mt-10 flex flex-col gap-7"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } } }}
            >
              {siteConfig.nav.map((item) => (
                <motion.li
                  key={item.href}
                  variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: luxeEase } } }}
                >
                  <Link href={item.href} onClick={() => setOpen(false)} className="font-serif text-4xl text-ivory hover:text-champagne">
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
            <div className="container mt-auto space-y-8 pb-10">
              <form role="search" onSubmit={runSearch} className="flex items-center border-b border-ivory/20 focus-within:border-champagne">
                <Search strokeWidth={1.25} className="h-4 w-4 text-ivory/50" />
                <input name="q" type="search" placeholder="Search the collection" aria-label="Search the collection" className="w-full bg-transparent px-3 py-3 text-sm text-ivory placeholder:text-ivory/40 focus:outline-none" />
              </form>
              <div className="flex items-center justify-between text-xs uppercase tracking-luxe text-ivory/50">
                <Link href="/account" onClick={() => setOpen(false)} className="flex items-center gap-2 text-ivory/80 hover:text-champagne">
                  <User strokeWidth={1.25} className="h-4 w-4" /> Your account
                </Link>
                <Link href="/find" onClick={() => setOpen(false)} className="flex items-center gap-2 text-champagne hover:text-champagne-light">
                  <Sparkles strokeWidth={1.25} className="h-4 w-4" /> Find your piece
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
