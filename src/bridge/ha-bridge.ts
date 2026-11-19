import type { LightingManager, LightSnapshot } from '../engine/lighting-manager';
import type { AcSimulator, ClimateSnapshot } from '../engine/ac-simulator';

export interface HassEntity { entity_id?: string; state: string; attributes: Record<string, any>; }
export interface HassLike {
  states: Record<string, HassEntity>;
  callService(domain: string, service: string, data: Record<string, unknown>): void | Promise<unknown>;
}
export interface EntityBindings { lights?: Record<string, string>; climates?: Record<string, string>; }
const brightness = (value: unknown) => typeof value === 'number' ? Math.max(0, Math.min(1, value / 255)) : 1;
export class HABridge {
  private hass?: HassLike;
  private previous = new Map<string, string>();
  private localStates = new Map<string, { on: boolean; brightness?: number; mode?: string; target?: number; current?: number; fan?: string; kelvin?: number }>();
  constructor(private lights: LightingManager, private acs: AcSimulator, private bindings: EntityBindings = {}, private changed: () => void = () => {}) {}
  setHass(hass?: HassLike) { this.hass = hass; if (hass) this.updateEntities(hass.states); }
  updateEntities(states: Record<string, HassEntity>) {
    let dirty = false;
    for (const unit of this.lights.units) {
      const entityId = this.bindings.lights?.[unit.config.id] ?? unit.entityId;
      const e = states[entityId]; if (!e) continue;
      const sig = `${e.state}|${JSON.stringify(e.attributes)}`;
      if (this.previous.get(entityId) === sig) continue;
      this.previous.set(entityId, sig); dirty = true;
      const a = e.attributes;
      const rgb = Array.isArray(a.rgb_color) ? `#${a.rgb_color.map((n: number) => Math.round(n).toString(16).padStart(2, '0')).join('')}` : undefined;
      const colorTempKelvin = Number(a.color_temp_kelvin) || (Number(a.color_temp) ? 1000000 / Number(a.color_temp) : undefined);
      const isOn = e.state === 'on';
      this.localStates.set(entityId, { on: isOn, brightness: brightness(a.brightness), kelvin: Number(a.color_temp_kelvin) || (Number(a.color_temp) ? 1000000 / Number(a.color_temp) : undefined) });
      const snapshot: LightSnapshot = { on: isOn, brightness: brightness(a.brightness), color: rgb, colorTempKelvin };
      this.lights.apply(entityId, snapshot);
    }
    for (const unit of this.acs.units) {
      const entityId = this.bindings.climates?.[unit.config.id] ?? unit.entityId;
      const e = states[entityId]; if (!e) continue;
      const sig = `${e.state}|${JSON.stringify(e.attributes)}`;
      if (this.previous.get(entityId) === sig) continue;
      this.previous.set(entityId, sig); dirty = true;
      const a = e.attributes;
      const isOn = e.state !== 'off' && e.state !== 'unavailable' && e.state !== 'unknown';
      this.localStates.set(entityId, { on: isOn, mode: e.state, target: a.temperature, current: a.current_temperature, fan: a.fan_mode });
      const snapshot: ClimateSnapshot = { on: isOn, mode: e.state, currentTemperature: a.current_temperature, temperature: a.temperature, fan: a.fan_mode };
      this.acs.apply(entityId, snapshot);
    }
    if (dirty) this.changed();
  }
  toggle(entityId: string) {
    const isLight = entityId.startsWith('light.') || this.lights.units.some(u => u.entityId === entityId || u.config.id === entityId);
    if (isLight) {
      const current = this.localStates.get(entityId) ?? { on: false };
      const nextOn = !current.on;
      this.localStates.set(entityId, { on: nextOn, brightness: 1 });
      this.lights.apply(entityId, { on: nextOn, brightness: 1 });
      this.changed();

      if (this.hass && this.hass.states[entityId] && entityId.startsWith('light.')) {
        void this.hass.callService('light', 'toggle', { entity_id: entityId });
      }
      return;
    }

    const isClimate = entityId.startsWith('climate.') || this.acs.units.some(u => u.entityId === entityId || u.config.id === entityId);
    if (isClimate) {
      const current = this.localStates.get(entityId) ?? { on: false };
      const nextOn = !current.on;
      const nextMode = nextOn ? 'cool' : 'off';
      this.localStates.set(entityId, { on: nextOn, mode: nextMode });
      this.acs.apply(entityId, { on: nextOn, mode: nextMode, temperature: 22, currentTemperature: 24 });
      this.changed();

      if (this.hass && this.hass.states[entityId] && entityId.startsWith('climate.')) {
        void this.hass.callService('climate', 'set_hvac_mode', { entity_id: entityId, hvac_mode: nextMode });
      }
      return;
    }
  }
  state(entityId: string) { return this.localStates.get(entityId) ?? { on: false, brightness: 1, mode: 'off' }; }
  setBrightness(entityId: string, pct: number) {
    const value = Math.max(0, Math.min(100, Math.round(pct)));
    this.localStates.set(entityId, { ...this.state(entityId), on: value > 0, brightness: value / 100 });
    this.lights.apply(entityId, { on: value > 0, brightness: value / 100 }); this.changed();
    if (this.hass?.states[entityId] && entityId.startsWith('light.')) void this.hass.callService('light', 'turn_on', { entity_id: entityId, brightness_pct: value });
  }
  setLightColor(entityId: string, color: string) { this.lights.apply(entityId, { ...this.state(entityId), on: true, brightness: this.state(entityId).brightness ?? 1, color }); this.changed(); if (this.hass?.states[entityId] && entityId.startsWith('light.')) { const rgb = color.match(/[0-9a-f]{2}/gi)?.map((v) => parseInt(v,16)); if (rgb?.length === 3) void this.hass.callService('light','turn_on',{ entity_id: entityId, rgb_color: rgb }); } }
  setKelvin(entityId: string, colorTempKelvin: number) { this.localStates.set(entityId,{...this.state(entityId),on:true,kelvin:colorTempKelvin}); this.lights.apply(entityId, { ...this.state(entityId), on: true, brightness: this.state(entityId).brightness ?? 1, colorTempKelvin }); this.changed(); if (this.hass?.states[entityId] && entityId.startsWith('light.')) void this.hass.callService('light','turn_on',{ entity_id: entityId, color_temp_kelvin: colorTempKelvin }); }
  setTemperature(entityId: string, temperature: number) {
    this.localStates.set(entityId, { ...this.state(entityId), on: true, target: temperature }); this.acs.apply(entityId, { on: true, mode: this.state(entityId).mode ?? 'cool', temperature, currentTemperature: this.state(entityId).current ?? 24 }); this.changed();
    if (this.hass?.states[entityId] && entityId.startsWith('climate.')) void this.hass.callService('climate', 'set_temperature', { entity_id: entityId, temperature });
  }
  setFanMode(entityId: string, fan: string) { this.localStates.set(entityId,{...this.state(entityId),fan}); this.acs.apply(entityId,{on:this.state(entityId).on,mode:this.state(entityId).mode ?? 'cool',fan}); this.changed(); if(this.hass?.states[entityId] && entityId.startsWith('climate.')) void this.hass.callService('climate','set_fan_mode',{entity_id:entityId,fan_mode:fan}); }
  setClimateMode(entityId: string, mode: string) { this.localStates.set(entityId, { ...this.state(entityId), on: mode !== 'off', mode }); this.acs.apply(entityId, { on: mode !== 'off', mode, temperature: 22, currentTemperature: 24 }); this.changed(); if (this.hass?.states[entityId] && entityId.startsWith('climate.')) void this.hass.callService('climate','set_hvac_mode',{ entity_id: entityId, hvac_mode: mode }); }
  setLightPower(entityId: string, on: boolean) { this.localStates.set(entityId, { ...this.state(entityId), on, brightness: this.state(entityId).brightness ?? 1 }); this.lights.apply(entityId,{ on, brightness:this.state(entityId).brightness ?? 1 }); this.changed(); if(this.hass?.states[entityId] && entityId.startsWith('light.')) void this.hass.callService('light', on ? 'turn_on':'turn_off',{entity_id:entityId}); }
  setClimatePower(entityId: string, on: boolean) { this.setClimateMode(entityId, on ? (this.state(entityId).mode === 'off' ? 'cool' : this.state(entityId).mode!) : 'off'); }
  applyScene(scene: { lights?: Record<string,{on?:boolean;brightness?:number;temp?:number;color?:string}>; acs?: Record<string,{on?:boolean}> }) {
    for (const unit of this.lights.units) { const state=scene.lights?.[unit.config.id] ?? scene.lights?.['*']; if(state) { const entity=unit.entityId; this.localStates.set(entity,{...this.state(entity),on:state.on ?? this.state(entity).on,brightness:state.brightness ?? this.state(entity).brightness ?? 1}); this.lights.apply(entity,{on:state.on ?? this.state(entity).on,brightness:state.brightness ?? this.state(entity).brightness ?? 1,color:state.color,colorTempKelvin:state.temp}); } }
    for (const unit of this.acs.units) { const state=scene.acs?.[unit.config.id] ?? scene.acs?.['*']; if(state?.on !== undefined) this.setClimatePower(unit.entityId,state.on); }
    this.changed();
    if (this.hass) for (const unit of this.lights.units) {
      const setting = scene.lights?.[unit.config.id] ?? scene.lights?.['*'];
      const id = unit.entityId;
      if (!setting || !this.hass.states[id] || !id.startsWith('light.')) continue;
      if (setting.on === false) void this.hass.callService('light', 'turn_off', { entity_id: id });
      else void this.hass.callService('light', 'turn_on', { entity_id: id, ...(setting.brightness !== undefined ? { brightness_pct: Math.round(setting.brightness * 100) } : {}), ...(setting.temp !== undefined ? { color_temp_kelvin: setting.temp } : {}) });
    }
  }
}
