// Turns the rooms + openings of a plan into floors, walls, doors and windows.
// Ported from 0xProbabillity/house-control `web/src/three/house.js` (single-level).
import * as THREE from 'three';
import { box, mat, at, floorMesh } from './kit';
import type { NormConfig, NormOpening, NormRoom } from '../types';

const EXT_T = 0.2;   // exterior wall thickness
const INT_T = 0.1;   // interior wall thickness
const CURB = 0.14;   // height of the cut-away walls on the camera side
const EPS = 1e-4;
const NEAR = 0.15;   // how squarely an outer wall must face the camera to be cut away
const NEAR_BAND = 0.05; // ...and how far past that before it changes its mind
const WALL_TIME = 0.28; // seconds for a wall to sink or rise

const key = (v: number) => Math.round(v * 1000);

interface Segment {
  axis: 'x' | 'z';
  c: number;
  a: number;
  b: number;
  kind: 'interior' | 'exterior';
  inside: number;
  opening: (NormOpening & { a: number; b: number }) | null;
  freeA?: boolean;
  freeB?: boolean;
}

// Splits every room edge into wall segments, classifying each as exterior /
// interior and attaching the opening (door, window, ...) that covers it, if any.
function wallSegments(rooms: NormRoom[], openings: NormOpening[]): Segment[] {
  const lines = new Map<string, { axis: 'x' | 'z'; c: number; edges: { a: number; b: number; inside: number }[]; openings: (NormOpening & { a: number; b: number })[] }>();
  const line = (axis: 'x' | 'z', c: number) => {
    const k = `${axis}:${key(c)}`;
    if (!lines.has(k)) lines.set(k, { axis, c, edges: [], openings: [] });
    return lines.get(k)!;
  };

  for (const r of rooms) {
    line('x', r.z).edges.push({ a: r.x, b: r.x + r.w, inside: 1 });
    line('x', r.z + r.d).edges.push({ a: r.x, b: r.x + r.w, inside: -1 });
    line('z', r.x).edges.push({ a: r.z, b: r.z + r.d, inside: 1 });
    line('z', r.x + r.w).edges.push({ a: r.z, b: r.z + r.d, inside: -1 });
  }
  for (const o of openings) {
    const alongX = o.from[1] === o.to[1];
    const k = alongX ? `x:${key(o.from[1])}` : `z:${key(o.from[0])}`;
    const l = lines.get(k);
    if (!l) continue; // opening that is not on any wall: ignore
    const p = alongX ? [o.from[0], o.to[0]] : [o.from[1], o.to[1]];
    l.openings.push({ ...o, a: Math.min(...p), b: Math.max(...p) });
  }

  const segments: Segment[] = [];
  for (const l of lines.values()) {
    const pts = [...new Set([...l.edges, ...l.openings].flatMap((e) => [key(e.a), key(e.b)]))]
      .sort((p, q) => p - q)
      .map((p) => p / 1000);
    const run: Segment[] = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const mid = (pts[i] + pts[i + 1]) / 2;
      const covering = l.edges.filter((e) => e.a < mid && mid < e.b);
      if (!covering.length) continue;
      const seg: Segment = {
        axis: l.axis,
        c: l.c,
        a: pts[i],
        b: pts[i + 1],
        kind: covering.length > 1 ? 'interior' : 'exterior',
        inside: covering[0].inside,
        opening: l.openings.find((o) => o.a < mid && mid < o.b) || null,
      };
      const prev = run[run.length - 1];
      if (prev && Math.abs(prev.b - seg.a) < EPS && prev.kind === seg.kind && prev.inside === seg.inside && prev.opening === seg.opening) {
        prev.b = seg.b;
      } else run.push(seg);
    }
    // Free ends get a small extension so corners close up.
    run.forEach((s, i) => {
      s.freeA = !(run[i - 1] && Math.abs(run[i - 1].b - s.a) < EPS);
      s.freeB = !(run[i + 1] && Math.abs(run[i + 1].a - s.b) < EPS);
    });
    segments.push(...run);
  }
  return segments;
}

export interface House {
  group: THREE.Group;
  floors: THREE.Mesh[];
  /** The camera looks from (dx, dz), a horizontal unit vector. First call sets walls at once. */
  view(dx: number, dz: number): void;
  /** 'moving' while a wall sinks/rises, 'stopped' on the frame the last one rests, else null. */
  update(dt: number): 'moving' | 'stopped' | null;
}

