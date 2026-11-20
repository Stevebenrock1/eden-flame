import type { Audience, Feature, Product } from "./types";

type Base = Omit<Product, "audience" | "features">;

const img = (handle: string, title: string) => [
  { src: `/media/products/${handle}-1.jpg`, alt: title },
  { src: `/media/products/${handle}-2.jpg`, alt: `${title}, alternate view` },
];

const usd = (amount: number) => ({ amount, currencyCode: "USD" as const });

/** Eden Flame's own pieces. */
const own: Base[] = [
  {
    id: "p1", handle: "aurelia", title: "Aurelia", subtitle: "Sculpted personal massager",
    description: "A softly curved form that rests naturally in the hand, with eight whisper-quiet intensities and a satin-touch finish.",
    category: "sculptural-essentials", materials: ["Medical-grade silicone"], price: usd(189),
    images: img("aurelia", "Aurelia"), badge: "Bestseller", featured: 10, createdAt: "2026-09-02",
  },
  {
    id: "p2", handle: "lumen", title: "Lumen", subtitle: "Gold-finished wand",
    description: "Our signature piece. A slender wand finished in 24k gold over surgical steel, weighted for a reassuring, jewellery-like feel.",
    category: "sculptural-essentials", materials: ["24k gold plating"], price: usd(420),
    images: img("lumen", "Lumen"), badge: "Limited", featured: 9, createdAt: "2026-10-18",
  },
  {
    id: "p3", handle: "solenne", title: "Solenne", subtitle: "Hand-blown glass sculpture",
    description: "Hand-blown borosilicate glass, smooth as water and beautiful enough to leave on display. Can be warmed or cooled.",
    category: "sculptural-essentials", materials: ["Borosilicate glass"], price: usd(145),
    images: img("solenne", "Solenne"), featured: 7, createdAt: "2026-07-11",
  },
  {
    id: "p4", handle: "vesper", title: "Vesper", subtitle: "Palm-sized massager",
    description: "Pebble-shaped and pocketable, with a travel lock and a magnetic charger that tucks away in its silk pouch.",
    category: "sculptural-essentials", materials: ["Medical-grade silicone"], price: usd(159),
    images: img("vesper", "Vesper"), badge: "New", featured: 8, createdAt: "2026-11-01",
  },
  {
    id: "p5", handle: "orbis", title: "Orbis Duo", subtitle: "Shared massager for two",
    description: "Designed to be enjoyed together, with app-free remote control and a flexible, body-hugging silhouette.",
    category: "sculptural-essentials", materials: ["Medical-grade silicone"], price: usd(229),
    images: img("orbis", "Orbis Duo"), featured: 6, createdAt: "2026-06-20",
  },
  {
    id: "p6", handle: "halo", title: "Halo", subtitle: "Gold-plated ring",
    description: "A minimal ring in 24k gold plate over hypoallergenic steel. Polished by hand and presented in a velvet case.",
    category: "sculptural-essentials", materials: ["24k gold plating"], price: usd(95),
    images: img("halo", "Halo"), featured: 4, createdAt: "2026-05-14",
  },
  {
    id: "p7", handle: "nocturne", title: "Nocturne", subtitle: "Silk blindfold",
    description: "Cut from 22-momme mulberry silk with a padded interior that blocks every glimmer of light.",
    category: "silk-and-senses", materials: ["Mulberry silk"], price: usd(85),
    images: img("nocturne", "Nocturne"), badge: "Bestseller", featured: 8, createdAt: "2026-08-08",
  },
  {
    id: "p8", handle: "velours", title: "Velours", subtitle: "Silk wrist ties",
    description: "Long ribbons of mulberry silk that tie softly and release in a single pull. Gentle, elegant and adjustable.",
    category: "silk-and-senses", materials: ["Mulberry silk"], price: usd(120),
    images: img("velours", "Velours"), featured: 5, createdAt: "2026-04-03",
  },
  {
    id: "p9", handle: "plume", title: "Plume", subtitle: "Feather tickler",
    description: "Ethically sourced feathers set in a gold-plated handle, for the lightest, most teasing touch.",
    category: "silk-and-senses", materials: ["24k gold plating"], price: usd(68),
    images: img("plume", "Plume"), badge: "New", featured: 5, createdAt: "2026-10-29",
  },
  {
    id: "p10", handle: "ember", title: "Ember", subtitle: "Massage candle",
    description: "Soy and coconut wax that melts into a warm massage oil. Notes of amber, smoked vanilla and fig leaf.",
    category: "aromatics", materials: ["Plant-based botanicals"], price: usd(58),
    images: img("ember", "Ember"), badge: "Bestseller", featured: 9, createdAt: "2026-03-12",
  },
  {
    id: "p11", handle: "elixir", title: "Elixir", subtitle: "Botanical massage oil",
    description: "A silky, fast-absorbing blend of jojoba, rosehip and sweet almond, scented with neroli and sandalwood.",
    category: "aromatics", materials: ["Plant-based botanicals"], price: usd(46),
    images: img("elixir", "Elixir"), featured: 6, createdAt: "2026-02-22",
  },
  {
    id: "p12", handle: "reverie", title: "Reverie", subtitle: "Pillow and body mist",
    description: "A soft veil of rose absolute, oud and white musk for linen, skin and the moments in between.",
    category: "aromatics", materials: ["Plant-based botanicals"], price: usd(52),
    images: img("reverie", "Reverie"), featured: 3, createdAt: "2026-10-05",
  },
  {
    id: "p13", handle: "seraphine", title: "Seraphine", subtitle: "Contoured G-spot massager",
    description: "A gently curved silhouette with a spiralled, softly ribbed tip and a single-touch control. Designed to find the right angle without effort, finished in velvet-soft silicone.",
    category: "sculptural-essentials", materials: ["Medical-grade silicone"], price: usd(129),
    images: img("seraphine", "Seraphine"), badge: "New", featured: 8, createdAt: "2026-11-14",
  },
  {
    id: "p14", handle: "rosalind", title: "Rosalind", subtitle: "Air-pulse rose massager",
    description: "A sculpted rose in soft-touch silicone. At its heart, gentle waves of air pulse in rhythm, drawing sensation in without direct contact or vibration. One discreet touch control, a whisper-quiet motor and a shape that sits naturally in the palm.",
    category: "sculptural-essentials", materials: ["Medical-grade silicone"], price: usd(89),
    images: img("rosalind", "Rosalind"), badge: "New", featured: 7, createdAt: "2026-11-17",
  },
  {
    // Added 2026-11-20 from Steve's photo. Placeholders to confirm: price, materials, specs.
    id: "p15", handle: "clitoral-air-stimulator", title: "Clitoral Air Stimulator", subtitle: "Air-pulse stimulator",
    description: "A sleek, ergonomic form finished in soft-touch silicone with a fine gold accent. Gentle waves of air pulse around the clitoris without direct contact, building sensation gradually, with a whisper-quiet motor and simple controls that sit naturally under the thumb.",
    category: "sculptural-essentials", materials: ["Medical-grade silicone"], price: usd(119),
    images: [
      { src: "/media/products/clitoral-air-stimulator-1.jpg", alt: "Clitoral Air Stimulator in black with a gold band" },
      { src: "/media/products/clitoral-air-stimulator-2.jpg", alt: "Clitoral Air Stimulator, close view of the air-pulse head" },
    ],
    badge: "New", featured: 7, createdAt: "2026-11-20",
  },
  {
    // Added 2026-11-20 in place of the Womanizer Premium 2. Image is a studio-style render until the
    // supplier sends clean (unwatermarked) photos. Placeholders to confirm: price, materials, specs.
    id: "p16", handle: "carmine", title: "Carmine", subtitle: "Lipstick-slim bullet massager",
    description: "Slender as a lipstick and lacquered in deep carmine, it slips into a clutch without a second glance. A single, softly rounded tip delivers focused, deep vibration, controlled by one discreet button at its base.",
    category: "sculptural-essentials", materials: ["Body-safe ABS"], price: usd(49),
    images: [
      { src: "/media/products/carmine-1.jpg", alt: "Carmine, a slim glossy red bullet massager" },
      { src: "/media/products/carmine-2.jpg", alt: "Carmine, close view of its lacquered finish" },
    ],
    badge: "New", featured: 9, createdAt: "2026-11-20",
  },
  {
    // Added 2026-11-20 at Steve's request (For Him), $240 set by Steve. Image is the supplier photo cut out onto a subdued background; the supplier's
    // photo carries marketing text. Placeholders to confirm with the supplier: price, materials, specs, voice feature.
    id: "p17", handle: "celestial", title: "Celestial", subtitle: "Rotating, thrusting automatic stroker",
    description: "A sleek pearl-white capsule with a glass-black touch panel that glows softly to life. Inside, a skin-soft sleeve rotates and draws in rhythmic waves, hands-free, while a quiet motor keeps every moment your own.",
    category: "sculptural-essentials", materials: ["Body-safe ABS"], price: usd(240),
    specs: [{ label: "Sleeve", value: "Removable, skin-soft TPE" }, { label: "Motion", value: "Rotation and thrust, several modes" }, { label: "Controls", value: "Touch panel" }, { label: "Care", value: "Rinse the sleeve, use a water-based lubricant" }],
    images: [
      { src: "/media/products/celestial-1.jpg", alt: "Celestial, an ivory automatic stroker with a black touch panel" },
      { src: "/media/products/celestial-2.jpg", alt: "Celestial, close view of the glowing touch panel" },
    ],
    badge: "New", featured: 9, createdAt: "2026-11-20",
  },
];

