# Bay Eight Studios — Careers page

Static **Careers** page for Bay Eight Studios (Miami recording studio), built
from the Canva mock ("bayeight.com mock-up — 2026 New Website", page 9) with
<https://bayeight.com/> as the reference for brand, colour and typography.

> This replaced an earlier landing-page design. Everything from that version —
> the artists strip, studios carousel, services, reviews, booking steps, session
> builder and the slide-in menu — has been removed.

## Stack

Plain **HTML + CSS + JavaScript** with **Bootstrap 5.3**. No build step, no
framework, no bundler — open the file and it runs.

- Bootstrap 5.3.3 **CSS only** (jsDelivr CDN). The JS bundle is deliberately
  not loaded; nothing on the page needs it.
- **Icons are an inline SVG sprite** at the top of `<body>`, not an icon font.
  Twelve glyphs lifted from bootstrap-icons 1.11.3 — the font cost 127kb of
  woff2 plus 13kb of CSS defining two thousand classes for those twelve. Use
  `<svg class="icon"><use href="#i-NAME" /></svg>`; `.icon` is 1em square and
  painted with `currentColor`, so anything that sizes it through `font-size`
  behaves exactly as the old `<i class="bi bi-NAME">` did. To add a glyph, copy
  the path out of the bootstrap-icons package into a new `<symbol>`.
- Google Fonts: **Inter** only (body, 400–700). Anton and Big Shoulders used to
  ride along as stand-ins for Integral CF; with all four of its cuts bundled
  neither ever rendered, so they are no longer requested.
- **Integral CF** for headings, in all four cuts (Regular 400, Bold 700,
  ExtraBold 800, Heavy 900), served from `assets/fonts/integral-cf/`. These are
  the files the bay-eight landing ships; having real weights is what lets the
  footer set its link lists at 400 and its wordmarks at 900 without the browser
  synthesising anything.
- Vanilla JS in `js/main.js`, ~250 lines.

## Structure

```
bayeight/
├── index.html        the whole page — one <section> per design section
├── css/style.css     design tokens in :root, then section-by-section styles
├── js/main.js        every interaction on the page (see below)
└── assets/
    ├── img/          careers-hero.jpg, miami-script.webp, culture/
    ├── fonts/        integral-cf/ — the four cuts, 400 / 700 / 800 / 900
    └── icons/        favicon, in bayeight.com's three sizes
```

Sections in order: `#hero` · `#who-we-are` · `#about` (The DNA of Bay Eight) ·
`#internships` · `#success-stories` · `#contact` (Apply Now) · `#faq`.

What `main.js` drives, in order:

