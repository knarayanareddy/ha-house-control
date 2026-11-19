import { writeFileSync, mkdirSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { resolve } from 'node:path';

const OUT_DIR = resolve('/tmp/ha_demo_video');
mkdirSync(OUT_DIR, { recursive: true });

// HTML template generator for SaaS aesthetic slides
function wrapSlide(content: string, customCss = ''): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1920px;
    height: 1080px;
    overflow: hidden;
    background: #070a12;
    color: #f1f5f9;
    font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .bg-glow {
    position: absolute;
    width: 1200px;
    height: 800px;
    background: radial-gradient(circle, rgba(37,99,235,0.18) 0%, rgba(14,165,233,0.08) 40%, rgba(7,10,18,0) 70%);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: 0;
  }
  .bg-grid {
    position: absolute;
    inset: 0;
    background-size: 40px 40px;
    background-image: 
      linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px);
    z-index: 1;
    pointer-events: none;
  }
  .slide-container {
    position: relative;
    z-index: 2;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 60px 80px;
  }
  .header-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 30px;
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 14px;
    font-size: 20px;
    font-weight: 700;
    letter-spacing: -0.02em;
  }
  .brand-logo {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: linear-gradient(135deg, #3b82f6, #06b6d4);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-weight: 800;
    box-shadow: 0 4px 14px rgba(37,99,235,0.4);
  }
  .pill-badge {
    padding: 6px 14px;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    background: rgba(59,130,246,0.15);
    border: 1px solid rgba(96,165,250,0.3);
    color: #93c5fd;
  }
  .footer-caption {
    position: absolute;
    bottom: 35px;
    left: 80px;
    right: 80px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 18px;
    border-top: 1px solid rgba(255,255,255,0.08);
    font-size: 15px;
    color: #94a3b8;
  }
  .feature-pill {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.12);
    padding: 6px 14px;
    border-radius: 8px;
    font-size: 13px;
    color: #cbd5e1;
    font-weight: 500;
  }
  ${customCss}
</style>
</head>
<body>
  <div class="bg-glow"></div>
  <div class="bg-grid"></div>
  <div class="slide-container">
    ${content}
  </div>
</body>
</html>`;
}

// 1. Title / Intro Slide
const slide1 = wrapSlide(`
  <div class="header-bar">
    <div class="brand">
      <div class="brand-logo">3D</div>
      <span>HA House Control</span>
    </div>
    <div class="pill-badge">Home Assistant Lovelace Card</div>
  </div>

  <div style="flex:1; display:flex; flex-direction:column; justify-content:center; align-items:flex-start; max-width:1200px; margin-top:-20px;">
    <div style="display:inline-flex; align-items:center; gap:8px; padding:6px 14px; border-radius:999px; background:rgba(34,197,94,0.12); border:1px solid rgba(74,222,128,0.25); color:#4ade80; font-size:14px; font-weight:600; margin-bottom:24px;">
      <span style="width:8px; height:8px; border-radius:50%; background:#4ade80; box-shadow:0 0 8px #4ade80;"></span>
      Procedural Digital Twin · 100% Local-First
    </div>
    <h1 style="font-size:74px; font-weight:800; line-height:1.05; letter-spacing:-0.03em; margin-bottom:24px; background:linear-gradient(135deg, #ffffff 30%, #94a3b8 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">
      Draw your floor plan.<br>
      It builds itself in 3D.<br>
      Control your real home.
    </h1>
    <p style="font-size:24px; color:#94a3b8; line-height:1.45; max-width:860px; margin-bottom:40px;">
      Zero Blender. Zero CAD. Real-time physical lumens, animated AC airflow, and two-way Home Assistant synchronization.
    </p>

    <div style="display:flex; gap:16px; flex-wrap:wrap;">
      <div class="feature-pill">💡 Physical Lumens & Color Temp</div>
      <div class="feature-pill">❄️ Mode-Colored Particle Airflow</div>
      <div class="feature-pill">📐 2D Drag-to-Sketch Canvas</div>
      <div class="feature-pill">📱 Mobile & Wall Tablet Ready</div>
    </div>
  </div>

  <div class="footer-caption">
    <span>Open Source · Lovelace Custom Card</span>
    <span>github.com/knarayanareddy/ha-house-control</span>
  </div>
