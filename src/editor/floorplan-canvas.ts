import { LitElement, html, svg, css, type PropertyValues } from 'lit';
import type { Plan, RoomDef, NormOpening, FurnitureDef, LightDef, AcDef, FloorKind } from '../types';

const NS = 'http://www.w3.org/2000/svg';
const SNAP = .1;
const MIN_ROOM = .6;
const FLOOR: Record<string,string> = { oak:'#253346', walnut:'#2c2522', tile:'#1e2d3d', stone:'#202936' };
const snap = (v:number) => Math.round(v / SNAP) * SNAP;

export function screenToMetres(group:SVGGraphicsElement,screenX:number,screenY:number):[number,number]{
  const svg=group.ownerSVGElement!;
  const p=svg.createSVGPoint();
  p.x=screenX; p.y=screenY;
  const q=p.matrixTransform(group.getScreenCTM()!.inverse());
  return [q.x,q.y];
}
export function metresToScreen(group:SVGGraphicsElement,x:number,z:number):[number,number]{
  const svg=group.ownerSVGElement!;
  const p=svg.createSVGPoint();
  p.x=x; p.y=z;
  const q=p.matrixTransform(group.getScreenCTM()!);
  return [q.x,q.y];
}

type Mode = 'select'|'add-room'|'add-door'|'add-window'|'add-light'|'add-ac'|'add-furniture';
type Selection = { kind:'room'|'opening'|'light'|'ac'|'furniture'; id:string; index:number };

/** A metre-coordinate SVG editor. Changes are emitted as `plan-changed` events. */
export class FloorplanCanvas extends LitElement {
  static properties = {
    plan: { attribute: false },
    selected: { state: true },
    mode: { state: true },
    zoom: { state: true },
    panX: { state: true },
    panY: { state: true }
  };

  declare plan: Plan;
  declare selected?: Selection;
  declare mode: Mode;
  declare zoom: number;
  declare panX: number;
  declare panY: number;

  constructor() {
    super();
    this.mode = 'select';
    this.zoom = 1;
    this.panX = 36;
    this.panY = 34;
  }

  private pointers = new Map<number,{x:number;y:number}>();
  private gesture?: {
    kind: string;
    id: string;
    index: number;
    handle?: string;
    start: [number, number];
    room?: RoomDef;
    opening?: NormOpening;
    startZoom?: number;
    startDistance?: number;
    startCenter?: [number, number];
  };
  private roomCounter = 1;

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      box-sizing: border-box;
      color: var(--primary-text-color, #eee);
      font: 13px/1.35 system-ui, sans-serif;
      position: relative;
    }
    .toolbar {
      display: flex;
      gap: 5px;
      flex-wrap: wrap;
      padding: 7px;
      background: #151b28;
      border-radius: 8px 8px 0 0;
      align-items: center;
      flex-shrink: 0;
    }
    .toolbar button {
      border: 1px solid #495264;
      background: #232c3d;
      color: inherit;
      border-radius: 6px;
      padding: 6px 9px;
      cursor: pointer;
      font-size: 12px;
      transition: all 0.15s ease;
    }
    .toolbar button:hover {
      background: #2f3b50;
      border-color: #60a5fa;
    }
    .toolbar button.active {
      background: #385c8c;
      border-color: #83b5ff;
      color: #fff;
    }
    .toolbar .divider {
      width: 1px;
      height: 20px;
      background: #334155;
      margin: 0 4px;
    }
    .inspector {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
      padding: 8px 12px;
      background: #182234;
      border-bottom: 1px solid #384b66;
      font-size: 12px;
      color: #e2e8f0;
      flex-shrink: 0;
      animation: fadeIn 0.15s ease-out;
    }
    .inspector-badge {
      font-weight: 700;
      color: #38bdf8;
      background: #0e1e33;
      padding: 3px 8px;
      border-radius: 6px;
      border: 1px solid #1e3a5f;
    }
    .inspector label {
      display: flex;
      align-items: center;
      gap: 5px;
      font-weight: 500;
    }
    .inspector input, .inspector select {
      border: 1px solid #4a5d78;
      background: #0f172a;
      color: #fff;
      border-radius: 4px;
      padding: 4px 7px;
      font: inherit;
      font-size: 12px;
    }
    .inspector input:focus, .inspector select:focus {
      outline: none;
      border-color: #38bdf8;
    }
    .inspector .btn-delete {
      background: #991b1b;
      border: 1px solid #ef4444;
      color: #fff;
      border-radius: 6px;
      padding: 4px 10px;
      font-weight: 600;
      cursor: pointer;
      margin-left: auto;
      transition: background 0.15s;
    }
    .inspector .btn-delete:hover {
      background: #dc2626;
    }
    .inspector .btn-close {
      background: transparent;
      border: none;
      color: #94a3b8;
      font-size: 14px;
      cursor: pointer;
      padding: 2px 6px;
    }
    .inspector .btn-close:hover {
      color: #fff;
    }
    .viewport {
      flex: 1;
      width: 100%;
      min-height: 280px;
      background: #111722;
      border: 1px solid #384152;
      border-radius: 0 0 8px 8px;
      overflow: hidden;
      touch-action: none;
      cursor: grab;
    }
    .viewport:active {
      cursor: grabbing;
    }
    .room {
      stroke: #60a5fa;
      stroke-width: 2px;
      vector-effect: non-scaling-stroke;
      cursor: move;
      transition: stroke 0.15s;
    }
    .room:hover {
      stroke: #93c5fd;
    }
    .room.selected {
      stroke: #f59e0b;
      stroke-width: 3px;
    }
    .room-label {
      fill: #ffffff;
      paint-order: stroke;
      stroke: #0a0e1a;
      stroke-width: .08;
      text-anchor: middle;
      dominant-baseline: middle;
      font-size: .38px;
      font-weight: 700;
      pointer-events: none;
    }
    .handle {
      fill: #f8fbff;
      stroke: #4287ef;
      stroke-width: 2px;
      vector-effect: non-scaling-stroke;
      cursor: move;
    }
    .opening {
      stroke: #f59e0b;
      stroke-width: 4px;
      stroke-linecap: round;
      vector-effect: non-scaling-stroke;
      cursor: move;
    }
    .opening.window {
      stroke: #38bdf8;
      stroke-width: 3px;
    }
    .fixture {
      fill: #ffe19a;
      stroke: #111722;
      stroke-width: 2px;
      vector-effect: non-scaling-stroke;
      cursor: move;
    }
    .ac {
      fill: #7ee6ff;
      stroke: #101722;
      stroke-width: 2px;
      vector-effect: non-scaling-stroke;
      cursor: move;
    }
    .furniture {
      fill: #a6adbf99;
      stroke: #e0e5ef;
      stroke-width: 1.5px;
      vector-effect: non-scaling-stroke;
      cursor: move;
    }
    .furn-label {
      fill: #fff;
      font-size: .22px;
      text-anchor: middle;
      pointer-events: none;
      paint-order: stroke;
      stroke: #111722;
      stroke-width: .04;
    }
    .grid-label {
      fill: #8290a4;
      font-size: 11px;
      pointer-events: none;
    }
    .legend {
      display: flex;
      justify-content: space-between;
      color: #aab5c6;
      padding: 5px 2px;
      font-size: 11px;
      flex-shrink: 0;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('keydown', this.onKeyDown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('keydown', this.onKeyDown);
  }

  private onKeyDown = (e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement || e.target instanceof HTMLTextAreaElement) return;
    if ((e.key === 'Delete' || e.key === 'Backspace') && this.selected) {
      e.preventDefault();
      this.deleteSelected();
    }
  };