/**
 * Curated pieces from other makers. Prices are the makers' US list prices where we could verify
 * them (see the README); confirm every price and spec against the supplier's price list before launch.
 */
const curated: Base[] = [
  {
    id: "b1", handle: "lelo-dot", brand: "LELO", title: "DOT", subtitle: "Pinpoint external massager",
    description: "LELO's Infinite Loop technology traces a slow elliptical path rather than a simple buzz, so sensation stays precise and never numbing. Sculpted in body-safe silicone, fully waterproof and finished with the craftsmanship LELO is known for.",
    category: "sculptural-essentials", materials: ["Medical-grade silicone", "Body-safe ABS"], price: usd(179),
    images: img("lelo-dot", "LELO DOT"), badge: "Bestseller", featured: 10, createdAt: "2026-11-03",
    specs: [{ label: "Movement", value: "Infinite Loop elliptical tip" }, { label: "Modes", value: "8" }, { label: "Water resistance", value: "Fully waterproof" }, { label: "Battery", value: "Up to 2 hours use, 2-hour charge" }, { label: "Weight", value: "98 g" }, { label: "Care", value: "Pair with a water-based lubricant" }, { label: "Presentation", value: "Satin storage pouch" }],
  },
  {
    id: "b2", handle: "le-wand-rechargeable", brand: "Le Wand", title: "Rechargeable Massager", subtitle: "High-power body wand",
    description: "The modern successor to the classic corded wand: deep, resonant power from a heavy-duty motor, a seamless silicone head and twenty modes, all without a cable. A refined choice for full-body massage and intense, rumbling sensation.",
    category: "sculptural-essentials", materials: ["Medical-grade silicone", "Body-safe ABS"], price: usd(180),
    images: img("le-wand-rechargeable", "Le Wand Rechargeable Massager"), badge: "Bestseller", featured: 9, createdAt: "2026-10-22",
    specs: [{ label: "Modes", value: "20 vibration patterns, 10 intensities" }, { label: "Head", value: "Seamless silicone, flexible neck" }, { label: "Size", value: "34 cm long, 6.2 cm head" }, { label: "Weight", value: "670 g" }, { label: "Battery", value: "Up to 3 hours use, 3-hour charge" }, { label: "Noise", value: "Under 68 dB at full power" }, { label: "Water resistance", value: "Splash-proof, not submersible" }, { label: "Warranty", value: "1 year" }],
  },
  {
    id: "b3", handle: "we-vibe-chorus", brand: "We-Vibe", title: "Chorus", subtitle: "Wearable couples' massager",
    description: "A softly flexible U-shape that adjusts to fit and stays in place during intimacy, with dual motors for internal and external sensation. Squeeze the pebble remote and intensity follows your grip, or share control through the We-Vibe app.",
    category: "sculptural-essentials", materials: ["Medical-grade silicone", "Body-safe ABS"], price: usd(219),
    images: img("we-vibe-chorus", "We-Vibe Chorus"), featured: 9, createdAt: "2026-09-30",
    specs: [{ label: "Control", value: "Squeeze remote, touch sensors and We-Vibe app" }, { label: "Modes", value: "10, plus bonus modes in the app" }, { label: "Fit", value: "Adjustable, flexible arms" }, { label: "Size", value: "7.8 x 4.4 x 3.3 cm" }, { label: "Water resistance", value: "IPX7 (remote splashproof)" }, { label: "Battery", value: "Up to 90 minutes, 2-hour charge" }, { label: "Presentation", value: "Charging case and storage pouch" }, { label: "Warranty", value: "2 years" }],
  },
  {
    id: "b4", handle: "arcwave-ion-2", brand: "Arcwave", title: "Ion 2", subtitle: "Air-pulse stroker",
    description: "Arcwave brings Pleasure Air, contact-free airwave stimulation, to male-focused design. A CleanTech silicone sleeve, Smart Silence skin sensing that starts and stops on its own, and a twist-to-open body that makes cleaning effortless.",
    category: "sculptural-essentials", materials: ["Medical-grade silicone", "Body-safe ABS"], price: usd(169),
    images: img("arcwave-ion-2", "Arcwave Ion 2"), badge: "New", featured: 8, createdAt: "2026-11-08",
    specs: [{ label: "Technology", value: "Pleasure Air" }, { label: "Programs", value: "3 Autopilot presets" }, { label: "Sensing", value: "Smart Silence auto on and off" }, { label: "Sleeve", value: "CleanTech silicone, twist to open" }, { label: "Size", value: "15.4 x 5.2 x 8.3 cm" }, { label: "Water resistance", value: "IPX7" }, { label: "Battery", value: "Up to 90 minutes, 2-hour charge" }, { label: "Warranty", value: "2 years" }],
  },
  {
    id: "b5", handle: "lovense-osci-3", brand: "Lovense", title: "Osci 3", subtitle: "Warming oscillating rabbit",
    description: "Rather than a simple vibration, an oscillating G-spot head moves with a deep, rhythmic motion, paired with an external motor and a gentle warming mode that reaches body temperature in a minute. Endless patterns through the Lovense app.",
    category: "sculptural-essentials", materials: ["Medical-grade silicone"], price: usd(139),
    images: img("lovense-osci-3", "Lovense Osci 3"), badge: "New", featured: 8, createdAt: "2026-11-05",
    specs: [{ label: "Movement", value: "G-spot tapping with external vibration" }, { label: "Warming", value: "Gentle, body-like heat" }, { label: "Control", value: "Lovense Remote app" }, { label: "Material", value: "Silicone" }, { label: "Water resistance", value: "IPX7" }, { label: "Battery", value: "Up to 170 minutes, 75-minute charge" }, { label: "Weight", value: "185 g" }, { label: "Warranty", value: "1 year" }],
  },
  {
    id: "b6", handle: "lovense-solace-pro", brand: "Lovense", title: "Solace Pro", subtitle: "Hands-free automatic stroker",
    description: "Lovense's most advanced piece for him. Precision thrusting up to 300 strokes a minute, customisable AI patterns, and two-way remote control for solo evenings or partners miles apart. An optional desk mount makes it truly hands-free.",
    category: "sculptural-essentials", materials: ["Body-safe ABS"], price: usd(299),
    images: img("lovense-solace-pro", "Lovense Solace Pro"), badge: "New", featured: 7, createdAt: "2026-11-10",
    specs: [{ label: "Movement", value: "Thrusting, up to 300 strokes per minute" }, { label: "Stroke length", value: "3 levels, app adjustable" }, { label: "Control", value: "Lovense Remote app, with AI Sync" }, { label: "Materials", value: "ABS and PC body, silicone, TPE sleeve" }, { label: "Battery", value: "Up to 14 hours use, 135-minute charge" }, { label: "Weight", value: "1.2 kg" }, { label: "Water resistance", value: "IPX4 splash resistant" }, { label: "Warranty", value: "1 year" }],
  },
  {
    id: "b7", handle: "the-handy", brand: "The Handy", title: "The Handy", subtitle: "App-connected stroker",
    description: "Compact, quick and quietly powerful, with a brushless motor, adjustable stroke length and an open API. Its community has created thousands of scripts that sync to video and VR, which makes it one of the most versatile pieces of its kind.",
    category: "sculptural-essentials", materials: ["Body-safe ABS"], price: usd(249),
    images: img("the-handy", "The Handy"), featured: 6, createdAt: "2026-08-18",
    specs: [{ label: "Speed", value: "Up to 10 strokes per second" }, { label: "Stroke length", value: "Adjustable, up to 11 cm" }, { label: "Sleeve fit", value: "1 to 7 cm" }, { label: "Control", value: "Wi-Fi app, open API" }, { label: "Sync", value: "Interactive video and VR scripts" }, { label: "In the box", value: "Handy, TrueGrip band, 3 sleeves, lubricant" }],
  },
  {
    id: "b8", handle: "bellesa-airvibe", brand: "Bellesa", title: "AirVibe", subtitle: "Air-suction and internal massager",
    description: "Bellesa's celebrated dual piece pairs gentle air suction for external sensation with a curved internal arm for G-spot vibration, built on the brand's Diskreet Series technology. Soft, rounded and quietly confident.",
    category: "sculptural-essentials", materials: ["Medical-grade silicone"], price: usd(89),
    images: img("bellesa-airvibe", "Bellesa AirVibe"), featured: 7, createdAt: "2026-07-14",
    specs: [{ label: "Sensation", value: "Air suction and G-spot vibration" }, { label: "Technology", value: "Diskreet Series" }, { label: "Care", value: "Pair with a water-based lubricant" }],
  },
  {
    id: "b9", handle: "b-vibe-rimming-plug-2", brand: "b-Vibe", title: "Rimming Plug 2", subtitle: "Rotating plug with remote",
    description: "A ring of rotating beads turns gently beneath the surface while a separate motor adds vibration, each with its own settings. Body-safe silicone, a tapered shape designed for comfort, and a wireless remote. Always use with a generous water-based lubricant.",
    category: "sculptural-essentials", materials: ["Medical-grade silicone", "Body-safe ABS"], price: usd(129),
    images: img("b-vibe-rimming-plug-2", "b-Vibe Rimming Plug 2"), featured: 5, createdAt: "2026-06-02",
    specs: [{ label: "Movement", value: "7 rotation modes, 6 vibration modes" }, { label: "Control", value: "Wireless remote, up to 9 m" }, { label: "Size", value: "12.5 cm insertable, 4 cm at widest" }, { label: "Battery", value: "About 1.5 hours use, 2-hour charge" }, { label: "Care", value: "Water-based lubricant only" }, { label: "Warranty", value: "2 years" }],
  },
  {
    id: "b10", handle: "tenga-vacuum-gyro-roller", brand: "TENGA", title: "Vacuum Gyro Roller", subtitle: "Rotating vacuum stroker",
    description: "A gyro sensor guides smooth 360-degree rotation while adjustable vacuum pressure holds the textured sleeve close. Choose automatic rolling or guide it by hand, and change sleeves to suit the mood.",
    category: "sculptural-essentials", materials: ["Body-safe ABS"], price: usd(149),
    images: img("tenga-vacuum-gyro-roller", "TENGA Vacuum Gyro Roller"), featured: 4, createdAt: "2026-05-20",
    specs: [{ label: "Movement", value: "Gyro-guided 360-degree rotation" }, { label: "Suction", value: "2 vacuum strengths, 4 rhythms" }, { label: "Modes", value: "Automatic or manual rolling" }, { label: "Sleeves", value: "Replaceable TENGA Rolling Cups" }, { label: "Power", value: "Rechargeable" }],
  },
  // Bestsellers for her and for him, added 2026-11-13 (prices are US list prices; confirm with suppliers)
  {
    id: "c1", handle: "magic-wand-rechargeable", brand: "Magic Wand", title: "Rechargeable", subtitle: "The iconic body wand, cordless",
    description: "The original, reimagined without the cord. A smooth silicone head on a flexible neck delivers the deep, famously powerful sensation that made it a classic, with eight vibration styles and hours of play from a single charge.",
    category: "sculptural-essentials", materials: ["Medical-grade silicone", "Body-safe ABS"], price: usd(150),
    images: img("magic-wand-rechargeable", "Magic Wand Rechargeable"), badge: "Bestseller", featured: 10, createdAt: "2026-10-30",
    specs: [{ label: "Modes", value: "4 speeds up to 6,300 RPM, 4 patterns" }, { label: "Size", value: "About 33 cm, 6 cm head" }, { label: "Weight", value: "About 590 g" }, { label: "Battery", value: "Up to 3 hours use" }, { label: "Power", value: "Cordless, or plugged in as it charges" }, { label: "Water resistance", value: "Not waterproof, for external use" }, { label: "Warranty", value: "1 year" }],
  },
  {
    id: "c2", handle: "womanizer-premium-2", brand: "Womanizer", title: "Premium 2", subtitle: "Pleasure Air clitoral stimulator",
    description: "Womanizer's touch-free Pleasure Air technology, refined. Fourteen intensities, an Autopilot that varies the rhythm for you, and Smart Silence, which only switches on at the skin. Soft silicone and fully waterproof.",
    category: "sculptural-essentials", materials: ["Medical-grade silicone", "Body-safe ABS"], price: usd(189),
    images: img("womanizer-premium-2", "Womanizer Premium 2"), badge: "Bestseller", featured: 10, createdAt: "2026-10-12",
    specs: [{ label: "Technology", value: "Pleasure Air, touch-free" }, { label: "Intensities", value: "14, plus Autopilot 2.0" }, { label: "Sensing", value: "Smart Silence" }, { label: "Size", value: "15.5 x 5 x 3.5 cm, 141 g" }, { label: "Water resistance", value: "IPX7" }, { label: "Battery", value: "Up to 4 hours use, 2-hour charge" }, { label: "In the box", value: "Two stimulator heads, cotton pouch" }, { label: "Warranty", value: "5 years" }],
  },
  {
    id: "c3", handle: "womanizer-next", brand: "Womanizer", title: "Next", subtitle: "Pleasure Air with Climax Control",
    description: "The newest Womanizer pairs the brand's Pleasure Air with Climax Control, so you can hold the moment as long as you like before letting go. Silicone, submersible, and quietly beautiful on the nightstand.",
    category: "sculptural-essentials", materials: ["Medical-grade silicone", "Body-safe ABS"], price: usd(229),
    images: img("womanizer-next", "Womanizer Next"), badge: "New", featured: 9, createdAt: "2026-11-09",
    specs: [{ label: "Technology", value: "3D Pleasure Air with Climax Control" }, { label: "Intensities", value: "14, plus Autopilot" }, { label: "Climax Control", value: "3 depth levels" }, { label: "Sensing", value: "Smart Silence, near silent" }, { label: "Water resistance", value: "IPX7" }, { label: "Battery", value: "Up to 4 hours use, 2-hour magnetic charge" }, { label: "In the box", value: "Spare stimulator head, cotton pouch" }, { label: "Warranty", value: "5 years" }],
  },
  {
    id: "c4", handle: "lelo-gigi-3", brand: "LELO", title: "GIGI 3", subtitle: "App-connected internal massager",
    description: "A gently flattened tip, curved to find its place, in LELO's extra-soft silicone. Eight vibration patterns on the body and two more in the LELO app, which lets you shape sensation in real time. Fully waterproof.",
    category: "sculptural-essentials", materials: ["Medical-grade silicone"], price: usd(149),
    images: img("lelo-gigi-3", "LELO GIGI 3"), featured: 8, createdAt: "2026-09-18",
    specs: [{ label: "Shape", value: "Flattened tip for G-spot or external use" }, { label: "Patterns", value: "8, plus 2 in the app" }, { label: "Control", value: "Buttons or LELO app" }, { label: "Material", value: "Body-safe silicone" }, { label: "Water resistance", value: "Fully waterproof" }, { label: "Care", value: "Pair with a water-based lubricant" }],
  },
  {
    id: "c5", handle: "lelo-sona-3-cruise", brand: "LELO", title: "SONA 3 Cruise", subtitle: "Sonic clitoral massager",
    description: "Sonic waves rather than suction, for a deeper, more resonant external sensation. Ten modes with sixteen micro-intensities, app-connected and fully waterproof.",
    category: "sculptural-essentials", materials: ["Medical-grade silicone"], price: usd(179),
    images: img("lelo-sona-3-cruise", "LELO SONA 3 Cruise"), badge: "New", featured: 8, createdAt: "2026-11-02",
    specs: [{ label: "Technology", value: "Sonic waves, touch-free" }, { label: "Cruise Control", value: "Holds power steady under pressure" }, { label: "Modes", value: "10, plus 2 in the app" }, { label: "Intensity", value: "SmoothRise, 16 micro-steps" }, { label: "Control", value: "Buttons, LELO app or long distance" }, { label: "Water resistance", value: "Fully waterproof" }],
  },
  {
    id: "c6", handle: "lelo-enigma-double-sonic", brand: "LELO", title: "ENIGMA Double Sonic", subtitle: "Dual sonic massager",
    description: "Sonic waves inside and out, from one sculpted form. LELO's dual-stimulation icon in extra-soft silicone, with eight settings and app control for when you'd like to explore further.",
    category: "sculptural-essentials", materials: ["Medical-grade silicone"], price: usd(249),
    images: img("lelo-enigma-double-sonic", "LELO ENIGMA Double Sonic"), featured: 7, createdAt: "2026-08-26",
    specs: [{ label: "Technology", value: "Dual sonic, internal and external" }, { label: "Settings", value: "8" }, { label: "Control", value: "Buttons or LELO app, motors set independently" }, { label: "Material", value: "Body-safe silicone" }, { label: "Water resistance", value: "Fully waterproof" }, { label: "Care", value: "Pair with a water-based lubricant" }],
  },
  {
    id: "c7", handle: "lelo-smart-wand-2", brand: "LELO", title: "SMART WAND 2", subtitle: "Body massager, medium",
    description: "A full-body massager with a deep, rumbling motor and ten patterns, made for long, unhurried sessions. Fully waterproof, with LELO's extra-long-lasting charge.",
    category: "sculptural-essentials", materials: ["Medical-grade silicone", "Body-safe ABS"], price: usd(219),
    images: img("lelo-smart-wand-2", "LELO SMART WAND 2"), featured: 6, createdAt: "2026-07-22",
    specs: [{ label: "Patterns", value: "10" }, { label: "Material", value: "Body-safe silicone, warm to the touch" }, { label: "Handle", value: "Steady grip for controlled pressure" }, { label: "Water resistance", value: "Fully waterproof" }, { label: "Battery", value: "Extra-long-lasting charge" }, { label: "Size", value: "Medium" }],
  },
  {
    id: "c8", handle: "lovense-lush-4", brand: "Lovense", title: "Lush 4", subtitle: "Wearable app-connected massager",
    description: "Lovense's best-loved wearable, now in its fourth generation. A soft silicone curve that stays discreetly in place, close or long-distance app control, and up to five hours of play. Fully submersible.",
    category: "sculptural-essentials", materials: ["Medical-grade silicone"], price: usd(149),
    images: img("lovense-lush-4", "Lovense Lush 4"), badge: "Bestseller", featured: 9, createdAt: "2026-10-04",
    specs: [{ label: "Control", value: "Lovense Remote app, close or long distance" }, { label: "Modes", value: "Unlimited patterns in the app" }, { label: "Materials", value: "Silicone, electroplated finish" }, { label: "Weight", value: "75 g" }, { label: "Battery", value: "Up to 350 minutes, 50-minute charge" }, { label: "Water resistance", value: "IPX7" }, { label: "Fit", value: "Wearable, curved to stay in place" }, { label: "Warranty", value: "1 year" }],
  },
  {
    id: "c9", handle: "we-vibe-sync-o", brand: "We-Vibe", title: "Sync O", subtitle: "Wearable couples' massager",
    description: "A softly adjustable shape worn during intimacy, so both of you feel every pulse. Ten intensities, a remote or the We-Vibe app, and long play time for evenings that don't hurry.",
    category: "sculptural-essentials", materials: ["Medical-grade silicone"], price: usd(179),
    images: img("we-vibe-sync-o", "We-Vibe Sync O"), badge: "New", featured: 7, createdAt: "2026-11-06",
    specs: [{ label: "Control", value: "Remote, on-toy button and We-Vibe app" }, { label: "Fit", value: "Flexible O-shaped arm stays in place" }, { label: "Size", value: "8 x 4.4 x 4.5 cm" }, { label: "Material", value: "Body-safe silicone" }, { label: "Battery", value: "Up to 150 minutes, 90-minute charge" }, { label: "Water resistance", value: "IPX7" }, { label: "Warranty", value: "2 years" }],
  },
  {
    id: "c10", handle: "we-vibe-touch-x", brand: "We-Vibe", title: "Touch X", subtitle: "Contoured external massager",
    description: "A palm-sized, softly contoured external massager that nestles comfortably in the hand. One of We-Vibe's quiet bestsellers.",
    category: "sculptural-essentials", materials: ["Medical-grade silicone"], price: usd(109),
    images: img("we-vibe-touch-x", "We-Vibe Touch X"), featured: 6, createdAt: "2026-06-28",
    specs: [{ label: "Type", value: "External massager" }, { label: "Modes", value: "7 patterns, 8 intensities" }, { label: "Size", value: "10.2 x 4.3 x 3.4 cm" }, { label: "Battery", value: "Up to 2 hours use, 90-minute charge" }, { label: "Water resistance", value: "IPX7" }, { label: "Travel", value: "Travel lock" }, { label: "Warranty", value: "2 years" }],
  },
  {
    id: "c11", handle: "arcwave-voy", brand: "Arcwave", title: "Voy", subtitle: "Adjustable-fit stroker",
    description: "Arcwave's elegant manual stroker. A twist dial adjusts the fit across eight settings, and the CleanTech silicone sleeve slides out to rinse clean. No batteries, no noise, nothing to charge.",
    category: "sculptural-essentials", materials: ["Medical-grade silicone", "Body-safe ABS"], price: usd(99),
    images: img("arcwave-voy", "Arcwave Voy"), badge: "Bestseller", featured: 9, createdAt: "2026-09-12",
    specs: [{ label: "Fit", value: "Tightness Adjustment System, 8 settings" }, { label: "Sleeve", value: "CleanTech silicone, removable" }, { label: "Power", value: "None required" }, { label: "Warranty", value: "2 years" }],
  },
  {
    id: "c12", handle: "arcwave-perk", brand: "Arcwave", title: "Perk", subtitle: "Vibrating prostate massager",
    description: "A considered first step into prostate pleasure, from the makers of the Ion. Gently curved, quietly vibrating, and designed with Arcwave's characteristic restraint.",
    category: "sculptural-essentials", materials: ["Medical-grade silicone"], price: usd(130),
    images: img("arcwave-perk", "Arcwave Perk"), badge: "New", featured: 7, createdAt: "2026-11-07",
    specs: [{ label: "Type", value: "Vibrating prostate massager" }, { label: "Design", value: "Bendable inner arm, outer perineum pad" }, { label: "Motors", value: "2" }, { label: "Control", value: "Remote: 10 patterns, 10 intensities" }, { label: "Battery", value: "Up to 2 hours use, 90-minute charge" }, { label: "Water resistance", value: "IPX7 (remote splashproof)" }, { label: "Warranty", value: "2 years" }],
  },
  {
    id: "c13", handle: "lelo-f1s-v3-xl", brand: "LELO", title: "F1S V3 XL", subtitle: "App-connected stroker",
    description: "LELO's sculpted stroker in its largest form. Two motors, an app with an interactive AI mode, and a fully waterproof shell that looks more like a design object than a device.",
    category: "sculptural-essentials", materials: ["Medical-grade silicone", "Body-safe ABS"], price: usd(190),
    images: img("lelo-f1s-v3-xl", "LELO F1S V3 XL"), badge: "New", featured: 8, createdAt: "2026-10-25",
    specs: [{ label: "Motors", value: "2, synchronised" }, { label: "Sleeve", value: "Liquid silicone ribs, XL fit" }, { label: "Settings", value: "4, plus 4 in the app" }, { label: "Control", value: "LELO app, with interactive AI mode" }, { label: "Water resistance", value: "Fully waterproof" }],
  },
  {
    id: "c14", handle: "lelo-tor-3", brand: "LELO", title: "TOR 3", subtitle: "App-connected couples' ring",
    description: "A soft, stretchable ring that adds vibration for both partners during intimacy. Eight patterns, Bluetooth app control, fully waterproof.",
    category: "sculptural-essentials", materials: ["Medical-grade silicone"], price: usd(170),
    images: img("lelo-tor-3", "LELO TOR 3"), featured: 7, createdAt: "2026-08-14",
    specs: [{ label: "Patterns", value: "8" }, { label: "Material", value: "Highly stretchable body-safe silicone" }, { label: "Control", value: "Buttons or LELO app" }, { label: "Water resistance", value: "Fully waterproof" }, { label: "Care", value: "Pair with a water-based lubricant" }],
  },
  {
    id: "c15", handle: "lelo-hugo-2", brand: "LELO", title: "HUGO 2", subtitle: "Remote-controlled prostate massager",
    description: "A smooth silicone prostate massager with wireless remote control, so you can keep it to yourself or hand control to a partner. Fully waterproof.",
    category: "sculptural-essentials", materials: ["Medical-grade silicone"], price: usd(220),
    images: img("lelo-hugo-2", "LELO HUGO 2"), featured: 7, createdAt: "2026-07-30",
    specs: [{ label: "Motors", value: "2, base and tip" }, { label: "Settings", value: "4, plus 6 in the app" }, { label: "Control", value: "Buttons or LELO app" }, { label: "Water resistance", value: "Fully waterproof" }, { label: "Care", value: "Water-based lubricant only" }],
  },
  {
    id: "c16", handle: "lovense-edge-2", brand: "Lovense", title: "Edge 2", subtitle: "Adjustable prostate massager",
    description: "An adjustable silicone body that bends to fit, with a curved tip. Close or long-distance app control and music sync make it as easy to share as to keep to yourself.",
    category: "sculptural-essentials", materials: ["Medical-grade silicone"], price: usd(140),
    images: img("lovense-edge-2", "Lovense Edge 2"), featured: 6, createdAt: "2026-09-04",
    specs: [{ label: "Fit", value: "Adjustable head angle" }, { label: "Control", value: "Lovense Remote app, close or long distance" }, { label: "Material", value: "Body-safe silicone" }, { label: "Weight", value: "151 g" }, { label: "Battery", value: "Up to 130 minutes" }, { label: "Water resistance", value: "IPX7" }, { label: "Warranty", value: "1 year" }],
  },
  {
    id: "c17", handle: "lovense-max-2", brand: "Lovense", title: "Max 2", subtitle: "App-connected stroker",
    description: "Lovense's app-connected stroker for him. Control it yourself, hand it to a partner through the Lovense app, or pair it with their Lovense piece from anywhere.",
    category: "sculptural-essentials", materials: ["Body-safe ABS"], price: usd(140),
    images: img("lovense-max-2", "Lovense Max 2"), featured: 6, createdAt: "2026-06-16",
    specs: [{ label: "Movement", value: "Contracting air chamber and vibration" }, { label: "Control", value: "Lovense Remote app, close or long distance" }, { label: "Materials", value: "ABS body, TPE sleeve" }, { label: "Weight", value: "750 g" }, { label: "Battery", value: "95 to 215 minutes, 100-minute charge" }, { label: "Water resistance", value: "IPX6 water resistant" }, { label: "Warranty", value: "1 year" }],
  },
  {
    id: "c18", handle: "we-vibe-vector-plus", brand: "We-Vibe", title: "Vector+", subtitle: "Adjustable prostate massager",
    description: "Two motors in an adjustable silicone body that holds its position for a personal fit. A slim remote or the We-Vibe app give you, or a partner, complete control.",
    category: "sculptural-essentials", materials: ["Medical-grade silicone"], price: usd(149),
    images: img("we-vibe-vector-plus", "We-Vibe Vector+"), featured: 6, createdAt: "2026-08-08",
    specs: [{ label: "Control", value: "Remote and We-Vibe app" }, { label: "Modes", value: "4 intensities, 6 patterns" }, { label: "Battery", value: "Up to 2 hours use, 90-minute charge" }, { label: "Water resistance", value: "Fully submersible" }, { label: "Care", value: "Water-based lubricant only" }],
  },
  {
    id: "c19", handle: "tenga-flip-zero", brand: "TENGA", title: "Flip Zero", subtitle: "Reusable luxury stroker",
    description: "TENGA's flagship reusable design. The shell opens like a book for effortless cleaning and drying, and the intricate inner texture is engineered for a remarkable sensation. Nothing to charge.",
    category: "sculptural-essentials", materials: ["Body-safe ABS"], price: usd(100),
    images: img("tenga-flip-zero", "TENGA Flip Zero"), featured: 5, createdAt: "2026-05-26",
    specs: [{ label: "Design", value: "Opens flat to clean and dry" }, { label: "Power", value: "None required" }, { label: "Care", value: "Use a water-based lubricant" }],
  },
  {
    id: "c20", handle: "kiiroo-keon", brand: "Kiiroo", title: "Keon", subtitle: "Interactive stroker set",
    description: "An automatic stroker that moves in time with interactive content through the Kiiroo app, supplied as a complete set.",
    category: "sculptural-essentials", materials: ["Body-safe ABS"], price: usd(285),
    images: img("kiiroo-keon", "Kiiroo Keon"), featured: 5, createdAt: "2026-07-08",
    specs: [{ label: "Movement", value: "Automatic stroking, up to 230 per minute" }, { label: "Stroke length", value: "Up to 7.5 cm, app adjustable" }, { label: "Control", value: "FeelConnect app, Bluetooth and Wi-Fi" }, { label: "Sync", value: "Interactive video, VR and partner toys" }, { label: "Battery", value: "30 minutes to 2 hours, 4-hour charge" }, { label: "Weight", value: "1.1 kg" }, { label: "Water resistance", value: "Not waterproof" }, { label: "Warranty", value: "1 year" }],
  },
];

