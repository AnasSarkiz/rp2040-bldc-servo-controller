# Engineering and tooling issues

Updated 2026-10-26. Current revision: engineering-review-prototype-0.0.3. The main board remains an unconnected imported-part inspection. Dependent work remains gated; unrelated investigation continues. No generated component definition is manually patched.

Triage distinction: I-002, I-007, I-009, I-013–I-018 concern tscircuit tooling/import/service behavior. I-003/I-010 are mechanical-document access blockers; I-005 is document acquisition; I-006/I-008 are unfinished engineering; I-011 is integration access. **I-012's earlier missing-frame claim is retracted**, and I-019 is a separate non-tscircuit preview issue with verified raw CSV data. An unconnected required pin in the unfinished main schematic is not, by itself, a tscircuit bug.

## I-001 - RP2040 C2040 exact footprint coordinate rejected

Affected stage: import verification / schematic and placement validation.

Reproduction with initially installed CLI package 0.1.2237:

```sh
tsci import --jlcpcb C2040 --download --use-exact-footprint
tsci build index.circuit.tsx --pcb-png --pcb-svgs --schematic-svgs --3d
```

Generated pad 57 has `pcbX="-1.1368683772161603e-13mm"`. Build reports `Invalid pcbX value for SmtPad: Invalid calc() expression. expression="-1.1368683772161603e-13mm"` and exits 1. The initial JSON records `source_invalid_component_property_error`.

Attempted resolution: installed supported CLI 0.1.2408 locally; regenerated the same component through its supported exact-footprint import. The newer importer emits `pcbX="-0mm"`. Also tested the supported default import, which chooses a footprinter match with reported 99.79% copper IoU. That alternate was not adopted. Reproductions are in `evidence/reimport-exact/` and `evidence/reimport-default/`; import logs are in `evidence/logs/rp2040-reimport-*.log`. The root import was regenerated with the exact footprint. No manual coordinate change or pin-attribute suppression was used. Status: coordinate defect resolved by supported re-import; the final build has no invalid-coordinate error. Independent component defects below still block integration.

## I-002 - Push omits configured ignoredFiles from its file selection (BLOCKING)

Affected stage: registry publication, consistency and datasheet exclusion.

`tscircuit.config.json` supports `ignoredFiles` and the project requests `datasheets/**`, `evidence/**` and `mechanical/**` exclusion. Both CLI 0.1.2237 and 0.1.2408 call:

```ts
getPackageFilePaths(projectDir, includeDist ? [] : ["**/dist/**"])
```

The helper applies only its supplied ignored patterns and defaults. `pushSnippet` supplies no configured `ignoredFiles`; the subsequent `getUploadFiles` maps the selected files without a further configuration filter. In contrast, the development server passes `this.ignoredFiles` to the same helper. See `evidence/logs/publish-ignore-source.txt` for the exact installed source locations. `push --help` supports `--include-dist` but offers no exclusion flag or dry-run flag.

Reproduce safely: put a PDF in `datasheets/`, set `ignoredFiles: ["datasheets/**"]`, inspect the `pushSnippet` file-selection call and helper in the installed CLI. Running a real push is intentionally avoided because it would upload the excluded files. Required next action: a supported CLI release/workflow that demonstrably applies publication exclusions, followed by verification of the uploaded file list and Circuit JSON hash. No hidden-folder relocation, dependency patch or undocumented flag is used. Status: unresolved, blocks registry release.

2026-10-26 follow-up: the official npm **0.1.2409** tarball was inspected after verifying its SHA-512 integrity against registry metadata. It still calls `getPackageFilePaths(projectDir, includeDist ? [] : ["**/dist/**"])` without configured ignoredFiles. Evidence: `evidence/tooling-20261026/latest-cli-metadata.json` and `cli-0.1.2409-source-review.json`. The project stays pinned to 0.1.2408; no dependency patch or ineffective upgrade is presented as a fix.

