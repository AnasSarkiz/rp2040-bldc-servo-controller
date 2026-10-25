import { TYPE_C_31_M_12 } from "../imports/TYPE_C_31_M_12/TYPE_C_31_M_12"

// Qualification fixture only. No PD circuit or power connections.
export default function UsbConnectorQualification() {
  return (
    <board width="20mm" height="20mm" layers={4} routingDisabled>
      <schematicsheet
        name="usb-qualification"
        displayName="C165948 IMPORT AUDIT"
        sheetSize="A4"
      />
      <TYPE_C_31_M_12 name="J1" layer="top" schSheetName="usb-qualification" />
    </board>
  )
}
