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

  btn.addEventListener('click', function () {
    try {
      navigator.clipboard.writeText(email).then(function () {
        showCopied('Email address copied to clipboard.');
      }, function () {
        if (status) status.textContent = 'Could not copy automatically — email is above.';
      });
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
   Cards beyond the first N ship with the `hidden` attribute; this
   reveals them in place instead of navigating anywhere.
   ============================================================ */

(function () {
  function setupExpandable(gridSelector, itemSelector, buttonId, moreLabel, lessLabel) {
    var grid = document.querySelector(gridSelector);
    var btn = document.getElementById(buttonId);
    if (!grid || !btn) return;

    var label = btn.querySelector('.show-more-label');

    var extraItems = Array.prototype.filter.call(
      grid.querySelectorAll(itemSelector),
      function (el) { return el.hasAttribute('hidden'); }
    );

    if (!extraItems.length) {
      btn.hidden = true;
      return;
    }

    btn.addEventListener('click', function () {
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      extraItems.forEach(function (el) {
        el.hidden = expanded;
      });
      btn.setAttribute('aria-expanded', String(!expanded));
      btn.setAttribute('aria-label', expanded ? moreLabel : lessLabel);
      if (label) label.textContent = expanded ? 'more' : 'less';
    });
  }

  setupExpandable('.projects-grid', '.project', 'projects-toggle', 'Show more projects', 'Show fewer projects');
  setupExpandable('.certs-grid', '.cert-card', 'certs-toggle', 'Show more certifications', 'Show fewer certifications');
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