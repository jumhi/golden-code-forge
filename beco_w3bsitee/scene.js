/* ALBASTRO — hero scene: an oval porcelain vessel on a stone plinth,
   lit like a museum piece. Vanilla three.js (global build). */
(function () {
  var canvas = document.getElementById('scene');
  if (!canvas || typeof THREE === 'undefined') return;

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  } catch (e) {
    canvas.style.display = 'none';
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(38, 1, 0.1, 60);

  /* ---------- studio environment (procedural equirect) ---------- */
  function makeEnvTexture() {
    var c = document.createElement('canvas');
    c.width = 1024; c.height = 512;
    var g = c.getContext('2d');
    var grad = g.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, '#3a3d42');
    grad.addColorStop(0.55, '#232529');
    grad.addColorStop(1, '#101113');
    g.fillStyle = grad;
    g.fillRect(0, 0, 1024, 512);
    function softbox(x, y, w, h, alpha) {
      var r = g.createRadialGradient(x, y, 0, x, y, Math.max(w, h));
      r.addColorStop(0, 'rgba(255,248,235,' + alpha + ')');
      r.addColorStop(1, 'rgba(255,248,235,0)');
      g.fillStyle = r;
      g.fillRect(x - w, y - h, w * 2, h * 2);
    }
    softbox(240, 120, 200, 90, 0.95);   // key, upper left
    softbox(760, 150, 150, 60, 0.5);    // rim, upper right
    softbox(512, 420, 300, 60, 0.12);   // faint floor bounce
    var tex = new THREE.CanvasTexture(c);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    return tex;
  }
  var pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromEquirectangular(makeEnvTexture()).texture;
  pmrem.dispose();

  /* ---------- materials ---------- */
  var porcelain = new THREE.MeshPhysicalMaterial({
    color: 0xf5f3ee,
    roughness: 0.16,
    metalness: 0.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    side: THREE.DoubleSide,
    envMapIntensity: 1.35
  });
  var stone = new THREE.MeshStandardMaterial({
    color: 0x57544d,
    roughness: 0.9,
    metalness: 0.0,
    envMapIntensity: 0.55
  });
  var brass = new THREE.MeshStandardMaterial({
    color: 0xc9a86a,
    roughness: 0.28,
    metalness: 1.0,
    envMapIntensity: 1.4
  });

  /* ---------- geometry ---------- */
  var group = new THREE.Group();
  scene.add(group);

  // basin: shallow wide vessel — lathe profile up the outer wall,
  // over a thin rim, back down inside to a flat well
  var profile = [
    [0.00, 0.00], [0.55, 0.00], [0.78, 0.02], [1.04, 0.10],
    [1.30, 0.26], [1.50, 0.48], [1.62, 0.72], [1.66, 0.88],
    [1.665, 0.935],                      // outer rim lip
    [1.61, 0.95], [1.56, 0.94],          // rim top, rolling inward
    [1.46, 0.84], [1.24, 0.62], [0.94, 0.42], [0.55, 0.30], [0.00, 0.27]
  ].map(function (p) { return new THREE.Vector2(p[0], p[1]); });
  var basin = new THREE.Mesh(new THREE.LatheGeometry(profile, 112), porcelain);
  basin.scale.set(1.28, 1, 0.9); // oval vessel
  group.add(basin);

  // stone plinth — narrower than the basin so the bowl overhangs
  var plinth = new THREE.Mesh(new THREE.CylinderGeometry(0.78, 0.84, 2.9, 64), stone);
  plinth.scale.set(1.28, 1, 0.9);
  plinth.position.y = -1.46;
  group.add(plinth);

  // brass hairline ring, tilted, orbiting slowly
  var ring = new THREE.Mesh(new THREE.TorusGeometry(2.5, 0.014, 12, 180), brass);
  ring.rotation.x = Math.PI / 2.3;
  ring.position.y = 0.42;
  group.add(ring);

  // soft contact shadow under the plinth
  (function () {
    var c = document.createElement('canvas');
    c.width = 256; c.height = 256;
    var g = c.getContext('2d');
    var r = g.createRadialGradient(128, 128, 10, 128, 128, 128);
    r.addColorStop(0, 'rgba(0,0,0,0.62)');
    r.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = r;
    g.fillRect(0, 0, 256, 256);
    var tex = new THREE.CanvasTexture(c);
    var shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(6.4, 4.6),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -2.62;
    group.add(shadow);
  })();

  // drifting dust motes
  var motes = (function () {
    var n = 150;
    var pos = new Float32Array(n * 3);
    for (var i = 0; i < n; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 9;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 7 - 1.5;
    }
    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    var mat = new THREE.PointsMaterial({
      color: 0xd8d2c4, size: 0.025, sizeAttenuation: true,
      transparent: true, opacity: 0.4, depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    var pts = new THREE.Points(geo, mat);
    scene.add(pts);
    return pts;
  })();

  /* ---------- lights ---------- */
  var key = new THREE.DirectionalLight(0xfff1dd, 2.4);
  key.position.set(3.5, 5, 3);
  scene.add(key);
  var rim = new THREE.DirectionalLight(0xbdd0d8, 1.1);
  rim.position.set(-4.5, 2.5, -3.5);
  scene.add(rim);
  scene.add(new THREE.AmbientLight(0x40434a, 0.7));

  /* ---------- layout / camera ---------- */
  var wide = true;
  function layout() {
    var w = canvas.clientWidth || canvas.parentElement.clientWidth;
    var h = canvas.clientHeight || canvas.parentElement.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    wide = w / h > 1.05;
    if (wide) {
      group.position.set(3.05, -0.55, 0);
      group.scale.set(1, 1, 1);
    } else {
      // portrait: basin rises from the bottom-right corner, cropped
      group.position.set(1.45, -3.1, 0);
      group.scale.set(0.62, 0.62, 0.62);
    }
  }
  camera.position.set(0, 1.7, 7.8);

  /* ---------- interaction state ---------- */
  var mouseX = 0, mouseY = 0, curX = 0, curY = 0;
  window.addEventListener('pointermove', function (e) {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = (e.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });

  var heroH = window.innerHeight;
  function scrollProgress() {
    return Math.min(Math.max(window.scrollY / Math.max(heroH, 1), 0), 1);
  }

  /* ---------- render loop ---------- */
  var clock = new THREE.Clock();
  var running = false, rafId = 0;

  function frame() {
    var t = clock.getElapsedTime();
    var p = scrollProgress();

    curX += (mouseX - curX) * 0.04;
    curY += (mouseY - curY) * 0.04;

    basin.rotation.y = t * 0.22 + p * 2.2;
    plinth.rotation.y = basin.rotation.y * 0.4;
    ring.rotation.z = t * 0.12;
    group.position.y += Math.sin(t * 0.55) * 0.0009;
    motes.rotation.y = t * 0.014;

    camera.position.x = curX * 0.45;
    camera.position.y = 1.7 - curY * 0.35 - p * 1.1;
    if (wide) {
      camera.lookAt(group.position.x, group.position.y + 0.3, 0);
    } else {
      camera.lookAt(0.15, 0.35, 0); // fixed target so the vessel stays low-right
    }

    renderer.render(scene, camera);
    if (running && !prefersReducedMotion) rafId = requestAnimationFrame(frame);
  }

  function start() {
    if (running) return;
    running = true;
    clock.start();
    rafId = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    cancelAnimationFrame(rafId);
  }

  new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { en.isIntersecting ? start() : stop(); });
  }, { threshold: 0.02 }).observe(canvas);

  window.addEventListener('resize', function () {
    heroH = window.innerHeight;
    layout();
    if (!running || prefersReducedMotion) { renderer.render(scene, camera); }
  }, { passive: true });

  layout();
  if (prefersReducedMotion) {
    renderer.render(scene, camera);
  } else {
    start();
  }
})();
