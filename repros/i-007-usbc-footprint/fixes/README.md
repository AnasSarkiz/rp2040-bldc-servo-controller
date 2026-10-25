# Importer fix provenance

Primary owner: [tscircuit/easyeda-converter](https://github.com/tscircuit/easyeda-converter),
published package `easyeda@0.0.381`, revision
`00905fef07baf2e67f5f0ed64457f3b4c852f87e`.

`easyeda-converter.patch` is an upstream-ready source patch against that revision.
It changes only `expandEasyEdaPathData` to consume every complete M/L pair and A
seven-argument group, updating the current point each time. It adds the captured
C37616412 JSON and four regression tests, including full conversion and footprint
TSX generation. Existing arc generation, units, layers, fill, stroke and region
closure are unchanged. `EASYEDA_LICENSE` preserves upstream's MIT license.

`../patches/@tscircuit+cli+0.1.2408.patch` applies the same two loops to both copies
of that helper embedded in the released CLI's `dist/cli/main.js`. The rest of the
CLI is unchanged. A dependency override cannot reach this embedded code. This is
a temporary local package patch, **not a published upstream fix**. It is applied
by `patch-package --error-on-fail` on every `npm ci`, and is pinned to this CLI
version so incompatible upgrades fail visibly. No imported definition is edited
by the patch or by any script.

## Validate the exact CLI used by this fixture

From `repros/i-007-usbc-footprint`, with Bun on PATH:

```sh
npm ci
npm test
export PATH="$PWD/node_modules/.bin:$PATH"
tsci import --jlcpcb C37616412 --download --use-exact-footprint
tsci build index.circuit.tsx --pcb-svgs --pcb-png
npm run verify
CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run capture
```

`npm test` extracts the actual private helper functions from the installed CLI
bundle and exercises them without copying their implementation. Both helper
copies are tested. The same eight assertions on a pristine bundle produce six
failures and two passes; the patched bundle passes all eight. Logs are archived
under `../evidence/`. `verify` compares all 105 deterministic circuit records
against the baseline. It excludes the expected source digest and the optional
datasheet-fetch failure diagnostic (present behind the local proxy, absent on
GitHub runners, retained in native JSON/build logs), and checks that
the generated component differs only on its fabrication line.

For offline rebuilding, use the committed generated imports; `npm run build`
and `npm run verify` do not require re-importing from a live supplier API.
The source fixture is archived unchanged for stable parser tests.

## Validate the upstream source patch independently

```sh
git clone https://github.com/tscircuit/easyeda-converter.git
cd easyeda-converter
git checkout 00905fef07baf2e67f5f0ed64457f3b4c852f87e
git apply /absolute/path/to/easyeda-converter.patch
bun install
bun test tests/c37616412-repeated-path-arguments.test.ts \
  tests/arc-utils.test.ts tests/arc-utils-semicircle.test.ts
```

Result: **13 pass, zero fail**. The fix addresses repeated absolute M/L/A arguments
in the existing supported path subset. It does not add a general SVG parser or
expand existing support for relative commands or multiple subpaths. Further
upstream integration and release are separate from these repository PRs.
