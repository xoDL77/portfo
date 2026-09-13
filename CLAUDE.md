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
- Contact uses a dedicated domain address (`contact@cesarspace.online`), not
  the personal one on the PDF résumé. It's shown as plain text, not a
  `mailto:` link — see the mail-flyout notes below for why. Phone number is
  deliberately absent.
- If asked to add technical depth to a writeup, favor methodology and reasoning
  over reproducible operational detail.

## Conventions

- **Mobile-first CSS.** Base styles target narrow screens; `@media (min-width: …)`
  adds complexity upward. Single breakpoint at 768px so far. Do not add
  desktop-first `max-width` queries — it fights the existing cascade.
- **The typeface is a serif system-font stack**
  (`Georgia, "Iowan Old Style", "Palatino Linotype", Palatino, "Book Antiqua",
  "Times New Roman", serif` on `body`, inherited everywhere — there's no
  other `font-family` declaration in the CSS), swapped from the original
  `system-ui` sans stack for a more elegant, "soft on the eyes" feel the
  owner asked for, specifically namechecking Times New Roman. Georgia leads
  the stack instead — same serif character, but drawn for screen legibility
  at body-text sizes, where Times New Roman (a metal-type-era face) gets
  thin and cramped; it still falls through to Times New Roman itself on
  systems that lack every other entry. **This still respects the "system
  font stack only" hard constraint above** — every name in the list is an
  OS-bundled font, not a downloaded or self-hosted one; don't turn this into
  a `@font-face` + font-file addition (even self-hosted) without confirming
  that constraint is meant to be relaxed.
