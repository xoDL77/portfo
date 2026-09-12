# Portfolio site — project context

Personal cybersecurity portfolio for Cesar Vaca. Static site, no build step,
no framework. Live at https://cesarspace.online/ (custom domain; DNS is set
and the site resolves there, HTTPS enforcement in GitHub Pages settings is
still pending certificate issuance as of 2026-09-12). The old
`https://xodl77.github.io/portfo/` address still works as GitHub Pages'
default URL for the repo.

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
- **Certifications are a card grid**, viewable inline — not a PDF behind a
  button. Each `<article class="cert-card">` in `#certs` holds a landscape
  (4:3, enforced via CSS `aspect-ratio`) image at
  `assets/certs/<kebab-case-name>.jpg`, a title, and a "Verify with Credly"
  link (omitted for credentials with no Credly badge, e.g. the degree). To add
  a new one: drop the JPEG in that folder and add a matching card — no JSON
  manifest or build step, consistent with how Projects are hand-authored.
  `.projects-grid` and `.certs-grid` share the same 1-col mobile /
  2-col-at-768px responsive pattern.
- **Favicon/touch-icon are raster, not the originally-planned SVG monogram.**
  Source is a hand-drawn transparent PNG from the owner (originally a
  squinting face + a separate heart, spread across a tall canvas). Final mark
  is the **face only** — an earlier version stacked face+heart into one
  square, but at favicon size the two elements read as squished/muddy, so the
  heart was dropped and the face alone fills the frame instead, legible even
  at 16×16. White line art gets a dilated-alpha dark outline (not a solid
  fill) so it stays visible on both light and dark browser chrome, since
  white-on-transparent alone is invisible on light tab bars.
  `assets/img/favicon.ico` is multi-size (16/32/48) ICO, transparency kept;
  `assets/img/apple-touch-icon.png` is the same art flattened onto solid
  `#0d1117` (the dark theme's `--bg`) at 180×180, since iOS renders alpha as
  black. No `favicon.svg` link exists — don't re-add one without a real
  vector file to back it. **Browsers cache favicons aggressively** outside
  the normal HTTP cache — a hard-refresh won't show a changed one, closing
  and reopening the tab (or a private window) will.
- **There is no Contact section.** Contact lives in the sticky header instead
  (`.nav-controls`, inside `.nav`): a `mailto:` icon link, the copy-email
  button, and a LinkedIn icon link, so it's visible on every scroll position
  without the visitor hunting for it. All three share the `.icon-btn` base
  class (2rem square, border, radius) with theme-toggle now also using it for
  consistent sizing. The LinkedIn icon is a hand-drawn-free `<svg>` — a
  rounded-square outline plus an `<text>` "in" glyph, not a copied brand
  asset. `#copy-email-status` (the `aria-live` region for the copy
  confirmation) lives directly under `</header>`, outside the header itself,
  so it isn't affected by the print stylesheet hiding most of the header (see
  Gotchas).
- **Projects and Certifications each show only their first 4 cards**; the
  rest carry a plain `hidden` attribute in the markup. A `setupExpandable()`
  helper in `js/main.js` (one call per grid) wires a "Show N more …" /
  "Show fewer …" toggle button (`#projects-toggle`, `#certs-toggle`) that
  flips the `hidden` attribute on the extra cards — no navigation, same
  page. The count and singular/plural wording are computed from how many
  cards actually carry `hidden`, so adding an 8th project or a 9th cert
  later doesn't require touching the button's text or count by hand — just
  add `hidden` to the new card if it should start collapsed.

## Media

**Demos are silent looping `<video>`, never GIF.** This was an explicit decision:
GIF costs ~20x the bytes and caps at 256 colors, which bands terminal text and
syntax highlighting badly. Videos play on hover, pause and reset on exit.

