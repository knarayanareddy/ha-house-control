import * as THREE from 'three';
import type { NormLight } from '../types';
import { box, cyl, mat, at } from './kit';

const KELVIN = [[2200, '#ff9438'], [3000, '#ffbd7a'], [4200, '#ffe2c2'], [6500, '#dfe9ff']] as const;
export function kelvinToColor(kelvin: number): THREE.Color {
  const k = THREE.MathUtils.clamp(kelvin, 2200, 6500);
  for (let i = 0; i < KELVIN.length - 1; i++) {
    const [a, ca] = KELVIN[i], [b, cb] = KELVIN[i + 1];
    if (k <= b) return new THREE.Color(ca).lerp(new THREE.Color(cb), (k - a) / (b - a));
  }
  return new THREE.Color(KELVIN[KELVIN.length - 1][1]);
}

export interface LightSnapshot { on: boolean; brightness: number; color?: string; colorTempKelvin?: number; }
export class LightUnit {
  readonly group = new THREE.Group();
  readonly light: THREE.PointLight;
  readonly entityId: string;
  private goal = 0;
  private level = 0;
  private goalColor = new THREE.Color('#ffbd7a');
  private color = this.goalColor.clone();
  private glow: THREE.MeshStandardMaterial;
  constructor(readonly config: NormLight, entityId = config.id) {
    this.entityId = entityId;
    this.group.position.set(config.pos[0], 0, config.pos[1]);
    this.group.rotation.y = THREE.MathUtils.degToRad(config.rot);
    const fixture = config.type;
    let body: THREE.Object3D;
    if (fixture === 'floor') {
      body = at(cyl(0.13, 0.17, 1.35, mat('#272a32'), 20), 0, .68, 0);
      this.glow = new THREE.MeshStandardMaterial({ color: '#8d8f96', emissive: '#000000', emissiveIntensity: 0 });
      body.add(at(cyl(.19, .14, .24, this.glow, 24), 0, .64, 0));
    } else if (fixture === 'strip') {
      this.glow = new THREE.MeshStandardMaterial({ color: '#8d8f96', emissive: '#000000', emissiveIntensity: 0 });
      body = at(box(config.length ?? 1, .025, .025, this.glow), 0, config.y, 0);
    } else {
      body = at(cyl(fixture === 'spots' ? .25 : .14, fixture === 'spots' ? .25 : .14, .09, mat('#343741'), 24), 0, config.y, 0);
      this.glow = new THREE.MeshStandardMaterial({ color: '#8d8f96', emissive: '#000000', emissiveIntensity: 0 });
      body.add(at(cyl(fixture === 'spots' ? .20 : .105, fixture === 'spots' ? .20 : .105, .035, this.glow, 24), 0, -.04, 0));
      if (fixture === 'pendant') body.add(at(cyl(.007, .007, .24, mat('#343741'), 8), 0, .14, 0));
    }
    body.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        (o as THREE.Mesh).castShadow = false;
        o.userData = { kind: 'light', entityId };
      }
    });
    this.group.add(body);
    this.light = new THREE.PointLight(0xffffff, 0, 7, 2);
    this.light.position.set(0, config.y || 1.5, 0);
    this.light.castShadow = true;
    this.light.shadow.mapSize.set(512, 512);
    this.group.add(this.light);
    const hit = new THREE.Mesh(new THREE.SphereGeometry(.6, 12, 10), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }));
    hit.position.y = config.y || 1.5;
    hit.userData = { kind: 'light', entityId };
    this.group.add(hit);
  }
  apply(state: LightSnapshot) {
    this.goal = state.on ? THREE.MathUtils.clamp(state.brightness, 0, 1) : 0;
    this.goalColor = state.color ? new THREE.Color(state.color) : state.colorTempKelvin ? kelvinToColor(state.colorTempKelvin) : this.goalColor;
  }
  update(dt: number) {
    const k = 1 - Math.exp(-dt * 7);
    this.level += (this.goal - this.level) * k;
    this.color.lerp(this.goalColor, k);
    this.light.intensity = this.level * 12;
    this.light.color.copy(this.color);
    this.glow.emissive.copy(this.color);
    this.glow.emissiveIntensity = this.level * 2;
    return Math.abs(this.goal - this.level) > .005;
  }
}
export class LightingManager {
  readonly group = new THREE.Group();
  readonly units: LightUnit[];
  constructor(defs: NormLight[], entityIds: Record<string, string> = {}) {
    this.units = defs.map((d) => new LightUnit(d, entityIds[d.id] ?? d.id));
    this.units.forEach((u) => this.group.add(u.group));
  }
  apply(id: string, state: LightSnapshot) { this.units.find((u) => u.entityId === id || u.config.id === id)?.apply(state); }
  update(dt: number) { return this.units.reduce((anim, u) => u.update(dt) || anim, false); }
}
