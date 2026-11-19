// Custom element entry point & Lovelace registration.
// Milestone 1: the card mounts the procedural 3D engine on its plan (or the
// bundled sample plan when no `plan:` is configured yet).
import { LitElement, html, css } from 'lit';
import { createWorld, type WorldHandle } from './engine/world';
import { normalizePlan } from './engine/plan';
import samplePlan from './sample-plan.json';
import type { Plan } from './types';
import { HABridge, type HassLike } from './bridge/ha-bridge';
import * as THREE from 'three';

export interface HouseControlCardConfig {
  type: string;
  title?: string;
  plan?: Plan;
  entities?: { lights?: Record<string, string>; climates?: Record<string, string> };
}

export class HouseControlCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    config: { attribute: false },
  };

  declare hass: HassLike;
  private _config?: HouseControlCardConfig;
  private world?: WorldHandle;
  private gesture = new Map<number, { x: number; y: number }>();
  private gestureStart = new Map<number, { x: number; y: number }>();
  private lastGesture?: { x: number; y: number; distance: number };
  private cameraTarget = new THREE.Vector3();
  private get config() { return this._config; }
  private set config(value: HouseControlCardConfig | undefined) { this._config = value; if (this.isConnected && this.canvas) this.mountWorld(); }
  private bridge?: HABridge;
  private raycaster = new THREE.Raycaster();
  private pointer = new THREE.Vector2();
  private canvas?: HTMLCanvasElement;
  private onPointerDown = (event: PointerEvent) => {
    if (!this.canvas || !this.world) return;
    this.canvas.setPointerCapture(event.pointerId);
    this.gesture.set(event.pointerId, { x: event.clientX, y: event.clientY });
    this.gestureStart.set(event.pointerId, { x: event.clientX, y: event.clientY });
    this.lastGesture = this.measureGesture();
  };
  private onPointerMove = (event: PointerEvent) => {
    if (!this.gesture.has(event.pointerId) || !this.world) {
      if (this.canvas && this.world) {
        const rect = this.canvas.getBoundingClientRect();
        this.pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
        this.raycaster.setFromCamera(this.pointer, this.world.camera);
        const hit = this.raycaster.intersectObjects(this.world.scene.children, true).find((i) => i.object.userData.entityId);
        this.canvas.style.cursor = hit ? 'pointer' : 'grab';
      }
      return;
    }
    this.gesture.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const current = this.measureGesture();
    if (!this.lastGesture || !current) return;
    const camera = this.world.camera;
    const offset = camera.position.clone().sub(this.cameraTarget);
    const spherical = new THREE.Spherical().setFromVector3(offset);
    if (this.gesture.size === 1) {
      spherical.theta -= (current.x - this.lastGesture.x) * .006;
      spherical.phi = THREE.MathUtils.clamp(spherical.phi + (current.y - this.lastGesture.y) * .006, .18, Math.PI * .47);
    } else {
      const zoom = this.lastGesture.distance / Math.max(1, current.distance);
      spherical.radius = THREE.MathUtils.clamp(spherical.radius * zoom, 2, 35);
      const dx = (current.x - this.lastGesture.x) * .004 * spherical.radius;
      const dy = (current.y - this.lastGesture.y) * .004 * spherical.radius;
      this.cameraTarget.add(new THREE.Vector3(dx, 0, dy).applyAxisAngle(new THREE.Vector3(0,1,0), spherical.theta));
    }
    camera.position.copy(this.cameraTarget).add(new THREE.Vector3().setFromSpherical(spherical));
    camera.lookAt(this.cameraTarget);
    this.world.viewFromCamera();
    this.world.requestRender(4);
    this.lastGesture = current;
  };
  private onPointerUp = (event: PointerEvent) => {
    const start = this.gestureStart.get(event.pointerId);
    const moved = start ? Math.hypot(start.x - event.clientX, start.y - event.clientY) : 0;
    this.gesture.delete(event.pointerId);
    this.gestureStart.delete(event.pointerId);
    this.lastGesture = this.measureGesture();
    if (this.canvas) this.canvas.style.cursor = 'grab';
    if (moved > 12 || this.gesture.size || !this.canvas || !this.world || !this.bridge) return;
    const rect = this.canvas.getBoundingClientRect();
    this.pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
    this.raycaster.setFromCamera(this.pointer, this.world.camera);
    const hit = this.raycaster.intersectObjects(this.world.scene.children, true).find((i) => i.object.userData.entityId);
    if (hit) {
      this.bridge.toggle(hit.object.userData.entityId);
      this.world.requestRender(60);
    }
  };
  private measureGesture() {
    const points = [...this.gesture.values()];
    if (!points.length) return undefined;
    if (points.length === 1) return { x: points[0].x, y: points[0].y, distance: 0 };
    const x = points.reduce((sum,p) => sum + p.x,0) / points.length;
    const y = points.reduce((sum,p) => sum + p.y,0) / points.length;
    return { x, y, distance: Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y) };
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 480px;
      border-radius: 16px;
      overflow: hidden;
    }
    canvas {
      width: 100%;
      height: 100%;
      display: block;
      touch-action: none;
      user-select: none;
      -webkit-user-select: none;
    }
  `;

  public setConfig(config: HouseControlCardConfig): void {
    if (!config) throw new Error('Invalid configuration');
    this.config = config;
  }

  public static async getConfigElement() {
    await import('./house-control-card-editor');
    return document.createElement('house-control-card-editor');
  }

  public static getStubConfig() {
    return { type: 'custom:house-control-card', plan: samplePlan };
  }

  protected render() {
    return html`<canvas id="view"></canvas>`;
  }

  protected firstUpdated(): void {
    const canvas = this.shadowRoot!.querySelector('canvas')!;
    this.canvas = canvas;
    this.mountWorld();
    canvas.addEventListener('pointerdown', this.onPointerDown);
    canvas.addEventListener('pointermove', this.onPointerMove);
    canvas.addEventListener('pointerup', this.onPointerUp);
    canvas.addEventListener('pointercancel', this.onPointerUp);
  }

  private mountWorld() {
    if (!this.canvas) return;
    this.world?.dispose();
    const plan = this.config?.plan ?? (samplePlan as Plan);
    this.world = createWorld(this.canvas, normalizePlan(plan), { entities: this.config?.entities });
    this.cameraTarget.set((normalizePlan(plan).bounds.minX + normalizePlan(plan).bounds.maxX) / 2, 1, (normalizePlan(plan).bounds.minZ + normalizePlan(plan).bounds.maxZ) / 2);
    this.bridge = new HABridge(this.world.lighting, this.world.acs, this.config?.entities, () => this.world?.requestRender(20));
    if (this.hass) this.bridge.setHass(this.hass);
  }

  protected updated(changed: Map<PropertyKey, unknown>): void {
    super.updated(changed as never);
    if (changed.has('hass') && this.hass) this.bridge?.setHass(this.hass);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.canvas?.removeEventListener('pointerdown', this.onPointerDown);
    this.canvas?.removeEventListener('pointermove', this.onPointerMove);
    this.canvas?.removeEventListener('pointerup', this.onPointerUp);
    this.canvas?.removeEventListener('pointercancel', this.onPointerUp);
    this.canvas = undefined;
    this.bridge = undefined;
    this.world?.dispose();
    this.world = undefined;
  }
}

if (!customElements.get('house-control-card')) {
  customElements.define('house-control-card', HouseControlCard);
}

// Re-export the engine for the demo page and tests.
export { createWorld } from './engine/world';
export { normalizePlan } from './engine/plan';
export { buildScene, frameCamera } from './engine/scene-builder';
export { buildHouse } from './engine/house-builder';
export { buildFurniture, FURNITURE_TYPES, footprint } from './engine/furniture-builder';
export * from './types';
