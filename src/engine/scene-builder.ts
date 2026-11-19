// Builds the pure scene graph for a plan (no renderer, no DOM): house + furniture.
// Kept separate from world.ts so it can run headless (Node verification).
import * as THREE from 'three';
import { buildHouse, type House } from './house-builder';
import { buildFurniture } from './furniture-builder';
import type { NormConfig } from '../types';
import { LightingManager } from './lighting-manager';
import { AcSimulator } from './ac-simulator';

export interface SceneBundle {
  scene: THREE.Scene;
  house: House;
  furniture: THREE.Group;
  lighting: LightingManager;
  acs: AcSimulator;
}

export function buildScene(config: NormConfig, scene = new THREE.Scene(), entities?: { lights?: Record<string, string>; climates?: Record<string, string> }): SceneBundle {
  const house = buildHouse(config);
  const furniture = buildFurniture(config.furniture);
  const lighting = new LightingManager(config.lightUnits, entities?.lights);
  const acs = new AcSimulator(config.acUnits, entities?.climates);
  scene.add(house.group, furniture, lighting.group, acs.group);
  return { scene, house, furniture, lighting, acs };
}

/** Initial camera pose framing the whole plan, from the plan's azimuth/elevation. */
export function frameCamera(config: NormConfig, aspect: number, fov = 38): { position: THREE.Vector3; target: THREE.Vector3 } {
  const { minX, minZ, maxX, maxZ } = config.bounds;
  const cx = (minX + maxX) / 2;
  const cz = (minZ + maxZ) / 2;
  const span = Math.max(maxX - minX, maxZ - minZ);
  const dist = (span / (2 * Math.tan(THREE.MathUtils.degToRad(fov / 2)))) * 1.55 + 2;
  const az = THREE.MathUtils.degToRad(config.camera.azimuth);
  const el = THREE.MathUtils.degToRad(config.camera.elevation);
  const position = new THREE.Vector3(
    cx + Math.sin(az) * Math.cos(el) * dist,
    Math.sin(el) * dist + 1,
    cz + Math.cos(az) * Math.cos(el) * dist,
  );
  return { position, target: new THREE.Vector3(cx, 1, cz) };
}
