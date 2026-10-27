---
version: alpha
name: Tropical-Jade-Sunrise-career-site
description: Single-page career site for a Cloud and DevOps engineer. Palette is Figma website colour scheme 35 "Tropical jade sunrise" (teal, aqua, jade, sun yellow, coral on near-white). Sections are cut by slanted edges, two of them play a video background scrubbed by the user's scroll, the contact section is a 3D holographic paper ticket the visitor tears to send an email, and the whole page uses one shape system (pills and 20px cards) and one accent (coral) for every primary action.

colors:
  teal: "#097c87"
  aqua: "#23ced9"
  jade: "#a2cca7"
  sun: "#f9d679"
  coral: "#fca57c"
  paper: "#fdfdfd"
  teal-deep: "#04343a"
  mist: "#eef6f2"
  ink: "#04343a"
  ink-soft: "#3b5a5e"
  primary: "#fca57c"
  on-primary: "#04343a"
  on-dark: "#ffffff"
  on-dark-soft: "rgba(255,255,255,0.82)"
  glass-dark: "rgba(4,52,58,0.74)"
  glass-border: "rgba(255,255,255,0.14)"

typography:
  display-hero:
    fontFamily: Bricolage Grotesque, Geist, system-ui, sans-serif
    fontSize: clamp(2.3rem, 8.4vw, 8rem)
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: -0.04em
  display-title:
    fontFamily: Bricolage Grotesque, Geist, system-ui, sans-serif
    fontSize: clamp(2.2rem, 5.6vw, 4.6rem)
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: -0.035em
  display-card:
    fontFamily: Bricolage Grotesque, Geist, system-ui, sans-serif
    fontSize: clamp(1.35rem, 2.4vw, 1.9rem)
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.02em
  stat:
    fontFamily: Bricolage Grotesque, Geist, system-ui, sans-serif
    fontSize: clamp(2.6rem, 5vw, 4.2rem)
    fontWeight: 800
    lineHeight: 1
    letterSpacing: -0.04em
  body:
    fontFamily: Geist, system-ui, sans-serif
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.6
  button:
    fontFamily: Geist, system-ui, sans-serif
    fontSize: 15.2px
    fontWeight: 600
    lineHeight: 1.2
  nav-link:
    fontFamily: Geist, system-ui, sans-serif
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.2
  eyebrow:
    fontFamily: Geist Mono, ui-monospace, monospace
    fontSize: 12.5px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: 0.16em
    textTransform: uppercase
  tag:
    fontFamily: Geist Mono, ui-monospace, monospace
    fontSize: 12.5px
    fontWeight: 500
    lineHeight: 1.2

rounded:
  card: 20px
  pill: 9999px
  full: 9999px

spacing:
  gutter: clamp(1.25rem, 5vw, 4rem)
  section-y: clamp(4rem, 9vw, 8rem)
  slant: 6vw
  gap-sm: 0.5rem
  gap-md: 1rem
  gap-lg: 2rem

components:
  nav-bar:
    backgroundColor: "{colors.glass-dark}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.pill}"
    height: 56px
  nav-link-active:
    backgroundColor: "{colors.coral}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
  button-primary:
    backgroundColor: "{colors.coral}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 0.85rem 1.5rem
  button-ghost:
    backgroundColor: transparent
    textColor: currentColor
    borderColor: currentColor
    rounded: "{rounded.pill}"
  tag:
    backgroundColor: "{colors.jade}"
    textColor: "{colors.ink}"
    typography: "{typography.tag}"
    rounded: "{rounded.pill}"
  card-glass:
    backgroundColor: "{colors.glass-dark}"
    borderColor: "{colors.glass-border}"
    rounded: "{rounded.card}"
  bento-cell:
    rounded: "{rounded.card}"
    padding: 1.6rem
---

## Overview

A one-page career site: hero, about, experience, skills, education, projects, recommendations, contact. The page is built as a sequence of **slanted bands**. Each section's top or bottom edge is cut at about 3.4 degrees, alternating rising and falling, so the page reads as a stack of tilted planes instead of horizontal blocks.

Two sections carry a **scroll-scrubbed video background**: the hero (`Keyboard.mp4`) and Experience (`Office.mp4`). The video does not autoplay. The user's scroll position sets `currentTime`, so scrolling forward plays it and scrolling back rewinds it.

Design read: personal portfolio for recruiters and engineering managers, playful-but-credible language, native CSS plus a small amount of vanilla JS. No UI framework. A Vite + TypeScript build exists only for the contact ticket (Three.js); everything else is plain HTML, CSS and `main.js`.

Dials: variance 8, motion 6, density 4.

## Colors

