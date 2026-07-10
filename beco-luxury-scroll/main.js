/* BECO — i18n rendering, language/RTL toggle, GSAP ScrollTrigger wiring,
   the diagonal departments carousel, reel parallax, per-section entry/exit,
   and the enquiry form. */
(function () {
  'use strict';

  var I18N = window.BECO_I18N;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var currentLang = 'en';

  /* sparse hand-drawn doodle accents — personality, not product representation */
  var DOODLES = [
    '<svg viewBox="0 0 48 48"><path d="M24 6 L27 20 L41 24 L27 28 L24 42 L21 28 L7 24 L21 20 Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
    '<svg viewBox="0 0 48 48"><path d="M8 26 C 8 12, 40 10, 39 25 C 38 39, 12 40, 9 30" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 48 48"><path d="M6 30 C 16 10, 30 10, 40 18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M31 12 L40 18 L33 26" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    '<svg viewBox="0 0 48 48"><path d="M5 24 Q 12 14, 19 24 T 33 24 T 44 22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'
  ];

  function pathGet(obj, path) {
    return path.split('.').reduce(function (o, k) { return o == null ? o : o[k]; }, obj);
  }

  function applyStaticText(data) {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var val = key === 'toggleLabel' ? data.toggleLabel : pathGet(data, key);
      if (val != null) el.innerHTML = val;
    });
  }

  /* ---------- departments carousel (real rendered product shots, not icons) ---------- */
  function renderCarousel(data) {
    var track = document.getElementById('carouselTrack');
    track.innerHTML = '';
    var shots = window.BECO_PRODUCT_SHOTS || {};
    data.specialities.items.forEach(function (item, i) {
      var card = document.createElement('div');
      card.className = 'card';
      var img = shots[item.key] || '';
      card.innerHTML =
        '<div class="card__frame">' +
          (img ? '<img src="' + img + '" alt="' + item.name + '" loading="lazy" />' : '') +
          '<span class="card__doodle">' + DOODLES[i % DOODLES.length] + '</span>' +
        '</div>' +
        '<span class="card__name">' + item.name + '</span>' +
        '<span class="card__ar">' + item.ar + '</span>' +
        '<span class="card__desc">' + item.desc + '</span>';
      track.appendChild(card);
    });
  }

  function renderStats(data) {
    var wrap = document.getElementById('stats');
    wrap.innerHTML = '';
    data.craft.stats.forEach(function (s) {
      var div = document.createElement('div');
      div.className = 'stat';
      div.innerHTML =
        '<span class="stat__num">' + s.num + '</span>' +
        (s.unit ? '<span class="stat__unit">' + s.unit + '</span>' : '') +
        '<span class="stat__label">' + s.label + '</span>';
      wrap.appendChild(div);
    });
  }

  function renderProjectTypes(data) {
    var sel = document.getElementById('projectType');
    sel.innerHTML = '';
    data.cta.types.forEach(function (t) {
      var opt = document.createElement('option');
      opt.textContent = t;
      opt.value = t;
      sel.appendChild(opt);
    });
  }

  function applyLanguage(lang) {
    currentLang = lang;
    var data = I18N[lang];
    document.documentElement.lang = data.lang;
    document.documentElement.dir = data.dir;
    applyStaticText(data);
    renderCarousel(data);
    renderStats(data);
    renderProjectTypes(data);
    var wa = document.getElementById('whatsappLink');
    var msg = lang === 'ar'
      ? 'مرحباً بيكو، أرغب في الاستفسار عن مشروع.'
      : "Hello BECO, I'd like to enquire about a project.";
    wa.href = 'https://wa.me/971557412142?text=' + encodeURIComponent(msg);
    try { localStorage.setItem('beco-lang', lang); } catch (e) {}
  }

  var langToggle = document.getElementById('langToggle');
  langToggle.addEventListener('click', function () {
    applyLanguage(currentLang === 'en' ? 'ar' : 'en');
  });

  var startLang = 'en';
  try { startLang = localStorage.getItem('beco-lang') || 'en'; } catch (e) {}
  applyLanguage(startLang);

  /* ---------- nav scroll state ---------- */
  var nav = document.getElementById('nav');
  function onScroll() { nav.classList.toggle('is-scrolled', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- hero: GSAP ScrollTrigger drives the 3D scrub ---------- */
  var hero = window.BECO_HERO || { update: function () {} };
  function paintHero(progress) { hero.update(progress); }

  var hasGSAP = !!(window.gsap && window.ScrollTrigger);
  if (hasGSAP) gsap.registerPlugin(ScrollTrigger);

  if (hasGSAP && !reduceMotion) {
    /* staged entrance for the title/eyebrow/sub/actions, independent of scrub */
    gsap.set(['.eyebrow', '.hero__sub', '.hero__actions', '.hero__foot'], { opacity: 0, y: 18 });
    gsap.set('.hero__line', { opacity: 0, y: '105%' });
    var intro = gsap.timeline({ delay: 0.15 });
    intro.to('.hero__line', { opacity: 1, y: '0%', duration: 1, stagger: 0.12, ease: 'power3.out' })
      .to('.eyebrow', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 0.25)
      .to('.hero__sub', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 0.4)
      .to('.hero__actions', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 0.5)
      .to('.hero__foot', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 0.65);

    ScrollTrigger.matchMedia({
      '(min-width: 900px)': function () {
        ScrollTrigger.create({
          trigger: '#heroPin', start: 'top top', end: '+=220%',
          pin: true, scrub: true, anticipatePin: 1,
          onUpdate: function (self) { paintHero(self.progress); }
        });
      },
      '(max-width: 899px)': function () {
        ScrollTrigger.create({
          trigger: '#heroPin', start: 'top top', end: '+=120%',
          pin: true, scrub: true, anticipatePin: 1,
          onUpdate: function (self) { paintHero(self.progress); }
        });
      }
    });
  } else {
    document.querySelectorAll('.hero__line, .eyebrow, .hero__sub, .hero__actions, .hero__foot')
      .forEach(function (el) { el.style.opacity = '1'; el.style.transform = 'none'; });
    paintHero(0.55);
  }

  /* ---------- reel: parallax fragments + entry for its copy (all transform/opacity, one ScrollTrigger per layer) ---------- */
  if (hasGSAP && !reduceMotion) {
    document.querySelectorAll('.reel__frag').forEach(function (frag) {
      var speed = parseFloat(frag.getAttribute('data-speed')) || 0.4;
      gsap.to(frag, {
        yPercent: -28 * speed,
        ease: 'none',
        scrollTrigger: { trigger: '#reel', start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });
    gsap.fromTo('.reel__copy', { opacity: 0, y: 26 }, {
      opacity: 1, y: 0, duration: 0.9, ease: 'power2.out',
      scrollTrigger: { trigger: '#reel', start: 'top 65%', toggleActions: 'play reverse play reverse' }
    });
    gsap.fromTo('.reel__doodle', { opacity: 0, scale: 0.7, rotate: -10 }, {
      opacity: 0.75, scale: 1, rotate: 0, duration: 0.8, ease: 'back.out(1.6)',
      scrollTrigger: { trigger: '#reel', start: 'top 55%', toggleActions: 'play reverse play reverse' }
    });
  }

  /* ---------- diagonal scroll carousel: track drifts on an angled axis as the section scrolls ---------- */
  if (hasGSAP && !reduceMotion) {
    ScrollTrigger.matchMedia({
      '(min-width: 700px)': function () {
        gsap.to('#carouselTrack', {
          x: function () {
            var track = document.getElementById('carouselTrack');
            var wrap = document.getElementById('carousel');
            return -(Math.max(0, track.scrollWidth - wrap.clientWidth + 80));
          },
          y: -46,
          rotate: -1.1,
          ease: 'none',
          scrollTrigger: { trigger: '#specialities', start: 'top 80%', end: 'bottom top', scrub: 0.4 }
        });
      },
      '(max-width: 699px)': function () {
        gsap.to('#carouselTrack', {
          x: function () {
            var track = document.getElementById('carouselTrack');
            var wrap = document.getElementById('carousel');
            return -(Math.max(0, track.scrollWidth - wrap.clientWidth + 40));
          },
          ease: 'none',
          scrollTrigger: { trigger: '#specialities', start: 'top 85%', end: 'bottom top', scrub: 0.4 }
        });
      }
    });
  } else if (hasGSAP) {
    /* reduced motion: let it scroll horizontally by touch/drag instead of scroll-jacking */
    document.getElementById('carousel').style.overflowX = 'auto';
  }

  /* ---------- entry + exit for everything else: distinct motion per section, reversible both ways ---------- */
  function revealPass(selector, from, opts) {
    if (!hasGSAP || reduceMotion) return;
    document.querySelectorAll(selector).forEach(function (el) {
      gsap.set(el, from);
      ScrollTrigger.create({
        trigger: el, start: 'top 85%', end: 'bottom 10%',
        onEnter: function () { gsap.to(el, Object.assign({ duration: 0.8, ease: 'power2.out' }, opts)); },
        onLeave: function () { gsap.to(el, { opacity: from.opacity, x: from.x || 0, y: from.y || 0, scale: from.scale || 1, duration: 0.6, ease: 'power1.in' }); },
        onEnterBack: function () { gsap.to(el, Object.assign({ duration: 0.7, ease: 'power2.out' }, opts)); },
        onLeaveBack: function () { gsap.to(el, { opacity: from.opacity, x: from.x || 0, y: from.y || 0, scale: from.scale || 1, duration: 0.6, ease: 'power1.in' }); }
      });
    });
  }
  revealPass('.specialities__head', { opacity: 0, y: 34 }, { opacity: 1, y: 0 });
  revealPass('.craft__copy', { opacity: 0, x: -30 }, { opacity: 1, x: 0 });
  revealPass('.craft__stats', { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1 });
  revealPass('.enquire__copy', { opacity: 0, x: -30 }, { opacity: 1, x: 0 });
  revealPass('.enquire__form', { opacity: 0, x: 30 }, { opacity: 1, x: 0 });

  if (hasGSAP && !reduceMotion) {
    document.querySelectorAll('.card').forEach(function (card, i) {
      var fromX = i % 2 === 0 ? -24 : 24;
      gsap.fromTo(card, { opacity: 0, x: fromX, rotate: fromX > 0 ? 3 : -3 },
        { opacity: 1, x: 0, rotate: 0, duration: 0.7, ease: 'power2.out', delay: i * 0.06,
          scrollTrigger: { trigger: card, start: 'top 90%', toggleActions: 'play reverse play reverse' } });
    });
  }

  /* fallback for browsers without GSAP: show everything, no motion */
  if (!hasGSAP) {
    document.querySelectorAll('[data-reveal], .card').forEach(function (el) {
      el.style.opacity = '1'; el.style.transform = 'none';
    });
  }

  /* ---------- enquiry form (static demo: hands off to WhatsApp) ---------- */
  var form = document.getElementById('enquireForm');
  var note = document.getElementById('formNote');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var data = new FormData(form);
    var lang = currentLang;
    var lines = lang === 'ar'
      ? ['طلب من الموقع:', 'الاسم: ' + data.get('name'), 'الهاتف: ' + data.get('phone'),
         'نوع المشروع: ' + data.get('type'), 'الرسالة: ' + (data.get('message') || '—')]
      : ['Website enquiry:', 'Name: ' + data.get('name'), 'Phone: ' + data.get('phone'),
         'Project type: ' + data.get('type'), 'Message: ' + (data.get('message') || '—')];
    note.textContent = lang === 'ar'
      ? 'جارٍ تحويلك إلى واتساب…'
      : 'Opening WhatsApp to send your enquiry…';
    window.open('https://wa.me/971557412142?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
  });
})();