const W: Feature = "Waterproof", R: Feature = "Rechargeable", APP: Feature = "App controlled", REM: Feature = "Remote controlled", HF: Feature = "Hands-free", WARM: Feature = "Warming";

/** Who each piece is for, and its features (for the "Shop for" and "Features" filters). */
const tags: Record<string, [Audience[], Feature[]]> = {
  aurelia: [["her"], [W, R]],
  seraphine: [["her"], []],
  rosalind: [["her"], [R]],
  "clitoral-air-stimulator": [["her"], [R]],
  carmine: [["her"], [R]],
  celestial: [["him"], [R]],
  lumen: [["her"], [W, R]],
  solenne: [["her", "him"], [W]],
  vesper: [["her"], [W, R]],
  orbis: [["two"], [REM, HF, W, R]],
  halo: [["him", "two"], []],
  nocturne: [["two"], []],
  velours: [["two"], []],
  plume: [["two"], []],
  ember: [["two"], []],
  elixir: [["two"], []],
  reverie: [["two"], []],
  "lelo-dot": [["her"], [W, R]],
  "le-wand-rechargeable": [["her", "two"], [R]],
  "we-vibe-chorus": [["two"], [APP, REM, HF, W, R]],
  "arcwave-ion-2": [["him"], [HF, W, R]],
  "lovense-osci-3": [["her"], [APP, W, R, WARM]],
  "lovense-solace-pro": [["him"], [APP, REM, HF]],
  "the-handy": [["him"], [APP, HF]],
  "bellesa-airvibe": [["her"], []],
  "b-vibe-rimming-plug-2": [["him", "two"], [REM, HF, R]],
  "tenga-vacuum-gyro-roller": [["him"], [HF, R]],
  "magic-wand-rechargeable": [["her", "two"], [R]],
  "womanizer-premium-2": [["her"], [W, R]],
  "womanizer-next": [["her"], [W, R]],
  "lelo-gigi-3": [["her"], [APP, W, R]],
  "lelo-sona-3-cruise": [["her"], [APP, W, R]],
  "lelo-enigma-double-sonic": [["her"], [APP, W, R]],
  "lelo-smart-wand-2": [["her", "two"], [W, R]],
  "lovense-lush-4": [["her", "two"], [APP, HF, W, R]],
  "we-vibe-sync-o": [["her", "two"], [APP, REM, HF, W, R]],
  "we-vibe-touch-x": [["her"], [R]],
  "arcwave-voy": [["him"], []],
  "arcwave-perk": [["him"], [R]],
  "lelo-f1s-v3-xl": [["him"], [APP, W, R]],
  "lelo-tor-3": [["him", "two"], [APP, HF, W, R]],
  "lelo-hugo-2": [["him"], [REM, HF, W, R]],
  "lovense-edge-2": [["him", "two"], [APP, HF, W, R]],
  "lovense-max-2": [["him"], [APP, R]],
  "we-vibe-vector-plus": [["him"], [APP, REM, HF, W, R]],
  "tenga-flip-zero": [["him"], []],
  "kiiroo-keon": [["him"], [APP, HF]],
};

