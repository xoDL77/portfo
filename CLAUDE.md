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
button, print stylesheet, custom 404, hover-play video component.

Assets not yet created — referenced in markup but 404ing until added:
`assets/Cesar-Vaca-Resume.pdf`, `assets/img/favicon.svg`,
`assets/img/og-image.png` (must be 1200×630).

Placeholder still in `index.html`: `YOUR-HANDLE` in the LinkedIn URL.

Next up — "Tier 2" quality-of-life:
copy-email-to-clipboard button, scroll-spy nav highlighting, back-to-top button,
`loading="lazy"` on images. Then the actual content: About, Skills, Projects,
Certifications.

Content is empty by design. Projects is the section that matters most —
each one should read as context, method, outcome rather than a resume bullet.

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