## I-003 - Official motor drawing and STEP download inaccessible (BLOCKING)

Affected stage: requirements and exact rear mechanical fit.

```sh
curl --fail --location https://files.omc-stepperonline.com/42BSA46-24-01.pdf --output mechanical/motor.pdf
curl --fail --location https://files.omc-stepperonline.com/42BSA46-24-01.stp --output mechanical/motor.step
```

Both return HTTP 403 even with escalated network access, including a retry after expanded-access authorization. The motor product page download also returns 403 to the local client. A web index supplies the PDF's extracted text, including `42.2`, `31`, `4-M3x0.5 4MIN`, shaft 5 mm and length 24 mm. A text extraction does not establish which mounting dimensions apply to the rear. Web PDF screenshot attempts fail with `Cache miss`. The linked UK product listing marks the STEP download as login-required; no account access is presumed. Product images linked by that listing return 404 to the local downloader.

Logs: `evidence/logs/motor.*-download.log`, `evidence/expanded-access-downloads.json`, initial/retry manifests. Required next action: access to the official motor STEP and a readable dimensioned drawing; inspect rear bolts, thread engagement, rear protrusions and cable exit, then verify the PCB/standoff/fastener assembly against them. Do not use the front mounting pattern as an assumed rear pattern. Status: unresolved. No exact mounting outline or hole pattern is released.

## I-004 - C82317 absent from JLCPCB search index

Affected stage: BOM sourcing verification.

`tsci search --jlcpcb --json C82317` returns an empty result. The official LCSC page `https://www.lcsc.com/product-detail/C82317.html` confirms W25Q16JVSSIQ / SOIC-8-208mil, and the supported JLCPCB import succeeds for C82317. C131025 independently appears as the same MPN with stock, but is not silently substituted. Manufacturer-text searches also return unrelated parts, so those results must not be treated as exact matches.

Logs: `evidence/logs/search-C82317.json`, `search-C131025.json`, `search-W25Q16JV*.json`, `import-C82317.log`. Original status: identity/import confirmed; C82317 assembly availability unresolved. **Revision 0.0.2 disposition:** the user's explicit alternative-sourcing instruction authorizes C131025. Exact import, same-MPN/pin/package review and stock snapshot are recorded in `SOURCING.md` and `evidence/sourcing-20261025/`. U4 now uses C131025. The C82317 search-index defect itself is not fixed, but no longer blocks the selected flash supplier code. Final assembler matching remains pending.

## I-005 - Manufacturer document download failures

Affected stage: complete datasheet/reference-design review and GitHub archive.

ST's datasheet and programming-guide downloads fail locally with HTTP/2 `INTERNAL_ERROR` or timeout. Retrying HTTP/1.1 and the ST China hostname did not resolve acquisition. Web PDF text is available for review but is not a locally archived PDF. The legacy ams AS5047P URL returns 404, and the distributor mirror times out; a current Infineon-hosted manufacturer document has now been located for retry. See `evidence/datasheet-downloads.json`, `datasheet-retries.json`, and `expanded-access-downloads.json`.

Downloaded PDFs have validated PDF signatures and SHA-256 manifests. Files that were not obtained are not represented by fake/empty PDFs. Status: partially unresolved; see final manifest and VALIDATION.md for successful later downloads. No unreviewed component support circuit is finalized.

## I-006 - Inspection fixture is electrically incomplete and has schematic warnings

Affected stages: schematic/BOM, pre-routing placement and all later validation.

The fixture deliberately has no electrical traces. Initial build reports 13 required RP2040 pins floating and additional missing-trace warnings. All parts need real support circuitry before this can be a design. `check netlist` returns exit 0 but enumerates NOT_CONNECTED ports; that is not a hardware pass. `check pin_specification` returns exit 0 with underspecified USB-C power/ground attributes and missing motor-driver power metadata. These importer metadata omissions are recorded and not suppressed. The USB connector is imported as a chip, so its J prefix generates a convention warning.

