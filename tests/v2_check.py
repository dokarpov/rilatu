#!/usr/bin/env python3
"""Structural contract for the v2 Ledger design (rendered checks live in agency-skills render_audit.py)."""
from pathlib import Path
import re
p = Path(__file__).resolve().parents[1] / "v2"
h = (p / "index.html").read_text(encoding="utf-8")
css = (p / "styles.css").read_text(encoding="utf-8")
js = (p / "app.js").read_text(encoding="utf-8")
ids = re.findall(r'\bid="([^"]+)"', h)
assert len(ids) == len(set(ids)), "duplicate ids"
for w in (400, 500, 600):
    assert (p / f"fonts/familjen-grotesk-latin-{w}-normal.woff2").exists(), w
assert (p / "fonts/OFL.txt").exists(), "font licence ships with the files"
assert "fonts.googleapis" not in h + css, "fonts are self-hosted"
assert not re.search(r"font-weight:\s*(700|800|900)|\b[789]00 var\(--", css), "weights stay at 400/500/600"
for bad in ("—", "·", "↗", "→", "text-transform:uppercase", "backdrop-filter", "gradient(", "monospace", "#000", "#fff"):
    assert bad not in h + css, bad
assert "prefers-reduced-motion" in css and "prefers-reduced-motion" in js
for hook in ('data-view="raw"', 'data-view="linked"', 'data-purpose="income"', 'data-purpose="rental"', 'data-purpose="residency"', 'id="export"', 'aria-live="polite"', 'class="skip"'):
    assert hook in h, hook
assert "URL.createObjectURL" in js and "aria-pressed" in js
assert "min-height:44px" in css or "min-height:48px" in css
print("PASS: v2 ledger structure, self-hosted type, anti-slop markers, interactions")
