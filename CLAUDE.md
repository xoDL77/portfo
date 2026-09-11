# Portfolio site — project context

Personal cybersecurity portfolio for Cesar Vaca. Static site, no build step,
no framework. Live at https://xodl77.github.io/portfo/

## Hard constraints

These are deliberate decisions, not gaps to fill in. Do not "improve" past them
without asking:

- **Raw HTML/CSS/JS only.** No React, no Tailwind, no bundler, no npm
  dependencies, no package.json. The owner wants full control and is learning
  the fundamentals. Suggesting a framework defeats the purpose of the project.
- **Zero cost.** GitHub Pages free tier. Nothing that requires a paid service.
- **No third-party requests.** No CDNs, no Google Fonts, no analytics, no
  tracking pixels, no embedded widgets. Every asset is first-party so visitor
  IPs never leak to another host. System font stack only.
- **No visitor data collection.** `localStorage` for the theme preference is
  fine (never transmitted, stays in the visitor's browser). Anything that sends
  data anywhere is not.
- **Owner writes the content.** Help with structure, wording, and code. Do not
  invent project details, metrics, or accomplishments.

## Operational security

The owner holds a TS/SCI clearance and works in offensive security. Public site
content must stay sanitized:

- Home-lab and coursework framing only. No employer specifics, client names,
  real hostnames, internal IPs, or engagement details.
- Screenshots and video must be scrubbed before publishing.
- Contact uses an alias address (`cvportfolio.gray652@passmail.net`), not the
  personal one on the PDF résumé. Phone number is deliberately absent.
- If asked to add technical depth to a writeup, favor methodology and reasoning
  over reproducible operational detail.

## Conventions

- **Mobile-first CSS.** Base styles target narrow screens; `@media (min-width: …)`
  adds complexity upward. Single breakpoint at 768px so far. Do not add
  desktop-first `max-width` queries — it fights the existing cascade.
- **Theming via CSS custom properties** on `[data-theme]` at `:root`. Both dark
  and light palettes must be updated together when adding a color. Every new
  color goes in the token block, never hardcoded in a rule.
- **The inline theme script in `<head>` is load-bearing.** It runs before first
  paint to prevent a flash of the wrong theme. It must stay inline and stay
  blocking. Do not move it to `main.js` or add `defer`.
- **`localStorage` access is always wrapped in try/catch.** It throws under some
  hardened privacy configurations and would otherwise break the page.
- Semantic elements over `div`s. Each `<section>` has an `id` the nav links to.
- `js/main.js` holds independent IIFEs, each guarding for its own elements being
  absent. Vanilla JS, no build step, so no ES module syntax.
- Accessibility is part of done: visible `:focus-visible` rings, working skip
  link, `prefers-reduced-motion` respected, `aria-label` on icon-only controls.

## Media

**Demos are silent looping `<video>`, never GIF.** This was an explicit decision:
GIF costs ~20x the bytes and caps at 256 colors, which bands terminal text and
syntax highlighting badly. Videos play on hover, pause and reset on exit.

- `muted` is required or browsers block programmatic playback.
- `playsinline` stops iOS from forcing fullscreen.
- `width`/`height` attributes prevent layout shift during load.
- `(hover: hover)` media query gates the behavior; touch devices get
  tap-to-toggle instead, or demos would be dead on mobile.
- `prefers-reduced-motion` disables autoplay entirely.

Encode with ffmpeg to both `.webm` (VP9) and `.mp4` (H.264), `-an` to strip
audio, `-movflags +faststart` on the mp4, plus a poster JPEG.

## State

Done: repo, SSH auth, Pages deploy, responsive layout, theme toggle, skip link,
focus styles, reduced-motion, Open Graph tags, favicon links, résumé download
button, print stylesheet, custom 404, hover-play video component,
copy-email-to-clipboard button, scroll-spy nav, back-to-top button.

Lazy loading (the remaining Tier 2 item) is deferred — `index.html` has no
`<img>` tags yet to apply `loading="lazy"` to. Add it to any below-fold image
introduced during step 3 (Content build-out).

Assets not yet created — referenced in markup but 404ing until added:
`assets/Cesar-Vaca-Resume.pdf`, `assets/img/favicon.svg`,
`assets/img/og-image.png` (must be 1200×630).

Placeholder still in `index.html`: `YOUR-HANDLE` in the LinkedIn URL.

Content is empty by design — the owner writes it.

## Roadmap

Work these in order. Each step assumes the previous one is done.

### 1. Missing assets (blocking — links currently 404)

- `assets/Cesar-Vaca-Resume.pdf` — public version, alias email, no phone number.
- `assets/img/favicon.svg` — simple monogram, inline SVG is fine.
- `assets/img/og-image.png` — exactly 1200×630. Name, title, clearance on the
  dark background. This is the LinkedIn preview card, so it matters more than
  it looks.
- Replace `YOUR-HANDLE` in the LinkedIn URL in `index.html`.

### 2. Tier 2 quality-of-life

- ~~Copy-email-to-clipboard button~~ — done. `#copy-email` in `index.html`,
  handler in `js/main.js`.
- ~~Scroll-spy nav~~ — done. `IntersectionObserver` over `main section[id]`
  plus a `#scroll-sentinel` at the end of `<main>` so the last nav link
  (Contact) still activates on short pages where the section's midpoint never
  crosses the detection band before scrolling runs out. Keep the sentinel if
  content grows — cheap, and it costs nothing once pages are taller.
- ~~Back-to-top button~~ — done. `#back-to-top` in `index.html`, rAF-throttled
  scroll listener in `js/main.js` (a plain scroll listener, throttled — a
  pixel threshold like "after 400px" doesn't map cleanly onto an
  `IntersectionObserver` sentinel the way section boundaries do).
- **Lazy loading.** `loading="lazy"` on any image below the fold. Videos already
  use `preload="metadata"`. Do not lazy-load the OG image or anything in the hero.
  Deferred — no `<img>` tags exist yet; pick this up in step 3.

### 3. Content build-out

Order matters — Projects first, because it's the hard one and everything else
is quick by comparison.

- **Projects & Labs.** The differentiator. One `<article class="project">` per
  item, each structured as context → method → outcome, not a resume bullet.
  Candidates from the résumé: the agentic AI vulnerability-assessment tool
  (strongest, it's a build not just an exercise), the Active Directory attack
  chain, WPA2/PMKID capture and offline cracking, RFID/NFC badge cloning, and
  the Burp Suite web/API testing work. Personal projects can carry more detail
  than anything work-adjacent.
- **Skills & Tooling.** Grouped lists — Recon, Exploitation, Wireless/RF,
  Scripting & DevOps. Resist making this an unfiltered tool dump.
- **About.** Two or three sentences. Air Force → Space Force → private sector
  is a genuinely distinctive arc; lead with it.
- **Certifications & Education.** Pentest+, Security+, SSCP, Network+, Linux
  Essentials, Cloud+, AWS CCP, plus the UMGC BS in Cybersecurity Technology.

### 4. Demo videos

Record, sanitize, encode per the Media section above. Add one to the strongest
project first and confirm hover-play works on desktop and tap-to-toggle on a
real phone before batching the rest.

### 5. Custom domain

Buy the domain, add a `CNAME` file to the repo root, point DNS at GitHub Pages,
set the custom domain in repo Settings → Pages, wait for the certificate, then
confirm "Enforce HTTPS" is still checked. **This changes the site root from
`/portfo/` to `/`** — audit `404.html` and the absolute Open Graph URLs at that
point.

### 6. Pre-launch check

Before putting the link on the résumé: run Lighthouse, tab through the whole
page with the keyboard, test on a real phone, verify the OG card with a preview
debugger, confirm the print layout, and do a final pass for anything that
shouldn't be public.

## Gotchas

- `404.html` must use **absolute** paths (`/portfo/css/styles.css`) because
  GitHub Pages serves it from arbitrary URL depths. Relative paths break there.
  Everything else uses relative paths.
- This is a **project page**, not a user page, so the site lives under the
  `/portfo/` subpath. Any absolute URL must include it. A future custom domain
  will change this — check before hardcoding.
- `404.html` cannot be tested with Live Server; only the deployed Pages URL
  serves it.
- The owner is new to VS Code and Git. Explain terminal commands rather than
  just issuing them, and prefer reversible operations (`mv` to Trash over
  `rm -rf`) when cleaning up.