/**
 * Product photos: retailer pack shots (Lovehoney CDN). Steve chose on 2026-11-19 to show these on the
 * live site before reseller approval. Swap for official brand assets as each supplier approves.
 */
const PHOTOS: Record<string, string> = {
  "lelo-dot": "86048_a48259_purple",
  "le-wand-rechargeable": "80751_a44845_white",
  "we-vibe-chorus": "87335_a49322_black",
  "arcwave-ion-2": "86988_a49023_black",
  "lovense-osci-3": "87627_a49594_pink",
  "lovense-solace-pro": "87263_a49258_black",
  "the-handy": "89236_a50940_black",
  "b-vibe-rimming-plug-2": "72104_a39268_blue",
  "magic-wand-rechargeable": "61141_a34101_white",
  "womanizer-premium-2": "84383_a46996_blue",
  "womanizer-next": "86328_a48484_purple",
  "lelo-gigi-3": "87464_a49457_purple",
  "lelo-sona-3-cruise": "88330_a50182_black",
  "lelo-enigma-double-sonic": "88329_a50181_purple",
  "lelo-smart-wand-2": "79907_a44323_black",
  "lovense-lush-4": "87626_a49593_pink",
  "we-vibe-touch-x": "82225_a45648_green",
  "arcwave-voy": "85023_a47471_black",
  "arcwave-perk": "87089_a49129_black",
  "lelo-f1s-v3-xl": "87080_a49118_blue",
  "lelo-tor-3": "86385_a48538_blue",
  "lelo-hugo-2": "87010_a34279_green",
  "lovense-edge-2": "82399_a45783_black",
  "lovense-max-2": "80155_a44502_white",
  "we-vibe-vector-plus": "87708_a49655_blue",
  "tenga-flip-zero": "72848_a36407_black",
  "kiiroo-keon": "83905_a46717_black",
};
const LH = "https://media.lovehoneyassets.com/i/lovehoney/";
const withPhotos = (p: Product): Product => {
  const id = PHOTOS[p.handle];
  if (!id) return p;
  return { ...p, images: [
    { src: `${LH}${id}_000?w=1200&fmt=auto`, alt: p.images[0]?.alt ?? p.title },
    { src: `${LH}${id}_001?w=1200&fmt=auto`, alt: p.images[1]?.alt ?? p.title },
  ] };
};

