# Component sourcing review — prototype 0.0.3

Updated 2026-10-26, continuing the existing repository from `f06a9e1ee29d00ba463604010612a929ad1e11eb`. The 2026-10-25 search/import evidence is retained. **The main source remains an unconnected inspection fixture. The complete controller assembly BOM does not exist yet.**

## Selection policy

Apply electrical, package, thermal, assembly and import qualification first. Among qualified parts, prefer JLCPCB Basic, then explicitly identified Promotional/Preferred Extended, then adequately stocked Extended parts from established manufacturers. Reuse qualified passive values/packages where the electrical design permits. Stock alone does not prove popularity, long-term availability or electrical suitability. No lifecycle guarantee is inferred from an inventory snapshot.

Do not trade away current feedback, PD negotiation, safe startup, reverse blocking, bus protection or motor performance to reduce assembly setup fees. The [JLCPCB assembly FAQ](https://jlcpcb.com/help/article/pcb-assembly-faqs) distinguishes Basic and Preferred Extended fee treatment; verify the actual assembly service and current offer before ordering. No reviewed core part has a confirmed Promotional/Preferred designation.

## Current imported parts

Stock below is from the **official rendered JLCPCB part listings checked on 2026-10-26**, not reserved inventory. The separate available-order quantity is also retained in BOM.csv: it differs from the total stock figure. All listed identities and SMT assembly support were observed on the actual assembler pages. No Promotional/Preferred designation was shown. Source records are in `evidence/tooling-20261026/core-stock-browser.json`; earlier search-index snapshots remain separate. Repeat the final assembler BOM/DFM match before fabrication.

| Ref | LCSC | MPN | Stock | Available order quantity | Decision |
| --- | --- | --- | ---: | ---: | --- |
| U1 | [C2040](https://jlcpcb.com/partdetail/C2040) | RP2040 | 69,399 | 65,093 | Retain required MCU. Coordinate defect previously resolved through supported re-import. |
| U2 | [C5218861](https://jlcpcb.com/partdetail/C5218861) | DRV8316RRGFR | 2,059 | 1,952 | Retain required motor driver/current feedback. VM metadata defect still blocks integration. |
| U3 | [C2678061](https://jlcpcb.com/partdetail/C2678061) | STUSB4500QTR | 4,862 | 4,682 | Retain required PD sink. Three static PDOs need MCU reconfiguration for four requested voltages. |
| U4 | [C131025](https://jlcpcb.com/partdetail/WinbondElec-W25Q16JVSSIQ/C131025) | W25Q16JVSSIQ | 11,040 | 10,140 | **Selected** instead of C82317. Same manufacturer part and package; supported exact import. |
| U5 | [C2671361](https://jlcpcb.com/partdetail/C2671361) | THVD1450DR | 5,032 | 4,334 | Retain required 3.3 V-compatible RS-485 device. Interface protection remains undesigned. |
| U6 | [C962063](https://jlcpcb.com/partdetail/Ams-AS5047PATSM/C962063) | AS5047P-ATSM | 4,854 | 4,473 | Retain encoder requirement; fixture only, eventual external shaft-mounted assembly. |
| J1 | [C37616412](https://jlcpcb.com/partdetail/C37616412) | USB4215-03-A | 2,036 | 1,859 | Inspection only; malformed fabrication outline and missing electrical metadata remain blocking. |

The earlier short-form web fetch failures for driver/transceiver were resolved by viewing the official pages in the browser. Every core part now has observed SMT assembly support. This confirms a listing, not acceptance of this incomplete board by the assembler. The search index and official website differ, so this revision uses the dated primary listings consistently.

### Flash substitution verification

The 2026-10-25 qualification found an empty C82317 search and an exact C131025 W25Q16JVSSIQ/SOIC-8-208mil match with search-index stock 5,428. The refreshed primary stock for 2026-10-26 is in the table above. The [official JLC listing](https://jlcpcb.com/partdetail/WinbondElec-W25Q16JVSSIQ/C131025) identifies Extended, SMT assembly, Economic and Standard services. No change to flash capacity, voltage or package was made.

Reviewed the archived Winbond W25Q16JV Rev G datasheet, printed pages 4–5, 55–57, 65 and ordering information. PDF pages 6 and 66 were rendered and visually inspected. The device is 16 Mbit (2 MiB), 2.7–3.6 V; use the logic 3.3 V rail, never PD VBUS. Pin 1 /CS, 2 DO/IO1, 3 /WP/IO2, 4 GND, 5 DI/IO0, 6 CLK, 7 /HOLD/IO3, 8 VCC match the import. The SS package is the 208-mil version with 1.27 mm lead pitch. Imported copper pad centers are x ±1.905/±0.635 mm, y ±3.530092 mm, pad size 0.6299962 × 2.2500082 mm. These match the previous C82317 imported copper within numerical rounding. The supported re-import also updates generated TypeScript structure; no imported definition was hand-edited.

This verifies a sourcing replacement, not a working RP2040 boot circuit. Decoupling, QSPI wiring, BOOTSEL circuitry, power-up constraints, firmware flash configuration and actual programming remain pending.

### C165948 USB-C alternative — not approved

[C165948](https://jlcpcb.com/partdetail/C165948), HRO TYPE-C-31-M-12, has observed stock **315,274** and available order quantity **301,401** on 2026-10-26, Extended, no Promotional designation shown. JLCPCB lists SMT assembly with Economic/Standard support. It provides USB 2.0 data and both CC contacts. Its different footprint/envelope still needs layout/access review.

The manufacturer drawing is archived as `datasheets/type-c-31-m-12.pdf`, revision A dated 2020-12-08. Its full page and enlarged component-side recommended layout were visually inspected. It specifies nominal **20 V / 5 A**, 10,000 mating cycles and −30…+80 °C. A 20 V rating does not, by itself, finish review of maximum PD VBUS tolerance and protection transients. It must never contact the boosted 24 V bus. TOP placement is possible, with shell legs extending through the board; bottom solder on shell stakes does not imply bottom component placement.

The exact import succeeds and its isolated build renders PCB/schematic/3D. However:

| Feature | Manufacturer recommended layout (mm) | Imported geometry (mm) |
| --- | --- | --- |
| Rear shell-slot drill | 0.60 × 1.70 | 0.7999984 × 1.499997 |
| Rear shell-slot land | 0.90 × 2.00 | 1.1999976 × 1.999996 |
| Front shell-slot drill | 0.60 × 1.10 | 0.7999984 × 1.1999976 |
| Front shell-slot land | 0.90 × 1.70 | 1.1999976 × 1.7999964 |

These differences exceed the drawing's ±0.05 mm layout tolerance. A different library land pattern might be valid if approved by the manufacturer/assembler, but that evidence is absent. The import also omits VBUS/GND/shell pin electrical attributes and emits three pin-specification warnings. No manual slot/attribute edits were made. See I-013/I-014 in `issue.md`. The separate qualification fixture preserves reproducible evidence without substituting an unverified connector in the board.

## Basic passive candidate library

Supported exact imports acquired C1525 (Samsung 100 nF, 16 V X7R, 0402), C52923 (Samsung 1 µF, 25 V X5R, 0402), C25744 (UNI-ROYAL 10 kΩ 1%, 0402) and C25076 (UNI-ROYAL 100 Ω 1%, 0402). Their official JLCPCB pages explicitly identify **Basic** and Economic/Standard SMT assembly:

- [C1525 / CL05B104KO5NNNC](https://jlcpcb.com/partdetail/C1525)
- [C52923 / CL05A105KA5NQNC](https://jlcpcb.com/partdetail/C52923)
- [C25744 / 0402WGF1002TCE](https://jlcpcb.com/partdetail/C25744)
- [C25076 / 0402WGF1000TCE](https://jlcpcb.com/partdetail/C25076)

All four import successfully and the separate unconnected fixture builds/renders. The search still returns no records on 2026-10-26, but the official rendered pages now establish actual stock and available order quantities:

| LCSC | Stock | Available order quantity | Class |
| --- | ---: | ---: | --- |
| C1525 | 34,924,001 | 27,022,127 | Basic |
| C52923 | 11,305,119 | 9,076,812 | Basic |
| C25744 | 17,625,023 | 12,281,885 | Basic |
| C25076 | 7,054,056 | 5,846,161 | Basic |

Evidence: `evidence/tooling-20261026/basic-stock-browser.json`. The tsci availability warnings are now contradicted by a primary stock listing; they remain visible and are not suppressed. **Stock uncertainty is resolved for this dated snapshot.** Manufacturer land-pattern/datasheet review and capacitor effective capacitance under DC bias remain unfinished. Earlier supplier PDF-fetch problems are retained as history.

The 16 V capacitor is ineligible for raw 20 V PD or 24 V motor supply. The 25 V 0402 capacitor is not approved for a nominal 24 V motor rail with tolerance/transients and DC-bias derating. Resistor dissipation must be checked per use; 100 Ω is not a replacement for RP2040's specified USB series resistance. These are **unallocated candidates**, with quantity 0 meaning no controller allocation. The raw CSV preserves `0402` as text and is checked against the primary records. A separate preview tool still displays `402` despite explicit text formatting; I-019 documents that open presentation defect without treating it as CSV data corruption.

## Boost screening follow-up

The official assembler search identifies [TPS55340RTER / C169167](https://jlcpcb.com/partdetail/TexasInstruments-TPS55340RTER/C169167), WQFN-16-EP(3x3), Extended, stock 18,223 and available order quantity 18,106. The supported exact import succeeds. However, it incorrectly assigns `doNotConnect` to pins 10/14, which TI SLVSBD4E table 5-1 requires grounded. The candidate remains **blocked/unallocated** under I-018; no imported definition was patched. It is not a selected converter.

TPS55288 was screened out using its manufacturer datasheet: its output range ends at 22 V despite the 36 V input headline. TPS55340's 5.25 A limit is internal switch current, not a 5.25 A output rating. The new current/tolerance screening in `POWER-REVIEW.md` does not verify startup or thermal performance.

## Unfinished complete-controller BOM

`BOM.csv` now contains every component in the current main inspection fixture, with exact MPN, supplier number, quantity, footprint, stock provenance/date, tier, assembly side and import status. It is not a complete controller BOM or a purchase list. Fabrication remains blocked until these independently necessary selections and quantities are justified by a reviewed schematic:

| Block | Remaining qualification |
| --- | --- |
| RP2040 support | 12 MHz crystal/load network, all decoupling/core capacitors, reset/BOOTSEL, USB data series/ESD, SWD connector. |
| PD input | Exact qualified connector, CC/VBUS protection, input switch/reverse blocking, current/inrush limit, fuse, VBUS sensing and valid-contract hardware gate. |
| 24 V boost | Controller, FETs, inductor saturation/ripple/thermal limits, current sense, input/output ripple capacitors, compensation, soft-start, disconnect/short protection. LM5122 remains only a candidate. |
| Logic and Hall power | Wide-input regulator that starts at 5 V and tolerates PD transitions; 3.3 V supply; 5 V Hall supply and safe 3.3 V input interface. AP2112K-3.3 C51118 was searched but its 6 V input limit excludes direct PD/24 V use. |
| Motor protection | Independent disable/interlocks, bus voltage window/thermal monitors, fault feedback, current-feedback filters, braking energy sink and reverse-feed prevention. |
| Interfaces/mechanics | U/V/W terminals, Hall/encoder/RS-485 connectors, bus termination/ESD, cable protection, thermal clearances, accessible TOP-only placement, confirmed rear bolt geometry. |

See `POWER-REVIEW.md` for preliminary power calculations and unverified startup/stall/braking demands. No power-stage component is selected solely from stock or price. The 42 × 42 mm target and four layers are enforced on the inspection canvas, with every placed part explicitly TOP. Exact rear fit, standoffs, shaft/magnet clearance, cooling and connector accessibility remain unverified.

## Reproduction

Use pinned CLI 0.1.2408 from this board directory:

```sh
bunx --no-install tscircuit-cli search --jlcpcb --json C131025
bunx --no-install tscircuit-cli import --jlcpcb C131025 --download --use-exact-footprint
bunx --no-install tscircuit-cli import --jlcpcb C165948 --download --use-exact-footprint
bunx --no-install tscircuit-cli check pin_specification checks/usb-c-c165948.circuit.tsx
bunx --no-install tscircuit-cli build checks/usb-c-c165948.circuit.tsx --pcb-png --pcb-svgs --schematic-svgs --3d
bunx --no-install tscircuit-cli build checks/basic-passives.circuit.tsx --pcb-png --pcb-svgs --schematic-svgs --schematic-png --3d
python3 scripts/check-sourcing.py
```

Main fixture checks/build and current limitations are in `VALIDATION.md`. No gate was relaxed and no imported definition was patched to qualify a part.
