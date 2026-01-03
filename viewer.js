import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export function createViewer(containerId, modelPath) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error('Container not found!');
    return;
  }

  // Dark scene for maximum drama
  const scene = new THREE.Scene();
  let model = null;  // Declare model here so animate() can access it
  scene.background = new THREE.Color(0x000000); // Pure black background

  // Camera
  const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(2, 2, 3);
  camera.lookAt(0, 0, 0);

  // Renderer with high-quality shadows
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  // Almost no ambient light – everything comes from the spotlight
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.05); // Tiny fill only
  scene.add(ambientLight);

  // Main dramatic narrow spotlight (theater-style cone beam)
  const spotLight = new THREE.SpotLight(0xffffff, 85); // Very high intensity
  spotLight.position.set(-5, 2, 4);                  // High angle from left
  spotLight.angle = Math.PI / 10;                     // Super narrow (~7° beam)
  spotLight.penumbra = 0.05;                          // Nearly hard edges
  spotLight.decay = 2;                                // Strong realistic falloff
  spotLight.distance = 0;

  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 2048;              // Crisp shadows
  spotLight.shadow.mapSize.height = 2048;
  spotLight.shadow.camera.near = 1;
  spotLight.shadow.camera.far = 30;

  spotLight.target.position.set(0, 0, 0);
  scene.add(spotLight);
  scene.add(spotLight.target);

  // Optional subtle rim light for extra pop (cool blue tint)
  const rimLight = new THREE.SpotLight(0x4488ff, 5);
  rimLight.position.set(6, 8, -6);
  rimLight.angle = Math.PI / 15;
  rimLight.penumbra = 0.3;
  rimLight.decay = 2;
  rimLight.target.position.set(0, 0, 0);
  scene.add(rimLight);
  scene.add(rimLight.target);

  // Controls
  // const controls = new OrbitControls(camera, renderer.domElement);
  // controls.enableDamping = true;
  // controls.dampingFactor = 0.05;
  // controls.enableZoom = true;
  // controls.enablePan = false;
    // Controls disabled – model auto-rotates only, no user interaction
  // const controls = new OrbitControls(camera, renderer.domElement);  // ← Commented out

  // Load model
  const loader = new GLTFLoader();
loader.load(
  modelPath,
  (gltf) => {
    const loadedModel = gltf.scene;
    loadedModel.scale.set(2.8, 2.8, 2.8);
    loadedModel.rotation.y = -Math.PI / 1.2;

    // ← CORRECT WAY: Use loadedModel here, not model →
    const box = new THREE.Box3().setFromObject(loadedModel);
    const size = box.getSize(new THREE.Vector3());
    loadedModel.position.y = size.y / 5 + 0.7;  

    // Enable shadows
    loadedModel.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    scene.add(loadedModel);
    model = loadedModel;  // ← Only now assign to outer model for rotation
    console.log('Model loaded and lifted correctly!');
  },
  (progress) => console.log(`Loading: ${(progress.loaded / progress.total * 100).toFixed(0)}%`),
  (error) => console.error('Load error:', error)
);

  // Animation loop with smooth auto-rotation
  function animate() {
    requestAnimationFrame(animate);
    
    if (model) {
      model.rotation.y += 0.005;  // smooth slow clockwise rotation
    }
    
    // controls.update();
    renderer.render(scene, camera);
  }
  animate();

  // Resize
  function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }
  window.addEventListener('resize', onWindowResize);

  return { renderer };
}