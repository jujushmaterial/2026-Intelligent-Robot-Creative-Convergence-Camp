(function () {
  'use strict';

  var THREE_REF = window.THREE;
  if (!THREE_REF) {
    document.body.innerHTML = '<div style="padding:24px;color:white;font-family:sans-serif">Three.js 로드에 실패했습니다. 인터넷 연결을 확인한 뒤 다시 실행해주세요.</div>';
    return;
  }
  var THREE = THREE_REF;

  var DOM = {};
  var fieldScene, monitorScene, fieldCamera, monitorCamera, fieldRenderer, monitorRenderer;
  var clock = new THREE.Clock();
  var sim = {
    auto: false,
    autoStart: 0,
    autoPaused: false,
    pauseAt: 0,
    autoElapsedAtPause: 0,
    manual: { construction: 0, scan: 0, sync: 0, risk: 0, audit: 0, worker: 0, fall: 0, net: 0 },
    lastLogTick: -1,
    packetsOn: false
  };

  var groups = {
    field: new THREE.Group(),
    monitor: new THREE.Group(),
    construction: [],
    monitorBuild: [],
    robots: [],
    workers: [],
    launchers: [],
    riskZones: [],
    defectMarks: [],
    memory: [],
    monitorMemory: [],
    monitorRisk: [],
    monitorDefect: [],
    fieldRebar: [],
    monitorRebar: [],
    loadZones: [],
    monitorLoadZones: [],
    commandEffects: []
  };

  var materials = {};
  var fallWorker = null;
  var cocoonGroup = null;
  var tetherLines = [];
  var pointCloud = null;
  var packetTimer = 0;

  function $(id) { return document.getElementById(id); }
  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
  function smooth(v) { v = clamp(v, 0, 1); return v * v * (3 - 2 * v); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function vecLerp(a, b, t) { return new THREE.Vector3(lerp(a.x, b.x, t), lerp(a.y, b.y, t), lerp(a.z, b.z, t)); }

  function init() {
    cacheDom();
    createRenderers();
    createMaterials();
    buildScenes();
    attachButtons();
    resetSimulation();
    window.addEventListener('resize', resizeRenderers);
    resizeRenderers();
    animate();
  }

  function cacheDom() {
    DOM.fieldCanvas = $('fieldCanvas');
    DOM.monitorCanvas = $('monitorCanvas');
    DOM.caption = $('captionText');
    DOM.globalStatus = $('globalStatus');
    DOM.eventLog = $('eventLog');
    DOM.fallAlert = $('fallAlert');
    DOM.packetLayer = $('packetLayer');
    DOM.metricProgress = $('metricProgress');
    DOM.metricScan = $('metricScan');
    DOM.metricRisk = $('metricRisk');
    DOM.metricDefect = $('metricDefect');
    DOM.metricDesign = $('metricDesign');
    DOM.metricCommand = $('metricCommand');
    DOM.metricWorker = $('metricWorker');
    DOM.auditCard = $('auditCard');
    DOM.barProgress = $('barProgress');
    DOM.barScan = $('barScan');
    DOM.btnPause = $('btnPause');
  }

  function createRenderers() {
    fieldScene = new THREE.Scene();
    fieldScene.background = new THREE.Color(0x07111f);
    fieldScene.fog = new THREE.Fog(0x07111f, 18, 42);

    monitorScene = new THREE.Scene();
    monitorScene.background = new THREE.Color(0x020914);

    fieldCamera = new THREE.PerspectiveCamera(48, 1, 0.1, 200);
    fieldCamera.position.set(11, 8.2, 12.5);
    fieldCamera.lookAt(0, 2.7, 0);

    monitorCamera = new THREE.PerspectiveCamera(42, 1, 0.1, 120);
    monitorCamera.position.set(7.8, 5.6, 8.2);
    monitorCamera.lookAt(0, 2.4, 0);

    fieldRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    fieldRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    fieldRenderer.shadowMap.enabled = true;
    DOM.fieldCanvas.appendChild(fieldRenderer.domElement);

    monitorRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    monitorRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    DOM.monitorCanvas.appendChild(monitorRenderer.domElement);
  }

  function createMaterials() {
    materials.ground = new THREE.MeshStandardMaterial({ color: 0x192638, roughness: 0.9, metalness: 0.05 });
    materials.steel = new THREE.MeshStandardMaterial({ color: 0x9eb6ca, roughness: 0.38, metalness: 0.42, transparent: true, opacity: 1 });
    materials.steelDark = new THREE.MeshStandardMaterial({ color: 0x66798f, roughness: 0.45, metalness: 0.35, transparent: true, opacity: 1 });
    materials.slab = new THREE.MeshStandardMaterial({ color: 0x445468, roughness: 0.78, metalness: 0.04, transparent: true, opacity: 0.86 });
    materials.slabEdge = new THREE.MeshStandardMaterial({ color: 0x2a3340, roughness: 0.8, metalness: 0.04, transparent: true, opacity: 0.72 });
    materials.facade = new THREE.MeshStandardMaterial({ color: 0x42617d, roughness: 0.5, metalness: 0.08, transparent: true, opacity: 0.42 });
    materials.robot = new THREE.MeshStandardMaterial({ color: 0x5fb8ff, roughness: 0.42, metalness: 0.25 });
    materials.robotDark = new THREE.MeshStandardMaterial({ color: 0x0d2440, roughness: 0.55, metalness: 0.2 });
    materials.workerVest = new THREE.MeshStandardMaterial({ color: 0xffc857, roughness: 0.55 });
    materials.workerPants = new THREE.MeshStandardMaterial({ color: 0x1e3352, roughness: 0.65 });
    materials.helmet = new THREE.MeshStandardMaterial({ color: 0xffef73, roughness: 0.42 });
    materials.skin = new THREE.MeshStandardMaterial({ color: 0xdba56d, roughness: 0.66 });
    materials.scan = new THREE.MeshBasicMaterial({ color: 0x5fb8ff, transparent: true, opacity: 0.14, side: THREE.DoubleSide, depthWrite: false });
    materials.scanLine = new THREE.LineBasicMaterial({ color: 0x5fb8ff, transparent: true, opacity: 0.75 });
    materials.risk = new THREE.MeshBasicMaterial({ color: 0xff355d, transparent: true, opacity: 0.22, side: THREE.DoubleSide, depthWrite: false });
    materials.warn = new THREE.MeshBasicMaterial({ color: 0xffd166, transparent: true, opacity: 0.25, side: THREE.DoubleSide, depthWrite: false });
    materials.defect = new THREE.MeshBasicMaterial({ color: 0xffd166, transparent: true, opacity: 0.62, side: THREE.DoubleSide, depthWrite: false });
    materials.rebarActual = new THREE.MeshStandardMaterial({ color: 0x70c8ff, roughness: 0.32, metalness: 0.65, transparent: true, opacity: 0.86 });
    materials.rebarMissing = new THREE.MeshBasicMaterial({ color: 0xff3f5f, transparent: true, opacity: 0.75 });
    materials.projectorRed = new THREE.MeshBasicMaterial({ color: 0xff304f, transparent: true, opacity: 0.34, side: THREE.DoubleSide, depthWrite: false });
    materials.projectorYellow = new THREE.MeshBasicMaterial({ color: 0xffd166, transparent: true, opacity: 0.24, side: THREE.DoubleSide, depthWrite: false });
    materials.loadSafe = new THREE.MeshBasicMaterial({ color: 0x73f0a8, transparent: true, opacity: 0.18, side: THREE.DoubleSide, depthWrite: false });
    materials.loadWarn = new THREE.MeshBasicMaterial({ color: 0xffd166, transparent: true, opacity: 0.23, side: THREE.DoubleSide, depthWrite: false });
    materials.loadDanger = new THREE.MeshBasicMaterial({ color: 0xff355d, transparent: true, opacity: 0.30, side: THREE.DoubleSide, depthWrite: false });
    materials.memory = new THREE.MeshBasicMaterial({ color: 0xc79cff, transparent: true, opacity: 0.22, wireframe: true });
    materials.monitorWire = new THREE.MeshBasicMaterial({ color: 0x66d6ff, transparent: true, opacity: 0.48, wireframe: true });
    materials.monitorSolid = new THREE.MeshBasicMaterial({ color: 0x3d7fb1, transparent: true, opacity: 0.22 });
    materials.net = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.88 });
    materials.netSurface = new THREE.MeshBasicMaterial({ color: 0x91f5ff, transparent: true, opacity: 0.13, side: THREE.DoubleSide, depthWrite: false });
    materials.tether = new THREE.LineBasicMaterial({ color: 0xe8f1ff, transparent: true, opacity: 0.92 });
  }

  function buildScenes() {
    fieldScene.add(groups.field);
    monitorScene.add(groups.monitor);

    addLights(fieldScene, true);
    addLights(monitorScene, false);
    buildConstructionSite();
    buildMonitorModel();
    buildRobots();
    buildWorkers();
    buildRiskAndSafetySystems();
    buildCocoonNet();
    buildRebarAndRiskLayers();
  }

  function addLights(scene, strong) {
    var hemi = new THREE.HemisphereLight(0xd9efff, 0x111827, strong ? 1.25 : 0.9);
    scene.add(hemi);
    var dir = new THREE.DirectionalLight(0xffffff, strong ? 1.7 : 1.2);
    dir.position.set(6, 11, 8);
    dir.castShadow = strong;
    scene.add(dir);
    var fill = new THREE.PointLight(0x5fb8ff, strong ? 0.9 : 1.3, 42);
    fill.position.set(-7, 6, -7);
    scene.add(fill);
  }

  function makeBox(w, h, d, mat, pos, name) {
    var mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat.clone ? mat.clone() : mat);
    mesh.position.copy(pos);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.name = name || '';
    return mesh;
  }

  function makeCylinder(rTop, rBot, h, mat, pos, radial) {
    var mesh = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBot, h, radial || 18), mat.clone ? mat.clone() : mat);
    mesh.position.copy(pos);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }


  function makeLabelSprite(text, color, bgColor, width, height) {
    var canvas = document.createElement('canvas');
    canvas.width = width || 512;
    canvas.height = height || 160;
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = bgColor || 'rgba(4, 12, 24, 0.82)';
    roundRect(ctx, 8, 8, canvas.width - 16, canvas.height - 16, 26);
    ctx.fill();
    ctx.strokeStyle = color || '#ffffff';
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.fillStyle = color || '#ffffff';
    ctx.font = '700 38px Arial, Malgun Gothic, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    var lines = String(text).split('\n');
    for (var i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], canvas.width / 2, canvas.height / 2 + (i - (lines.length - 1) / 2) * 44);
    }
    var tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    var sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 1, depthWrite: false }));
    sprite.scale.set((width || 512) / 190, (height || 160) / 190, 1);
    return sprite;
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function makeRebarLayer(lengthX, lengthZ, countX, countZ, y, mat, name) {
    var g = new THREE.Group();
    g.name = name;
    for (var i = 0; i < countZ; i++) {
      var z = -lengthZ / 2 + (lengthZ / Math.max(1, countZ - 1)) * i;
      var bx = makeCylinder(0.028, 0.028, lengthX, mat, v(0, y, z), 10);
      bx.rotation.z = Math.PI / 2;
      g.add(bx);
    }
    for (var j = 0; j < countX; j++) {
      var x = -lengthX / 2 + (lengthX / Math.max(1, countX - 1)) * j;
      var bz = makeCylinder(0.026, 0.026, lengthZ, mat, v(x, y + 0.03, 0), 10);
      bz.rotation.x = Math.PI / 2;
      g.add(bz);
    }
    return g;
  }

  function makeHeatPatch(w, d, mat, pos, name) {
    var patch = makeBox(w, 0.028, d, mat, pos, name);
    patch.userData.float = pos.y;
    return patch;
  }

  function addRevealObject(mesh, start, end, collection, maxOpacity) {
    mesh.userData.revealStart = start;
    mesh.userData.revealEnd = end;
    mesh.userData.maxOpacity = maxOpacity == null ? (mesh.material.opacity == null ? 1 : mesh.material.opacity) : maxOpacity;
    mesh.userData.originalScale = mesh.scale.clone();
    if (mesh.material && mesh.material.transparent !== true) mesh.material.transparent = true;
    collection.push(mesh);
    return mesh;
  }

  function buildConstructionSite() {
    var ground = makeBox(17, 0.16, 12, materials.ground, new THREE.Vector3(0, -0.08, 0), 'ground');
    groups.field.add(ground);

    var grid = new THREE.GridHelper(17, 17, 0x43627f, 0x1e344d);
    grid.position.y = 0.01;
    groups.field.add(grid);

    var levels = [0, 2.55, 5.1];
    var xs = [-4.8, 0, 4.8];
    var zs = [-2.9, 2.9];

    for (var xi = 0; xi < xs.length; xi++) {
      for (var zi = 0; zi < zs.length; zi++) {
        for (var li = 0; li < 2; li++) {
          var c = makeBox(0.26, 2.55, 0.26, materials.steel, new THREE.Vector3(xs[xi], levels[li] + 1.275, zs[zi]), 'column');
          addRevealObject(c, 0.06 + li * 0.09, 0.22 + li * 0.1, groups.construction, 0.96);
          groups.field.add(c);
        }
      }
    }

    for (var levelIndex = 1; levelIndex < levels.length; levelIndex++) {
      var y = levels[levelIndex];
      for (var zii = 0; zii < zs.length; zii++) {
        var b1 = makeBox(9.9, 0.22, 0.24, materials.steelDark, new THREE.Vector3(0, y, zs[zii]), 'beam-x');
        addRevealObject(b1, 0.22 + levelIndex * 0.05, 0.36 + levelIndex * 0.06, groups.construction, 0.95);
        groups.field.add(b1);
      }
      for (var xii = 0; xii < xs.length; xii++) {
        var b2 = makeBox(0.23, 0.22, 6.05, materials.steelDark, new THREE.Vector3(xs[xii], y, 0), 'beam-z');
        addRevealObject(b2, 0.26 + levelIndex * 0.05, 0.40 + levelIndex * 0.06, groups.construction, 0.95);
        groups.field.add(b2);
      }
    }

    var slab1 = makeBox(10.1, 0.16, 6.15, materials.slab, new THREE.Vector3(0, 2.62, 0), 'slab-2f');
    addRevealObject(slab1, 0.43, 0.54, groups.construction, 0.78);
    groups.field.add(slab1);

    var slab2Left = makeBox(4.25, 0.16, 6.15, materials.slab, new THREE.Vector3(-2.95, 5.17, 0), 'slab-3f-left');
    var slab2Right = makeBox(3.1, 0.16, 6.15, materials.slab, new THREE.Vector3(3.45, 5.17, 0), 'slab-3f-right');
    addRevealObject(slab2Left, 0.52, 0.66, groups.construction, 0.78);
    addRevealObject(slab2Right, 0.55, 0.69, groups.construction, 0.78);
    groups.field.add(slab2Left, slab2Right);

    var opening = makeBox(1.7, 0.025, 1.45, materials.risk, new THREE.Vector3(0.65, 5.28, 0.15), 'opening-risk');
    opening.rotation.x = -Math.PI / 2;
    addRevealObject(opening, 0.65, 0.72, groups.riskZones, 0.35);
    groups.field.add(opening);

    var edgeRisk = makeBox(0.13, 0.03, 6.15, materials.risk, new THREE.Vector3(5.13, 5.31, 0), 'edge-risk');
    addRevealObject(edgeRisk, 0.66, 0.74, groups.riskZones, 0.55);
    groups.field.add(edgeRisk);

    var warnZone = makeBox(1.0, 0.028, 5.8, materials.warn, new THREE.Vector3(4.55, 5.32, 0), 'edge-warning-zone');
    addRevealObject(warnZone, 0.70, 0.78, groups.riskZones, 0.28);
    groups.field.add(warnZone);

    var misalignedBeam = makeBox(3.0, 0.24, 0.25, materials.defect, new THREE.Vector3(2.7, 5.45, -3.05), 'defect-misaligned-beam');
    addRevealObject(misalignedBeam, 0.72, 0.85, groups.defectMarks, 0.55);
    groups.field.add(misalignedBeam);

    for (var f = 0; f < 4; f++) {
      var panel = makeBox(0.06, 2.1, 1.2, materials.facade, new THREE.Vector3(5.55, 3.95, -2.25 + f * 1.5), 'facade-panel');
      addRevealObject(panel, 0.78 + f * 0.025, 0.9 + f * 0.02, groups.construction, 0.38);
      groups.field.add(panel);
    }

    var memoryGhost = new THREE.Group();
    memoryGhost.name = 'field-memory-layer';
    for (var m = 0; m < xs.length; m++) {
      for (var n = 0; n < zs.length; n++) {
        var ghost = makeBox(0.34, 5.15, 0.34, materials.memory, new THREE.Vector3(xs[m], 2.58, zs[n]), 'memory-column');
        memoryGhost.add(ghost);
      }
    }
    addRevealGroup(memoryGhost, 0.84, 0.98, groups.memory, 0.26);
    groups.field.add(memoryGhost);
  }

  function addRevealGroup(group, start, end, collection, maxOpacity) {
    group.userData.revealStart = start;
    group.userData.revealEnd = end;
    group.userData.maxOpacity = maxOpacity == null ? 1 : maxOpacity;
    collection.push(group);
    return group;
  }

  function buildMonitorModel() {
    var base = new THREE.GridHelper(9, 9, 0x245073, 0x0c2438);
    base.position.y = -0.02;
    groups.monitor.add(base);

    var axes = new THREE.AxesHelper(2.0);
    axes.position.set(-4.2, 0.05, -3.6);
    groups.monitor.add(axes);

    var mini = new THREE.Group();
    mini.scale.set(0.55, 0.55, 0.55);
    mini.position.set(0, 0, 0);
    groups.monitor.add(mini);

    function addMini(mesh, start, end, maxOpacity) {
      addRevealObject(mesh, start, end, groups.monitorBuild, maxOpacity);
      mini.add(mesh);
    }

    var levels = [0, 2.55, 5.1];
    var xs = [-4.8, 0, 4.8];
    var zs = [-2.9, 2.9];
    for (var xi = 0; xi < xs.length; xi++) {
      for (var zi = 0; zi < zs.length; zi++) {
        for (var li = 0; li < 2; li++) {
          addMini(makeBox(0.22, 2.55, 0.22, materials.monitorWire, new THREE.Vector3(xs[xi], levels[li] + 1.275, zs[zi]), 'monitor-column'), 0.10 + li * 0.08, 0.25 + li * 0.1, 0.65);
        }
      }
    }
    for (var levelIndex = 1; levelIndex < levels.length; levelIndex++) {
      var y = levels[levelIndex];
      for (var zii = 0; zii < zs.length; zii++) addMini(makeBox(9.9, 0.18, 0.18, materials.monitorWire, new THREE.Vector3(0, y, zs[zii]), 'monitor-beam-x'), 0.28 + levelIndex * 0.05, 0.42 + levelIndex * 0.06, 0.6);
      for (var xii = 0; xii < xs.length; xii++) addMini(makeBox(0.18, 0.18, 6.05, materials.monitorWire, new THREE.Vector3(xs[xii], y, 0), 'monitor-beam-z'), 0.30 + levelIndex * 0.05, 0.44 + levelIndex * 0.06, 0.6);
    }
    addMini(makeBox(10.1, 0.13, 6.15, materials.monitorSolid, new THREE.Vector3(0, 2.62, 0), 'monitor-slab-2f'), 0.47, 0.6, 0.24);
    addMini(makeBox(4.25, 0.13, 6.15, materials.monitorSolid, new THREE.Vector3(-2.95, 5.17, 0), 'monitor-slab-3f-left'), 0.56, 0.70, 0.24);
    addMini(makeBox(3.1, 0.13, 6.15, materials.monitorSolid, new THREE.Vector3(3.45, 5.17, 0), 'monitor-slab-3f-right'), 0.58, 0.73, 0.24);

    var monRisk = makeBox(0.26, 0.035, 6.2, materials.risk, new THREE.Vector3(5.15, 5.35, 0), 'monitor-edge-risk');
    addRevealObject(monRisk, 0.67, 0.78, groups.monitorRisk, 0.42);
    mini.add(monRisk);

    var monDefect = makeBox(3.0, 0.28, 0.28, materials.defect, new THREE.Vector3(2.7, 5.48, -3.06), 'monitor-defect');
    addRevealObject(monDefect, 0.72, 0.86, groups.monitorDefect, 0.7);
    mini.add(monDefect);

    var monMemory = new THREE.Group();
    monMemory.scale.set(0.55, 0.55, 0.55);
    for (var m = 0; m < xs.length; m++) {
      for (var n = 0; n < zs.length; n++) {
        monMemory.add(makeBox(0.34, 5.15, 0.34, materials.memory, new THREE.Vector3(xs[m], 2.58, zs[n]), 'monitor-memory-col'));
      }
    }
    addRevealGroup(monMemory, 0.82, 0.98, groups.monitorMemory, 0.34);
    groups.monitor.add(monMemory);

    buildPointCloud();
  }

  function buildPointCloud() {
    var positions = [];
    var colors = [];
    var colorA = new THREE.Color(0x5fb8ff);
    var colorB = new THREE.Color(0x73f0a8);
    var count = 850;
    for (var i = 0; i < count; i++) {
      var stageBand = i / count;
      var x, y, z;
      if (stageBand < 0.28) {
        x = [-2.65, 0, 2.65][Math.floor(Math.random() * 3)] + (Math.random() - 0.5) * 0.2;
        z = [-1.6, 1.6][Math.floor(Math.random() * 2)] + (Math.random() - 0.5) * 0.2;
        y = Math.random() * 2.7;
      } else if (stageBand < 0.58) {
        x = (Math.random() - 0.5) * 5.4;
        z = [-1.6, 1.6][Math.floor(Math.random() * 2)] + (Math.random() - 0.5) * 0.14;
        y = 1.45 + Math.random() * 1.6;
      } else {
        x = (Math.random() - 0.5) * 5.4;
        z = (Math.random() - 0.5) * 3.5;
        y = 2.7 + Math.random() * 1.1;
      }
      positions.push(x, y, z);
      var c = colorA.clone().lerp(colorB, Math.random() * 0.7);
      colors.push(c.r, c.g, c.b);
    }
    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geo.setDrawRange(0, 0);
    var mat = new THREE.PointsMaterial({ size: 0.045, vertexColors: true, transparent: true, opacity: 0.9, depthWrite: false });
    pointCloud = new THREE.Points(geo, mat);
    pointCloud.position.set(0, 0.05, 0);
    groups.monitor.add(pointCloud);
  }

  function buildRobots() {
    var robotDefs = [
      { name: 'G-01', type: 'ground', y: 0.16, speed: 0.12, offset: 0.0, path: [v(-5.8,0.16,-4.2), v(5.8,0.16,-4.2), v(5.8,0.16,4.2), v(-5.8,0.16,4.2)] },
      { name: 'G-02', type: 'ground', y: 0.16, speed: 0.11, offset: 0.36, path: [v(4.8,0.16,3.6), v(-4.8,0.16,3.6), v(-4.8,0.16,-3.6), v(4.8,0.16,-3.6)] },
      { name: 'S-21', type: 'slab', y: 2.82, speed: 0.16, offset: 0.1, minConstruction: 0.45, path: [v(-4.2,2.82,-2.3), v(4.3,2.82,-2.3), v(4.3,2.82,2.3), v(-4.2,2.82,2.3)] },
      { name: 'S-31', type: 'slab', y: 5.37, speed: 0.15, offset: 0.45, minConstruction: 0.58, path: [v(-4.3,5.37,2.25), v(4.55,5.37,2.25), v(4.55,5.37,-2.25), v(-4.3,5.37,-2.25)] },
      { name: 'S-AUDIT', type: 'slab', y: 5.37, speed: 0.10, offset: 0.74, minConstruction: 0.58, path: [v(-0.6,5.37,-2.15), v(2.6,5.37,-2.15), v(2.6,5.37,-0.4), v(-0.6,5.37,-0.4)] },
      { name: 'B-CR1', type: 'beam', y: 5.56, speed: 0.19, offset: 0.2, minConstruction: 0.34, path: [v(-4.6,5.56,-2.93), v(4.6,5.56,-2.93)] },
      { name: 'B-CR2', type: 'beam', y: 5.56, speed: 0.18, offset: 0.68, minConstruction: 0.34, path: [v(4.6,5.56,2.93), v(-4.6,5.56,2.93)] }
    ];

    for (var i = 0; i < robotDefs.length; i++) {
      var robot = createRobot(robotDefs[i]);
      groups.robots.push(robot);
      groups.field.add(robot.group);
    }
  }

  function v(x, y, z) { return new THREE.Vector3(x, y, z); }

  function createRobot(def) {
    var g = new THREE.Group();
    g.name = def.name;
    var scale = def.type === 'beam' ? 0.74 : 1;
    var body = makeBox(0.52 * scale, 0.24 * scale, 0.62 * scale, materials.robot, v(0, 0.16 * scale, 0), 'robot-body');
    var base = makeBox(0.66 * scale, 0.12 * scale, 0.76 * scale, materials.robotDark, v(0, 0.06 * scale, 0), 'robot-base');
    var mast = makeCylinder(0.055 * scale, 0.055 * scale, 0.42 * scale, materials.robotDark, v(0, 0.46 * scale, 0), 12);
    var head = makeCylinder(0.18 * scale, 0.18 * scale, 0.1 * scale, materials.robot, v(0, 0.72 * scale, 0), 20);
    head.rotation.x = Math.PI / 2;
    g.add(base, body, mast, head);

    for (var wx = -1; wx <= 1; wx += 2) {
      for (var wz = -1; wz <= 1; wz += 2) {
        var wheel = makeCylinder(0.09 * scale, 0.09 * scale, 0.08 * scale, materials.robotDark, v(wx * 0.28 * scale, 0.06 * scale, wz * 0.28 * scale), 14);
        wheel.rotation.z = Math.PI / 2;
        g.add(wheel);
      }
    }

    var scanRing = new THREE.Mesh(new THREE.RingGeometry(0.55 * scale, 1.55 * scale, 40, 1, 0, Math.PI * 2), materials.scan.clone());
    scanRing.rotation.x = -Math.PI / 2;
    scanRing.position.y = 0.74 * scale;
    g.add(scanRing);

    var scanLineGeo = new THREE.BufferGeometry().setFromPoints([v(0, 0.75 * scale, 0), v(1.75 * scale, 0.75 * scale, 0)]);
    var scanLine = new THREE.Line(scanLineGeo, materials.scanLine.clone());
    g.add(scanLine);

    return { group: g, def: def, scanRing: scanRing, scanLine: scanLine, previous: v(0,0,0) };
  }

  function buildWorkers() {
    var workers = [
      { name: 'w-column', role: 'column', pos: v(-4.85, 0.08, -2.1), min: 0.08 },
      { name: 'w-beam', role: 'beam', pos: v(-2.8, 5.38, -2.95), min: 0.34 },
      { name: 'w-carry', role: 'carry', pos: v(-3.2, 2.83, 1.65), min: 0.45 },
      { name: 'w-opening', role: 'opening', pos: v(0.0, 5.38, 1.4), min: 0.58 },
      { name: 'w-supervisor', role: 'supervisor', pos: v(-6.2, 0.08, 3.4), min: 0.02 },
      { name: 'w-fall', role: 'fall', pos: v(3.4, 5.38, 0.4), min: 0.58 }
    ];

    for (var i = 0; i < workers.length; i++) {
      var w = createWorker(workers[i].name);
      w.group.position.copy(workers[i].pos);
      w.role = workers[i].role;
      w.minConstruction = workers[i].min;
      w.basePos = workers[i].pos.clone();
      groups.workers.push(w);
      groups.field.add(w.group);
      if (workers[i].role === 'fall') fallWorker = w;
    }
  }

  function createWorker(name) {
    var g = new THREE.Group();
    g.name = name;
    var body = makeCylinder(0.17, 0.20, 0.62, materials.workerVest, v(0, 0.85, 0), 16);
    var head = new THREE.Mesh(new THREE.SphereGeometry(0.16, 18, 18), materials.skin.clone());
    head.position.set(0, 1.25, 0);
    var helmet = makeCylinder(0.17, 0.18, 0.08, materials.helmet, v(0, 1.39, 0), 18);
    var leftLeg = makeBox(0.11, 0.46, 0.12, materials.workerPants, v(-0.08, 0.35, 0), 'left-leg');
    var rightLeg = makeBox(0.11, 0.46, 0.12, materials.workerPants, v(0.08, 0.35, 0), 'right-leg');
    var leftArm = makeBox(0.09, 0.43, 0.09, materials.skin, v(-0.24, 0.88, 0), 'left-arm');
    var rightArm = makeBox(0.09, 0.43, 0.09, materials.skin, v(0.24, 0.88, 0), 'right-arm');
    leftArm.userData.baseX = -0.24;
    rightArm.userData.baseX = 0.24;
    leftLeg.userData.baseX = -0.08;
    rightLeg.userData.baseX = 0.08;
    g.add(body, head, helmet, leftLeg, rightLeg, leftArm, rightArm);

    var tool = makeBox(0.08, 0.08, 0.36, new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.35, roughness: 0.4 }), v(0.38, 0.94, 0), 'tool');
    g.add(tool);

    return { group: g, limbs: { leftArm: leftArm, rightArm: rightArm, leftLeg: leftLeg, rightLeg: rightLeg, tool: tool }, role: 'generic', minConstruction: 0 };
  }

  function buildRiskAndSafetySystems() {
    var anchorPositions = [
      v(5.62, 5.05, -2.55), v(5.62, 5.05, 2.55), v(5.62, 3.15, -2.55), v(5.62, 3.15, 2.55)
    ];
    for (var i = 0; i < anchorPositions.length; i++) {
      var launcher = new THREE.Group();
      launcher.position.copy(anchorPositions[i]);
      var box = makeBox(0.34, 0.22, 0.44, new THREE.MeshStandardMaterial({ color: 0xff8c42, roughness: 0.48, metalness: 0.18, transparent: true, opacity: 1 }), v(0,0,0), 'cocoon-net-launcher');
      var muzzle = makeCylinder(0.07, 0.07, 0.42, new THREE.MeshStandardMaterial({ color: 0x202a38, roughness: 0.34, metalness: 0.55, transparent: true, opacity: 1 }), v(0.24,0,0), 14);
      muzzle.rotation.z = Math.PI / 2;
      launcher.add(box, muzzle);
      launcher.userData.anchor = anchorPositions[i].clone();
      addRevealGroup(launcher, 0.60, 0.74, groups.launchers, 1);
      groups.field.add(launcher);
    }
  }


  function buildRebarAndRiskLayers() {
    // 현장: 설계상 상·하부 2겹이어야 하는 철근 구간. 실제 스캔은 하부 1겹만 감지되는 장면으로 표현한다.
    var rebarField = new THREE.Group();
    rebarField.name = 'field-rebar-audit-zone';
    rebarField.position.set(1.0, 5.34, -1.25);
    var actual = makeRebarLayer(2.7, 1.35, 6, 6, 0.00, materials.rebarActual, 'actual-one-layer-rebar');
    var missing = makeRebarLayer(2.7, 1.35, 6, 6, 0.22, materials.rebarMissing, 'missing-upper-layer-design');
    missing.children.forEach(function (m) { m.material = materials.rebarMissing.clone(); });
    var redPlate = makeHeatPatch(2.95, 1.62, materials.projectorRed.clone(), v(0, 0.02, 0), 'field-rebar-missing-red-zone');
    var label = makeLabelSprite('철근 2겹 설계\n스캔 결과: 1겹 감지', '#ff91a2', 'rgba(55, 0, 12, 0.84)', 560, 170);
    label.position.set(0, 0.85, -1.15);
    rebarField.add(redPlate, actual, missing, label);
    addRevealGroup(rebarField, 0.16, 0.72, groups.fieldRebar, 1);
    groups.field.add(rebarField);

    // 현장 위험도/하중 여유도 프로젝션: 안전/주의/위험 구역을 슬래브 위에 다양한 색상으로 표시한다.
    var safe = makeHeatPatch(3.1, 2.35, materials.loadSafe.clone(), v(-2.6, 5.345, 1.2), 'safe-load-zone');
    var warn = makeHeatPatch(1.9, 1.7, materials.loadWarn.clone(), v(0.6, 5.352, 0.05), 'opening-warning-load-zone');
    var danger = makeHeatPatch(1.15, 5.8, materials.loadDanger.clone(), v(4.68, 5.36, 0), 'edge-danger-load-zone');
    var defectProjection = makeHeatPatch(3.15, 1.82, materials.projectorRed.clone(), v(1.0, 5.365, -1.25), 'robot-projected-stop-work-zone');
    var dangerLabel = makeLabelSprite('DANGER\n접근 금지', '#ff5d73', 'rgba(65, 0, 12, 0.82)', 420, 150);
    dangerLabel.position.set(4.2, 5.95, 2.35);
    var auditLabel = makeLabelSprite('작업 중지\n철근 상부층 누락 의심', '#ffd166', 'rgba(55, 28, 0, 0.86)', 560, 170);
    auditLabel.position.set(1.0, 6.05, -2.25);
    addRevealObject(safe, 0.04, 0.28, groups.loadZones, 0.20); groups.field.add(safe);
    addRevealObject(warn, 0.18, 0.55, groups.loadZones, 0.28); groups.field.add(warn);
    addRevealObject(danger, 0.35, 0.70, groups.loadZones, 0.34); groups.field.add(danger);
    addRevealObject(defectProjection, 0.55, 0.88, groups.commandEffects, 0.42); groups.field.add(defectProjection);
    addRevealObject(dangerLabel, 0.35, 0.74, groups.loadZones, 1); groups.field.add(dangerLabel);
    addRevealObject(auditLabel, 0.58, 0.92, groups.commandEffects, 1); groups.field.add(auditLabel);

    var beamLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints([v(2.4,5.62,-1.4), v(1.0,5.42,-1.25)]), new THREE.LineBasicMaterial({ color: 0xffd166, transparent: true, opacity: 1 }));
    beamLine.name = 'field-robot-command-beam';
    addRevealObject(beamLine, 0.62, 0.92, groups.commandEffects, 0.95);
    groups.field.add(beamLine);

    // 관리자 모니터: As-built 모델 위에 실제 하중/위험도 Heatmap과 설계-실측 불일치를 표시한다.
    var miniScale = 0.55;
    var monHeat = new THREE.Group();
    monHeat.name = 'monitor-load-risk-heatmap';
    monHeat.scale.set(miniScale, miniScale, miniScale);
    monHeat.add(makeHeatPatch(3.1, 2.35, materials.loadSafe.clone(), v(-2.6, 5.38, 1.2), 'monitor-safe-zone'));
    monHeat.add(makeHeatPatch(1.9, 1.7, materials.loadWarn.clone(), v(0.6, 5.39, 0.05), 'monitor-warn-zone'));
    monHeat.add(makeHeatPatch(1.15, 5.8, materials.loadDanger.clone(), v(4.68, 5.40, 0), 'monitor-danger-zone'));
    addRevealGroup(monHeat, 0.08, 0.74, groups.monitorLoadZones, 1);
    groups.monitor.add(monHeat);

    var monRebar = new THREE.Group();
    monRebar.name = 'monitor-rebar-layer-mismatch';
    monRebar.scale.set(miniScale, miniScale, miniScale);
    monRebar.position.set(0, 0, 0);
    var monActual = makeRebarLayer(2.7, 1.35, 6, 6, 5.40, materials.rebarActual.clone(), 'monitor-actual-rebar-one-layer');
    monActual.position.set(1.0, 0, -1.25);
    var monMissing = makeRebarLayer(2.7, 1.35, 6, 6, 5.62, materials.rebarMissing.clone(), 'monitor-missing-upper-rebar');
    monMissing.position.set(1.0, 0, -1.25);
    var monRed = makeHeatPatch(3.05, 1.78, materials.projectorRed.clone(), v(1.0, 5.44, -1.25), 'monitor-defect-red-zone');
    var monLabel = makeLabelSprite('DESIGN: 2 LAYERS\nSCAN: 1 LAYER', '#ff91a2', 'rgba(65, 0, 12, 0.88)', 560, 170);
    monLabel.position.set(1.0, 6.6, -2.7);
    monRebar.add(monRed, monActual, monMissing, monLabel);
    addRevealGroup(monRebar, 0.10, 0.76, groups.monitorRebar, 1);
    groups.monitor.add(monRebar);
  }

  function buildCocoonNet() {
    cocoonGroup = new THREE.Group();
    cocoonGroup.name = 'cocoon-net-group';
    cocoonGroup.visible = false;

    var surface = new THREE.Mesh(new THREE.SphereGeometry(0.62, 18, 12), materials.netSurface.clone());
    surface.scale.set(0.78, 1.18, 0.72);
    cocoonGroup.add(surface);

    var ring1 = ellipseLine(0.55, 0.86, 'xy');
    var ring2 = ellipseLine(0.55, 0.58, 'xz');
    var ring3 = ellipseLine(0.50, 0.86, 'zy');
    var ring4 = ellipseLine(0.38, 0.86, 'xy');
    ring4.rotation.z = Math.PI / 2.8;
    cocoonGroup.add(ring1, ring2, ring3, ring4);

    for (var i = 0; i < 6; i++) {
      var stripe = ellipseLine(0.16 + i * 0.07, 0.86, 'xy');
      stripe.rotation.y = i * Math.PI / 6;
      cocoonGroup.add(stripe);
    }

    groups.field.add(cocoonGroup);
    for (var t = 0; t < 4; t++) {
      var line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([v(0,0,0), v(0,0,0)]), materials.tether.clone());
      tetherLines.push(line);
      groups.field.add(line);
    }
  }

  function ellipseLine(a, b, plane) {
    var pts = [];
    for (var i = 0; i <= 96; i++) {
      var th = (i / 96) * Math.PI * 2;
      var x = Math.cos(th) * a;
      var y = Math.sin(th) * b;
      if (plane === 'xy') pts.push(v(x, y, 0));
      if (plane === 'xz') pts.push(v(x, 0, y));
      if (plane === 'zy') pts.push(v(0, y, x));
    }
    return new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), materials.net.clone());
  }

  function attachButtons() {
    $('btnAuto').addEventListener('click', startAuto);
    if ($('btnPause')) $('btnPause').addEventListener('click', toggleAutoPause);
    $('btnStage1').addEventListener('click', function () { setManual('construction', 1, '골조 작업이 시작되었습니다. 기둥/보/슬래브가 순차적으로 형성됩니다.'); });
    $('btnScan').addEventListener('click', function () { setManual('scan', 1, '로봇이 바닥과 골조 위에서 상시 스캔을 시작했습니다.'); });
    $('btnSync').addEventListener('click', function () { setManual('sync', 1, '스캔 데이터가 사무실 관리자 모니터의 As-built 모델로 동기화됩니다.'); });
    $('btnRisk').addEventListener('click', function () { setManual('risk', 1, '현재 시공 상태를 기반으로 하중 여유도와 추락 위험구역이 Heatmap으로 표시됩니다.'); });
    $('btnAudit').addEventListener('click', function () { setManual('audit', 1, '철근 2겹 설계 구간에서 실제 스캔은 1겹만 감지되었습니다. 관리자 모니터에 설계-실측 불일치가 빨간색으로 표시됩니다.'); });
    $('btnWorker').addEventListener('click', function () { setManual('worker', 1, '작업자가 외벽 가장자리 위험 구역에 접근했습니다. 현장 로봇과 관리자 모니터가 동시에 경고합니다.'); });
    $('btnFall').addEventListener('click', function () { setManual('fall', 1, '작업자가 건물 외측으로 추락하는 상황을 시뮬레이션합니다.'); });
    $('btnNet').addEventListener('click', function () { setManual('net', 1, '외벽 앵커 기반 고치형 투망 모듈이 최후의 보루로 전개됩니다.'); });
    $('btnReset').addEventListener('click', resetSimulation);
  }

  function startAuto() {
    sim.auto = true;
    sim.autoPaused = false;
    sim.pauseAt = 0;
    sim.autoElapsedAtPause = 0;
    sim.autoStart = performance.now();
    sim.lastLogTick = -1;
    clearLog();
    updatePauseButton();
    log('FAST AUTO DEMO START · 30초 압축 시연 시작', 'safe');
    DOM.globalStatus.textContent = 'FAST AUTO · 30s';
    DOM.caption.textContent = '30초 압축 자동 시연입니다. 로봇 스캔 → 구조 레이어 누적/실시간 분석 → 하중 위험구역 설정 → 현장 프로젝션 → 추락자 인식/계산 → 앵커 투망 고정 순서로 진행됩니다.';
  }

  function toggleAutoPause() {
    if (!sim.auto) return;
    if (!sim.autoPaused) {
      sim.autoPaused = true;
      sim.pauseAt = performance.now();
      sim.autoElapsedAtPause = (sim.pauseAt - sim.autoStart) / 1000;
      DOM.globalStatus.textContent = 'PAUSED';
      DOM.caption.textContent = '자동 시연이 일시정지되었습니다. “이어 재생”을 누르면 같은 지점부터 다시 진행됩니다.';
      log('AUTO DEMO PAUSED · 현재 장면에서 일시정지', 'warn');
    } else {
      sim.autoPaused = false;
      sim.autoStart = performance.now() - sim.autoElapsedAtPause * 1000;
      sim.pauseAt = 0;
      DOM.globalStatus.textContent = 'AUTO DEMO';
      DOM.caption.textContent = '자동 시연을 이어서 재생합니다. 저장된 진행 시점부터 다시 스캔/감리/안전 시나리오가 진행됩니다.';
      log('AUTO DEMO RESUMED · 일시정지 지점부터 이어 재생', 'safe');
    }
    updatePauseButton();
  }

  function updatePauseButton() {
    if (!DOM.btnPause) return;
    DOM.btnPause.disabled = !sim.auto;
    DOM.btnPause.textContent = sim.autoPaused ? '▶ 이어 재생' : '⏸ 일시정지';
  }

  function setManual(key, value, caption) {
    sim.auto = false;
    sim.autoPaused = false;
    sim.pauseAt = 0;
    sim.autoElapsedAtPause = 0;
    updatePauseButton();
    if (key === 'construction') sim.manual.construction = value;
    if (key === 'scan') sim.manual.scan = value;
    if (key === 'sync') sim.manual.sync = value;
    if (key === 'risk') sim.manual.risk = value;
    if (key === 'audit') sim.manual.audit = value;
    if (key === 'worker') sim.manual.worker = value;
    if (key === 'fall') sim.manual.fall = value;
    if (key === 'net') sim.manual.net = value;

    // 앞 단계가 필요한 버튼을 눌렀을 때 장면이 비어 보이지 않도록 기본 선행 조건을 자동 보정한다.
    if (key !== 'construction') sim.manual.construction = Math.max(sim.manual.construction, 1);
    if (['sync', 'risk', 'worker', 'fall', 'net'].indexOf(key) >= 0) sim.manual.scan = Math.max(sim.manual.scan, 1);
    if (['risk', 'audit', 'worker', 'fall', 'net'].indexOf(key) >= 0) sim.manual.sync = Math.max(sim.manual.sync, 1);
    if (['audit', 'worker', 'fall', 'net'].indexOf(key) >= 0) sim.manual.risk = Math.max(sim.manual.risk, 1);
    if (['worker', 'fall', 'net'].indexOf(key) >= 0) sim.manual.audit = Math.max(sim.manual.audit, 1);
    if (['fall', 'net'].indexOf(key) >= 0) sim.manual.worker = Math.max(sim.manual.worker, 1);
    if (key === 'net') sim.manual.fall = Math.max(sim.manual.fall, 1);

    DOM.globalStatus.textContent = 'MANUAL';
    DOM.caption.textContent = caption;
    log(caption, key === 'fall' || key === 'net' ? 'danger' : key === 'audit' ? 'audit' : key === 'risk' ? 'warn' : 'safe');
  }

  function resetSimulation() {
    sim.auto = false;
    sim.autoStart = 0;
    sim.autoPaused = false;
    sim.pauseAt = 0;
    sim.autoElapsedAtPause = 0;
    updatePauseButton();
    sim.manual = { construction: 0, scan: 0, sync: 0, risk: 0, audit: 0, worker: 0, fall: 0, net: 0 };
    sim.lastLogTick = -1;
    sim.packetsOn = false;
    packetTimer = 0;
    clearLog();
    log('SYSTEM READY · v3.1.2 FAST-30 초기화 완료', 'safe');
    DOM.globalStatus.textContent = 'READY';
    DOM.caption.textContent = '대기 중입니다. 자동 시연을 누르면 로봇 스캔, 구조 레이어 누적 저장, 실시간 하중 분석, 위험구역 프로젝션, 추락자 인식/궤적 계산, 외벽 앵커 투망 고정까지 약 30초로 진행됩니다.';
    DOM.fallAlert.classList.add('hidden');
  }

  function getProgress() {
    if (!sim.auto) {
      return {
        construction: sim.manual.construction,
        scan: sim.manual.scan,
        sync: sim.manual.sync,
        risk: sim.manual.risk,
        audit: sim.manual.audit || 0,
        worker: sim.manual.worker,
        fall: sim.manual.fall,
        net: sim.manual.net,
        time: performance.now() * 0.001,
        autoTime: 0
      };
    }
    var t = sim.autoPaused ? sim.autoElapsedAtPause : (performance.now() - sim.autoStart) / 1000;
    return {
      // v3.1.2 FAST-30: 발표용 자동시연을 약 30초로 압축
      // 흐름: 스캔 → 구조 레이어 누적/분석 → 하중 위험구역 → 프로젝션 → 추락 인식/계산 → 앵커 투망 고정
      construction: smooth((t - 0.4) / 6.0),
      scan: smooth((t - 1.6) / 5.2),
      sync: smooth((t - 3.0) / 6.5),
      risk: smooth((t - 9.0) / 4.2),
      audit: 0,
      worker: smooth((t - 13.0) / 4.0),
      // 추락 감지와 거의 동시에 궤적 계산/투망 전개가 시작되도록 조정
      fall: smooth((t - 19.0) / 2.2),
      net: smooth((t - 19.15) / 2.4),
      time: t,
      autoTime: t
    };
  }

  function animate() {
    requestAnimationFrame(animate);
    var dt = clock.getDelta();
    var p = getProgress();
    updateAutoLogs(p);
    updateScene(p, dt);
    fieldRenderer.render(fieldScene, fieldCamera);
    monitorRenderer.render(monitorScene, monitorCamera);
  }

  function updateScene(p, dt) {
    updateReveal(groups.construction, p.construction);
    updateReveal(groups.riskZones, Math.max(p.risk, p.worker));
    updateReveal(groups.defectMarks, Math.max(p.risk, p.audit || 0));
    updateReveal(groups.loadZones, p.risk);
    updateReveal(groups.monitorLoadZones, p.risk);
    updateReveal(groups.fieldRebar, p.audit || 0);
    updateReveal(groups.monitorRebar, p.audit || 0);
    updateReveal(groups.commandEffects, Math.max(p.worker, smooth(((p.audit || 0) - 0.55) / 0.35)));
    updateReveal(groups.launchers, Math.max(p.construction, p.risk));
    updateReveal(groups.memory, p.sync > 0.7 ? p.construction : 0);
    updateReveal(groups.monitorBuild, Math.min(p.sync, p.construction));
    updateReveal(groups.monitorRisk, p.risk);
    updateReveal(groups.monitorDefect, Math.max(p.risk, p.audit || 0));
    updateReveal(groups.monitorMemory, p.sync > 0.55 ? p.construction : 0);

    updateRobots(p);
    updateWorkers(p);
    updatePointCloud(p);
    updateCocoon(p);
    updatePackets(p, dt);
    updateDashboard(p);
    updateCamera(p);
  }

  function updateReveal(collection, progress) {
    for (var i = 0; i < collection.length; i++) {
      var obj = collection[i];
      var start = obj.userData.revealStart || 0;
      var end = obj.userData.revealEnd || 1;
      var alpha = smooth((progress - start) / Math.max(0.0001, end - start));
      obj.visible = alpha > 0.002;
      obj.traverse(function (child) {
        if (child.material) {
          child.material.transparent = true;
          var maxOpacity = obj.userData.maxOpacity;
          if (child.userData && child.userData.maxOpacity != null) maxOpacity = child.userData.maxOpacity;
          if (maxOpacity == null) maxOpacity = child.material.opacity == null ? 1 : child.material.opacity;
          child.material.opacity = alpha * maxOpacity;
        }
      });
      var s = 0.22 + 0.78 * alpha;
      if (obj.userData.originalScale) obj.scale.copy(obj.userData.originalScale).multiplyScalar(s);
    }
  }

  function updateRobots(p) {
    var activeScan = p.scan > 0.08;
    var time = p.time;
    for (var i = 0; i < groups.robots.length; i++) {
      var r = groups.robots[i];
      var minC = r.def.minConstruction || 0;
      r.group.visible = p.construction >= minC * 0.85 || r.def.type === 'ground';
      if (!r.group.visible) continue;

      var pathT = (time * r.def.speed + r.def.offset) % 1;
      var pos = pathPosition(r.def.path, pathT, r.def.type !== 'beam');
      var next = pathPosition(r.def.path, (pathT + 0.01) % 1, r.def.type !== 'beam');
      r.group.position.copy(pos);
      var dir = next.clone().sub(pos);
      if (dir.lengthSq() > 0.0001) r.group.rotation.y = Math.atan2(dir.x, dir.z);
      r.scanRing.visible = activeScan;
      r.scanLine.visible = activeScan;
      r.scanRing.material.opacity = activeScan ? 0.09 + 0.12 * Math.sin(time * 4 + i) * 0.5 + 0.06 : 0;
      r.scanLine.rotation.y = time * 5.5 + i;
      r.group.children[3].rotation.y = time * 3.2;
    }
  }

  function pathPosition(path, t, closed) {
    if (path.length === 1) return path[0].clone();
    var segments = closed ? path.length : path.length - 1;
    var scaled = t * segments;
    var idx = Math.floor(scaled) % path.length;
    var next = closed ? (idx + 1) % path.length : Math.min(idx + 1, path.length - 1);
    return vecLerp(path[idx], path[next], scaled - Math.floor(scaled));
  }

  function updateWorkers(p) {
    var time = p.time;
    for (var i = 0; i < groups.workers.length; i++) {
      var w = groups.workers[i];
      w.group.visible = p.construction >= (w.minConstruction || 0) * 0.85;
      if (!w.group.visible) continue;
      if (w.role !== 'fall') {
        animateWorkerByRole(w, time, p);
      }
    }
    updateFallWorker(p, time);
  }

  function animateWorkerByRole(w, time, p) {
    var g = w.group;
    var l = w.limbs;
    g.rotation.z = 0;
    g.rotation.x = 0;
    g.scale.set(1,1,1);

    if (w.role === 'carry') {
      var move = Math.sin(time * 0.9) * 1.1;
      g.position.set(w.basePos.x + move, w.basePos.y, w.basePos.z);
      g.rotation.y = move > 0 ? Math.PI / 2 : -Math.PI / 2;
      var walk = Math.sin(time * 5.2);
      l.leftLeg.rotation.x = walk * 0.35;
      l.rightLeg.rotation.x = -walk * 0.35;
      l.leftArm.rotation.x = -0.35;
      l.rightArm.rotation.x = -0.35;
      l.tool.scale.set(1.8, 0.8, 1.8);
      l.tool.position.set(0, 0.98, -0.32);
    } else if (w.role === 'beam') {
      var slide = Math.sin(time * 0.65) * 1.3;
      g.position.set(w.basePos.x + slide, w.basePos.y, w.basePos.z);
      g.rotation.y = Math.PI / 2;
      l.leftArm.rotation.x = Math.sin(time * 5) * 0.42 - 0.3;
      l.rightArm.rotation.x = -Math.sin(time * 5) * 0.42 - 0.3;
      l.leftLeg.rotation.x = Math.sin(time * 4) * 0.18;
      l.rightLeg.rotation.x = -Math.sin(time * 4) * 0.18;
    } else if (w.role === 'opening') {
      g.position.set(w.basePos.x + Math.sin(time * 0.8) * 0.25, w.basePos.y, w.basePos.z + Math.cos(time * 0.9) * 0.18);
      g.rotation.y = Math.sin(time) * 0.5;
      l.leftArm.rotation.x = -0.8 + Math.sin(time * 3.6) * 0.25;
      l.rightArm.rotation.x = -0.8 + Math.cos(time * 3.4) * 0.25;
      l.leftLeg.rotation.x = 0.08;
      l.rightLeg.rotation.x = -0.08;
    } else if (w.role === 'column') {
      g.rotation.y = 0.25;
      l.leftArm.rotation.z = -0.8 + Math.sin(time * 7) * 0.2;
      l.rightArm.rotation.z = 0.8 + Math.sin(time * 7 + 0.4) * 0.2;
      l.leftArm.rotation.x = -0.5;
      l.rightArm.rotation.x = -0.5;
    } else {
      g.rotation.y = -0.6;
      l.leftArm.rotation.x = Math.sin(time * 1.5) * 0.12;
      l.rightArm.rotation.x = -Math.sin(time * 1.5) * 0.12;
    }
  }

  function updateFallWorker(p, time) {
    if (!fallWorker) return;
    var w = fallWorker;
    var g = w.group;
    g.visible = p.construction > 0.5;
    if (!g.visible) return;

    var approach = p.worker;
    var fall = p.fall;
    var net = p.net;
    var start = v(3.35, 5.38, 0.35);
    var edge = v(5.18, 5.38, 0.35);
    var captured = v(6.58, 3.48 + Math.sin(time * 2.4) * 0.055, 0.20 + Math.sin(time * 1.4) * 0.045);

    if (fall <= 0.02) {
      var pos = vecLerp(start, edge, approach);
      g.position.copy(pos);
      g.rotation.set(0, Math.PI / 2, 0);
      var fidget = Math.sin(time * 4.2);
      w.limbs.leftArm.rotation.x = -0.45 + fidget * 0.18;
      w.limbs.rightArm.rotation.x = -0.35 - fidget * 0.16;
      w.limbs.leftLeg.rotation.x = fidget * 0.1;
      w.limbs.rightLeg.rotation.x = -fidget * 0.1;
      if (approach > 0.55) g.rotation.z = -0.08 - approach * 0.08;
    } else if (net < 0.12) {
      // 짧은 순간만 낙하가 보이고, 곧바로 투망 계산/포획으로 넘어간다.
      var tf = smooth(fall);
      var outward = v(5.18 + 0.95 * tf, 5.38 - 1.25 * tf - 0.18 * tf * tf, 0.35 + 0.12 * Math.sin(tf * Math.PI));
      g.position.copy(outward);
      g.rotation.set(0.55 * tf, Math.PI / 2 + 0.75 * tf, -0.45 * tf);
      w.limbs.leftArm.rotation.x = -1.2;
      w.limbs.rightArm.rotation.x = -1.0;
      w.limbs.leftLeg.rotation.x = 0.8;
      w.limbs.rightLeg.rotation.x = -0.65;
    } else {
      var netCatch = smooth(net / 0.55);
      var fallingPos = v(5.95, 4.25, 0.35);
      g.position.copy(vecLerp(fallingPos, captured, netCatch));
      g.rotation.set(0.15 * Math.sin(time * 2), Math.PI / 2, -0.22 + 0.08 * Math.sin(time * 2.1));
      g.scale.set(0.92, 0.92, 0.92);
      w.limbs.leftArm.rotation.x = -0.85;
      w.limbs.rightArm.rotation.x = -0.85;
      w.limbs.leftLeg.rotation.x = 0.15;
      w.limbs.rightLeg.rotation.x = -0.15;
    }
  }

  function updatePointCloud(p) {
    if (!pointCloud) return;
    var count = Math.floor(850 * Math.max(0, Math.min(p.scan, p.sync)));
    pointCloud.geometry.setDrawRange(0, count);
    pointCloud.rotation.y += 0.0015;
    pointCloud.material.opacity = p.scan > 0.05 ? 0.88 : 0;
  }

  function updateCocoon(p) {
    var net = p.net;
    var fall = p.fall;
    var center = v(6.58, 3.48 + Math.sin(p.time * 2.4) * 0.055, 0.2 + Math.sin(p.time * 1.4) * 0.045);
    cocoonGroup.visible = net > 0.005 || fall > 0.08;
    if (cocoonGroup.visible) {
      // 추락과 동시에 그물이 계산되어 발사되는 느낌을 위해 초반 전개 속도를 빠르게 보정
      var launch = smooth(net / 0.55);
      var pre = v(5.55, 4.55, 0.2);
      cocoonGroup.position.copy(vecLerp(pre, center, launch));
      var scale = 0.18 + 0.82 * launch;
      cocoonGroup.scale.set(scale, scale, scale);
      cocoonGroup.rotation.y = Math.sin(p.time * 1.2) * 0.12;
      cocoonGroup.rotation.z = Math.sin(p.time * 2.0) * 0.06;
      cocoonGroup.traverse(function (child) {
        if (child.material) child.material.opacity = (child.type === 'Line' ? 0.35 + 0.65 * launch : 0.18 * launch);
      });
    }

    var anchors = groups.launchers.map(function (l) { return l.userData.anchor; });
    for (var i = 0; i < tetherLines.length; i++) {
      var line = tetherLines[i];
      line.visible = net > 0.015 || fall > 0.12;
      if (!line.visible) continue;
      var geo = new THREE.BufferGeometry().setFromPoints([anchors[i] || v(5.62,4,0), center]);
      line.geometry.dispose();
      line.geometry = geo;
      line.material.opacity = 0.35 + 0.6 * smooth(net / 0.55);
    }
  }

  function updatePackets(p, dt) {
    var on = p.scan > 0.12 && p.sync > 0.08;
    if (!on) return;
    packetTimer += dt;
    if (packetTimer > 0.38) {
      packetTimer = 0;
      spawnPacket(p);
    }
  }

  function spawnPacket(p) {
    if (!DOM.packetLayer) return;
    var el = document.createElement('div');
    el.className = 'packet';
    el.style.left = (28 + Math.random() * 18) + '%';
    el.style.top = (18 + Math.random() * 58) + '%';
    el.style.background = p.risk > 0.5 ? 'var(--yellow)' : 'var(--blue)';
    DOM.packetLayer.appendChild(el);
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 1400);
  }

  function updateDashboard(p) {
    var constructionPercent = Math.round(p.construction * 100);
    var scanPercent = Math.round(Math.min(p.scan, p.sync || p.scan) * 100);
    DOM.metricProgress.textContent = constructionPercent + '%';
    DOM.metricScan.textContent = scanPercent + '%';
    DOM.barProgress.style.width = constructionPercent + '%';
    DOM.barScan.style.width = scanPercent + '%';

    if (p.net > 0.65) {
      DOM.metricRisk.textContent = 'EVENT RECORDED';
      DOM.metricDefect.textContent = 'DATA LOCKED';
      DOM.metricWorker.textContent = 'RESCUE REQUIRED';
      DOM.fallAlert.classList.remove('hidden');
      DOM.fallAlert.textContent = 'COCOON NET CAPTURED';
    } else if (p.fall > 0.25) {
      DOM.metricRisk.textContent = 'CRITICAL';
      DOM.metricDefect.textContent = p.risk > 0.45 ? 'LOAD PATH' : 'NONE';
      DOM.metricWorker.textContent = 'FALL EVENT';
      DOM.fallAlert.classList.remove('hidden');
      DOM.fallAlert.textContent = 'OUTER-FACADE FALL DETECTED';
    } else if ((p.audit || 0) > 0.72 && p.worker < 0.25) {
      DOM.metricRisk.textContent = 'HIGH ZONE';
      DOM.metricDefect.textContent = 'REBAR LAYER MISSING';
      DOM.metricWorker.textContent = 'WORK STOP';
      DOM.fallAlert.classList.remove('hidden');
      DOM.fallAlert.textContent = 'REBAR MISMATCH DETECTED';
    } else if (p.worker > 0.45) {
      DOM.metricRisk.textContent = 'HIGH';
      DOM.metricDefect.textContent = 'REBAR LAYER MISSING';
      DOM.metricWorker.textContent = 'ROBOT WARNING';
      DOM.fallAlert.classList.remove('hidden');
      DOM.fallAlert.textContent = 'WORKER NEAR EDGE';
    } else if (p.risk > 0.45) {
      DOM.metricRisk.textContent = 'MEDIUM';
      DOM.metricDefect.textContent = 'LOAD PATH';
      DOM.metricWorker.textContent = 'NORMAL';
      DOM.fallAlert.classList.add('hidden');
    } else {
      DOM.metricRisk.textContent = 'LOW';
      DOM.metricDefect.textContent = 'NONE';
      DOM.metricWorker.textContent = 'NORMAL';
      DOM.fallAlert.classList.add('hidden');
    }
    if (DOM.metricDesign) {
      if (p.risk > 0.45) DOM.metricDesign.textContent = 'LOAD CALC';
      else if (p.sync > 0.4) DOM.metricDesign.textContent = 'LAYER SYNC';
      else DOM.metricDesign.textContent = 'SCANNING';
    }
    if (DOM.metricCommand) {
      if (p.net > 0.18) DOM.metricCommand.textContent = 'ANCHOR NET';
      else if (p.fall > 0.20) DOM.metricCommand.textContent = 'TRAJECTORY CALC';
      else if (p.worker > 0.45) DOM.metricCommand.textContent = 'PROJECT WARNING';
      else if (p.risk > 0.45) DOM.metricCommand.textContent = 'RISK ZONE SET';
      else DOM.metricCommand.textContent = 'STANDBY';
    }
    if (DOM.auditCard) {
      if ((p.audit || 0) > 0.45 && !sim.auto) DOM.auditCard.classList.remove('hidden');
      else DOM.auditCard.classList.add('hidden');
    }
  }

  function updateCamera(p) {
    var t = p.time;
    var autoBias = sim.auto ? 1 : 0;
    var fieldTarget = v(0, 2.75, 0);
    if (p.worker > 0.35 || p.fall > 0.01 || p.net > 0.01) fieldTarget = v(4.8, 4.3, 0.2);
    var desired = v(11 - 1.6 * p.worker + 0.55 * Math.sin(t * 0.12) * autoBias, 8.2, 12.5 - 1.4 * p.worker);
    if (p.fall > 0.01 || p.net > 0.01) desired = v(10.5, 6.2, 8.2);
    fieldCamera.position.lerp(desired, 0.045);
    fieldCamera.lookAt(fieldTarget);

    monitorCamera.position.x = 7.8 + Math.sin(t * 0.22) * 0.25;
    monitorCamera.position.z = 8.2 + Math.cos(t * 0.18) * 0.25;
    monitorCamera.lookAt(0, 2.4, 0);
  }

  function updateAutoLogs(p) {
    if (!sim.auto) return;
    var checkpoints = [
      { t: 0.8, msg: '로봇 주변 상황 스캔 시작 · 기준 좌표계 생성', cls: 'safe', cap: '현장 로봇들이 주변 골조와 작업면을 빠르게 스캔하고, 기준 좌표계를 생성합니다.' },
      { t: 3.5, msg: '골조/슬래브 형상 데이터 수집 · point cloud 업로드', cls: 'safe', cap: '로봇 스캔 데이터가 서버로 전송되고, 오른쪽 관리자 모니터에 구조 레이어가 누적되기 시작합니다.' },
      { t: 7.5, msg: 'As-built 구조 레이어 누적 저장 · 실시간 계산 분석', cls: 'memory', cap: '관리자는 실제 시공 상태가 차곡차곡 쌓이는 구조 레이어와 실시간 분석 결과를 확인합니다.' },
      { t: 11.5, msg: '시공 단계 하중 계산 · 주의/위험 구역 설정', cls: 'warn', cap: '완성 후 구조가 아니라 현재 지어진 상태 기준으로 하중을 계산해 주의/위험 구역을 설정합니다.' },
      { t: 15.0, msg: '현장 로봇 명령 수신 · 위험구역 빔프로젝터 경고', cls: 'danger', cap: '서버 분석 결과를 받은 현장 로봇이 위험 구역에 빔프로젝터 경고를 쏩니다.' },
      { t: 19.0, msg: '추락 발생과 동시에 로봇 간 신호 공유 · 추락자 인식', cls: 'danger', cap: '작업자가 외벽 방향으로 떨어지는 순간, 주변 로봇들이 즉시 신호를 공유하고 추락자 위치를 인식합니다.' },
      { t: 20.0, msg: '즉시 궤적 계산 · 외벽 앵커 투망 동시 전개', cls: 'danger', cap: '추락 직후 서버와 로봇이 궤적을 계산하고, 외벽 앵커에서 고치형 투망이 거의 동시에 발사됩니다.' },
      { t: 22.0, msg: '고치형 투망 포획 · 에너지 흡수 테더로 현수 고정', cls: 'danger', cap: '그물망이 작업자를 고치처럼 감싸고, 에너지 흡수 테더가 충격을 줄이며 바로 구조 가능한 상태로 고정합니다.' },
      { t: 29.0, msg: '사고/구조 로그 저장 · 관리자 모니터 기록 완료', cls: 'memory', cap: '스캔 데이터, 위험구역 설정, 추락자 인식, 투망 고정 결과가 관리자 로그로 저장됩니다.' }
    ];
    for (var i = 0; i < checkpoints.length; i++) {
      if (p.autoTime >= checkpoints[i].t && sim.lastLogTick < checkpoints[i].t) {
        log(checkpoints[i].msg, checkpoints[i].cls);
        DOM.caption.textContent = checkpoints[i].cap;
        sim.lastLogTick = checkpoints[i].t;
      }
    }
  }

  function log(text, cls) {
    var item = document.createElement('div');
    item.className = 'logItem ' + (cls || '');
    var now = new Date();
    var hh = String(now.getHours()).padStart(2, '0');
    var mm = String(now.getMinutes()).padStart(2, '0');
    var ss = String(now.getSeconds()).padStart(2, '0');
    item.textContent = '[' + hh + ':' + mm + ':' + ss + '] ' + text;
    DOM.eventLog.prepend(item);
    while (DOM.eventLog.children.length > 12) DOM.eventLog.removeChild(DOM.eventLog.lastChild);
  }

  function clearLog() {
    DOM.eventLog.innerHTML = '';
  }

  function resizeRenderers() {
    resizeOne(DOM.fieldCanvas, fieldRenderer, fieldCamera);
    resizeOne(DOM.monitorCanvas, monitorRenderer, monitorCamera);
  }

  function resizeOne(host, renderer, camera) {
    var w = Math.max(1, host.clientWidth);
    var h = Math.max(1, host.clientHeight);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
