import os
import sys
import time
import subprocess
import shutil

RECORD_DIR = "/tmp/master_video_raw"
FFMPEG = "/Users/brightech/.gemini/antigravity/bin/ffmpeg"
OUTPUT_MP4 = "/Users/brightech/.gemini/antigravity/scratch/ha-house-control/ha-house-control-demo.mp4"
ARTIFACT_MP4 = "/Users/brightech/.gemini/antigravity/brain/417c1ab2-286e-4726-862a-10065eb04b62/ha-house-control-demo.mp4"

# Clean up raw recording dir
if os.path.exists(RECORD_DIR):
    shutil.rmtree(RECORD_DIR)
os.makedirs(RECORD_DIR, exist_ok=True)

print("Launching Playwright to capture live 1-2 minute interactive demo...")
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(
        headless=True,
        args=[
            "--disable-gpu-vsync",
            "--enable-webgl",
            "--no-sandbox"
        ]
    )
    context = browser.new_context(
        record_video_dir=RECORD_DIR,
        record_video_size={"width": 1920, "height": 1080},
        viewport={"width": 1920, "height": 1080}
    )
    page = context.new_page()
    page.goto("http://localhost:8123/local/master-showcase.html")
    
    print("Capturing live showcase (expected ~80-110s)...")
    # Wait until showcase finishes or max 125 seconds
    start_time = time.time()
    while time.time() - start_time < 125:
        time.sleep(2)
        done = page.evaluate("() => !!window.__SHOWCASE_COMPLETED")
        elapsed = int(time.time() - start_time)
        print(f"Elapsed: {elapsed}s | Done: {done}")
        if done:
            # extra second for clean outro fade
            time.sleep(2)
            break
            
    context.close()
    browser.close()

# Find recorded webm file
raw_files = [f for f in os.listdir(RECORD_DIR) if f.endswith(".webm")]
if not raw_files:
    print("Error: No webm file recorded!")
    sys.exit(1)

raw_webm = os.path.join(RECORD_DIR, raw_files[0])
print(f"Raw video recorded: {raw_webm} ({os.path.getsize(raw_webm)} bytes)")

# Probe raw video duration
dur_out = subprocess.run(
    f"ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 {raw_webm}",
    shell=True,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    text=True
).stdout.strip()

try:
    total_dur = float(dur_out)
except Exception:
    total_dur = 85.0
print(f"Detected video duration: {total_dur:.2f} seconds")

# Synthesize a modern, dynamic SaaS ambient electronic tech pad & rhythmic pulses
# A minor synth chord progression (A2, C3, E3, G3) with rhythmic 120bpm sidechain feel
audio_filter = f"""
anoisesrc=d={total_dur}:c=pink:r=48000:a=0.012,lowpass=f=350[sub_noise];
sine=f=110:d={total_dur},volume=0.10[bass];
sine=f=164.81:d={total_dur},volume=0.07[pad1];
sine=f=220:d={total_dur},volume=0.05[pad2];
sine=f=261.63:d={total_dur},volume=0.04[pad3];
sine=f=329.63:d={total_dur},volume=0.03[pad4];
sine=f=880:d=0.05,volume=0.15,adelay=12000|12000[blip1];
sine=f=880:d=0.05,volume=0.15,adelay=34000|34000[blip2];
sine=f=880:d=0.05,volume=0.15,adelay=52000|52000[blip3];
sine=f=880:d=0.05,volume=0.15,adelay=70000|70000[blip4];
sine=f=880:d=0.05,volume=0.15,adelay=86000|86000[blip5];
sine=f=880:d=0.05,volume=0.15,adelay=100000|100000[blip6];
[sub_noise][bass][pad1][pad2][pad3][pad4][blip1][blip2][blip3][blip4][blip5][blip6]amix=inputs=12:duration=first:dropout_transition=2[amix];
[amix]afade=t=in:st=0:d=2.0,afade=t=out:st={max(0, total_dur - 2.5):.2f}:d=2.5[aout]
"""

# Compile master MP4
encode_cmd = [
    FFMPEG,
    "-y",
    "-i", raw_webm,
    "-filter_complex", audio_filter.replace("\n", " ").strip(),
    "-map", "0:v:0",
    "-map", "[aout]",
    "-c:v", "libx264",
    "-preset", "fast",
    "-crf", "18",
    "-pix_fmt", "yuv420p",
    "-c:a", "aac",
    "-b:a", "192k",
    "-t", f"{total_dur:.2f}",
    OUTPUT_MP4
]

print("Encoding master Full HD (1920x1080) MP4...")
subprocess.run(encode_cmd, check=True)
shutil.copyfile(OUTPUT_MP4, ARTIFACT_MP4)

print(f"Master Showcase Video Generated Successfully!")
print(f"Path: {OUTPUT_MP4}")
print(f"Artifact: {ARTIFACT_MP4}")
