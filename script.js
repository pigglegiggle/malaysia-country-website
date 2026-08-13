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

  /* Custom cursor — an arrow whose tip tracks the pointer and whose body rotates
     to face the direction of travel. Desktop mouse only, off for touch/reduced-motion. */
  if (finePointer && !reduceMotion) {
    var arrow = document.getElementById('cursorArrow');
    document.documentElement.classList.add('cursor-active');

    var lastX = null, lastY = null, rotation = 0;
    var moveX, moveY, rotateTo;

    if (window.gsap) {
      moveX = gsap.quickTo(arrow, 'x', { duration: 0.15, ease: 'power2.out' });
      moveY = gsap.quickTo(arrow, 'y', { duration: 0.15, ease: 'power2.out' });
      rotateTo = gsap.quickTo(arrow, 'rotation', { duration: 0.35, ease: 'power3.out' });
    }

    document.addEventListener('mousemove', function (e) {
      var x = e.clientX, y = e.clientY;

      if (lastX !== null) {
        var dx = x - lastX, dy = y - lastY;
        if (Math.hypot(dx, dy) > 2) {
          var target = Math.atan2(dy, dx) * 180 / Math.PI + 90;
          var diff = ((target - rotation + 540) % 360) - 180;
          rotation += diff;
          if (rotateTo) rotateTo(rotation);
        }
      }
      lastX = x; lastY = y;

      if (moveX) {
        moveX(x); moveY(y);
      } else {
        arrow.style.transform = 'translate(' + x + 'px,' + y + 'px) rotate(' + rotation + 'deg)';
      }
    });

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

  /* GSAP scroll reveal + hero entrance — no-op if GSAP failed to load or user prefers reduced motion */
  if (window.gsap && !reduceMotion) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from('.eyebrow, .hero h1, .hero-lede, .hero-actions', {
      opacity: 0,
      y: 24,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power2.out'
    });
    gsap.from('.hero-media', {
      opacity: 0,
      y: 24,
      duration: 0.8,
      delay: 0.15,
      ease: 'power2.out'
    });

    document.querySelectorAll('.topic').forEach(function (topic) {
      var text = topic.querySelector('.topic-text');
      var media = topic.querySelector('.topic-media');
      gsap.from([text, media], {
        opacity: 0,
        y: 32,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: { trigger: topic, start: 'top 78%' }
      });
      var figs = topic.querySelectorAll('.gallery figure');
      if (figs.length) {
        gsap.from(figs, {
          opacity: 0,
          y: 20,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: { trigger: topic, start: 'top 70%' }
        });
      }
    });
  }
})();