// Builds one floor of the home standing on y = 0. Outer walls facing the camera
// sink to a curb so the rooms stay in view.
export function buildHouse(config: NormConfig): House {
  const group = new THREE.Group();
  const floors: THREE.Mesh[] = [];
  const H = config.wallHeight;
  const Hi = Math.min(config.interiorWallHeight, H);
  const rooms = config.rooms;
  const openings = config.openings;
  const { minX, minZ, maxX, maxZ } = config.bounds;

  // Plinth the model stands on.
  const plinth = box(maxX - minX + 0.7, 0.3, maxZ - minZ + 0.7, mat('#141927', { rough: 0.9 }), { r: 0.12 });
  at(plinth, (minX + maxX) / 2, -0.305, (minZ + maxZ) / 2);
  plinth.receiveShadow = true;
  group.add(plinth);

  for (const room of rooms) {
    const floor = floorMesh(room, room.floor);
    floor.userData = { kind: 'room', id: room.id };
    floors.push(floor);
    group.add(floor);
  }

  const wallBody = mat('#e7e3db', { rough: 0.95 });
  const wallCap = mat('#262b3a', { rough: 0.8 });
  const wallMats = [wallBody, wallBody, wallCap, wallBody, wallBody, wallBody];
  const blocker = new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false });
  const glass = new THREE.MeshStandardMaterial({
    color: '#9cc0ff',
    roughness: 0.08,
    transparent: true,
    opacity: 0.22,
    emissive: '#3d5fae',
    emissiveIntensity: 0.5,
  });
  const frame = mat('#2c3142', { rough: 0.6 });

  // A wall piece running from a..b along its axis, between heights y0..y1.
  const piece = (
    s: Segment,
    a: number,
    b: number,
    y0: number,
    y1: number,
    t: number,
    materials: THREE.Material | THREE.Material[] = wallMats,
    parent: THREE.Object3D = group,
  ): THREE.Mesh => {
    const len = b - a;
    const geo = s.axis === 'x' ? new THREE.BoxGeometry(len, y1 - y0, t) : new THREE.BoxGeometry(t, y1 - y0, len);
    const m = new THREE.Mesh(geo, materials);
    const mid = (a + b) / 2;
    m.position.set(s.axis === 'x' ? mid : s.c, (y0 + y1) / 2, s.axis === 'x' ? s.c : mid);
    m.castShadow = m.receiveShadow = true;
    parent.add(m);
    return m;
  };

  // The four sides of the floor, each with its outer walls standing and cut away.
  const sides = new Map<string, { nx: number; nz: number; tall: THREE.Group; curb: THREE.Group; near: boolean | null; up: number }>();
  const sideOf = (nx: number, nz: number) => {
    const k = `${nx},${nz}`;
    if (!sides.has(k)) {
      const side = { nx, nz, tall: new THREE.Group(), curb: new THREE.Group(), near: null, up: 1 };
      group.add(side.tall, side.curb);
      sides.set(k, side);
    }
    return sides.get(k)!;
  };

  for (const s of wallSegments(rooms, openings)) {
    const exterior = s.kind === 'exterior';
    const t = exterior ? EXT_T : INT_T;
    const a = s.a - (s.freeA ? EXT_T / 2 : 0);
    const b = s.b + (s.freeB ? EXT_T / 2 : 0);
    const type = s.opening?.type;
    let parent: THREE.Object3D = group;

    if (exterior) {
      // Outward normal of an exterior wall points away from its room.
      const side = sideOf(s.axis === 'z' ? -s.inside : 0, s.axis === 'x' ? -s.inside : 0);
      if (type !== 'door') piece(s, a, b, 0, CURB, t, wallMats, side.curb);
      parent = side.tall;
    }
    if (type === 'door' || type === 'open') continue;

    const height = exterior ? H : Hi;
    if (type === 'window' && exterior) {
      const { sill, head } = s.opening!;
      piece(s, a, b, 0, sill, t, wallMats, parent);
      piece(s, a, b, Math.min(head, H), H, t, wallMats, parent);
      const pane = piece(s, a, b, sill, head, 0.03, glass, parent);
      pane.castShadow = false;
      const fw = 0.05;
      const bars: [number, number, number, number][] = [
        [a, a + fw, sill, head],
        [b - fw, b, sill, head],
        [a, b, sill, sill + fw],
        [a, b, head - fw, head],
      ];
      if (b - a > 1.2) bars.push([(a + b) / 2 - fw / 2, (a + b) / 2 + fw / 2, sill, head]);
      for (const [fa, fb, y0, y1] of bars) piece(s, fa, fb, y0, y1, 0.07, frame, parent);
      continue;
    }
    if (type === 'window') continue; // a window in an interior wall is just a gap

    piece(s, a, b, 0, height, t, wallMats, parent);
    // Interior walls are drawn cut low, but lamps should still be contained by the
    // real, full-height wall: an invisible shadow caster fills in the missing part.
    if (!exterior && Hi < H) piece(s, a, b, Hi, H, 0.04, blocker).receiveShadow = false;
  }

  const low = CURB / H;
  const pose = (side: { curb: THREE.Group; tall: THREE.Group; up: number }) => {
    const sunk = side.up === 0;
    side.curb.visible = sunk;
    side.tall.visible = !sunk;
    side.tall.scale.y = low + (1 - low) * side.up * side.up * (3 - 2 * side.up);
  };

  return {
    group,
    floors,
    view(dx: number, dz: number) {
      for (const side of sides.values()) {
        const facing = side.nx * dx + side.nz * dz;
        if (side.near === null) {
          side.near = facing > NEAR;
          side.up = side.near ? 0 : 1;
          pose(side);
        } else {
          side.near = facing > NEAR + (side.near ? -NEAR_BAND : NEAR_BAND);
        }
      }
    },
    update(dt: number) {
      let moving = false;
      let stopped = false;
      for (const side of sides.values()) {
        const goal = side.near ? 0 : 1;
        if (side.up === goal) continue;
        const step = dt / WALL_TIME;
        side.up = goal > side.up ? Math.min(goal, side.up + step) : Math.max(goal, side.up - step);
        pose(side);
        if (side.up === goal) stopped = true;
        else moving = true;
      }
      return moving ? 'moving' : stopped ? 'stopped' : null;
    },
  };
}
