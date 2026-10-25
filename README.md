# RP2040 BLDC servo controller - WIP engineering prototype

**The hardware design is incomplete. Do not fabricate, assemble, or power this revision. FOC is not implemented or tested.**

The current `index.circuit.tsx` is an unconnected inspection fixture for seven JLCPCB imports. It is not a controller schematic. Revision 0.0.2 uses a **42 × 42 mm target canvas, four layers and explicit TOP-only component placement**. Exact motor fit is unverified. No motor mounting holes have been guessed. U6 is shown for import inspection; the eventual AS5047P belongs on an external shaft-mounted encoder assembly.

The sourcing review selects **C131025 for the same W25Q16JVSSIQ flash**. The high-stock **C165948 USB-C candidate is not approved**: its imported shell slots differ from the manufacturer's recommended layout, and power/ground metadata is incomplete. Four Basic passive candidates have supported imports but remain unallocated while stock and manufacturer footprint checks are pending. See [SOURCING.md](SOURCING.md), [candidate list](SOURCING-CANDIDATES.csv) and reproducible defects in [issue.md](issue.md).

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

See [POWER-REVIEW.md](POWER-REVIEW.md) for preliminary calculations and the remaining engineering requirements.

## Schematic, pin mapping and BOM

The three native A4 sheets in the source are explicitly labeled as unconnected import reviews. No functional schematic sheets are complete. See [PIN-REVIEW.md](PIN-REVIEW.md) for verified device pin groups and a proposed GPIO allocation; this is a planning record, not implemented connectivity.

[BOM.csv](BOM.csv) inventories every placed part in the seven-part fixture, with real supplier numbers, MPNs, quantities, packages, stock snapshot/date/provenance, Basic/Extended classification, assembly side and verified import status. **It is not a complete controller assembly BOM.** All functional support circuitry and quantities remain unfinished; unallocated candidates are separate. All seven current parts are Extended, not Promotional/Preferred. C131025 replaces the unindexed C82317 after same-MPN, pinout and copper-geometry review. No invented codes, component definitions or assembly quantities are included. The remaining complete-controller BOM work is listed in [SOURCING.md](SOURCING.md).

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
```

To render every inspection sheet individually, run `bun scripts/render-import-sheets.mjs` after the failed-build JSON has been generated.

Routing remains disabled. An inspection build or successful software command does not validate an unconnected hardware design. Final copper, shorts checks, snapshot acceptance and fabrication exports must wait for the electrical and placement gates.

## Evidence and release status

[VALIDATION.md](VALIDATION.md) records stage status and exact check results. [issue.md](issue.md) records reproduction steps, errors and attempted resolutions. Downloaded manufacturer PDFs are in `datasheets/`; URLs, checksums and download failures are in `evidence/`. Some datasheet and motor CAD downloads remain unavailable; those files are not presented as reviewed or archived.

GitHub and registry destinations are `AnasSarkiz/rp2040-bldc-servo-controller`. A public empty package is not a published verified board. Publication remains blocked until configuration-based datasheet exclusion and a matching valid circuit build can be verified. No fabrication package, physical measurements, firmware performance, working FOC, exact motor fit or hardware-tested status is claimed.

The original import audit was pushed in [commit 6c8db5d](https://github.com/AnasSarkiz/rp2040-bldc-servo-controller/commit/6c8db5d07f03ca8d3ad408babe7f5ef01e341f19). Current source and generated artifacts are published to the same [existing GitHub repository](https://github.com/AnasSarkiz/rp2040-bldc-servo-controller). Revision-specific push/hash verification is recorded in `VALIDATION.md` and `evidence/`. The [public tscircuit package](https://tscircuit.com/AnasSarkiz/rp2040-bldc-servo-controller) exists but has no published version or build; registry publication remains blocked by I-002.

Sourcing revision 0.0.2 is in [commit d7f16d3](https://github.com/AnasSarkiz/rp2040-bldc-servo-controller/commit/d7f16d34411995b04f663e9e61aa56bf0f7f4f9d). Its three Circuit JSON artifacts, both sourcing CSVs and the new manufacturer PDF were fetched anonymously and verified against local SHA-256 hashes. Main build failure and all hardware blockers remain explicit.