- **Square aspect ratio (1:1)**, matching the project card layout — set
  `width="800" height="800"` (or your real clip's square dimensions) on the
  `<video>` so there's no layout shift.
- `muted` is required or browsers block programmatic playback.
- `playsinline` stops iOS from forcing fullscreen.
- `(hover: hover)` media query gates the behavior; touch devices get
  tap-to-toggle instead, or demos would be dead on mobile.
- `prefers-reduced-motion` disables autoplay entirely.

Encode with ffmpeg to both `.webm` (VP9) and `.mp4` (H.264), `-an` to strip
audio, `-movflags +faststart` on the mp4, plus a poster JPEG. ffmpeg is
installed via Homebrew on this machine now (it wasn't before).

## State

Done: repo, SSH auth, Pages deploy, custom domain (cesarspace.online),
responsive layout, theme toggle, skip link, focus styles, reduced-motion,
Open Graph tags, résumé download button, print stylesheet, custom 404,
hover-play video component, copy-email-to-clipboard button, scroll-spy nav,
back-to-top button, favicon (`.ico`, multi-size), apple-touch-icon, and OG
image. **No assets are 404ing anymore** — this was the last of them.

**Content is filled in now** — About, Skills & Tooling, Projects & Labs (7
cards), and Certifications (7 of 9) are all written. See the Content
build-out roadmap step for what each turned out to be and what's still
open.

**"TS/SCI Security Clearance" no longer appears anywhere on the page** —
removed from the hero (was a `<p class="clearance">` under the tagline,
now-unused CSS rule deleted too) and from `og:description`, per the owner's
call to drop it, not just visually hide it. The `<title>` and
`meta name="description"` never mentioned it and are unchanged. This is
purely a content/marketing decision, unrelated to the Operational security
section above (which is about sanitizing project *detail*, not about
whether the clearance is mentioned at all).

The OG image is a light-background "Cesar Vaca / PORTFOLIO" wordmark the
owner supplied, not the dark-background name+title+clearance design
originally sketched in the roadmap below — that plan is superseded, this is
the real design now. It was resized/padded (not cropped) from 1000×612 to
exactly 1200×630 with matching white padding on the sides.

**Cert images are real now**, not placeholders — the owner sent the actual
PDF certificates (sourced from
`~/Library/CloudStorage/ProtonDrive-cesar@cvmail.me-folder/career/certs/`,
also mirrored under iCloud `~/Library/Mobile Documents/.../work/certs/`), and
each was rasterized with PyMuPDF at 1400px-long-edge, ~85 quality JPEG
(78–162KB each — cheap enough to not bother lazy-generating srcset variants).
All 7 source PDFs are US Letter landscape (792×612pt, or equivalent), so the
JPEGs are ~1.294:1 — very close to but not exactly the `.cert-image`
CSS's 4:3 box; `object-fit: cover` absorbs the difference invisibly.

The **UMGC degree card is removed for now** — the owner doesn't have that
credential's file ready yet. Re-add it the same way: a `cert-card` with an
image, `<h3>`, and no `.cert-verify` (degrees don't have Credly badges).

The "Verify with Credly" links are **real** — extracted from the hyperlink
annotations in `assets/Cesar-Vaca-Resume.pdf` (the visible cert names in that
PDF are underlined/linked text; `strings` on the PDF surfaces the actual
`credly.com/badges/...` URIs), matched to the 7 certs sent.

**Still only 7 of the 9 certifications the owner mentioned are represented**
(the degree makes 8, but it's pulled for now — see above). While locating
the sent PDFs, a `career/certs/CompTIA/CSIS/` folder turned up on the
owner's drive ("CompTIA Secure Infrastructure Specialist — CSIS") that was
never mentioned in conversation — flagged, not assumed; **do not add it
without the owner confirming** it's real, current, and meant to be public.
That leaves at least one certification still fully unaccounted for either
way.

`assets/img/demo-poster.jpg` and `assets/video/demo.{webm,mp4}` are **still
placeholders** — a static gray "Demo placeholder" frame held for 4 seconds,
square (800×800), no audio. Swap for a real screen-capture per the Media
section and step 4 below.

Content the owner still needs to supply: the missing 2 certifications, the
UMGC degree cert image, and real screen-capture demo videos for the 7
project cards (step 4 below).

## Roadmap

Work these in order. Each step assumes the previous one is done.

### 1. ~~Missing assets~~ — done

Favicon, apple-touch-icon, and OG image are all in place (see State above for
what they actually turned out to be vs. the original plan).

### 2. Tier 2 quality-of-life

- ~~Copy-email-to-clipboard button~~ — done. `#copy-email` in `index.html`,
  handler in `js/main.js`.
- ~~Scroll-spy nav~~ — done. `IntersectionObserver` over `main section[id]`
  plus a `#scroll-sentinel` at the end of `<main>` so the last nav link
  (Certifications, now that Contact is a header element, not a section —
  see State below) still activates on short pages where the section's
  midpoint never crosses the detection band before scrolling runs out. Keep
  the sentinel if content grows — cheap, and it costs nothing once pages
  are taller.
- ~~Back-to-top button~~ — done. `#back-to-top` in `index.html`, rAF-throttled
  scroll listener in `js/main.js` (a plain scroll listener, throttled — a
  pixel threshold like "after 400px" doesn't map cleanly onto an
  `IntersectionObserver` sentinel the way section boundaries do).
- ~~Lazy loading~~ — done. `loading="lazy"` on every `.cert-image`. Videos
  already use `preload="metadata"`. Keep doing this for any new below-fold
  `<img>`; do not lazy-load the OG image or anything in the hero.

### 3. Content build-out

Order matters — Projects first, because it's the hard one and everything else
is quick by comparison.

- ~~Projects & Labs~~ — done, 7 cards: Agentic AI Vulnerability Assessment
  Tool, Active Directory Attack Chain, WPA2/PMKID Capture & Offline Cracking,
  RFID/NFC Badge Cloning, Burp Suite Web/API Testing, Secure Self-Hosted
  Minecraft Server, and the Uniform Random Apple Shortcuts Password
  Generator (the last two are from the owner's CV, not the résumé — the
  Minecraft one deliberately omits the real subdomain and the real AMP login
  screenshot from the CV, describing the architecture without naming the
  live hostname, per the owner's choice). The pentesting-technique projects
  (AD chain, WPA2/PMKID, RFID/NFC, Burp Suite) are framed as home-lab work
  with no employer/university attribution, per Operational security above,
  even though the résumé listed them under mixed home-lab/employer/school
  credit. Every card reuses the same generic placeholder hover-video —
  replace per-card as real clips get recorded (step 4).
- ~~Skills & Tooling~~ — done. Four groups (Recon & Enumeration,
  Exploitation, Wireless & RF, Scripting & DevOps), curated from the tools
  named in the résumé/CV rather than every tool either document mentions —
  e.g. generic IT/soft skills (customer support, public speaking) and
  résumé-only employer-context items were left out as poor fits for a
  pentesting-focused portfolio.
- ~~About~~ — done, leads with the Air Force → Space Force → private-sector
  arc per the plan above. Phrasing/tone came from the owner's own draft plus
  their cover letter and CV, not invented.
- ~~Certifications~~ — done for the 7 certs with real images and Credly
  links (see State above). Still open: add back the UMGC degree card once
  that file's ready, and resolve the missing 2 certifications (9 mentioned,
  7 shown — see the CSIS-folder note in State, unconfirmed).

### 4. Demo videos

Record, sanitize, encode per the Media section above. Add one to the strongest
project first and confirm hover-play works on desktop and tap-to-toggle on a
real phone before batching the rest.

### 5. ~~Custom domain~~ — mostly done

`CNAME` (`cesarspace.online`) is in the repo root, DNS A records point at
GitHub Pages, and the site resolves there now. `404.html`'s absolute paths
and `index.html`'s canonical/OG URLs are updated to the new root (`/` instead
of `/portfo/`). Still outstanding: DNS is not fully propagated everywhere
yet, and "Enforce HTTPS" in repo Settings → Pages is waiting on GitHub's
certificate issuance — check that box is checked once the cert is ready
(it can silently stay unchecked after issuance and needs a manual click).

### 6. Pre-launch check

Before putting the link on the résumé: run Lighthouse, tab through the whole
page with the keyboard, test on a real phone, verify the OG card with a preview
debugger, confirm the print layout, and do a final pass for anything that
shouldn't be public.

## Gotchas

- `404.html` must use **absolute** paths (`/css/styles.css`, not relative)
  because GitHub Pages serves it from arbitrary URL depths. Everything else
  uses relative paths.
- The site root is now `/` (custom domain `cesarspace.online`), **not**
  `/portfo/`. That subpath only applies to the legacy
  `xodl77.github.io/portfo/` GitHub Pages default URL — don't reintroduce it
  into absolute paths or URLs.
- `404.html` cannot be tested with Live Server; only the deployed Pages URL
  serves it.
- The owner is new to VS Code and Git. Explain terminal commands rather than
  just issuing them, and prefer reversible operations (`mv` to Trash over
  `rm -rf`) when cleaning up.
- **Print stylesheet hides most of `.site-header`** (nav links, theme
  toggle) but deliberately leaves it in the DOM/visible as a container now
  that contact info lives there — don't go back to hiding `.site-header`
  wholesale, that was tried and it silently deletes the only copy of the
  contact info from the printed page. The print block also force-shows
  every `.project[hidden]`/`.cert-card[hidden]` card, since "click Show
  more" isn't a thing on paper.