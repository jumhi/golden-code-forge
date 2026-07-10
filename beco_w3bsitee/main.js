/* BECO — interactions: loader, skeletons, nav state, mobile menu, reveals, counters. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* loader: spin the BECO mark until the page has loaded, then reveal.
     Full ceremony on the first visit; quick fade on repeat visits. */
  var loader = document.getElementById('loader');
  var firstVisit = true;
  try {
    firstVisit = !sessionStorage.getItem('beco-seen');
    sessionStorage.setItem('beco-seen', '1');
  } catch (e) { /* storage unavailable — treat as first visit */ }

  var minShow = reduceMotion ? 250 : (firstVisit ? 1900 : 350);
  var shownAt = Date.now();
  var revealed = false;

  function reveal() {
    if (revealed) return;
    revealed = true;
    loader.classList.add('is-done');
    requestAnimationFrame(function () {
      document.body.classList.add('is-loaded');
    });
    /* skeletons resolve in a stagger once the page is in */
    var skeletons = Array.prototype.slice.call(document.querySelectorAll('.skeleton'));
    skeletons.forEach(function (el, i) {
      setTimeout(function () { el.classList.add('is-ready'); }, 350 + i * 140);
    });
    setTimeout(function () { loader.remove(); }, 900);
  }
  function scheduleReveal() {
    var wait = Math.max(0, minShow - (Date.now() - shownAt));
    setTimeout(reveal, wait);
  }
  if (document.readyState === 'complete') {
    scheduleReveal();
  } else {
    window.addEventListener('load', scheduleReveal);
  }
  /* fallback if load hangs on slow assets */
  setTimeout(reveal, 5000);

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
  function formatCount(value, decimals) {
    return decimals > 0
      ? value.toFixed(decimals)
      : Math.round(value).toLocaleString('en');
  }
  function runCounter(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    if (reduceMotion) { el.textContent = formatCount(target, decimals); return; }
    var dur = 1500;
    var t0 = null;
    function step(ts) {
      if (t0 === null) t0 = ts;
      var k = Math.min((ts - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - k, 3);
      el.textContent = formatCount(target * eased, decimals);
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
