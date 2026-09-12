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

  var email = 'cvportfolio.gray652@passmail.net';
  var resetTimer;

  function showCopied(statusText) {
    btn.classList.add('is-copied');
    if (status) status.textContent = statusText;
    clearTimeout(resetTimer);
    resetTimer = setTimeout(function () {
      btn.classList.remove('is-copied');
    }, 1200);
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