The palette is sampled from the swatch of Figma "Color scheme 35: Tropical jade sunrise". Hex values were read from the swatch pixels, not guessed.

### Brand & Accent
- **Teal** (`#097c87`): structural colour. Big numbers, links on light backgrounds, the Cloud bento cell.
- **Aqua** (`#23ced9`): secondary structural accent. Bullet markers, timeline sub-items, stat rule.
- **Jade** (`#a2cca7`): tag fill, CI/CD cell, hover fill on project rows.
- **Sun** (`#f9d679`): highlight only. Hero surname, badges, Languages cell, focus ring, first quote.
- **Coral** (`#fca57c`): the single action colour. Every primary button, the active nav pill, the scroll progress bar, the marquee band.

### Surface
- **Paper** (`#fdfdfd`): light sections (About, Education, Recommendations).
- **Mist** (`#eef6f2`): alternate light sections (Skills, Projects).
- **Teal deep** (`#04343a`): dark sections (Contact), video fallback, nav, and the text colour.

Teal deep and Mist are derived in the same hue family. They are not in the swatch.

### Text
- **Ink** (`#04343a`) on light surfaces, **white** on teal and video.
- **Ink soft** (`#3b5a5e`) for body paragraphs on light surfaces.

### Semantic
No success, warning or error colours. The page has no forms. The only state colours are the focus ring (sun) and the active nav pill (coral).

### Colour rules
- One accent locked page-wide: coral for actions, never swapped for another colour in a later section.
- Sun is never used for a button.
- The page uses light surfaces plus teal-deep bands. Sections do not switch to a different theme mid-page.

## Typography

### Font Family
- **Bricolage Grotesque** (500, 700, 800, variable optical size): display, titles, card headings, big numbers.
- **Geist** (400, 500, 600): body, buttons, nav.
- **Geist Mono** (400, 500): eyebrows, tags, dates, small metadata.

Fonts load from Google Fonts with `display=swap`. Icons are Phosphor (bold weight) from the `@phosphor-icons/web` CDN.

### Hierarchy
| Role | Size | Weight | Line height | Tracking |
|---|---|---|---|---|
| Hero name | clamp 2.3rem to 8rem | 800 | 0.92 | -0.04em |
| Section title | clamp 2.2rem to 4.6rem | 700 | 0.98 | -0.035em |
| Card / job title | clamp 1.35rem to 1.9rem | 700 | 1.1 | -0.02em |
| Stat value | clamp 2.6rem to 4.2rem | 800 | 1 | -0.04em |
| Body | 17px | 400 | 1.6 | normal |
| Button | 15.2px | 600 | 1.2 | normal |
| Eyebrow | 12.5px mono, uppercase | 500 | 1.2 | 0.16em |
| Tag | 12.5px mono | 500 | 1.2 | normal |

### Principles
- Tight negative tracking on display type, normal tracking on body.
- Emphasis inside a headline uses colour on the same font (hero surname in sun with a teal underline bar), never a second family.
- Titles use `text-wrap: balance`.
- Eyebrows are rationed: hero, Skills, Recommendations only. Other sections let the title stand alone.

## Layout

### Spacing System
- Page gutter `clamp(1.25rem, 5vw, 4rem)`, content container max 1280px.
- Section vertical padding `clamp(4rem, 9vw, 8rem)` plus the slant height.
- Slant height `--s: 6vw`. Edge angle is `atan(0.06)`, about 3.43 degrees.

### Grid & Container
- `.wrap`: centred container, `min(100% - 2 * gutter, 1280px)`.
- Sections use CSS Grid only. No flex percentage math.
- Each section uses a different layout family:
  - About: 1.35fr / 1fr split with a 2x2 stat block.
  - Experience: single column of glass cards, even cards pushed right.
  - Skills: 4-column bento with mixed cell sizes and fills.
  - Education: 4-step staircase, each card offset lower.
  - Projects: numbered index rows.
  - Recommendations: two offset quote blocks.
  - Contact: full-width WebGL stage holding one 3D ticket (see Signature Components, item 5).

### Slanted section edges
Sections have `margin-top: calc(var(--s) * -1)` so they overlap the previous band, and one of two `clip-path` polygons:
- `.sec--rise`: top edge climbs left to right.
- `.sec--fall`: top edge falls left to right.

They alternate down the page. The hero is the exception: it has a flat top and its bottom edge is cut by the next section.

A coral band, rotated -3.43 degrees, sits on the seam between hero and About and carries the technology marquee. It is the only marquee on the page.

### Responsive Strategy

#### Breakpoints
| Name | Width | Changes |
|---|---|---|
| Wide | above 1000px | Full bento, staircase, index rows |
| Tablet | 768 to 1000px | Bento 2 columns, steps 2 columns, project rows collapse to two columns |
| Mobile | below 768px | All grids single column, offsets removed, hero progress bar hidden |
| Nav | 900px | Pill nav turns into a hamburger dropdown |

