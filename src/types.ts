// Public plan schema (the card's Lovelace YAML `plan:` block) and the
// normalized internal config the 3D engine consumes.

export type WallSide = 'north' | 'south' | 'east' | 'west';
export type WallKind = 'solid' | 'open' | 'window' | 'door';
export type FloorKind = 'oak' | 'walnut' | 'tile' | 'stone';

export interface RoomDef {
  id: string;
  name?: string;
  /** Origin of the room on the floor plane, metres. `y` is the floor's z axis. */
  x: number;
  y: number;
  width: number;
  length: number;
  height?: number;
  floor?: FloorKind;
  /** Per-side wall override; defaults to "solid". */
  walls?: Partial<Record<WallSide, WallKind>>;
  rect?: [number, number, number, number];
}

export interface OpeningDef {
  /** `${roomId}_${side}`, e.g. "living_room_south". */
  wallId: string;
  /** Metres from the start of the wall (clockwise from the room's min corner). */
  offset: number;
  width: number;
  /** Doors: opening height (default 2.1). Windows: glass height (default 1.2). */
  height?: number;
  /** Windows only: sill height, default 0.85. */
  sill?: number;
}

export interface FurnitureDef {
  type: string;
  roomId?: string;
  x?: number;
  y?: number;
  pos?: [number, number];
  rot?: number;
  /** Degrees, clockwise seen from above. */
  rotation?: number;
  [key: string]: unknown;
}

export interface LightDef {
  id: string;
  roomId?: string;
  room?: string;
  name?: string;
  x?: number;
  y?: number;
  z?: number;
  pos?: [number, number];
  fixture?: string;
  type?: string;
  rot?: number;
  length?: number;
  capabilities?: string[];
}

export interface AcDef {
  id: string;
  roomId?: string;
  room?: string;
  name?: string;
  wall: WallSide;
  x?: number;
  y: number;
  pos?: [number, number];
}

export interface Plan {
  name?: string;
  wallHeight?: number;
  interiorWallHeight?: number;
  scenes?: Array<{ id: string; name: string; icon?: string; lights?: Record<string, { on?: boolean; brightness?: number; temp?: number; color?: string }>; acs?: Record<string, { on?: boolean }> }>;
  outdoorTemp?: number;
  camera?: { azimuth?: number; elevation?: number };
  rooms: RoomDef[];
  doors?: OpeningDef[];
  windows?: OpeningDef[];
  openings?: NormOpening[];
  furniture?: FurnitureDef[];
  lights?: LightDef[];
  acs?: AcDef[];
}

/* ---------- normalized internal config ---------- */

export interface NormRoom {
  id: string;
  name: string;
  x: number;
  z: number;
  w: number;
  d: number;
  floor: string;
}

export interface NormOpening {
  type: 'door' | 'window' | 'open';
  /** Axis-aligned wall segment, [x, z] pairs. */
  from: [number, number];
  to: [number, number];
  sill: number;
  head: number;
}

export interface NormFurniture {
  type: string;
  pos: [number, number];
  rot: number;
  y?: number;
  [key: string]: unknown;
}

export type LightFixture = 'ceiling' | 'pendant' | 'spots' | 'floor' | 'table' | 'strip';

export interface NormLight {
  id: string;
  name: string;
  room: string;
  capabilities: string[];
  pos: [number, number];
  /** Fixture height, metres. */
  y: number;
  type: LightFixture;
  rot: number;
  intensity?: number;
  length?: number;
}

export interface NormAc {
  id: string;
  name: string;
  room: string;
  pos: [number, number];
  /** Mounting height, metres. */
  y: number;
  wall: WallSide;
}

export interface NormConfig {
  name: string;
  wallHeight: number;
  interiorWallHeight: number;
  camera: { azimuth: number; elevation: number };
  rooms: NormRoom[];
  openings: NormOpening[];
  furniture: NormFurniture[];
  lightUnits: NormLight[];
  acUnits: NormAc[];
  scenes: NonNullable<Plan['scenes']>;
  bounds: { minX: number; minZ: number; maxX: number; maxZ: number };
}
