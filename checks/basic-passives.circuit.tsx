import { CL05B104KO5NNNC } from "../imports/CL05B104KO5NNNC/CL05B104KO5NNNC"
import { CL05A105KA5NQNC } from "../imports/CL05A105KA5NQNC/CL05A105KA5NQNC"
import { A_0402WGF1002TCE } from "../imports/A_0402WGF1002TCE/A_0402WGF1002TCE"
import { A_0402WGF1000TCE } from "../imports/A_0402WGF1000TCE/A_0402WGF1000TCE"

// Unconnected library qualification, not allocated controller support circuitry.
export default function BasicPassiveQualification() {
  return (
    <board width="20mm" height="20mm" layers={4} routingDisabled>
      <schematicsheet
        name="passives"
        displayName="BASIC PASSIVE IMPORT AUDIT"
        sheetSize="A4"
      />
      <CL05B104KO5NNNC
        name="C1"
        layer="top"
        pcbX={-4}
        pcbY={4}
        schX={-4}
        schY={2}
        schSheetName="passives"
      />
      <CL05A105KA5NQNC
        name="C2"
        layer="top"
        pcbX={4}
        pcbY={4}
        schX={4}
        schY={2}
        schSheetName="passives"
      />
      <A_0402WGF1002TCE
        name="R1"
        layer="top"
        pcbX={-4}
        pcbY={-4}
        schX={-4}
        schY={-2}
        schSheetName="passives"
      />
      <A_0402WGF1000TCE
        name="R2"
        layer="top"
        pcbX={4}
        pcbY={-4}
        schX={4}
        schY={-2}
        schSheetName="passives"
      />
    </board>
  )
}
