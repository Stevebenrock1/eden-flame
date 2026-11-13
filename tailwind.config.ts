import type { Config } from "tailwindcss";

/**
 * Eden Flame design tokens.
 * Dark, rich base tones with warm metallic accents.
 * Change a value here and it updates everywhere.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", md: "2rem", lg: "3rem" },
      screens: { "2xl": "1440px" },
    },
    extend: {
      colors: {
        obsidian: { DEFAULT: "#0B0A09", 900: "#0B0A09", 800: "#131110", 700: "#1B1816" },
        charcoal: { DEFAULT: "#24201D", 600: "#2E2925", 500: "#3A342F" },
        espresso: { DEFAULT: "#3B2A22", 400: "#56402F" },
        ivory: { DEFAULT: "#F4EDE3", muted: "#CFC6BA", dim: "#9A9086" },
        // Accent gold. Warmer and richer than before for a more opulent feel (Steve, 2026-11-13).
        champagne: { DEFAULT: "#DDBB78", light: "#EED5A0" },
        gold: { DEFAULT: "#C9A24E", light: "#E8CB86", pale: "#F6E7BE", deep: "#8C6A2C" },
        rosegold: { DEFAULT: "#C9967E", light: "#DDB4A0", dark: "#A87562" },
        ember: { DEFAULT: "#E0913F", glow: "#F2A55A", deep: "#B4632A" },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Editorial display sizes, fluid between mobile and desktop
        "display-xl": ["clamp(3rem, 8vw, 7.5rem)", { lineHeight: "0.95", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2.5rem, 5vw, 4.5rem)", { lineHeight: "1.02", letterSpacing: "-0.015em" }],
        "display-md": ["clamp(2rem, 3.5vw, 3rem)", { lineHeight: "1.1", letterSpacing: "-0.01em" }],
        eyebrow: ["0.72rem", { lineHeight: "1", letterSpacing: "0.32em" }],
      },
      letterSpacing: { luxe: "0.18em" },
      backgroundImage: {
        // Polished metal: deep shadow, warm body, a bright highlight band, then back to body
        "gold-sheen": "linear-gradient(105deg, #A67C35 0%, #D9B266 22%, #F6E7BE 42%, #DDB971 58%, #B08637 80%, #E2C27E 100%)",
        "gold-foil": "linear-gradient(115deg, #9C7432 0%, #C9A24E 18%, #EED5A0 38%, #F8EBC6 46%, #D6B062 62%, #A97F36 82%, #CFAA5C 100%)",
        "gold-line": "linear-gradient(90deg, transparent, rgba(221,187,120,0.55) 20%, rgba(246,231,190,0.9) 50%, rgba(221,187,120,0.55) 80%, transparent)",
        "ember-radial": "radial-gradient(closest-side, rgba(242,165,90,0.55), rgba(224,145,63,0.12) 60%, transparent)",
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(0,0,0,0.6)",
        glow: "0 0 60px -10px rgba(242,165,90,0.35)",
        gold: "0 0 0 1px rgba(246,231,190,0.25) inset, 0 10px 40px -12px rgba(201,162,78,0.55)",
      },
      transitionTimingFunction: { luxe: "cubic-bezier(0.22, 1, 0.36, 1)" },
      keyframes: {
        drift: {
          "0%, 100%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(4%, -6%, 0) scale(1.08)" },
        },
        flicker: {
          "0%, 100%": { opacity: "0.85" },
          "40%": { opacity: "1" },
          "70%": { opacity: "0.7" },
        },
        "scroll-cue": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(200%)" },
        },
      },
      animation: {
        drift: "drift 18s ease-in-out infinite",
        "drift-slow": "drift 26s ease-in-out infinite reverse",
        flicker: "flicker 6s ease-in-out infinite",
        "scroll-cue": "scroll-cue 2.4s cubic-bezier(0.22,1,0.36,1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