  protected willUpdate(changed: PropertyValues) {
    if (changed.has('plan') && !this.plan) this.plan = { rooms: [] };
  }

  private emit(plan: Plan) {
    this.dispatchEvent(new CustomEvent('plan-changed', { detail: { plan }, bubbles: true, composed: true }));
  }

  public select(kind: Selection['kind'], index: number, id: string) {
    this.selected = { kind, index, id };
    this.dispatchEvent(new CustomEvent('selection-changed', { detail: this.selected, bubbles: true, composed: true }));
    this.requestUpdate();
  }

  private point(e: PointerEvent): [number, number] {
    const group = this.renderRoot.querySelector('#world') as SVGGraphicsElement | null;
    return group ? screenToMetres(group, e.clientX, e.clientY) : [0, 0];
  }

  private canvasPoint(clientX: number, clientY: number): [number, number] {
    const svg = this.renderRoot.querySelector('svg');
    const r = svg?.getBoundingClientRect();
    return r ? [((clientX - r.left) / r.width) * 800, ((clientY - r.top) / r.height) * 430] : [0, 0];
  }

  private roomById(id: string) {
    return this.plan.rooms.find(r => r.id === id);
  }

  private openingList(): NormOpening[] {
    return this.plan.openings ?? [];
  }

  private devicePoint(a: AcDef): [number, number] {
    if (a.pos) return a.pos;
    const r = this.roomById(a.roomId ?? a.room ?? '');
    if (!r) return [a.x ?? 0, 0];
    switch (a.wall) {
      case 'north': return [r.x + (a.x ?? 0), r.y];
      case 'south': return [r.x + (a.x ?? 0), r.y + r.length];
      case 'west':  return [r.x, r.y + (a.x ?? 0)];
      case 'east':  return [r.x + r.width, r.y + (a.x ?? 0)];
    }
  }

  private nearestWall(r: RoomDef, x: number, z: number) {
    const d = [Math.abs(z - r.y), Math.abs(x - (r.x + r.width)), Math.abs(z - (r.y + r.length)), Math.abs(x - r.x)];
    const n = d.indexOf(Math.min(...d));
    const wall = (['north', 'east', 'south', 'west'] as const)[n];
    const along = n % 2 === 0 ? Math.max(0, Math.min(r.width, x - r.x)) : Math.max(0, Math.min(r.length, z - r.y));
    return { wall, along };
  }

