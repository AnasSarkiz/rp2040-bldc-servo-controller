# RP2040 BLDC servo controller - WIP engineering prototype

**The hardware design is incomplete. Do not fabricate, assemble, or power this revision. FOC is not implemented or tested.**

The current `index.circuit.tsx` is an unconnected inspection fixture for seven JLCPCB imports. It is not a controller schematic. Revision **0.0.3** retains the **42 × 42 mm target canvas, four layers and TOP-only placement** while extending engineering investigation. Exact motor fit is unverified. No mounting holes have been guessed. U6 is shown for import inspection; the eventual AS5047P belongs on an external shaft-mounted assembly.

The sourcing review selects **C131025 for the same W25Q16JVSSIQ flash**. C165948 remains unapproved because of footprint/electrical metadata defects. Live official JLCPCB stock and available-order quantities are now verified for all seven fixture parts, both connector choices and four Basic passive candidates. Basic candidates remain unallocated pending manufacturer footprint/per-use review. A new TPS55340RTER/C169167 boost screening candidate has an import defect: two manufacturer-grounded pins are incorrectly marked do-not-connect. See [SOURCING.md](SOURCING.md), [candidate list](SOURCING-CANDIDATES.csv) and [issue.md](issue.md).

The earlier missing-A4-frame report was incorrect and has been retracted. All three native frames and component membership are checked. The supported native stacked renderer now provides an [all-sheet preview](dist/index/schematic-all-sheets.svg). This improves inspection; it does not complete the electrical design.

## Requested hardware

