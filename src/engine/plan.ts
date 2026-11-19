// Normalizes the public plan schema (project.md §2.3) into the internal config
// the 3D engine consumes: rooms become axis-aligned rects, doors/windows become
// axis-aligned wall openings with from/to points.
import type { LightFixture, NormAc, NormConfig, NormFurniture, NormLight, NormOpening, NormRoom, OpeningDef, Plan, RoomDef, WallSide } from '../types';

export class PlanError extends Error {}

const SIDES: WallSide[] = ['north', 'east', 'south', 'west'];

/** The two endpoints of a room's wall, as [x, z] points. */
function wallEnds(room: RoomDef, side: WallSide): { from: [number, number]; to: [number, number] } {
  const { x, y, width: w, length: d } = room;
  switch (side) {
    case 'north': return { from: [x, y], to: [x + w, y] };
    case 'south': return { from: [x, y + d], to: [x + w, y + d] };
    case 'west': return { from: [x, y], to: [x, y + d] };
    case 'east': return { from: [x + w, y], to: [x + w, y + d] };
  }
}

function parseWallId(wallId: string): { roomId: string; side: WallSide } {
  const idx = wallId.lastIndexOf('_');
  if (idx < 0) throw new PlanError(`Opening wallId "${wallId}" must look like "<roomId>_<side>"`);
  const roomId = wallId.slice(0, idx);
  const side = wallId.slice(idx + 1) as WallSide;
  if (!SIDES.includes(side)) throw new PlanError(`Opening wallId "${wallId}" has unknown side "${side}"`);
  return { roomId, side };
}

function openingFromDef(def: OpeningDef, rooms: Map<string, RoomDef>, kind: 'door' | 'window'): NormOpening {
  const { roomId, side } = parseWallId(def.wallId);
  const room = rooms.get(roomId);
  if (!room) throw new PlanError(`Opening "${def.wallId}" refers to unknown room "${roomId}"`);
  const { from, to } = wallEnds(room, side);
  const alongX = from[1] === to[1];
  const o = Math.min(Math.max(def.offset, 0), (alongX ? room.width : room.length) - def.width);
  const a = alongX ? from[0] + o : from[1] + o;
  const b = a + def.width;
  const sill = kind === 'window' ? (def.sill ?? 0.85) : 0;
  const height = def.height ?? (kind === 'door' ? 2.1 : 1.2);
  return {
    type: kind,
    from: alongX ? [a, from[1]] : [from[0], a],
    to: alongX ? [b, from[1]] : [from[0], b],
    sill,
    head: sill + height,
  };
}

/** Fallback openings for `walls: { north: "open" | "window" }` entries. */
function sideOpenings(room: RoomDef): NormOpening[] {
  const out: NormOpening[] = [];
  for (const side of SIDES) {
    const kind = room.walls?.[side];
    if (kind !== 'open' && kind !== 'window') continue;
    const { from, to } = wallEnds(room, side);
    const len = Math.hypot(to[0] - from[0], to[1] - from[1]);
    const width = kind === 'open' ? len : Math.min(1.4, len * 0.6);
    const offset = (len - width) / 2;
    const alongX = from[1] === to[1];
    const a = (alongX ? from[0] : from[1]) + offset;
    out.push({
      type: kind,
      from: alongX ? [a, from[1]] : [from[0], a],
      to: alongX ? [a + width, from[1]] : [from[0], a + width],
      sill: kind === 'window' ? 0.85 : 0,
      head: kind === 'window' ? 2.05 : 2.1,
    });
  }
  return out;
}

export function normalizePlan(plan: Plan): NormConfig {
  if (!plan || !Array.isArray(plan.rooms) || plan.rooms.length === 0) {
    throw new PlanError('Plan needs at least one room in "rooms"');
  }
  const wallHeight = plan.wallHeight ?? plan.rooms.find((r) => r.height != null)?.height ?? 2.8;

  const rooms: NormRoom[] = plan.rooms.map((r) => {
    const [x, z, w, d] = r.rect ?? [r.x, r.y, r.width, r.length];
    if (!(w > 0 && d > 0)) throw new PlanError(`Room "${r.id}" has an empty rect`);
    return { id: r.id, name: r.name || r.id, x, z, w, d, floor: r.floor || 'oak' };
  });
  const roomMap = new Map(plan.rooms.map((r) => [r.id, r]));

  const openings: NormOpening[] = [...(plan.openings ?? [])];
  for (const room of plan.rooms) if (!room.rect) openings.push(...sideOpenings(room));
  for (const d of plan.doors ?? []) openings.push(openingFromDef(d, roomMap, 'door'));
  for (const w of plan.windows ?? []) openings.push(openingFromDef(w, roomMap, 'window'));

  const furniture: NormFurniture[] = (plan.furniture ?? []).map((f) => ({
    ...f,
    y: 0,
    pos: f.pos ?? [f.x ?? 0, f.y ?? 0],
    rot: f.rot ?? f.rotation ?? 0,
  }));

  const fixtureMap: Record<string, LightFixture> = { ceiling: 'ceiling', pendant: 'pendant', ceiling_pendant: 'pendant', spots: 'spots', floor: 'floor', floor_lamp: 'floor', table: 'table', table_lamp: 'table', strip: 'strip', lamp: 'table' };
  const lightUnits: NormLight[] = (plan.lights ?? []).map((l) => {
    const type = fixtureMap[l.type ?? l.fixture ?? 'pendant'] ?? 'pendant';
    const pos = l.pos ?? [l.x ?? 0, l.y ?? 0];
    return { id: l.id, name: l.name ?? l.id, room: l.room ?? l.roomId ?? '', capabilities: l.capabilities ?? ['brightness'], pos, y: l.z ?? l.y ?? (type === 'ceiling' || type === 'spots' ? wallHeight - .15 : type === 'floor' ? 1.4 : type === 'table' ? .5 : type === 'strip' ? 1.4 : 1.8), type, rot: l.rot ?? 0, length: l.length };
  });
  const acUnits: NormAc[] = (plan.acs ?? []).map((a) => {
    const roomId = a.room ?? a.roomId ?? '';
    const room = rooms.find((r) => r.id === roomId);
    if (!room) throw new PlanError(`AC "${a.id}" refers to unknown room "${roomId}"`);
    let pos: [number, number];
    if (a.pos) pos = a.pos;
    else switch (a.wall) {
      case 'north': pos = [room.x + (a.x ?? 0), room.z]; break;
      case 'south': pos = [room.x + (a.x ?? 0), room.z + room.d]; break;
      case 'west': pos = [room.x, room.z + (a.x ?? 0)]; break;
      case 'east': pos = [room.x + room.w, room.z + (a.x ?? 0)]; break;
    }
    return { id: a.id, name: a.name ?? a.id, room: roomId, pos, y: a.y, wall: a.wall };
  });

  const minX = Math.min(...rooms.map((r) => r.x));
  const minZ = Math.min(...rooms.map((r) => r.z));
  const maxX = Math.max(...rooms.map((r) => r.x + r.w));
  const maxZ = Math.max(...rooms.map((r) => r.z + r.d));

  return {
    name: plan.name || 'Home',
    wallHeight,
    interiorWallHeight: Math.min(plan.interiorWallHeight ?? 1.25, wallHeight),
    camera: { azimuth: plan.camera?.azimuth ?? 34, elevation: plan.camera?.elevation ?? 47 },
    rooms,
    openings,
    furniture,
    lightUnits,
    acUnits,
    scenes: plan.scenes ?? [],
    bounds: { minX, minZ, maxX, maxZ },
  };
}
