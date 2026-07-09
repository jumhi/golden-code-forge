/* ALBASTRO — interactions: nav state, mobile menu, reveals, counters. */
(function () {
  'use strict';

  /* staged hero entrance */
  window.addEventListener('load', function () {
    requestAnimationFrame(function () {
      document.body.classList.add('is-loaded');
    });
  });
  /* fallback if load already fired or hangs on slow assets */
  setTimeout(function () { document.body.classList.add('is-loaded'); }, 1800);

  /* nav scroll state */
  var nav = document.getElementById('nav');
  function onScroll() {
    nav.classList.toggle('is-scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* mobile menu */
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('mobileMenu');
  function closeMenu() {
    menu.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    document.body.style.overflow = '';
  }
  toggle.addEventListener('click', function () {
    var open = menu.hidden;
    menu.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  });
  menu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });

  /* scroll reveals */
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.classList.add('is-in');
        revealObserver.unobserve(en.target);
      }
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('[data-reveal]').forEach(function (el) {
    revealObserver.observe(el);
  });

  /* animated counters */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function runCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (reduceMotion) { el.textContent = target.toLocaleString('en'); return; }
    var dur = 1500;
    var t0 = null;
    function step(ts) {
      if (t0 === null) t0 = ts;
      var k = Math.min((ts - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(target * eased).toLocaleString('en');
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        runCounter(en.target);
        counterObserver.unobserve(en.target);
      }
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach(function (el) {
    counterObserver.observe(el);
  });

  /* footer year */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
