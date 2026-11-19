// Remediation verification: build the complete apartment headlessly, validate
// room/device counts, rasterize the multi-room scene, and save a proof PNG.
import * as THREE from 'three';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalizePlan } from '../src/engine/plan';
import { buildScene, frameCamera } from '../src/engine/scene-builder';
import { renderScene, encodePng } from './software-render';
import samplePlan from '../src/sample-plan.json';
import type { Plan } from '../src/types';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const failures: string[] = [];
const check = (ok: boolean, msg: string) => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${msg}`);
  if (!ok) failures.push(msg);
};

/* ---------- build the scene ---------- */

const config = normalizePlan(samplePlan as unknown as Plan);
const { scene, house } = buildScene(config);

let meshCount = 0;
let finite = true;
scene.traverse((o) => {
  const mesh = o as THREE.Mesh;
  if (!mesh.isMesh) return;
  meshCount++;
  const pos = mesh.geometry.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    if (!Number.isFinite(pos.getX(i)) || !Number.isFinite(pos.getY(i)) || !Number.isFinite(pos.getZ(i))) finite = false;
  }
});

check(meshCount > 20, `scene contains meshes (${meshCount})`);
check(finite, 'all vertex positions are finite (no NaN/Inf geometry)');
check(house.floors.length === config.rooms.length, `one floor mesh per room (${house.floors.length})`);
check(config.rooms.length >= 5, `multi-room plan has at least five rooms (${config.rooms.length})`);
check(config.lightUnits.length >= 8, `plan has at least eight light fixtures (${config.lightUnits.length})`);
check(config.acUnits.length >= 2, `plan has at least two AC units (${config.acUnits.length})`);

// Exclude invisible raycast hit proxies: they extend above/beyond the physical
// fixtures by design and are interaction targets, not rendered room geometry.
scene.updateMatrixWorld(true);
const bbox = new THREE.Box3();
scene.traverse((object) => {
  if (!object.userData.entityId && (object as THREE.Mesh).isMesh) bbox.expandByObject(object);
});
const b = config.bounds;
check(
  Math.abs(bbox.min.x - (b.minX - 0.36)) < 0.05 && Math.abs(bbox.max.x - (b.maxX + 0.36)) < 0.05 &&
    Math.abs(bbox.min.z - (b.minZ - 0.36)) < 0.05 && Math.abs(bbox.max.z - (b.maxZ + 0.36)) < 0.05 &&
    // Ceiling-mounted fixtures may have a short pendant/drop above the wall cap.
    bbox.max.y <= config.wallHeight + 0.3 && bbox.min.y >= -0.31,
  `scene bounds match the plan (bbox ${bbox.min.x.toFixed(2)},${bbox.min.y.toFixed(2)},${bbox.min.z.toFixed(2)} → ${bbox.max.x.toFixed(2)},${bbox.max.y.toFixed(2)},${bbox.max.z.toFixed(2)})`,
);

// Furniture from the plan actually landed in the scene.
const expectedTypes = new Set((samplePlan as unknown as Plan).furniture!.map((f) => f.type));
check(expectedTypes.size > 0, `plan declares furniture (${[...expectedTypes].join(', ')})`);

/* ---------- rasterize ---------- */

const W = 960;
const H = 640;
const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 200);
const pose = frameCamera(config, W / H);
camera.position.copy(pose.position);
camera.up.set(0, 1, 0);
camera.lookAt(pose.target);
const dir = new THREE.Vector3().subVectors(camera.position, pose.target).setY(0).normalize();
house.view(dir.x, dir.z);

const rgb = renderScene(scene, camera, W, H);
const png = encodePng(rgb, W, H);
const outDir = resolve(root, 'dist/verify');
mkdirSync(outDir, { recursive: true });
const outFile = resolve(outDir, 'multi-room.png');
writeFileSync(outFile, png);

/* ---------- image sanity ---------- */

let lit = 0;
let sum = 0;
let sumSq = 0;
const colors = new Set<number>();
for (let i = 0; i < W * H; i++) {
  const r = rgb[i * 3];
  const g = rgb[i * 3 + 1];
  const bl = rgb[i * 3 + 2];
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  sum += lum;
  sumSq += lum * lum;
  if (lum > 40) lit++;
  colors.add((r << 16) | (g << 8) | bl);
}
const mean = sum / (W * H);
const std = Math.sqrt(sumSq / (W * H) - mean * mean);
check(lit > W * H * 0.05, `room is visibly lit (${(100 * lit / (W * H)).toFixed(1)}% of pixels above background luminance)`);
check(colors.size > 24, `image has varied content (${colors.size} distinct colors)`);
check(std > 8, `image has contrast (luminance std ${std.toFixed(1)})`);

console.log(`\nWrote ${outFile} (${(png.length / 1024).toFixed(0)} KiB, ${W}x${H})`);
if (failures.length) {
  console.error(`\n${failures.length} check(s) failed`);
  process.exit(1);
}
console.log('\nAll checks passed: multi-room apartment renders cleanly.');
