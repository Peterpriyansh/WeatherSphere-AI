let globeRenderer = null;
let globeScene = null;
let globeCamera = null;
let globeSphere = null;
let globeAtmosphere = null;
let globeFrame = null;

function initGlobe() {
  const canvas = document.getElementById("globeCanvas");
  if (!canvas || !window.THREE) return;

  destroyGlobe();

  globeScene = new THREE.Scene();
  globeCamera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
  globeCamera.position.z = 3.2;

  globeRenderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true
  });

  globeRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const geometry = new THREE.SphereGeometry(1.1, 64, 64);
  const material = new THREE.MeshPhongMaterial({
    color: 0x5ea7ff,
    shininess: 40,
    specular: 0x9fdfff
  });

  globeSphere = new THREE.Mesh(geometry, material);
  globeScene.add(globeSphere);

  const atmosphereGeometry = new THREE.SphereGeometry(1.16, 64, 64);
  const atmosphereMaterial = new THREE.MeshBasicMaterial({
    color: 0x7dd3fc,
    transparent: true,
    opacity: 0.14
  });

  globeAtmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
  globeScene.add(globeAtmosphere);

  const ambient = new THREE.AmbientLight(0xffffff, 1.2);
  globeScene.add(ambient);

  const directional = new THREE.DirectionalLight(0xffffff, 1.2);
  directional.position.set(5, 3, 5);
  globeScene.add(directional);

  createStars();

  resizeGlobe();
  animateGlobe();

  window.addEventListener("resize", resizeGlobe);
}

function createStars() {
  const count = 250;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 30;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.03
  });

  const stars = new THREE.Points(geometry, material);
  globeScene.add(stars);
}

function resizeGlobe() {
  if (!globeRenderer || !globeCamera) return;

  const canvas = globeRenderer.domElement;
  const width = canvas.clientWidth || canvas.parentElement.clientWidth || 600;
  const height = canvas.clientHeight || canvas.parentElement.clientHeight || 360;

  globeRenderer.setSize(width, height, false);
  globeCamera.aspect = width / height;
  globeCamera.updateProjectionMatrix();
}

function animateGlobe() {
  globeFrame = requestAnimationFrame(animateGlobe);

  if (globeSphere) globeSphere.rotation.y += 0.003;
  if (globeAtmosphere) globeAtmosphere.rotation.y += 0.004;

  globeRenderer.render(globeScene, globeCamera);
}

function destroyGlobe() {
  if (globeFrame) {
    cancelAnimationFrame(globeFrame);
    globeFrame = null;
  }
  if (globeRenderer) {
    globeRenderer.dispose();
    globeRenderer = null;
  }
  globeScene = null;
  globeCamera = null;
  globeSphere = null;
  globeAtmosphere = null;
}

window.AtmosGlobe = {
  initGlobe
};