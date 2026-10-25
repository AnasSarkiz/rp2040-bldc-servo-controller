import { RP2040 } from "./imports/RP2040/RP2040"
import { DRV8316RRGFR } from "./imports/DRV8316RRGFR/DRV8316RRGFR"
import { STUSB4500QTR } from "./imports/STUSB4500QTR/STUSB4500QTR"
import { W25Q16JVSSIQ } from "./imports/W25Q16JVSSIQ/W25Q16JVSSIQ"
import { THVD1450DR } from "./imports/THVD1450DR/THVD1450DR"
import { AS5047P_ATSM } from "./imports/AS5047P_ATSM/AS5047P_ATSM"
import { USB4215_03_A } from "./imports/USB4215_03_A/USB4215_03_A"

// Unconnected import inspection only. Not an electrical implementation.
// The outline is an inspection canvas, not a verified motor mounting outline.
// All electrical integration remains blocked as recorded in issue.md.
export default function ImportedPartInspection() {
  return (
    <board width="42mm" height="42mm" layers={4} routingDisabled>
      <schematicsheet
        name="mcu"
        displayName="IMPORT AUDIT - MCU"
        sheetSize="A4"
      />
      <schematicsheet
        name="power"
        displayName="IMPORT AUDIT - POWER"
        sheetSize="A4"
      />
      <schematicsheet
        name="interfaces"
        displayName="IMPORT AUDIT - INTERFACES"
        sheetSize="A4"
      />
      <RP2040
        name="U1"
        layer="top"
        pcbX={-10}
        pcbY={10}
        schX={-5}
        schY={0}
        schSheetName="mcu"
      />
      <DRV8316RRGFR
        name="U2"
        layer="top"
        pcbX={1}
        pcbY={10}
        schX={-6}
        schY={3}
        schSheetName="power"
        schWidth={1.8}
      />
      <STUSB4500QTR
        name="U3"
        layer="top"
        pcbX={12}
        pcbY={10}
        schX={6}
        schY={3}
        schSheetName="power"
      />
      <W25Q16JVSSIQ
        name="U4"
        layer="top"
        pcbX={-10}
        pcbY={-3}
        schX={5}
        schY={0}
        schSheetName="mcu"
      />
      <THVD1450DR
        name="U5"
        layer="top"
        pcbX={1}
        pcbY={-3}
        schX={-5}
        schY={0}
        schSheetName="interfaces"
      />
      <AS5047P_ATSM
        name="U6"
        layer="top"
        pcbX={12}
        pcbY={-3}
        schX={5}
        schY={0}
        schSheetName="interfaces"
      />
      <USB4215_03_A
        name="J1"
        layer="top"
        pcbX={0}
        pcbY={-14}
        schX={0}
        schY={-5}
        schSheetName="power"
      />
    </board>
  )
}