Initial schematic-placement check reports U2 DRVOFF/nFAULT label clearance of 0.011 schematic units, below 0.1. Initial A4 output warns two components extend outside the drawing area. These must be corrected with ordinary supported schematic layout props/sheets and re-inspected. No routing is allowed. Stage results and latest logs are recorded in VALIDATION.md. Status: incomplete, not a validated controller.

## I-007 - USB4215 C37616412 fabrication outline artifact

The initial imported USB connector contains a `fabricationnotepath` crossing diagonally through its body. This is visible in the PCB preview even though there are zero traces. The manufacturer USB4215 drawing specifies a connector body/outline rather than this diagonal. The current supported exact import was tested and retains the malformed path. Do not hand-edit the imported outline. A confirmed remaining import defect blocks dependent PCB integration under AGENTS.md. Evidence: initial `dist/index/pcb.png`, generated source `imports/USB4215_03_A/USB4215_03_A.tsx`, and latest-import log. Status: BLOCKING. The diagonal fabrication path remains in CLI 0.1.2408 re-import and in its rendered PCB preview.

## I-008 - PD/boost/protection design is not qualified (BLOCKING)

STUSB4500 supports three static sink PDOs, not four. Four requested voltages need documented MCU reconfiguration and renegotiation, with motor interlocks maintained throughout. A 100 W charger label is not proof of a negotiated 20 V / 5 A contract. LM5122 is a candidate only: no complete imported boost BOM, loop compensation, worst-case loss/current calculation, output short protection, inrush/disconnect solution, regeneration sink or thermal validation exists. Exact motor-mount footprint and the motor's heat further constrain cooling.

POWER-REVIEW.md records screening calculations and explicit assumptions. Required next action: finish requirements and component/data acquisition, then a complete reviewed power design with startup/load-step/short tests and measured prototype thermal results. Status: unresolved. Working FOC, exact fit and fabrication readiness are not claimed.

## I-009 - Incomplete imported electrical metadata (BLOCKING)

Affected parts/stages: DRV8316R C5218861 and USB4215-03-A C37616412; schematic pin-specification review. The motor-driver import identifies some grounds but none of VM pins 9/10/11 as power inputs. The USB connector has no pinAttributes, including for power/ground. The mandatory pin-specification check emits four corresponding warnings. No declarations are manually changed, and warnings are not accepted as completed electrical verification. Required next action: corrected supported imported definitions followed by repeat pin-specification review. See final pin-specification log.

2026-10-26: supported exact re-imports were repeated independently under `evidence/tooling-20261026/reimports/`, preserving the main definitions. The same omissions and USB fabrication artifact remain. Anonymous default datasheet metadata endpoints return HTTP 404 for normalized `drv8316rrgfr` and `usb4215-03-a`; the importer fetches these metadata independently of physical footprint acquisition. These responses establish a metadata coverage gap, not a bad supplier identity. Logs and selected API responses are in `evidence/tooling-20261026/reimport-C*.log` and `datasheet-metadata-*.json`. Both imports still exit 0; success is not electrical qualification.

## I-010 - Browser origin access declined

A browser fallback to the official motor product page was rejected by its security gate: origin approval was declined and network egress authority was not granted. No alternate browser, indirect navigation or subsequent download workaround was attempted for that origin. This is separate from earlier HTTP 403 downloads. Exact rear-model inspection remains unavailable.

## I-011 - tscircuit GitHub integration cannot access new repository (BLOCKING)

`registry packages update --package-name AnasSarkiz/rp2040-bldc-servo-controller --enable-public-dist --github-repo AnasSarkiz/rp2040-bldc-servo-controller` returns HTTP 403 `repository_not_accessible`. The package and repository were created publicly and anonymous API reads confirm their visibility. GitHub CLI authentication succeeded as AnasSarkiz. The denied scope belongs to the tscircuit GitHub installation, not the shell sandbox. A separate public-dist update without GitHub linking succeeded. The user must grant that integration access to this repository if linked-source operation is required; no credentials are copied.

