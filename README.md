# HA House Control 3D (`ha-house-control`)

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/default)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An interactive, procedural 3D smart home floor plan card for [Home Assistant](https://www.home-assistant.io/) dashboards, adapted from and inspired by [0xProbabillity/house-control](https://github.com/0xProbabillity/house-control).

---

## Highlights

- 🏢 **Procedural 3D in the Browser**: No Blender or CAD required. Generates 3D walls, floors, doors, windows, and parametric furniture dynamically using Three.js from a simple JSON schema.
- 🎨 **In-Dashboard 2D/3D Editor**: Draw rooms, adjust dimensions, place furniture, and bind entities right inside the Lovelace card editor.
- 💡 **Physically Modeled Illumination**: Home Assistant lights cast real-time lighting with matching brightness, color temperature (Kelvin), and RGB color onto 3D surfaces.
- ❄️ **Live HVAC Airflow Simulation**: Air conditioners emit animated particle streams color-graded by mode (cool cyan vs warm heat).
- 📱 **Mobile & Wall Tablet Friendly**: Optimized touch gestures (orbit, pinch-to-zoom, pan), render-on-demand loops, and low-power hardware modes.

---

## Architecture & Implementation Blueprints

- **Core Architecture & HA Integration**: See [project.md](project.md) for reference analysis, Three.js pipeline, and service call contracts.
- **Interactive 2D Drag-to-Sketch Floor Plan Canvas**: See [docs/2D_FLOORPLAN_EDITOR_SPEC.md](docs/2D_FLOORPLAN_EDITOR_SPEC.md) for the complete specification on porting the SVG visual floor plan sketcher from `0xProbabillity/house-control/web/src/editor/` into Home Assistant.

---

## Installation

### Via HACS (Recommended)
1. In Home Assistant, open **HACS** > **Frontend**.
2. Click the three dots in the top right corner and select **Custom repositories**.
3. Add `https://github.com/knarayanareddy/ha-house-control` with category **Lovelace**.
4. Click **Download**.
5. Refresh your browser.

### Manual Installation
1. Download `house-control-card.js` from the [Releases](https://github.com/knarayanareddy/ha-house-control/releases) page.
2. Place it into your Home Assistant directory under `config/www/house-control-card.js`.
3. Add the resource in **Settings** > **Dashboards** > **Resources**:
   - URL: `/local/house-control-card.js?v=0.2.0` (version query forces Home Assistant/browser cache refresh)
   - Type: `JavaScript Module`

---

## Usage in Lovelace

Add a manual card to any dashboard:

```yaml
type: custom:house-control-card
title: My Home
plan:
  rooms:
    - id: living_room
      name: Living Room
      width: 6.0
      length: 4.5
      height: 2.8
  lights:
    - id: light.living_room_ceiling
      roomId: living_room
      x: 3.0
      y: 2.25
      z: 2.7
  acs:
    - id: climate.living_room_ac
      roomId: living_room
      wall: north
      x: 3.0
      y: 2.2
```

---

## Configuring Your Home Layout

The card generates 3D architecture, walls, openings, furniture, and fixtures dynamically using a procedural 3D engine. Users can configure their layout in two ways:

### A. Interactive Card GUI Editor (No code needed)

In Home Assistant, click **Edit Dashboard** → **Edit** on the card:

1. **Room Footprint Editor**: Add rooms, customize dimensions in meters ($X$, $Z$, $\text{Width}$, $\text{Length}$), and select floor finishes (`oak`, `walnut`, `tile`, `stone`).
2. **Entity Bindings Dropdown**: Home Assistant entities (`light.*`, `climate.*`) detected in your system appear in dropdown menus. Simply map each 3D fixture to your physical light or thermostat.
3. **Add Devices**: Add new light fixtures (ceiling, spots, pendant, table lamps, LED strips) and AC units directly from the UI.

### B. Lovelace YAML Configuration

Power users can define or import custom layouts directly in the dashboard YAML:

```yaml
type: custom:house-control-card
title: "Second Floor Flat"
plan:
  wallHeight: 2.6
  interiorWallHeight: 1.25
  rooms:
    - id: living
      name: "Living Room"
      x: 0
      y: 0
      width: 5.5
      length: 4.2
      floor: oak
    - id: bedroom
      name: "Master Bedroom"
      x: 5.5
      y: 0
      width: 4.0
      length: 4.2
      floor: walnut
  openings:
    - type: door
      from: [5.5, 1.2]
      to: [5.5, 2.1]
      head: 2.1
    - type: window
      from: [0, 1.0]
      to: [0, 2.8]
      sill: 0.9
  lights:
    - id: living_chandelier
      name: "Chandelier"
      roomId: living
      x: 2.75
      y: 2.1
      z: 2.4
      fixture: pendant
      capabilities: [brightness, temp]
  acs:
    - id: living_ac
      name: "Living AC"
      roomId: living
      wall: north
      x: 2.5
      y: 2.2
entities:
  lights:
    living_chandelier: light.living_room_ceiling
  climates:
    living_ac: climate.living_room_hvac
```

---

## How the Procedural 3D Engine Adapts

When a custom layout is provided:

- **Automatic Camera Framing**: The engine calculates the total 3D bounding box of all configured rooms and automatically positions the isometric camera and directional shadow frustum to fit the home.
- **Dynamic Cut-Away Walls**: Exterior walls facing the user's camera automatically drop to an interior partition height ($1.25\text{m}$) so you can see inside all rooms regardless of camera rotation.
- **Parametric Openings**: Doors and windows dynamically slice into room walls at exact coordinates with sills and lintels.
- **Lighting & Physics Placement**: Point lights, spotlights, and AC airflow particle systems are anchored to their relative room coordinates ($x, y, z$).

---

## Visual editor and tablet controls

Open the card's **Show visual editor** panel to configure room footprints and positions in metres, add furniture/light/climate fixtures, and bind fixtures to entities discovered from Home Assistant. The advanced plan editor accepts the full JSON `plan` schema. Changes are emitted as Lovelace `config-changed` events and saved through the dashboard editor.

On touch devices, drag with one finger to orbit the model; use two fingers to zoom and pan. Tapping a bound light fixture toggles that Home Assistant light. Climate airflow follows the climate entity's active mode and stops when it is off.

### Entity binding example

Fixture IDs in `plan` are independent of Home Assistant entity IDs. Bind them explicitly when editing YAML, or choose entities in the visual editor:

```yaml
entities:
  lights:
    ceiling_fixture: light.living_room
  climates:
    living_room_ac: climate.living_room
```

For development, run `npm ci`, `npm run typecheck`, `npm run build`, and `npm run verify`. Version tags (`v*`) trigger the release workflow, which typechecks, builds, verifies, and attaches `dist/house-control-card.js` to the GitHub release for HACS.

---

## Acknowledgements

- Based on the 3D procedural engine and visual design of [0xProbabillity/house-control](https://github.com/0xProbabillity/house-control).
- Built with [Three.js](https://threejs.org/) and [Lit](https://lit.dev/).

---

## License

[MIT](LICENSE)
