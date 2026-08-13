(function () {
  var toggle = document.getElementById('navToggle');
  var closeBtn = document.getElementById('navClose');
  var nav = document.getElementById('primaryNav');

  function closeNav() {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function openNav() {
    nav.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  toggle.addEventListener('click', function () {
    if (nav.classList.contains('open')) closeNav(); else openNav();
  });
  closeBtn.addEventListener('click', closeNav);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeNav();
  });

  var links = Array.prototype.slice.call(nav.querySelectorAll('a'));
  links.forEach(function (link) {
    link.addEventListener('click', closeNav);
  });

  var sections = links
    .map(function (link) { return document.querySelector(link.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var link = nav.querySelector('a[href="#' + entry.target.id + '"]');
          if (!link) return;
          if (entry.isIntersecting) {
            links.forEach(function (l) { l.classList.remove('active'); });
            link.classList.add('active');
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );
    sections.forEach(function (s) { observer.observe(s); });
  }

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;

  /* Custom cursor — an arrow whose tip trails the pointer with a soft lag and whose
     body rotates to face the direction of travel. Plain rAF loop, no library.
     Desktop mouse only, off for touch/reduced-motion. */
  if (finePointer && !reduceMotion) {
    var arrow = document.getElementById('cursorArrow');
    document.documentElement.classList.add('cursor-active');

    var mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    var curX = mouseX, curY = mouseY;
    var lastX = mouseX, lastY = mouseY;
    var rotation = 0, targetRotation = 0;

    var POS_EASE = 0.08;   /* lower = laggier follow */
    var ROT_EASE = 0.12;   /* lower = slower turn */

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;

      var dx = mouseX - lastX, dy = mouseY - lastY;
      if (Math.hypot(dx, dy) > 2) {
        targetRotation = Math.atan2(dy, dx) * 180 / Math.PI + 90;
        lastX = mouseX; lastY = mouseY;
      }
    });

    (function tick() {
      curX += (mouseX - curX) * POS_EASE;
      curY += (mouseY - curY) * POS_EASE;

      var diff = ((targetRotation - rotation + 540) % 360) - 180;
      rotation += diff * ROT_EASE;

      arrow.style.transform = 'translate(' + curX + 'px,' + curY + 'px) rotate(' + rotation + 'deg)';
      requestAnimationFrame(tick);
    })();

    var hoverTargets = 'a, button, .gallery figure, .hero-media';
    document.addEventListener('mouseover', function (e) {
      if (e.target.closest(hoverTargets)) {
        document.documentElement.setAttribute('data-cursor', 'hover');
      }
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest(hoverTargets)) {
        document.documentElement.removeAttribute('data-cursor');
      }
    });
  }
})();
