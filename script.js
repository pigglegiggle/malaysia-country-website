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
})();
