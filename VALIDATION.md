# Validation record

## Revision and scope

- Current review date: 2026-10-27. Earlier 2026-10-25/26 records remain historical evidence.
- Board revision: **toolchain-review-prototype-0.0.5**, untested and electrically incomplete. Continues this directory/repository from `9ed1b4659f8c4da54e902c435cde6beb1dec5e5e`. Electrical connectivity is unchanged; the encoder now uses a supported generated remote-model import. The boost import remains an isolated defect reproduction, not an integrated converter.
- Completed work: dependency update, repeated software/import checks, publication exclusion verification, supported model-asset publication change, and source-prototype upload/hash verification. Earlier primary sourcing, sheet, defect and power-screening records remain historical evidence. Earlier same-MPN flash review and 42 × 42 mm/four-layer/TOP requirements remain applicable. This is not a completed controller implementation.
- Workspace: `boards/rp2040-bldc-servo-controller--20261025-01a1742f/`. New task; no source board or source-board revision.
- Entry: `index.circuit.tsx`, an explicitly unconnected import-inspection fixture. No finished controller source exists.
- Exact source/dependency/import checksums: `evidence/source-checksums.json`. Build hash/counts: `evidence/build-summary.json`; current commands/logs: `evidence/update-20261027/v0.0.5/check-results.json`. Historical logs remain under their original dated directories. Git commit/publication verification follows below.
- Bun 1.3.9; TypeScript 5.9.3; tscircuit 0.0.3028; local CLI package 0.1.2414; Biome 2.3.0. Initial global CLI package was 0.1.2237. All dependencies are pinned and the lockfile is retained. `bun install --frozen-lockfile` completed after the dependency update; upstream peer-declaration warnings are documented in I-020.

## Stage gates

| Stage | Status | Evidence / reason |
| --- | --- | --- |
| 1. Confirm requirements | **blocked** | USB-C-only 24 V boost and exact rear-mount requirements recorded. Official motor STEP/PDF cannot be acquired/visually inspected; rear geometry cannot be inferred from extracted front/body dimensions. Startup/braking and thermal operating envelope remain undefined. |
| 2. Schematic and BOM review | **blocked** | Dated primary stock and assembly listings verified for all fixture parts and candidates; Basic stock uncertainty resolved. C165948/C37616412/C5218861 import defects remain. C169167 incorrectly forbids manufacturer-required ground connections (I-018). Full controller BOM, power circuit/interlocks and passive footprint/per-use qualification remain unfinished. |
| 3. Placement before routing | **blocked** | Software inspection reports no fixture placement violations, and zero routing geometry is generated. This does not verify controller placement, rear fit, connector access, current paths, thermal design or mounting clearance. Stages 1/2 have not passed. |
| 4. Route and validate copper | **not started** | Routing disabled in both source and build config. No source traces, PCB traces or vias. |
| 5. Automated and visual checks | **not started** | Only import-fixture diagnostics/previews were run. The mandatory routed-board checks, shorts analysis and snapshot acceptance cannot start before earlier gates pass. |
| 6. Prototype fabrication approval | **not started** | No validated Gerber/drill/BOM/PnP package. Not ready to order. |
| 7. Physical prototype testing | **not started** | No assembled hardware or physical evidence. |
| 8. Store release | **blocked** | Incomplete hardware; registry upload status is recorded in the current update section below. No working FOC, hardware-tested or fabrication-ready claim. |

## Requirements and manufacturing constraints

Function: position/velocity servo intended for a 3D-printed robotic arm using the STEPPERONLINE 42BSA46-24-01. Motor source drawing A3122 text identifies 24 V, 25 W, 1.80 A, three phases, eight poles, 3000 rpm, 2.74 ohm/phase, 1.35 mH/phase and +5 V Hall supply. The rated-current definition must be confirmed before establishing a phase-current limit. No allowed continuous/peak torque, arm inertia, braking energy, acceleration duty, ambient/enclosure temperature or tested current limit is established.

