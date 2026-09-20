/* ============================================================
   Theme toggle
   The initial theme is set by the inline script in <head>.
   This only handles clicks and persistence.
   ============================================================ */

(function () {
  var btn = document.getElementById('theme-toggle');
  if (!btn) return;

  btn.addEventListener('click', function () {
    var current = document.documentElement.getAttribute('data-theme');
    var next = current === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', next);

    try {
      localStorage.setItem('theme', next);
    } catch (e) {
      // Storage can be blocked in hardened privacy settings. Theme still
      // switches for this page view; it just won't persist.
    }
  });
})();


/* ============================================================
   Header icon-btn tap flash
   .icon-btn:hover in the CSS is gated to (hover: hover) devices only, to
   avoid a stuck-highlight bug on touch (see that rule's comment) -- this
   is the touch replacement: a brief one-shot flash on tap instead of a
   sustained highlight, for the three buttons the owner actually wants
   feedback on (mail, LinkedIn, theme toggle), not every .icon-btn on the
   page (e.g. not the copy-email button inside the mail flyout).
   ============================================================ */

(function () {
  if (window.matchMedia('(hover: hover)').matches) return;

  var buttons = document.querySelectorAll('#mail-trigger, .nav-controls a.icon-btn, #theme-toggle');
  if (!buttons.length) return;

  Array.prototype.forEach.call(buttons, function (btn) {
    btn.addEventListener('click', function () {
      // Remove-then-reflow-then-add restarts the CSS animation even if
      // tapped again before the previous flash finished, rather than the
      // second tap silently doing nothing because the class never changed.
      btn.classList.remove('is-flash');
      void btn.offsetWidth;
      btn.classList.add('is-flash');
    });

    btn.addEventListener('animationend', function () {
      btn.classList.remove('is-flash');
    });
  });
})();


/* ============================================================
   Hover-to-play demo videos
   Falls back to tap-to-toggle where hover doesn't exist.
   ============================================================ */

(function () {
  var videos = document.querySelectorAll('.demo-video');
  if (!videos.length) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  var canHover = window.matchMedia('(hover: hover)').matches;

  Array.prototype.forEach.call(videos, function (v) {
    if (canHover) {
      v.addEventListener('mouseenter', function () {
        v.play().catch(function () {});
      });
      v.addEventListener('mouseleave', function () {
        v.pause();
        v.currentTime = 0;
      });
    } else {
      v.addEventListener('click', function () {
        if (v.paused) {
          v.play().catch(function () {});
        } else {
          v.pause();
        }
      });
    }
  });
})();


/* ============================================================
   Copy email to clipboard
   ============================================================ */

(function () {
  var btn = document.getElementById('copy-email');
  var status = document.getElementById('copy-email-status');
  if (!btn) return;

  var email = 'contact@cesarspace.online';
  var resetTimer;
  var closeFlyoutTimer;

  function showCopied(statusText) {
    btn.classList.add('is-copied');
    if (status) status.textContent = statusText;

    clearTimeout(resetTimer);
    resetTimer = setTimeout(function () {
      btn.classList.remove('is-copied');
    }, 1200);

    // Start closing the header flyout a bit before the checkmark reverts
    // (not at the same instant) — the flyout's own fade takes ~0.15s, and
    // starting both transitions simultaneously let the icon flip back to
    // the plain clipboard shape while still faintly visible through the
    // fade, flashing for a split second. Closing early enough that the
    // flyout is already gone by the time the icon reverts hides that.
    clearTimeout(closeFlyoutTimer);
    closeFlyoutTimer = setTimeout(function () {
      var flyoutControl = btn.closest('.mail-control');
      if (flyoutControl) flyoutControl.classList.remove('is-open');
      btn.blur();
    }, 1000);
  }

  // navigator.clipboard only exists in a secure context (HTTPS or
  // localhost) — this site's custom domain currently only serves over
  // plain HTTP (HTTPS is broken, see CLAUDE.md), so on the deployed site
  // navigator.clipboard is undefined today and writeText() would throw
  // before ever reaching .then(). This fallback (select a hidden textarea,
  // document.execCommand('copy')) works in an insecure context, so copying
  // still works on the live site until the cert issue is fixed — remove it
  // once HTTPS is enforced and navigator.clipboard is reliably available.
  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.top = '0';
    ta.style.left = '0';
    ta.style.opacity = '0';
    ta.style.pointerEvents = 'none';
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, text.length);
    var ok = false;
    try {
      ok = document.execCommand('copy');
    } catch (e) {
      ok = false;
    }
    document.body.removeChild(ta);
    return ok;
  }

  btn.addEventListener('click', function () {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(function () {
        showCopied('Email address copied to clipboard.');
      }, function () {
        if (status) status.textContent = 'Could not copy automatically — email is above.';
      });
      return;
    }

    try {
      if (fallbackCopy(email)) {
        showCopied('Email address copied to clipboard.');
      } else if (status) {
        status.textContent = 'Could not copy automatically — email is above.';
      }
    } catch (e) {
      if (status) status.textContent = 'Could not copy automatically — email is above.';
    }
  });
})();


