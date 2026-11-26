"use client";

import { useEffect, type RefObject } from "react";

/**
 * Keeps a silent background film playing on its own, without a tap.
 *
 * Browsers only autoplay a video that is muted, and some (iPhone Low Power Mode, data saver,
 * a first visit before the page is fully ready) still refuse the first attempt. So this
 * forces the muted flags in the DOM, retries whenever the film is ready or the tab comes back
 * into view, and as a last resort starts it on the visitor's first touch, click, scroll or key.
 * It never fights the visitor: once they press pause (`enabled` false) it stays paused.
 */
export function useAutoLoop(ref: RefObject<HTMLVideoElement | null>, enabled: boolean) {
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (!enabled) {
      v.pause();
      return;
    }
    v.muted = true;
    v.defaultMuted = true;
    v.loop = true;
    v.playsInline = true;
    v.setAttribute("muted", "");
    v.setAttribute("playsinline", "");
    v.setAttribute("webkit-playsinline", "");

    const gestures = ["pointerdown", "touchstart", "keydown", "scroll", "wheel"] as const;
    const onGesture = () => tryPlay();
    const removeGestures = () => gestures.forEach((g) => window.removeEventListener(g, onGesture));

    function tryPlay() {
      if (!v || document.visibilityState === "hidden" || !v.paused) return;
      v.play().then(removeGestures, () => {
        // Refused: start on the visitor's first interaction instead
        gestures.forEach((g) => window.addEventListener(g, onGesture, { passive: true }));
      });
    }

    const onVisible = () => (document.visibilityState === "visible" ? tryPlay() : undefined);
    tryPlay();
    v.addEventListener("loadeddata", tryPlay);
    v.addEventListener("canplay", tryPlay);
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("pageshow", tryPlay);
    return () => {
      removeGestures();
      v.removeEventListener("loadeddata", tryPlay);
      v.removeEventListener("canplay", tryPlay);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("pageshow", tryPlay);
    };
  }, [ref, enabled]);
}