  public deleteSelected = () => {
    if (!this.selected) return;
    const p = structuredClone(this.plan);
    const { kind, index } = this.selected;
    if (kind === 'room' && p.rooms[index]) {
      const roomId = p.rooms[index].id;
      p.rooms.splice(index, 1);
      if (p.openings) p.openings = p.openings.filter(o => o.roomId !== roomId);
      if (p.lights) p.lights = p.lights.filter(l => (l.roomId ?? l.room) !== roomId);
      if (p.acs) p.acs = p.acs.filter(a => (a.roomId ?? a.room) !== roomId);
    } else if (kind === 'opening' && p.openings?.[index]) {
      p.openings.splice(index, 1);
    } else if (kind === 'light' && p.lights?.[index]) {
      p.lights.splice(index, 1);
    } else if (kind === 'ac' && p.acs?.[index]) {
      p.acs.splice(index, 1);
    } else if (kind === 'furniture' && p.furniture?.[index]) {
      p.furniture.splice(index, 1);
    }
    this.selected = undefined;
    this.emit(p);
    this.requestUpdate();
  };

  private updateRoomDimension(index: number, key: 'width' | 'length' | 'name' | 'floor', value: any) {
    const p = structuredClone(this.plan);
    const r = p.rooms[index];
    if (!r) return;
    if (key === 'width') {
      r.width = Math.max(MIN_ROOM, snap(Number(value) || r.width));
    } else if (key === 'length') {
      r.length = Math.max(MIN_ROOM, snap(Number(value) || r.length));
    } else if (key === 'name') {
      r.name = String(value);
    } else if (key === 'floor') {
      r.floor = value as FloorKind;
    }
    this.emit(p);
    this.requestUpdate();
  }

  private updateOpeningWidth(index: number, newLen: number) {
    const p = structuredClone(this.plan);
    const o = p.openings?.[index];
    if (!o) return;
    const curLen = Math.hypot(o.to[0] - o.from[0], o.to[1] - o.from[1]);
    if (curLen === 0) return;
    const ratio = Math.max(0.4, newLen) / curLen;
    o.to = [snap(o.from[0] + (o.to[0] - o.from[0]) * ratio), snap(o.from[1] + (o.to[1] - o.from[1]) * ratio)];
    this.emit(p);
    this.requestUpdate();
  }

  private updateOpeningType(index: number, type: 'door' | 'window') {
    const p = structuredClone(this.plan);
    const o = p.openings?.[index];
    if (!o) return;
    o.type = type;
    if (type === 'window') {
      o.sill = 0.85;
      o.head = 2.05;
    } else {
      o.sill = 0;
      o.head = 2.1;
    }
    this.emit(p);
    this.requestUpdate();
  }

  private updateLightProp(index: number, key: 'name' | 'fixture', value: any) {
    const p = structuredClone(this.plan);
    const l = p.lights?.[index];
    if (!l) return;
    if (key === 'name') l.name = String(value);
    else if (key === 'fixture') l.fixture = value;
    this.emit(p);
    this.requestUpdate();
  }

  private updateAcProp(index: number, key: 'name', value: any) {
    const p = structuredClone(this.plan);
    const a = p.acs?.[index];
    if (!a) return;
    if (key === 'name') a.name = String(value);
    this.emit(p);
    this.requestUpdate();
  }

  private updateFurnitureType(index: number, type: string) {
    const p = structuredClone(this.plan);
    const f = p.furniture?.[index];
    if (!f) return;
    f.type = type;
    this.emit(p);
    this.requestUpdate();
  }

  private rotateSelectedFurniture(degrees: number) {
    if (this.selected?.kind !== 'furniture') return;
    const p = structuredClone(this.plan);
    const f = p.furniture?.[this.selected.index];
    if (!f) return;
    const cur = Number(f.rotation ?? f.rot ?? 0);
    f.rotation = (cur + degrees) % 360;
    delete (f as any).rot;
    this.emit(p);
    this.requestUpdate();
  }

