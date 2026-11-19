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

declare global { interface Window { HOUSE_CONTROL_VERSION?: string } }
if (typeof window !== 'undefined') window.HOUSE_CONTROL_VERSION = '0.2.0';

export interface HouseControlCardConfig {
  type: string;
  title?: string;
  plan?: Plan;
  entities?: { lights?: Record<string, string>; climates?: Record<string, string> };
}

export class HouseControlCard extends LitElement {
  private activeSheet?: { kind: 'light'|'climate'; id: string; entityId: string };
  private hoveredFixture?: { kind: 'light'|'climate'; id: string; entityId: string; name: string; room: string; stateText: string; x: number; y: number };
  static properties = {
    hass: { attribute: false },
    config: { attribute: false },
    activeSheet: { state: true },
    hoveredFixture: { state: true },
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
  private fixtureFor(hit?: THREE.Intersection) {
    const object = hit?.object; const data = object?.userData;
    if (!data?.entityId) return undefined;
    const kind = data.kind === 'climate' ? 'climate' : 'light';
    const unit = kind === 'light' ? this.world?.lighting.units.find((u) => u.entityId === data.entityId || u.config.id === data.entityId) : this.world?.acs.units.find((u) => u.entityId === data.entityId || u.config.id === data.entityId);
    return unit ? { kind, id: unit.config.id, entityId: unit.entityId, name: unit.config.name, room: unit.config.room } as const : undefined;
  }
  private updateHover(event: PointerEvent) {
    if (!this.canvas || !this.world || this.gesture.size) return;
    const rect = this.canvas.getBoundingClientRect();
    this.pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
    this.raycaster.setFromCamera(this.pointer, this.world.camera);
    const hit = this.raycaster.intersectObjects(this.world.scene.children, true).find((i) => i.object.userData.entityId);
    const f = this.fixtureFor(hit);
    const oldId = this.hoveredFixture?.entityId;
    if (oldId !== f?.entityId) {
      this.world.lighting.highlight(f?.kind === 'light' ? f.entityId : undefined);
      this.world.acs.highlight(f?.kind === 'climate' ? f.entityId : undefined);
      this.world.requestRender(2);
    }
    this.canvas.style.cursor = f ? 'pointer' : 'grab';
    if (f) {
      const state = this.bridge?.state(f.entityId) ?? { on: false, brightness: 0, mode: 'off' };
      const stateText = f.kind === 'light' ? (state.on ? `${Math.round((state.brightness ?? 1) * 100)}%` : 'Off') : `${state.mode ?? 'off'}${state.target ? ` · ${state.target}°` : ''}`;
      this.hoveredFixture = { ...f, stateText, x: event.clientX - rect.left, y: event.clientY - rect.top };
    } else this.hoveredFixture = undefined;
  }

  private onPointerDown = (event: PointerEvent) => {
    if (!this.canvas || !this.world) return;
    this.canvas.setPointerCapture(event.pointerId);
    this.gesture.set(event.pointerId, { x: event.clientX, y: event.clientY });
    this.gestureStart.set(event.pointerId, { x: event.clientX, y: event.clientY });
    this.lastGesture = this.measureGesture();
  };
  private onPointerMove = (event: PointerEvent) => {
    if (!this.gesture.has(event.pointerId) || !this.world) { this.updateHover(event); return; }
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
    const fixture = this.fixtureFor(hit);
    if (fixture) {
      this.bridge.toggle(fixture.entityId);
      this.activeSheet = fixture;
      this.hoveredFixture = undefined;
      this.world.requestRender(60);
      this.requestUpdate();
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
      position: relative;
      background: #0a0e1a;
      color: #f7f8fc;
      font-family: system-ui, sans-serif;
    }
    .stage { position:absolute; inset:0; }
    canvas {
      width: 100%;
      height: 100%;
      display: block;
      touch-action: none;
      user-select: none;
      -webkit-user-select: none;
    }
    .scenes{position:absolute;z-index:2;top:10px;left:50%;transform:translateX(-50%);display:flex;gap:6px;max-width:calc(100% - 20px);overflow:auto;padding:5px;border-radius:16px;background:#101727bb;backdrop-filter:blur(12px)}
    .scenes button,.close,.power,.step button,.mode button,.fan button{border:1px solid #ffffff25;background:#ffffff12;color:inherit;border-radius:999px;padding:7px 12px;font:inherit;cursor:pointer;white-space:nowrap;user-select:none}.scenes button:hover,.mode button.selected,.fan button.selected{background:#3b82f6;border-color:#60a5fa;color:#fff}
    .tooltip{position:absolute;z-index:3;pointer-events:none;transform:translate(12px,12px);padding:8px 11px;border:1px solid #ffffff25;border-radius:10px;background:#111827dd;backdrop-filter:blur(10px);font-size:12px;box-shadow:0 8px 30px #0006}.tooltip strong{display:block}
    .veil{position:absolute;inset:0;z-index:10;background:#02040a66;backdrop-filter:blur(2px);display:flex;align-items:flex-end;justify-content:center;cursor:default}
    .sheet{position:relative;z-index:11;width:min(420px,100%);max-height:88%;overflow:auto;box-sizing:border-box;padding:20px 20px max(20px,env(safe-area-inset-bottom));border:1px solid #ffffff24;border-bottom:0;border-radius:24px 24px 0 0;background:linear-gradient(145deg,#1e2638f8,#0e1420fc);box-shadow:0 -14px 50px #00000099;backdrop-filter:blur(18px);animation:rise .18s ease-out}
    @keyframes rise{from{transform:translateY(24px);opacity:.5}to{transform:translateY(0);opacity:1}}
    .sheet-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}.sheet-head h3{margin:0;font-size:19px}.subtle{color:#aab5c9;font-size:12px;margin-top:3px}
    .close{font-size:22px;line-height:1;width:34px;height:34px;display:flex;align-items:center;justify-content:center;border-radius:50%;padding:0}.close:hover{background:#ffffff33;border-color:#ffffff66}
    .control{display:grid;gap:8px;margin:16px 0}.control label{display:flex;justify-content:space-between;color:#dce3ef;font-size:13px}.control input[type=range]{width:100%;accent-color:#60a5fa;min-height:32px;cursor:pointer}
    .power{width:100%;padding:10px 16px;font-size:14px;font-weight:600;border-radius:12px;transition:background .15s, border-color .15s}.power.on{background:#2563eb;border-color:#60a5fa;color:#ffffff;box-shadow:0 0 16px #3b82f655}
    .swatches{display:flex;gap:9px;flex-wrap:wrap}.swatches button{width:29px;height:29px;border-radius:50%;border:2px solid #ffffff70;cursor:pointer}
    .step{display:flex;align-items:center;justify-content:center;gap:24px;margin:12px}.step output{font-size:42px;font-variant-numeric:tabular-nums}.step button{width:48px;height:48px;font-size:24px;padding:0}.mode,.fan{display:flex;gap:6px;flex-wrap:wrap}.climate-meta{text-align:center;color:#bdc7d8;font-size:13px}
    @media(max-width:480px){:host{height: min(72vh,520px);min-height:380px}.scenes{top:auto;bottom:8px;transform:translateX(-50%)}.scenes button{padding:7px 10px}.sheet{padding:18px 16px max(18px,env(safe-area-inset-bottom))}}
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

  private closeSheet = (e?: Event) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    this.activeSheet = undefined;
    this.requestUpdate();
  };
  private applyScene = (scene: NonNullable<Plan['scenes']>[number]) => {
    this.bridge?.applyScene(scene);
    this.world?.requestRender(90);
    this.requestUpdate();
  };
  private setLightPower = (id: string, on: boolean) => {
    this.bridge?.setLightPower(id, on);
    this.world?.requestRender(60);
    this.requestUpdate();
  };
  private changeBrightness = (id: string, value: number) => {
    this.bridge?.setBrightness(id, value);
    this.world?.requestRender(60);
    this.requestUpdate();
  };
  private changeKelvin = (id: string, value: number) => {
    this.bridge?.setKelvin(id, value);
    this.world?.requestRender(60);
    this.requestUpdate();
  };
  private changeColor = (id: string, color: string) => {
    this.bridge?.setLightColor(id, color);
    this.world?.requestRender(60);
    this.requestUpdate();
  };
  private setClimatePower = (id: string, on: boolean) => {
    this.bridge?.setClimatePower(id, on);
    this.world?.requestRender(60);
    this.requestUpdate();
  };
  private changeTemperature = (id: string, value: number) => {
    this.bridge?.setTemperature(id, value);
    this.world?.requestRender(60);
    this.requestUpdate();
  };
  private changeClimateMode = (id: string, mode: string) => {
    this.bridge?.setClimateMode(id, mode);
    this.world?.requestRender(60);
    this.requestUpdate();
  };
  private changeFanMode = (id: string, fan: string) => {
    this.bridge?.setFanMode(id, fan);
    this.world?.requestRender(60);
    this.requestUpdate();
  };

  protected render() {
    const plan = this.config?.plan ?? samplePlan as unknown as Plan;
    const sheet = this.activeSheet;
    const light = sheet?.kind === 'light' ? this.world?.lighting.units.find((u) => u.config.id === sheet.id) : undefined;
    const ac = sheet?.kind === 'climate' ? this.world?.acs.units.find((u) => u.config.id === sheet.id) : undefined;
    const entityState = sheet ? this.bridge?.state(sheet.entityId) ?? { on: false, brightness: 1, mode: 'off' } : undefined;
    const climateHa = sheet?.kind === 'climate' ? this.hass?.states?.[sheet.entityId]?.attributes : undefined;
    const brightness = Math.round((entityState?.brightness ?? 1) * 100);
    const target = entityState?.target ?? (Number(climateHa?.temperature) || 22);
    const current = entityState?.current ?? (Number(climateHa?.current_temperature) || 24);
    const kelvin = entityState?.kelvin ?? (Number(this.hass?.states?.[sheet?.entityId ?? '']?.attributes?.color_temp_kelvin) || 4000);
    const roomName = sheet ? plan.rooms.find((r) => r.id === (light?.config.room ?? ac?.config.room))?.name ?? (light?.config.room ?? ac?.config.room) : '';
    const colors = ['#ff5a4f','#ff9a3c','#ffd84a','#5fe08a','#42d6e8','#4f8dff','#8b5cff','#ff5fc4'];
    return html`<div class="stage">
      <canvas id="view"></canvas>
      ${plan.scenes?.length ? html`<nav class="scenes" aria-label="Lighting scenes">${plan.scenes.map((scene) => html`<button @click=${() => this.applyScene(scene)}>${scene.name}</button>`)}</nav>` : ''}
      ${this.hoveredFixture ? html`<div class="tooltip" style=${`left:${Math.min(this.hoveredFixture.x, (this.clientWidth || 400) - 220)}px;top:${Math.min(this.hoveredFixture.y, 80)}px`}><strong>${this.hoveredFixture.room} · ${this.hoveredFixture.name}</strong>${this.hoveredFixture.stateText}</div>` : ''}
      ${sheet ? html`<div class="veil" @click=${this.closeSheet}><section class="sheet" role="dialog" aria-modal="true" @click=${(e: Event) => e.stopPropagation()}>
        <header class="sheet-head"><div><h3>${light?.config.name ?? ac?.config.name}</h3><div class="subtle">${roomName} · ${sheet.entityId}</div></div><button class="close" aria-label="Close" @click=${this.closeSheet}>×</button></header>
        ${light ? html`<button class="power ${entityState?.on ? 'on':''}" @click=${() => this.setLightPower(sheet.entityId, !entityState?.on)}>${entityState?.on ? '● On' : '○ Off'}</button>
          <div class="control"><label>Brightness <span>${brightness}%</span></label><input aria-label="Brightness" type="range" min="0" max="100" .value=${String(brightness)} @input=${(e: Event) => this.changeBrightness(sheet.entityId, Number((e.target as HTMLInputElement).value))}></div>
          ${light.config.capabilities.includes('temp') ? html`<div class="control"><label>Color temperature <span>${Math.round(kelvin)} K</span></label><input aria-label="Color temperature" type="range" min="2200" max="6500" step="100" .value=${String(kelvin)} @input=${(e: Event) => this.changeKelvin(sheet.entityId, Number((e.target as HTMLInputElement).value))}><div class="hint">2200 K · Candle　　4000 K · Neutral　　6500 K · Daylight</div></div>` : ''}
          ${light.config.capabilities.includes('color') ? html`<div class="control"><label>Color</label><div class="swatches">${colors.map((color) => html`<button style=${`background:${color}`} aria-label=${color} @click=${() => this.changeColor(sheet.entityId, color)}></button>`)}</div></div>` : ''}` : ''}
        ${ac ? html`<button class="power ${entityState?.on ? 'on':''}" @click=${() => this.setClimatePower(sheet.entityId, !entityState?.on)}>${entityState?.on ? '● On' : '○ Off'}</button>
          <div class="climate-meta">Current temperature · ${current}°</div><div class="step"><button aria-label="Decrease target temperature" @click=${() => this.changeTemperature(sheet.entityId, Number(target) - 1)}>−</button><output>${Number(target).toFixed(1)}°</output><button aria-label="Increase target temperature" @click=${() => this.changeTemperature(sheet.entityId, Number(target) + 1)}>+</button></div>
          <div class="control"><label>HVAC mode</label><div class="mode">${['cool','heat','fan','dry','auto','off'].map((mode) => html`<button class=${entityState?.mode === mode ? 'selected':''} @click=${() => this.changeClimateMode(sheet.entityId, mode)}>${mode[0].toUpperCase()+mode.slice(1)}</button>`)}</div></div>
          <div class="control"><label>Fan speed</label><div class="fan">${['auto','low','medium','high','turbo'].map((fan) => html`<button class=${entityState?.fan === fan ? 'selected':''} @click=${() => this.changeFanMode(sheet.entityId, fan)}>${fan}</button>`)}</div></div>` : ''}
      </section></div>` : ''}
    </div>`;
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
    const plan = this.config?.plan ?? (samplePlan as unknown as Plan);
    this.world = createWorld(this.canvas, normalizePlan(plan), { entities: this.config?.entities });
    this.cameraTarget.set((normalizePlan(plan).bounds.minX + normalizePlan(plan).bounds.maxX) / 2, 1, (normalizePlan(plan).bounds.minZ + normalizePlan(plan).bounds.maxZ) / 2);
    this.bridge = new HABridge(this.world.lighting, this.world.acs, this.config?.entities, () => {
      this.world?.requestRender(30);
      this.requestUpdate();
    });
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