USB-C PD is the sole input. Support 5/9/15/20 V negotiation; target 20 V / 5 A. Three static sink PDOs in STUSB4500 require MCU-managed reconfiguration for four voltage choices. A compatible 5 A cable/source contract is required before full current is requested. Boost to regulated 24 V; separate logic regulation must boot from the initial 5 V attach state. Hardware disable must gate all motor switching until a valid adequate contract and safe motor supply exist. Input/output overcurrent, over/undervoltage, thermal, short, reverse-feed and regenerative-energy handling are required but unimplemented. See POWER-REVIEW.md.

Interfaces: USB 2.0 device programming/communication, BOOTSEL/reset, SWD, RS-485, U/V/W, 5 V Hall interface with protected 3.3 V sensing, SPI external AS5047P encoder, three current-feedback channels, bus measurement and hardware disable/fault monitoring. PIN-REVIEW.md is a proposed assignment, not wiring.

Four layers and TOP-only component assembly are required. Revision 0.0.2 enforces a 42 × 42 mm target canvas and explicit TOP placement; generated geometry confirms all seven components and 165 SMT pads are TOP. Connector shell stakes are plated through holes, not bottom component placement. Exact rear footprint, screw pattern, engagement depth, shaft/bearing/cable clearance and standoff height remain unverified. The canvas has no motor mounting holes and no mechanical-fit approval.

