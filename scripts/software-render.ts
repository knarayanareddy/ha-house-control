// Minimal CPU rasterizer used to verify a scene renders without a GPU/WebGL.
// Painter's-algorithm triangle fill with flat lambert + hemisphere-ish shading,
// output as a PNG (hand-rolled encoder on top of node:zlib).
import * as THREE from 'three';
import { deflateSync } from 'node:zlib';

interface Triangle {
  sx: [number, number, number];
  sy: [number, number, number];
  depth: number;
  color: [number, number, number];
}

const LIGHT_DIR = new THREE.Vector3(-0.45, -1, -0.35).normalize();

export function renderScene(scene: THREE.Scene, camera: THREE.PerspectiveCamera, width: number, height: number): Uint8Array {
  scene.updateMatrixWorld(true);
  camera.updateMatrixWorld(true);
  const view = new THREE.Matrix4().copy(camera.matrixWorldInverse);
  const proj = camera.projectionMatrix;

  const meshes: THREE.Mesh[] = [];
  scene.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) meshes.push(o as THREE.Mesh);
  });

  const tris: Triangle[] = [];
  const v = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
  const n = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
  const tmp = new THREE.Vector3();
  const toCam = new THREE.Vector3();

  for (const mesh of meshes) {
    const geo = mesh.geometry;
    const pos = geo.attributes.position;
    const nor = geo.attributes.normal;
    if (!pos || !nor) continue;
    const material = mesh.material as THREE.MeshStandardMaterial;
    if (material.transparent) continue; // glass panes: skipped in the CPU pass
    const base = material.color ?? new THREE.Color('#ffffff');
    const emissive = material.emissive ?? new THREE.Color('#000000');
    const eIntensity = material.emissiveIntensity ?? 1;
    const normalMat = new THREE.Matrix3().getNormalMatrix(mesh.matrixWorld);

    const index = geo.index;
    const triCount = index ? index.count / 3 : pos.count / 3;
    for (let t = 0; t < triCount; t++) {
      const vi = index ? [index.getX(t * 3), index.getX(t * 3 + 1), index.getX(t * 3 + 2)] : [t * 3, t * 3 + 1, t * 3 + 2];
      let behind = false;
      const depths: number[] = [];
      const sx: number[] = [];
      const sy: number[] = [];
      let navg = new THREE.Vector3();
      const clip = new THREE.Vector4();
      for (let k = 0; k < 3; k++) {
        v[k].fromBufferAttribute(pos, vi[k]).applyMatrix4(mesh.matrixWorld);
        n[k].fromBufferAttribute(nor, vi[k]).applyMatrix3(normalMat).normalize();
        navg.add(n[k]);
        tmp.copy(v[k]).applyMatrix4(view);
        if (tmp.z > -0.05) behind = true; // behind the near plane
        depths.push(-tmp.z);
        clip.set(tmp.x, tmp.y, tmp.z, 1).applyMatrix4(proj);
        sx.push((clip.x / clip.w * 0.5 + 0.5) * width);
        sy.push((1 - (clip.y / clip.w * 0.5 + 0.5)) * height);
      }
      if (behind) continue;
      navg.normalize();
      // Backface cull: keep triangles whose normal faces the camera.
      toCam.copy(camera.position).sub(v[0]);
      if (navg.dot(toCam) <= 0) continue;

      const lambert = Math.max(0, navg.dot(LIGHT_DIR.clone().negate()));
      const hemi = 0.5 + 0.5 * navg.y;
      const intensity = 0.35 + 0.55 * lambert + 0.25 * hemi;
      tris.push({
        sx: [sx[0], sx[1], sx[2]],
        sy: [sy[0], sy[1], sy[2]],
        depth: (depths[0] + depths[1] + depths[2]) / 3,
        color: [
          Math.min(255, base.r * 255 * intensity + emissive.r * 255 * eIntensity),
          Math.min(255, base.g * 255 * intensity + emissive.g * 255 * eIntensity),
          Math.min(255, base.b * 255 * intensity + emissive.b * 255 * eIntensity),
        ],
      });
    }
  }

  // Painter's algorithm: far to near.
  tris.sort((a, b) => b.depth - a.depth);

  const img = new Uint8Array(width * height * 3);
  const bg = [10, 14, 26]; // STAGE_BG
  img.fill(0);
  for (let i = 0; i < width * height; i++) {
    img[i * 3] = bg[0];
    img[i * 3 + 1] = bg[1];
    img[i * 3 + 2] = bg[2];
  }

  for (const tri of tris) {
    fillTriangle(img, width, height, tri);
  }
  return img;
}

function fillTriangle(img: Uint8Array, w: number, h: number, tri: Triangle): void {
  const minX = Math.max(0, Math.floor(Math.min(...tri.sx)));
  const maxX = Math.min(w - 1, Math.ceil(Math.max(...tri.sx)));
  const minY = Math.max(0, Math.floor(Math.min(...tri.sy)));
  const maxY = Math.min(h - 1, Math.ceil(Math.max(...tri.sy)));
  const d = (tri.sy[1] - tri.sy[2]) * (tri.sx[0] - tri.sx[2]) + (tri.sx[2] - tri.sx[1]) * (tri.sy[0] - tri.sy[2]);
  if (Math.abs(d) < 1e-6) return;
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const w0 = ((tri.sy[1] - tri.sy[2]) * (x - tri.sx[2]) + (tri.sx[2] - tri.sx[1]) * (y - tri.sy[2])) / d;
      const w1 = ((tri.sy[2] - tri.sy[0]) * (x - tri.sx[2]) + (tri.sx[0] - tri.sx[2]) * (y - tri.sy[2])) / d;
      const w2 = 1 - w0 - w1;
      if (w0 < 0 || w1 < 0 || w2 < 0) continue;
      const i = (y * w + x) * 3;
      img[i] = tri.color[0];
      img[i + 1] = tri.color[1];
      img[i + 2] = tri.color[2];
    }
  }
}

/* ---------- PNG encoding (truecolor RGB, no filtering) ---------- */

let crcTable: Int32Array | null = null;

function crc32(buf: Buffer): number {
  if (!crcTable) {
    crcTable = new Int32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      crcTable[n] = c;
    }
  }
  const table = crcTable;
  let crc = -1;
  for (let i = 0; i < buf.length; i++) crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  return (crc ^ -1) >>> 0;
}

function chunk(type: string, data: Buffer): Buffer {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

export function encodePng(rgb: Uint8Array, width: number, height: number): Buffer {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type: truecolor RGB
  const raw = Buffer.alloc((width * 3 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 3 + 1)] = 0; // filter: none
    Buffer.from(rgb.buffer, y * width * 3, width * 3).copy(raw, y * (width * 3 + 1) + 1);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}
