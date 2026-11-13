import type { Variants, Transition } from "framer-motion";

/** One easing curve for the whole site keeps motion feeling consistent and calm. */
export const luxeEase: Transition["ease"] = [0.22, 1, 0.36, 1];

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 1.1, ease: luxeEase } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 1.4, ease: luxeEase } },
};

export const stagger = (staggerChildren = 0.14, delayChildren = 0.2): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});

/** Word-by-word reveal for headlines, masked so words rise from below a baseline. */
export const wordReveal: Variants = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 1.2, ease: luxeEase } },
};
