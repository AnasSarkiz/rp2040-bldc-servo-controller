# Preliminary power review - no finalized converter

Revision: intake-prototype-0.0.1, 2026-10-25. These are screening calculations, not circuit or hardware verification.

## Source evidence

- [Motor drawing A3122](https://files.omc-stepperonline.com/42BSA46-24-01.pdf): 24 V, rated 1.80 A, 25 W, 3000 rpm, 0.08 Nm, 2.74 ohm/phase +/-10%, 1.35 mH/phase +/-20%, 8 poles, Hall +5 V. Web-extracted text is available; PDF visual review and STEP access remain blocked.
- [STUSB4500 DS12499 Rev 8](https://www.st.com/resource/en/datasheet/stusb4500.pdf): up to 20 V / 5 A, three sink PDOs; not a 24 V power source.
- [ST UM2650 Rev 3](https://www.st.com/resource/en/user_manual/um2650-the-stusb4500-software-programing-guide-stmicroelectronics.pdf): contract/RDO and source-capability handling, PDO updates and renegotiation.
- [DRV8316 SLVSF16B](https://www.ti.com/lit/ds/symlink/drv8316.pdf) and [DRV8316xEVM SLVUBZ9B](https://www.ti.com/lit/ug/slvubz9b/slvubz9b.pdf): integrated FETs and current sensing; 4.5-35 V operating range, 40 V absolute maximum. The 8 A peak headline is not a guaranteed continuous-current board rating.
- [LM5122EVM SNVU197](https://www.ti.com/lit/ug/snvu197/snvu197.pdf): manufacturer reference design for 9-20 V input and 24 V / 4.5 A output; its reported efficiency and load-step behavior apply to that EVM, not this board. It needs more than 100 W input at full output, so it cannot simply be copied without contract-aware derating.
- [LM5122 SNVS954H](https://www.ti.com/lit/ds/symlink/lm5122.pdf): candidate synchronous boost controller, external power switches, programmable peak current limit, soft-start and hiccup protection. This is not yet a qualified design.

## Power envelopes

25 W is not a safe assumption for electrical supply demand: at the stated torque and speed, mechanical shaft power is 0.08 * 3000 * 2*pi/60 = 25.13 W. The rated voltage/current product is 24 * 1.8 = 43.2 W. The definition of rated current and actual phase waveform must be established before converting that number into a FOC phase-current limit.

| Screening case | Calculation | Result |
| --- | --- | --- |
| Maximum nominal PD source contract | 20 V * 5 A | 100 W at source, before cable/path losses |
| Rated voltage/current product | 24 V * 1.8 A | 43.2 W, not proof of peak demand |
| Illustrative 24 V / 3 A bus target | 24 * 3 | 72 W |
| Illustrative input with 90% boost and 2 W other loads | 72/0.90 + 2 | 82 W, 4.10 A at 20 V |
| Same demand at illustrative 19 V board input | 82/19 | 4.32 A |
| Illustrative boost heat at 72 W, 90% | 72*(1/0.90 - 1) | 8 W; substantial on a motor-sized board |
| Ideal 20 -> 24 V boost duty | 1 - 20/24 | 16.7% |
| Ideal 15 -> 24 V boost duty | 1 - 15/24 | 37.5% |
| Ideal 9 -> 24 V boost duty | 1 - 9/24 | 62.5% |
| Ideal 5 -> 24 V boost duty | 1 - 5/24 | 79.2% |

The 90% efficiency, 19 V input, 2 W overhead and 3 A output are explicitly illustrative assumptions. No part selection, loss model, operating-temperature budget or source contract proves them. Full motor power must not be enabled at 5/9/15 V on the strength of these calculations. Lower contracts should keep the motor disabled until a separately verified derating policy exists.

For an example 20 V, 100 W source with 2 W reserved for logic and 90% boost efficiency, the ideal remaining 24 V output ceiling is (100-2)*0.9/24 = 3.675 A before cable losses, current-limit tolerances and thermal derating. It is not a proposed allowable motor current. Startup, load steps and a locked rotor require active limits rather than an assumption that 100 W is sufficient.

## Required unresolved verification

1. Define phase RMS/peak current, startup acceleration, arm inertia, gearing, maximum sustained torque, motion duty and fault response. Prove power and phase-current limits independently; a DC bus current limit alone does not cap recirculating phase current.
2. Select and import every boost/protection component. Calculate inductor ripple and saturation at maximum temperature and minimum input, MOSFET/diode stress and switching loss, sense threshold tolerances, capacitor bias/ripple current and loop stability. Verify startup into actual load and output capacitance, load dump and repeated hiccup.
3. Prevent boost inrush and body-diode feedthrough from violating the active USB contract. Provide output short-circuit disconnection and reverse-current blocking where required; controller shutdown alone is insufficient.
4. Establish independent undervoltage/overvoltage and thermal interlocks and measure their tolerances/response. Sequence DRV8316 nFAULT pullup correctly: TI warns that below 2.2 V at startup can enter test mode. Assert DRVOFF and nSLEEP default states reliably during all rail transitions.
5. Implement local regenerative-energy handling. Capacitor-only storage obeys E = 0.5*C*(V_high^2 - V_low^2). For illustration, 1 mF from 24 V to 28 V stores only 0.104 J; this is not an approved bus clamp voltage or actual capacitor selection. Arm energy is unknown, so a brake resistor/chopper and thermal budget cannot be sized yet.
6. Validate USB host programming/communications at initial 5 V with the motor disabled. A power-only PD brick supplies no USB host function; firmware loading requires a data-capable host/cable arrangement.

**Outcome:** USB-C-only operation is the requirement. The preliminary budget does not prove a boost converter can meet startup/transient demand or fit thermally on the exact motor rear face. Power qualification remains blocked, not passed.
