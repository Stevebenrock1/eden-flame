"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/cn";
import { useAutoLoop } from "@/lib/useAutoLoop";

interface Props {
  mp4: string;
  webm?: string;
  poster: string;
  className?: string;
  /** Show a small pause/play control (needed when the film is large or long). */
  controls?: boolean;
  /** Tailwind object-position class, e.g. to keep a face clear of overlaid text. */
  position?: string;
}

/** Silent, looping background film that plays on its own and only while on screen. */
export function LoopFilm({ mp4, webm, poster, className, controls = true, position = "object-center" }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [onScreen, setOnScreen] = useState(false);

  // Save battery and bandwidth: only run while on screen
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting));
    io.observe(v);
    return () => io.disconnect();
  }, []);

  // Loops on its own while visible, with no tap needed; the pause button still works
  useAutoLoop(ref, playing && onScreen);

  return (
    <div className={cn("relative overflow-hidden bg-obsidian", className)}>
      <video ref={ref} className={cn("h-full w-full object-cover", position)} autoPlay muted loop playsInline preload="metadata" poster={poster} aria-hidden>
        {webm && <source src={webm} type="video/webm" />}
        <source src={mp4} type="video/mp4" />
      </video>
      {controls && (
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pause film" : "Play film"}
          className="absolute bottom-4 right-4 grid h-9 w-9 place-items-center rounded-full border border-ivory/25 bg-obsidian/30 text-ivory/70 backdrop-blur-sm transition-colors hover:border-champagne hover:text-champagne"
        >
          {playing ? <Pause strokeWidth={1.25} className="h-3.5 w-3.5" /> : <Play strokeWidth={1.25} className="h-3.5 w-3.5" />}
        </button>
      )}
    </div>
  );
}
