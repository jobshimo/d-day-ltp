# -*- coding: utf-8 -*-
"""
generate.py

Reads narration-manifest.json and synthesizes one MP3 per entry using Kokoro TTS.
Files are content-addressed (hash of voice + text) so they are never regenerated
if the file already exists.

Run with:
    PYTHONUTF8=1 tools/tts/.venv/Scripts/python tools/tts/generate.py

from the repo root.
"""

import json
import os
import sys

# ---------------------------------------------------------------------------
# espeak-ng bootstrap (must come before any phonemizer / kokoro import)
# ---------------------------------------------------------------------------
import espeakng_loader
from phonemizer.backend.espeak.wrapper import EspeakWrapper

EspeakWrapper.set_library(espeakng_loader.get_library_path())
EspeakWrapper.set_data_path(espeakng_loader.get_data_path())

# ---------------------------------------------------------------------------
# Kokoro + soundfile
# ---------------------------------------------------------------------------
import numpy as np
import soundfile as sf
from kokoro import KPipeline

# ---------------------------------------------------------------------------
# Paths (relative to repo root; script is run from repo root)
# ---------------------------------------------------------------------------
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.normpath(os.path.join(SCRIPT_DIR, '..', '..'))

CONFIG_PATH = os.path.join(SCRIPT_DIR, 'narration.config.json')
MANIFEST_PATH = os.path.join(SCRIPT_DIR, 'narration-manifest.json')
AUDIO_DIR = os.path.join(REPO_ROOT, 'libs', 'content', 'src', 'assets', 'audio')

# ---------------------------------------------------------------------------
# Load config
# ---------------------------------------------------------------------------
with open(CONFIG_PATH, encoding='utf-8') as f:
    config = json.load(f)

VOICE = config['voice']
LANG_CODE = config['lang']
SAMPLE_RATE = config['sampleRate']

# ---------------------------------------------------------------------------
# Load manifest
# ---------------------------------------------------------------------------
with open(MANIFEST_PATH, encoding='utf-8') as f:
    manifest = json.load(f)

# ---------------------------------------------------------------------------
# Ensure output directory exists
# ---------------------------------------------------------------------------
os.makedirs(AUDIO_DIR, exist_ok=True)

# ---------------------------------------------------------------------------
# Initialize Kokoro pipeline (once)
# ---------------------------------------------------------------------------
print(f'Initializing Kokoro pipeline (lang={LANG_CODE}, voice={VOICE}) …')
pipeline = KPipeline(lang_code=LANG_CODE)

# ---------------------------------------------------------------------------
# Synthesize
# ---------------------------------------------------------------------------
generated = 0
skipped = 0
total = len(manifest)

for entry in manifest:
    # Prefer the normalized spoken form; fall back to the raw text for older manifests.
    text = (entry.get('spoken') or entry['text']).strip()
    if not text:
        skipped += 1
        continue

    target_path = os.path.join(AUDIO_DIR, entry['file'])

    if os.path.exists(target_path):
        skipped += 1
        continue

    print(f'  Generating {entry["file"]}  ({entry["key"]}) …')

    chunks = [audio for _, _, audio in pipeline(text, voice=VOICE)]
    if not chunks:
        print(f'  WARNING: no audio produced for key={entry["key"]}', file=sys.stderr)
        skipped += 1
        continue

    audio = np.concatenate(chunks)
    sf.write(target_path, audio, SAMPLE_RATE, format='MP3')
    generated += 1

print(f'generated={generated} skipped={skipped} total={total}')
