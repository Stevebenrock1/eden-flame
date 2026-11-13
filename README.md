# Eden Flame storefront

Luxury e-commerce frontend built with Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 3 and Framer Motion.

## Run it

```bash
npm install
cp .env.example .env.local   # EDEN_API_URL=http://localhost:4000 (the Eden Flame API)
npm run dev        # http://localhost:3000
npm run build      # production build (the API should be running so pages pre-render with live data)
```

Leave `EDEN_API_URL` empty to run on the built-in sample catalog with a browser-only bag and a demo checkout (handy for design work).

## Component structure

Files marked ✅ exist now. The rest are the planned next stages.

```
src/
├── app/
│   ├── layout.tsx              ✅ fonts, metadata, skip link, Navbar (Footer joins here)
│   ├── globals.css             ✅ base styles, grain texture, reduced-motion rules
│   ├── page.tsx                ✅ homepage (Hero now; categories, manifesto, featured next)
│   ├── discretion/page.tsx     ✅ The Discreet Promise: film hero, journey, what others see, FAQ
│   ├── shop/page.tsx           ✅ catalog with filters (category, material, price) and sorting
│   ├── products/[handle]/page.tsx ✅ product detail page (pre-rendered for every product)
│   ├── bag/page.tsx            ✅ bag with quantities, free-shipping progress, discretion panel
│   └── checkout/page.tsx       ✅ discretion options, then hands off to Stripe Checkout via the API
│   └── checkout/success/       ✅ order confirmed page (Stripe returns here)
├── components/
│   ├── layout/
│   │   ├── AnnouncementBar.tsx ✅ rotating promo messages with arrows
│   │   ├── Navbar.tsx          ✅ transparent to glass on scroll, mobile menu, bag count
│   │   ├── Footer.tsx          ✅ newsletter, link columns, discretion and 18+ notes
│   │   └── AgeGate.tsx            18+ confirmation, remembered per visitor
│   ├── shop/
│   │   ├── ShopView.tsx        ✅ filter state synced to the URL, chips, mobile drawer, animated grid
│   │   └── Filters.tsx         ✅ collapsible checkbox groups with live counts
│   ├── home/
│   │   ├── Hero.tsx            ✅ full-screen looping film, word reveal, seal, pause button, CTA
│   │   ├── CategoryGrid.tsx    ✅ Sculptural Essentials, Silk & Senses, Aromatics
│   │   ├── Manifesto.tsx       ✅ discretion, body-safe materials, craftsmanship
│   │   └── FeaturedProducts.tsx
│   ├── product/
│   │   ├── ProductCard.tsx     ✅ minimal card, hover image swap, quick view button
│   │   ├── QuickView.tsx       ✅ modal with details and Add to Bag
│   │   ├── Gallery.tsx         ✅ stacked images on desktop, swipe carousel on mobile
│   │   └── ProductDetail.tsx   ✅ specs table, promise accordions, sticky Add to Bag bar, related pieces
│   ├── cart/
│   │   ├── BagView.tsx         ✅
│   │   ├── CheckoutView.tsx    ✅
│   │   ├── useBagLines.ts      ✅ joins bag lines with products, works out totals
│   │   └── DiscretionPromise.tsx ✅ plain packaging, discreet billing, global shipping
│   └── ui/
│       ├── Button.tsx          ✅ primary and ghost, light sweep on hover
│       └── Logo.tsx            ✅ placeholder flame wordmark
├── config/site.ts              ✅ brand name, tagline, navigation
└── lib/
    ├── cn.ts                   ✅ class name merging
    ├── motion.ts               ✅ shared easing and animation variants
    ├── pricing.ts              ✅ shipping threshold and rate (placeholders)
    ├── bag.tsx                 ✅ bag state (server bag via the API, browser storage in design mode)
    └── commerce/               ✅ data layer: Eden Flame API (api.ts), sample catalog fallback
```

## How it connects to the backend

The storefront talks to the Eden Flame API (`eden-flame-api`):

- **Products:** `src/lib/commerce/api.ts` fetches the catalog on the server and refreshes it every 60 seconds. Pages show "Sold out" and "Only a few left" from the API's availability (exact stock counts are never exposed).
- **Bag:** `src/lib/bag.tsx` keeps the bag on the server using a private, HTTP-only cookie, so it survives across devices once signed in. Changes appear instantly and are then confirmed by the server.
- **Checkout:** "Continue to payment" reserves the pieces and sends the customer to Stripe's secure page, which collects email, address and card. Stripe returns them to `/checkout/success`.
- **Same-origin proxy:** `next.config.ts` forwards `/api/*` to the API, so cookies belong to the storefront's own domain. Set `TRUST_PROXY=1` on the API so rate limits see each visitor's real address, and keep the API itself off the public internet, except for `/api/checkout/webhook`, which Stripe must reach.

## Hero film

The hero plays a silent, looping slow-motion film from `public/media/`. The current clip (`hero-film*`) is a 14-second seamless push-in made from a still photo Steve chose (Pexels photo 8587262, free for commercial use), with a separate portrait cut for phones. The earlier satin loop (`hero-silk*`) is kept as an alternative.

To swap in real footage, replace `hero-silk.mp4`, `hero-silk.webm` and `hero-silk-poster.jpg` (or change the paths in `src/config/site.ts`). Good footage tips:
- 10 to 15 seconds, filmed at 60 to 120 fps and slowed down, with the end matching the start so it loops smoothly
- 1920x1080, H.264 MP4 under about 4 MB plus a WebM copy
- Dark, moody lighting with space on the left for the headline
- Product in hand, silk, warm skin tones, candlelight; never explicit

## Discretion film (licence needed before launch)

`public/media/discretion-film-preview.*` is a slowed-down (half speed, frame-blended) seamless loop made from **Getty Images comp clip 1169868177**. It is the watermarked 768px preview and may only be used for internal mock-ups. Before launch, licence the clip from Getty, then re-run the same slow-motion and loop process on the HD file and replace the preview files (paths live in `src/config/site.ts` under `discretionFilm`).

It appears in three places: the homepage "Discretion, by design" section, the hero of `/discretion`, and above the order summary at checkout.

## Design tokens

All colors, fonts, type sizes, shadows and animations are in `tailwind.config.ts`:

| Token | Hex | Use |
|---|---|---|
| obsidian | #0B0A09 | page background |
| charcoal | #24201D | cards, panels |
| espresso | #3B2A22 | warm depth in gradients |
| ivory | #F4EDE3 | body text |
| champagne | #E8D3B0 | primary buttons, focus rings |
| rosegold | #C9967E | accents, badges, gold text |
| ember | #E0913F | the flame glow |

Fonts: Cormorant Garamond (serif headings) and Inter (sans body), loaded with `next/font` so there is no layout shift.

## Best practices built in

- **Accessibility:** skip-to-content link, labelled nav and icon buttons, visible focus rings, Escape closes the mobile menu, decorative layers hidden from screen readers, text contrast on dark backgrounds checked to stay readable.
- **Reduced motion:** Framer Motion's `useReducedMotion` turns off parallax, and CSS turns off looping animations for visitors who ask their device for less motion.
- **Performance:** the hero is pure CSS and SVG (no heavy images), it's statically prerendered, fonts are self-hosted, and only the animated pieces are client components. Images will use `next/image` with AVIF and WebP.
- **Motion feel:** one shared easing curve (`luxeEase`) and slow durations (around 1 second) keep everything calm and expensive-feeling rather than bouncy.
- **Mobile first:** fluid `clamp()` type sizes, `100svh` hero height that works with mobile browser bars, full-screen mobile menu.
