import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import typefaceFont from "three/examples/fonts/helvetiker_regular.typeface.json";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("textures/matcaps/9.jpg");

const matcapDonutBoxTexture = textureLoader.load("textures/matcaps/11.jpg");
matcapTexture.colorSpace = THREE.SRGBColorSpace;
matcapDonutBoxTexture.colorSpace = THREE.SRGBColorSpace;

/**
 * Fonts
 */
const fontLoader = new FontLoader();

fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  // Material
  const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
  const boxMaterial = new THREE.MeshMatcapMaterial({
    matcap: matcapDonutBoxTexture,
  });
  // Text
  const textGeometry = new TextGeometry("Chora Club", {
    font: font,
    size: 0.5,
    depth: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });
  textGeometry.center();

  const text = new THREE.Mesh(textGeometry, material);
  scene.add(text);

  // const axesHelper = new THREE.AxesHelper();
  // scene.add(axesHelper);
  // Donuts
  const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 32, 64);
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  for (let i = 0; i < 300; i++) {
    let object;
    if (i % 2 === 0) {
      object = new THREE.Mesh(donutGeometry, boxMaterial);
    } else {
      object = new THREE.Mesh(boxGeometry, boxMaterial);
    }

    object.position.x =
      (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 9.5 + 0.5);
    object.position.y =
      (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 9.5 + 0.5);
    object.position.z =
      (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 9.5 + 0.5);
    object.rotation.x = Math.random() * Math.PI;
    object.rotation.y = Math.random() * Math.PI;
    const scale = Math.random();
    object.scale.set(scale, scale, scale);

    scene.add(object);
  }
});

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 4;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
