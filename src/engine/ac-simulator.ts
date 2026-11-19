import * as THREE from 'three';
import type { NormAc } from '../types';
import { box, mat, at } from './kit';

const MODE_COLOR: Record<string, number> = { cool: 0x54c7ff, heat: 0xff8c3a, dry: 0x62e0cf, fan: 0xcfdcff, auto: 0x9bd28a };
export interface ClimateSnapshot { on: boolean; mode: string; currentTemperature?: number; temperature?: number; fan?: string; }
export class ACUnit {
  readonly group = new THREE.Group();
  readonly entityId: string;
  private flow: THREE.Points;
  private positions: Float32Array;
  private color = new THREE.Color(MODE_COLOR.cool);
  private goalColor = this.color.clone();
  private power = 0;
  private goal = 0;
  private phase = 0;
  private fanSpeed = 1;
  private temps?: { current?: number; target?: number };
  private highlighted = false;
  setHighlighted(value: boolean) { this.highlighted = value; this.group.scale.setScalar(value ? 1.04 : 1); }
  constructor(readonly config: NormAc, entityId = config.id) {
    this.entityId = entityId;
    this.group.position.set(config.pos[0], config.y, config.pos[1]);
    this.group.rotation.y = ({ north: 0, south: Math.PI, west: Math.PI / 2, east: -Math.PI / 2 })[config.wall];
    const body = new THREE.Group(); body.position.z = .2;
    body.add(at(box(.9, .28, .2, mat('#f3f4f6')), 0, -.14, 0));
    body.add(at(box(.78, .025, .04, mat('#262a30')), 0, -.25, .07));
    body.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        o.userData = { kind: 'climate', entityId };
      }
    });
    this.group.add(body);
    const n = 42;
    this.positions = new Float32Array(n * 3);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    this.flow = new THREE.Points(geo, new THREE.PointsMaterial({ color: this.color, size: .045, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
    this.flow.position.set(0, -.3, .34);
    this.flow.frustumCulled = false;
    this.group.add(this.flow);
    const hit = new THREE.Mesh(new THREE.BoxGeometry(1.4, .8, .8), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }));
    hit.position.set(0, -.15, .2); hit.userData = { kind: 'climate', entityId }; this.group.add(hit);
  }
  apply(state: ClimateSnapshot) {
    this.goal = state.on ? 1 : 0;
    this.goalColor.setHex(MODE_COLOR[state.mode] ?? MODE_COLOR.auto);
    this.temps = { current: state.currentTemperature, target: state.temperature };
    this.fanSpeed = ({ auto: .55, low: .35, medium: .65, high: 1, turbo: 1.4 } as Record<string, number>)[state.fan ?? 'auto'] ?? .55;
  }
  update(dt: number) {
    this.phase += dt;
    this.power += (this.goal - this.power) * (1 - Math.exp(-dt * 3.5));
    this.color.lerp(this.goalColor, 1 - Math.exp(-dt * 5));
    const attr = this.flow.geometry.getAttribute('position') as THREE.BufferAttribute;
    for (let i = 0; i < this.positions.length / 3; i++) {
      const t = (i / (this.positions.length / 3) + this.phase * .48 * this.fanSpeed) % 1;
      this.positions[i * 3] = Math.sin(i * 12.37 + this.phase) * (.08 + t * .45);
      this.positions[i * 3 + 1] = -t * 1.25;
      this.positions[i * 3 + 2] = t * 1.55;
    }
    attr.needsUpdate = true;
    (this.flow.material as THREE.PointsMaterial).color.copy(this.color);
    (this.flow.material as THREE.PointsMaterial).opacity = this.power * .7;
    this.flow.visible = this.power > .01;
    return this.power > .01 || Math.abs(this.goal - this.power) > .005;
  }
}
export class AcSimulator {
  readonly group = new THREE.Group();
  readonly units: ACUnit[];
  constructor(defs: NormAc[], entityIds: Record<string, string> = {}) {
    this.units = defs.map((d) => new ACUnit(d, entityIds[d.id] ?? d.id));
    this.units.forEach((u) => this.group.add(u.group));
  }
  apply(id: string, state: ClimateSnapshot) { this.units.find((u) => u.entityId === id || u.config.id === id)?.apply(state); }
  highlight(id: string | undefined) { this.units.forEach((u) => u.setHighlighted(!!id && (u.entityId === id || u.config.id === id))); }
  update(dt: number) { return this.units.reduce((anim, u) => u.update(dt) || anim, false); }
}