Target manufacturer: JLCPCB. The [official capabilities](https://jlcpcb.com/capabilities/pcb-capabilities/) and [capabilities table](https://jlcpcb.com/capabilities/Capabilities) were checked on 2026-10-25. Published multilayer 1 oz minimum track/space is 0.09/0.09 mm, recommended conventional through-via drilling is at least 0.2 mm, and routed-edge copper clearance is at least 0.2 mm. **These minima are not chosen power-design rules.** Proposed conservative starting rules for later review: 0.15 mm signal width/clearance, 0.30 mm through drills with 0.70 mm pads, and 0.30 mm edge clearance; motor/boost power copper needs separate measured sizing. Use through vias only unless a separately supported process is selected. Target 1.6 mm FR4, 1 oz outer copper and a manufacturer-confirmed four-layer stackup with continuous ground reference; dielectric dimensions and USB impedance cannot be finalized without the actual stackup. None of these proposed rules has been applied/validated on a routed controller. The fixture retains tool defaults and has no traces/vias.

## Historical sourcing revision checks (0.0.2)

All commands ran from this task's directory with pinned CLI 0.1.2408. No imported definition was manually edited; C131025 and five candidate definitions were generated with the supported JLCPCB exact-import workflow. Raw stock responses, logs, candidate manufacturer drawing and comparisons are preserved in `evidence/sourcing-20261025/` and `SOURCING.md`.

| Check | Actual result | Meaning |
| --- | --- | --- |
| Biome authored entry/qualification fixtures | exit 0 | Imported definitions excluded from formatting/mutation. |
| TypeScript | exit 0 | Current source and all imports typecheck. |
| Main netlist | exit 0, all 169 ports NOT_CONNECTED | Inspection only; no connectivity approval. |
| Main pin specification | exit 0, 4 warnings | Existing power/ground metadata defects unresolved. |
| Main source / schematic-placement / placement | each exit 0 | No reported violations in the seven-part fixture; no full controller or motor-fit validation. |
| Main build with PCB, schematic and 3D outputs | **exit 1, 13 required-pin errors** | Existing RP2040 power/test pins float; no suppressed checks. Previous C82317 availability warning is absent after C131025 substitution. |
| Isolated C165948 pin check | exit 0, 3 warnings | Missing power/ground attributes; not accepted for integration. |
| Isolated C165948 build | exit 0 with metadata/convention warnings | PCB/schematic/3D render; manufacturer slot discrepancies remain blocking despite build success. |
| Isolated four Basic passive build | exit 0, 4 availability + 8 missing-trace warnings | Import/render evidence only; no functional circuit or stock qualification. |
| BOM/generated-geometry consistency | see `evidence/sourcing-20261025/bom-consistency.json` | Checks exact supplier identities, quantities, stock snapshots, TOP pads/components, 42 mm outline, four layers, A4 sheets, zero routing and no candidate allocations. Does not qualify hardware. |

The complete controller BOM requested by the user remains **blocked/incomplete**. `BOM.csv` contains all seven currently placed fixture parts with the requested sourcing fields; it must not be sent to an assembler as a controller purchase list. `SOURCING-CANDIDATES.csv` is separate, with no allocated controller quantities. Unselected clock/regulation/boost/protection/connectors/support circuitry is listed in `SOURCING.md` without guessed codes or quantities. No motor-control or safety IC was replaced solely for availability.

Current source/build and affected previews were regenerated. All stage gates remain as listed above.

## Historical intake checks (0.0.1)

All board commands ran in this task directory. Local CLI commands use `bunx --no-install tscircuit-cli`, avoiding the older global CLI. Complete logs are in `evidence/logs/`.

| Check | Result | Interpretation |
| --- | --- | --- |
| Format | exit 0 | Authored entry source formatted; imported component definitions are not edited by the formatter. |
| TypeScript | exit 0 | Software typecheck only. |
| `check netlist index.circuit.tsx` | exit 0 | Enumerates NOT_CONNECTED for all 169 ports; **not a connectivity pass**. |
| `check pin_specification index.circuit.tsx` | exit 0; 4 warnings | Missing imported power/ground metadata; unresolved, not accepted for a controller. |
| `check source index.circuit.tsx` | exit 0; 0 diagnostics | Partial source check; does not validate full-build required-pin connectivity. |
| `check schematic-placement index.circuit.tsx` | exit 0; no issues after layout adjustment | Earlier U2 label collision and excess width corrected using supported layout props and separate A4 sheets. |
| `check placement index.circuit.tsx` | exit 0; 0 placement diagnostics | Only the seven-part inspection placement. Does not validate mechanical fit or a complete design. |
| `build index.circuit.tsx --pcb-png --pcb-svgs --schematic-svgs --schematic-png --3d` | **exit 1** | 13 required RP2040 pins floating in the intentionally unconnected fixture; incomplete metadata and C82317 sourcing warnings. No suppression flags. |

Historical full-build log: `evidence/logs/final-build-import-audit.log`. Current 0.0.2 log is `evidence/sourcing-20261025/controller-build.log`. Earlier initial/re-import diagnostics remain as evidence. The RP2040 invalid scientific-notation coordinate was resolved through supported CLI 0.1.2408 exact re-import, without manual component edits. Current JSON has no invalid-coordinate error.

Current 0.0.2 Circuit JSON retains seven source components, 169 source ports, three native A4 sheet records, four PCB layers, 13 required-pin errors, zero source traces, zero PCB traces and zero vias. It is a failed-build inspection artifact, not a validated controller. Current hash is in `evidence/build-summary.json`.

## Visual review

Actually inspected for current 0.0.2: the regenerated PCB and 3D PNGs and individually rendered MCU, power and interfaces schematic PNGs. They show only unconnected imported components. The diagonal fabrication artifact inside the retained USB connector remains visible and is not a copper trace. The 3D preview is a rendering, not a photo or fit check. Also inspected the isolated C165948 PCB/schematic/3D and Basic-passive PCB/schematic/3D outputs, the flash pinout/package datasheet pages, the HRO full drawing and layout enlargement, and BOM identity/stock table previews. No land-pattern or missing-stock warning is accepted as passed by these renderings.

Correction on 2026-10-26: the earlier claim that power/interfaces frames were missing was incorrect. All three actual SVGs contain native outer/inner frames inside the viewport, and PNG border pixels were present. Fresh full-sheet and stacked views were visually inspected. The generic first-sheet preview is documented single-sheet behavior, not a confirmed defect. Native `convertCircuitJsonToStackedSchematicSheetsSvg` now renders all three views without modifying JSON/SVG internals. Structural tests verify A4 sizes, frame bounds and exact component coverage. I-012 is closed as a corrected report; electrical schematic validation remains unfinished.

Datasheets archived with signature/checksum verification: RP2040 and hardware guide; DRV8316/EVM; THVD1450; W25Q16JV; USB4215/HRO drawings; LM5122/EVM; now TPS55340 and TPS55288 screening datasheets. See `evidence/datasheets-manifest.json`. New manufacturer pin/current/output-limit tables were rendered and inspected; complete converter design review is not claimed. ST document downloads timed out again on 2026-10-26 and remain unavailable locally, as do motor/encoder PDFs. The AS5047P pin table was previously read through the manufacturer web PDF, but its local empty response was rejected.

## Warnings and blocked work

No electrical, sourcing, footprint or fabrication warning is accepted as a completed board validation. Fixture-specific missing connections remain visible because no functional circuit has been implemented. Do not suppress imported metadata warnings, replace parts with generic definitions, patch imports or route around the gates. See issue.md for exact part IDs, reproduction, attempts and current status.

No routed shorts check, routed snapshots, copper-layer/current/clearance measurements, thermal measurements, Gerbers/drill/BOM/PnP review, assembler feedback or physical tests have been performed. Fabrication and FOC remain unqualified.

## Remote publication

- Public GitHub repository created: https://github.com/AnasSarkiz/rp2040-bldc-servo-controller . Anonymous REST metadata confirms `private: false`, `visibility: public`.
- Public registry package created: https://tscircuit.com/AnasSarkiz/rp2040-bldc-servo-controller . Anonymous registry API confirms `is_public: true`, `is_private: false`, `is_unlisted: false`, but `latest_version: null` and no release/build. Public destination creation is not a published board version.
- Registry linking to GitHub failed with `repository_not_accessible`: the tscircuit GitHub installation cannot access the new repository. A separate public-dist update was attempted without the link. Do not confuse this integration scope failure with GitHub CLI authentication; AnasSarkiz CLI authentication and repository creation succeeded.
- Registry upload is blocked by I-002: the current supported CLI push ignores configured publication exclusions. `push --help` confirms `--include-dist`; this is the required flag when publication becomes possible. No excluded datasheets are uploaded to work around the defect.
- No registry build/Circuit JSON matching verification can pass without a release. Therefore this step is **not fully published**. GitHub source push and anonymous Circuit JSON hash verification are recorded in `evidence/publication-verification.json` when completed.

### Verified source push

The source/import inspection commit [`6c8db5d`](https://github.com/AnasSarkiz/rp2040-bldc-servo-controller/commit/6c8db5d07f03ca8d3ad408babe7f5ef01e341f19) was pushed to `main`. Anonymous raw-file download of `dist/index/circuit.json` succeeded and its SHA-256 exactly matches the local failed-build inspection artifact: `1825e66a9be7a31f62109791c3794aa5ce658ed419b67ca93f55a8e5adfc1fae`.

The public registry package is accessible anonymously and `public_dist_enabled` is true, but it still has no version, release or build. No registry Circuit JSON match can be verified. GitHub source update succeeded; registry board publication did not. This remains a blocking partial publication.

The historical verification-record commit `e15d14c` changed documentation/evidence only. Revision 0.0.2 changes the flash import and canvas/side constraints, and therefore rebuilds and repeats affected fixture checks; no previous output is represented as current validation. It does not advance an electrical/mechanical stage gate.

### Sourcing step 0.0.2 — current GitHub evidence

Completed the sourcing-review implementation step, starting from `e15d14c`. The current failed-build inspection Circuit JSON SHA-256 is `fa4b103bddbaf8ba09c41bc1e5e230790597fe0580332f47bf6e6c325d9c850c`. All three fixture Circuit JSON hashes are in `evidence/sourcing-20261025/build-artifact-checksums.json`. Flash copper comparison against the baseline confirms all eight pads match within 1e-9 mm. The BOM consistency command exits 0 while explicitly reporting 13 unresolved hardware pin errors and `fabrication_ready: false`.

The lockfile's existing tscircuit/TypeScript ranges were synchronized to the already configured exact versions through `bun install --lockfile-only`; dependency versions did not change. A subsequent frozen install, formatting and TypeScript check all exit 0. No routed-board tests or fabrication exports were attempted because earlier gates remain blocked.

Anonymous registry read on 2026-10-25 reconfirms public/unlisted=false and no release/version. Current CLI `push --help` reconfirms `--include-dist`; it supplies no publication exclusion flag. I-002 still blocks a conforming upload, so no excluded datasheets or qualification evidence were uploaded. GitHub push and anonymous hash verification for this step are recorded after the source commit below.

Sourcing implementation commit [`d7f16d3`](https://github.com/AnasSarkiz/rp2040-bldc-servo-controller/commit/d7f16d34411995b04f663e9e61aa56bf0f7f4f9d) is pushed to the existing public repository's `main` branch. Anonymous GitHub REST metadata reconfirms public visibility. Anonymous downloads verified byte-for-byte SHA-256 matches for **all three generated Circuit JSON files, BOM.csv, SOURCING-CANDIDATES.csv and the new HRO manufacturer PDF**. The main JSON hash matches the failed-build inspection artifact above. Detailed URLs/hashes are in `evidence/publication-verification.json` and `evidence/sourcing-20261025/publication-verification.json`.

GitHub update succeeded. Registry board release remains **blocked and unpublished**: the public package still has `latest_version: null`, no release, and no comparable Circuit JSON. This step is not fully published to both destinations and is not a completed controller. The following verification-record commit changes documentation/evidence only; source, imports, BOM, pinned dependencies and generated geometry remain identical to the linked sourcing implementation commit, so the recorded checks remain applicable.

## Engineering follow-up 0.0.3 — 2026-10-26

Starting source commit: `f06a9e1ee29d00ba463604010612a929ad1e11eb`. Pinned tool versions remain Bun 1.3.9, CLI 0.1.2408, tscircuit 0.0.3016, TypeScript 5.9.3 and Biome 2.3.0; native SVG renderer is circuit-to-svg 0.0.453. Official CLI 0.1.2409 was source-inspected with npm tarball integrity verification, not installed or represented as tested: its publication-ignore defect remains.

Completed step: primary inventory and available-order verification for seven fixture parts and six unallocated candidates, a native all-sheet preview and coverage check, three new tscircuit issue reproductions (I-016/I-017/I-018), correction of I-012, and reproducible current/tolerance power screening. I-019 documents an independent preview-formatting problem; raw CSV package identifiers remain correct. No main electrical trace, imported component patch or routing was added.

| Check actually run | Result | Limit |
| --- | --- | --- |
| Configured format check and TypeScript | exit 0 | Includes new qualification fixture; no imported definition was formatted or patched. |
| Main netlist | exit 0; 169 NOT_CONNECTED ports | The board remains an unconnected fixture. |
| Main pin specification | exit 0; 4 warnings | Existing driver/USB metadata omissions remain. |
| Main source, schematic-placement and placement | each exit 0 | Inspection placement only; no full mechanical/electrical approval. |
| Main build with PCB/schematic/3D | **exit 1; 13 required RP2040 pin errors** | Unfinished circuitry, not a newly discovered tscircuit defect. |
| Native individual/stacked schematic rendering and sheet test | exit 0; 3 framed A4 sheets, component counts 2/3/2 | All components appear on their assigned sheets; electrical review remains incomplete. |
| BOM consistency | exit 0; 7 main rows, 6 unallocated candidates | Checks primary identities, stock/order quantities, dates, literal 0402 package strings, TOP side, 42 × 42 mm, four layers and routing disabled. |
| C165948 pin specification | exit 0; 3 warnings | One misleading underspecification diagnostic plus genuine missing power/ground roles. |
| C169167 pin specification / corrected-selector build | each exit 0; build warns VIN floats | Import incorrectly forbids ground connections required by TI. Build success does not resolve this mismatch; not a converter design. |
| Analytical power-envelope calculation | exit 0 | Screening assumptions only; 24 V / 3 A needs at least 19.181 V board input under the stated limiter/efficiency assumptions. Startup/thermal limits remain unverified. |

Detailed commands/results: `evidence/tooling-20261026/check-results.json`. Manufacturer/source evidence, re-import logs, API metadata responses, component data, power inputs and actual generated artifact hashes are in the same directory. The initial TPS reproduction's selector authoring errors are retained separately and were corrected before interpreting library behavior; no generated-definition workaround was used.

Actually inspected: native stacked preview with all three frames; full power-sheet frame; updated BOM/candidate table previews; TPS55340 pin/electrical and TPS55288 output-limit manufacturer pages; isolated TPS55340 schematic, PCB and 3D outputs. The candidate table renderer still displays `402` while raw CSV correctly contains `0402`, even with text formatting; I-019 remains open for that preview. Main PCB/3D geometry is unchanged and is retained as an unconnected inspection output, not a fabricated board or fit test.

Current main Circuit JSON SHA-256: `5b987792556d4fb29b76fbe63b84b58be4a1b9875508b57bffbb759ddc2240c8`. All four fixture JSON hashes are in `evidence/tooling-20261026/build-artifact-checksums.json`. Corrected A4 presentation and verified inventory clear those specific uncertainties; **no electrical, motor-power, mechanical-fit, routing, fabrication or physical-test stage advances**. PD/boost interlocks, complete BOM, exact motor fit and FOC remain unqualified. GitHub publication verification for this step follows after its source commit; registry upload remains blocked by I-002.

### Engineering step 0.0.3 — verified GitHub push

Implementation commit [`c50d7c5`](https://github.com/AnasSarkiz/rp2040-bldc-servo-controller/commit/c50d7c546784ac6c886ce0e4f897dd171cc6e504) is pushed to the existing public repository's `main` branch. Anonymous GitHub REST metadata reconfirms public visibility. Anonymous downloads verified exact SHA-256 matches for **all four inspection Circuit JSON artifacts, both sourcing CSVs, the two new TI PDFs, issue.md and the native all-sheet SVG** (10 files). The current main JSON hash remains `5b987792556d4fb29b76fbe63b84b58be4a1b9875508b57bffbb759ddc2240c8`. Detailed URLs, hashes and the verification date are in `evidence/tooling-20261026/publication-verification.json`; `evidence/publication-verification.json` now points to this step. A Python urllib TLS-handshake timeout was resolved by repeating the same anonymous downloads with curl and normal certificate validation. That transport failure is distinct from the tscircuit defects.

GitHub source/artifact publication succeeded. The [public tscircuit destination](https://tscircuit.com/AnasSarkiz/rp2040-bldc-servo-controller) still has no published version or build; a registry Circuit JSON comparison is unavailable. I-002 remains blocking even in source-reviewed CLI 0.1.2409, so a conforming `push --include-dist` cannot yet exclude the requested datasheets/evidence. No excluded files were uploaded. I-011 records the separate integration-access failure. **This is partial publication, not a fully published or validated controller.**

This following verification-record commit changes documentation/evidence only. Circuit sources, imports, BOMs, pinned dependencies and generated inspection artifacts remain identical to the linked implementation commit, so its recorded checks continue to apply. No rebuild or advance of the electrical, placement, routing or fabrication gate is implied.

## Toolchain update 0.0.4 — 2026-10-27

Starting commit: `9ed1b4659f8c4da54e902c435cde6beb1dec5e5e`. Updated exact dependencies to **tscircuit 0.0.3028 / CLI 0.1.2414** from official npm latest metadata; Bun remains 1.3.9, TypeScript 5.9.3, Biome 2.3.0 and circuit-to-svg 0.0.453. Frozen install exits 0. I-020 documents the incompatible upstream peer declarations instead of suppressing them. Sources/imports/BOMs are unchanged; `scripts/check-sourcing.py` now reports the actual package version and writes a current evidence record instead of overwriting the historical 2026-10-26 report. No assertion is weakened.

The installed CLI source confirms I-002's exclusion fix. Configuration uses supported wildcard patterns and excludes datasheets, evidence, mechanical assets, unused candidate imports and isolated fixture builds; main `dist/index/circuit.json` and all main previews remain included. This is a publication-content change, not an electrical/routing change. Excluded material remains on GitHub. Actual remote upload and anonymous file/hash verification follow below.

| Check run with updated dependencies | Result | Meaning |
| --- | --- | --- |
| Frozen install, configured formatting, TypeScript | exit 0 | I-020 peer compatibility concern remains recorded. |
| Netlist | exit 0; 169 NOT_CONNECTED | No functional controller connectivity. |
| Pin specification | exit 0; 4 warnings | Driver/USB metadata remains blocking. |
| Source, schematic-placement, placement | each exit 0 | Seven-part unconnected inspection placement only. |
| Main build with PCB/schematic/3D previews | **exit 1; 13 required-pin errors** | Incomplete RP2040 circuitry, no suppressed checks. |
| Native rendering / A4 coverage / BOM consistency | each exit 0 | Three framed sheets; seven fixture parts, six unallocated candidates; stock evidence remains dated 2026-10-26. |
| Three isolated fixture builds | each exit 0 with warnings | C165948, four Basic passives and TPS55340 are import inspections, not qualified circuits. |
| Four supported exact re-imports | each exit 0 | Metadata/USB geometry defects remain; main definitions were not replaced. |
| Generated geometry comparison | identical | All PCB, CAD and schematic geometry records match the preceding revision; warnings/metadata differ. |

Commands, exit codes, logs, dependency metadata and comparisons are in `evidence/update-20261027/`. All four Circuit JSON artifacts were freshly generated under the updated dependencies; hashes are in `build-artifact-checksums.json`. Current main JSON SHA-256: `414f0a076b385b3b880e753ed36642822cad919b3a1ca03222a2b10b6f97a795`.

Actually inspected the regenerated native three-sheet schematic preview, PCB PNG and 3D PNG. Native frames remain visible, all seven unconnected parts remain, and the malformed connector fabrication diagonal remains visible. These are renders, not physical test evidence. No routing, routed shorts/snapshot acceptance, fabrication export or hardware test was performed because earlier gates remain blocked. No fabrication readiness, mechanical fit or FOC claim is made.

### 0.0.4 publication result and supported 0.0.5 follow-up

[Implementation commit 756d68f](https://github.com/AnasSarkiz/rp2040-bldc-servo-controller/commit/756d68f863bec3e5d169955b3be269830db17914) is pushed publicly. Anonymous GitHub checks verify all four Circuit JSON artifacts, package manifest/lockfile/configuration and issue.md against local hashes. CLI 0.1.2414's `push --include-dist` exits 1: aggregate upload and the 4,413,008-byte encoder STEP asset are rejected with HTTP 413. The other **49 files** were anonymously downloaded and byte-verified. No excluded datasheet/evidence/mechanical/candidate-fixture content was uploaded, so I-002 is closed for the verified installed CLI/configuration. Main Circuit JSON matches GitHub and local output. Registry version **0.0.4** exists publicly, release `7c42fc54-f5e2-4142-b98d-e33ebf8b1479`, but `ready_to_build` is false and the required STEP asset is absent. **0.0.4 is a partial, incomplete release**, not successful publication. See I-021 and `evidence/update-20261027/publication-verification.json`.

Version **0.0.5** adopts the supported exact C962063 import without optional local-model download. The component is generated into `imports/AS5047P_ATSM.tsx`; no generated definition was edited. Both official CDN assets were downloaded anonymously and match the retained original OBJ/STEP hashes. The source comparison proves electrical pin, pad and courtyard definitions unchanged and records one notch silkscreen path's tessellation change. The old, unused downloaded folder remains on GitHub and is excluded from the package. The model-CDN dependency is explicit. This change does not qualify the external encoder interface or motor mounting.

Checks affected by the main import/path change are repeated under `evidence/update-20261027/v0.0.5/`. The three auxiliary fixture builds from 0.0.4 remain applicable to their unchanged sources and pinned dependencies; they are not relabeled as regenerated 0.0.5 fixtures. The current main Circuit JSON is rebuilt. The next publication uses documented `--include-dist --no-compress`; no model truncation, generic substitute, component patch, hidden-folder staging or check suppression is used. Final upload/anonymous verification follows below.

Current 0.0.5 revalidation: formatting, TypeScript, all five pre-routing commands, native sheet coverage and BOM consistency exit 0; netlist still has 169 NOT_CONNECTED ports and pin specification still has four warnings. Main build with PCB/schematic/3D outputs exits **1 with the same 13 required-pin errors**. Electrical component/port and PCB board/component/pad/plated-hole records exactly match 0.0.4. Changes are limited to CAD model URLs, the recorded notch silkscreen tessellation, generated availability-warning identifiers and source metadata. Main SHA-256: `cc15ae1a9df91ee6166bdce6f1be7a97a6861d04c642426478ad55ade1f6ee3f`. The regenerated PCB and 3D PNGs were visually inspected; the encoder model is present, no copper has been routed, and the existing connector fabrication defect remains visible. Native schematic coverage remains three A4 sheets. No hardware validation gate advances.

### 0.0.5 verified source publication — 2026-10-27

[Implementation commit 8aee0e7](https://github.com/AnasSarkiz/rp2040-bldc-servo-controller/commit/8aee0e7cde931dec66a5227e436b6aa85dd65043) is pushed to the existing public GitHub repository. Anonymous GitHub downloads verify main Circuit JSON, source, generated encoder import, package/configuration, README, issue log and lockfile byte-for-byte. `push --include-dist --no-compress` exits **0** and publishes **0.0.5** to the [existing public tscircuit package](https://tscircuit.com/AnasSarkiz/rp2040-bldc-servo-controller), release **be8809ef-eb90-4ef8-a701-b4940d870421**. All **48 uploaded files** were anonymously downloaded and matched local SHA-256 hashes. The registry's main Circuit JSON is identical to the GitHub/local failed-build inspection artifact (`cc15ae1a9df91ee6166bdce6f1be7a97a6861d04c642426478ad55ade1f6ee3f`). Source, README and package/configuration contents also match the linked commit.

Anonymous package metadata confirms public=true, private=false, unlisted=false and latest_version=0.0.5. File enumeration confirms no excluded datasheets, evidence, mechanical files, diagnostic fixtures or unused model/import folders were uploaded. The active encoder import refers to the official model CDN; both assets were independently verified against the originals retained on GitHub. No required asset is missing from this source-package configuration. I-002's fix and the board-level resolution of I-021 are verified; the upstream size-limit behavior remains documented.

**Both source destinations are updated successfully for this inspection prototype. This is not a passed hardware or cloud build.** The registry accepts the complete release and reports `ready_to_build: true`; its final observed Circuit JSON cloud-build status is **pending**, with no start/completion timestamp or cloud-build success. The local build still fails 13 required pins. Existing import defects, incomplete BOM/power/protection, exact mechanical fit, routing, fabrication and physical tests remain unresolved. Stage gates above do not advance merely because a source package is public.

Verification records: `evidence/update-20261027/v0.0.5/publication-verification.json` and the current `evidence/publication-verification.json`. The following verification-record commit changes only excluded documentation/evidence; published circuit sources, dependencies, configuration, README, BOM and generated preview/JSON bytes remain identical to implementation commit 8aee0e7. No stale generated artifact or post-upload imported-definition change is introduced.