- [STEPPERONLINE 42BSA46-24-01 motor](https://www.omc-stepperonline.com/24v-3000rpm-0-08nm-25w-1-80a-42x42x46mm-brushless-dc-motor-42bsa46-24-01): 24 V, 25 W, 1.80 A, 3 phases, 8 poles, Hall sensors.
- RP2040, DRV8316R, STUSB4500, W25Q16JVSSIQ, USB4215-03-A and THVD1450DR. External AS5047P interface and optional daughterboard.
- USB-C PD is the sole primary power source, including motor power. Target contract 20 V / 5 A using a compatible source and electronically marked 5 A cable; negotiate 5/9/15/20 V as applicable.
- Regulated 24 V boost motor bus and separate 3.3 V logic supply. USB programming and communication, SWD, Hall and SPI encoder inputs, current feedback, fault monitoring, hardware disable and RS-485.
- Four copper layers; 42 × 42 mm target; TOP-only assembly; exact rear motor fit using existing rear bolts remains required and unverified.

## Architecture under review - not implemented

USB-C VBUS -> PD-controlled, reverse-blocking, inrush/current-limited input -> 24 V boost -> protected motor bus -> DRV8316R -> U/V/W.

A separate converter must supply logic during initial 5 V attachment and through PD voltage transitions. The Hall interface needs a suitable 5 V rail: the motor drawing identifies Hall red as +5 V, not 3.3 V. Hall signals must not expose RP2040 pins to 5 V. The external encoder can use its documented 3.3 V configuration with local decoupling and suitable cable protection.

The motor enable path must default disabled and require valid PD contract, adequate contracted current, input voltage window, regulated motor voltage, no electrical/thermal fault and explicit MCU enable. PD loss and brownout must disable the driver independently of running application code. Input current must respect the actual negotiated contract, not a nominal 100 W charger label. A 20 V contract alone does not establish permission to draw 5 A.

STUSB4500 stores **three sink PDOs**, including mandatory 5 V. Supporting all four requested voltages requires documented MCU-controlled PDO reconfiguration/renegotiation; it cannot be represented as four static NVM profiles. USB data capability must be configured and checked. A charger need not be a USB data host.

LM5122 is a candidate synchronous boost controller reviewed at the datasheet level, not a selected/imported/finalized converter. A complete boost design still needs exact imported FETs, inductor, current sensing, input/output capacitors, compensation, soft-start, disconnect/protection and verified startup/transient behavior. Ordinary boost shutdown does not guarantee output disconnection. Regenerative braking must have a defined local energy sink; the USB source must not be back-fed. No converter efficiency, thermal rating, stall capability or braking energy rating has been verified.

See [POWER-REVIEW.md](POWER-REVIEW.md) for calculations and remaining requirements. The new tolerance-aware screening shows why a nominal 100 W label cannot guarantee a 24 V / 3 A surge across the assumed board-input range. TPS55288 was screened out because its specified output range ends at 22 V. No boost converter is finalized or startup-qualified.

## Schematic, pin mapping and BOM

The three native A4 sheets in the source are explicitly labeled as unconnected import reviews. No functional schematic sheets are complete. See [PIN-REVIEW.md](PIN-REVIEW.md) for verified device pin groups and a proposed GPIO allocation; this is a planning record, not implemented connectivity.

[BOM.csv](BOM.csv) inventories every placed fixture part with real supplier numbers, MPNs, quantities, packages, primary stock snapshot/date, available-order quantity, tier, assembly side and import status. **It is not a complete controller assembly BOM.** Functional support circuitry and quantities remain unfinished; six unallocated candidates are separate. All seven current parts are Extended; no Promotional designation was shown. The CSV preserves `0402` as a package identifier. C131025 retains the reviewed same-MPN flash choice. No invented codes or component definitions are included. Remaining complete-controller work is listed in [SOURCING.md](SOURCING.md).

## Reproduce inspection

Use Bun 1.3.9 and the pinned dependencies in `bun.lock`. The local CLI is `@tscircuit/cli` 0.1.2408; `tsci --version` prints a tscircuit library version and must not be mistaken for the CLI package version.

```sh
bun install --frozen-lockfile
bun run typecheck
bun run format:check
bunx --no-install tscircuit-cli check netlist index.circuit.tsx
bunx --no-install tscircuit-cli check pin_specification index.circuit.tsx
bunx --no-install tscircuit-cli check source index.circuit.tsx
bunx --no-install tscircuit-cli check schematic-placement index.circuit.tsx
bunx --no-install tscircuit-cli check placement index.circuit.tsx
bunx --no-install tscircuit-cli build index.circuit.tsx --pcb-png --pcb-svgs --schematic-svgs --3d
python3 scripts/check-sourcing.py
bun run render:sheets
bun run test:schematic-sheets
python3 scripts/power-envelope.py
```

Run `bun run render:sheets` after the failed-build JSON is generated to render all individual sheets and the native stacked preview. The sheet test checks presentation coverage, not electrical correctness. `checks/tps55340-import-defect.circuit.tsx` reproduces an import/data problem; it is not a boost converter design.

Routing remains disabled. An inspection build or successful software command does not validate an unconnected hardware design. Final copper, shorts checks, snapshot acceptance and fabrication exports must wait for the electrical and placement gates.

## Evidence and release status

[VALIDATION.md](VALIDATION.md) records stage status and exact check results. [issue.md](issue.md) records reproduction steps, errors and attempted resolutions. Downloaded manufacturer PDFs are in `datasheets/`; URLs, checksums and download failures are in `evidence/`. Some datasheet and motor CAD downloads remain unavailable; those files are not presented as reviewed or archived.

GitHub and registry destinations are `AnasSarkiz/rp2040-bldc-servo-controller`. A public empty package is not a published verified board. Publication remains blocked until configuration-based datasheet exclusion and a matching valid circuit build can be verified. No fabrication package, physical measurements, firmware performance, working FOC, exact motor fit or hardware-tested status is claimed.

The original import audit was pushed in [commit 6c8db5d](https://github.com/AnasSarkiz/rp2040-bldc-servo-controller/commit/6c8db5d07f03ca8d3ad408babe7f5ef01e341f19). Current source and generated artifacts are published to the same [existing GitHub repository](https://github.com/AnasSarkiz/rp2040-bldc-servo-controller). Revision-specific push/hash verification is recorded in `VALIDATION.md` and `evidence/`. The [public tscircuit package](https://tscircuit.com/AnasSarkiz/rp2040-bldc-servo-controller) exists but has no published version or build; registry publication remains blocked by I-002.

Sourcing revision 0.0.2 is in [commit d7f16d3](https://github.com/AnasSarkiz/rp2040-bldc-servo-controller/commit/d7f16d34411995b04f663e9e61aa56bf0f7f4f9d). Its three Circuit JSON artifacts, both sourcing CSVs and the new manufacturer PDF were fetched anonymously and verified against local SHA-256 hashes. Main build failure and all hardware blockers remain explicit.