- **Theming via CSS custom properties** on `[data-theme]` at `:root`. Both dark
  and light palettes must be updated together when adding a color. Every new
  color goes in the token block, never hardcoded in a rule.
  - **The palette is earth/brown-toned, not the original blue-gray GitHub
    look.** Light mode is a warm off-white background (`--bg: #fbf9f7`) with
    a dark olive-brown foreground (`--text: #554d37`) — both owner-specified
    exact hex values, not picked for contrast math after the fact (though
    they do pass, ~5:1+). Dark mode's `--bg: #1c1712` / `--text: #ece4d8` are
    a complementary dark-brown/warm-cream pair chosen to match, not
    owner-specified. `--accent` in both themes is an earthy
    terracotta/ochre (`#9a5b2c` light, `#d79a5c` dark — lighter in dark mode
    since a dark terracotta wouldn't contrast enough against a dark bg) and
    `--border`/`--surface` are warm tans/browns rather than the previous
    cool grays, so borders and card backgrounds don't clash with the new
    text/bg. **`--text-muted` was initially left as the old cool gray-blue**
    (`#59636e` light, `#8b949e` dark) when the rest of the palette went
    earth-toned, per the owner's own call at the time — but that was
    revisited once they saw it rendered: it's now a warm muted
    brown/taupe in both themes (`#7d6f56` light, `#a89880` dark) so the
    subtitle/secondary text (`.tagline`, `.project-meta`, `.cert-verify`,
    etc. — anything using this token) matches the rest of the brown palette
    instead of standing out as leftover gray. Both new values were checked
    against their `--bg` for ~4.5:1+ contrast, same bar as the primary
    palette. **All `.nav-links a` (not just `.is-active`) use
    `color: var(--text)`** — every section link in the header is the same
    color as ordinary body text, all the time; the *only* visual difference
    for the current section while scrolling is `.nav-links a.is-active`
    adding `text-decoration: underline` (no color change). Don't reintroduce
    `var(--accent)` on these links — that was the look before this change
    and the owner explicitly moved away from it.
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
  `#0d1117` at 180×180, since iOS renders alpha as black. That was the dark
  theme's `--bg` at the time it was generated — the palette moved to earth
  tones afterward (see Theming below) and `--bg` is now `#1c1712`, so the
  baked-in flatten color is a close-but-no-longer-exact match. Harmless
  (still a dark brown-black, not a visible seam) but not pixel-accurate;
  regenerate the PNG against the current `--bg` if that ever matters. No
  `favicon.svg` link exists — don't re-add one without a real vector file to
  back it. **Browsers cache favicons aggressively** outside
  the normal HTTP cache — a hard-refresh won't show a changed one, closing
  and reopening the tab (or a private window) will.
- **The header shares the page's background instead of a contrasting
  `--surface` band.** `.site-header` is `background: var(--bg)` (was
  `var(--surface)` with a full-width `border-bottom`), so the header and
  `<main>` read as one continuous surface rather than two stacked blocks —
  a deliberate "modern, single-surface" look the owner asked for. The
  dividing line is a separate `.header-rule` element (a `<div>` right after
  `.nav`, inside `.site-header`) rather than a border on the header itself,
  because it needs to start and end at specific points — flush with the
  left edge of "Cesar Vaca" and the right edge of the theme-toggle button —
  not edge-to-edge across the viewport. It works by mirroring `.nav`'s own
  box model: `.header-rule` gets the same `max-width` + `margin: 0 auto` as
  `.nav` (so it's centered identically), and the actual line is a child
  `<span>` with `margin: 0 1rem` + `border-bottom` — margin, not padding,
  because margin insets the line itself without moving where a border would
  draw, which is what lines it up with `.nav`'s content (`.nav`'s own inset
  from its edges is also 1rem, via its `padding: 1rem`). If `.nav`'s padding
  ever changes, `.header-rule span`'s margin needs to change to match, or
  the line drifts out of alignment with the brand/controls above it.
- **`h1` and `h2` are pulled 1rem left of where `<main>`'s padding would
  otherwise put them, at the 768px breakpoint only** (`margin-left: -1rem`
  in the "Tablet and up" media block) — `<main>` has 2rem of horizontal
  padding there versus `.nav`'s 1rem, so without this the hero name and
  every section title would sit 1rem right of "Cesar Vaca" in the header
  instead of flush with it, which is the look the owner asked for. Only the
  headings shift; body content (tagline, paragraphs, grids) keeps `<main>`'s
  normal padding, so it reads as indented relative to its own heading — that
  indent is the point, not a bug. Below 768px `<main>` and `.nav` already
  share the same 1rem padding, so no offset is needed or applied there. A
  heading's own `border-bottom` (see the Certifications/Skills styling)
  moves with it — intentional, the underline is treated as part of the
  heading, not the body content. **`h2` also gets `margin-right: -1rem`**
  (`h1` doesn't need it, having no border-bottom) — `margin-left: -1rem`
  alone only relocates the box's left edge; CSS's auto-width solving keeps
  the right edge anchored exactly where it was (at `<main>`'s narrower
  content edge), so without the matching negative margin-right the
  underline fell 1rem short of the header's right edge (the theme-toggle's
  right edge) instead of reaching it — both edges need an equal and
  opposite push to make the box 2rem wider rather than just shifted. If
  `<main>`'s or `.nav`'s horizontal padding changes at this breakpoint,
  both the `-1rem` margin-left and this margin-right need to change to
  match the new difference between them.
- **There is no Contact section.** Contact lives in the sticky header instead
  (`.nav-controls`, inside `.nav`): a mail icon, a LinkedIn icon link, and
  the theme toggle, so it's visible on every scroll position without the
  visitor hunting for it. All three share the `.icon-btn` base class (2rem
  square, border, radius). The LinkedIn icon is a hand-drawn-free `<svg>` —
  a rounded-square outline plus an `<text>` "in" glyph, not a copied brand
  asset.
  - **The mail icon is a hover flyout, and there is no `mailto:` link
    anywhere on the page.** `#mail-trigger` is a plain `<button>`, not an
    `<a>` — it opens/closes `.mail-flyout` and does nothing else. The
    flyout itself holds the address as inert text
    (`<span class="mail-flyout-address">`, not a link) plus the
    copy-email button; copying is the only way to get the address out of
    the page, which is a deliberate choice, not an oversight — don't
    re-add a `mailto:` href to either element without the owner asking for
    it back. `.mail-control` wraps the trigger and the flyout, which is
    `opacity:0; pointer-events:none` until `.mail-control` gets an
    `.is-open` class or `:focus-within` fires.
  - **Opening/closing on hover is JS-driven with a close delay, not plain
    CSS `:hover`.** A first version used `.mail-control:hover .mail-flyout`
    directly and it was unusable — the flyout sits below the icon with a
    visual gap, and raw `:hover` drops the instant the cursor leaves the
    icon's box, killing the flyout mid-transit before the mouse could ever
    reach it (no way to click the copy button). Fixed with
    `mouseenter`/`mouseleave` listeners on `.mail-control` that add/remove
    `.is-open`, where `mouseleave` doesn't close immediately but schedules a
    ~350ms `setTimeout`, cleared if `mouseenter` fires again first (moving
    into the flyout) — a grace period standing in for exact mouse-path
    geometry, rather than trying to compute a pixel-perfect hover bridge.
    Don't revert this to a pure CSS `:hover` rule; the gap-crossing bug will
    come right back. On devices without hover (gated by
    `@media (hover: hover)` in JS), this whole path is skipped in favor of a
    tap-to-toggle: tapping `#mail-trigger` opens the flyout, tapping it again
    closes it (there's no navigation to fall through to since the trigger
    isn't a link). It also closes on a tap outside `.mail-control`, or the
    moment scrolling starts — without that second one it would otherwise
    ride along
    indefinitely as the visitor scrolls, since there's no equivalent of
    "tap elsewhere to dismiss" for scrolling. **That close is wired to both
    `scroll` and `touchmove`, not `scroll` alone** — a `scroll`-only
    listener visibly lags on iOS Safari, because an active touch-scroll
    runs on the compositor and can defer a scroll handler's style changes
    until the gesture settles, so the flyout stays painted through the
    whole scroll and only actually disappears once it stops (looks like it
    "lingers while scrolling," which is exactly the bug this was written to
    fix). `touchmove` fires the instant the finger starts moving, ahead of
    that deferral, so pairing both is what makes it disappear immediately
    rather than only once scrolling settles; this couldn't be verified in
    headless Chromium (the iOS-specific compositor/paint timing doesn't
    reproduce there) — only that the event wiring itself closes it
    correctly. **Every touch-path close goes through a shared
    `closeFlyout()`, not a bare `classList.remove('is-open')`** — tapping
    the trigger also focuses it, so `:focus-within` alone keeps the flyout
    visible forever no matter what `.is-open` says, unless whatever's
    focused inside `.mail-control` is explicitly blurred too. `closeFlyout()`
    does both (remove the class, blur `document.activeElement` if it's
    inside the control); a fix that only removes the class will look like
    it's failing to close at all. `#copy-email-status` (the `aria-live`
    region for the copy confirmation) lives directly under `</header>`,
    outside the header itself.
    **The flyout address is intentionally plain, unstyled text** —
    `color: var(--text)`, no underline, no accent color — since it isn't a
    link and shouldn't look like one. Don't add link styling back to it.
  - **A real mouse click on `#mail-trigger` is deliberately blurred on
    hover-capable devices** — `trigger.blur()` on click when
    `event.detail !== 0`, so it doesn't leave the flyout stuck open.
    Without this, clicking the button (easy to do by accident, reaching for
    the icon) focuses it, and `:focus-within` then holds the flyout open
    indefinitely — ignoring the hover grace-period timer entirely — until
    focus happens to land somewhere else. On desktop this icon is meant to
    be a pure hover trigger; the only action (copying the address) lives
    inside the flyout itself. This only fires on genuine pointer clicks —
    it checks `event.detail !== 0` (a keyboard-triggered Enter/Space
    "click" reports `detail === 0`), so Tab-then-Enter activation for
    keyboard users still opens the flyout via `:focus-within` without
    immediately blurring it away. Don't drop the `event.detail` check
    trying to "simplify" this — that's what keeps keyboard access working.
  - **The flyout's horizontal position is clamped by JS, not fixed by CSS.**
    Base CSS centers it under the icon (`left: 50%` + `translateX(-50%)`),
    but the icon sits near the *left* edge of the header on narrow layouts
    (it's the leftmost control) and near the *right* edge on desktop (nav
    space-between pushes `.nav-controls` to the far right) — centered, it
    overflows off one side or the other depending on viewport width, and a
    static anchor (`left: 0` or `right: 0`) only trades which side breaks.
    `positionFlyout()` in `js/main.js` measures the flyout's actual
    `getBoundingClientRect()` each time it's about to open and adds an
    extra `translateX` nudge (min 8px margin from either viewport edge) on
    top of the CSS centering — called from the hover `open()`, the touch
    tap-open, and a `focus` listener on `#mail-trigger` (so keyboard-only
    Tab navigation, which opens the flyout via pure `:focus-within` with no
    JS involved otherwise, still gets positioned correctly).
  - **Copy closes the flyout ~200ms before the checkmark morph reverts**,
    on a separate `closeFlyoutTimer` (1000ms) from the `resetTimer` (1200ms)
    that flips the icon back to the clipboard shape, both in the "Copy
    email to clipboard" IIFE. They used to fire together at 1200ms, which
    looked wrong: the flyout's own opacity fade (~0.15s) and the icon's
    checkmark→clipboard revert started at the same instant, so the plain
    clipboard icon became visible again while still faintly visible through
    the fade — a flash of the "wrong" icon right as it closed. Starting the
    flyout's close first (1000ms) means it's fully faded by the time the
    icon reverts (1200ms), hiding that transition entirely. Don't reunify
    these two timers back into one `setTimeout` — that's exactly the bug
    this fixes. The full confirmation animation is still always visible
    before it starts closing, even if the mouse never leaves the button.
    Moving the mouse away earlier still closes it sooner via the normal
    hover-out grace-period timer (see above) — that's independent and fine,
    this only governs the case where the visitor stays put.
  - `.mail-flyout` is hidden outright in print (`display: none`) rather than
    left to `opacity: 0`, since a print stylesheet has no hover state and an
    invisible-but-present flyout would otherwise print as blank space. Only
    the trigger prints. Since it's a `<button>` with no `href`, the address
    can't ride along on `.nav-controls a[href]::after` the way the LinkedIn
    link does — `#mail-trigger` carries the address in a `data-email`
    attribute instead, and a matching `#mail-trigger::after` print rule
    appends it the same way. Keep both in sync if the address ever changes.
- **Projects and Certifications each show only their first N cards** — N is
  **2 below the 768px breakpoint, 4 at and above it**, not a fixed number.
  Cards aren't pre-marked `hidden` in the markup for this anymore (a static
  attribute can't encode "hidden on mobile, visible on desktop"); a
  `setupExpandable()` helper in `js/main.js` (one call per grid) computes
  the cutoff from `window.matchMedia('(min-width: 768px)')` and sets
  `.hidden` on cards by index every time it renders — on load, on toggle
  click, and again on a `matchMedia` `change` listener so resizing across
  the breakpoint while still collapsed resyncs which cards are showing
  (crossing it while already expanded does nothing, since everything's
  already visible). The toggle button (`#projects-toggle`, `#certs-toggle`)
  flips an `expanded` flag and re-renders — no navigation, same page. The
  button is intentionally minimal: a muted, non-bold `.show-more-label`
  plus a `.show-more-arrow` chevron, arrow **below** the label pointing
  down when collapsed, flipped to **above** the label and rotated 180°
  (pointing up) when expanded via `flex-direction: column-reverse` on
  `[aria-expanded="true"]` — no visible button border/background, just
  `color: var(--text-muted)` text (no added `opacity` dimming — an earlier
  version layered `opacity: 0.75` on top of the already-muted color, making
  it visibly lighter than other `--text-muted` text like `.tagline`
  elsewhere on the page; removed so this text is exactly the same rendered
  color, not just the same token) that brightens to `var(--text)` on hover.
  `.project-desc-toggle` ("read more"/"read less") follows the same
  color/no-opacity rule for the same reason. The visible label names what
  there's more of ("more projects"/"less projects", "more certs"/"less
  certs") via
  a `noun` argument passed into `setupExpandable()`, rather than a bare
  "more"/"less" that leaves the reader guessing — the fuller
  "Show more/fewer projects" phrasing still exists separately as the
  button's `aria-label` for screen readers. Adding an 8th project or 9th
  cert later needs nothing here — the toggle logic reads the DOM and counts
  by index, it doesn't hardcode which specific cards start hidden.

- **Each project's description (`.project-desc`) is clamped to 3 lines**
  with an ellipsis, via `-webkit-line-clamp: 3` (`display: -webkit-box;
  -webkit-box-orient: vertical; overflow: hidden;`), independent of and in
  addition to the card-level show/hide above — this clamp applies to every
  visible project card's body text at any screen width, not just mobile.
  A sibling `.project-desc-toggle` button expands/collapses just that
  paragraph — visually distinct from the grid-level toggle on purpose: no
  chevron, italicized, tucked directly under the paragraph with no gap, and
  labeled "read more"/"read less" rather than a bare "more"/"less" (that
  wording only makes sense for the grid-level toggle, which sits well below
  its content and needs the "show more of the same grid" framing; this one
  sits right against the text it's toggling, so "read more" reads more
  naturally there). It's a standalone `.project-desc-toggle` style, not a
  reuse of `.show-more-btn` — don't merge them back into one class, they're
  meant to look different. A "Project description clamp" IIFE in
  `js/main.js` pairs each
  `.project-desc` with the `.project-desc-toggle` immediately after it via
  `nextElementSibling` — the two must stay adjacent siblings in the markup,
  or the pairing breaks silently (the `if (!toggle || …) return` guard
  skips it rather than erroring). Whether the button shows at all is
  decided by measurement, not guesswork: `scrollHeight > clientHeight` on
  the clamped paragraph is only true when the clamp actually cut something
  off, so a short description that fits in 3 lines never gets a toggle.
  That measurement reruns on a debounced `resize` listener too, since the
  1-col mobile layout and 2-col desktop layout give the same text different
  column widths, which changes how many lines it needs — a description that
  overflows at one width may not at the other. Print forces
  `.project-desc` back to `display: block; -webkit-line-clamp: unset;
  overflow: visible;` and hides `.project-desc-toggle` entirely, same
  reasoning as the grid-level show-more being pointless on paper.

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

**Content is filled in now** — About, Skills (section heading is just
"Skills", not "Skills & Tooling" — shortened per the owner's call), Projects
(same: "Projects", not "Projects & Labs") (7 cards), and Certifications (7
of 9) are all written. See the Content build-out roadmap step for what each
turned out to be and what's still open.

**Project cards no longer tag themselves "Home Lab" / "Personal Project" in
`.project-meta`** — that subtitle line is tools/tech used only now (e.g.
"kerbrute · Impacket · Active Directory"), per the owner's call that the
project-type label was redundant/unwanted. This is purely about what's
*visible* on the card — it does not by itself change the Operational
security framing below (no employer/client attribution in the prose); see
that section for what's still sanitized.

**"TS/SCI Security Clearance" no longer appears anywhere on the page** —
removed from the hero (was a `<p class="clearance">` under the tagline,
now-unused CSS rule deleted too) and from `og:description`, per the owner's
call to drop it, not just visually hide it. The `<title>` and
`meta name="description"` never mentioned it and are unchanged. This is
purely a content/marketing decision, unrelated to the Operational security
section above (which is about sanitizing project *detail*, not about
whether the clearance is mentioned at all).

The OG image is a "Cesar Vaca / PORTFOLIO" wordmark — same layout the owner
originally supplied as a PNG (name in large bold serif, "PORTFOLIO" in
letter-spaced small caps flanked by two horizontal rules) — not the
dark-background name+title+clearance design originally sketched in the
roadmap below — that plan is superseded, this is the real design now. It's
since been **regenerated in-code** (`Pillow`, not the owner's original file)
to track the site's actual palette and typeface instead of drifting from
them: background/text are the light-theme tokens (`--bg: #fbf9f7`,
`--text: #554d37`), and the type is Georgia Bold / Georgia — the same
system-serif family the site's `body` uses (see Conventions) — rather than
whatever font was baked into the owner's original PNG. There's no build
step or committed generator script for this (same as the cert JPEGs — a
one-off Pillow script run ad hoc, not saved in the repo), so regenerating it
after another palette/font change means re-running that kind of script
again rather than hand-editing pixels. Still exactly 1200×630, RGB PNG, no
transparency (matches what Facebook/LinkedIn/iMessage preview cards
expect).

**Cert images are real now**, not placeholders — the owner sent the actual
PDF certificates (sourced from
`~/Library/CloudStorage/ProtonDrive-cesar@cvmail.me-folder/career/certs/`,
also mirrored under iCloud `~/Library/Mobile Documents/.../work/certs/`), and
each was rasterized with PyMuPDF at 1400px-long-edge, ~85 quality JPEG.
All 7 source PDFs are US Letter landscape (792×612pt, or equivalent), so the
JPEGs are ~1.294:1 — very close to but not exactly the `.cert-image`
CSS's 4:3 box; `object-fit: cover` absorbs the difference invisibly.

**Every cert JPEG has since been redacted and watermarked in place**
(129–219KB each now — bigger than the original 78–162KB range, since the
tiled watermark adds fine-grained texture that costs more JPEG bytes than
flat certificate backgrounds do). Per the owner's security concern about
publishing a persistent personal identifier on a public page, every unique
ID-like number on every cert image is painted over with a solid box and
replaced with bold "REDACTED" text — not just CompTIA's literal "Candidate
ID" field (same on all 4 CompTIA certs: pentest-plus, security-plus,
network-plus, cloud-plus) but also each CompTIA cert's separate "Code:"
verification code near the bottom, ISC2's "Certification Number" on the
SSCP cert, AWS's "Validation Number" on the AWS cert, and the LPI
verification code embedded in the visible URL on the Linux Essentials cert.
The redaction box color matches each cert's local background (white for
the light-background certs, the same dark navy as the card body on the AWS
one) so it reads as part of the original design, not a crude patch. A
tiled, rotated, semi-transparent "cesarspace.online" watermark (dark text
on light certs, light text on the dark AWS one) is layered across every
image afterward. **This has no committed source/generator script** (same
pattern as the original PDF→JPEG rasterization and the OG image — a one-off
Pillow script run ad hoc, not saved in the repo) — the redaction box
coordinates were hand-measured per image via pixel-column/row projection
scans and are specific to each cert's exact layout, so they are **not
reusable** if any of these 7 images is ever regenerated from its source PDF
again; redoing that would require re-locating and re-measuring the ID
field(s) on the new image before redacting. None of the "Verify with
Credly" links elsewhere on the page were touched — those still work as an
independent, un-redacted verification path.

The **UMGC degree card is removed for now** — the owner doesn't have that
credential's file ready yet. Re-add it the same way: a `cert-card` with an
image, `<h3>`, and no `.cert-verify` (degrees don't have Credly badges).

The "Verify with Credly" links are **real** — extracted from the hyperlink
annotations in `assets/Cesar Vaca Resume.pdf` (the visible cert names in that
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

- ~~Projects~~ — done, 7 cards (section heading is "Projects", not "Projects
  & Labs"): Agentic AI Vulnerability Assessment Tool, Active Directory
  Attack Chain, WPA2/PMKID Capture & Offline Cracking, RFID/NFC Badge
  Cloning, Burp Suite Web/API Testing, Secure Self-Hosted Minecraft Server,
  and the Uniform Random Apple Shortcuts Password Generator (the last two
  are from the owner's CV, not the résumé — the Minecraft one deliberately
  omits the real subdomain and the real AMP login screenshot from the CV,
  describing the architecture without naming the live hostname, per the
  owner's choice). The pentesting-technique projects (WPA2/PMKID, RFID/NFC,
  Burp Suite) are framed as home-lab work with no employer/university
  attribution, per Operational security above, even though the résumé
  listed them under mixed home-lab/employer/school credit. **The Active
  Directory Attack Chain card is a deliberate exception to that** — its copy
  says "an authorized enterprise pentest," real-engagement framing rather
  than home-lab framing. This was flagged to the owner explicitly (since it
  reads as a departure from their own Operational security policy above) and
  confirmed as intentional, not an oversight — they're comfortable naming
  this one as a real authorized engagement. Don't "fix" it back to home-lab
  wording without asking first. Every card reuses the same generic placeholder hover-video — replace
  per-card as real clips get recorded (step 4). `.project-meta` (the
  small subtitle line under each title) is tools/tech only now, e.g.
  "kerbrute · Impacket · Active Directory" — no "Home Lab"/"Personal
  Project" tag, per the owner's call; see State above.
- ~~Skills~~ — done (section heading is "Skills", not "Skills & Tooling").
  Four groups (Recon & Enumeration,
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