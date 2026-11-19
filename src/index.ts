// Custom element entry point & Lovelace registration.
// Milestone 1: the card mounts the procedural 3D engine on its plan (or the
// bundled sample plan when no `plan:` is configured yet).
import { LitElement, html, css } from 'lit';
import { createWorld, type WorldHandle } from './engine/world';
import { normalizePlan } from './engine/plan';
import samplePlan from './sample-plan';
import type { Plan } from './types';
import { HABridge, type HassLike } from './bridge/ha-bridge';
import * as THREE from 'three';
import './editor/floorplan-canvas';

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
  private activeMode: '3d'|'2d'|'split' = '3d';
  private assistantMessage = '';
  private promptBusy = false;
  private hoveredFixture?: { kind: 'light'|'climate'; id: string; entityId: string; name: string; room: string; stateText: string; x: number; y: number };
  private renderError?: string;
  static properties = {
    hass: { attribute: false },
    config: { attribute: false },
    activeSheet: { state: true },
    hoveredFixture: { state: true },
    activeMode: { state: true },
    assistantMessage: { state: true },
    promptBusy: { state: true },
    renderError: { state: true },
  };

  declare hass: HassLike;
  private _config?: HouseControlCardConfig;
  private world?: WorldHandle;
  private gesture = new Map<number, { x: number; y: number }>();
  private gestureStart = new Map<number, { x: number; y: number }>();
  private lastGesture?: { x: number; y: number; distance: number };
  private cameraTarget = new THREE.Vector3();
  private get config() { return this._config; }
  private set config(value: HouseControlCardConfig | undefined) { const previous=this._config;this._config=value;this.requestUpdate('config',previous); }
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
  private onWheel = (event: WheelEvent) => {
    event.preventDefault();
    if (!this.world) return;
    const camera = this.world.camera;
    const offset = camera.position.clone().sub(this.cameraTarget);
    const spherical = new THREE.Spherical().setFromVector3(offset);
    const factor = event.deltaY < 0 ? 0.88 : 1.14;
    spherical.radius = THREE.MathUtils.clamp(spherical.radius * factor, 2, 45);
    camera.position.copy(this.cameraTarget).add(new THREE.Vector3().setFromSpherical(spherical));
    camera.lookAt(this.cameraTarget);
    this.world.viewFromCamera();
    this.world.requestRender(10);
  };

  private zoom3D = (direction: number) => {
    if (!this.world) return;
    const camera = this.world.camera;
    const offset = camera.position.clone().sub(this.cameraTarget);
    const spherical = new THREE.Spherical().setFromVector3(offset);
    const factor = direction < 0 ? 0.82 : 1.22;
    spherical.radius = THREE.MathUtils.clamp(spherical.radius * factor, 2, 45);
    camera.position.copy(this.cameraTarget).add(new THREE.Vector3().setFromSpherical(spherical));
    camera.lookAt(this.cameraTarget);
    this.world.viewFromCamera();
    this.world.requestRender(15);
  };

  private resetCamera3D = () => {
    if (!this.world) return;
    const plan = this.config?.plan ?? (samplePlan as unknown as Plan);
    const norm = normalizePlan(plan);
    const { minX, minZ, maxX, maxZ } = norm.bounds;
    this.cameraTarget.set((minX + maxX) / 2, 1, (minZ + maxZ) / 2);
    const span = Math.max(maxX - minX, maxZ - minZ);
    const dist = (span / (2 * Math.tan(THREE.MathUtils.degToRad(38 / 2)))) * 1.55 + 2;
    const az = THREE.MathUtils.degToRad(norm.camera?.azimuth ?? 34);
    const el = THREE.MathUtils.degToRad(norm.camera?.elevation ?? 47);
    this.world.camera.position.set(
      this.cameraTarget.x + dist * Math.sin(az) * Math.cos(el),
      this.cameraTarget.y + dist * Math.sin(el),
      this.cameraTarget.z + dist * Math.cos(az) * Math.cos(el)
    );
    this.world.camera.lookAt(this.cameraTarget);
    this.world.viewFromCamera();
    this.world.requestRender(25);
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
      background: #0a0e1a !important;
      color: #f7f8fc;
      font-family: system-ui, sans-serif;
    }
    .stage { position:absolute; inset:0; background:#0a0e1a; }
    .error-box { display:flex; align-items:center; justify-content:center; text-align:center; padding:24px; box-sizing:border-box; }
    .error-box strong { font-size:16px; margin-bottom:6px; display:block; color:#f87171; }
    .retry-btn { margin-top:14px; padding:8px 20px; border-radius:999px; background:#3b82f6; border:1px solid #60a5fa; color:#fff; font:inherit; font-size:13px; font-weight:600; cursor:pointer; }
    .retry-btn:hover { background:#2563eb; }
    canvas {
      width: 100%;
      height: 100%;
      display: block;
      touch-action: none;
      user-select: none;
      -webkit-user-select: none;
    }
    .scenes{position:absolute;z-index:2;top:60px;left:50%;transform:translateX(-50%);display:flex;gap:6px;max-width:calc(100% - 20px);overflow:auto;padding:5px;border-radius:16px;background:#101727bb;backdrop-filter:blur(12px)}
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
    .mode-toggle{position:absolute;z-index:5;top:10px;left:50%;transform:translateX(-50%);display:flex;gap:3px;padding:4px;border:1px solid #ffffff26;border-radius:999px;background:#0f172acc;backdrop-filter:blur(14px);box-shadow:0 6px 24px #0005}
    .mode-toggle button{border:0;border-radius:999px;background:transparent;color:#d5dfef;padding:8px 12px;font:600 12px/1 system-ui,sans-serif;cursor:pointer;white-space:nowrap}.mode-toggle button.active{background:#38bdf8;color:#062132;box-shadow:0 0 16px #38bdf855}
    .content{position:absolute;inset:0}.three-pane,.two-pane{display:none;min-width:0;min-height:0}.content.mode-3d .three-pane{display:block;position:absolute;inset:0}.content.mode-2d .two-pane{display:block;position:absolute;inset:0;padding-top:54px;box-sizing:border-box}.content.mode-split{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:#526074;padding-top:54px;box-sizing:border-box}.content.mode-split .three-pane,.content.mode-split .two-pane{display:block;position:relative;overflow:hidden;background:#0a0e1a}.three-pane canvas{width:100%;height:100%;display:block;touch-action:none}.two-pane floorplan-canvas{display:block;width:100%;height:100%;overflow:auto}.mode-split .two-pane floorplan-canvas{height:100%}
    .assist-wrap{position:absolute;z-index:7;bottom:64px;left:50%;transform:translateX(-50%);width:min(540px,90%)}.assist-response{margin:0 0 8px auto;max-width:92%;max-height:112px;overflow:auto;padding:11px 14px;border:1px solid #ffffff2b;border-radius:16px;background:#101827e8;color:#eef5ff;backdrop-filter:blur(16px);box-shadow:0 8px 30px #0007;font-size:13px}.assist-bar{display:flex;align-items:center;gap:9px;padding:6px 8px 6px 14px;border:1px solid #ffffff35;border-radius:999px;background:#101827dd;backdrop-filter:blur(16px);box-shadow:0 8px 32px #0008}.assist-bar .sparkle{font-size:19px}.assist-bar input{min-width:0;flex:1;border:0;outline:0;background:transparent;color:#fff;font:14px system-ui,sans-serif}.assist-bar input::placeholder{color:#aab6c8}.assist-bar button{width:34px;height:34px;border:0;border-radius:50%;background:#38bdf8;color:#062132;font-size:20px;line-height:1;cursor:pointer}.assist-bar button:disabled{opacity:.55;cursor:wait}
    .error-overlay{position:absolute;inset:0;z-index:8;display:flex;align-items:center;justify-content:center;text-align:center;padding:24px;box-sizing:border-box;background:#0a0e1aee}
    .zoom-controls{position:absolute;z-index:6;right:14px;bottom:74px;display:flex;flex-direction:column;gap:5px;background:#0f172acc;padding:5px;border-radius:12px;border:1px solid #ffffff25;backdrop-filter:blur(14px);box-shadow:0 4px 20px #0008}
    .zoom-controls button{width:32px;height:32px;border:1px solid #ffffff20;background:#ffffff10;color:#e2e8f0;border-radius:8px;font-size:16px;font-weight:700;line-height:1;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s ease}
    .zoom-controls button:hover{background:#38bdf8;color:#062132;border-color:#38bdf8;box-shadow:0 0 12px #38bdf855}
    @media(max-width:620px){.mode-toggle button{padding:8px 8px;font-size:11px}.content.mode-split{grid-template-columns:1fr;grid-template-rows:1fr 1fr}.assist-wrap{bottom:54px}.assist-bar input{font-size:13px}.zoom-controls{right:8px;bottom:60px}}
    @media(max-width:480px){:host{height:min(72vh,520px);min-height:380px}.scenes{top:auto;bottom:8px;transform:translateX(-50%)}.scenes button{padding:7px 10px}.sheet{padding:18px 16px max(18px,env(safe-area-inset-bottom))}}
  `;

  public setConfig(config: HouseControlCardConfig): void {
    if (!config) throw new Error('Invalid configuration');
    this.config = config;
    this.mountWorld();
  }

  public static async getConfigElement() {
    await import('./house-control-card-editor');
    return document.createElement('house-control-card-editor');
  }

  public static getStubConfig() {
    return { type: 'custom:house-control-card', plan: samplePlan };
  }

  public getCardSize(): number {
    return 6;
  }

  private switchMode(mode:'3d'|'2d'|'split') { if(this.activeMode===mode)return;const previous=this.activeMode;this.activeMode=mode;this.activeSheet=undefined;this.requestUpdate('activeMode',previous); }
  private onFrontPlanChanged = (event: CustomEvent<{plan:Plan}|Plan>) => {
    const detail=event.detail as {plan?:Plan};
    const plan=detail?.plan ?? event.detail as Plan;
    if(!plan?.rooms) return;
    this.config={...(this.config??{type:'custom:house-control-card'}),plan};
    this.dispatchEvent(new CustomEvent('config-changed',{detail:{config:this._config},bubbles:true,composed:true}));
    this.mountWorld();
  };
  private addRoomFromPrompt(query:string):string|undefined {
    const intent=/\b(add|create|draw|build)\b.*\b(room|balcony|extension|space)\b|\bbalcony\b|\bexpand\s+(?:the\s+)?living room\b/i;
    if(!intent.test(query))return undefined;
    const plan=this.config?.plan??samplePlan as unknown as Plan;
    const size=query.match(/(\d+(?:\.\d+)?)\s*[x×]\s*(\d+(?:\.\d+)?)/i);
    const width=size?Number(size[1]):3,length=size?Number(size[2]):3;
    const lower=query.toLowerCase();
    const name=lower.includes('balcony')?'Balcony':lower.includes('living room')?'Living Room Extension':lower.includes('bedroom')?'Bedroom Extension':'New Room';
    const slug=name.toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'');
    const ids=new Set(plan.rooms.map(r=>r.id));let id=slug,n=2;while(ids.has(id))id=`${slug}_${n++}`;
    const maxX=plan.rooms.length?Math.max(...plan.rooms.map(r=>r.x+r.width)):0;
    const minZ=plan.rooms.length?Math.min(...plan.rooms.map(r=>r.y)):0;
    const living=plan.rooms.find(r=>`${r.name??''} ${r.id}`.toLowerCase().includes('living'));
    let x=maxX,y=minZ;
    if(name==='Living Room Extension'&&living){x=living.x;y=living.y+living.length;}
    else if(name==='Balcony'&&living){x=living.x-width;y=living.y+Math.max(0,(living.length-length)/2);}
    const next:Plan={...plan,rooms:[...plan.rooms,{id,name,x,y,width,length,floor:'oak'}]};
    this.onFrontPlanChanged(new CustomEvent('plan-changed',{detail:{plan:next}}));
    return `Added ${name} (${width} × ${length} m) to the floor plan.`;
  }
  private onPromptSubmit = async (event:SubmitEvent) => {
    event.preventDefault();const form=event.currentTarget as HTMLFormElement;const input=form.querySelector('input[name="query"]') as HTMLInputElement;const query=input.value.trim();if(!query)return;
    const layoutMessage=this.addRoomFromPrompt(query);this.assistantMessage=layoutMessage??'Sending your request to Home Assistant Assist…';this.promptBusy=true;input.value='';this.requestUpdate();
    try {
      if(!this.hass?.callService)throw new Error('Home Assistant is not connected to this card.');
      const result=await this.hass.callService('conversation','process',{text:query});
      const data=result as any;const speech=data?.response?.speech?.plain?.speech??data?.speech?.plain?.speech??data?.response?.text??data?.text;
      this.assistantMessage=[layoutMessage,speech].filter(Boolean).join(' ') || 'Request sent to Home Assistant Assist.';
    } catch(error) {
      const message=error instanceof Error?error.message:String(error);
      this.assistantMessage=[layoutMessage,`Assist could not respond: ${message}`].filter(Boolean).join(' ');
    } finally { this.promptBusy=false;this.requestUpdate(); }
  };
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
      <div class=${`content mode-${this.activeMode}`}>
        <div class="three-pane"><canvas id="three-stage"></canvas></div>
        <div class="two-pane"><floorplan-canvas .plan=${plan} @plan-changed=${this.onFrontPlanChanged}></floorplan-canvas></div>
      </div>
      <nav class="mode-toggle" aria-label="View mode">
        <button class=${this.activeMode==='3d'?'active':''} @click=${()=>this.switchMode('3d')}>🏠 3D Twin</button>
        <button class=${this.activeMode==='2d'?'active':''} @click=${()=>this.switchMode('2d')}>📐 2D Sketcher</button>
        <button class=${this.activeMode==='split'?'active':''} @click=${()=>this.switchMode('split')}>◫ Split View</button>
      </nav>
      ${this.renderError ? html`<div class="error-overlay"><div><strong>WebGL Initialization Issue</strong><p>${this.renderError}</p><button class="retry-btn" @click=${()=>this.mountWorld()}>Retry 3D Stage</button></div></div>` : ''}
      <form class="assist-wrap" @submit=${this.onPromptSubmit}>
        ${this.assistantMessage ? html`<div class="assist-response" role="status">${this.assistantMessage}</div>` : ''}
        <label class="assist-bar"><span class="sparkle" aria-hidden="true">✨</span><input type="text" name="query" autocomplete="off" placeholder="Ask AI... (e.g. 'Make bedroom cozy', 'Turn off all ACs', 'Add a 4x3 balcony')" ?disabled=${this.promptBusy}><button type="submit" aria-label="Send prompt" ?disabled=${this.promptBusy}>${this.promptBusy?'…':'➔'}</button></label>
      </form>
      ${this.activeMode !== '2d' ? html`
        <div class="zoom-controls" role="toolbar" aria-label="3D Camera Controls">
          <button title="Zoom in (+)" aria-label="Zoom in" @click=${() => this.zoom3D(-1)}>＋</button>
          <button title="Zoom out (−)" aria-label="Zoom out" @click=${() => this.zoom3D(1)}>−</button>
          <button title="Reset camera view" aria-label="Reset view" @click=${this.resetCamera3D}>⟲</button>
        </div>
      ` : ''}
      ${this.activeMode !== '2d' && plan.scenes?.length ? html`<nav class="scenes" aria-label="Lighting scenes">${plan.scenes.map((scene) => html`<button @click=${() => this.applyScene(scene)}>${scene.name}</button>`)}</nav>` : ''}
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

  private setupListeners(): void {
    if (!this.canvas) return;
    this.removeListeners();
    this.canvas.addEventListener('pointerdown', this.onPointerDown);
    this.canvas.addEventListener('pointermove', this.onPointerMove);
    this.canvas.addEventListener('pointerup', this.onPointerUp);
    this.canvas.addEventListener('pointercancel', this.onPointerUp);
    this.canvas.addEventListener('wheel', this.onWheel, { passive: false });
  }

  private removeListeners(): void {
    if (!this.canvas) return;
    this.canvas.removeEventListener('pointerdown', this.onPointerDown);
    this.canvas.removeEventListener('pointermove', this.onPointerMove);
    this.canvas.removeEventListener('pointerup', this.onPointerUp);
    this.canvas.removeEventListener('pointercancel', this.onPointerUp);
    this.canvas.removeEventListener('wheel', this.onWheel);
  }

  connectedCallback(): void {
    super.connectedCallback();
    if (this.shadowRoot) {
      const canvas = this.shadowRoot.querySelector('#three-stage') as HTMLCanvasElement;
      if (canvas) {
        this.canvas = canvas;
        if (!this.world) this.mountWorld();
        this.setupListeners();
      }
    }
  }

  protected firstUpdated(): void {
    const canvas = this.shadowRoot!.querySelector('#three-stage') as HTMLCanvasElement;
    this.canvas = canvas;
    this.mountWorld();
    this.setupListeners();
  }

  private mountWorld() {
    if (!this.canvas) return;
    try {
      this.world?.dispose();
      const plan = this.config?.plan ?? (samplePlan as unknown as Plan);
      this.world = createWorld(this.canvas, normalizePlan(plan), { entities: this.config?.entities });
      this.cameraTarget.set((normalizePlan(plan).bounds.minX + normalizePlan(plan).bounds.maxX) / 2, 1, (normalizePlan(plan).bounds.minZ + normalizePlan(plan).bounds.maxZ) / 2);
      this.bridge = new HABridge(this.world.lighting, this.world.acs, this.config?.entities, () => {
        this.world?.requestRender(30);
        this.requestUpdate();
      });
      if (this.hass) this.bridge.setHass(this.hass);
      this.renderError = undefined;
      this.world.requestRender(10);
      requestAnimationFrame(() => {
        this.world?.resize();
        this.world?.requestRender(10);
      });
    } catch (err) {
      console.error('HouseControl: Error initializing 3D stage', err);
      this.renderError = err instanceof Error ? err.message : String(err);
      this.requestUpdate();
    }
  }

  protected updated(changed: Map<PropertyKey, unknown>): void {
    super.updated(changed as never);
    if (changed.has('hass') && this.hass) this.bridge?.setHass(this.hass);
    // Resize the existing renderer after CSS mode changes. Never dispose or
    // replace the canvas merely to switch views: keep its WebGL context alive.
    if (changed.has('activeMode')) { this.world?.resize(); this.world?.requestRender(10); }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeListeners();
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
