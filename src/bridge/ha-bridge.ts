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
      const current = this.state(entityId);
      const nextOn = !current.on;
      this.localStates.set(entityId, { ...current, on: nextOn, brightness: current.brightness ?? 1 });
      this.lights.apply(entityId, { on: nextOn, brightness: current.brightness ?? 1, colorTempKelvin: current.kelvin });
      this.changed();

      const haId = this.bindings.lights?.[entityId] ?? entityId;
      if (this.hass && this.hass.states[haId] && haId.startsWith('light.')) {
        void this.hass.callService('light', 'toggle', { entity_id: haId });
      }
      return;
    }

    const isClimate = entityId.startsWith('climate.') || this.acs.units.some(u => u.entityId === entityId || u.config.id === entityId);
    if (isClimate) {
      const current = this.state(entityId);
      const nextOn = !current.on;
      const nextMode = nextOn ? 'cool' : 'off';
      this.localStates.set(entityId, { ...current, on: nextOn, mode: nextMode, target: current.target ?? 22, current: current.current ?? 24 });
      this.acs.apply(entityId, { on: nextOn, mode: nextMode, temperature: current.target ?? 22, currentTemperature: current.current ?? 24 });
      this.changed();

      const haId = this.bindings.climates?.[entityId] ?? entityId;
      if (this.hass && this.hass.states[haId] && haId.startsWith('climate.')) {
        void this.hass.callService('climate', 'set_hvac_mode', { entity_id: haId, hvac_mode: nextMode });
      }
      return;
    }
  }
  state(entityId: string) {
    if (this.localStates.has(entityId)) return this.localStates.get(entityId)!;
    const haLight = this.bindings.lights?.[entityId];
    if (haLight && this.localStates.has(haLight)) return this.localStates.get(haLight)!;
    const haClimate = this.bindings.climates?.[entityId];
    if (haClimate && this.localStates.has(haClimate)) return this.localStates.get(haClimate)!;
    return { on: false, brightness: 1, mode: 'off' };
  }
  setBrightness(entityId: string, pct: number) {
    const value = Math.max(0, Math.min(100, Math.round(pct)));
    const cur = this.state(entityId);
    const on = value > 0;
    this.localStates.set(entityId, { ...cur, on, brightness: value / 100 });
    this.lights.apply(entityId, { on, brightness: value / 100, colorTempKelvin: cur.kelvin });
    this.changed();
    const haId = this.bindings.lights?.[entityId] ?? entityId;
    if (this.hass?.states[haId] && haId.startsWith('light.')) {
      if (value === 0) void this.hass.callService('light', 'turn_off', { entity_id: haId });
      else void this.hass.callService('light', 'turn_on', { entity_id: haId, brightness_pct: value });
    }
  }
  setLightColor(entityId: string, color: string) {
    const cur = this.state(entityId);
    this.localStates.set(entityId, { ...cur, on: true });
    this.lights.apply(entityId, { on: true, brightness: cur.brightness ?? 1, color });
    this.changed();
    const haId = this.bindings.lights?.[entityId] ?? entityId;
    if (this.hass?.states[haId] && haId.startsWith('light.')) {
      const rgb = color.match(/[0-9a-f]{2}/gi)?.map((v) => parseInt(v, 16));
      if (rgb?.length === 3) void this.hass.callService('light', 'turn_on', { entity_id: haId, rgb_color: rgb });
    }
  }
  setKelvin(entityId: string, colorTempKelvin: number) {
    const cur = this.state(entityId);
    this.localStates.set(entityId, { ...cur, on: true, kelvin: colorTempKelvin });
    this.lights.apply(entityId, { on: true, brightness: cur.brightness ?? 1, colorTempKelvin });
    this.changed();
    const haId = this.bindings.lights?.[entityId] ?? entityId;
    if (this.hass?.states[haId] && haId.startsWith('light.')) {
      void this.hass.callService('light', 'turn_on', { entity_id: haId, color_temp_kelvin: colorTempKelvin });
    }
  }
  setTemperature(entityId: string, temperature: number) {
    const cur = this.state(entityId);
    this.localStates.set(entityId, { ...cur, on: true, target: temperature });
    this.acs.apply(entityId, { on: true, mode: cur.mode ?? 'cool', temperature, currentTemperature: cur.current ?? 24 });
    this.changed();
    const haId = this.bindings.climates?.[entityId] ?? entityId;
    if (this.hass?.states[haId] && haId.startsWith('climate.')) {
      void this.hass.callService('climate', 'set_temperature', { entity_id: haId, temperature });
    }
  }
  setFanMode(entityId: string, fan: string) {
    const cur = this.state(entityId);
    this.localStates.set(entityId, { ...cur, fan });
    this.acs.apply(entityId, { on: cur.on, mode: cur.mode ?? 'cool', fan });
    this.changed();
    const haId = this.bindings.climates?.[entityId] ?? entityId;
    if (this.hass?.states[haId] && haId.startsWith('climate.')) {
      void this.hass.callService('climate', 'set_fan_mode', { entity_id: haId, fan_mode: fan });
    }
  }
  setClimateMode(entityId: string, mode: string) {
    const cur = this.state(entityId);
    const on = mode !== 'off';
    this.localStates.set(entityId, { ...cur, on, mode });
    this.acs.apply(entityId, { on, mode, temperature: cur.target ?? 22, currentTemperature: cur.current ?? 24 });
    this.changed();
    const haId = this.bindings.climates?.[entityId] ?? entityId;
    if (this.hass?.states[haId] && haId.startsWith('climate.')) {
      void this.hass.callService('climate', 'set_hvac_mode', { entity_id: haId, hvac_mode: mode });
    }
  }
  setLightPower(entityId: string, on: boolean) {
    const cur = this.state(entityId);
    this.localStates.set(entityId, { ...cur, on, brightness: cur.brightness ?? 1 });
    this.lights.apply(entityId, { on, brightness: cur.brightness ?? 1, colorTempKelvin: cur.kelvin });
    this.changed();
    const haId = this.bindings.lights?.[entityId] ?? entityId;
    if (this.hass?.states[haId] && haId.startsWith('light.')) {
      void this.hass.callService('light', on ? 'turn_on' : 'turn_off', { entity_id: haId });
    }
  }
  setClimatePower(entityId: string, on: boolean) {
    const cur = this.state(entityId);
    this.setClimateMode(entityId, on ? (cur.mode === 'off' ? 'cool' : (cur.mode ?? 'cool')) : 'off');
  }
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