`);

// 2. 2D Floor Plan Canvas Slide
const slide2 = wrapSlide(`
  <div class="header-bar">
    <div class="brand">
      <div class="brand-logo">2D</div>
      <span>Interactive Floor Plan Sketcher</span>
    </div>
    <div class="pill-badge" style="background:rgba(168,85,247,0.15); border-color:rgba(192,132,252,0.3); color:#c084fc;">Step 01 · 2D Canvas</div>
  </div>

  <div style="flex:1; display:grid; grid-template-columns: 1fr 340px; gap:30px; align-items:center;">
    <!-- 2D Canvas Frame -->
    <div style="background:#0f172a; border:1px solid rgba(255,255,255,0.12); border-radius:18px; padding:24px; box-shadow:0 24px 60px rgba(0,0,0,0.5); display:flex; flex-direction:column; height:680px; position:relative;">
      <!-- Toolbar -->
      <div style="display:flex; gap:8px; padding-bottom:18px; border-bottom:1px solid rgba(255,255,255,0.08); align-items:center;">
        <span style="font-size:13px; font-weight:600; color:#64748b; text-transform:uppercase; margin-right:8px;">Tools:</span>
        <div style="background:#2563eb; color:#fff; padding:6px 14px; border-radius:8px; font-size:13px; font-weight:600;">Select</div>
        <div style="background:#1e293b; color:#cbd5e1; border:1px solid rgba(255,255,255,0.1); padding:6px 14px; border-radius:8px; font-size:13px; font-weight:600;">＋ Room</div>
        <div style="background:#1e293b; color:#cbd5e1; border:1px solid rgba(255,255,255,0.1); padding:6px 14px; border-radius:8px; font-size:13px; font-weight:600;">Door</div>
        <div style="background:#1e293b; color:#cbd5e1; border:1px solid rgba(255,255,255,0.1); padding:6px 14px; border-radius:8px; font-size:13px; font-weight:600;">Window</div>
        <div style="background:#1e293b; color:#cbd5e1; border:1px solid rgba(255,255,255,0.1); padding:6px 14px; border-radius:8px; font-size:13px; font-weight:600;">＋ Light</div>
        <div style="background:#1e293b; color:#cbd5e1; border:1px solid rgba(255,255,255,0.1); padding:6px 14px; border-radius:8px; font-size:13px; font-weight:600;">＋ AC</div>
        <div style="margin-left:auto; font-family:'JetBrains Mono', monospace; font-size:12px; color:#60a5fa; background:rgba(37,99,235,0.15); padding:4px 10px; border-radius:6px;">Snap: 0.1 m</div>
      </div>

      <!-- SVG Drawing Surface Mockup -->
      <div style="flex:1; position:relative; margin-top:16px; background:#0b1120; border-radius:12px; border:1px dashed rgba(255,255,255,0.15); overflow:hidden; display:flex; align-items:center; justify-content:center;">
        <svg width="100%" height="100%" viewBox="0 0 760 520" style="position:absolute; inset:0;">
          <defs>
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" stroke-width="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />

          <!-- Living Room (Selected with 8 Handles) -->
          <g>
            <rect x="60" y="80" width="340" height="240" fill="#4a3d2e" stroke="#3b82f6" stroke-width="3" rx="4"/>
            <text x="230" y="190" fill="#ffffff" font-size="18" font-weight="700" text-anchor="middle" font-family="Plus Jakarta Sans">Living Room · 6.4 × 4.6 m</text>
            <!-- Fixtures -->
            <circle cx="210" cy="230" r="14" fill="#fbbf24" stroke="#000" stroke-width="3"/>
            <text x="210" y="260" fill="#fde68a" font-size="12" font-weight="600" text-anchor="middle">Ceiling</text>
            <!-- Door -->
            <line x1="280" y1="80" x2="340" y2="80" stroke="#f59e0b" stroke-width="8" stroke-linecap="round"/>
            <text x="310" y="65" fill="#f59e0b" font-size="11" font-weight="700" text-anchor="middle">DOOR 0.9m</text>
            <!-- 8 Handles -->
            <circle cx="60" cy="80" r="7" fill="#fff" stroke="#2563eb" stroke-width="3"/>
            <circle cx="230" cy="80" r="7" fill="#fff" stroke="#2563eb" stroke-width="3"/>
            <circle cx="400" cy="80" r="7" fill="#fff" stroke="#2563eb" stroke-width="3"/>
            <circle cx="400" cy="200" r="7" fill="#fff" stroke="#2563eb" stroke-width="3"/>
            <circle cx="400" cy="320" r="7" fill="#fff" stroke="#2563eb" stroke-width="3"/>
            <circle cx="230" cy="320" r="7" fill="#fff" stroke="#2563eb" stroke-width="3"/>
            <circle cx="60" cy="320" r="7" fill="#fff" stroke="#2563eb" stroke-width="3"/>
            <circle cx="60" cy="200" r="7" fill="#fff" stroke="#2563eb" stroke-width="3"/>
          </g>

          <!-- Dining Room -->
          <g>
            <rect x="420" y="80" width="260" height="240" fill="#4a3d2e" stroke="#64748b" stroke-width="2" rx="4"/>
            <text x="550" y="190" fill="#ffffff" font-size="16" font-weight="700" text-anchor="middle" font-family="Plus Jakarta Sans">Dining Room · 4.0 × 4.6 m</text>
            <circle cx="550" cy="210" r="14" fill="#fbbf24" stroke="#000" stroke-width="3"/>
            <text x="550" y="240" fill="#fde68a" font-size="12" font-weight="600" text-anchor="middle">Pendant</text>
          </g>

          <!-- Bedroom -->
          <g>
            <rect x="60" y="340" width="240" height="150" fill="#3c2f28" stroke="#64748b" stroke-width="2" rx="4"/>
            <text x="180" y="415" fill="#ffffff" font-size="15" font-weight="700" text-anchor="middle" font-family="Plus Jakarta Sans">Bedroom · 4.2 × 3.6 m</text>
            <rect x="250" y="342" width="30" height="12" fill="#38bdf8" stroke="#000" stroke-width="2" rx="2"/>
            <text x="265" y="370" fill="#38bdf8" font-size="10" font-weight="700" text-anchor="middle">AC</text>
          </g>

          <!-- Bathroom -->
          <g>
            <rect x="320" y="340" width="160" height="150" fill="#39424b" stroke="#64748b" stroke-width="2" rx="4"/>
            <text x="400" y="415" fill="#ffffff" font-size="14" font-weight="700" text-anchor="middle" font-family="Plus Jakarta Sans">Bath · 2.2 × 3.6 m</text>
          </g>

          <!-- Kitchen -->
          <g>
            <rect x="500" y="340" width="180" height="150" fill="#30353c" stroke="#64748b" stroke-width="2" rx="4"/>
            <text x="590" y="415" fill="#ffffff" font-size="14" font-weight="700" text-anchor="middle" font-family="Plus Jakarta Sans">Kitchen · 4.0 × 3.6 m</text>
          </g>
        </svg>
      </div>
    </div>

    <!-- Inspector Sidebar -->
    <div style="background:#0f172a; border:1px solid rgba(255,255,255,0.12); border-radius:18px; padding:24px; box-shadow:0 24px 60px rgba(0,0,0,0.5); display:flex; flex-direction:column; gap:16px; height:680px;">
      <div style="font-size:18px; font-weight:700; color:#fff; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:12px;">Inspector</div>
      
      <div>
        <label style="font-size:12px; font-weight:600; color:#94a3b8; text-transform:uppercase;">Room Name</label>
        <div style="margin-top:6px; background:#1e293b; border:1px solid rgba(255,255,255,0.15); border-radius:8px; padding:10px 14px; font-size:14px; color:#fff; font-weight:600;">Living Room</div>
      </div>

      <div>
        <label style="font-size:12px; font-weight:600; color:#94a3b8; text-transform:uppercase;">Floor Finish</label>
        <div style="margin-top:6px; background:#1e293b; border:1px solid rgba(255,255,255,0.15); border-radius:8px; padding:10px 14px; font-size:14px; color:#fff; display:flex; align-items:center; justify-content:space-between;">
          <span>Oak Hardwood</span>
          <span style="font-size:12px; color:#64748b;">▼</span>
        </div>
      </div>

      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
        <div>
          <label style="font-size:12px; font-weight:600; color:#94a3b8; text-transform:uppercase;">Width</label>
          <div style="margin-top:6px; background:#1e293b; border:1px solid rgba(255,255,255,0.15); border-radius:8px; padding:10px; font-family:'JetBrains Mono'; font-size:14px; color:#38bdf8; font-weight:600;">6.4 m</div>
        </div>
        <div>
          <label style="font-size:12px; font-weight:600; color:#94a3b8; text-transform:uppercase;">Length</label>
          <div style="margin-top:6px; background:#1e293b; border:1px solid rgba(255,255,255,0.15); border-radius:8px; padding:10px; font-family:'JetBrains Mono'; font-size:14px; color:#38bdf8; font-weight:600;">4.6 m</div>
        </div>
      </div>

      <div style="margin-top:auto; background:rgba(37,99,235,0.1); border:1px solid rgba(59,130,246,0.3); border-radius:12px; padding:16px;">
        <div style="font-size:13px; font-weight:700; color:#93c5fd; margin-bottom:4px;">✨ Auto 3D Synchronization</div>
        <div style="font-size:12px; color:#cbd5e1; line-height:1.4;">Dragging wall handles recalculates polygons and rebuilds the 3D world instantly.</div>
      </div>
    </div>
  </div>

  <div class="footer-caption">
    <span>📐 Native SVG Vector Plan · Zero Latency Resizing</span>
    <span>8-Handle Perimeter Snapping</span>
  </div>
