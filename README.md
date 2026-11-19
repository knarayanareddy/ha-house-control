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

## Architecture & Implementation Blueprint

For the comprehensive implementation plan, reference analysis of `0xProbabillity/house-control`, entity integration contracts, and AI agent instructions, see [project.md](project.md).

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