#### Touch Targets
Nav toggle, social icons and buttons are at least 44px.

#### Video Behaviour
`object-fit: cover` on a sticky full-viewport stage. Heights use `dvh` to avoid mobile address-bar jumps. No poster images: the video is blob-loaded and the first painted frame is the poster.

## Elevation & Depth

Depth comes from overlap and colour, not shadows.
- Slanted bands overlap each other.
- Glass: dark teal at 74 percent with a 10px backdrop blur, a 1px white 14 percent border and an inset top highlight. Used on the nav and Experience cards. A `prefers-reduced-transparency` rule swaps both for solid teal deep.
- The marquee band is the one element with a drop shadow, tinted to teal deep.
- No neon glows, no pure black.

## Shapes

### Border Radius Scale
One rule, no exceptions:

| Token | Value | Used for |
|---|---|---|
| pill | 9999px | buttons, tags, badges, nav, nav links, social icons, avatars, hover pills |
| card | 20px | glass cards, bento cells, staircase steps, quotes, mobile menu |
| square | 0 | slanted section bands, project rows, timeline sub-items (right side only) |

## Components

### Buttons
- **Primary**: coral fill, teal-deep text, pill, `0.85rem 1.5rem`. Hover (fine pointers only) turns sun. Press scales to 0.97 in 160ms.
- **Ghost**: 2px currentColor border, transparent. Hover fills paper with ink text.
- One label per intent: "Contact" for contact, "LinkedIn" for LinkedIn. Labels stay on one line.

### Cards & Containers
- **Glass card** (Experience): described under Elevation. Holds company, badge, role, meta line, description, bullets, optional sub-roles, tags.
- **Bento cell** (Skills): solid fills, no shadow. Six cells with different fills: teal, jade, sun, aqua, coral, and paper with a teal border. The Languages cell spans two rows, the Cloud cell two columns.
- **Step** (Education): solid fill (teal, jade, coral, sun), staircase offsets of 2.5rem, 5rem, 7.5rem on wide screens.
- **Quote** (Recommendations): sun and teal blocks, second one offset down 4rem. Quote bodies are cut to three lines.

### Inputs & Forms
None. Contact is a tearable ticket that opens a `mailto:` (see Signature Components, item 5). The links that used to be buttons are printed on the ticket and mirrored in a visually-hidden `.sr-only` block so they stay real links for assistive tech and crawlers.

### Navigation
- Floating pill, 56px high, centred, 0.9rem from the top, translucent dark teal with blur.
- Active section is marked with a coral pill via `aria-current`, set by an IntersectionObserver.
- Below 900px the links collapse into a dropdown with an `aria-expanded` toggle. It opens with a 180ms opacity and scale transition from the top right.
- A 4px coral progress bar at the top follows page scroll (CSS scroll timeline where supported).

### Signature Components
1. **Scroll-scrubbed video stage.** A `.scrub` section contains a sticky 100dvh stage with the video, a veil gradient and the content. `main.js` maps the section's scroll progress to `video.currentTime`.
   - Hero: `Keyboard.mp4`, section height 260dvh, `data-span="2"` (video plays over 2 viewport heights of scroll), `data-fade="0.6"` (stage fades out from 60 percent of the section to its end while playback continues).
   - Experience: `Office.mp4`, section height set by its content, video plays across the whole section.
2. **Slanted bands** with alternating `rise` and `fall` clip paths.
3. **Marquee seam band** in coral, rotated to match the slant.
4. **Project index rows**: number counter, title, description, pill link. Hover turns the row jade and nudges its padding.
5. **Holographic tear ticket** (Contact, `src/`). Adapted from `Sam1983Aing/ticket-tear` (Three.js). Check that repo's licence terms before publishing.
   - **Ticket:** a 25 x 36 Verlet-spring paper mesh (`verletPaperEngine.ts`) with a holographic foil shader (`holographicShader.ts`: thin-film rainbow, Voronoi glitter, emboss, punched perforation) and synthesized rip sounds (`soundEngine.ts`). Textures are drawn on canvas in `ticketTextureGenerator.ts`, so there are no image or audio files.
   - **Front face:** carries the content of the Contact section (title "Travaillons ensemble", lead paragraph, four links) and, on the tearable stub below the perforation, the label "Détacher pour un email".
   - **Back face:** blank card stock with the same stub label.
   - **Event:** when the stub is fully torn, on either face, the page opens `mailto:francois.poidevin@yahoo.fr` (subject "Travaillons ensemble") after 900ms so the stub can fall. "Nouveau billet" (coral primary button) then resets the ticket.
   - **Input:** drag across the dotted line or pull the stub down to tear, drag the body to bend, double-click to flip. `touch-action: pan-y` keeps vertical swipes scrolling the page.
   - **Hint line:** one italic 12px mono line, left-aligned, 60 percent white, under the stage. It is the only instruction text.
   - **Colour:** ticket stock is warm paper with teal-deep ink (`#04343a`). The foil spectrum is the only place outside the palette, and it is shader output, not a UI colour.
   - **Perf:** the render loop runs only while the stage intersects the viewport.