1. Header background once the page is scrolled (`.is-scrolled` past 8px, the
   landing's threshold)
2. Scroll reveal (`.reveal` / `.reveal-group`)
3. Contact form validation and inline success state
4. Back-to-top button
5. FAQ — one-at-a-time accordion (height animated open/closed) and the zigzag
   scroll entrance
6. 3D cursor tilt on `.faq-item` and `.story` — the landing's `.engineer-card`
   treatment: ±9deg following the pointer, settling back on a slower curve
7. Footer year

## Running it

```bash
cd /home/coder/bayeight
python3 -m http.server 8080
# → http://localhost:8080
```

## Conventions

- **Design tokens first.** Colours, fonts and sizes are CSS custom properties in
  `:root` (`css/style.css`), lifted verbatim from bayeight.com's own Divi
  variables. `--accent` `#ff1097` is their `--primary-color`; `--bg` `#0d0806`
  is `--primary-black`; `--lime` `#bbe84a` is `--secondary-green`. Use
  `var(--accent)`, not a hard-coded hex.
- **Typography matches the bay-eight landing**: body is Inter 400 at
  `--text-base` 16px / 1.6, and paragraphs that sit directly in a section run
  one step up at `--body-size` (`clamp(0.95rem, 1.2vw, 1.1rem)` → 17.6px/26.4px
  at desktop), measured off the landing's own section descriptions. Card-level
  copy stays small — the landing's card text is 13–14px, so `.story-quote`,
  `.dna-card-text` and friends are already in range and should not be bumped.
  One known divergence: the landing declares `"Helvetica Now Display"` ahead of
  its Helvetica/Arial fallbacks on body copy, and never loads that face, so it
  silently renders Arial. This site keeps Inter (the landing's own
  `--font-sans`) rather than copying a stack that resolves to a fallback.
  Section kickers (`.eyebrow`) are 22px → 20px → 18px with 1px letter-spacing,
  and every section `h2` shares `--h2-size` (45px → 36px → 28px). Two of bayeight.com's own weight values are inert on
  their side — read literally they make headings here look thin, so the hero
  subtitle and the accordion title spell out the weight their font really
  renders at.
- **The header and footer are ported from the bay-eight landing** and run on
  its palette rather than the page's: `--l-pink` `#E82276`, `--l-lime`
  `#C8F03B`, `--l-cream` `#f7f4eb`, `--l-panel` `#111111`. Everything between
  them stays on the Divi ramp above. The text in both is the careers mockup's,
  not the landing's.
- **The header never changes size.** It is sized by its own `padding-block`,
  not by a fixed height, so sticking only paints a background, a blur and a
  hairline — exactly what the landing does. It used to shrink 104px → 76px on
  scroll, which clipped the 77px wordmark (its top landed at `-1px`). `--nav-h`
  (117px) is now only a clearance figure for `scroll-padding-top` and the
  hero's top padding, not the bar's height.
- **One `<section>` per design section**, each with a stable `id`.
- **Every section shares one left edge** — content sits in a Bootstrap
  `.container`. The Who We Are collage and the Internships tile row are the two
  blocks that run to a viewport edge, and they measure the gap from the
  *container's* max-width per breakpoint
  (`--edge`), not from a percentage — a percentage in `margin-right` resolves
  against the column, which is only 7/12 as wide, and overshoots badly. Two
  things make that safe: the section is `overflow: clip`, and the bleeding block
  sets **no `width`** (a block box at `width: 100%` is over-constrained, so the
  negative margin would be dropped instead of widening it).
- **Bootstrap utilities for layout**, custom CSS only for what Bootstrap can't
  express. Override Bootstrap through its CSS variables (`--bs-*`).
- **Timing comes from their site too**: `--sr-duration` 700ms, `--sr-stagger`
  28ms, `--sr-ease` and `--sr-translate` are bayeight.com's own scroll-reveal
  values; `--hover-ease` is the easing they hover cards with.
- **One knob per rhythm**: `--section-pad` (116/88/64px) sets every section's
  vertical padding, `--h2-size` (45/36/28px) every section heading *except*
  `.contact-head`, `.faq-title` and `.stories-title` / `.stories-eyebrow`,
  which are sized from their own mocks,
  `--line-section` the rule that marks off the footer and the photo sections.
- **Motion**: add `class="reveal"` to fade a block up on entry, or
  `class="reveal-group"` to a container to stagger its children. The stagger has
  one `nth-child` rule per child up to 14 — extend it if a longer group appears.
  Both skip to the end state under `prefers-reduced-motion`.
- **Below `lg` every section sits exactly 16px in from both screen edges**
  (`.container` goes full-width there). The footer is the one exception — its
  rows run wider, on their own `min(100% - 2×gutter, 1560px)` measure.
- **Cache busting**: the `<link>` and `<script>` tags carry `?v=N`. **Bump it
  whenever you edit CSS or JS** — without it the browser keeps serving the
  cached copy and the change simply will not appear.
- Images go in `assets/img/`, referenced with relative paths.
- **`width` / `height` must be the file's real pixel size**, not the size it is
  drawn at. They set the aspect-ratio box the browser reserves before the image
  arrives; when they disagree with the file the page shifts as each one loads.
  Eleven of them were wrong (`who-1.jpg` declared 480×640 against a real
  139×386, and so on) — check a new file's true size before writing the tag.
- **Form controls must not drop below 16px on touch.** Safari on iOS zooms the
  whole page the moment a field under 16px takes focus and never zooms back
  out. The card is drawn at 14px, so the floor is raised inside
  `@media (pointer: coarse)` rather than globally.
- **Check the 992–1200 band specifically.** It is the one place desktop
  layouts run at their tightest, and two of them broke there: the DNA boxes
  wrapped 1 + 1 + 2 instead of 2 + 2, and the footer's bottom row left the
  Google card stranded alone on a second row. Both now switch to a two-up grid
  below 1200.
- **No horizontal scroll at any width, and nothing under ~11.5px.** Both are
  swept at 320 / 360 / 390 / 414 / 480 / 576 / 640 / 768 / 820 / 992 / 1024 /
  1200 / 1280 / 1366 / 1440 / 1536 / 1680 / 1920, and on emulated iPhone SE /
  12 / 14 Pro Max, Pixel 7, Galaxy S9+, iPad Mini / gen 7 / Pro 11 in both
  orientations. The awkward widths are 320 (where a flat font-size on a
  content-hugging box overflows) and the exact Bootstrap breakpoints (where a
  container is narrowest for the widest gutter).

## Section notes

The favicon in `assets/icons/` is bayeight.com's own, in the three sizes their
`<head>` links.

| Section | Notes |
|---|---|
| Hero | Still image, no video. `min-height: 650px` and the angled bottom divider are both taken from bayeight.com's About hero; the title carries their `text-shadow: .08em .08em 0 rgba(0,0,0,.4)`. |
| Who We Are | Six-tile mosaic on one static CSS grid (five columns; the tall shots hold columns 1, 2 and 5, the wide shot spans 3–4 with the two small ones under it). Runs **flush to the right edge of the window** via a negative right margin measured off the container — see the left-edge convention below. Tiles zoom on hover. Below `lg` it drops to three columns and `--b` (the guitar shot) steps out, because the mobile grid is exactly six cells. |
| The DNA of Bay Eight | Four trait boxes sized to their own copy, so the rows stay ragged as in the mock. Two card colours (`#a8683f`, `#1f636e`) come from the mock, not from the brand ramp. Gaps, box height and side padding are all measured off the mock (row gap ~1.0% of the artboard, column gap ~1.5%, box ~8.4% tall, side padding ~2.9%) — the generous side padding is what gives the boxes the mock's proportions, since their copy alone is much narrower than the drawn rectangles. **Gotcha:** `.dna-break` is a full-width zero-height flex item, so it forms a flex line of its own and the two rows end up `row-gap` apart *twice*. The declared `row-gap` is therefore half `--dna-row-gap`, which is the gap you actually see. A negative margin on the break does not fix it — a flex line's cross size clamps at zero. |
| Internships | Three equal tiles on a static grid, running **flush to the right edge of the window** the same way the Who We Are collage does (same `--edge` measurement, same `overflow: clip` on the section, same no-`width` rule). |
| Success Stories | Three white cards; the only place the palette inverts, so text colours are set explicitly. Eyebrow and title are **sized from the mock, not `--h2-size`** (2.34vw and 3.9vw — see the Apply Now note) and sit on the container's left edge; the card grid and the lime CTA below are centred in a narrower block (~72vw). Cards are `align-items: start`, so each one ends at its own quote rather than being levelled off. Hover is the landing's `.engineer-card` 3D tilt. |
| Floating actions | Two fixed corner buttons: `.chat-bubble` (flat pink circle, bottom-left) and `.to-top` (the landing's outlined oval pill, bottom-right). They sit over the footer's legal strip once the page is scrolled to the end, which is why that strip carries a deep `padding-bottom` — without it the pill lands on the social icons and the bubble on the copyright. |
| Apply Now | Front-end only. The form validates and shows an inline confirmation; nothing is submitted anywhere. The card splits **35/65**, which Bootstrap's twelve columns cannot express, so `.contact-col--info` / `.contact-col--form` override the `col-lg-5` / `col-lg-7` widths above `lg` (the classes stay for the stacking below it). The form panel's side padding is `8%` of its own width — the same figure the landing uses, and most of what makes that panel read as roomy. The **title is the one heading that ignores `--h2-size`** — the mock sets it left-aligned on the container edge at roughly 3.85% of the viewport width per em, with a dot ~1.1× the cap height, so `.contact-head` carries its own scale. |
| FAQ | Ported from the bay-eight landing, on its palette: flat near-black scrim over the room photo, cream cards, pink `+` that rotates 135° into an `×`. `<button aria-expanded>` + a panel `main.js` animates, one open at a time. Cards enter zigzag (odd from the left, even from the right) and tilt in 3D under the cursor — the GSAP choreography the landing runs, written against plain transitions. The intro column is `position: sticky` and rides down with the list, which is why this section is `overflow: clip` and not `hidden`: `hidden` would make it the scroll container and kill the sticking. |

## Still to come from the client

| What | Where it goes |
|---|---|
| 2× exports of the Who We Are collage and internships photos | `assets/img/culture/` — the current files came out of Canva at mock scale (as small as 107px wide) and are **drawn larger than they are**: the collage shots render at ~1.2× their pixel size, the Success Stories portraits at ~1.35×, `contact-form-bg.jpg` at ~1.4×. They will stay soft until real exports land. Keep the same filenames and they drop straight in — but update each `width`/`height` to the new file's real size. |
| BEMP partner logo | footer "Our Partners", currently a text wordmark |
| Real deposit, cancellation, guest and file-ownership policy | FAQ answers 8–11, which currently defer to a phone call rather than invent terms |

## Known gaps

- **Room naming is inconsistent.** The FAQ and footer say *Apollo Room* (matching
  the live site), the contact form's room picker says *Douglas Suite*. One of
  them is wrong.
- Two phone numbers appear in the mock — `305-705-2405` in the contact block and
  `(305) 901-4913` in the footer. Both are reproduced as designed.
- The footer's Services and Studios columns link out to `bayeight.com`, since
  those pages don't exist on this one-page site. If this page is folded into the
  main site, switch them to relative paths.
