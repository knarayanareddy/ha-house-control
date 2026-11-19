import { normalizePlan } from '../src/engine/plan';
import { LightingManager } from '../src/engine/lighting-manager';
import { AcSimulator } from '../src/engine/ac-simulator';
import { HABridge, type HassLike } from '../src/bridge/ha-bridge';
import type { Plan } from '../src/types';
import sample from '../src/sample-plan.json';

const config = normalizePlan(sample as unknown as Plan);
const lightDef = config.lightUnits[0], acDef = config.acUnits[0];
const bindings = { lights: { [lightDef.id]: 'light.test_ceiling' }, climates: { [acDef.id]: 'climate.test_ac' } };
const lighting = new LightingManager(config.lightUnits, bindings.lights);
const acs = new AcSimulator(config.acUnits, bindings.climates);
const calls: Array<[string, string, Record<string, unknown>]> = [];
const hass: HassLike = {
  states: {
    'light.test_ceiling': { state: 'on', attributes: { brightness: 128, color_temp_kelvin: 3000 } },
    'climate.test_ac': { state: 'cool', attributes: { current_temperature: 25, temperature: 21, fan_mode: 'high' } },
  },
  callService: async (domain, service, data) => { calls.push([domain, service, data]); },
};
let dirties = 0;
const bridge = new HABridge(lighting, acs, bindings, () => dirties++);
bridge.setHass(hass);
if (dirties !== 1) throw new Error('HA states did not trigger a scene update');
const light = lighting.units[0];
light.update(1);
if (Math.abs(light.light.intensity - (128 / 255) * 12) > 0.05) throw new Error('HA brightness was not mapped to Three.js light intensity');
if (Math.abs(light.light.color.r - 1) > .05 || light.light.color.b > .8) throw new Error('Kelvin color temperature was not mapped to light color');
if (acs.units[0].update(.5) !== true) throw new Error('Active climate entity did not animate AC airflow');
bridge.toggle('light.test_ceiling');
bridge.setBrightness('light.test_ceiling', 44);
bridge.setTemperature('climate.test_ac', 19);
bridge.setClimateMode('climate.test_ac', 'heat');
bridge.setFanMode('climate.test_ac', 'turbo');
if (calls.length !== 5 || calls[0][1] !== 'toggle' || calls[1][2].brightness_pct !== 44 || calls[2][1] !== 'set_temperature' || calls[3][1] !== 'set_hvac_mode' || calls[4][1] !== 'set_fan_mode') throw new Error('HA service calls were not dispatched correctly');
console.log('PASS  HA light brightness and color temperature mapping');
console.log('PASS  climate state activates animated AC airflow');
console.log('PASS  service calls cover toggle, dimming, temperature, HVAC mode, fan mode');
