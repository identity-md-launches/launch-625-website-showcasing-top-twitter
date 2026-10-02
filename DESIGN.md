# Signal design system

## Overview

Signal is an independent reading room for people exploring identity.md, AI agents and onchain work. The final design uses a deep green canvas, warm off-white type, lime actions, and an original Pepe collaboration video. A spacious hero leads into a denser editorial grid. Curation and attributed excerpts are emphasized over engagement metrics.

Sources of truth: `src/styles.css` for tokens and responsive rules, `src/main.tsx` for components, and `src/posts.json` for content. This is one dark green presentation; there is no theme switch.

## Colors

All values use sRGB hex. Primitive colors are mapped to semantic roles in `:root`.

| Semantic token | Value / primitive | Role |
| --- | --- | --- |
| `--color-page` | `#0b2018` / `--green-950` | Page, header and media backing |
| `--color-surface` | `#112a20` / `--green-900` | Reading cards, search field, topic strip |
| `--color-hover` | `#163326` / `--green-850` | Secondary interactive hover, notification |
| `--color-border` | `#365142` / `--green-700` | Card boundaries, separators, controls |
| `--color-text` | `#f0f1e8` / `--cream-100` | Headings and primary text |
| `--color-muted` | `#b0bfb0` / `--green-300` | Excerpts, author handles, supporting text |
| `--color-accent` | `#c2f970` / `--lime-400` | Primary action, selected filter, saved icon |
| `--color-on-accent` | `#0b2018` | Text on lime fills |
| `--color-focus` | `#f0f1e8` | 2px keyboard outline with 5px offset |
| `--color-accent-hover` | `#d0ff8a` | Filled primary hover |
| `--color-border-hover` | `#718966` | Card hover boundary |

`--green-800: #213e30` supplies the decorative quotation mark. The scene has its own illustrated greens. Small translucent white outlines distinguish images without affecting text. Contrast measurements are retained in `docs/validation/contrast.json`; video-overlay contrast is explicitly limited in the review.

## Typography

`--font-display` uses bundled **Space Grotesk**, then Arial/sans-serif. Its local Latin WOFF2 supports variable weights 300–700; the interface uses 500 for headings and 600 for branding. `--font-body` uses Arial/Helvetica/sans-serif. Only the hero word “frog” uses Georgia/Times New Roman italic. SVG scene labels use the system monospace family. Fonts remain local and `font-display: swap` avoids invisible text.

- Hero: responsive 3.5–5.15rem, line height 1.02, intentionally tight negative tracking. Mobile has explicit 4.15rem and 3.7rem steps.
- Section title: 2.5rem, line height 1.2, tracking −1.6px; steps down to 32px, 31px and 27px at narrower widths.
- Card title: 1.375rem / 1.3; feature 30px, regular mobile 25px, smallest mobile 23px. Titles wrap fully.
- Excerpts: 14px / 1.7; text-only cards 15px / 1.75. No text clamp hides the selected quotation.
- Body role token: 1rem. Short ancillary UI labels are mostly 10–13px; tiny uppercase editorial labels are intentionally subordinate.
- Inputs reach 16px at widths ≤800px to avoid iOS input zoom. Counters use tabular numbers.

Headings use balanced or pretty wrapping; excerpt text uses pretty wrapping and breaks long URLs. Content remains selectable. Heading levels express document structure independently of visual size.

## Layout

`.container` caps content at 1240px with 48px side margins on desktop, 32px at ≤1100px and 18px at ≤560px. Header content caps at 1344px. Named spacing steps are 4, 8, 12, 16, 24, 32, 48 and 64px, with small optical adjustments in component styles.

The default reading grid has three columns with 22px gaps. The first feature and sixth context article span two columns, using internal media/text layouts. When filtered or sorted, cards use the regular grid. At ≤800px there are two columns, the main feature spans both, and the context card becomes regular. At ≤560px all cards stack with images above text.

Breakpoints are 1450, 1100, 800, 560 and 360px. Header byline disappears at 1100px; the external header CTA disappears at 800px. At 560px the collection navigation link gives way to the prominent hero link, search moves below filters, and the video sits below hero copy. Saved reads and about navigation remain accessible. At 360px display type and metadata spacing tighten further. Layout and key text wrapping were inspected at 1440, 768, 390 and 320px; native zoom and all intermediate widths are not claimed as tested.

## Elevation & Depth

The page and cards use tonal separation and 1px structural borders. Card hover changes the border rather than lifting the card. The hero video blends into the page through green gradients. A dismissible saved-post notification is the only elevated surface, with `0 8px 35px #0006` shadow. Hero content sits above decorative media; decorative layers ignore pointer events. There are no dialogs or fixed navigation layers.

## Shapes

Cards use `--radius: 12px`. Their images use a 6px radius. Primary buttons are 7px; most controls 6px; image tags 4px; avatars circular. The about mark uses a gently rotated 20px rounded square, reduced on mobile. Border clipping is limited to card/media decoration, not excerpt text.

## Components

Components live in `src/main.tsx`; these are reusable local patterns, not a published library.

- **`Icon` / `Mark`:** local SVGs, `currentColor`, decorative semantics. Icons use a consistent 1.6px stroke. Active bookmarks fill the existing icon.
- **`HeroVideo`:** silent local MP4, local poster, actual play/pause state, explicit accessible labels, reduced-motion preference listener, and a still-illustration failure state. No essential information relies on motion.
- **`PostCard`:** takes `post`, `saved`, `onSave`, `featured`. Attribution and a separate native bookmark button precede one native content link. The link includes a descriptive name and new-tab disclosure. Excerpts are quotation excerpts; full originals are available on X.
- **Filters:** native buttons in a labeled group, selected text/background plus `aria-pressed`. Article and post counts remain visible. “Saved” appears as a filter when opened from the header.
- **Search / sort:** labeled native search input and select. Search includes title, author, handle, excerpt and source-post text. A clear button resets the query; a live result count announces changes.
- **Saved reads:** IDs are stored under `identity-signal-saved-v1`. Invalid stored data is rejected. Storage failures preserve the current session and explain the limitation in a dismissible status message.
- **Empty state:** explains an empty saved collection or unmatched query, then offers “Explore all reads” to clear filters, search and sorting.

All interaction paths use native links, buttons and fields. Focus uses a visible 2px perimeter, with forced-colors support. Touch bookmarks are 44px; ordinary controls meet at least 24px target dimensions. Hover styles only apply on hover-capable devices. Color/background/border transitions are 150ms, with `cubic-bezier(.2,0,0,1)`. Press scale is .96. Smooth scrolling and these transitions only run when reduced motion is not requested.

## Do’s and don’ts

- Start new content with `.container`, the semantic color tokens and the existing heading scale.
- Preserve original URLs and distinguish source quotations from editorial titles. Do not invent engagement metrics or imply a live feed.
- Keep a single prominent filled action per action group; use the existing neutral borders for secondary controls.
- Keep video supplementary and preserve its poster, pause control and reduced-motion path.
- Do not nest the bookmark button inside the post link or replace native controls with clickable containers.
- A new section should use a semantic section/heading, normal document flow, and the same responsive container. If adding another page, export its HTML explicitly; this host has no route rewrites.