### Examples (illustrative)
```html
<section class="sec sec--rise skills" id="skills">…</section>
<header class="scrub hero" id="hero" data-scrub data-span="2" data-fade="0.6">
  <div class="scrub__stage"><video muted playsinline preload="auto">…</video></div>
  <div class="hero__body">…</div>
</header>
```

## Motion

Motion is limited to what carries meaning.

| Element | What it does | Why |
|---|---|---|
| Video stage | `currentTime` follows scroll | Scroll as a timeline, the page's main idea |
| Hero fade | Stage opacity goes 1 to 0 over the last 40 percent | Hands over to About without a hard cut |
| Reveal | Opacity and 24px rise, 600ms, 70ms stagger, once | Orders content as it arrives |
| Progress bar | Scales with page scroll | Position feedback |
| Buttons | Scale 0.97 on press, colour change on hover | Feedback |
| Marquee | 38s linear loop | Single decorative loop, on the seam only |
| Ticket | Verlet paper physics, foil shimmer that follows tilt | The Contact call to action: tearing is the click |

Technical rules:
- Curve `cubic-bezier(0.23, 1, 0.32, 1)` for UI. `ease` for colour. `linear` for the marquee.
- Only `transform` and `opacity` are animated. The hero stage uses opacity.
- No `window` scroll listeners. IntersectionObserver gates a `requestAnimationFrame` loop that only runs while a scrub section is on screen.
- Scrub loop eases toward the scroll target (factor 0.18) and never queues a seek while `video.seeking` is true.
- Each clip is fetched as a Blob and played from an object URL, so seeking works on servers without HTTP range support. Serve the site over HTTP, not `file://`.
- Hover effects are gated by `(hover: hover) and (pointer: fine)`.
- `prefers-reduced-motion`: marquee, reveals and smooth scroll are turned off. The video scrub stays, because the user's own scroll drives it. The ticket is pointer-driven and only animates in response to the user.

## Do's and Don'ts

### Do
- Keep coral as the only action colour and sun as highlight only.
- Keep the pill and 20px card rule on every new component.
- Alternate `rise` and `fall` edges between neighbouring sections.
- Give each new section a different layout family from the ones above.
- Keep veils over video light enough that the footage reads, and add a text shadow or glass card where text sits on it.
- Re-encode any new scrubbed video with a short GOP (`-g 1` was used) and no audio.
- Keep body copy at 65ch or less.
- Keep the email reachable without the ticket: the `.sr-only` links exist for that.

### Don't
- Don't add a second accent colour or a purple gradient.
- Don't put an eyebrow above every section.
- Don't add a second marquee.
- Don't use `transition: all`, `ease-in`, or `scale(0)` entrances.
- Don't use poster images for the scrubbed videos.
- Don't replace the scroll scrub with autoplay.
- Don't add a second WebGL scene, and don't run the ticket loop while it is off screen.
- Don't add image or audio files for the ticket: textures and sounds are generated in code.
- Don't stack more than two image-and-text splits in a row.
- Don't use pure black anywhere. Dark text is ink (`#04343a`).

## Build & Deploy

- **Stack:** Vite 6, TypeScript, Three.js 0.170. `index.html` is the Vite entry; it loads `main.js` (scroll scrub, reveal, nav) and `src/main.ts` (ticket) as modules.
- **Commands:** `npm ci`, `npm run dev`, `npm run build` (type-checks with `tsc`, outputs `dist/`), `npm run preview`.
- **Static files:** everything in `public/` is copied unchanged to the site root: `googleab3733e823f6cf14.html` (Google Search Console ownership, never delete or rename) and `sitemap.xml`.
- **Deploy:** `.github/workflows/deploy.yml` builds on every push to `main` and publishes `dist/` with the official Pages actions. Requires Settings, Pages, Source = "GitHub Actions". Vite `base` is `./`, so it works under `/career/`.
- **Sitemap:** one URL. Sections are anchors, not pages. Update `lastmod` in `public/sitemap.xml` when content changes.
- **Runtime needs:** HTTPS or localhost (WebGL, blob video loading), network access for Google Fonts and the Phosphor icon CDN.