/**
 * Launch range (2026-11-17): Steve asked to condense the catalogue to what a new business can stock.
 * Picked for trend strength and an Australian wholesale route (Sugar and Sas: We-Vibe, Womanizer, Arcwave;
 * Calvista: Lovense; Vibratex: Magic Wand; Faire: Le Wand). Everything else stays defined below but hidden;
 * add a handle back here to bring it back.
 */
export const LAUNCH_RANGE = new Set([
  // Eden Flame own label
  "seraphine", "rosalind", "clitoral-air-stimulator",
  // For her
  // Carmine replaced the Womanizer Premium 2 (2026-11-20)
  "carmine", "magic-wand-rechargeable", "lovense-lush-4", "we-vibe-touch-x",
  // For him
  "celestial", "we-vibe-vector-plus", "lovense-edge-2", "lovense-max-2", "arcwave-ion-2",
  // For two
  "we-vibe-chorus", "we-vibe-sync-o", "le-wand-rechargeable",
  // Silk & Senses and Aromatics (simple own-label accessories, low stock cost)
  "nocturne", "velours", "ember", "elixir", "reverie",
]);

/**
 * Colourways (2026-11-20, Steve asked for a colour choice on each piece).
 * Branded colours are from the makers' current ranges as best known; CONFIRM with each supplier
 * (Sugar and Sas, Calvista, Faire) before launch and remove any you won't stock.
 * Own-label colours are proposals for the factory. Scents (Ember, Elixir, Reverie) have no colour.
 */
