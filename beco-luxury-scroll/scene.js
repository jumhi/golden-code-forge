/* BECO — hero scene: a vessel sink and its wall-mounted faucet, floating on
   a slim marble ledge under three warm ceiling spots. On scroll the sink
   comes apart at its real seams — bowl lifts and turns, faucet swings off
   the wall, drain flange spins free — arcing outward, holding, then
   settling back home slower than they came apart. Vanilla three.js.

   This does NOT run a render loop. `window.BECO_HERO.update(progress)` is
   the only thing that redraws a frame — GSAP ScrollTrigger calls it with
   the scroll progress (0..1), so every part's position is a pure function
   of scroll: it freezes exactly when the user stops scrolling, and the
   "explode" and "reattach" both happen while they scroll, never on a
   clock. Background is transparent — the real showroom photo behind the
   canvas (CSS Ken Burns) is the backdrop now, not a modelled slab. */
(function () {
  var canvas = document.getElementById('scene');
  if (!canvas || typeof THREE === 'undefined') {
    window.BECO_HERO = { update: function () {}, ready: false };
    return;
  }

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas: canvas, antialias: true, alpha: true, powerPreference: 'low-power'
    });
  } catch (e) {
    canvas.style.display = 'none';
    window.BECO_HERO = { update: function () {}, ready: false };
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(36, 1, 0.1, 60);

  /* ---------- small book-matched marble swatch (ledge only — no big backdrop) ---------- */
  function makeMarbleTexture(size) {
    var w = size, h = size;
    var c = document.createElement('canvas');
    c.width = w; c.height = h;
    var g = c.getContext('2d');
    g.fillStyle = '#d8c9a9';
    g.fillRect(0, 0, w, h);
    var half = w / 2;
    function vein(x0, y0, x1, y1, x2, y2, width, color, alpha) {
      g.strokeStyle = color; g.globalAlpha = alpha; g.lineWidth = width; g.lineCap = 'round';
      g.beginPath(); g.moveTo(x0, y0); g.quadraticCurveTo(x1, y1, x2, y2); g.stroke();
    }
    var rand = (function seeded(s) {
      return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
    })(42);
    for (var i = 0; i < 16; i++) {
      var y0 = rand() * h, y2 = y0 + (rand() - 0.5) * (h * 0.35);
      var xm = half * rand(), ym = (y0 + y2) / 2 + (rand() - 0.5) * (h * 0.22);
      vein(-20, y0, xm, ym, half + 15, y2, 1.2 + rand() * 2.6,
        rand() > 0.4 ? '#a9793a' : '#8f6f52', 0.35 + rand() * 0.4);
    }
    g.save(); g.translate(w, 0); g.scale(-1, 1);
    g.drawImage(c, 0, 0, half, h, half, 0, half, h); g.restore();
    var tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }
  var marbleTex = makeMarbleTexture(384);

  function glowSpriteTexture() {
    var c = document.createElement('canvas');
    c.width = 128; c.height = 128;
    var g = c.getContext('2d');
    var r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    r.addColorStop(0, 'rgba(255, 214, 150, 0.95)');
    r.addColorStop(0.4, 'rgba(255, 180, 110, 0.35)');
    r.addColorStop(1, 'rgba(255, 180, 110, 0)');
    g.fillStyle = r; g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }
  var glowTex = glowSpriteTexture();

  /* ---------- materials ---------- */
  var marble = new THREE.MeshPhysicalMaterial({
    map: marbleTex, roughness: 0.28, clearcoat: 0.5, clearcoatRoughness: 0.3
  });
  var porcelain = new THREE.MeshPhysicalMaterial({
    color: 0xf4f1ea, roughness: 0.16, clearcoat: 1, clearcoatRoughness: 0.1
  });
  var porcelainInner = new THREE.MeshPhysicalMaterial({
    color: 0xe9e4d8, roughness: 0.22, clearcoat: 0.8, clearcoatRoughness: 0.2, side: THREE.BackSide
  });
  var brass = new THREE.MeshStandardMaterial({ color: 0xc9a35c, roughness: 0.24, metalness: 1.0 });
  var brassDark = new THREE.MeshStandardMaterial({ color: 0x8a6f42, roughness: 0.34, metalness: 1.0 });

  var group = new THREE.Group();
  scene.add(group);

  /* slim marble ledge — the one fixed anchor everything else comes apart from */
  var shelf = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.1, 0.56), marble);
  shelf.position.set(0, -0.05, 0.05);
  group.add(shelf);

  /* ---------- bowl (its own pivot, so rotation reads as "lifting and turning") ---------- */
  var bowlPivot = new THREE.Group();
  bowlPivot.position.set(-0.4, 0.02, 0.14);
  group.add(bowlPivot);
  var bowlProfile = [
    [0.00, 0.00], [0.30, 0.00], [0.42, 0.015], [0.56, 0.06],
    [0.70, 0.15], [0.80, 0.28], [0.865, 0.40], [0.885, 0.475], [0.89, 0.50],
    [0.86, 0.51], [0.83, 0.505],
    [0.78, 0.45], [0.66, 0.33], [0.50, 0.225], [0.29, 0.16], [0.00, 0.145]
  ].map(function (p) { return new THREE.Vector2(p[0], p[1]); });
  var bowl = new THREE.Mesh(new THREE.LatheGeometry(bowlProfile, 72), porcelain);
  bowl.scale.set(1, 1, 0.86);
  bowlPivot.add(bowl);
  var bowlInner = new THREE.Mesh(new THREE.LatheGeometry(bowlProfile, 72), porcelainInner);
  bowlInner.scale.set(0.965, 0.97, 0.83);
  bowlPivot.add(bowlInner);

  /* ---------- drain flange — small part, spins free while it's out ---------- */
  var drainPivot = new THREE.Group();
  drainPivot.position.set(-0.4, 0.05, 0.14);
  group.add(drainPivot);
  var drainRing = new THREE.Mesh(new THREE.TorusGeometry(0.052, 0.012, 10, 24), brass);
  drainRing.rotation.x = Math.PI / 2;
  drainPivot.add(drainRing);
  var drainCap = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.016, 20), brassDark);
  drainPivot.add(drainCap);

  /* ---------- wall-mounted faucet — pivots at the wall attachment point ---------- */
  var faucetPivot = new THREE.Group();
  faucetPivot.position.set(-0.4, 0.72, -0.28);
  group.add(faucetPivot);
  var stem = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.66, 18), brass);
  stem.position.set(0, -0.33, 0);
  faucetPivot.add(stem);
  var elbow = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.026, 10, 28, Math.PI / 2), brass);
  elbow.position.set(0, 0.33, 0.15);
  elbow.rotation.set(0, Math.PI / 2, Math.PI);
  faucetPivot.add(elbow);
  var spout = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.2, 18), brass);
  spout.rotation.z = Math.PI / 2;
  spout.position.set(0, 0.49, 0.29);
  faucetPivot.add(spout);

  /* ---------- three ceiling spots + glow sprites (kept — this was the liked part) ---------- */
  var spots = [];
  [-1.1, 0.05, 1.0].forEach(function (x) {
    var housing = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.1, 14), brass);
    housing.position.set(x, 2.3, 0.35);
    group.add(housing);
    var sprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTex, transparent: true, depthWrite: false,
      blending: THREE.AdditiveBlending, opacity: 0
    }));
    sprite.scale.set(2.3, 2.3, 1);
    sprite.position.set(x, 1.5, 0.1);
    group.add(sprite);
    var light = new THREE.SpotLight(0xffd9a8, 0);
    light.position.set(x, 2.3, 0.55);
    light.target.position.set(x * 0.5, 0.2, -0.1);
    light.angle = 0.5; light.penumbra = 0.65; light.decay = 2; light.distance = 7;
    group.add(light); group.add(light.target);
    spots.push({ light: light, sprite: sprite });
  });

  /* contact shadow under the ledge */
  (function () {
    var c = document.createElement('canvas');
    c.width = 256; c.height = 256;
    var g = c.getContext('2d');
    var r = g.createRadialGradient(128, 128, 10, 128, 128, 128);
    r.addColorStop(0, 'rgba(0,0,0,0.5)'); r.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = r; g.fillRect(0, 0, 256, 256);
    var shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(3.4, 2.0),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -0.62;
    group.add(shadow);
  })();

  var ambient = new THREE.AmbientLight(0x353128, 0.42);
  scene.add(ambient);
  var fill = new THREE.DirectionalLight(0x8899aa, 0.1);
  fill.position.set(-3, 1, 4);
  scene.add(fill);
  /* soft camera-facing fill so parts never go full silhouette mid-explode,
     when they can rise above the overhead spots' throw */
  var faceFill = new THREE.PointLight(0xfff2dc, 0, 9, 2);
  faceFill.position.set(0.4, 0.6, 3.2);
  scene.add(faceFill);

  /* ---------- layout ---------- */
  var wide = true;
  function layout() {
    var w = canvas.clientWidth || canvas.parentElement.clientWidth || window.innerWidth;
    var h = canvas.clientHeight || canvas.parentElement.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / Math.max(h, 1);
    camera.updateProjectionMatrix();
    wide = w / h > 0.9;
    group.position.x = wide ? 0.75 : 0;
    group.position.y = wide ? 0 : 0.9;
    group.scale.setScalar(wide ? 1 : 0.72);
  }

  function lerp(a, b, t) { return a + (b - a) * t; }
  function easeInOut(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
  function clamp01(t) { return Math.min(Math.max(t, 0), 1); }

  /* quadratic-bezier position lerp — arcs, not straight lines */
  var _v = new THREE.Vector3();
  function bez(p0, ctrl, p1, k) {
    var mt = 1 - k;
    _v.set(
      mt * mt * p0[0] + 2 * mt * k * ctrl[0] + k * k * p1[0],
      mt * mt * p0[1] + 2 * mt * k * ctrl[1] + k * k * p1[1],
      mt * mt * p0[2] + 2 * mt * k * ctrl[2] + k * k * p1[2]
    );
    return _v;
  }

  /* explode/reattach timing — deliberately asymmetric: comes apart over a
     shorter span (0.26 → 0.52) than it takes to settle back (0.60 → 0.95),
     per the "reassembly should feel slower, like it's settling" note. */
  function explodeAmount(t) {
    if (t < 0.26) return 0;
    if (t < 0.52) return easeOutCubic((t - 0.26) / 0.26);
    if (t < 0.60) return 1;
    if (t < 0.95) return 1 - easeInOut((t - 0.60) / 0.35);
    return 0;
  }

  var BOWL_REST = [0, 0, 0], BOWL_CTRL = [0.05, 0.4, 0.46], BOWL_OUT = [0.08, 0.56, 0.4];
  var FAUCET_REST = [0, 0, 0], FAUCET_CTRL = [-0.32, 0.34, -0.05], FAUCET_OUT = [-0.62, 0.5, 0.18];
  var DRAIN_REST = [0, 0, 0], DRAIN_CTRL = [0.28, 0.3, 0.5], DRAIN_OUT = [0.55, 0.42, 0.6];

  /* camera keyframes across the full scroll range — kept close to eye-level
     with the parts (not below them) so lit faces stay toward camera instead
     of silhouetting against the overhead spots */
  var CAM = [
    { t: 0.00, pos: [-1.3, 1.1, 8.6], look: [0.55, 0.5, -0.2] },
    { t: 0.30, pos: [0.05, 0.85, 4.5], look: [0.0, 0.55, 0.05] },
    { t: 0.60, pos: [0.55, 1.05, 3.9], look: [-0.05, 0.6, 0.2] },
    { t: 1.00, pos: [0.35, 0.65, 3.55], look: [-0.15, 0.48, 0.1] }
  ];
  function keyframe(t, key) {
    var i = 0;
    while (i < CAM.length - 2 && t > CAM[i + 1].t) i++;
    var a = CAM[i], b = CAM[i + 1];
    var span = b.t - a.t;
    var k = span > 0 ? easeInOut(clamp01((t - a.t) / span)) : 0;
    return [
      lerp(a[key][0], b[key][0], k),
      lerp(a[key][1], b[key][1], k),
      lerp(a[key][2], b[key][2], k)
    ];
  }

  /* ---------- pure function of scroll progress — no RAF loop ---------- */
  function update(progress) {
    var t = clamp01(progress);
    var reveal = easeInOut(clamp01(t / 0.28));
    var ex = explodeAmount(t);

    var camPos = keyframe(t, 'pos');
    var camLook = keyframe(t, 'look');
    camera.position.set(camPos[0] + group.position.x, camPos[1] + group.position.y, camPos[2]);
    camera.lookAt(camLook[0] + group.position.x, camLook[1] + group.position.y, camLook[2]);

    var p = bez(BOWL_REST, BOWL_CTRL, BOWL_OUT, ex);
    bowlPivot.position.set(-0.4 + p.x, 0.02 + p.y, 0.14 + p.z);
    bowlPivot.rotation.y = ex * 1.15;
    bowlPivot.rotation.x = -ex * 0.12;

    var f = bez(FAUCET_REST, FAUCET_CTRL, FAUCET_OUT, ex);
    faucetPivot.position.set(-0.4 + f.x, 0.72 + f.y, -0.28 + f.z);
    faucetPivot.rotation.z = ex * 0.55;
    faucetPivot.rotation.y = -ex * 0.4;

    var d = bez(DRAIN_REST, DRAIN_CTRL, DRAIN_OUT, ex);
    drainPivot.position.set(-0.4 + d.x, 0.05 + d.y, 0.14 + d.z);
    drainPivot.rotation.y = ex * Math.PI * 2.6;
    drainPivot.rotation.x = ex * 0.6;

    spots.forEach(function (s, i) {
      var stagger = Math.max(0, reveal - i * 0.06);
      s.light.intensity = lerp(0, 6.2, Math.min(stagger * 1.3, 1));
      s.sprite.material.opacity = lerp(0, 0.8, Math.min(stagger * 1.3, 1));
    });
    ambient.intensity = lerp(0.16, 0.6, reveal);
    faceFill.intensity = lerp(0, 2.6, Math.max(reveal, ex));

    renderer.render(scene, camera);
  }

  layout();
  update(0);
  window.addEventListener('resize', function () { layout(); }, { passive: true });

  window.BECO_HERO = { update: update, layout: layout, ready: true };
})();