## I-012 - Earlier missing-frame report was incorrect (CLOSED / CORRECTED)

The 0.0.2 visual-review record incorrectly reported missing power/interfaces frames. Reinspection of the actual SVGs on 2026-10-26 finds an outer and inner native frame on every sheet, inside the viewport. PNG border pixels were also present on all three; newly rendered full-sheet images were inspected. **No missing-frame renderer defect is confirmed.** The initial observation must not remain a fabrication/tooling blocker.

The generic renderer's first-sheet-only output is documented single-sheet behavior. The supported `convertCircuitJsonToStackedSchematicSheetsSvg` API now generates `dist/index/schematic-all-sheets.svg/.png` without modifying generated geometry. `bun run test:schematic-sheets` checks A4 dimensions, frame bounds, exact component membership on each sheet, and coverage of all three sheets in the native stacked preview. All pass. This corrects the report; it does not claim that the unfinished electrical schematic passes review.

## I-013 - C165948 imported shell slots differ from manufacturer layout (BLOCKING)

Affected stage: replacement connector footprint qualification and dependent placement/routing. CLI 0.1.2408, tscircuit 0.0.3016, Bun 1.3.9.

```sh
bunx --no-install tscircuit-cli import --jlcpcb C165948 --download --use-exact-footprint
bunx --no-install tscircuit-cli build checks/usb-c-c165948.circuit.tsx --pcb-png --pcb-svgs --schematic-svgs --3d
```

Import/build both exit 0. Inspect `imports/TYPE_C_31_M_12/TYPE_C_31_M_12.tsx` and `dist/checks/usb-c-c165948/circuit.json`. Rear shell slots are drill 0.7999984 × 1.499997 mm, land 1.1999976 × 1.999996 mm. Front slots are drill 0.7999984 × 1.1999976 mm, land 1.1999976 × 1.7999964 mm. The archived HRO revision A drawing `datasheets/type-c-31-m-12.pdf` recommends rear drill 0.60 × 1.70, land 0.90 × 2.00; front drill 0.60 × 1.10, land 0.90 × 1.70 mm, with ±0.05 mm layout tolerance. These are discrepancies requiring qualification, not proof that arbitrary slot enlargement is safe.

Attempted resolution: used current supported exact import; built isolated TOP-only fixture; visually compared full drawing and enlarged recommended component-side layout to import/generated geometry; reviewed PCB and 3D output. No supported corrected import is available in the checked version. No geometry was manually changed. Await corrected supported library data or manufacturer/assembler approval of the alternate land pattern. Status: unresolved; C165948 remains an unallocated candidate, not a replacement approved for fabrication.

Evidence: `evidence/sourcing-20261025/import-C165948.log`, `c165948-build.log`, `type-c-31-m-12.png`, `type-c-layout-detail.png`, and the separate qualification JSON. The PDF's AutoCAD font collection is not supported by text extraction (`Unknown character collection 'PDFAUTOCAD-Indentity0'`); it was rendered and visually reviewed rather than relying on empty extracted text.

## I-014 - C165948 omits USB power/ground electrical metadata (BLOCKING)

Affected stage: alternative connector pin-specification verification.

```sh
bunx --no-install tscircuit-cli check pin_specification checks/usb-c-c165948.circuit.tsx
```

Exit 0 with three warnings: `source_component_pins_underspecified_warning`, `source_no_power_pin_defined_warning`, `source_no_ground_pin_defined_warning`. The import declares only passive attributes for pin5…pin12; VBUS pins15/16, GND pins13/14 and shell pins1…4 have no attributes. Thus the checker reports underspecification even though the signal pin subset has passive attributes. Pin names were compared to the manufacturer drawing, but names do not repair missing electrical attributes.

