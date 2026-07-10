/* BECO — hero scene: a book-matched marble feature wall with an embedded
   glass niche, a floating console and a vessel sink fed by a wall-mounted
   faucet, lit by warm ceiling spots. Vanilla three.js (global build).

   This does NOT run a render loop. `window.BECO_HERO.update(progress)` is
   the only thing that redraws a frame — GSAP ScrollTrigger calls it with
   the scroll progress (0..1), so the "video" freezes exactly when the
   user stops scrolling, and scrubs frame-by-frame while they scroll. */
(function () {
  var canvas = document.getElementById('scene');
  if (!canvas || typeof THREE === 'undefined') {
    window.BECO_HERO = { update: function () {}, ready: false };
    return;
  }

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  } catch (e) {
    canvas.style.display = 'none';
    window.BECO_HERO = { update: function () {}, ready: false };
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(36, 1, 0.1, 60);

  /* No PMREM environment map: PMREMGenerator's prefilter pass is a heavy,
     multi-mip render-and-readback that stalls the main thread badly under
     software/weak-GPU rendering. The scene reads fine on direct lighting
     alone (clearcoat still catches highlights from the spots), and skipping
     it removes a multi-second freeze during the hero's first paint. */

  /* ---------- book-matched marble texture ---------- */
  function makeMarbleTexture() {
    var w = 768, h = 768;
    var c = document.createElement('canvas');
    c.width = w; c.height = h;
    var g = c.getContext('2d');
    g.fillStyle = '#d8c9a9';
    g.fillRect(0, 0, w, h);

    /* draw veins only on the left half, then mirror for a true book-match seam */
    var half = w / 2;
    function vein(x0, y0, x1, y1, x2, y2, width, color, alpha) {
      g.strokeStyle = color;
      g.globalAlpha = alpha;
      g.lineWidth = width;
      g.lineCap = 'round';
      g.beginPath();
      g.moveTo(x0, y0);
      g.quadraticCurveTo(x1, y1, x2, y2);
      g.stroke();
    }
    var rand = (function seeded(s) {
      return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
    })(42);

    for (var i = 0; i < 26; i++) {
      var y0 = rand() * h, y2 = y0 + (rand() - 0.5) * 340;
      var x0 = -40, x2 = half + 30;
      var xm = half * rand();
      var ym = (y0 + y2) / 2 + (rand() - 0.5) * 220;
      var amber = rand() > 0.4;
      vein(x0, y0, xm, ym, x2, y2,
        1.4 + rand() * 3.4,
        amber ? '#a9793a' : '#8f6f52',
        0.35 + rand() * 0.4);
    }
    for (var j = 0; j < 10; j++) {
      var yy0 = rand() * h, yy2 = yy0 + (rand() - 0.5) * 200;
      vein(-30, yy0, half * rand(), (yy0 + yy2) / 2, half + 20, yy2,
        0.6 + rand() * 1.2, '#5b4327', 0.5 + rand() * 0.3);
    }
    /* soft warm glow bleeding in from the top, like ceiling spotlights hitting the stone */
    var glow = g.createLinearGradient(0, 0, 0, h);
    glow.addColorStop(0, 'rgba(255, 214, 160, 0.35)');
    glow.addColorStop(0.35, 'rgba(255, 214, 160, 0)');
    g.globalAlpha = 1;
    g.fillStyle = glow;
    g.fillRect(0, 0, half, h);

    /* mirror left → right for the book-match seam */
    g.save();
    g.translate(w, 0);
    g.scale(-1, 1);
    g.drawImage(c, 0, 0, half, h, half, 0, half, h);
    g.restore();

    /* center seam line */
    g.globalAlpha = 0.5;
    g.fillStyle = '#3a2c1a';
    g.fillRect(half - 1, 0, 2, h);
    g.globalAlpha = 1;

    var tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  }
  var marbleTex = makeMarbleTexture();

  function glowSpriteTexture() {
    var c = document.createElement('canvas');
    c.width = 128; c.height = 128;
    var g = c.getContext('2d');
    var r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    r.addColorStop(0, 'rgba(255, 214, 150, 0.95)');
    r.addColorStop(0.4, 'rgba(255, 180, 110, 0.35)');
    r.addColorStop(1, 'rgba(255, 180, 110, 0)');
    g.fillStyle = r;
    g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }
  var glowTex = glowSpriteTexture();

  /* ---------- materials ---------- */
  var marble = new THREE.MeshPhysicalMaterial({
    map: marbleTex, roughness: 0.24, metalness: 0.0,
    clearcoat: 0.6, clearcoatRoughness: 0.3, envMapIntensity: 0.9
  });
  var glass = new THREE.MeshPhysicalMaterial({
    color: 0x08090b, roughness: 0.06, metalness: 0.1,
    clearcoat: 1, clearcoatRoughness: 0.02, envMapIntensity: 1.6
  });
  var porcelain = new THREE.MeshPhysicalMaterial({
    color: 0xf4f1ea, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.12, envMapIntensity: 1.1
  });
  var brass = new THREE.MeshStandardMaterial({
    color: 0xc9a35c, roughness: 0.26, metalness: 1.0, envMapIntensity: 1.5
  });

  /* ---------- geometry ---------- */
  var group = new THREE.Group();
  scene.add(group);

  var slab = new THREE.Mesh(new THREE.PlaneGeometry(7.2, 5.4), marble);
  slab.position.set(0, 0.4, -0.6);
  group.add(slab);

  var niche = new THREE.Mesh(new THREE.PlaneGeometry(2.7, 1.7), glass);
  niche.position.set(0.05, 1.1, -0.45);
  group.add(niche);
  var nicheFrame = new THREE.Mesh(new THREE.RingGeometry(0, 0, 4), brass); // placeholder replaced below
  group.remove(nicheFrame);

  var shelf = new THREE.Mesh(new THREE.BoxGeometry(3.1, 0.12, 0.62), marble);
  shelf.position.set(0.05, -0.05, 0.05);
  group.add(shelf);

  /* vessel sink — reuse an oval lathe profile, scaled down onto the shelf */
  var profile = [
    [0.00, 0.00], [0.30, 0.00], [0.42, 0.015], [0.56, 0.06],
    [0.70, 0.15], [0.80, 0.28], [0.865, 0.40], [0.885, 0.475],
    [0.89, 0.50],
    [0.86, 0.51], [0.83, 0.505],
    [0.78, 0.45], [0.66, 0.33], [0.50, 0.225], [0.29, 0.16], [0.00, 0.145]
  ].map(function (p) { return new THREE.Vector2(p[0], p[1]); });
  var sink = new THREE.Mesh(new THREE.LatheGeometry(profile, 80), porcelain);
  sink.scale.set(1, 1, 0.86);
  sink.position.set(-0.55, 0.03, 0.12);
  group.add(sink);

  /* wall-mounted faucet: vertical stem from the marble + curved spout */
  var faucetGroup = new THREE.Group();
  var stem = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.7, 20), brass);
  stem.position.set(-0.55, 0.72, -0.32);
  faucetGroup.add(stem);
  var elbow = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.028, 12, 32, Math.PI / 2), brass);
  elbow.position.set(-0.55, 1.05, -0.16);
  elbow.rotation.set(0, Math.PI / 2, Math.PI);
  faucetGroup.add(elbow);
  var spout = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.22, 20), brass);
  spout.rotation.z = Math.PI / 2;
  spout.position.set(-0.55, 1.21, 0.0);
  faucetGroup.add(spout);
  group.add(faucetGroup);

  /* three ceiling spotlight housings + glow sprites, echoing the showroom photo */
  var spots = [];
  var spotX = [-1.7, 0.05, 1.6];
  spotX.forEach(function (x) {
    var housing = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.12, 16), brass);
    housing.position.set(x, 2.55, 0.35);
    group.add(housing);

    var sprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTex, transparent: true, depthWrite: false,
      blending: THREE.AdditiveBlending, opacity: 0
    }));
    sprite.scale.set(2.6, 2.6, 1);
    sprite.position.set(x, 1.9, 0.15);
    group.add(sprite);
    spots.push({ light: new THREE.SpotLight(0xffd9a8, 0), sprite: sprite });
    var light = spots[spots.length - 1].light;
    light.position.set(x, 2.5, 0.6);
    light.target.position.set(x * 0.6, 0.3, -0.3);
    light.angle = 0.5;
    light.penumbra = 0.6;
    light.decay = 2;
    light.distance = 8;
    group.add(light);
    group.add(light.target);
  });

  /* soft contact shadow under the console */
  (function () {
    var c = document.createElement('canvas');
    c.width = 256; c.height = 256;
    var g = c.getContext('2d');
    var r = g.createRadialGradient(128, 128, 10, 128, 128, 128);
    r.addColorStop(0, 'rgba(0,0,0,0.55)');
    r.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = r;
    g.fillRect(0, 0, 256, 256);
    var tex = new THREE.CanvasTexture(c);
    var shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(4.2, 2.4),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -0.62;
    group.add(shadow);
  })();

  /* ---------- ambient fill (very low — the scene is mostly spot-lit) ---------- */
  var ambient = new THREE.AmbientLight(0x2a2622, 0.5);
  scene.add(ambient);
  var fill = new THREE.DirectionalLight(0x8899aa, 0.12);
  fill.position.set(-3, 1, 4);
  scene.add(fill);

  /* ---------- layout ---------- */
  var wide = true;
  function layout() {
    var w = canvas.clientWidth || canvas.parentElement.clientWidth || window.innerWidth;
    var h = canvas.clientHeight || canvas.parentElement.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / Math.max(h, 1);
    camera.updateProjectionMatrix();
    wide = w / h > 0.9;
    group.position.x = wide ? 0.9 : 0;
    group.scale.setScalar(wide ? 1 : 0.78);
  }

  function lerp(a, b, t) { return a + (b - a) * t; }
  function easeInOut(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

  /* ---------- pure function of scroll progress — no RAF loop ---------- */
  function update(progress) {
    var t = Math.min(Math.max(progress, 0), 1);
    var e = easeInOut(t);

    camera.position.x = lerp(-1.3, 0.55, t) + (wide ? 0 : 0);
    camera.position.y = lerp(1.15, 0.55, t);
    camera.position.z = lerp(8.6, 3.9, t);
    camera.lookAt(group.position.x + lerp(-0.2, -0.4, t), 0.55 - t * 0.35, -0.2);

    group.rotation.y = lerp(-0.16, 0.05, t);

    var reveal = easeInOut(Math.min(t / 0.75, 1));
    spots.forEach(function (s, i) {
      var stagger = Math.max(0, reveal - i * 0.06);
      s.light.intensity = lerp(0, 6.5, Math.min(stagger * 1.3, 1));
      s.sprite.material.opacity = lerp(0, 0.85, Math.min(stagger * 1.3, 1));
    });
    ambient.intensity = lerp(0.18, 0.55, e);

    renderer.render(scene, camera);
  }

  layout();
  update(0);
  window.addEventListener('resize', function () {
    layout();
  }, { passive: true });

  window.BECO_HERO = { update: update, layout: layout, ready: true };
})();
