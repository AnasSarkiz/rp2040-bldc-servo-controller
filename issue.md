# Engineering and tooling issues

Date: 2026-10-25. Revision: intake-prototype-0.0.1. This is an unconnected imported-part inspection, not a completed electrical design. Dependent design/fabrication work is gated by the issues below. No generated component definition is manually patched.

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

Logs: `evidence/logs/search-C82317.json`, `search-C131025.json`, `search-W25Q16JV*.json`, `import-C82317.log`. Status: identity/import confirmed; live JLCPCB assembly availability for the requested code unresolved. Required next action: verify the requested code in an actual assembler BOM match or obtain an approved same-MPN sourcing correction.

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

## I-010 - Browser origin access declined

A browser fallback to the official motor product page was rejected by its security gate: origin approval was declined and network egress authority was not granted. No alternate browser, indirect navigation or subsequent download workaround was attempted for that origin. This is separate from earlier HTTP 403 downloads. Exact rear-model inspection remains unavailable.

## I-011 - tscircuit GitHub integration cannot access new repository (BLOCKING)

`registry packages update --package-name AnasSarkiz/rp2040-bldc-servo-controller --enable-public-dist --github-repo AnasSarkiz/rp2040-bldc-servo-controller` returns HTTP 403 `repository_not_accessible`. The package and repository were created publicly and anonymous API reads confirm their visibility. GitHub CLI authentication succeeded as AnasSarkiz. The denied scope belongs to the tscircuit GitHub installation, not the shell sandbox. A separate public-dist update without GitHub linking succeeded. The user must grant that integration access to this repository if linked-source operation is required; no credentials are copied.

## I-012 - Multi-sheet schematic preview/frame inconsistency

Affected stage: schematic visual review. The build's generic schematic preview includes only its first sheet. Explicit rendering with the supported `convertCircuitJsonToSchematicSvg(..., {schematicSheetId})` API produces three separate views. The third (interfaces) view lacks a visible A4 frame although all three Circuit JSON sheets have A4 297x210 metadata. Reproduce with `bun scripts/render-import-sheets.mjs`; inspect `dist/index/schematic-interfaces.png` and the native sheet records. No generated JSON or SVG is hand-patched. Status: unresolved rendering limitation; no complete schematic visual-validation pass is claimed.
