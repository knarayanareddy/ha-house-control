# Blueprint & Implementation Guide: Interactive 2D Drag-to-Sketch Floor Plan Canvas

> **Target Audience**: Autonomous Coding Agent & Contributors  
> **Source Reference**: [`https://github.com/0xProbabillity/house-control`](https://github.com/0xProbabillity/house-control) (`web/src/editor/editor.js`, `web/src/editor/editor.css`)  
> **Target Integration**: `house-control-card-editor.ts` inside [`knarayanareddy/ha-house-control`](https://github.com/knarayanareddy/ha-house-control)

---

## 1. Executive Summary & Objective

In [`0xProbabillity/house-control`](https://github.com/0xProbabillity/house-control), users do not need CAD or 3D modeling skills to model their home. Instead, they interact with an **interactive 2D top-down SVG floor plan canvas**:
1. Users click and drag room rectangles onto a grid (in real-world metres).
2. Users snap rooms together, drag 8 resize handles to adjust dimensions, and drop doors/windows onto wall segments.
3. Users drag & drop lighting fixtures, AC units, and furniture items directly into rooms.
4. As the 2D floor plan is sketched or edited, the procedural Three.js engine **dynamically rebuilds the 3D model in real time**.

Our current Home Assistant build (`ha-house-control-card`) includes the 3D procedural engine, physical lighting, particle airflow, popover sheets, and numeric room coordinate inputs. This specification provides the exact instructions to port and integrate the **full interactive 2D drag-to-sketch canvas** into `house-control-card-editor.ts`.

---

## 2. Source Code Breakdown in `0xProbabillity/house-control`

The reference implementation is in `web/src/editor/` of `0xProbabillity/house-control`:

| Source File | Role & Key Mechanisms |
| :--- | :--- |
| **`web/src/editor/editor.js`** | Core 2D canvas and interaction loop (~1,900 lines).<br>• Uses SVG (`document.createElementNS('http://www.w3.org/2000/svg', ...)`) for ultra-crisp resolution-independent rendering.<br>• Metre-to-screen coordinate transforms (`view` box with pan/zoom).<br>• Room selection, 8-handle drag resizing (`nw, n, ne, e, se, s, sw, w`).<br>• Dragging doors/windows along room perimeter edges with wall snapping.<br>• Dragging light fixtures, climate units, and furniture with rotation handles.<br>• 100-step Undo / Redo history stack. |
| **`web/src/editor/editor.css`** | Styling for the 2D canvas, handles, selection outlines, grid patterns, and inspector overlay sheets. |
| **`web/src/editor/connections.js`** | Maps placed fixtures to backend entity IDs (Home Assistant, Hue, Smart Life). |

---

## 3. Architecture in Home Assistant (`ha-house-control`)

### 3.1 Editor Layout Structure
In Home Assistant, the visual editor renders inside a `<div class="card-editor">` within `hui-card-editor`. Because modal real-estate can vary from desktop monitors to mobile screens, the editor should provide a clean **split or tabbed view**:

```
┌────────────────────────────────────────────────────────────────────────┐
│  House Control Card Editor                                            │
├────────────────────────────────┬───────────────────────────────────────┤
│  Tabs: [ 📐 2D Floor Plan ]   [ 💡 Entity Bindings ]   [ ⚙️ YAML ]    │
├────────────────────────────────┬───────────────────────────────────────┤
│                                │                                       │
│   2D SVG Canvas (Top-Down)     │   Inspector / Tool Palette            │
│   ┌────────────────────────┐   │   ┌───────────────────────────────┐   │
│   │ [Grid: 0.1m snap]      │   │   │ Mode: [Select] [Add Room]     │   │
│   │                        │   │   │       [Add Light] [Add AC]    │   │
│   │   ┌────────┐ ┌──────┐  │   │   │ Selected: Living Room         │   │
│   │   │Living  │ │Dining│  │   │   │ • Name: Living Room           │   │
│   │   │  ●(pt) │ │  ●   │  │   │   │ • Floor: [Oak ▼]              │   │
│   │   └───═────┴─┴──────┘  │   │   │ • Width: 5.5m  Length: 4.2m   │   │
│   │      (door)            │   │   │ • Delete Room                 │   │
│   └────────────────────────┘   │   └───────────────────────────────┘   │
│   Controls: [Zoom + / -] [Pan] │   Real-Time 3D Thumbnail Preview      │
│             [Undo] [Redo]      │   [ Three.js Mini-Viewport (200px) ]  │
└────────────────────────────────┴───────────────────────────────────────┘
```

---

## 4. Technical Implementation Steps for the Agent

### Step 1: Create the SVG 2D Floor Plan Canvas Module
Create `src/editor/floorplan-canvas.ts`:
- **Coordinate Space**:
  - The plan coordinate system is in **metres**: $(X, Z)$ on the ground plane.
  - Scale factor: define `scale` (e.g. $40\text{px} = 1\text{m}$) and offset $(panX, panY)$.
  - Conversion helpers:
    ```typescript
    screenToMetres(screenX: number, screenY: number): [number, number]
    metresToScreen(worldX: number, worldZ: number): [number, number]
    ```
- **Grid Snapping**:
  - Render an SVG `<defs><pattern id="grid">` with $0.5\text{m}$ subdivisions and $1.0\text{m}$ major lines.
  - Snap coordinates during drag: `const snap = (v: number, step = 0.1) => Math.round(v / step) * step;`

### Step 2: SVG Room Rendering & 8-Handle Resizing
Port the room drawing and manipulation from `editor.js`:
- **Room Polygon**:
  Render `<rect class="room-rect">` for each room in `plan.rooms` with floor fill color:
  - `oak`: `#4a3d2e`, `walnut`: `#3c2f28`, `tile`: `#39424b`, `stone`: `#30353c`.
  - Room name text centered inside.
- **Selection & Resize Handles**:
  When a room is selected, render 8 circular handle nodes around its bounding box:
  - `nw`, `n`, `ne`, `e`, `se`, `s`, `sw`, `w`.
  - Dragging a corner or edge handle adjusts `x`, `y`, `width`, or `length` in real-time, enforcing minimum dimension `MIN_ROOM = 0.6m`.

### Step 3: Wall Openings (Doors & Windows)
Port the wall opening placer:
- Detect which room wall the mouse pointer is nearest to (`north`, `south`, `east`, `west`).
- Render doors as swing arcs or gaps (`<path>` / `<line>`), windows as double parallel lines (`#80b5ff`).
- Allow dragging openings along the length of the wall (`offset` along wall edge).

### Step 4: Device & Furniture Drag & Drop
- **Lights**:
  Render icon pins (pendant, spots, ceiling, floor lamp). Dragging moves $(x, y)$ inside the room; clicking selects it and opens the light capability inspector.
- **AC Units**:
  Anchor to nearest wall (`north`, `south`, `east`, `west`) with directional air arrow.
- **Furniture**:
  Render parametric bounding boxes (sofa, TV, bed, dining table, plant). Include a rotation handle at top $(x, y - 0.4)$ to rotate in $15^\circ$ or $45^\circ$ increments.

### Step 5: Integration with `house-control-card-editor.ts`
- Replace or enhance the manual room coordinate inputs in `src/house-control-card-editor.ts` with the `<floorplan-canvas>` element.
- Whenever the user drags a room, resizes a wall, or drops an item, dispatch `this.commit(nextConfig)`.
- Dispatching `config-changed` will automatically:
  1. Update Home Assistant's card configuration.
  2. Cause the main `house-control-card` to re-render the 3D scene in real-time so the user sees both 2D and 3D views update simultaneously.

### Step 6: Touch & Tablet Gestures
Ensure pointer events support wall tablets and mobile:
- Use standard Pointer Events (`pointerdown`, `pointermove`, `pointerup`).
- One finger on an element = drag / resize.
- Two fingers on background = pinch-to-zoom and pan.
- Wheel event on desktop = zoom in/out centered at cursor.

---

## 5. Verification & Acceptance Criteria

When this feature is implemented by the agent, all of the following checks must pass:

1. **`npm run typecheck`**: Zero TypeScript errors (`tsc --noEmit`).
2. **`npm run verify`**: All procedural Three.js tests and bridge checks pass.
3. **Interactive 2D Canvas Checks**:
   - [ ] Dragging an existing room moves its $(X, Z)$ position smoothly.
   - [ ] Dragging any of the 8 resize handles resizes width/length with $0.1\text{m}$ grid snap.
   - [ ] Clicking "Add Room" adds a new room rectangle to the 2D canvas.
   - [ ] Dropping a door or window onto a wall updates `plan.openings`.
   - [ ] Dragging a light fixture or AC unit moves its $(X, Y)$ coordinates inside the room.
   - [ ] Changing anything in the 2D canvas immediately updates the 3D Three.js model.
4. **Clean Production Build**: `npm run build` generates `dist/house-control-card.js` with no asset errors.
