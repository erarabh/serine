// lib/heroScene.ts

import * as THREE from 'three';

/**
 * Initialize the hero scene on the given canvas.
 * @param canvas HTMLCanvasElement where the scene will be rendered
 */
export function initHeroScene(
  canvas: HTMLCanvasElement
): {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
} {
  // 1. Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // 2. Scene
  const scene = new THREE.Scene();

  // 3. Camera
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 1.5, 3);
  scene.add(camera);

  // 4. Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
  directionalLight.position.set(5, 10, 7.5);
  scene.add(directionalLight);

  // 5. Phone Group
  const phoneGroup = new THREE.Group();

  // 5.1 Phone Body
  const bodyGeometry = new THREE.BoxGeometry(1, 2, 0.2);
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  phoneGroup.add(body);

  // 5.2 Phone Screen (with emissive glow)
  const screenGeometry = new THREE.BoxGeometry(0.9, 1.6, 0.11);
  const screenMaterial = new THREE.MeshPhongMaterial({
    color: 0x000066,
    emissive: 0x001122,
    shininess: 10,
  });
  const screen = new THREE.Mesh(screenGeometry, screenMaterial);
  screen.position.set(0, 0, 0.015);
  phoneGroup.add(screen);

  // 5.3 Screen Glow
  const glowGeometry = new THREE.BoxGeometry(0.95, 1.65, 0.12);
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0x000066,
    transparent: true,
    opacity: 0.5,
  });
  const glow = new THREE.Mesh(glowGeometry, glowMaterial);
  glow.position.set(0, 0, 0.02);
  phoneGroup.add(glow);

  scene.add(phoneGroup);

  // 6. Handle Resize
  window.addEventListener('resize', () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  // 7. Animation Loop
  const animate = () => {
    requestAnimationFrame(animate);
    phoneGroup.rotation.y += 0.005;
    renderer.render(scene, camera);
  };
  animate();

  return { renderer, scene, camera };
}
