// Small modelling kit: cached materials, primitive helpers and procedural floor
// textures. Ported from 0xProbabillity/house-control `web/src/three/kit.js`.
// DOM-dependent texture generation degrades to plain colors when `document` is
// unavailable (e.g. Node-side verification), so scene building stays headless-safe.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const materials = new Map<string, THREE.MeshStandardMaterial>();

export function mat(
  color: string,
  { rough = 0.85, metal = 0, emissive = null as string | null, emissiveIntensity = 1, opacity = 1 } = {},
): THREE.MeshStandardMaterial {
  const key = [color, rough, metal, emissive, emissiveIntensity, opacity].join('|');
  let m = materials.get(key);
  if (!m) {
    m = new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal });
    if (emissive) {
      m.emissive = new THREE.Color(emissive);
      m.emissiveIntensity = emissiveIntensity;
    }
    if (opacity < 1) {
      m.transparent = true;
      m.opacity = opacity;
    }
    materials.set(key, m);
  }
  return m;
}

/** Box standing on y = 0, centred on x/z. */
export function box(w: number, h: number, d: number, material: THREE.Material, { r = 0.02 } = {}): THREE.Mesh {
  const radius = Math.max(0, Math.min(r, Math.min(w, h, d) / 2 - 0.001));
  const geo = radius > 0.002 ? new RoundedBoxGeometry(w, h, d, 2, radius) : new THREE.BoxGeometry(w, h, d);
  geo.translate(0, h / 2, 0);
  return new THREE.Mesh(geo, material);
}

/** Cylinder standing on y = 0. */
export function cyl(rTop: number, rBottom: number, h: number, material: THREE.Material, seg = 28): THREE.Mesh {
  const geo = new THREE.CylinderGeometry(rTop, rBottom, h, seg);
  geo.translate(0, h / 2, 0);
  return new THREE.Mesh(geo, material);
}

export function at<T extends THREE.Object3D>(obj: T, x = 0, y = 0, z = 0): T {
  obj.position.set(x, y, z);
  return obj;
}

export function shadows(root: THREE.Object3D, cast = true, receive = true): THREE.Object3D {
  root.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) {
      (o as THREE.Mesh).castShadow = cast;
      (o as THREE.Mesh).receiveShadow = receive;
    }
  });
  return root;
}

/** Deterministic pseudo-random so a plan always renders identically. */
export function rng(seed: number): () => number {
  let s = seed >>> 0 || 1;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------- floor textures ---------- */

const TILE = 2.4; // metres covered by one texture repeat

function canvasTexture(size: number, draw: (g: CanvasRenderingContext2D, s: number) => void): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null; // headless (Node) fallback
  const c = document.createElement('canvas');
  c.width = c.height = size;
  draw(c.getContext('2d')!, size);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function shade(hex: string, amount: number): string {
  const c = new THREE.Color(hex);
  const hsl = { h: 0, s: 0, l: 0 };
  c.getHSL(hsl);
  c.setHSL(hsl.h, hsl.s, Math.min(1, Math.max(0, hsl.l + amount)));
  return `#${c.getHexString()}`;
}

function planks(base: string): THREE.CanvasTexture | null {
  return canvasTexture(1024, (g, s) => {
    const rand = rng(base.length * 97 + base.charCodeAt(3));
    const rows = 16;
    const rh = s / rows;
    for (let r = 0; r < rows; r++) {
      let x = -rand() * s * 0.5;
      while (x < s) {
        const len = s * (0.35 + rand() * 0.35);
        g.fillStyle = shade(base, (rand() - 0.5) * 0.09);
        g.fillRect(x, r * rh, len, rh);
        g.fillStyle = 'rgba(0,0,0,0.28)';
        g.fillRect(x, r * rh, 1.5, rh);
        g.strokeStyle = 'rgba(0,0,0,0.05)';
        for (let k = 0; k < 3; k++) {
          const y = r * rh + rand() * rh;
          g.beginPath();
          g.moveTo(x, y);
          g.lineTo(x + len, y + (rand() - 0.5) * 3);
          g.stroke();
        }
        x += len;
      }
      g.fillStyle = 'rgba(0,0,0,0.3)';
      g.fillRect(0, r * rh, s, 1.5);
    }
  });
}

function tiles(base: string, perSide: number, grout: string): THREE.CanvasTexture | null {
  return canvasTexture(512, (g, s) => {
    const rand = rng(perSide * 31 + base.charCodeAt(2));
    const t = s / perSide;
    g.fillStyle = grout;
    g.fillRect(0, 0, s, s);
    for (let i = 0; i < perSide; i++) {
      for (let j = 0; j < perSide; j++) {
        g.fillStyle = shade(base, (rand() - 0.5) * 0.05);
        g.fillRect(i * t + 2, j * t + 2, t - 4, t - 4);
      }
    }
  });
}

const FLOORS: Record<string, { tex: () => THREE.CanvasTexture | null; color: string; rough: number }> = {
  oak: { tex: () => planks('#c7a47c'), color: '#c7a47c', rough: 0.75 },
  walnut: { tex: () => planks('#94705a'), color: '#94705a', rough: 0.75 },
  tile: { tex: () => tiles('#d5dade', 4, '#aab0b8'), color: '#d5dade', rough: 0.55 },
  stone: { tex: () => tiles('#a2a7ae', 3, '#7c828b'), color: '#a2a7ae', rough: 0.55 },
};

const floorMaterials = new Map<string, THREE.MeshStandardMaterial>();

export function floorMaterial(kind: string): THREE.MeshStandardMaterial {
  const name = FLOORS[kind] ? kind : 'oak';
  if (!floorMaterials.has(name)) {
    const def = FLOORS[name];
    const tex = def.tex();
    floorMaterials.set(
      name,
      new THREE.MeshStandardMaterial(
        tex
          ? { map: tex, roughness: def.rough }
          : { color: def.color, roughness: def.rough },
      ),
    );
  }
  return floorMaterials.get(name)!;
}

/** Floor quad whose UVs are in world metres, so every room shares one texture scale. */
export function floorMesh(room: NormRoomLike, kind: string): THREE.Mesh {
  const geo = new THREE.PlaneGeometry(room.w, room.d);
  geo.rotateX(-Math.PI / 2);
  geo.translate(room.x + room.w / 2, 0, room.z + room.d / 2);
  const pos = geo.attributes.position!;
  const uv = geo.attributes.uv!;
  for (let i = 0; i < pos.count; i++) uv.setXY(i, pos.getX(i) / TILE, pos.getZ(i) / TILE);
  const mesh = new THREE.Mesh(geo, floorMaterial(kind));
  mesh.receiveShadow = true;
  return mesh;
}

interface NormRoomLike {
  x: number;
  z: number;
  w: number;
  d: number;
}
