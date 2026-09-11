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