Attempt: current exact import and isolated check/build, logs in `evidence/sourcing-20261025/c165948-pins.log`. Definitions were not patched or overridden. Required resolution: corrected supported import and rerun pin review. Existing J1's separate I-007/I-009 defects remain open; trying C165948 did not resolve them.

## I-015 - Known Basic parts missing from tsci search index

Affected stage: candidate stock/availability verification. Reproduce for C1525, C52923, C25744 and C25076:

```sh
bunx --no-install tscircuit-cli search --jlcpcb --json C1525
bunx --no-install tscircuit-cli import --jlcpcb C1525 --download --use-exact-footprint
bunx --no-install tscircuit-cli build checks/basic-passives.circuit.tsx --pcb-png --pcb-svgs --schematic-svgs --schematic-png --3d
```

Each exact-ID search returns `results: []`; supported exact imports all succeed. The separate four-part build exits 0 but emits four `source_component_availability_warning` records and eight missing-trace warnings. The official JLCPCB part pages identify all four as Basic SMT assembly parts. Direct read of `https://jlcsearch.tscircuit.com/api/search?q=C1525&limit=10` also returns an empty components array, identifying a search-index coverage gap rather than an import exception.

Attempted resolution: exact-ID search, official assembler page cross-check, direct search service check, supported imports and isolated build. Stock remains **unknown**, never recorded as zero or invented. Candidate quantities remain unallocated; final stock verification and manufacturer footprint/DC-bias review are pending. No warnings are suppressed. Evidence: `evidence/sourcing-20261025/search-C*.json`, `direct-search-C1525.json`, `import-C*.log`, `basic-passives-build.log`, and `SOURCING-CANDIDATES.csv`.

2026-10-26 status: exact searches remain empty, but the rendered official JLCPCB pages now expose positive stock and available-order quantities for all four Basic parts. These are recorded separately in `evidence/tooling-20261026/basic-stock-browser.json` and the candidate CSV. **Stock verification is resolved for that snapshot; the tsci index/availability-warning defect remains open.** No warning is suppressed, and manufacturer land-pattern/DC-bias qualification is still pending.

## I-016 - Pin checker ignores passive attributes and says none are set

Category: tscircuit diagnostic false positive. Affects accuracy of pin-specification reports; does not resolve the genuine C165948 power/ground omissions.

```sh
bunx --no-install tscircuit-cli check pin_specification checks/usb-c-c165948.circuit.tsx
```

CLI 0.1.2408 / tscircuit 0.0.3016 emits `All pins on J1 are underspecified (no pinAttributes set)`, despite eight imported pins declaring `isPassive: true` and eight generated source_port records containing `is_passive: true`. The checker function `hasAnyPinAttribute` uses PIN_ATTRIBUTE_KEYS that omits `is_passive`. The error text therefore misrepresents existing attributes. The separate no-power and no-ground warnings are legitimate and remain blocking under I-014.

Evidence: `evidence/tooling-20261026/c165948-pins.log`, `pin-checker-source.txt`, `pin-checker-attribute-evidence.json`, and the unchanged C165948 fixture JSON. Attempted resolution: repeat check, inspect generated source ports, trace the installed checker predicate. Required upstream fix: recognize declared attributes in the specification-coverage diagnostic while retaining meaningful power/ground checks. No local dependency or import patch and no warning suppression was used. Status: open.

## I-017 - Family-name search returns unrelated parts without an exact match

Category: tscircuit search relevance/coverage. Reproduce:

```sh
bunx --no-install tscircuit-cli search --jlcpcb --json TPS55340
bunx --no-install tscircuit-cli search --jlcpcb --json LM5122
```

Both commands exit 0. TPS55340 returns LM258DR(UMW), MP2451DT-LF-Z, GBP308S and MAX812SEUS+T. LM5122 returns a flash, optocoupler and diode. None is the requested converter family. These results must not be interpreted as electrical alternatives. Evidence: `evidence/tooling-20261026/search-TPS55340.json` and `search-LM5122.json`.