`);

// 3. Procedural 3D Model Slide
const slide3 = wrapSlide(`
  <div class="header-bar">
    <div class="brand">
      <div class="brand-logo">3D</div>
      <span>Procedural World Generator</span>
    </div>
    <div class="pill-badge" style="background:rgba(59,130,246,0.15); border-color:rgba(96,165,250,0.3); color:#93c5fd;">Step 02 · 3D Isometric View</div>
  </div>

  <div style="flex:1; display:flex; flex-direction:column; justify-content:center; align-items:center; position:relative;">
    <!-- 3D Card Mockup -->
    <div style="width:100%; max-width:1400px; height:680px; background:#0a0e1a; border:1px solid rgba(255,255,255,0.15); border-radius:24px; box-shadow:0 30px 80px rgba(0,0,0,0.7); position:relative; overflow:hidden; display:flex; flex-direction:column;">
      
      <!-- Scene bar at top -->
      <div style="position:absolute; top:20px; left:50%; transform:translateX(-50%); z-index:10; background:rgba(16,23,39,0.75); backdrop-filter:blur(16px); border:1px solid rgba(255,255,255,0.15); border-radius:999px; padding:6px; display:flex; gap:8px;">
        <div style="background:#2563eb; color:#fff; font-weight:600; padding:8px 18px; border-radius:999px; font-size:14px; box-shadow:0 0 16px rgba(37,99,235,0.5);">☀️ Bright</div>
        <div style="background:rgba(255,255,255,0.08); color:#cbd5e1; padding:8px 18px; border-radius:999px; font-size:14px;">🛋️ Cozy</div>
        <div style="background:rgba(255,255,255,0.08); color:#cbd5e1; padding:8px 18px; border-radius:999px; font-size:14px;">🎬 Movie</div>
        <div style="background:rgba(255,255,255,0.08); color:#cbd5e1; padding:8px 18px; border-radius:999px; font-size:14px;">🌙 Night</div>
        <div style="background:rgba(255,255,255,0.08); color:#cbd5e1; padding:8px 18px; border-radius:999px; font-size:14px;">🚪 Away</div>
      </div>

      <!-- Center 3D Isometric View graphic -->
      <div style="flex:1; display:flex; align-items:center; justify-content:center; position:relative;">
        <img src="/Users/brightech/.gemini/antigravity/scratch/ha-house-control/dist/verify/multi-room.png" style="width:100%; height:100%; object-fit:contain; filter:drop-shadow(0 20px 40px rgba(0,0,0,0.6));" alt="3D Floor Plan">
      </div>

      <!-- Feature Overlay Badge -->
      <div style="position:absolute; bottom:24px; left:24px; background:rgba(15,23,42,0.85); backdrop-filter:blur(12px); border:1px solid rgba(255,255,255,0.15); border-radius:14px; padding:14px 20px; display:flex; align-items:center; gap:16px;">
        <div style="width:12px; height:12px; border-radius:50%; background:#22c55e; box-shadow:0 0 10px #22c55e;"></div>
        <div>
          <div style="font-size:14px; font-weight:700; color:#fff;">Automatic Camera & Shadow Framing</div>
          <div style="font-size:12px; color:#94a3b8;">Exterior cut-away walls automatically follow orbit angle</div>
        </div>
      </div>
    </div>
  </div>

  <div class="footer-caption">
    <span>Three.js WebGL · ACESFilmic Tone Mapping</span>
    <span>PCF Soft Shadow Frustum</span>
  </div>
