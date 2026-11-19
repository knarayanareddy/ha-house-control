import { LitElement, html, css } from 'lit';
import type { Plan } from './types';
import type { HassLike } from './bridge/ha-bridge';
import sample from './sample-plan.json';

interface EditorConfig { type: string; title?: string; plan?: Plan; entities?: { lights?: Record<string, string>; climates?: Record<string, string> }; }
export class HouseControlCardEditor extends LitElement {
  static properties = { hass: { attribute: false }, _config: { state: true } };
  declare hass?: HassLike & { states: Record<string, { attributes: Record<string, unknown>; state: string }> };
  private _config: EditorConfig = { type: 'custom:house-control-card', plan: sample as unknown as Plan };
  static styles = css`
    :host{display:block;font:14px/1.45 var(--primary-font-family,Arial,sans-serif);color:var(--primary-text-color,#222)}
    .wrap{display:grid;gap:14px}.row{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}label{display:grid;gap:4px}input,select,textarea,button{box-sizing:border-box;font:inherit;color:inherit;background:var(--card-background-color,#fff);border:1px solid var(--divider-color,#bbb);border-radius:6px;padding:8px;min-width:0}textarea{width:100%;min-height:150px;font-family:monospace}.section{border:1px solid var(--divider-color,#bbb);border-radius:8px;padding:12px}.rooms{display:grid;gap:8px}.room{display:grid;grid-template-columns:1fr repeat(4,minmax(58px,74px)) auto;align-items:end;gap:6px}.actions{display:flex;gap:8px;flex-wrap:wrap}button{cursor:pointer}.hint{opacity:.75;font-size:12px}
    details{border:1px solid var(--divider-color,#bbb);border-radius:8px;padding:10px;background:var(--card-background-color,#fafafa)}summary{font-weight:600;cursor:pointer;margin-bottom:6px}.guide-content{font-size:13px;line-height:1.5;margin-top:8px;color:var(--secondary-text-color,#555)}.guide-content h4{margin:10px 0 4px 0;color:var(--primary-text-color,#222)}.guide-content ul{margin:4px 0 8px 18px;padding:0}.guide-content code{background:rgba(0,0,0,0.06);padding:2px 4px;border-radius:4px;font-size:12px}
  `;
  setConfig(config: EditorConfig) { this._config = structuredClone(config); this.requestUpdate(); }
  private plan(): Plan { return this._config.plan ?? ((sample as unknown as Plan)); }
  private commit(next: EditorConfig) { this._config = next; this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: next }, bubbles: true, composed: true })); }
  private patchPlan(patch: Partial<Plan>) { this.commit({ ...this._config, plan: { ...this.plan(), ...patch } }); }
  private addRoom() {
    const rooms = [...this.plan().rooms, { id: `room_${this.plan().rooms.length + 1}`, name: `Room ${this.plan().rooms.length + 1}`, x: this.plan().rooms.reduce((max, room) => Math.max(max, room.x + room.width), 0), y: 0, width: 4, length: 4, floor: 'oak' as const }];
    this.patchPlan({ rooms });
  }
  private updateRoom(index: number, key: 'x'|'y'|'width'|'length', value: number) { const rooms = [...this.plan().rooms]; rooms[index] = { ...rooms[index], [key]: value }; this.patchPlan({ rooms }); }
  private entities(domain: 'light'|'climate') { return Object.keys(this.hass?.states ?? {}).filter((id) => id.startsWith(`${domain}.`)).sort(); }
  private bind(kind: 'lights'|'climates', planId: string, entityId: string) {
    const mappings = { ...(this._config.entities?.[kind] ?? {}) };
    if (entityId) mappings[planId] = entityId; else delete mappings[planId];
    this.commit({ ...this._config, entities: { ...this._config.entities, [kind]: mappings } });
  }
  private addDevice(kind: 'light'|'climate') {
    const entityId = this.entities(kind)[0]; if (!entityId) return;
    const plan = this.plan();
    if (kind === 'light') this.patchPlan({ lights: [...(plan.lights ?? []), { id: `fixture_${(plan.lights?.length ?? 0) + 1}`, roomId: plan.rooms[0]?.id ?? '', x: 2, y: 2, z: 2.5, fixture: 'pendant' }] });
    else this.patchPlan({ acs: [...(plan.acs ?? []), { id: `ac_${(plan.acs?.length ?? 0) + 1}`, roomId: plan.rooms[0]?.id ?? '', wall: 'north', x: 1.5, y: 2.2 }] });
    // bind after commit, defaulting to first discovered HA entity
    const id = kind === 'light' ? `fixture_${plan.lights?.length ?? 1}` : `ac_${plan.acs?.length ?? 1}`;
    this.bind(kind === 'light' ? 'lights' : 'climates', id, entityId);
  }
  protected render() {
    const p = this.plan();
    return html`<div class="wrap">
      <label>Card title<input .value=${this._config.title ?? ''} @input=${(e: Event) => this.commit({ ...this._config, title: (e.target as HTMLInputElement).value })}></label>
      <section class="section"><strong>Room layout</strong><div class="hint">Set room footprint in metres; rooms are positioned from the origin.</div><div class="rooms">${p.rooms.map((r, i) => html`<div class="room"><label>${r.name ?? r.id}<small>${r.id}</small></label><label>X<input aria-label="Room X position" type="number" step="0.1" .value=${String(r.x)} @change=${(e: Event) => this.updateRoom(i,'x',Number((e.target as HTMLInputElement).value))}></label><label>Z<input aria-label="Room Z position" type="number" step="0.1" .value=${String(r.y)} @change=${(e: Event) => this.updateRoom(i,'y',Number((e.target as HTMLInputElement).value))}></label><label>Width<input type="number" min="1" step="0.1" .value=${String(r.width)} @change=${(e: Event) => this.updateRoom(i,'width',Number((e.target as HTMLInputElement).value))}></label><label>Length<input type="number" min="1" step="0.1" .value=${String(r.length)} @change=${(e: Event) => this.updateRoom(i,'length',Number((e.target as HTMLInputElement).value))}></label><button @click=${() => this.patchPlan({ rooms: p.rooms.filter((_, n) => n !== i) })}>Remove</button></div>`)}</div><div class="actions"><button @click=${this.addRoom}>Add room</button><button @click=${() => this.patchPlan({ furniture: [...(p.furniture ?? []), { type: 'sofa', x: 1, y: 1, rotation: 0 }] })}>Add sofa</button></div></section>
      <section class="section"><strong>Entity bindings</strong><div class="hint">Choose devices from entities exposed by Home Assistant.</div>${(p.lights ?? []).map((l) => html`<label>Light fixture ${l.id}<select .value=${this._config.entities?.lights?.[l.id] ?? (l.id.startsWith('light.') ? l.id : '')} @change=${(e: Event) => this.bind('lights',l.id,(e.target as HTMLSelectElement).value)}><option value="">Unassigned</option>${this.entities('light').map((id) => html`<option value=${id}>${id}</option>`)}</select></label>`)}${(p.acs ?? []).map((a) => html`<label>Climate unit ${a.id}<select .value=${this._config.entities?.climates?.[a.id] ?? (a.id.startsWith('climate.') ? a.id : '')} @change=${(e: Event) => this.bind('climates',a.id,(e.target as HTMLSelectElement).value)}><option value="">Unassigned</option>${this.entities('climate').map((id) => html`<option value=${id}>${id}</option>`)}</select></label>`)}<div class="actions"><button @click=${() => this.addDevice('light')}>Add light</button><button @click=${() => this.addDevice('climate')}>Add climate unit</button></div></section>
      <details><summary>Advanced plan YAML/JSON</summary><textarea .value=${JSON.stringify(p,null,2)} @change=${(e: Event) => { try { this.patchPlan(JSON.parse((e.target as HTMLTextAreaElement).value)); } catch { /* keep editor text until corrected */ } }}></textarea></details>
      <details class="guide">
        <summary>📖 How to Configure Your Home Layout</summary>
        <div class="guide-content">
          <h4>A. Interactive Visual Editor (No code needed)</h4>
          <ul>
            <li><strong>Room Footprints:</strong> Set room origin coordinates (X, Z) and dimensions (Width, Length) in metres.</li>
            <li><strong>Entity Bindings:</strong> Select your real Home Assistant entities (<code>light.*</code>, <code>climate.*</code>) from the dropdowns above.</li>
            <li><strong>Add Devices:</strong> Use the "Add light" or "Add climate unit" buttons to place new controllable fixtures.</li>
          </ul>
          <h4>B. How the 3D Engine Adapts</h4>
          <ul>
            <li><strong>Auto Framing:</strong> Automatically computes the 3D bounding box of all rooms and frames the isometric camera.</li>
            <li><strong>Dynamic Cut-Away Walls:</strong> Walls facing the camera drop down to 1.25m so you can see inside all rooms.</li>
            <li><strong>Parametric Openings:</strong> Windows and doors are carved out at coordinate offsets with sills and lintels.</li>
            <li><strong>Two-Way Synchronization:</strong> Clicking fixtures toggles them and dispatches Home Assistant service calls; real switch changes update the 3D model live.</li>
          </ul>
        </div>
      </details>
    </div>`;
  }
}
if (!customElements.get('house-control-card-editor')) customElements.define('house-control-card-editor', HouseControlCardEditor);
