# Remediation Plan: Building the Complete Interactive 3D Multi-Room Card

> **Priority Directive for Agent Remediation**  
> **Status:** FAILED INITIAL AUDIT — Incomplete MVP Delivered  
> **Repository:** [`knarayanareddy/ha-house-control`](https://github.com/knarayanareddy/ha-house-control)  
> **Objective:** Upgrade the single-room proof-of-concept into the full multi-room, fully interactive smart home experience modeled after [`0xProbabillity/house-control`](https://github.com/0xProbabillity/house-control).

---

## 1. Audit Findings: What Failed & What Was Skipped

In the initial build, only **Milestone 1 (a bare 3D graphics test)** was delivered. Several core features from the reference project were missing:

| Expected Feature in Reference | What the Agent Actually Delivered | Status |
| :--- | :--- | :--- |
| **Entire Multi-Room House** (Living, Dining, Kitchen, Bedroom, Bathroom) | Single 1-room test box (`sample-plan.json` with just `living_room`) | ❌ **FAILED** |
| **Interactive Control Sheets / Popovers** (Brightness slider, color wheel, AC dial) | None. Only a silent, invisible background raycast click | ❌ **FAILED** |
| **Hover Tooltip & Visual Feedback** (Device name, status badge, selection highlight) | None. No visual feedback on hover or selection | ❌ **FAILED** |
| **Scene Control Bar** (One-tap scenes: "Bright", "Cozy", "Movie", "Night", "Away") | None | ❌ **FAILED** |
| **Interactive Device Controls** | Silent failure when entity ID did not match a real physical hardware device | ❌ **FAILED** |

---

## 2. Remediation Requirements & Specifications

### Requirement 1: Full Multi-Room Floor Plan Default
Replace the 1-room stub in `src/sample-plan.json` with the complete apartment plan from `0xProbabillity/house-control` (`web/public/plans/home.json`):

1. **Rooms**:
   - **Living Room** (Oak floor, sofa, coffee table, rug, TV unit, armchair, bookshelf, plant)
   - **Dining Room** (Oak floor, dining table, chairs, pendant light)
   - **Kitchen** (Stone floor, kitchen counters, sink, fridge, spotlights, counter strip)
   - **Bedroom** (Walnut floor, double bed, nightstands, wardrobe, ceiling lamp, bedside lamps)
   - **Bathroom** (Tile floor, vanity, mirror light, shower, toilet)
2. **Openings**:
   - Interior doors connecting bedrooms, bathroom, and living areas.
   - Exterior windows on perimeter walls with real sills and transparent glass materials.
3. **Devices**:
   - Multiple ceiling lights, floor lamps, pendants, spots, and LED strips.
   - At least 2 AC units (Living AC on west wall, Bedroom AC on north wall).

---

### Requirement 2: Interactive Control Popover / Modal Overlay
When a user clicks or taps any fixture in the 3D scene (or taps its tile), a sleek, glassmorphic control sheet **must** appear overlaid on the card (refer to `0xProbabillity/house-control/web/src/ui/panel.js`):

#### A. Light Control Popover
- **Header**: Device name, room name, power switch toggle.
- **Brightness Slider**:
  - Drag-to-dim horizontal or vertical slider (0% to 100%).
  - Live feedback: dragging the slider immediately updates the 3D lamp lumens and dispatches `hass.callService('light', 'turn_on', { brightness_pct })`.
- **Color Temperature & Color Swatches**:
  - Color temperature slider (Warm Kelvin 2200K to Cool Daylight 6500K).
  - Quick-pick color palette swatches for RGB-capable lights.
- **Close Button**: Tap outside or click '✕' to dismiss.

#### B. Climate / AC Control Popover
- **Header**: Unit name, room name, power toggle.
- **Temperature Display & Stepper**:
  - Displays current room temperature and target temperature.
  - Large `+` and `−` stepper buttons to adjust target temperature.
  - Dispatches `hass.callService('climate', 'set_temperature', { temperature })`.
- **HVAC Mode Selector**:
  - Mode buttons: `Cool` (Cyan), `Heat` (Orange), `Fan` (White), `Dry`, `Auto`, `Off`.
  - Toggling mode dynamically recolors the 3D animated particle airflow!
- **Fan Speed Selector**:
  - `Auto`, `Low`, `Medium`, `High`, `Turbo`.

#### C. Scene Selector Bar (Top or Bottom of Card)
- Render quick scene pills across the top/bottom:
  - ☀️ **Bright** (All lights 100%, AC 22°C)
  - 🛋️ **Cozy** (Warm amber lamps, dim 40%)
  - 🎬 **Movie** (TV backlight only, main lights off)
  - 🌙 **Night** (Bedside lamps 10%, hallway nightlight)
  - 🚪 **Away** (All lights off, AC eco mode)
- Clicking a scene updates all 3D fixtures and calls `scene.turn_on` or batch HA service calls.

---

### Requirement 3: Hover Tooltip & 3D Selection Feedback
1. **Floating Status Tooltip**:
   - When hovering over any lamp, AC, or room, display an anchored badge (e.g. `Living Room · Ceiling Light · 80%` or `Bedroom · AC · Cooling 21°C`).
   - Cursor changes to `pointer` when hovering over interactable objects.
2. **3D Selection Highlight**:
   - When a fixture is hovered or selected, render an emissive highlight ring around the base or a glowing silhouette so the user clearly sees what they clicked.

---

### Requirement 4: Guaranteed Simulation Mode & Entity Binding
- The card **must work out of the box** in simulation mode even when Home Assistant does not have matching physical devices connected yet.
- Clicking any lamp or slider **must immediately illuminate the 3D room and update the UI controls optimistically**.
- If a real entity ID is bound in `config.entities` or matches an existing entity in `hass.states`, dispatch the corresponding Home Assistant service call (`light.turn_on`, `climate.set_temperature`).

---

### Requirement 5: Cache-Busting & Clean Distribution
- Home Assistant aggressively caches dashboard resources.
- Update `vite.card.config.ts` and `src/index.ts` to expose `window.HOUSE_CONTROL_VERSION = "0.2.0"`.
- Provide a clear resource registration note in `README.md`:
  `/local/house-control-card.js?v=0.2.0` to force browsers to invalidate old module caches.

---

## 3. Step-by-Step Implementation Tasks for the Agent

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       REMEDIATION TASK SEQUENCE                             │
│                                                                             │
│  Step 1: Replace sample-plan.json with full 5-room multi-room house schema │
│                                    ▼                                        │
│  Step 2: Build the Lit HTML/CSS interactive overlay in house-control-card  │
│          (Light Detail Sheet, AC Detail Sheet, Scene Bar, Hover Tooltip)    │
│                                    ▼                                        │
│  Step 3: Wire raycasting to open the corresponding Detail Sheet on click    │
│                                    ▼                                        │
│  Step 4: Connect slider/temperature controls to both Three.js and HA bridge │
│                                    ▼                                        │
│  Step 5: Run headless rendering & verification test suite                   │
│                                    ▼                                        │
│  Step 6: Build dist/house-control-card.js and deploy to HA www directory    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Detailed Task Instructions:

#### Task 1: Update `src/sample-plan.json`
Import the full layout from `house-control`:
- Rooms: `living`, `dining`, `kitchen`, `bedroom`, `bath`.
- Walls and openings: Full interior wall divisions, doorways with openings, and exterior windows.
- Furniture: Couches, dining tables, kitchen counters, appliances, double bed, wardrobes, TV consoles, and bathroom fixtures.
- Lights: 8+ fixtures across all rooms (ceiling, floor lamp, strips, spots, pendants).
- ACs: Living AC and Bedroom AC.

#### Task 2: Build the UI Sheet & Tooltip Overlay (`src/ui/`)
Implement in Lit inside `HouseControlCard`:
- State property `@state() private activeSheet?: { type: 'light' | 'climate'; id: string; entityId: string };`
- State property `@state() private hoveredFixture?: { name: string; stateText: string; x: number; y: number };`
- Render the overlay inside the card shadow DOM over the `<canvas>`.
- Style with clean modern dark-mode glassmorphism (`backdrop-filter: blur(12px)`, rounded corners, smooth CSS slide-up transition).

#### Task 3: Interactive Sliders & Controls
- **Slider Component**: Touch/mouse draggable slider emitting percentage changes without jitter.
- **Color Kelvin Presets**: 2200K (Candle), 2700K (Warm), 4000K (Neutral), 6500K (Daylight).
- **Temperature Dial**: Large digital readout with `+` / `−` buttons.

---

## 4. Acceptance Criteria & Verification Checklist

Before reporting completion, the agent **MUST** run and pass every item in this checklist:

### Automated Checks
- [ ] `npm run typecheck`: Passes with 0 TypeScript errors.
- [ ] `npm run verify`:
  - Validates that the scene has at least **5 distinct rooms** (not 1).
  - Validates that the scene has at least **8 light fixtures** and **2 AC units**.
  - Headless render produces a multi-room image at `dist/verify/multi-room.png`.
- [ ] `npm run build:card`: Generates clean single-file bundle in `dist/house-control-card.js`.

### User Interface & Interaction Checks
- [ ] **Multi-Room Geometry**: Loading the card displays the entire house (Living, Dining, Kitchen, Bedroom, Bathroom) with dividing walls and open doors.
- [ ] **Hover Tooltip**: Moving the cursor over the ceiling lamp or AC shows an on-screen tooltip with its name and status.
- [ ] **Clicking a Light**: Opens the Light Detail Sheet popover with On/Off toggle, brightness drag slider, and color temperature controls.
- [ ] **Adjusting Brightness**: Moving the slider immediately adjusts the 3D room illumination and shadows in real-time.
- [ ] **Clicking an AC**: Opens the AC Detail Sheet with target temperature, mode buttons (Cool, Heat, Fan), and starts/stops the animated airflow particles.
- [ ] **Scene Bar**: Clicking "Movie" dims the room and keeps the TV backlight on; clicking "Bright" illuminates all rooms.

---

## 5. Artifact Delivery

1. Commit all code to `main` and push to GitHub repository [`knarayanareddy/ha-house-control`](https://github.com/knarayanareddy/ha-house-control).
2. Copy compiled `dist/house-control-card.js` to `/Users/brightech/.gemini/antigravity/scratch/core/config/www/house-control-card.js`.
3. Provide the exact instructions for the user to hard-refresh their Lovelace dashboard.
