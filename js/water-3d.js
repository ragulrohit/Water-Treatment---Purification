import * as THREE from 'https://unpkg.com/three@0.165.0/build/three.module.js';

const sceneEl = document.getElementById('waterPurificationScene');

if (sceneEl) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  sceneEl.appendChild(renderer.domElement);
  sceneEl.classList.add('rendered');

  const group = new THREE.Group();
  scene.add(group);

  camera.position.set(0, 0.4, 8);

  const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
  const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
  keyLight.position.set(3, 5, 5);
  const aquaLight = new THREE.PointLight(0x48cae4, 4, 12);
  aquaLight.position.set(-3, -1, 3);
  scene.add(ambientLight, keyLight, aquaLight);

  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x8be8ff,
    transmission: 0.45,
    thickness: 0.7,
    roughness: 0.08,
    metalness: 0,
    clearcoat: 1,
    transparent: true,
    opacity: 0.82,
  });

  const blueMaterial = new THREE.MeshStandardMaterial({
    color: 0x0077b6,
    roughness: 0.28,
    metalness: 0.16,
  });

  const whiteMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.22,
    metalness: 0.05,
  });

  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.25, 4), glassMaterial);
  group.add(core);

  const ringOne = new THREE.Mesh(
    new THREE.TorusGeometry(1.9, 0.045, 18, 140),
    blueMaterial
  );
  const ringTwo = ringOne.clone();
  ringTwo.rotation.x = Math.PI / 2;
  const ringThree = ringOne.clone();
  ringThree.rotation.y = Math.PI / 2;
  group.add(ringOne, ringTwo, ringThree);

  const filterColumn = new THREE.Mesh(
    new THREE.CylinderGeometry(0.34, 0.34, 3.5, 36),
    whiteMaterial
  );
  filterColumn.position.x = 2.7;
  group.add(filterColumn);

  const capMaterial = new THREE.MeshStandardMaterial({
    color: 0x00b4d8,
    roughness: 0.22,
    metalness: 0.18,
  });

  [-1.85, 1.85].forEach((y) => {
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.18, 36), capMaterial);
    cap.position.set(2.7, y, 0);
    group.add(cap);
  });

  const pipeMaterial = new THREE.MeshStandardMaterial({
    color: 0x90e0ef,
    roughness: 0.18,
    metalness: 0.12,
  });

  const pipe = new THREE.Mesh(new THREE.TorusGeometry(2.55, 0.035, 12, 120, Math.PI), pipeMaterial);
  pipe.rotation.z = Math.PI / 2;
  pipe.position.x = 1.35;
  group.add(pipe);

  const particleMaterial = new THREE.MeshStandardMaterial({
    color: 0x00b4d8,
    roughness: 0.2,
    emissive: 0x023e8a,
    emissiveIntensity: 0.15,
  });

  const particles = Array.from({ length: 26 }, (_, index) => {
    const particle = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 16), particleMaterial);
    particle.userData = {
      angle: (index / 26) * Math.PI * 2,
      radius: 2.15 + (index % 5) * 0.12,
      speed: 0.45 + (index % 4) * 0.08,
      lift: -1.25 + (index % 9) * 0.32,
    };
    group.add(particle);
    return particle;
  });

  function resize() {
    const rect = sceneEl.getBoundingClientRect();
    renderer.setSize(rect.width, rect.height, false);
    camera.aspect = rect.width / Math.max(rect.height, 1);
    camera.updateProjectionMatrix();
  }

  const clock = new THREE.Clock();

  function animate() {
    const time = clock.getElapsedTime();
    group.rotation.y = Math.sin(time * 0.32) * 0.22;
    core.rotation.x = time * 0.22;
    core.rotation.y = time * 0.34;
    ringOne.rotation.z = time * 0.42;
    ringTwo.rotation.y = time * 0.36;
    ringThree.rotation.x = time * 0.32;
    filterColumn.rotation.y = time * 0.24;

    particles.forEach((particle) => {
      const { angle, radius, speed, lift } = particle.userData;
      const orbit = angle + time * speed;
      particle.position.set(
        Math.cos(orbit) * radius,
        lift + Math.sin(time * 0.9 + angle) * 0.18,
        Math.sin(orbit) * radius * 0.45
      );
    });

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  resize();
  animate();
  window.addEventListener('resize', resize);
}
