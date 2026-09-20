# Portfolio site — project context

Personal cybersecurity portfolio for Cesar Vaca. Static site, no build step,
no framework. Live at https://cesarspace.online/ (custom domain; DNS is set,
the certificate is issued, and **HTTPS is enforced as of 2026-09-20** — HTTP
now 301-redirects to HTTPS. It was broken from launch until this date because
the domain's Cloudflare DNS records were proxied, which blocked GitHub's
certificate challenge; see roadmap step 5 and the Cloudflare/TLS gotchas at
the bottom for the root cause and fix, kept for reference in case it
regresses). The old `https://xodl77.github.io/portfo/` address still works
as GitHub Pages' default URL for the repo.

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
    subtitle/secondary text (`.tagline`, `.project-meta`, etc. — anything
    using this token) matches the rest of the brown palette
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
- **The résumé has its own page, `resume.html`, reachable at
  `https://cesarspace.online/resume`** (no `.html`, no redirect — GitHub
  Pages serves `resume.html` directly at the extensionless `/resume` path
  natively, the same mechanism that makes `/` serve `index.html`; nothing
  extra needed in this repo). It exists so the hero's "View resume" button
  (`index.html`, a plain same-tab link — no `target="_blank"`, per the
  owner's call that going back and forth between the résumé and the rest
  of the site should feel like one tab, not two) gets a page with the
  site's own branding instead of a bare PDF in the tab — a direct link to
  the PDF
  asset shows a generic file icon, "resume.pdf" as the tab title, and the
  browser's own (unstyled, un-themed) PDF toolbar, none of which matches
  the site.
  - **It reuses the full `index.html` header** (brand, nav-links, mail
    flyout, LinkedIn, theme toggle) rather than being a minimal page like
    `404.html`, per the owner's call that it should feel like part of the
    site, not a bare utility page — so dark/light mode and every header
    control work here exactly like on the homepage. `js/main.js` is
    included in full; every IIFE it doesn't need (scroll-spy, back-to-top,
    the show-more toggles, project description clamp, skill list expand)
    self-guards on elements that don't exist on this page and no-ops, per
    the established `js/main.js` convention. **The nav-links point to
    `/#about`, `/#skills`, etc. (absolute, with the leading `/`)**, not
    bare `#about` — a bare fragment link would just look for that id on
    `resume.html` itself, find nothing, and go nowhere; the same reasoning
    applies to `.nav-brand`'s `href="/"` instead of `#top`. None of these
    links ever show `.is-active` (scroll-spy has no `main section[id]` to
    observe here), which is fine — they're simple navigation on this page.
  - **The visible résumé is a static, pre-rendered image
    (`assets/img/resume-preview.jpg`), not a live embedded PDF viewer** —
    this is the second design, not the first. The first version embedded
    the actual PDF via `<iframe>` sized with `aspect-ratio: 612 / 792`
    (the PDF's real MediaBox, US Letter portrait) inside a padded
    `.resume-embed-wrap` "mat", to compensate for the browser's own PDF
    viewer background showing through unevenly around the page. The
    owner's reaction: they didn't want the browser's PDF viewer at all —
    its built-in zoom/pan controls didn't belong on a page meant to look
    like the rest of the site, and no amount of matting fixed that it was
    still someone else's UI. Switched to a plain `<img>` instead: no
    zoom, no pan, no viewer chrome of any kind, just scales to the page's
    width like every other image on the site, identically on desktop and
    mobile. **No bezel/mat either** — that was specifically un-asked-for
    once the iframe (the thing the mat existed to hide) was gone.
    `assets/img/resume-preview.jpg` was rendered from the PDF with
    `qlmanage -t -s 6000` (macOS Quick Look's thumbnail generator — no
    PyMuPDF/Pillow needed for this one; despite the name this isn't
    capped at some small "thumbnail" size, it renders at whatever `-s`
    is given), then downsized to **4139px** on the long edge (~376 DPI
    for the page's 8.5in width) and re-encoded at **JPEG quality 96**
    with `sips` (~2.2MB). This went through three passes before landing
    here, each caught by the owner actually looking at it rather than by
    anything measurable in this dev environment:
    - **1600px/q65 (~385KB) came out visibly blurry** — 1600px isn't
      enough source resolution for a ~836px-wide on-page display at
      2x/retina (needs ~1670px minimum, with zero room left for JPEG's
      own softening on top), and q65 compresses dense body text
      noticeably harder than it does a certificate's mostly-white
      layout.
    - **2400px/q92 (~1MB) fixed the blur at normal viewing** but the
      owner explicitly wanted it indistinguishable from the actual PDF,
      not just "good enough at a glance" — 2400px only clears 2x retina
      by a small margin, with no headroom for 3x devices or any amount
      of zoom.
    - **4139px/q96 is confirmed indistinguishable from a lossless PNG
      at the same resolution** via pixel-level crop comparison (same
      region, same scale, side by side — no visible ringing or
      softening from JPEG at q96), and leaves ~28% headroom above what
      a 3x-density display needs at this image's actual on-page CSS
      width, so the browser is downscaling slightly rather than
      upscaling at even the highest realistic display density.
    - **This still isn't literally the same as the vector PDF at
      unlimited zoom** — no finite-resolution raster image can be; if
      someone pinch-zooms or browser-zooms far enough past normal
      reading size, some softening is eventually inevitable. What 4139px
      buys is "indistinguishable at any realistic viewing/zoom level,"
      not "identical at infinite zoom" — the latter would require a
      live vector renderer (either the browser's own PDF viewer, with
      the zoom/pan-chrome problems that motivated dropping it, or a
      bundled JS PDF renderer like PDF.js, which conflicts with this
      project's no-dependencies rule). Don't regenerate this smaller to
      save space without re-checking it against real (not
      headless-sandboxed) high-density rendering — file size isn't the
      constraint here, matching the PDF's own clarity is.
  - **Unlike the cert images and the OG image, this one *does* have a
    committed, reusable generator: `scripts/regenerate-resume-preview.sh`**
    (macOS-only — `qlmanage`/`sips`, both built in, no PyMuPDF/Pillow).
    The owner pushed back on the ad hoc-script pattern once they realized
    it meant a manual re-rasterize-and-replace step every time they edit
    their résumé; a real, reusable script removes the "re-derive the
    right qlmanage/sips invocation from memory" part of that, and
    **`.githooks/pre-commit` removes the rest** — it checks
    `git diff --cached --name-only` for `assets/Cesar Vaca Resume.pdf`,
    and if that file is part of the commit, runs the regenerate script
    and `git add`s its output into the *same* commit automatically. End
    result: updating the résumé is just "replace the PDF, `git add`,
    `git commit`" — no separate conversion step to remember. The hook
    only takes effect once per clone via
    `git config core.hooksPath .githooks` (already set for the owner's
    current clone; a fresh clone needs that command run once — `.git/hooks`
    itself isn't tracked by git, which is why this lives in `.githooks`
    and gets pointed to explicitly rather than just working automatically).
    Verified end to end in an isolated scratch git repo (never touched the
    real résumé or repo history): staging a modified PDF and running a
    real `git commit` triggered the hook, which regenerated the preview
    and included it in that same commit without any extra step.
  - **A second, hidden `<iframe id="resume-frame" class="resume-print-frame">`
    still points at the real PDF, solely so the Print button has
    something to print** — printing the flattened preview image would be
    lower quality than the vector PDF, so this iframe (1px, positioned at
    `top/left: -9999px`, not `display: none` — some browsers skip
    initializing a PDF document in a zero-size or `display: none` iframe,
    which would silently break printing) stays loaded in the background.
    The Print button's `js/main.js` IIFE ("Resume print button") is
    unchanged from the first design: `frame.contentWindow.print()` on
    this iframe hands off to the browser's native PDF print flow, with a
    `window.open()` fallback if that throws. It's guarded on
    `#resume-print`/`#resume-frame` both existing, same as before.
  - **`.resume-back`, a plain `.btn` reading "← Back to portfolio", sits
    above the toolbar** (own line, `margin-bottom` under it) — the
    browser's own back button works fine now that this opens in the same
    tab (not `target="_blank"`), but this stays as a second, more
    explicit way back, and still matters for anyone who lands here
    directly (a shared link, a bookmark) with no back-history at all.
  - **The page title/heading say "Resume", not "Résumé"** — the owner's
    call, dropping the accents from the on-page text (the file path
    `assets/Cesar Vaca Resume.pdf`, `resume-preview.jpg`'s content, and
    CLAUDE.md's own prose weren't part of that; only what's rendered as
    text on `resume.html` changed).
  - A `.resume-toolbar` above the image holds an `<h1>Resume</h1>` and two
    `.icon-btn`-styled controls matching the header's icon buttons: the
    Print button above, and a Download link (`download="Cesar Vaca
    Resume.pdf"` on a plain `<a>` pointed at the real PDF, forces a save
    rather than navigating).
  - Unlike `404.html`, this page uses **relative** paths for its
    assets/favicon/stylesheet/PDF/preview image — it's always loaded at
    exactly `/resume` or `/resume.html`, never an arbitrary depth, so
    relative paths resolve correctly (they don't need `/`-prefixing the
    way 404's paths do).
  - **The Print button's actual print dialog still couldn't be visually
    verified end-to-end** in this environment — the sandboxed headless
    Chromium used for testing has no PDF viewer plugin at all
    (`navigator.plugins` is empty; even a bare top-level navigation to
    the PDF triggers a download instead of viewing it), so
    `contentWindow.print()` on the hidden iframe is a no-op here
    regardless of what caused it. Real desktop and mobile browsers ship
    PDF viewing enabled by default. Everything else — the preview image
    rendering and scaling correctly at every width, header, theme
    toggle, mail flyout, toolbar layout, no console errors — was
    confirmed working in that same sandbox.
- **Certifications are a card grid**, viewable inline — not a PDF behind a
  button. Each `<article class="cert-card">` in `#certs` holds the vendor's
  square Credly badge PNG (not a scan of the certificate — see State for why
  that changed) at `assets/certs/<kebab-case-name>.png`, `.cert-image` is
  `aspect-ratio: 1 / 1` with `object-fit: contain` (the badge artwork is
  already square, `contain` avoids ever cropping a logo the way `cover`
  would), and a title. To add a new one: drop the badge PNG in that folder
  and add a matching card — no JSON manifest or build step, consistent with
  how Projects are hand-authored.
  **`.certs-grid` has its own responsive pattern, not shared with
  `.projects-grid`/`.skills-grid`** — 2-col mobile / 3-col at 768px (versus
  1-col/2-col for the other two grids), since square badges read better
  smaller and more-per-row than the wide project cards.
  **The Credly verify link is the whole card, not a visible line of
  text** — the old `.cert-verify` paragraph ("Verify with [Credly]")
  sitting under the title is gone, and this went through two designs
  since: first just the badge image was the link, then the owner asked
  for the title to be clickable too, so `.cert-badge-trigger` (a real
  `<a href="https://credly.com/...">`, not a `<button>` revealing
  something else) now wraps **both** the `<img>` and the `<h3
  class="cert-title">`, as siblings inside it — a tap or click anywhere
  on the card's image or title navigates, identically to the header's
  LinkedIn icon link, so touch visitors need no JS at all for the core
  interaction. `.cert-badge-trigger` sets `color: inherit` so the title
  text doesn't pick up the default `a { color: var(--accent) }` link
  color just from being nested inside the anchor — it still reads as a
  normal heading. `.cert-card` itself (not a separate `.cert-verify-control`
  wrapper div — there used to be one, but once the whole card became the
  link there was no reason to keep a redundant nested `position: relative`
  container) carries `position: relative` so `.cert-badge-icon` and
  `.cert-verify-flyout`, both siblings of the `<a>` rather than descendants
  of it, can anchor themselves against the card's own box. Two separate
  affordances layer on top of that real link, one for each input type:
  - **`.cert-badge-icon`**, a small always-visible square arrow glyph
    pinned to the card's bottom-right corner (own inline SVG — a plain
    diagonal line plus a two-segment polyline forming a simple
    arrow-up-right shape, deliberately simpler than an earlier version
    that drew a small box-with-corner-arrow "external link" glyph; not a
    brand asset either way, same hand-drawn-free approach as the header's
    LinkedIn icon). It's square with the same 6px `border-radius` as the
    header's `.icon-btn` (not a circle — that was tried first and the
    owner asked for it to match the header controls instead), so it reads
    as the same family of control as the mail/LinkedIn/theme-toggle
    buttons. This is the part that answers "how does a mobile visitor
    know the card is tappable" — it never depends on hover/focus state,
    so it's exactly as visible on a phone as on desktop. Purely
    decorative (`aria-hidden`, `pointer-events: none`) since the whole
    card is already the link; it dims to `--text-muted` normally and
    brightens to `--accent` on hover via the adjacent-sibling selector
    `.cert-badge-trigger:hover + .cert-badge-icon` under `(hover: hover)`
    — this relies on `.cert-badge-icon` being the `<a>`'s very next
    element sibling in the markup, so keep them adjacent if this ever
    gets reordered.
  - **`.cert-verify-flyout`**, a `"Verify with Credly"` tooltip that
    only exists for mouse users. It's a plain `aria-hidden` `<span>`,
    not a link (nesting an `<a>` inside `.cert-badge-trigger` would be
    invalid HTML) — its job is purely to label what the card does on
    hover, not to be interacted with itself. The "Certification badge
    tooltips" IIFE in `js/main.js` shows it on `mouseenter` and hides it
    on `mouseleave` with no grace-period delay (unlike the header mail
    flyout, there's no gap to cross into since this tooltip isn't
    something you move the mouse into — clicking anywhere on the card,
    tooltip included conceptually, hits the underlying link), and
    repositions it on every `mousemove` via a `.is-following` class that
    switches it to `position: fixed` so inline `left`/`top` pixel values
    track the raw cursor coordinates, clamped 8px from the viewport
    edges the same way the mail flyout clamps horizontally. **It also
    closes on `scroll`/`touchmove`**, same as the mail flyout, but for a
    different reason: since it tracks the cursor rather than the card,
    scrolling with the mouse held still would otherwise leave it planted
    at the last cursor position while the card it's labeling moves out
    from under it. Closing beats re-anchoring it, since once the page has
    moved there's no meaningful cursor-to-card relationship left to
    preserve. This whole IIFE bails out immediately on touch
    (`matchMedia('(hover: hover)')` false) — there's no cursor to track,
    and `.cert-badge-icon` is already the affordance there, so no
    tap-to-toggle fallback is needed the way the mail flyout has one. The
    one thing that *does* run regardless of hover capability: blurring
    the trigger after a genuine click (`event.detail !== 0`, same check
    as the mail trigger), since these links open `target="_blank"` and a
    lingering focus on the original tab's trigger would otherwise leave
    `:focus-within` holding the tooltip open if the visitor switches
    back to this tab. `:focus-within` is also the fallback for keyboard
    users tabbing to the link — no cursor position to track there, so it
    shows the flyout at its CSS default position (centered under the
    card) rather than following anything.
  **`.cert-card` lost its `overflow: hidden`** to make room for this —
  the badge image is inset from the card's edges by its own 1rem padding
  and the PNGs are transparent right up to that inset, so the clip was
  never visually doing anything; keeping it would have clipped the
  flyout/icon on narrow (2-col mobile) cards. To add a cert with no
  Credly badge (e.g. the degree): skip the `<a>`/`.cert-badge-icon`/
  `.cert-verify-flyout` entirely and use a bare `<img class="cert-image">`
  plus `<h3>` as direct children of `.cert-card`, same as before. The
  print stylesheet hides both `.cert-verify-flyout` and `.cert-badge-icon`
  outright (same as `.mail-flyout`) rather than forcing them into static
  flow — `.cert-badge-trigger` is a real `main a[href^="http"]` now, so
  the existing generic print rule already appends its Credly URL after
  it with no special-casing needed.
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
  - **`.icon-btn:hover` is wrapped in `@media (hover: hover)`.** Without
    that guard, tapping any icon button on a touch device (the theme
    toggle was the one the owner actually noticed) left it visibly
    "stuck" in its hover color (accent border/icon) until the next
    scroll — touch browsers apply `:hover` styles on tap and only clear
    them on the next scroll/repaint, since there's no real pointer to
    un-hover with. Gating on `(hover: hover)` means only devices with an
    actual pointer (mouse/trackpad) ever get that highlight.
    **Touch devices get a deliberate one-shot flash instead, not no
    feedback at all** — the owner asked for the highlight back on mobile
    specifically, just without the stuck-until-scroll bug. The "Header
    icon-btn tap flash" IIFE in `js/main.js` adds `.is-flash` on `click`
    (only when `matchMedia('(hover: hover)')` is false, so this never
    doubles up with the real `:hover` on a device that has both) to
    exactly three buttons — `#mail-trigger`, the LinkedIn link, and
    `#theme-toggle` — not every `.icon-btn` on the page (the copy-email
    button inside the mail flyout is deliberately excluded, since it
    wasn't one of the three the owner named). `.icon-btn.is-flash` in
    `css/styles.css` runs a 0.35s `@keyframes` animation from the same
    accent border/icon color the hover rule uses back down to normal,
    and the JS removes the class again on `animationend` — a real CSS
    animation with a fixed, guaranteed end, not a state that depends on
    the pointer being physically down (which for a fast tap could be too
    brief to register as a visible "flash" at all) or on scroll to clear
    it. A tap while a flash is already mid-animation removes the class,
    forces a reflow (`void btn.offsetWidth`), then re-adds it — without
    that, re-adding a class that's already present doesn't restart a CSS
    animation, so a rapid second tap would silently do nothing. This
    piggybacks on the site's existing global `prefers-reduced-motion`
    rule (further down in `css/styles.css`, `animation-duration: 0.01ms
    !important`) for free — no separate reduced-motion guard needed here.
    The mail flyout's own persistence is unaffected and still intentional
    — that comes from `:focus-within` on `.mail-control`, a separate
    mechanism from this hover rule.
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
  - **The copy button has an `execCommand('copy')` fallback for when
    `navigator.clipboard` is unavailable** — that API only exists in a
    secure context (HTTPS or localhost). Found 2026-09-20 while testing
    the mobile tap-flash feature below against the live site: at the time,
    this site's custom domain only served over plain HTTP (HTTPS was
    still broken — see roadmap step 5 and the Cloudflare/TLS gotcha at the
    bottom), so `navigator.clipboard` was `undefined` there and
    `.writeText()` threw before ever reaching `.then()` — the button
    visibly did nothing: no checkmark, nothing on the clipboard, silently
    swallowed by the existing `try/catch`. HTTPS is enforced now (fixed
    the same day), so `navigator.clipboard` is reliably present on the
    live site going forward and this fallback isn't load-bearing there
    any more — but it's kept anyway, since it's what makes the button work
    testing locally over plain `http://` (e.g. Python's `http.server`,
    same as the `404.html`/`resume.html` Live Server gotchas below) and
    it's a harmless safety net if HTTPS ever regresses. The fallback
    creates a hidden, off-screen `<textarea>`, selects its content, and
    calls `document.execCommand('copy')` — an older API but one that
    works without a secure context. `showCopied()` only fires on an
    actual successful copy in both paths, real or fallback, so the
    checkmark still means what it says.
  - `.mail-flyout` is hidden outright in print (`display: none`) rather than
    left to `opacity: 0`, since a print stylesheet has no hover state and an
    invisible-but-present flyout would otherwise print as blank space. Only
    the trigger prints. Since it's a `<button>` with no `href`, the address
    can't ride along on `.nav-controls a[href]::after` the way the LinkedIn
    link does — `#mail-trigger` carries the address in a `data-email`
    attribute instead, and a matching `#mail-trigger::after` print rule
    appends it the same way. Keep both in sync if the address ever changes.
- **Projects and Certifications each show only their first N cards** — N is
  **2 rows' worth at each grid's own column count**: Projects is 2 below the
  768px breakpoint / 4 at and above it (1-col mobile / 2-col desktop
  grid); Certifications is 4 / 6 (its grid is 2-col mobile / 3-col desktop
  — see the Certifications convention above), passed into `setupExpandable()`
  as explicit `mobileCount`/`desktopCount` arguments rather than a constant
  shared by both grids. Cards aren't pre-marked `hidden` in the markup for
  this anymore (a static attribute can't encode "hidden on mobile, visible
  on desktop"); a `setupExpandable()` helper in `js/main.js` (one call per
  grid) computes the cutoff from `window.matchMedia('(min-width: 768px)')`
  and sets `.hidden` on cards by index every time it renders — on load, on
  toggle click, and again on a `matchMedia` `change` listener so resizing
  across the breakpoint while still collapsed resyncs which cards are showing
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
Open Graph tags, résumé view button (opens `/resume` in the same tab —
its own branded page with the site's header/theme and custom
print/download buttons, not a direct link to the PDF asset; see the
resume.html convention above), print stylesheet, custom 404,
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

**Cert images are vendor Credly badge PNGs now, not scans of the
certificates** — superseding an earlier approach (kept below for history,
since the redaction technique may be useful again someday) where the owner's
actual PDF certificates were rasterized to JPEG and then hand-redacted. The
owner decided the badge artwork (square, transparent background, no personal
info of any kind on it) was simpler and had nothing to sanitize in the first
place, so the whole rasterize-then-redact-then-watermark pipeline was
dropped rather than repeated. The 7 PNGs (`assets/certs/<kebab-case-name>.png`)
were supplied directly by the owner, already square (ranging 600×600 to
1654×1654 across the 7 — CSS normalizes the display size, see the
Certifications convention above), with alpha transparency intact.

<details>
<summary>Superseded: JPEG scan + redaction/watermark pipeline (no longer in use)</summary>

The owner had previously sent the actual PDF certificates (sourced from
`~/Library/CloudStorage/ProtonDrive-cesar@cvmail.me-folder/career/certs/`,
also mirrored under iCloud `~/Library/Mobile Documents/.../work/certs/`), each
rasterized with PyMuPDF at 1400px-long-edge, ~85 quality JPEG, then redacted:
every unique ID-like number (CompTIA's "Candidate ID" and "Code:" fields,
ISC2's "Certification Number", AWS's "Validation Number", the LPI
verification code in the Linux Essentials cert's visible URL) was painted
over with a solid box matching the local background and replaced with bold
"REDACTED" text, then a tiled, rotated, semi-transparent "cesarspace.online"
watermark was layered over the whole image. None of this had a committed
generator script (one-off Pillow scripts run ad hoc), and the redaction box
coordinates were hand-measured per image, so they were never reusable if a
cert image needed regenerating from its source PDF. This is all now moot —
the JPEGs have been deleted from `assets/certs/` and replaced by the badge
PNGs described above — but the technique is documented here in case a future
credential only has a scan available (no vendor badge) and needs the same
treatment.

</details>

The **UMGC degree card is removed for now** — the owner doesn't have that
credential's file ready yet. Re-add it the same way: a `cert-card` with a
bare `<img class="cert-image">` (no `<a>`/`.cert-badge-icon`/
`.cert-verify-flyout`, since degrees don't have Credly badges) and an
`<h3>`.

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

### 5. ~~Custom domain~~ — done

`CNAME` (`cesarspace.online`) is in the repo root, DNS A records point at
GitHub Pages, and the site resolves there now. `404.html`'s absolute paths
and `index.html`'s canonical/OG URLs are updated to the new root (`/` instead
of `/portfo/`). **HTTPS is issued and enforced as of 2026-09-20** — plain
`http://cesarspace.online/` now 301-redirects to `https://`, and the cert
covers the custom domain correctly (`strict-transport-security` header
present, no TLS errors).

For reference, in case this ever regresses: the site launched with HTTPS
completely broken (`https://cesarspace.online/` failed TLS outright —
`curl: (60) SSL: no alternative certificate subject name matches target host
name 'cesarspace.online'`, HTTP status `000`, no response body — because
GitHub Pages had never issued a certificate for the custom domain). Root
cause, found 2026-09-18: the domain's DNS is hosted at Cloudflare and its
records were **proxied** (orange cloud), which prevents GitHub's certificate
challenge from completing. The fix was to set every record for the site —
the apex `A` records pointing at GitHub's Pages IPs and the `www` `CNAME` —
to **DNS only** (grey cloud), wait for the cert to issue (the challenge runs
over plain HTTP, which already worked, so nothing else was blocking
issuance once the records were unproxied), then check "Enforce HTTPS" in
Settings → Pages (it can silently stay unchecked after issuance and needs a
manual click — this is the step that adds the HTTP→HTTPS redirect). If the
cert still hasn't appeared after an hour or so of DNS-only records, removing
the custom domain in Settings → Pages, saving, re-adding it, and saving
again re-triggers issuance. Verify with:

```
curl -sS -o /dev/null -w '%{http_code} %{content_type}\n' https://cesarspace.online/assets/img/og-image.png
```

`200 image/png` means it's fixed; `000` plus a `curl: (60)` error means the
cert isn't there.

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
- **Cloudflare proxying (the orange cloud) blocks GitHub Pages certificate
  issuance.** If the domain's DNS lives at Cloudflare, every record for the
  site has to be **DNS only** (grey cloud) or GitHub's certificate challenge
  never completes and no cert is ever issued. This is why HTTPS was broken
  here from launch until 2026-09-20 — see roadmap step 5 for the full fix
  and the verification command. **Resolved now** (cert issued, HTTPS
  enforced), but if the DNS records ever get re-proxied (e.g. someone
  toggles Cloudflare's orange cloud back on for CDN/DDoS features), this
  exact failure mode will return — check that first before re-diagnosing
  from scratch.
- **A missing HTTPS certificate makes link previews show a random cert badge
  instead of the OG image** — and it looks exactly like someone changed
  `og:image`, which is the trap. This was an active problem here before the
  cert issued (see above); kept for reference in case HTTPS ever breaks
  again. Symptom: sharing the site in iMessage (or anything else that
  unfurls links) produces a card with the correct title and domain but a
  CompTIA badge as the picture. The cause is that `og:image` is an
  **absolute `https://` URL** while every `<img>` on the page uses a
  **relative** path: with the cert broken, a crawler fetches the page fine
  over HTTP (so the title comes through), fails TLS on the absolute OG
  image URL, gets nothing, and falls back to scraping the page's own
  images — which resolve against `http://` and load fine — landing on
  whichever cert badge its heuristics like. Every device shows the same
  thing, so it reads as a server-side change rather than a cache, and chasing
  it as a caching bug wastes a lot of time. **Don't "fix" this in the
  markup** — don't edit `og:image`, don't make it relative, don't repoint it
  at the `github.io` host. The tag is correct; if this recurs, fix the
  certificate and the card comes back on its own.
- **`curl -s` hides TLS errors.** `curl -sI https://…` against a host with a
  bad cert prints *absolutely nothing* and returns you to the prompt, which
  reads like a network or DNS problem instead of a certificate one. Use
  `-sS` (quiet, but still shows errors) or add
  `-w '%{http_code}\n'` when diagnosing anything about the live site.
- `404.html` cannot be tested with Live Server; only the deployed Pages URL
  serves it.
- **`resume.html`'s pretty URL (`/resume`) only works on the deployed GitHub
  Pages site** — Live Server and any plain static file server (Python's
  `http.server`, etc.) don't do GitHub Pages' extensionless-path resolution,
  so locally you have to hit `/resume.html` directly. Same underlying
  limitation as the `404.html` Live Server gotcha above.
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