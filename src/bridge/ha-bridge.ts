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
      const snapshot: LightSnapshot = { on: e.state === 'on', brightness: brightness(a.brightness), color: rgb, colorTempKelvin };
      this.lights.apply(entityId, snapshot);
    }
    for (const unit of this.acs.units) {
      const entityId = this.bindings.climates?.[unit.config.id] ?? unit.entityId;
      const e = states[entityId]; if (!e) continue;
      const sig = `${e.state}|${JSON.stringify(e.attributes)}`;
      if (this.previous.get(entityId) === sig) continue;
      this.previous.set(entityId, sig); dirty = true;
      const a = e.attributes;
      const snapshot: ClimateSnapshot = { on: e.state !== 'off' && e.state !== 'unavailable' && e.state !== 'unknown', mode: e.state, currentTemperature: a.current_temperature, temperature: a.temperature };
      this.acs.apply(entityId, snapshot);
    }
    if (dirty) this.changed();
  }
  toggle(entityId: string) {
    if (!this.hass || !entityId.startsWith('light.')) return;
    void this.hass.callService('light', 'toggle', { entity_id: entityId });
  }
  setBrightness(entityId: string, pct: number) {
    if (!this.hass || !entityId.startsWith('light.')) return;
    void this.hass.callService('light', 'turn_on', { entity_id: entityId, brightness_pct: Math.max(0, Math.min(100, Math.round(pct))) });
  }
  setTemperature(entityId: string, temperature: number) {
    if (!this.hass || !entityId.startsWith('climate.')) return;
    void this.hass.callService('climate', 'set_temperature', { entity_id: entityId, temperature });
  }
}
