"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Desktop: images stacked large for an editorial, immersive scroll.
 * Mobile: full-bleed swipe carousel with position dots.
 */
export function Gallery({ images, title }: { images: { src: string; alt: string }[]; title: string }) {
  const [active, setActive] = useState(0);
  const track = useRef<HTMLDivElement>(null);

  return (
    <div>
      {/* Mobile carousel */}
      <div className="relative -mx-5 md:hidden">
        <div
          ref={track}
          className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onScroll={(e) => {
            const el = e.currentTarget;
            setActive(Math.round(el.scrollLeft / el.clientWidth));
          }}
          aria-label={`${title} images`}
        >
          {images.map((img, i) => (
            <div key={img.src} className="relative aspect-square w-full shrink-0 snap-center bg-charcoal">
              <Image src={img.src} alt={img.alt} fill priority={i === 0} sizes="100vw" className="object-cover" />
            </div>
          ))}
        </div>
        <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              aria-label={`Show image ${i + 1}`}
              onClick={() => track.current?.scrollTo({ left: i * track.current.clientWidth, behavior: "smooth" })}
              className={cn("h-1 rounded-full transition-all duration-500", i === active ? "w-6 bg-champagne" : "w-2 bg-ivory/40")}
            />
          ))}
        </div>
      </div>

      {/* Desktop stack */}
      <div className="hidden gap-4 md:grid">
        {images.map((img, i) => (
          <div key={img.src} className="group relative aspect-[4/5] overflow-hidden bg-charcoal">
            <Image
              src={img.src}
              alt={img.alt}
              fill
              priority={i === 0}
              sizes="(min-width: 1024px) 55vw, 50vw"
              className="object-cover transition-transform duration-[2s] ease-luxe group-hover:scale-[1.03]"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
