# Architectural Specification & Implementation Directions: Front-Facing UI Toggle & Native AI Assistant Bar

This document provides explicit, production-grade instructions for adding the **Front-Facing Multi-Mode View Toggle** and the **Floating AI Chatbot / Assist Prompt Bar** directly into the `house-control-card` custom element.

---

## 1. Reference Architecture & Context

### Reference Source
- **Repository**: [`https://github.com/0xProbabillity/house-control`](https://github.com/0xProbabillity/house-control)
- **Twitter / Demonstration Video**: Real-time 2D floor plan drag-to-sketch, synchronized 3D procedural extrusion, and conversational AI prompt bar to control devices and layout changes dynamically.

### Core Objectives
1. **Front-Facing View Switcher**: Move the 2D floorplan sketching and live 3D extrusion directly onto the card's main dashboard view via a segmented pill toggle: `[ 🏠 3D Twin | 📐 2D Sketcher | ◫ Split View ]`.
2. **Synchronized Bidirectional State**: In Split View, dragging a room wall or placing a light/door on the 2D SVG canvas instantly dispatches `plan-changed`, causing the Three.js 3D engine to re-extrude parametric geometry in real time.
3. **Floating AI Prompt Bar**: Integrate a glassmorphic conversational chat input at the bottom of the card wired directly to Home Assistant's native Assist API (`hass.callService('conversation', 'process', ...)`), allowing both natural language device control and automated floorplan generation.

---

## 2. Front-Facing View Switcher Implementation (`house-control-card.ts`)

### A. State Definition
In `src/index.ts` (the `HouseControlCard` Lit class), declare the reactive mode state:
```typescript
@state() private activeMode: '3d' | '2d' | 'split' = '3d';
```

### B. Header Mode Switcher Template
Add the segmented pill control into the top header bar of `render()`:
```html
<nav class="mode-toggle" aria-label="View Mode">
  <button 
    class="mode-pill ${this.activeMode === '3d' ? 'active' : ''}" 
    @click=${() => this.setMode('3d')}>
    🏠 3D Twin
  </button>
  <button 
    class="mode-pill ${this.activeMode === '2d' ? 'active' : ''}" 
    @click=${() => this.setMode('2d')}>
    📐 2D Sketcher
  </button>
  <button 
    class="mode-pill ${this.activeMode === 'split' ? 'active' : ''}" 
    @click=${() => this.setMode('split')}>
    ◫ Split View
  </button>
</nav>
```

### C. Split View Container Layout
Update the card stage DOM structure:
```typescript
protected renderStage(plan: Plan) {
  if (this.activeMode === '3d') {
    return html`<div class="stage" @wheel=${this.onWheel}>
      <canvas id="three-stage" class=${this.hoverEntity ? 'clickable' : ''}></canvas>
    </div>`;
  }

  if (this.activeMode === '2d') {
    return html`<div class="stage stage-2d">
      <floorplan-canvas 
        .plan=${plan} 
        @plan-changed=${this.onFrontPlanChanged}>
      </floorplan-canvas>
    </div>`;
  }

  // Split View: 50% 2D Sketcher, 50% Three.js 3D Twin
  return html`<div class="stage stage-split">
    <div class="split-pane split-pane-2d">
      <floorplan-canvas 
        .plan=${plan} 
        @plan-changed=${this.onFrontPlanChanged}>
      </floorplan-canvas>
    </div>
    <div class="split-pane split-pane-3d" @wheel=${this.onWheel}>
      <canvas id="three-stage" class=${this.hoverEntity ? 'clickable' : ''}></canvas>
    </div>
  </div>`;
}
```

### D. Reactive 2D-to-3D Extrusion Handler
When the user edits walls or places fixtures on the 2D canvas, update the plan and re-render the 3D scene:
```typescript
private onFrontPlanChanged = (e: CustomEvent<Plan>) => {
  const updatedPlan = e.detail;
  this.config = { ...this.config, plan: updatedPlan };
  
  // Dispatch Home Assistant config-changed event to persist dashboard YAML
  const event = new CustomEvent('config-changed', {
    detail: { config: this.config },
    bubbles: true,
    composed: true,
  });
  this.dispatchEvent(event);

  // Trigger procedural 3D model re-extrusion
  this.mountWorld();
};
```

---

## 3. Floating AI Chatbot / Prompt Bar Implementation

### A. Component Markup
Insert the glassmorphic AI floating bar above the bottom scenes navigation:
```html
<div class="ai-assistant-bar ${this.aiActive ? 'expanded' : ''}">
  <div class="ai-input-wrap">
    <span class="ai-sparkle">✨</span>
    <input 
      type="text" 
      class="ai-input" 
      placeholder="Ask AI... (e.g. 'Make bedroom cozy', 'Turn off all ACs', 'Add a 4x3 balcony')"
      .value=${this.aiQuery}
      @input=${(e: Event) => this.aiQuery = (e.target as HTMLInputElement).value}
      @keydown=${this.onAiKeyDown}
      ?disabled=${this.aiThinking}
    />
    <button 
      class="ai-send-btn ${this.aiQuery.trim() ? 'active' : ''}" 
      @click=${this.submitAiQuery}
      ?disabled=${this.aiThinking || !this.aiQuery.trim()}>
      ${this.aiThinking ? '⏳' : '➔'}
    </button>
  </div>
  ${this.aiResponse ? html`
    <div class="ai-response-bubble">
      <span>${this.aiResponse}</span>
      <button class="ai-dismiss" @click=${() => this.aiResponse = ''}>×</button>
    </div>
  ` : ''}
</div>
```

### B. Integration with Home Assistant Assist API
Wired to Home Assistant's `conversation/process` WebSocket/service endpoint:
```typescript
private async submitAiQuery() {
  const query = this.aiQuery.trim();
  if (!query || !this.hass) return;

  this.aiThinking = true;
  this.aiResponse = 'Thinking...';
  this.requestUpdate();

  try {
    // 1. Natural Language Device Execution via Home Assistant Assist
    const result = await this.hass.callService('conversation', 'process', {
      text: query,
    });

    const responseText = result?.response?.data?.targets?.[0] 
      ?? result?.response?.speech?.plain?.speech 
      ?? 'Command executed successfully.';

    this.aiResponse = responseText;
    this.aiQuery = '';

    // 2. Local Procedural Intent Check: Room/Layout Modification
    if (query.toLowerCase().includes('add room') || query.toLowerCase().includes('balcony') || query.toLowerCase().includes('expand')) {
      this.handleAiLayoutModification(query);
    }
  } catch (err) {
    this.aiResponse = `Assist error: ${err instanceof Error ? err.message : String(err)}`;
  } finally {
    this.aiThinking = false;
    this.requestUpdate();
  }
}
```

### C. Procedural AI Layout Modification Engine
Allows natural language commands to synthesize and extrude new rooms procedurally:
```typescript
private handleAiLayoutModification(prompt: string) {
  const currentPlan = structuredClone(this.config?.plan ?? samplePlan);
  
  // Example: Detect new room request
  if (prompt.toLowerCase().includes('balcony')) {
    const maxX = Math.max(...currentPlan.rooms.map(r => r.x + r.width));
    currentPlan.rooms.push({
      id: `room_${Date.now()}`,
      name: 'Balcony',
      x: maxX,
      y: 0,
      width: 3.0,
      length: 2.5,
      floor: 'stone'
    });
    this.onFrontPlanChanged(new CustomEvent('plan-changed', { detail: currentPlan }));
    this.aiResponse = 'Generated new Balcony footprint and updated 3D twin.';
  }
}
```

---

## 4. Glassmorphic CSS Styling
Add the sleek modern dark-mode styles to `src/index.ts`:
```css
/* Mode Switcher Nav */
.mode-toggle {
  position: absolute;
  top: 14px;
  left: 16px;
  display: flex;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 3px;
  gap: 4px;
  z-index: 10;
}
.mode-pill {
  border: none;
  background: transparent;
  color: #94a3b8;
  font-family: inherit;
  font-size: 11px;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.mode-pill:hover { color: #f8fafc; }
.mode-pill.active {
  background: #38bdf8;
  color: #041226;
  box-shadow: 0 2px 8px rgba(56, 189, 248, 0.35);
}

/* Split View Stage */
.stage-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  height: 100%;
}
.split-pane {
  position: relative;
  height: 100%;
  overflow: hidden;
}
.split-pane-2d {
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  background: #060913;
}

/* AI Assistant Prompt Bar */
.ai-assistant-bar {
  position: absolute;
  bottom: 64px;
  left: 50%;
  transform: translateX(-50%);
  width: min(540px, 90%);
  z-index: 20;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.ai-input-wrap {
  display: flex;
  align-items: center;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 24px;
  padding: 6px 14px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.45);
}
.ai-sparkle { font-size: 14px; margin-right: 8px; }
.ai-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #f8fafc;
  font-size: 13px;
  font-family: inherit;
}
.ai-send-btn {
  background: transparent;
  border: none;
  color: #64748b;
  font-size: 14px;
  cursor: pointer;
  transition: color 0.15s;
}
.ai-send-btn.active { color: #38bdf8; }
.ai-response-bubble {
  background: rgba(30, 41, 59, 0.9);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(56, 189, 248, 0.3);
  border-radius: 14px;
  padding: 10px 14px;
  font-size: 12px;
  color: #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

---

## 5. Verification Checklist for Agent
1. **TypeScript Build**: Run `npm run typecheck` and `npm run build` in `/Users/brightech/.gemini/antigravity/scratch/ha-house-control`.
2. **Bundle Deployment**: Copy `dist/house-control-card.js` to `/Users/brightech/.gemini/antigravity/scratch/core/config/www/house-control-card-v5.js`.
3. **Mode Switching Verification**: In Lovelace, click `3D Twin`, `2D Sketcher`, and `Split View` — confirm WebGL context initializes cleanly without context loss.
4. **Assist Test**: Dispatch test query via prompt bar and verify entity state updates in Home Assistant.
