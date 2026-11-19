import { execSync } from 'node:child_process';
import { resolve } from 'node:path';
import { existsSync } from 'node:fs';

const FFMPEG = '/Users/brightech/.gemini/antigravity/bin/ffmpeg';
const OUT_DIR = '/tmp/ha_demo_video';
const OUTPUT_MP4 = '/Users/brightech/.gemini/antigravity/scratch/ha-house-control/ha-house-control-demo.mp4';

console.log('Compiling high-fidelity SaaS demo video with FFmpeg...');

// Check input slides
for (let i = 1; i <= 6; i++) {
  const p = `${OUT_DIR}/slide${i}.png`;
  if (!existsSync(p)) {
    throw new Error(`Missing ${p}`);
  }
}

// Slide durations: 4.0s each
// 5 transitions of 0.4s duration:
// offsets:
// slide 1 -> 2: offset = 4.0 - 0.4 = 3.6
// slide 2 -> 3: offset = 3.6 + 4.0 - 0.4 = 7.2
// slide 3 -> 4: offset = 7.2 + 4.0 - 0.4 = 10.8
// slide 4 -> 5: offset = 10.8 + 4.0 - 0.4 = 14.4
// slide 5 -> 6: offset = 14.4 + 4.0 - 0.4 = 18.0
// Total duration = 18.0 + 4.0 = 22.0 seconds

// Video filter graph:
// 6 image inputs looping for 4.0s at 30 fps
const videoFilters = [
  // Inputs:
  `[0:v]fps=30,settb=AVTB[v0]`,
  `[1:v]fps=30,settb=AVTB[v1]`,
  `[2:v]fps=30,settb=AVTB[v2]`,
  `[3:v]fps=30,settb=AVTB[v3]`,
  `[4:v]fps=30,settb=AVTB[v4]`,
  `[5:v]fps=30,settb=AVTB[v5]`,
  `[v0][v1]xfade=transition=smoothleft:duration=0.4:offset=3.6[x1]`,
  `[x1][v2]xfade=transition=smoothleft:duration=0.4:offset=7.2[x2]`,
  `[x2][v3]xfade=transition=smoothleft:duration=0.4:offset=10.8[x3]`,
  `[x3][v4]xfade=transition=smoothleft:duration=0.4:offset=14.4[x4]`,
  `[x4][v5]xfade=transition=smoothleft:duration=0.4:offset=18.0[vout]`
].join(';');

// Generate modern ambient tech audio:
// A gentle warm synth chord (A2 = 110Hz, E3 = 165Hz, C#3 = 138.6Hz) with subtle tremolo & fade-in/fade-out
// plus soft digital transition blips at the transition offsets.
const audioFilters = [
  // Base drone
  `anoisesrc=d=22:c=pink:r=48000:a=0.015,lowpass=f=400[noise]`,
  `sine=f=110:d=22,volume=0.12[s1]`,
  `sine=f=164.81:d=22,volume=0.08[s2]`,
  `sine=f=220:d=22,volume=0.06[s3]`,
  `sine=f=277.18:d=22,volume=0.04[s4]`,
  // Blip sounds at transitions
  `sine=f=880:d=0.06,volume=0.18,adelay=3600|3600[click1]`,
  `sine=f=880:d=0.06,volume=0.18,adelay=7200|7200[click2]`,
  `sine=f=880:d=0.06,volume=0.18,adelay=10800|10800[click3]`,
  `sine=f=880:d=0.06,volume=0.18,adelay=14400|14400[click4]`,
  `sine=f=880:d=0.06,volume=0.18,adelay=18000|18000[click5]`,
  // Mix
  `[noise][s1][s2][s3][s4][click1][click2][click3][click4][click5]amix=inputs=10:duration=first:dropout_transition=2[amixed]`,
  `[amixed]afade=t=in:st=0:d=1.5,afade=t=out:st=20.5:d=1.5[aout]`
].join(';');

const cmd = [
  FFMPEG,
  '-y',
  '-loop 1 -t 4.0 -i /tmp/ha_demo_video/slide1.png',
  '-loop 1 -t 4.0 -i /tmp/ha_demo_video/slide2.png',
  '-loop 1 -t 4.0 -i /tmp/ha_demo_video/slide3.png',
  '-loop 1 -t 4.0 -i /tmp/ha_demo_video/slide4.png',
  '-loop 1 -t 4.0 -i /tmp/ha_demo_video/slide5.png',
  '-loop 1 -t 4.0 -i /tmp/ha_demo_video/slide6.png',
  `-filter_complex "${videoFilters};${audioFilters}"`,
  '-map "[vout]"',
  '-map "[aout]"',
  '-c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p',
  '-c:a aac -b:a 192k',
  `-t 22.0`,
  OUTPUT_MP4
].join(' ');

console.log('Executing ffmpeg command...');
execSync(cmd, { stdio: 'inherit' });
console.log(`Demo video successfully generated at: ${OUTPUT_MP4}`);