Attempted resolution: exact manufacturer search on the official JLCPCB website found TPS55340RTER **C169167**. `tsci search --jlcpcb --json C169167` then returns the correct identity, and its supported import succeeds. This resolves identification of that candidate without trusting unrelated results; the family-search problem remains. The candidate's independent metadata defect below still blocks power-stage use.

## I-018 - C169167 forbids connections required by its datasheet (BLOCKING)

Category: imported electrical metadata. Affected stage: TPS55340RTER boost-regulator qualification and all dependent converter work. CLI 0.1.2408 / tscircuit 0.0.3016.

```sh
bunx --no-install tscircuit-cli import --jlcpcb C169167 --download --use-exact-footprint
bunx --no-install tscircuit-cli check pin_specification checks/tps55340-import-defect.circuit.tsx
bunx --no-install tscircuit-cli build checks/tps55340-import-defect.circuit.tsx --pcb-png --pcb-svgs --schematic-svgs --schematic-png --3d
```

The exact import assigns `doNotConnect: true` to QFN pins 10/14. TI **SLVSBD4E table 5-1, page 3**, states that these reserved pins must connect to ground; its figure also recommends AGND connection. The archived/rendered manufacturer table is in `datasheets/tps55340.pdf` and `evidence/tooling-20261026/tps55340-pin-table.png`. Exposed-pad AGND/thermal requirements also remain subject to complete review.

The isolated fixture connects those pins, AGND, PGND pins and the exposed pad to GND using native traces. Pin specification reports 0 warnings; the corrected-selector build exits 0 with one floating VIN warning, **without flagging the contradictory do-not-connect metadata**. Neither command qualifies this part. The chip is unpowered and the fixture is not a converter.

Attempted resolution: supported exact import, visual manufacturer pin-table review and isolated reproduction. The first reproduction used incorrect `.U1.pin10` selector syntax, causing seven authoring errors; that source/log is retained as `tps55340-initial-selector.circuit.txt` and `tps55340-initial-selector-build.log`. Selectors were corrected to documented `.U1 > .pin10` syntax before assessing the library defect. Those initial selector errors were authoring errors, not tscircuit defects. No generated definition was modified or overridden. Proper next action: corrected supported metadata and repeated electrical review. Status: unresolved; C169167 remains an unallocated candidate, not a selected motor supply.

## I-019 - Package identifier preview shows 402 instead of 0402 (OPEN; NOT TSCIRCUIT)

Category: BOM table presentation, bundled artifact-tool runtime 26.1017.22136. During the sourcing refresh, the candidate-table preview showed `402` for package code `0402`. This was caught before publication. The initial reader-coercion hypothesis was tested and **not reproduced**: the minimal CSV probe returns the string `0402`, and raw exported CSV identifiers are intact. Do not attribute data corruption to the CSV parser on that evidence.

Attempted fix: explicitly format the package column as text, including after writing values/styles, and retain the exact identifier from the primary record. Computed styles confirm numberFormat `@`, but the fresh `candidate-stock-v003.png` still displays `402`. Thus the **preview rendering defect remains open**; formatting did not resolve it. The raw exported CSV is checked literally for `0402` for all four Basic candidates, and `scripts/check-sourcing.py` compares those strings to primary records. No apostrophe or invented package code was inserted to mask the renderer behavior.

Evidence: `evidence/tooling-20261026/refresh-sourcing.mjs`, `candidate-identifier-style.ndjson`, `csv-identifier-probe.mjs/.json`, `candidate-stock-v003.png`, and the raw candidate CSV. No electronic definition changed. Raw CSV/source correctness is verified; a claim that the preview itself is corrected would be false. The defect blocks approval of that preview's identifier display, not identification of the actual imported 0402 parts.
