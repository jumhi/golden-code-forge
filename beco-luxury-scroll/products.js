/* BECO — renders four small "product shot" images (marble, ceramic, sanitary
   ware, cabinets) from real geometry in a throwaway three.js scene, once,
   at load. These are raster photos of a rendered object, not flat icon
   glyphs — used in the departments carousel in place of line-art SVGs.
   Exposes window.BECO_PRODUCT_SHOTS = { Marble: dataURL, ... } once ready
   (fires 'beco:products-ready' on window when done, since this can take
   a frame or two). */
(function () {
  if (typeof THREE === 'undefined') { window.BECO_PRODUCT_SHOTS = {}; return; }

  var SIZE = 340;
  var canvas = document.createElement('canvas');
  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  } catch (e) { window.BECO_PRODUCT_SHOTS = {}; return; }
  renderer.setSize(SIZE, SIZE, false);
  renderer.setPixelRatio(1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(32, 1, 0.1, 20);
  camera.position.set(1.6, 1.3, 2.6);
  camera.lookAt(0, 0.1, 0);

  var key = new THREE.DirectionalLight(0xffd9a8, 3.2);
  key.position.set(2, 3, 2);
  scene.add(key);
  var rim = new THREE.DirectionalLight(0x8fb0c9, 1.1);
  rim.position.set(-2, 1.5, -1.5);
  scene.add(rim);
  scene.add(new THREE.AmbientLight(0x33302a, 0.7));

  function marbleTexture(base, vein) {
    var c = document.createElement('canvas');
    c.width = c.height = 256;
    var g = c.getContext('2d');
    g.fillStyle = base; g.fillRect(0, 0, 256, 256);
    var rand = (function seeded(s) { return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; })(7);
    for (var i = 0; i < 9; i++) {
      g.strokeStyle = vein; g.globalAlpha = 0.4 + rand() * 0.3; g.lineWidth = 1 + rand() * 2.4;
      g.beginPath();
      var y0 = rand() * 256;
      g.moveTo(-10, y0);
      g.quadraticCurveTo(128, y0 + (rand() - 0.5) * 140, 266, y0 + (rand() - 0.5) * 100);
      g.stroke();
    }
    return new THREE.CanvasTexture(c);
  }

  function render(build) {
    while (scene.children.length > 3) scene.remove(scene.children[3]);
    build();
    renderer.render(scene, camera);
    return canvas.toDataURL('image/png');
  }

  var shots = {};

  /* Marble — a tilted book-matched slab fragment */
  shots.Marble = render(function () {
    var mat = new THREE.MeshPhysicalMaterial({ map: marbleTexture('#d8c9a9', '#8f6f52'), roughness: 0.2, clearcoat: 0.7 });
    var slab = new THREE.Mesh(new THREE.BoxGeometry(1.7, 1.1, 0.08), mat);
    slab.rotation.set(0.1, 0.5, -0.06);
    scene.add(slab);
  });

  /* Ceramic — four glazed tiles, slightly fanned */
  shots.Ceramic = render(function () {
    var cols = [0xefece3, 0xc9a35c, 0x2b2f2c, 0xefece3];
    var g = new THREE.Group();
    for (var i = 0; i < 4; i++) {
      var t = new THREE.Mesh(
        new THREE.BoxGeometry(0.62, 0.62, 0.05),
        new THREE.MeshPhysicalMaterial({ color: cols[i], roughness: 0.22, clearcoat: 0.9 })
      );
      var cx = (i % 2) * 0.68 - 0.34, cy = Math.floor(i / 2) * 0.68 - 0.34;
      t.position.set(cx, cy, -i * 0.05);
      g.add(t);
    }
    g.rotation.set(0.15, 0.55, -0.05);
    g.position.y = 0.05;
    scene.add(g);
  });

  /* Sanitary ware — the same vessel bowl profile as the hero, on its own */
  shots.SanitaryWare = render(function () {
    var profile = [
      [0.00, 0.00], [0.30, 0.00], [0.42, 0.015], [0.56, 0.06], [0.70, 0.15],
      [0.80, 0.28], [0.865, 0.40], [0.885, 0.475], [0.89, 0.50],
      [0.86, 0.51], [0.83, 0.505], [0.78, 0.45], [0.66, 0.33], [0.50, 0.225], [0.29, 0.16], [0.00, 0.145]
    ].map(function (p) { return new THREE.Vector2(p[0], p[1]); });
    var bowl = new THREE.Mesh(
      new THREE.LatheGeometry(profile, 56),
      new THREE.MeshPhysicalMaterial({ color: 0xf4f1ea, roughness: 0.16, clearcoat: 1 })
    );
    bowl.scale.set(1, 1, 0.86);
    bowl.rotation.y = 0.6;
    bowl.position.y = -0.25;
    scene.add(bowl);
    var faucet = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 0.55, 14),
      new THREE.MeshStandardMaterial({ color: 0xc9a35c, roughness: 0.25, metalness: 1 })
    );
    faucet.position.set(-0.35, 0.05, -0.3);
    scene.add(faucet);
  });

  /* Cabinets — a small vanity carcass with a drawer line, framed face-on and lit brighter */
  shots.Cabinets = render(function () {
    var g = new THREE.Group();
    var body = new THREE.Mesh(
      new THREE.BoxGeometry(1.7, 1.0, 0.75),
      new THREE.MeshPhysicalMaterial({ color: 0x4a4136, roughness: 0.3, clearcoat: 0.5 })
    );
    g.add(body);
    var top = new THREE.Mesh(
      new THREE.BoxGeometry(1.78, 0.06, 0.83),
      new THREE.MeshPhysicalMaterial({ map: marbleTexture('#d8c9a9', '#8f6f52'), roughness: 0.2, clearcoat: 0.7 })
    );
    top.position.y = 0.53;
    g.add(top);
    var line = new THREE.Mesh(
      new THREE.BoxGeometry(1.72, 0.02, 0.02),
      new THREE.MeshStandardMaterial({ color: 0xc9a35c, roughness: 0.25, metalness: 1 })
    );
    line.position.set(0, 0.05, 0.385);
    g.add(line);
    var handle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.34, 10),
      new THREE.MeshStandardMaterial({ color: 0xc9a35c, roughness: 0.2, metalness: 1 })
    );
    handle.rotation.z = Math.PI / 2;
    handle.position.set(0.55, 0.05, 0.4);
    g.add(handle);
    g.rotation.y = 0.32;
    g.position.y = -0.08;
    scene.add(g);
    key.intensity = 4.4;
    rim.intensity = 1.6;
  });

  window.BECO_PRODUCT_SHOTS = shots;
  renderer.dispose();
  window.dispatchEvent(new Event('beco:products-ready'));
})();
