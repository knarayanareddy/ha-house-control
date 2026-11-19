import os
import sys
import time
import subprocess
import shutil

sys.stdout.reconfigure(line_buffering=True)
RECORD_DIR = "/tmp/final_video_raw"
FFMPEG = "/Users/brightech/.gemini/antigravity/bin/ffmpeg"
OUTPUT_MP4 = "/Users/brightech/.gemini/antigravity/scratch/ha-house-control/ha-house-control-demo.mp4"
ARTIFACT_MP4 = "/Users/brightech/.gemini/antigravity/brain/122ddc74-a10f-49ff-8c2f-dda7ac1d5f69/ha-house-control-demo.mp4"

if os.path.exists(RECORD_DIR):
    shutil.rmtree(RECORD_DIR)
os.makedirs(RECORD_DIR, exist_ok=True)

print("Starting continuous live recording with Playwright...")
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
    page.goto("http://localhost:8123/local/interactive-demo.html", wait_until="networkidle", timeout=120000)
    
    start_time = time.time()
    while time.time() - start_time < 190:
        time.sleep(1.5)
        done = page.evaluate("() => !!window.__SHOWCASE_SUCCESS")
        elapsed = int(time.time() - start_time)
        print(f"Elapsed: {elapsed}s | Finished: {done}")
        if done:
            print("Showcase director reached the end! Waiting 2s for outro...")
            time.sleep(2)
            break
            
    context.close()
    browser.close()

raw_files = [f for f in os.listdir(RECORD_DIR) if f.endswith(".webm")]
if not raw_files:
    print("Error: No raw webm file found!")
    sys.exit(1)

raw_webm = os.path.join(RECORD_DIR, raw_files[0])
print(f"Raw capture size: {os.path.getsize(raw_webm)} bytes")

# Probe raw duration
dur_out = subprocess.run(
    f"ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 {raw_webm}",
    shell=True,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    text=True
).stdout.strip()
total_dur = float(dur_out) if dur_out else 45.0
print(f"Captured video duration: {total_dur:.2f} seconds")

# Synthesize modern ambient tech pad
audio_filter = f"""
anoisesrc=d={total_dur}:c=pink:r=48000:a=0.010,lowpass=f=320[noise];
sine=f=110:d={total_dur},volume=0.09[bass];
sine=f=164.81:d={total_dur},volume=0.06[pad1];
sine=f=220:d={total_dur},volume=0.05[pad2];
sine=f=261.63:d={total_dur},volume=0.04[pad3];
sine=f=329.63:d={total_dur},volume=0.03[pad4];
sine=f=880:d=0.04,volume=0.12,adelay=8000|8000[b1];
sine=f=880:d=0.04,volume=0.12,adelay=16000|16000[b2];
sine=f=880:d=0.04,volume=0.12,adelay=24000|24000[b3];
sine=f=880:d=0.04,volume=0.12,adelay=32000|32000[b4];
sine=f=880:d=0.04,volume=0.12,adelay=40000|40000[b5];
[noise][bass][pad1][pad2][pad3][pad4][b1][b2][b3][b4][b5]amix=inputs=11:duration=first:dropout_transition=2[amix];
[amix]afade=t=in:st=0:d=1.5,afade=t=out:st={max(0, total_dur - 1.5):.2f}:d=1.5[aout]
"""

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

print("Encoding master MP4 with AAC soundtrack...")
subprocess.run(encode_cmd, check=True)
shutil.copyfile(OUTPUT_MP4, ARTIFACT_MP4)
print(f"Master Showcase Video Ready: {OUTPUT_MP4}")