`);

// 4. Interactive Lighting & Control Popover Slide
const slide4 = wrapSlide(`
  <div class="header-bar">
    <div class="brand">
      <div class="brand-logo">💡</div>
      <span>Interactive Device Control</span>
    </div>
    <div class="pill-badge" style="background:rgba(234,179,8,0.15); border-color:rgba(250,204,21,0.3); color:#facc15;">Step 03 · Glassmorphic Sheet</div>
  </div>

  <div style="flex:1; display:grid; grid-template-columns: 1fr 460px; gap:40px; align-items:center;">
    <!-- 3D Stage with Hover Badge -->
    <div style="background:#0a0e1a; border:1px solid rgba(255,255,255,0.15); border-radius:24px; height:680px; position:relative; overflow:hidden; display:flex; align-items:center; justify-content:center;">
      <img src="/Users/brightech/.gemini/antigravity/scratch/ha-house-control/dist/verify/multi-room.png" style="width:100%; height:100%; object-fit:contain;" alt="3D Room">
      
      <!-- Hover Tooltip Badge -->
      <div style="position:absolute; top:240px; left:380px; background:rgba(17,24,39,0.9); backdrop-filter:blur(12px); border:1px solid rgba(255,255,255,0.25); border-radius:12px; padding:10px 16px; box-shadow:0 12px 36px rgba(0,0,0,0.6); pointer-events:none;">
        <div style="font-size:13px; font-weight:700; color:#fff;">Living Room · Ceiling Light</div>
        <div style="font-size:12px; color:#38bdf8; font-weight:600;">80% · 4000 K · Active</div>
      </div>
    </div>

    <!-- Glassmorphic Control Sheet -->
    <div style="background:linear-gradient(145deg, rgba(30,38,56,0.95), rgba(14,20,32,0.98)); backdrop-filter:blur(24px); border:1px solid rgba(255,255,255,0.2); border-radius:24px; padding:32px; box-shadow:0 30px 80px rgba(0,0,0,0.8); display:flex; flex-direction:column; gap:22px;">
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:18px;">
        <div>
          <h2 style="font-size:24px; font-weight:800; color:#fff;">Ceiling Light</h2>
          <div style="font-size:13px; color:#94a3b8; margin-top:2px;">Living Room · light.living_main</div>
        </div>
        <div style="width:36px; height:36px; border-radius:50%; background:rgba(255,255,255,0.1); display:flex; align-items:center; justify-content:center; font-size:18px; color:#fff;">✕</div>
      </div>

      <!-- Power Toggle Button -->
      <div style="background:#2563eb; border:1px solid #60a5fa; color:#fff; padding:14px; border-radius:14px; font-size:16px; font-weight:700; text-align:center; box-shadow:0 0 20px rgba(37,99,235,0.4);">
        ● Power On
      </div>

      <!-- Brightness Slider -->
      <div>
        <div style="display:flex; justify-content:space-between; font-size:14px; font-weight:600; margin-bottom:8px;">
          <span>Brightness</span>
          <span style="color:#60a5fa; font-family:'JetBrains Mono';">80%</span>
        </div>
        <div style="height:10px; background:#1e293b; border-radius:999px; overflow:hidden; position:relative;">
          <div style="width:80%; height:100%; background:linear-gradient(90deg, #3b82f6, #60a5fa);"></div>
        </div>
      </div>

      <!-- Color Temperature Slider -->
      <div>
        <div style="display:flex; justify-content:space-between; font-size:14px; font-weight:600; margin-bottom:8px;">
          <span>Color Temperature</span>
          <span style="color:#fde047; font-family:'JetBrains Mono';">4000 K</span>
        </div>
        <div style="height:10px; background:linear-gradient(90deg, #ff9438, #ffbd7a, #ffe2c2, #dfe9ff); border-radius:999px; position:relative;">
          <div style="position:absolute; left:60%; top:-4px; width:18px; height:18px; border-radius:50%; background:#fff; box-shadow:0 2px 8px rgba(0,0,0,0.5);"></div>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:11px; color:#64748b; margin-top:6px;">
          <span>2200 K · Candle</span>
          <span>4000 K · Neutral</span>
          <span>6500 K · Daylight</span>
        </div>
      </div>

      <!-- Color Swatches -->
      <div>
        <div style="font-size:13px; font-weight:600; margin-bottom:10px; color:#94a3b8;">RGB Color Palette</div>
        <div style="display:flex; gap:12px;">
          <div style="width:34px; height:34px; border-radius:50%; background:#ff5a4f; border:2px solid #fff;"></div>
          <div style="width:34px; height:34px; border-radius:50%; background:#ff9a3c; border:2px solid rgba(255,255,255,0.4);"></div>
          <div style="width:34px; height:34px; border-radius:50%; background:#ffd84a; border:2px solid rgba(255,255,255,0.4);"></div>
          <div style="width:34px; height:34px; border-radius:50%; background:#5fe08a; border:2px solid rgba(255,255,255,0.4);"></div>
          <div style="width:34px; height:34px; border-radius:50%; background:#42d6e8; border:2px solid rgba(255,255,255,0.4);"></div>
          <div style="width:34px; height:34px; border-radius:50%; background:#4f8dff; border:2px solid rgba(255,255,255,0.4);"></div>
          <div style="width:34px; height:34px; border-radius:50%; background:#8b5cff; border:2px solid rgba(255,255,255,0.4);"></div>
        </div>
      </div>
    </div>
  </div>

  <div class="footer-caption">
    <span>Two-Way Home Assistant Synchronization</span>
    <span>WebSocket Event Dispatch · Zero Lag</span>
  </div>