/* ============================================================
   Scroll-spy nav
   Highlights the nav link for the section currently in view.
   ============================================================ */

(function () {
  var sections = document.querySelectorAll('main section[id]');
  var links = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!sections.length || !links.length || !('IntersectionObserver' in window)) return;

  var linkById = {};
  Array.prototype.forEach.call(links, function (link) {
    linkById[link.getAttribute('href').slice(1)] = link;
  });

  function activate(link) {
    Array.prototype.forEach.call(links, function (l) {
      l.classList.remove('is-active');
    });
    link.classList.add('is-active');
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var link = linkById[entry.target.id];
      if (link && entry.isIntersecting) activate(link);
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  Array.prototype.forEach.call(sections, function (section) {
    observer.observe(section);
  });

  // On short pages the last section's midpoint may never cross the band
  // above, since scrolling runs out before it does. A sentinel at the very
  // end of <main> catches "scrolled to bottom" and forces the last link.
  var sentinel = document.getElementById('scroll-sentinel');
  var lastLink = linkById[sections[sections.length - 1].id];
  if (sentinel && lastLink && 'IntersectionObserver' in window) {
    var bottomObserver = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) activate(lastLink);
    });
    bottomObserver.observe(sentinel);
  }
})();


/* ============================================================
   Back to top
   ============================================================ */

(function () {
  var btn = document.getElementById('back-to-top');
  if (!btn) return;

  var ticking = false;

  function updateVisibility() {
    btn.classList.toggle('is-visible', window.scrollY > 400);
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(updateVisibility);
      ticking = true;
    }
  }, { passive: true });

  btn.addEventListener('click', function () {
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });
})();


/* ============================================================
   Show more (Projects / Certifications)
   Cards beyond the first N are hidden; this reveals them in place
   instead of navigating anywhere. N itself depends on viewport width
   (2 on mobile, 4 at the 768px desktop breakpoint) rather than being
   baked into the markup, since a card that should show by default on
   desktop should still start hidden on a narrow phone screen.
   ============================================================ */

(function () {
  // mobileCount/desktopCount are 2 rows' worth of cards at each grid's
  // column count (projects/skills: 1 col mobile, 2 desktop; certs: 2 col
  // mobile, 3 desktop), not a fixed number shared by every grid.
  function setupExpandable(gridSelector, itemSelector, buttonId, moreLabel, lessLabel, noun, mobileCount, desktopCount) {
    var grid = document.querySelector(gridSelector);
    var btn = document.getElementById(buttonId);
    if (!grid || !btn) return;

    var label = btn.querySelector('.show-more-label');
    var items = Array.prototype.slice.call(grid.querySelectorAll(itemSelector));
    var desktopQuery = window.matchMedia('(min-width: 768px)');
    var expanded = false;

    function collapsedCount() {
      return desktopQuery.matches ? desktopCount : mobileCount;
    }

    function render() {
      var count = collapsedCount();
      var hasExtra = items.length > count;

      items.forEach(function (el, i) {
        el.hidden = !expanded && i >= count;
      });

      btn.hidden = !hasExtra;
      if (!hasExtra) return;

      btn.setAttribute('aria-expanded', String(expanded));
      btn.setAttribute('aria-label', expanded ? lessLabel : moreLabel);
      if (label) label.textContent = (expanded ? 'less ' : 'more ') + noun;
    }

    btn.addEventListener('click', function () {
      expanded = !expanded;
      render();
    });

    // Crossing the 768px breakpoint while still collapsed changes how many
    // cards should be showing — resync in that case. Once expanded, every
    // card is already visible, so there's nothing to do.
    desktopQuery.addEventListener('change', function () {
      if (!expanded) render();
    });

    render();
  }

  setupExpandable('.projects-grid', '.project', 'projects-toggle', 'Show more projects', 'Show fewer projects', 'projects', 2, 4);
  setupExpandable('.certs-grid', '.cert-card', 'certs-toggle', 'Show more certifications', 'Show fewer certifications', 'certs', 4, 6);
})();


