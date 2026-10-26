import fs from "node:fs/promises"
import { Workbook } from "@oai/artifact-tool"

const workbook = await Workbook.fromCSV('Footprint\n"0402"\n', { sheetName: "Probe" })
const parsedFootprint = workbook.worksheets.getItem("Probe").getRange("A2").values[0][0]
const record = {
  source_identifier: "0402",
  parsed_identifier: parsedFootprint,
  parsed_type: typeof parsedFootprint,
  leading_zero_preserved: parsedFootprint === "0402",
  resolution: "The reader preserves the string. Format identifiers explicitly as text for preview, and validate the exported CSV against the primary source.",
}
await fs.writeFile("evidence/tooling-20261026/csv-identifier-probe.json", JSON.stringify(record, null, 2) + "\n")
console.log(record)
