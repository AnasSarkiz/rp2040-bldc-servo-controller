# I-007: isolated USB4215-03-A / C37616412 reproduction

Run these commands in this directory. `index.circuit.tsx` is the entire circuit:
one board containing one unconnected imported USB-C connector. `U1` follows the
imported `chip` primitive's reference convention; the name has no PCB effect.

Prerequisites: Node 24+, npm, Bun (`tsci` uses Bun), and network access to npm,
EasyEDA, and the model CDN. The fix branch patches the pinned CLI importer during `npm ci`; see
[fix provenance](fixes/README.md). Latest npm versions checked on 2026-10-25:
`@tscircuit/cli@0.1.2408`, `tscircuit@0.0.3016`; the lockfile pins this result.

```sh
npm ci
export PATH="$PWD/node_modules/.bin:$PATH"
tsci version --verbose
tsci import --jlcpcb C37616412 --download --use-exact-footprint
tsci build index.circuit.tsx --pcb-svgs --pcb-png
npm test
npm run verify
```

`npm run build` is the same build command. The imported TSX, OBJ, and STEP were
created by the import command, with no manual edits. Committed build outputs:
[PCB SVG](dist/index/pcb.svg), [PCB PNG](dist/index/pcb.png),
[full Circuit JSON](dist/index/circuit.json).

Evidence: [highlighted screenshot](evidence/pcb-highlighted.png),
[fabrication-only SVG](evidence/fabrication.svg),
[fabrication JSON](evidence/fabrication.json),
[raw supplier outline rendered directly](evidence/source-document-region.svg),
[manufacturer drawing page 1](evidence/manufacturer-drawing-page-1.png).
See [BUG_REPORT.md](../../BUG_REPORT.md) for the diagnosis.

To refresh the independent source archive and derived evidence:

```sh
python3 scripts/fetch-source.py
npx playwright install chromium
npm run capture
# Or use an existing Chromium:
CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run capture
```

Capture reads the unmodified CLI SVG. The highlighted screenshot adds an HTML
annotation over it. Fabrication-only SVG removes other layers from a **copy**;
its fabrication path data/fill/stroke remain exactly as rendered. The supplier
SVG uses the original EasyEDA `d` string directly in the browser, bypassing the
importer. No build output or imported definition is repaired by these scripts.
The fix is applied to the importer package; normal re-import regenerates the
component and normal build updates the PCB outputs.
[Before/after screenshot](evidence/before-after.png); preserved unmodified
baseline files are under [evidence/baseline/](evidence/baseline/).
The raw source was independently fetched using `fetchEasyEDAComponent` with
`includeModelMetadata:false`; `fetch-source.py` provides a dependency-free refresh.
Live supplier updates may change metadata or geometry, so retain the captured
JSON for historical comparison.

Build warnings about missing power/ground metadata, underspecified pins, a missing
schematic sheet, and blocked datasheet enrichment are recorded in `evidence/`.
They do not prevent the PCB build (exit 0) and are not suppressed. This fixture
has no electrical traces and is not an electrically complete USB design.