const OBSIDIAN = { name: "Obsidian", hex: "#1a1715" };
const CHAMPAGNE = { name: "Champagne", hex: "#d9c08e" };
const COLOURS: Record<string, Product["colors"]> = {
  seraphine: [{ name: "Plum", hex: "#6b2d5c" }, CHAMPAGNE, OBSIDIAN],
  rosalind: [{ name: "Rose", hex: "#b3263e" }, { name: "Blush", hex: "#e3a5a8" }, OBSIDIAN],
  "womanizer-premium-2": [{ name: "Bordeaux", hex: "#6e1f2e" }, { name: "Blueberry", hex: "#3b3f73" }, { name: "Black", hex: "#141414" }],
  "we-vibe-touch-x": [{ name: "Fuchsia", hex: "#c2185b" }, { name: "Green Velvet", hex: "#2f5d50" }],
  "we-vibe-vector-plus": [{ name: "Royal Blue", hex: "#2f4f9e" }, { name: "Charcoal Black", hex: "#2a2a2c" }],
  "arcwave-ion-2": [{ name: "Black", hex: "#141414" }, { name: "Blue", hex: "#2c4a7a" }],
  "lovense-max-2": [{ name: "White", hex: "#ece9e4" }, { name: "Black", hex: "#141414" }],
  "we-vibe-chorus": [{ name: "Cosmic Pink", hex: "#d77fa1" }, { name: "Cosmic Blue", hex: "#4f6bb0" }, { name: "Purple", hex: "#6b4c9a" }],
  "we-vibe-sync-o": [{ name: "Light Pink", hex: "#e8b4bc" }, { name: "Green Velvet", hex: "#2f5d50" }],
  "le-wand-rechargeable": [{ name: "Black", hex: "#141414" }, { name: "Rose Gold", hex: "linear-gradient(135deg,#e8b8a0,#b77b67)" }, { name: "Navy", hex: "#22304f" }],
  nocturne: [OBSIDIAN, CHAMPAGNE, { name: "Bordeaux", hex: "#5e1a26" }],
  velours: [OBSIDIAN, CHAMPAGNE, { name: "Bordeaux", hex: "#5e1a26" }],
};

/** Every piece we have listings for, including those not in the launch range. */
export const allProducts: Product[] = [...own.map((p) => ({ ...p, brand: "Eden Flame" })), ...curated].map((p) => ({
  ...p,
  audience: tags[p.handle]?.[0] ?? ["two"],
  features: tags[p.handle]?.[1] ?? [],
  colors: COLOURS[p.handle],
})).map(withPhotos);

/** Sample catalog (the launch range). Used when EDEN_API_URL is not set (design mode). */
export const products: Product[] = allProducts.filter((p) => LAUNCH_RANGE.has(p.handle));
