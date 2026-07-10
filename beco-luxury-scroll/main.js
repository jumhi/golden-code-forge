/* BECO — i18n rendering, language/RTL toggle, GSAP ScrollTrigger wiring,
   reveals, and the enquiry form. */
(function () {
  'use strict';

  var I18N = window.BECO_I18N;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var currentLang = 'en';

  /* ---------- icons for the four pillars (match the storefront sign) ---------- */
  var PILLAR_ICONS = {
    Marble: '<svg viewBox="0 0 64 64"><polygon points="13,52 21,12 51,12 43,52" fill="currentColor" opacity="0.16"/><path d="M13 52 21 12 51 12 43 52Z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M25 16 Q34 30 28 48 M35 14 Q46 28 41 50" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.7"/></svg>',
    Ceramic: '<svg viewBox="0 0 64 64"><g transform="rotate(-6 32 32)"><rect x="12" y="12" width="18" height="18" fill="currentColor" opacity="0.85"/><rect x="34" y="12" width="18" height="18" fill="currentColor" opacity="0.25"/><rect x="12" y="34" width="18" height="18" fill="currentColor" opacity="0.45"/><rect x="34" y="34" width="18" height="18" fill="currentColor" opacity="0.85"/></g></svg>',
    'Sanitary Ware': '<svg viewBox="0 0 64 64"><path d="M14 27 Q14 44 32 44 Q50 44 50 27" fill="none" stroke="currentColor" stroke-width="1.8"/><ellipse cx="32" cy="27" rx="18" ry="4.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M32 13 L32 6 L42 6 L42 11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="24" y1="50" x2="40" y2="50" stroke="currentColor" stroke-width="1.8"/></svg>',
    Cabinets: '<svg viewBox="0 0 64 64"><rect x="10" y="20" width="44" height="30" fill="none" stroke="currentColor" stroke-width="1.8"/><line x1="32" y1="20" x2="32" y2="50" stroke="currentColor" stroke-width="1.4"/><rect x="27" y="32" width="2.4" height="9" fill="currentColor"/><rect x="34.6" y="32" width="2.4" height="9" fill="currentColor"/></svg>'
  };
  PILLAR_ICONS['رخام'] = PILLAR_ICONS.Marble;
  PILLAR_ICONS['سيراميك'] = PILLAR_ICONS.Ceramic;
  PILLAR_ICONS['أدوات صحية'] = PILLAR_ICONS['Sanitary Ware'];
  PILLAR_ICONS['خزائن'] = PILLAR_ICONS.Cabinets;

  function pathGet(obj, path) {
    return path.split('.').reduce(function (o, k) { return o == null ? o : o[k]; }, obj);
  }

  /* ---------- scroll reveals (declared early — render functions below use this) ---------- */
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.classList.add('is-in');
        revealObserver.unobserve(en.target);
      }
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
  function observeReveal(nodeList) {
    nodeList.forEach(function (el) { revealObserver.observe(el); });
  }

  function applyStaticText(data) {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var val = key === 'toggleLabel' ? data.toggleLabel : pathGet(data, key);
      if (val != null) el.innerHTML = val;
    });
  }

  function renderPillars(data) {
    var ul = document.getElementById('pillars');
    ul.innerHTML = '';
    data.specialities.items.forEach(function (item) {
      var li = document.createElement('li');
      li.className = 'pillar';
      li.setAttribute('data-reveal', '');
      var icon = PILLAR_ICONS[item.name] || '';
      li.innerHTML =
        '<span class="pillar__icon">' + icon + '</span>' +
        '<span class="pillar__name">' + item.name + '</span>' +
        '<span class="pillar__ar">' + item.ar + '</span>' +
        '<span class="pillar__desc">' + item.desc + '</span>';
      ul.appendChild(li);
    });
    observeReveal(ul.querySelectorAll('.pillar'));
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
    renderPillars(data);
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

  observeReveal(document.querySelectorAll('.specialities__head, .craft__copy, .craft__stats, .enquire__copy, .enquire__form'));

  /* ---------- hero: GSAP ScrollTrigger drives the 3D scrub ---------- */
  var hero = window.BECO_HERO || { update: function () {} };

  function paintHero(progress) {
    hero.update(progress);
  }

  if (window.gsap && window.ScrollTrigger && !reduceMotion) {
    gsap.registerPlugin(ScrollTrigger);

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
    /* reduced motion / no GSAP: show a settled mid-scene frame, no pin */
    document.querySelectorAll('.hero__line, .eyebrow, .hero__sub, .hero__actions, .hero__foot')
      .forEach(function (el) { el.style.opacity = '1'; el.style.transform = 'none'; });
    paintHero(0.55);
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