  private addAt(x: number, z: number) {
    const plan = structuredClone(this.plan);
    if (this.mode === 'add-room') {
      const room: RoomDef = {
        id: `room_${this.roomCounter++}`,
        name: 'New Room',
        x: snap(x),
        y: snap(z),
        width: 3,
        length: 3,
        floor: 'oak' as FloorKind
      };
      plan.rooms.push(room);
      this.select('room', plan.rooms.length - 1, room.id);
    }
    if (this.mode === 'add-door' || this.mode === 'add-window') {
      const r = plan.rooms.find(q => x >= q.x - .5 && x <= q.x + q.width + .5 && z >= q.y - .5 && z <= q.y + q.length + .5) ?? plan.rooms[0];
      if (!r) return;
      const { wall, along } = this.nearestWall(r, x, z);
      let from: [number, number], to: [number, number];
      const w = this.mode === 'add-door' ? .9 : 1.2;
      if (wall === 'north' || wall === 'south') {
        const xx = Math.max(r.x, Math.min(r.x + r.width - w, r.x + along - w / 2));
        const zz = wall === 'north' ? r.y : r.y + r.length;
        from = [snap(xx), zz];
        to = [snap(xx + w), zz];
      } else {
        const zz = Math.max(r.y, Math.min(r.y + r.length - w, r.y + along - w / 2));
        const xx = wall === 'west' ? r.x : r.x + r.width;
        from = [xx, snap(zz)];
        to = [xx, snap(zz + w)];
      }
      plan.openings = [...(plan.openings ?? []), {
        type: this.mode === 'add-door' ? 'door' : 'window',
        from,
        to,
        sill: this.mode === 'add-window' ? .85 : 0,
        head: this.mode === 'add-window' ? 2.05 : 2.1
      }];
      this.select('opening', plan.openings.length - 1, `opening_${plan.openings.length}`);
    }
    if (this.mode === 'add-light') {
      const room = plan.rooms.find(r => x >= r.x && x <= r.x + r.width && z >= r.y && z <= r.y + r.length) ?? plan.rooms[0];
      if (!room) return;
      const l: LightDef = {
        id: `light_fixture_${(plan.lights?.length ?? 0) + 1}`,
        name: 'New Light',
        roomId: room.id,
        x: snap(x),
        y: snap(z),
        z: 2.5,
        fixture: 'pendant',
        capabilities: ['brightness', 'temp']
      };
      plan.lights = [...(plan.lights ?? []), l];
      this.select('light', plan.lights.length - 1, l.id);
    }
    if (this.mode === 'add-ac') {
      const room = plan.rooms.find(r => x >= r.x - .6 && x <= r.x + r.width + .6 && z >= r.y - .6 && z <= r.y + r.length + .6) ?? plan.rooms[0];
      if (!room) return;
      const { wall, along } = this.nearestWall(room, x, z);
      const a: AcDef = {
        id: `climate_ac_${(plan.acs?.length ?? 0) + 1}`,
        name: 'New AC',
        roomId: room.id,
        wall,
        x: snap(along),
        y: 2.2
      };
      plan.acs = [...(plan.acs ?? []), a];
      this.select('ac', plan.acs.length - 1, a.id);
    }
    if (this.mode === 'add-furniture') {
      const f: FurnitureDef = {
        type: 'sofa',
        x: snap(x),
        y: snap(z),
        rotation: 0
      };
      plan.furniture = [...(plan.furniture ?? []), f];
      this.select('furniture', plan.furniture.length - 1, `furniture_${plan.furniture.length}`);
    }
    this.emit(plan);
    this.mode = 'select';
  }

