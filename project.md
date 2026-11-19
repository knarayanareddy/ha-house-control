# HA-House-Control: 3D Procedural Floor Plan Card for Home Assistant

> **Agent Directive & Specification Document**  
> This document specifies the complete architecture, source analysis, integration requirements, and step-by-step implementation plan for adapting [`0xProbabillity/house-control`](https://github.com/0xProbabillity/house-control) into a native, high-performance **Home Assistant Lovelace Custom Card** (`ha-house-control`).

---

## 1. Executive Summary & Vision

### 1.1 The Objective
Build a web-native, interactive 3D procedural floor plan card for Home Assistant dashboards. Instead of requiring users to build complex models in CAD or Blender, this card renders interactive 3D rooms, walls, doors, windows, furniture, and devices dynamically using Three.js from a simple JSON schema or an intuitive in-browser visual editor.

Real Home Assistant entities directly illuminate the 3D scene (lights emit real lumens and color temperatures) and drive dynamic visual effects (ACs blow visible temperature-colored airflow, blinds raise and lower, motion sensors highlight rooms).

### 1.2 Comparison with Current Solutions

| Feature | Picture Elements Card | Floor3D-Card (HACS) | **HA-House-Control (This Project)** |
| :--- | :--- | :--- | :--- |
| **Dimension** | 2D Static Image Overlay | 3D Static Mesh (.gltf/.obj) | **3D Dynamic Procedural Mesh** |
| **Authoring Requirement** | Photoshop / Floorplanner | Blender / CAD + 3D Export | **In-Dashboard 2D/3D Visual Editor** |
| **Setup Time** | Hours of manual CSS positioning | Days of 3D modeling and UV mapping | **Minutes (draw walls, link entities)** |
| **Device Illumination** | Simulated CSS glow / PNG swap | Pre-baked Blender lightmaps | **Real-time Three.js physical lighting** |
| **Interactive Controls** | Basic tap / toggle popups | Raycast click on 3D objects | **Raycast click, drag-to-dim, AC controls** |
| **Device Support** | All browsers | Desktop / WebGL | **Mobile, Wall Tablets, Desktop** |

---

## 2. In-Depth Reference Analysis: `0xProbabillity/house-control`

The reference repository is: [`https://github.com/0xProbabillity/house-control`](https://github.com/0xProbabillity/house-control).

### 2.1 Reference Architecture
`0xProbabillity/house-control` is composed of two layers:
1. **Native Shells (`macos/`, `ios/`)**: Thin Swift wrappers (AppKit menu bar + notch popover, SwiftUI iPhone app, widgets) that connect to Tuya Cloud, Home Assistant REST/WebSocket, Hue Bridge, and HomeKit.
2. **Web Core (`web/`)**: A Vite + Three.js + Lucide web application located in `web/src/`. This web application contains the entire 3D rendering pipeline, procedural mesh generation, physics/lighting simulations, and the visual floor plan editor.

### 2.2 Key Source Modules in `house-control/web/src/`

- **`three/world.js`**: Core Three.js scene setup, WebGLRenderer, OrbitControls camera navigation, shadow maps, ambient and hemisphere lighting, resize handlers, and render loop.
- **`three/house.js`**: Procedural geometry builder. Parses the room schema and extrudes 2D room rectangles into 3D walls, cutouts for doors/windows, baseboards, and ceiling cutouts.
- **`three/lights.js`**: Creates physical Three.js `PointLight` and `SpotLight` objects attached to ceiling lamps or floor fixtures. Dynamically updates light color (Kelvin/RGB), intensity, and attenuation when a device state updates.
- **`three/ac.js`**: Air conditioner particle system. Emits animated velocity-driven airflow particles colored by heating (warm orange) or cooling (cool cyan/blue) states.
- **`three/furniture.js`**: Procedural furniture generator (sofas, tables, beds, desks, kitchen counters, TVs) constructed from parameterized box/cylinder primitives.
- **`editor/editor.js` & `connections.js`**: The 2D drag-and-drop floor plan designer. Allows drawing walls, placing doors/windows/furniture, and binding lights/ACs to target device IDs.
- **`bridge.js`**: The messaging adapter. In `house-control`, it calls `window.webkit.messageHandlers.house.postMessage()`. **This is the primary module to replace in Home Assistant.**

### 2.3 The Schema Format (`home.json`)
The 3D world is generated from a single JSON structure:
```json
{
  "name": "My Home",
  "outdoorTemp": 22,
  "rooms": [
    {
      "id": "living_room",
      "name": "Living Room",
      "x": 0,
      "y": 0,
      "width": 6.5,
      "length": 4.5,
      "height": 2.8,
      "walls": { "north": "open", "south": "solid", "east": "solid", "west": "window" }
    }
  ],
  "doors": [
    { "wallId": "living_room_south", "offset": 1.2, "width": 0.9, "height": 2.1 }
  ],
  "furniture": [
    { "type": "sofa_3seater", "roomId": "living_room", "x": 2.0, "y": 1.5, "rotation": 90 },
    { "type": "tv_unit", "roomId": "living_room", "x": 2.0, "y": 4.0, "rotation": 270 }
  ],
  "lights": [
    { "id": "light.living_room_ceiling", "roomId": "living_room", "x": 3.25, "y": 2.25, "z": 2.7, "fixture": "ceiling_pendant" }
  ],
  "acs": [
    { "id": "climate.living_room_ac", "roomId": "living_room", "wall": "north", "x": 3.0, "y": 2.3 }
  ]
}
```

---

## 3. Home Assistant Target Architecture (`ha-house-control-card`)

### 3.1 Custom Card Lifecycle & API Contract
In Home Assistant, custom dashboard cards implement the Web Component custom elements standard:

```typescript
import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, LovelaceCard, LovelaceCardConfig } from './types';

@customElement('house-control-card')
export class HouseControlCard extends LitElement implements LovelaceCard {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private config!: LovelaceCardConfig;

  // Called by Lovelace when card configuration is loaded or updated
  public setConfig(config: LovelaceCardConfig): void {
    if (!config) throw new Error('Invalid configuration');
    this.config = config;
  }

  // Declares visual editor element for the Lovelace UI editor
  public static async getConfigElement() {
    await import('./house-control-card-editor');
    return document.createElement('house-control-card-editor');
  }

  // Fallback initial stub configuration
  public static getStubConfig() {
    return {
      type: 'custom:house-control-card',
      view_mode: '3d',
      plan: { rooms: [], furniture: [], lights: [], acs: [] }
    };
  }

  // Reactive property update: diffs entity states and updates Three.js scene
  protected updated(changedProps: PropertyValues): void {
    super.updated(changedProps);
    if (changedProps.has('hass') && this.hass) {
      this.bridge.updateEntities(this.hass.states);
    }
  }
}
```

### 3.2 The Home Assistant Bridge (`ha-bridge.ts`)
Instead of `bridge.js` dispatching to WebKit Swift handlers, `ha-bridge.ts` interacts directly with `this.hass`:

1. **Reading States**:
   - `const lightState = this.hass.states[entityId];`
   - Attributes: `lightState.state === 'on'`, `lightState.attributes.brightness` (0-255), `lightState.attributes.rgb_color` `[r, g, b]`, `lightState.attributes.color_temp_kelvin`.
   - Climate: `climateState.attributes.current_temperature`, `climateState.attributes.temperature`, `climateState.state` (`cool`, `heat`, `off`, `dry`).
2. **Calling Services**:
   - Toggling lights: `this.hass.callService('light', 'toggle', { entity_id: entityId });`
   - Dimming: `this.hass.callService('light', 'turn_on', { entity_id: entityId, brightness_pct: pct });`
   - Setting AC: `this.hass.callService('climate', 'set_temperature', { entity_id: entityId, temperature: temp });`
3. **Subscribing to Updates**:
   - Lovelace cards automatically receive `hass` updates on every state change event via `set hass(val)`. Diffs should be memoized to avoid redundant 3D scene redraws.

---

## 4. Step-by-Step Implementation Roadmap

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        IMPLEMENTATION PHASES                                │
│                                                                             │
│  Phase 1: Project Setup & Modern Build Tooling (Vite, Rollup, TS, Three.js) │
│                                     ▼                                       │
│  Phase 2: Three.js 3D Engine Migration & WebGL Pipeline                      │
│                                     ▼                                       │
│  Phase 3: Home Assistant Reactive Bridge & Entity Controllers                │
│                                     ▼                                       │
│  Phase 4: In-Dashboard 2D/3D Floor Plan Visual Editor                       │
│                                     ▼                                       │
│  Phase 5: Extended Entities & Environmental Sensor Visualizations           │
│                                     ▼                                       │
│  Phase 6: Tablet/Mobile Optimization, Performance Tuning & HACS Packaging    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Phase 1: Project Setup & Build Tooling
1. **Initialize TypeScript + Vite Build System**:
   - Single-file bundle output (IIFE or ESM) targeting `dist/house-control-card.js`.
   - Dependencies: `three`, `@types/three`, `lit`, `lucide`, `@lit/task`.
   - Ensure external Three.js assets and shaders are bundled inline or loaded cleanly.
2. **Configure HACS Repository Structure**:
   - Root `hacs.json` defining `name`, `render_readme: true`, `filename: "house-control-card.js"`.
   - GitHub Actions workflow to build release artifacts on tags.

### Phase 2: Three.js Engine Migration
1. **Port `three/world.js`**:
   - Adapt canvas initialization to attach inside the Shadow DOM of `HouseControlCard`.
   - Configure shadow mapping (`PCFSoftShadowMap`), ambient occlusion, and camera frustum.
   - Implement **render-on-demand / dirty flag checking**: Avoid continuous 60fps rendering when the scene is static to preserve tablet battery and CPU. Only render on user interaction, camera tweening, or particle animation.
2. **Port `three/house.js` and `three/furniture.js`**:
   - Procedural extrusion for walls, doors, windows, and floors.
   - Ensure clean material caching (`MeshStandardMaterial` reuse).

### Phase 3: Home Assistant Reactive Bridge & Entity Controllers
1. **Implement `ha-bridge.ts`**:
   - State observer mapping HA entity IDs to Three.js scene object IDs.
   - Click/tap raycasting: Raycast clicks on 3D fixtures (lamps, switches, AC units) to trigger HA service calls.
   - Long-press or modal popover: Open an inline mini-control for fine brightness, color wheel, or AC mode selection.
2. **Live Lighting Dynamics (`three/lights.ts`)**:
   - Convert `color_temp_kelvin` to RGB using standard Planckian locus approximation.
   - Scale Three.js point light `intensity` proportionally to HA `brightness` (0-255).
   - Cast real shadows onto adjacent walls and furniture.
3. **Live Climate Simulation (`three/ac.ts`)**:
   - Spawn velocity particle stream from the AC grill when `climate.*.state !== 'off'`.
   - Particle colors: Blue/cyan for `cool`, warm orange for `heat`, subtle white for `fan`/`dry`.
   - Display floating 3D text badge for current & target room temperature.

### Phase 4: In-Dashboard Floor Plan Visual Editor
1. **Build `house-control-card-editor.ts`**:
   - Provides a split-screen or toggleable 2D grid editor.
   - Users click to draw rooms, drag doors/windows onto wall segments, and place furniture items.
   - Integrated HA Entity Picker: When placing a lamp or AC, users select from a filtered dropdown of `light.*` or `climate.*` entities populated live from `this.hass.states`.
2. **Auto-Populate from HA Area Registry**:
   - Provide a "Generate from Home Assistant Areas" wizard button that inspects `this.hass.areas`, creates initial room boxes, and lists assigned devices for quick placement.

### Phase 5: Extended Entities & Visualizations
Expand beyond the original reference app to support standard Home Assistant device classes:
1. **Covers / Blinds (`cover.*`)**:
   - Render 3D window blinds or roller shades that physically animate open/closed based on `current_position`.
2. **Presence & Motion Sensors (`binary_sensor.*`)**:
   - Highlight room floor surfaces with a subtle neon floor-pulse when motion/occupancy is detected.
3. **Smart Plugs & Switches (`switch.*`)**:
   - Small wall socket indicators with LED glow states.
4. **Media Players (`media_player.*`)**:
   - TV screens that show ambient glow or thumbnail art when playing.
5. **Vacuum Cleaners (`vacuum.*`)**:
   - 3D robotic vacuum model that moves across the floor plan based on room status coordinates.

### Phase 6: Mobile/Tablet Performance & Release
1. **Touch Controls**:
   - Touch drag to rotate scene, two-finger pinch to zoom, two-finger drag to pan.
2. **Performance Scaling Levels**:
   - **High**: Dynamic shadows, high particle count, 4x MSAA.
   - **Low (Default for mobile/Fire tablets)**: Static shadows, reduced light count, disabled particles.
3. **Documentation & HACS Submission**:
   - Complete `README.md` with GIFs, installation instructions, Lovelace YAML configuration examples, and visual editor guide.

---

## 5. File Structure Blueprint

```text
ha-house-control/
├── .github/
│   └── workflows/
│       └── release.yml            # Automated GitHub release with compiled asset
├── src/
│   ├── index.ts                   # Custom element entry point & Lovelace registration
│   ├── house-control-card.ts      # Main LitElement card component
│   ├── house-control-editor.ts    # Visual in-dashboard floor plan editor
│   ├── types.ts                   # TypeScript interfaces (HA types, Plan Schema)
│   ├── bridge/
│   │   ├── ha-bridge.ts           # State mapping & hass.callService adapter
│   │   └── entity-binding.ts      # Entity click handlers & raycasting
│   ├── engine/
│   │   ├── world.ts               # Three.js scene, camera, renderer, shadows
│   │   ├── house-builder.ts       # Procedural wall & floor extrusion
│   │   ├── furniture-builder.ts   # Parametric furniture geometry
│   │   ├── lighting-manager.ts    # Physical light mapping & color temp calculations
│   │   └── ac-simulator.ts        # Particle physics for HVAC airflow
│   ├── editor/
│   │   ├── grid-canvas.ts         # 2D drawing grid & snapping math
│   │   └── entity-selector.ts     # Dropdown for HA entities
│   └── styles/
│       ├── card.css.ts            # Lit CSS styles
│       └── editor.css.ts          # Editor overlay styles
├── tests/                         # Unit & integration tests
├── hacs.json                      # HACS integration metadata
├── package.json
├── tsconfig.json
├── vite.config.ts
├── project.md                     # This specification
└── README.md                      # Public-facing user & install guide
```

---

## 6. Verification & Definition of Done

1. **Card Loads in Lovelace**: Adding `type: custom:house-control-card` to a Lovelace dashboard renders the default 3D room canvas cleanly without console errors.
2. **Bidirectional Lighting Control**:
   - Turning a light ON/OFF in Home Assistant updates the 3D lamp in real-time.
   - Clicking a 3D lamp in the canvas immediately toggles the real Home Assistant entity via `hass.callService`.
3. **Climate Control**:
   - Starting an AC renders visible cooling/heating airflow particles.
   - Adjusting target temperature in the 3D popup updates `climate.set_temperature`.
4. **Visual Editor Functions**:
   - A user can draw a 2-room layout, place a sofa, lamp, and AC, select their HA entity IDs from the dropdown, and click "Save".
   - The card persists configuration to dashboard YAML without manual code editing.
5. **No Memory Leaks**:
   - Switching tabs in Lovelace properly disposes of Three.js geometries, textures, materials, and cancels the `requestAnimationFrame` loop.
