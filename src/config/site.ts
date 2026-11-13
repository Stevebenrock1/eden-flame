export const siteConfig = {
  name: "Eden Flame",
  tagline: "Intimacy, Refined",
  description:
    "Design-forward intimate wellness, crafted from body-safe materials and delivered with absolute discretion.",
  /** Rotating messages in the slim bar above the navigation. */
  announcements: [
    "Discreet by design: plain box, private billing",
    "Complimentary discreet shipping over $100",
    "100-day satisfaction promise",
  ],
  /** Hero film. Swap these files for real brand footage when it is shot. */
  heroMedia: {
    // Slow push-in loop made from Steve's still (Pexels photo 8587262, free commercial licence).
    // The earlier satin loop is still in /public/media/hero-silk.* if you want to switch back.
    mp4: "/media/hero-film.mp4",
    webm: "/media/hero-film.webm",
    poster: "/media/hero-film-poster.jpg",
    mobileMp4: "/media/hero-film-mobile.mp4",
    mobileWebm: "/media/hero-film-mobile.webm",
    mobilePoster: "/media/hero-film-mobile-poster.jpg",
  },
  /**
   * Discretion film. PREVIEW ONLY: this is Getty Images comp 1169868177 (watermarked, 768px).
   * Licence the clip from Getty before launch, then drop the HD file in with the same names.
   */
  discretionFilm: {
    mp4: "/media/discretion-film-preview.mp4",
    webm: "/media/discretion-film-preview.webm",
    poster: "/media/discretion-film-poster.jpg",
  },
  categories: [
    {
      slug: "sculptural-essentials",
      title: "Sculptural Essentials",
      blurb: "Objects shaped like art, engineered for pleasure.",
      image: "/media/category-sculptural.jpg",
    },
    {
      slug: "silk-and-senses",
      title: "Silk & Senses",
      blurb: "Blindfolds, restraints and touch, rendered in pure silk.",
      image: "/media/category-silk.jpg",
    },
    {
      slug: "aromatics",
      title: "Aromatics",
      blurb: "Massage oils, candles and scent to set the mood.",
      image: "/media/category-aromatics.jpg",
    },
  ],
  /** Shop by who it's for, the way the leading stores lead their menus. */
  audiences: [
    { id: "her", title: "For Her", blurb: "Sculpted for her pleasure, from first discovery to the deeply familiar.", image: "/media/category-for-her.jpg" },
    { id: "him", title: "For Him", blurb: "Precision engineering and quiet power, designed around him.", image: "/media/category-for-him.jpg" },
    { id: "two", title: "For Two", blurb: "Pieces made to be shared, close together or miles apart.", image: "/media/category-for-two.jpg" },
  ],
  nav: [
    { label: "Shop all", href: "/shop" },
    { label: "For Her", href: "/shop?for=her" },
    { label: "For Him", href: "/shop?for=him" },
    { label: "For Two", href: "/shop?for=two" },
    // Short label keeps the desktop bar on one line; the full name shows on the page itself.
    { label: "Sculptural", href: "/shop?category=sculptural-essentials" },
    { label: "Silk & Senses", href: "/shop?category=silk-and-senses" },
    { label: "Aromatics", href: "/shop?category=aromatics" },
    { label: "Discretion", href: "/discretion" },
  ],
} as const;