/* ============================================================
   Skill list expand
   Same cutoff as the grids above (2 items on mobile, 4 at the
   768px breakpoint), but per skill-group rather than one toggle for
   the whole section, and worded/styled like the .project-desc-toggle
   "read more" buttons instead of the grid-level "Show more" button.
   ============================================================ */

(function () {
  var desktopQuery = window.matchMedia('(min-width: 768px)');
  var groups = [];

  Array.prototype.forEach.call(document.querySelectorAll('.skill-group'), function (group) {
    var list = group.querySelector('.skill-list');
    var toggle = group.querySelector('.skill-toggle');
    if (!list || !toggle) return;

    groups.push({
      items: Array.prototype.slice.call(list.children),
      toggle: toggle,
      label: toggle.querySelector('.show-more-label'),
      expanded: false
    });
  });

  if (!groups.length) return;

  function collapsedCount() {
    return desktopQuery.matches ? 4 : 2;
  }

  function render(g) {
    var count = collapsedCount();
    var hasExtra = g.items.length > count;

    g.items.forEach(function (li, i) {
      li.hidden = !g.expanded && i >= count;
    });

    g.toggle.hidden = !hasExtra;
    if (!hasExtra) return;

    g.toggle.setAttribute('aria-expanded', String(g.expanded));
    if (g.label) g.label.textContent = g.expanded ? 'read less' : 'read more';
  }

  groups.forEach(function (g) {
    g.toggle.addEventListener('click', function () {
      g.expanded = !g.expanded;
      render(g);
    });
    render(g);
  });

  // Crossing the 768px breakpoint while a group is still collapsed changes
  // how many of its items should be showing (2 vs 4) — resync in that
  // case, same as the grid-level toggles above.
  desktopQuery.addEventListener('change', function () {
    groups.forEach(function (g) {
      if (!g.expanded) render(g);
    });
  });
})();


/* ============================================================
   Project description clamp
   Each .project-desc is clamped to 3 lines via CSS; this measures
   whether that clamp actually cut anything off (scrollHeight exceeds
   clientHeight only when content overflows the clamped box) and, if
   so, wires the sibling .project-desc-toggle button to expand/collapse
   it. Short descriptions that never overflow get no button at all.
   ============================================================ */

(function () {
  var pairs = [];

  Array.prototype.forEach.call(document.querySelectorAll('.project-desc'), function (p) {
    var toggle = p.nextElementSibling;
    if (!toggle || !toggle.classList.contains('project-desc-toggle')) return;
    pairs.push({ p: p, toggle: toggle, expanded: false });
  });

  if (!pairs.length) return;

  function measure(pair) {
    if (pair.expanded) return;
    var overflowing = pair.p.scrollHeight - pair.p.clientHeight > 1;
    pair.toggle.hidden = !overflowing;
  }

  function measureAll() {
    pairs.forEach(measure);
  }

  pairs.forEach(function (pair) {
    var label = pair.toggle.querySelector('.show-more-label');

    pair.toggle.addEventListener('click', function () {
      pair.expanded = !pair.expanded;
      pair.p.classList.toggle('is-expanded', pair.expanded);
      pair.toggle.setAttribute('aria-expanded', String(pair.expanded));
      pair.toggle.setAttribute(
        'aria-label',
        pair.expanded ? 'Read less of this project description' : 'Read more of this project description'
      );
      if (label) label.textContent = pair.expanded ? 'read less' : 'read more';

      // Re-measure the ones still collapsed — a card's height changing
      // doesn't reflow any other card's text width, but this stays cheap
      // enough (a handful of cards) that it's not worth special-casing.
      if (!pair.expanded) measureAll();
    });
  });

  measureAll();

  // Card width (and therefore how many lines the full text needs) changes
  // between the 1-col mobile and 2-col desktop layouts, so a resize can
  // flip whether a given description actually overflows 3 lines.
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(measureAll, 150);
  });

  // A card hidden behind the "Show more projects" toggle has no layout box
  // (scrollHeight/clientHeight both read 0), so measuring it while hidden
  // always concludes "not overflowing" and hides its read-more button for
  // good. Re-measure whenever a card's hidden attribute changes, whether
  // that's the show-more toggle revealing it or a resize crossing the
  // breakpoint while it was already showing.
  var hiddenObserver = new MutationObserver(measureAll);
  Array.prototype.forEach.call(document.querySelectorAll('.project'), function (card) {
    hiddenObserver.observe(card, { attributes: true, attributeFilter: ['hidden'] });
  });
})();