  private down = (e: PointerEvent) => {
    const svg = e.currentTarget as SVGSVGElement;
    svg.setPointerCapture(e.pointerId);
    this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const [x, z] = this.point(e);
    const target = e.target as Element;
    const el = target.closest('[data-kind]') as SVGElement | null;
    const kind = el?.dataset.kind;
    const id = el?.dataset.id ?? '';
    const index = Number(el?.dataset.index ?? -1);
    const handle = el?.dataset.handle;

    if (this.pointers.size >= 2) {
      const pts = [...this.pointers.values()];
      this.gesture = {
        kind: 'pinch',
        id: '',
        index: -1,
        start: [this.panX, this.panY],
        startZoom: this.zoom,
        startDistance: Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y),
        startCenter: [(pts[0].x + pts[1].x) / 2, (pts[0].y + pts[1].y) / 2]
      };
      return;
    }
    if (this.mode === 'add-room' || this.mode !== 'select') {
      this.addAt(x, z);
      return;
    }
    if (kind === 'room' && index >= 0) {
      const r = this.plan.rooms[index];
      if (handle) {
        this.gesture = { kind: 'resize', id, index, handle, start: [x, z], room: structuredClone(r) };
      } else {
        this.select('room', index, id);
        this.gesture = { kind: 'room', id, index, start: [x, z], room: structuredClone(r) };
      }
      return;
    }
    if (kind === 'opening' && index >= 0) {
      const o = this.openingList()[index];
      this.select('opening', index, id);
      this.gesture = { kind: 'opening', id, index, start: [x, z], opening: structuredClone(o) };
      return;
    }
    if (kind === 'light' && index >= 0) {
      this.select('light', index, id);
      this.gesture = { kind: 'light', id, index, start: [x, z] };
      return;
    }
    if (kind === 'ac' && index >= 0) {
      this.select('ac', index, id);
      this.gesture = { kind: 'ac', id, index, start: [x, z] };
      return;
    }
    if (kind === 'furniture' && index >= 0) {
      this.select('furniture', index, id);
      this.gesture = { kind: 'furniture', id, index, start: [x, z] };
      return;
    }
    if (target.classList.contains('handle')) return;
    this.selected = undefined;
    this.dispatchEvent(new CustomEvent('selection-changed', { detail: undefined, bubbles: true, composed: true }));
    this.gesture = {
      kind: 'pan',
      id: '',
      index: -1,
      start: [this.canvasPoint(e.clientX, e.clientY)[0] - this.panX, this.canvasPoint(e.clientX, e.clientY)[1] - this.panY]
    };
  };

  private move = (e: PointerEvent) => {
    if (!this.pointers.has(e.pointerId)) return;
    this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const g = this.gesture;
    if (!g) return;

    if (g.kind === 'pinch' && this.pointers.size >= 2) {
      const pts = [...this.pointers.values()].map(p => this.canvasPoint(p.x, p.y));
      const d = Math.hypot(pts[0][0] - pts[1][0], pts[0][1] - pts[1][1]);
      const c: [number, number] = [(pts[0][0] + pts[1][0]) / 2, (pts[0][1] + pts[1][1]) / 2];
      this.zoom = Math.max(.45, Math.min(3, (g.startZoom ?? 1) * d / Math.max(1, g.startDistance ?? 1)));
      this.panX = g.start[0] + (c[0] - (g.startCenter?.[0] ?? c[0]));
      this.panY = g.start[1] + (c[1] - (g.startCenter?.[1] ?? c[1]));
      return;
    }
    const [x, z] = this.point(e);
    const dx = x - g.start[0], dz = z - g.start[1];
    const p = structuredClone(this.plan);

    if (g.kind === 'pan') {
      const [cx, cy] = this.canvasPoint(e.clientX, e.clientY);
      this.panX = cx - g.start[0];
      this.panY = cy - g.start[1];
      return;
    }
    if (g.kind === 'room') {
      const i = g.index, r = p.rooms[i], base = g.room!;
      r.x = snap(base.x + dx);
      r.y = snap(base.y + dz);
      for (const o of p.openings ?? []) {
        const onVertical = (Math.abs(o.from[0] - o.to[0]) < .01) && ([base.x, base.x + base.width].some(v => Math.abs(o.from[0] - v) < .15));
        const onHorizontal = (Math.abs(o.from[1] - o.to[1]) < .01) && ([base.y, base.y + base.length].some(v => Math.abs(o.from[1] - v) < .15));
        if (onVertical && o.from[1] >= base.y - .1 && o.to[1] <= base.y + base.length + .1) {
          o.from = [snap(o.from[0] + dx), snap(o.from[1] + dz)];
          o.to = [snap(o.to[0] + dx), snap(o.to[1] + dz)];
        } else if (onHorizontal && o.from[0] >= base.x - .1 && o.to[0] <= base.x + base.width + .1) {
          o.from = [snap(o.from[0] + dx), snap(o.from[1] + dz)];
          o.to = [snap(o.to[0] + dx), snap(o.to[1] + dz)];
        }
      }
      for (const l of p.lights ?? []) {
        if ((l.roomId ?? l.room) === base.id) {
          l.x = snap((l.x ?? 0) + dx);
          l.y = snap((l.y ?? 0) + dz);
        }
      }
      for (const f of p.furniture ?? []) {
        const fx = f.x ?? f.pos?.[0] ?? NaN, fz = f.y ?? f.pos?.[1] ?? NaN;
        if (fx >= base.x && fx <= base.x + base.width && fz >= base.y && fz <= base.y + base.length) {
          f.x = snap(fx + dx);
          f.y = snap(fz + dz);
          delete (f as any).pos;
        }
      }
      for (const a of p.acs ?? []) {
        if ((a.roomId ?? a.room) === base.id && a.pos) {
          a.pos = [snap(a.pos[0] + dx), snap(a.pos[1] + dz)];
        }
      }
      this.emit(p);
      return;
    }
    if (g.kind === 'resize') {
      const i = g.index, r = p.rooms[i], b = g.room!, h = g.handle!;
      let left = b.x, top = b.y, right = b.x + b.width, bottom = b.y + b.length;
      if (h.includes('w')) left = Math.min(right - MIN_ROOM, snap(b.x + dx));
      if (h.includes('e')) right = Math.max(left + MIN_ROOM, snap(b.x + b.width + dx));
      if (h.includes('n')) top = Math.min(bottom - MIN_ROOM, snap(b.y + dz));
      if (h.includes('s')) bottom = Math.max(top + MIN_ROOM, snap(b.y + b.length + dz));
      r.x = left; r.y = top; r.width = right - left; r.length = bottom - top;
      this.emit(p);
      return;
    }
    if (g.kind === 'opening') {
      const o = p.openings?.[g.index], base = g.opening;
      if (o && base) {
        let nearest: { room: RoomDef; wall: 'north' | 'south' | 'east' | 'west'; along: number; distance: number } | undefined;
        for (const r of p.rooms) {
          const n = this.nearestWall(r, x, z);
          const d = n.wall === 'north' ? Math.abs(z - r.y) : n.wall === 'south' ? Math.abs(z - (r.y + r.length)) : n.wall === 'west' ? Math.abs(x - r.x) : Math.abs(x - (r.x + r.width));
          if (!nearest || d < nearest.distance) nearest = { room: r, wall: n.wall, along: n.along, distance: d };
        }
        if (nearest) {
          const len = Math.hypot(base.to[0] - base.from[0], base.to[1] - base.from[1]), r = nearest.room;
          if (nearest.wall === 'north' || nearest.wall === 'south') {
            const a = Math.max(r.x, Math.min(r.x + r.width - len, r.x + nearest.along - len / 2)), zz = nearest.wall === 'north' ? r.y : r.y + r.length;
            o.from = [snap(a), zz];
            o.to = [snap(a + len), zz];
          } else {
            const a = Math.max(r.y, Math.min(r.y + r.length - len, r.y + nearest.along - len / 2)), xx = nearest.wall === 'west' ? r.x : r.x + r.width;
            o.from = [xx, snap(a)];
            o.to = [xx, snap(a + len)];
          }
          this.emit(p);
        }
      }
      return;
    }
    if (g.kind === 'light') {
      const l = p.lights?.[g.index];
      if (l) {
        l.x = snap(x); l.y = snap(z);
        this.emit(p);
      }
      return;
    }
    if (g.kind === 'ac') {
      const a = p.acs?.[g.index];
      if (a) {
        const room = p.rooms.find(r => r.id === (a.roomId ?? a.room)) ?? p.rooms[0];
        const { wall, along } = this.nearestWall(room, x, z);
        a.wall = wall;
        a.x = snap(along);
        delete a.pos;
        this.emit(p);
      }
      return;
    }
    if (g.kind === 'furniture') {
      const f = p.furniture?.[g.index];
      if (f) {
        f.x = snap(x); f.y = snap(z);
        delete (f as any).pos;
        this.emit(p);
      }
    }
  };

  private up = (e: PointerEvent) => {
    this.pointers.delete(e.pointerId);
    if (this.pointers.size === 0) this.gesture = undefined;
    else if (this.pointers.size === 1) {
      const p = [...this.pointers.values()][0];
      this.gesture = {
        kind: 'pan',
        id: '',
        index: -1,
        start: [this.canvasPoint(p.x, p.y)[0] - this.panX, this.canvasPoint(p.x, p.y)[1] - this.panY]
      };
    }
  };

  private wheel = (e: WheelEvent) => {
    e.preventDefault();
    const svg = e.currentTarget as SVGSVGElement;
    const rect = svg.getBoundingClientRect();
    const px = (e.clientX - rect.left) * 800 / rect.width, py = (e.clientY - rect.top) * 430 / rect.height;
    const next = Math.max(.45, Math.min(3, this.zoom * Math.exp(-e.deltaY * .001)));
    const factor = next / this.zoom;
    this.panX = px - (px - this.panX) * factor;
    this.panY = py - (py - this.panY) * factor;
    this.zoom = next;
  };

  private handles(r: RoomDef, index: number) {
    if (this.selected?.kind !== 'room' || this.selected.index !== index) return svg``;
    const s = .14, pts: [string, number, number][] = [
      ['nw', r.x, r.y],
      ['n', r.x + r.width / 2, r.y],
      ['ne', r.x + r.width, r.y],
      ['e', r.x + r.width, r.y + r.length / 2],
      ['se', r.x + r.width, r.y + r.length],
      ['s', r.x + r.width / 2, r.y + r.length],
      ['sw', r.x, r.y + r.length],
      ['w', r.x, r.y + r.length / 2]
    ];
    return pts.map(([h, x, z]) => svg`<circle class="handle" data-kind="room" data-index=${index} data-id=${r.id} data-handle=${h} cx=${x} cy=${z} r=${s}></circle>`);
  }

  private renderInspector() {
    if (!this.selected) return '';
    const { kind, index } = this.selected;

    if (kind === 'room') {
      const r = this.plan.rooms[index];
      if (!r) return '';
      return html`
        <div class="inspector" role="region" aria-label="Room Properties">
          <span class="inspector-badge">🏠 Room</span>
          <label>Name: <input type="text" .value=${r.name ?? r.id} @change=${(e: Event) => this.updateRoomDimension(index, 'name', (e.target as HTMLInputElement).value)}></label>
          <label>Width: <input type="number" step="0.1" min="0.6" style="width:62px" .value=${String(r.width)} @change=${(e: Event) => this.updateRoomDimension(index, 'width', (e.target as HTMLInputElement).value)}> m</label>
          <label>Length: <input type="number" step="0.1" min="0.6" style="width:62px" .value=${String(r.length)} @change=${(e: Event) => this.updateRoomDimension(index, 'length', (e.target as HTMLInputElement).value)}> m</label>
          <label>Floor:
            <select .value=${r.floor ?? 'oak'} @change=${(e: Event) => this.updateRoomDimension(index, 'floor', (e.target as HTMLSelectElement).value)}>
              <option value="oak" ?selected=${r.floor === 'oak'}>Oak</option>
              <option value="walnut" ?selected=${r.floor === 'walnut'}>Walnut</option>
              <option value="tile" ?selected=${r.floor === 'tile'}>Tile</option>
              <option value="stone" ?selected=${r.floor === 'stone'}>Stone</option>
            </select>
          </label>
          <button class="btn-delete" @click=${this.deleteSelected}>🗑 Delete Room</button>
          <button class="btn-close" title="Close" @click=${() => { this.selected = undefined; this.requestUpdate(); }}>✕</button>
        </div>
      `;
    }

    if (kind === 'opening') {
      const o = this.openingList()[index];
      if (!o) return '';
      const len = Math.hypot(o.to[0] - o.from[0], o.to[1] - o.from[1]);
      return html`
        <div class="inspector" role="region" aria-label="Opening Properties">
          <span class="inspector-badge">${o.type === 'window' ? '🪟 Window' : '🚪 Door'}</span>
          <label>Type:
            <select .value=${o.type} @change=${(e: Event) => this.updateOpeningType(index, (e.target as HTMLSelectElement).value as 'door' | 'window')}>
              <option value="door" ?selected=${o.type === 'door'}>Door</option>
              <option value="window" ?selected=${o.type === 'window'}>Window</option>
            </select>
          </label>
          <label>Width: <input type="number" step="0.1" min="0.4" style="width:62px" .value=${len.toFixed(1)} @change=${(e: Event) => this.updateOpeningWidth(index, Number((e.target as HTMLInputElement).value))}> m</label>
          <button class="btn-delete" @click=${this.deleteSelected}>🗑 Delete Opening</button>
          <button class="btn-close" title="Close" @click=${() => { this.selected = undefined; this.requestUpdate(); }}>✕</button>
        </div>
      `;
    }

    if (kind === 'light') {
      const l = this.plan.lights?.[index];
      if (!l) return '';
      return html`
        <div class="inspector" role="region" aria-label="Light Properties">
          <span class="inspector-badge">💡 Light</span>
          <label>Name: <input type="text" .value=${l.name ?? l.id} @change=${(e: Event) => this.updateLightProp(index, 'name', (e.target as HTMLInputElement).value)}></label>
          <label>Fixture:
            <select .value=${l.fixture ?? 'pendant'} @change=${(e: Event) => this.updateLightProp(index, 'fixture', (e.target as HTMLSelectElement).value)}>
              <option value="pendant" ?selected=${l.fixture === 'pendant'}>Pendant</option>
              <option value="spot" ?selected=${l.fixture === 'spot'}>Spotlight</option>
              <option value="ceiling" ?selected=${l.fixture === 'ceiling'}>Ceiling</option>
              <option value="strip" ?selected=${l.fixture === 'strip'}>Strip</option>
            </select>
          </label>
          <button class="btn-delete" @click=${this.deleteSelected}>🗑 Delete Light</button>
          <button class="btn-close" title="Close" @click=${() => { this.selected = undefined; this.requestUpdate(); }}>✕</button>
        </div>
      `;
    }

    if (kind === 'ac') {
      const a = this.plan.acs?.[index];
      if (!a) return '';
      return html`
        <div class="inspector" role="region" aria-label="Climate AC Properties">
          <span class="inspector-badge">❄️ Climate AC</span>
          <label>Name: <input type="text" .value=${a.name ?? a.id} @change=${(e: Event) => this.updateAcProp(index, 'name', (e.target as HTMLInputElement).value)}></label>
          <button class="btn-delete" @click=${this.deleteSelected}>🗑 Delete AC</button>
          <button class="btn-close" title="Close" @click=${() => { this.selected = undefined; this.requestUpdate(); }}>✕</button>
        </div>
      `;
    }

    if (kind === 'furniture') {
      const f = this.plan.furniture?.[index];
      if (!f) return '';
      return html`
        <div class="inspector" role="region" aria-label="Furniture Properties">
          <span class="inspector-badge">🛋️ Furniture</span>
          <label>Type:
            <select .value=${f.type} @change=${(e: Event) => this.updateFurnitureType(index, (e.target as HTMLSelectElement).value)}>
              <option value="sofa" ?selected=${f.type === 'sofa'}>Sofa</option>
              <option value="bed" ?selected=${f.type === 'bed'}>Bed</option>
              <option value="tv_bench" ?selected=${f.type === 'tv_bench'}>TV Bench</option>
              <option value="table" ?selected=${f.type === 'table'}>Table</option>
              <option value="chair" ?selected=${f.type === 'chair'}>Chair</option>
              <option value="desk" ?selected=${f.type === 'desk'}>Desk</option>
            </select>
          </label>
          <button class="btn-rot" @click=${() => this.rotateSelectedFurniture(90)}>↻ Rotate 90°</button>
          <button class="btn-delete" @click=${this.deleteSelected}>🗑 Delete Item</button>
          <button class="btn-close" title="Close" @click=${() => { this.selected = undefined; this.requestUpdate(); }}>✕</button>
        </div>
      `;
    }

    return '';
  }

  protected render() {
    const rooms = this.plan?.rooms ?? [];
    const xs = rooms.flatMap(r => [r.x, r.x + r.width]);
    const zs = rooms.flatMap(r => [r.y, r.y + r.length]);
    const extentX = Math.max(12, ...xs) + 1;
    const extentZ = Math.max(9, ...zs) + 1;
    const furniture = this.plan?.furniture ?? [];
    const lights = this.plan?.lights ?? [];
    const acs = this.plan?.acs ?? [];
    const openings = this.openingList();

    const tool = (m: Mode, label: string) => html`
      <button class=${this.mode === m ? 'active' : ''} @click=${() => this.mode = m}>${label}</button>
    `;

    return html`
      <div class="toolbar">
        ${tool('select', 'Select')}
        ${tool('add-room', '＋ Room')}
        ${tool('add-door', '＋ Door')}
        ${tool('add-window', '＋ Window')}
        ${tool('add-light', '＋ Light')}
        ${tool('add-ac', '＋ AC')}
        ${tool('add-furniture', '＋ Sofa')}
        <div class="divider"></div>
        <button title="Zoom in" @click=${() => { this.zoom = Math.min(3, this.zoom * 1.2); }}>＋</button>
        <button title="Zoom out" @click=${() => { this.zoom = Math.max(.45, this.zoom / 1.2); }}>−</button>
        <button title="Reset view" @click=${() => { this.zoom = 1; this.panX = 36; this.panY = 34; }}>Fit</button>
        ${this.selected ? html`<button class="btn-delete" style="margin-left:auto; background:#991b1b; color:#fff; border-color:#ef4444;" title="Delete selected element" @click=${this.deleteSelected}>🗑 Delete</button>` : ''}
      </div>
      ${this.renderInspector()}
      <svg class="viewport" viewBox="0 0 800 430" role="application" aria-label="Interactive floor plan in metres"
           @pointerdown=${this.down} @pointermove=${this.move} @pointerup=${this.up} @pointercancel=${this.up} @wheel=${this.wheel}>
        <defs>
          <pattern id="minor-grid" width="0.5" height="0.5" patternUnits="userSpaceOnUse">
            <path d="M .5 0 H0 V.5" fill="none" stroke="#2b3545" stroke-width=".012"/>
          </pattern>
          <pattern id="major-grid" width="1" height="1" patternUnits="userSpaceOnUse">
            <path d="M1 0H0V1" fill="none" stroke="#445166" stroke-width=".022"/>
          </pattern>
        </defs>
        <g id="world" transform=${`translate(${this.panX} ${this.panY}) scale(${48 * this.zoom})`}>
          <rect x="-2" y="-2" width=${extentX + 4} height=${extentZ + 4} fill="url(#minor-grid)"/>
          <rect x="-2" y="-2" width=${extentX + 4} height=${extentZ + 4} fill="url(#major-grid)"/>
          ${rooms.map((r, i) => svg`
            <g>
              <rect class=${`room ${this.selected?.kind === 'room' && this.selected.index === i ? 'selected' : ''}`}
                    data-kind="room" data-id=${r.id} data-index=${i}
                    x=${r.x} y=${r.y} width=${r.width} height=${r.length} rx=".03"
                    fill=${FLOOR[r.floor ?? 'oak'] ?? FLOOR.oak}/>
              <text class="room-label" x=${r.x + r.width / 2} y=${r.y + r.length / 2}>
                ${r.name ?? r.id} · ${r.width.toFixed(1)}×${r.length.toFixed(1)}m
              </text>
              ${this.handles(r, i)}
            </g>
          `)}
          ${openings.map((o, i) => svg`
            <line class=${`opening ${o.type === 'window' ? 'window' : ''} ${this.selected?.kind === 'opening' && this.selected.index === i ? 'selected' : ''}`}
                  data-kind="opening" data-id=${`opening_${i}`} data-index=${i}
                  x1=${o.from[0]} y1=${o.from[1]} x2=${o.to[0]} y2=${o.to[1]}/>
          `)}
          ${lights.map((l, i) => svg`
            <g data-kind="light" data-id=${l.id} data-index=${i}>
              <circle class="fixture" cx=${l.x ?? 0} cy=${l.y ?? 0} r=".16" stroke=${this.selected?.kind === 'light' && this.selected.index === i ? '#f59e0b' : '#111722'}/>
              <text class="furn-label" x=${l.x ?? 0} y=${(l.y ?? 0) + .34}>${l.name ?? 'Light'}</text>
            </g>
          `)}
          ${acs.map((a, i) => {
            const [x, z] = this.devicePoint(a);
            return svg`
              <g data-kind="ac" data-id=${a.id} data-index=${i}>
                <rect class="ac" x=${x - .18} y=${z - .12} width=".36" height=".24" rx=".04" stroke=${this.selected?.kind === 'ac' && this.selected.index === i ? '#f59e0b' : '#101722'}/>
                <text class="furn-label" x=${x} y=${z + .32}>AC</text>
              </g>
            `;
          })}
          ${furniture.map((f, i) => {
            const x = f.x ?? f.pos?.[0] ?? 0, z = f.y ?? f.pos?.[1] ?? 0;
            const width = Number(f.width ?? (f.type === 'bed' ? 1.7 : f.type === 'sofa' ? 2.1 : 1));
            const depth = Number(f.depth ?? (f.type === 'bed' ? 2 : f.type === 'sofa' ? .85 : .7));
            return svg`
              <g data-kind="furniture" data-id=${`furniture_${i}`} data-index=${i}>
                <rect class="furniture" x=${x - width / 2} y=${z - depth / 2} width=${width} height=${depth} rx=".05"
                      transform=${`rotate(${f.rotation ?? f.rot ?? 0} ${x} ${z})`}
                      stroke=${this.selected?.kind === 'furniture' && this.selected.index === i ? '#f59e0b' : '#e0e5ef'}/>
                <text class="furn-label" x=${x} y=${z + .04}>${f.type}</text>
              </g>
            `;
          })}
        </g>
        <text class="grid-label" x="12" y="20">Grid: 0.5 m · snap: 0.1 m · wheel/pinch to zoom · drag background to pan · Delete key removes selection</text>
      </svg>
      <div class="legend">
        <span>Floor plan · X/Z in metres</span>
        <span>${this.selected ? 'Selected item ready to edit or delete' : (this.mode === 'select' ? 'Click any item to edit dimensions or delete' : `Click on plan to ${this.mode.replace('add-', 'add ')}`)}</span>
      </div>
    `;
  }
}

if (!customElements.get('floorplan-canvas')) customElements.define('floorplan-canvas', FloorplanCanvas);
