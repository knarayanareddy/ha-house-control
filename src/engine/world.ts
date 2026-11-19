// The 3D stage: renderer, camera, lights, resize handling and a render-on-demand
// loop (no continuous 60fps rendering while the scene is static — Phase 2 goal).
// Adapted from 0xProbabillity/house-control `web/src/three/world.js`.
import * as THREE from 'three';
import { buildScene, frameCamera } from './scene-builder';
import type { NormConfig } from '../types';
import type { LightingManager } from './lighting-manager';
import type { AcSimulator } from './ac-simulator';

export const STAGE_BG = '#0a0e1a';

export interface WorldOptions {
  background?: string;
  entities?: { lights?: Record<string, string>; climates?: Record<string, string> };
}

export interface WorldHandle {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  lighting: LightingManager;
  acs: AcSimulator;
  resize(): void;
  /** Mark the scene dirty; the loop renders the owed frames on the next rAF. */
  requestRender(frames?: number): void;
  /** Render a single frame immediately (used by tests/screenshots). */
  renderNow(): void;
  /** Point the cut-away walls at the camera direction. */
  viewFromCamera(): void;
  dispose(): void;
}

export function createWorld(canvas: HTMLCanvasElement, config: NormConfig, opts: WorldOptions = {}): WorldHandle {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'default' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(opts.background ?? STAGE_BG);

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 200);
  const pose = frameCamera(config, 1);
  camera.position.copy(pose.position);
  camera.up.set(0, 1, 0);
  camera.lookAt(pose.target);

  const { house, lighting, acs } = buildScene(config, scene, opts.entities);

  // Night-time ambience plus a "moon" key light that casts the shadows.
  scene.add(new THREE.HemisphereLight(0x8ea6ff, 0x0b0e17, 0.5));
  const { minX, minZ, maxX, maxZ } = config.bounds;
  const span = Math.max(maxX - minX, maxZ - minZ);
  const moon = new THREE.DirectionalLight(0xa9c0ff, 1.1);
  moon.position.set((minX + maxX) / 2 + 4, 10, (minZ + maxZ) / 2 - 4);
  moon.castShadow = true;
  moon.shadow.mapSize.set(1024, 1024);
  const sc = moon.shadow.camera;
  sc.left = sc.bottom = -span * 0.85;
  sc.right = sc.top = span * 0.85;
  sc.near = 1;
  sc.far = 30;
  moon.shadow.bias = -0.0008;
  moon.shadow.normalBias = 0.04;
  scene.add(moon, moon.target);
  moon.target.position.set((minX + maxX) / 2, 0, (minZ + maxZ) / 2);

  // Cut the outer walls facing the initial camera.
  const dir = new THREE.Vector3().subVectors(camera.position, pose.target).setY(0).normalize();
  house.view(dir.x, dir.z);

  /* ---------- render-on-demand loop ---------- */

  let raf = 0;
  let awake = 0;
  let disposed = false;

  function requestRender(frames = 2) {
    awake = Math.max(awake, frames);
    if (!raf && !disposed) raf = requestAnimationFrame(tick);
  }

  function tick() {
    raf = 0;
    const animating = house.update(1 / 60) != null || lighting.update(1 / 60) || acs.update(1 / 60);
    if (awake > 0 || animating) {
      renderer.render(scene, camera);
      awake = Math.max(0, awake - 1);
      if (awake > 0 || animating) raf = requestAnimationFrame(tick);
    }
  }

  /* ---------- sizing ---------- */

  function resize() {
    const parent = canvas.parentElement;
    const w = parent?.clientWidth || canvas.clientWidth || 1;
    const h = parent?.clientHeight || canvas.clientHeight || 1;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    requestRender(3);
  }

  const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
  if (observer && canvas.parentElement) observer.observe(canvas.parentElement);
  window.addEventListener('resize', resize);
  resize();
  requestRender(4);

  return {
    scene,
    camera,
    renderer,
    lighting,
    acs,
    resize,
    requestRender,
    renderNow() {
      renderer.render(scene, camera);
    },
    viewFromCamera() {
      const target = new THREE.Vector3();
      camera.getWorldDirection(target);
      house.view(-target.x, -target.z);
      requestRender(30);
    },
    dispose() {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      window.removeEventListener('resize', resize);
      observer?.disconnect();
      scene.traverse((o) => {
        const renderable = o as THREE.Mesh | THREE.Points | THREE.Line;
        if (renderable.geometry) renderable.geometry.dispose();
        const material = renderable.material as THREE.Material | THREE.Material[] | undefined;
        if (material) (Array.isArray(material) ? material : [material]).forEach((m) => m.dispose());
      });
      renderer.dispose();
    },
  };
}