/* ============================================================
   Header mail flyout
   Hover reveals the plain-text email address + copy button (the
   trigger is a <button>, not a mailto link — copying is the only
   way to get the address out of the page). A plain CSS :hover
   closes the instant the cursor leaves the trigger's box, which is
   too strict when there's any gap between the icon and the flyout
   below it — the mouse is briefly "outside" everything mid-transit.
   A short close delay (cleared on re-entry) absorbs that instead of
   requiring pixel-perfect mouse geometry. Touch devices get
   tap-to-toggle, since hover doesn't exist there.
   ============================================================ */

(function () {
  var control = document.querySelector('.mail-control');
  var trigger = document.getElementById('mail-trigger');
  var flyout = control ? control.querySelector('.mail-flyout') : null;
  if (!control || !trigger || !flyout) return;

  // The flyout is centered under the icon by default (left: 50% + a CSS
  // translateX(-50%)). That centering overflows off-screen when the icon
  // sits near either edge — the icon is the leftmost header control on
  // narrow layouts, but sits near the right edge of the nav on desktop.
  // Nudge it back on-screen with an extra translateX offset rather than
  // hardcoding a side, since which edge is at risk depends on viewport
  // width and can't be known up front.
  function positionFlyout() {
    flyout.style.transform = 'translateX(-50%)';
    var margin = 8;
    var rect = flyout.getBoundingClientRect();
    var shift = 0;
    if (rect.left < margin) {
      shift = margin - rect.left;
    } else if (rect.right > window.innerWidth - margin) {
      shift = (window.innerWidth - margin) - rect.right;
    }
    if (shift !== 0) {
      flyout.style.transform = 'translateX(calc(-50% + ' + shift + 'px))';
    }
  }

  // :focus-within opens the flyout purely via CSS (keyboard Tab focus),
  // independent of the hover/touch handling below — reposition for that
  // path too, or a keyboard user on a narrow screen gets the same overflow.
  trigger.addEventListener('focus', positionFlyout);

  var canHover = window.matchMedia('(hover: hover)').matches;

  if (canHover) {
    var closeTimer;

    function open() {
      clearTimeout(closeTimer);
      positionFlyout();
      control.classList.add('is-open');
    }

    function scheduleClose() {
      clearTimeout(closeTimer);
      closeTimer = setTimeout(function () {
        control.classList.remove('is-open');
      }, 350);
    }

    control.addEventListener('mouseenter', open);
    control.addEventListener('mouseleave', scheduleClose);

    // On desktop the icon is a pure hover trigger. Clicking a <button>
    // still focuses it, and :focus-within would then keep the flyout stuck
    // open indefinitely (until something else takes focus), ignoring the
    // hover grace period entirely. A real mouse click has event.detail > 0;
    // a keyboard Enter/Space activation has detail === 0, so this only
    // blurs after a genuine mouse click and leaves keyboard activation
    // (and its natural focus behavior) alone.
    trigger.addEventListener('click', function (e) {
      if (e.detail !== 0) {
        trigger.blur();
      }
    });

    return;
  }

  // Tapping the trigger also focuses it, and :focus-within alone would
  // then keep the flyout visible forever regardless of `.is-open` — so
  // every close path here has to blur whatever's focused inside .mail-control,
  // not just toggle the class.
  function closeFlyout() {
    control.classList.remove('is-open');
    if (control.contains(document.activeElement)) {
      document.activeElement.blur();
    }
  }

  trigger.addEventListener('click', function () {
    if (control.classList.contains('is-open')) {
      closeFlyout();
    } else {
      positionFlyout();
      control.classList.add('is-open');
    }
  });

  document.addEventListener('click', function (e) {
    if (!control.contains(e.target)) {
      closeFlyout();
    }
  });

  // There's no "tap elsewhere to dismiss" equivalent for scrolling — left
  // open, the flyout would otherwise ride along indefinitely as the page
  // scrolls underneath the sticky header. Close it the moment scrolling
  // starts instead of waiting for an explicit tap outside it.
  //
  // `scroll` alone visibly lags on iOS Safari: an active touch-scroll runs
  // on the compositor, and it can defer a scroll handler's style changes
  // until the gesture settles, so the flyout stays painted through the
  // whole scroll even though the class was removed right away. `touchmove`
  // fires the instant the finger starts moving, ahead of that deferral, so
  // pairing both is what actually makes it disappear immediately rather
  // than only once scrolling stops.
  window.addEventListener('scroll', closeFlyout, { passive: true });
  window.addEventListener('touchmove', closeFlyout, { passive: true });
})();