`);

// 5. Climate & Airflow Slide
const slide5 = wrapSlide(`
  <div class="header-bar">
    <div class="brand">
      <div class="brand-logo" style="background:linear-gradient(135deg, #06b6d4, #0284c7);">❄️</div>
      <span>Climate & Airflow Simulation</span>
    </div>
    <div class="pill-badge" style="background:rgba(6,182,212,0.15); border-color:rgba(103,232,249,0.3); color:#67e8f9;">Step 04 · Dynamic Physics</div>
  </div>

  <div style="flex:1; display:grid; grid-template-columns: 1fr 460px; gap:40px; align-items:center;">
    <!-- 3D Airflow graphic -->
    <div style="background:#0a0e1a; border:1px solid rgba(255,255,255,0.15); border-radius:24px; height:680px; position:relative; overflow:hidden; display:flex; align-items:center; justify-content:center;">
      <img src="/Users/brightech/.gemini/antigravity/scratch/ha-house-control/dist/verify/multi-room.png" style="width:100%; height:100%; object-fit:contain;" alt="Airflow Room">
      
      <!-- Animated Airflow Simulation Overlay Graphic -->
      <div style="position:absolute; top:280px; left:260px; pointer-events:none; display:flex; flex-direction:column; gap:8px;">
        <div style="width:300px; height:4px; background:linear-gradient(90deg, rgba(84,199,255,0.8), transparent); border-radius:999px; box-shadow:0 0 12px #54c7ff;"></div>
        <div style="width:260px; height:4px; background:linear-gradient(90deg, rgba(84,199,255,0.6), transparent); border-radius:999px; margin-left:20px;"></div>
        <div style="width:280px; height:4px; background:linear-gradient(90deg, rgba(84,199,255,0.7), transparent); border-radius:999px; margin-left:10px;"></div>
      </div>

      <div style="position:absolute; top:220px; left:260px; background:rgba(6,182,212,0.15); border:1px solid rgba(103,232,249,0.4); border-radius:10px; padding:6px 14px; font-size:12px; font-weight:700; color:#67e8f9;">
        ❄️ COOLING ACTIVE · 21.5°C
      </div>
    </div>

    <!-- Climate Sheet -->
    <div style="background:linear-gradient(145deg, rgba(30,38,56,0.95), rgba(14,20,32,0.98)); backdrop-filter:blur(24px); border:1px solid rgba(255,255,255,0.2); border-radius:24px; padding:32px; box-shadow:0 30px 80px rgba(0,0,0,0.8); display:flex; flex-direction:column; gap:22px;">
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:18px;">
        <div>
          <h2 style="font-size:24px; font-weight:800; color:#fff;">Bedroom AC</h2>
          <div style="font-size:13px; color:#94a3b8; margin-top:2px;">Master Bedroom · climate.bedroom_ac</div>
        </div>
        <div style="width:36px; height:36px; border-radius:50%; background:rgba(255,255,255,0.1); display:flex; align-items:center; justify-content:center; font-size:18px; color:#fff;">✕</div>
      </div>

      <div style="text-align:center; color:#94a3b8; font-size:14px;">Current room temperature · <strong style="color:#fff; font-size:16px;">24.0°C</strong></div>

      <!-- Temperature Stepper -->
      <div style="display:flex; align-items:center; justify-content:center; gap:28px; padding:10px 0;">
        <div style="width:56px; height:56px; border-radius:50%; background:#1e293b; border:1px solid rgba(255,255,255,0.15); display:flex; align-items:center; justify-content:center; font-size:28px; color:#fff; font-weight:700;">−</div>
        <div style="font-size:56px; font-weight:800; font-family:'JetBrains Mono'; color:#fff; letter-spacing:-0.03em;">21.5°</div>
        <div style="width:56px; height:56px; border-radius:50%; background:#1e293b; border:1px solid rgba(255,255,255,0.15); display:flex; align-items:center; justify-content:center; font-size:28px; color:#fff; font-weight:700;">+</div>
      </div>

      <!-- Mode Selector -->
      <div>
        <div style="font-size:13px; font-weight:600; margin-bottom:10px; color:#94a3b8;">HVAC Mode</div>
        <div style="display:flex; gap:8px;">
          <div style="background:#0284c7; color:#fff; font-weight:700; padding:8px 16px; border-radius:10px; font-size:13px; box-shadow:0 0 14px rgba(2,132,199,0.5);">Cool</div>
          <div style="background:#1e293b; color:#cbd5e1; padding:8px 16px; border-radius:10px; font-size:13px;">Heat</div>
          <div style="background:#1e293b; color:#cbd5e1; padding:8px 16px; border-radius:10px; font-size:13px;">Fan</div>
          <div style="background:#1e293b; color:#cbd5e1; padding:8px 16px; border-radius:10px; font-size:13px;">Dry</div>
          <div style="background:#1e293b; color:#cbd5e1; padding:8px 16px; border-radius:10px; font-size:13px;">Auto</div>
        </div>
      </div>

      <!-- Fan Speed -->
      <div>
        <div style="font-size:13px; font-weight:600; margin-bottom:10px; color:#94a3b8;">Fan Speed</div>
        <div style="display:flex; gap:8px;">
          <div style="background:#1e293b; color:#cbd5e1; padding:8px 14px; border-radius:10px; font-size:13px;">Auto</div>
          <div style="background:#1e293b; color:#cbd5e1; padding:8px 14px; border-radius:10px; font-size:13px;">Low</div>
          <div style="background:#0284c7; color:#fff; font-weight:700; padding:8px 14px; border-radius:10px; font-size:13px;">Medium</div>
          <div style="background:#1e293b; color:#cbd5e1; padding:8px 14px; border-radius:10px; font-size:13px;">Turbo</div>
        </div>
      </div>
    </div>
  </div>

  <div class="footer-caption">
    <span>Mode-Colored Particle Simulation (Cool Cyan / Warm Heat)</span>
    <span>Real-time Climate Service Dispatch</span>
  </div>
