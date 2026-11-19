// Demo page: renders the bundled sample plan full-window.
import { createWorld } from '../src/engine/world';
import { normalizePlan } from '../src/engine/plan';
import samplePlan from '../src/sample-plan.json';
import type { Plan } from '../src/types';

const canvas = document.getElementById('view') as HTMLCanvasElement;
const world = createWorld(canvas, normalizePlan(samplePlan as Plan));

// Expose for tinkering in devtools.
(window as unknown as { world: unknown }).world = world;