/* ============================================================
   Certification badge tooltips
   The whole card is a real <a> now (see the HTML comment above
   .certs-grid in index.html), so touch just navigates on tap with no JS
   involved — .cert-badge-icon in the CSS is the tap affordance there.
   This only handles the desktop extra: a "Verify with Credly" tooltip
   that tracks the cursor and is visible only between mouseenter and
   mouseleave, no grace period — unlike the mail flyout above, there's no
   gap to cross into, since the tooltip is purely a label, not something
   you move the mouse into and interact with.
   ============================================================ */

(function () {
  var cards = document.querySelectorAll('.cert-card');
  if (!cards.length) return;

  // Blurring after a genuine click prevents :focus-within from leaving the
  // flyout visibly stuck open once the card's real link has navigated
  // away — target="_blank" keeps this tab's focus on the trigger even
  // though the click opened a new tab, so without this, switching back to
  // this tab later would show the tooltip parked open on whichever card
  // was last clicked. Same event.detail check as the mail trigger above:
  // only a genuine click has detail !== 0, so keyboard activation (Enter/
  // Space, detail === 0) is left alone and still opens the flyout normally
  // via :focus-within. This applies regardless of hover capability.
  Array.prototype.forEach.call(cards, function (card) {
    var trigger = card.querySelector('.cert-badge-trigger');
    if (!trigger) return;
    trigger.addEventListener('click', function (e) {
      if (e.detail !== 0) trigger.blur();
    });
  });

  // Nothing below this point applies on touch — there's no cursor to
  // track, and the link already works without it.
  if (!window.matchMedia('(hover: hover)').matches) return;

  function positionAtCursor(flyout, x, y) {
    var offset = 16;
    var margin = 8;
    var left = x + offset;
    var top = y + offset;
    if (left + flyout.offsetWidth > window.innerWidth - margin) {
      left = x - flyout.offsetWidth - offset;
    }
    if (top + flyout.offsetHeight > window.innerHeight - margin) {
      top = y - flyout.offsetHeight - offset;
    }
    flyout.style.left = left + 'px';
    flyout.style.top = top + 'px';
  }

  // The tooltip tracks the raw cursor position (position: fixed), not the
  // card underneath it — scrolling moves the card but not a stationary
  // cursor, so without this the tooltip would stay planted mid-scroll,
  // visibly drifting away from the card it's meant to label. Closing it
  // the moment scrolling starts is simpler than re-positioning it relative
  // to a card whose relationship to the cursor no longer means anything
  // once the page has moved underneath. Tracked as pairs rather than
  // re-querying the DOM so a scroll with several tooltips mid-fade (not
  // possible today, one hover at a time, but cheap to keep correct) closes
  // all of them.
  var open = [];

  function closeAll() {
    for (var i = 0; i < open.length; i++) {
      open[i].card.classList.remove('is-open', 'is-following');
      open[i].flyout.style.left = '';
      open[i].flyout.style.top = '';
    }
    open = [];
  }

  window.addEventListener('scroll', closeAll, { passive: true });
  window.addEventListener('touchmove', closeAll, { passive: true });

  Array.prototype.forEach.call(cards, function (card) {
    var flyout = card.querySelector('.cert-verify-flyout');
    if (!flyout) return;

    card.addEventListener('mouseenter', function (e) {
      card.classList.add('is-open', 'is-following');
      positionAtCursor(flyout, e.clientX, e.clientY);
      open.push({ card: card, flyout: flyout });
    });

    card.addEventListener('mousemove', function (e) {
      positionAtCursor(flyout, e.clientX, e.clientY);
    });

    card.addEventListener('mouseleave', function () {
      card.classList.remove('is-open', 'is-following');
      flyout.style.left = '';
      flyout.style.top = '';
      open = open.filter(function (entry) { return entry.card !== card; });
    });
  });
})();


/* ============================================================
   Resume print button (resume.html only)
   Printing the outer page would print the site header/toolbar along
   with it; calling print() on the (same-origin) iframe's own window
   instead prints just the embedded PDF, through the browser's native
   PDF print flow.
   ============================================================ */

(function () {
  var printBtn = document.getElementById('resume-print');
  var frame = document.getElementById('resume-frame');
  if (!printBtn || !frame) return;

  printBtn.addEventListener('click', function () {
    try {
      frame.contentWindow.focus();
      frame.contentWindow.print();
    } catch (e) {
      window.open(frame.getAttribute('src'), '_blank');
    }
  });
})();