`);

// 6. Outro Slide
const slide6 = wrapSlide(`
  <div class="header-bar">
    <div class="brand">
      <div class="brand-logo">3D</div>
      <span>HA House Control</span>
    </div>
    <div class="pill-badge" style="background:rgba(34,197,94,0.15); border-color:rgba(74,222,128,0.3); color:#4ade80;">Ready to Install</div>
  </div>

  <div style="flex:1; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; max-width:1000px; margin:0 auto;">
    <div style="width:72px; height:72px; border-radius:20px; background:linear-gradient(135deg, #3b82f6, #06b6d4); display:flex; align-items:center; justify-content:center; font-size:32px; font-weight:800; color:#fff; margin-bottom:28px; box-shadow:0 12px 30px rgba(37,99,235,0.4);">
      🏠
    </div>

    <h2 style="font-size:54px; font-weight:800; letter-spacing:-0.03em; margin-bottom:20px; line-height:1.15;">
      Your Entire House as a Live 3D Twin.
    </h2>

    <p style="font-size:22px; color:#94a3b8; max-width:760px; line-height:1.5; margin-bottom:40px;">
      Zero CAD required. Draw your walls on the 2D grid, link your Home Assistant entities, and enjoy instant physical 3D control.
    </p>

    <div style="background:#0f172a; border:1px solid rgba(255,255,255,0.15); border-radius:16px; padding:16px 28px; font-family:'JetBrains Mono', monospace; font-size:18px; color:#38bdf8; margin-bottom:32px;">
      github.com/knarayanareddy/ha-house-control
    </div>

    <div style="display:flex; gap:20px;">
      <div class="feature-pill" style="padding:10px 20px; font-size:15px;">📦 HACS Custom Repository</div>
      <div class="feature-pill" style="padding:10px 20px; font-size:15px;">🔒 100% Local & Private</div>
      <div class="feature-pill" style="padding:10px 20px; font-size:15px;">⚡ Three.js Hardware Accelerated</div>
    </div>
  </div>

  <div class="footer-caption" style="justify-content:center;">
    <span>MIT Licensed · Built with Three.js & Lit for Home Assistant</span>
  </div>
`);

// Write HTML slides
writeFileSync(resolve(OUT_DIR, 'slide1.html'), slide1);
writeFileSync(resolve(OUT_DIR, 'slide2.html'), slide2);
writeFileSync(resolve(OUT_DIR, 'slide3.html'), slide3);
writeFileSync(resolve(OUT_DIR, 'slide4.html'), slide4);
writeFileSync(resolve(OUT_DIR, 'slide5.html'), slide5);
writeFileSync(resolve(OUT_DIR, 'slide6.html'), slide6);

console.log('Generated 6 HTML master slides.');
