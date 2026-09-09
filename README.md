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

- Bootstrap 5.3.3 **CSS only** + Bootstrap Icons 1.11.3 (jsDelivr CDN). The JS
  bundle is deliberately not loaded; nothing on the page needs it.
- Google Fonts: **Poppins** (body, 400) + **Montserrat** (headings).
- Vanilla JS in `js/main.js`, ~200 lines.

## Structure

```
bayeight/
├── index.html        the whole page — one <section> per design section
├── css/style.css     design tokens in :root, then section-by-section styles
├── js/main.js        every interaction on the page (see below)
└── assets/
    ├── img/          careers-hero.jpg, logo.png, culture/
    └── icons/        favicon, in bayeight.com's three sizes
```

Sections in order: `#hero` · `#who-we-are` · `#about` (The DNA of Bay Eight) ·
`#internships` · `#success-stories` · `#contact` (Apply Now) · `#faq`.

What `main.js` drives, in order:

1. Header background once the page is scrolled
2. Scroll reveal (`.reveal` / `.reveal-group`)
3. Contact form validation and inline success state
4. Back-to-top button
5. The two photo marquees — takes the CSS animation over so the same track can
   also be dragged with a pointer. The CSS loop stays as the fallback.
6. Footer year

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
- **Typography matches the live site**: body is Poppins 400 at `--text-base`
  17px / 1.8; section kickers (`.eyebrow`) are 22px → 20px → 18px with 1px
  letter-spacing; every section `h2` shares `--h2-size` (45px → 36px → 28px).
  Their headings use Integral CF, a licensed font we can't ship — Montserrat 900
  stands in for it.
- **One `<section>` per design section**, each with a stable `id`.
- **Every section shares one left edge** — content sits in a Bootstrap
  `.container`. Blocks that bleed to a viewport edge (the Who We Are collage,
  the internships strip) measure the gap from the *container's* max-width per
  breakpoint, not from a percentage — a percentage in `margin-right` resolves
  against the column, which is only 7/12 as wide, and overshoots badly.
- **Bootstrap utilities for layout**, custom CSS only for what Bootstrap can't
  express. Override Bootstrap through its CSS variables (`--bs-*`).
- **Timing comes from their site too**: `--sr-duration` 700ms, `--sr-stagger`
  28ms, `--sr-ease` and `--sr-translate` are bayeight.com's own scroll-reveal
  values; `--hover-ease` is the easing they hover cards with.
- **One knob per rhythm**: `--section-pad` (116/88/64px) sets every section's
  vertical padding, `--h2-size` (45/36/28px) every section heading,
  `--line-section` the rule that marks off the footer and the photo sections.
- **Motion**: add `class="reveal"` to fade a block up on entry, or
  `class="reveal-group"` to a container to stagger its children. The stagger has
  one `nth-child` rule per child up to 14 — extend it if a longer group appears.
  Both skip to the end state under `prefers-reduced-motion`.
- **Cache busting**: the `<link>` and `<script>` tags carry `?v=N`. **Bump it
  whenever you edit CSS or JS** — without it the browser keeps serving the
  cached copy and the change simply will not appear.
- Images go in `assets/img/`, referenced with relative paths.

## Section notes

The favicon in `assets/icons/` is bayeight.com's own, in the three sizes their
`<head>` links.

| Section | Notes |
|---|---|
| Hero | Still image, no video. `min-height: 650px` and the angled bottom divider are both taken from bayeight.com's About hero; the title carries their `text-shadow: .08em .08em 0 rgba(0,0,0,.4)`. |
| Who We Are | Five-tile mosaic on one CSS grid, looping the same way the internships strip does and running flush to the right edge of the window. The outer two columns share a width so the tall tiles mirror. Tiles zoom on hover. |
| The DNA of Bay Eight | Four trait cards sized to their own copy, so the rows stay ragged as in the mock. Two card colours (`#a8683f`, `#1f636e`) come from the mock, not from the brand ramp. |
| Internships | Three-tile marquee looping left-to-right. **The two groups are identical** — that is what makes the loop seamless, so add or remove a shot in *both*. Pauses on hover, and can be dragged. |
| Success Stories | Three white cards; the only place the palette inverts, so text colours are set explicitly. |
| Apply Now | Front-end only. The form validates and shows an inline confirmation; nothing is submitted anywhere. |
| FAQ | `<details>`/`<summary>` accordion — open/close, keyboard and find-in-page come free. |

## Still to come from the client

| What | Where it goes |
|---|---|
| 2× exports of the Who We Are collage and internships photos | `assets/img/culture/` — the current files came out of Canva at mock scale (as small as 107px wide) and are soft when scaled up. Keep the same filenames and they drop straight in. |
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
