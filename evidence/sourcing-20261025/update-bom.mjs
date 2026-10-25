import fs from "node:fs/promises"
import assert from "node:assert/strict"
import { Workbook } from "@oai/artifact-tool"

// One-off sourcing-table authoring. Run from the board directory using the
// bundled artifact-tool runtime. No library definitions are edited here.
const evidenceDirectory = "evidence/sourcing-20261025"
const originalCsv = await fs.readFile("BOM.csv", "utf8")
const workbook = await Workbook.fromCSV(originalCsv, { sheetName: "BOM" })
const sheet = workbook.worksheets.getItem("BOM")
const originalRows = sheet.getRange("A1:G8").values
assert.equal(originalRows.length, 8)
sheet.getRange("A1:F8").format.autofitColumns()
const before = await workbook.render({ sheetName: "BOM", range: "A1:F8", scale: 1, format: "png" })
await fs.writeFile(`${evidenceDirectory}/bom-before.png`, new Uint8Array(await before.arrayBuffer()))

const sourcingNotes = {
  U1: "Retain RP2040; import coordinate issue resolved by supported re-import; support circuit incomplete",
  U2: "Retain motor driver; VM power metadata missing (I-009); integration blocked",
  U3: "Retain PD controller; three static PDOs; MCU reconfiguration needed for 5/9/15/20 V; power path incomplete",
  U4: "Selected C131025 same MPN instead of C82317; pinout and package reviewed; boot circuit not implemented/tested",
  U5: "Retain 3.3 V-compatible RS-485 transceiver; bus protection and connector not implemented",
  U6: "Inspection only; final encoder belongs on external daughterboard; not a mainboard assembly allocation",
  J1: "Retained only in audit; fabrication outline and electrical metadata defective; C165948 not approved (I-013/I-014)",
}
const importStatuses = {
  U1: "Imported; rendering verified; electrical integration pending",
  U2: "Imported; BLOCKED electrical metadata",
  U3: "Imported; full datasheet/support review pending",
  U4: "Re-imported C131025; same MPN/pins/copper geometry; reviewed",
  U5: "Imported; integration review pending",
  U6: "Imported; external assembly qualification pending",
  J1: "Imported; BLOCKED footprint and electrical metadata",
}
const header = [...originalRows[0], "Stock", "Stock Basis", "Checked Date", "JLCPCB Class", "Preferred Extended", "Assembly Support", "Assembly Side", "Verified Import Status", "Source URL", "BOM Scope"]
const updatedRows = []
for (const originalRow of originalRows.slice(1)) {
  const row = [...originalRow]
  const referenceDesignator = row[0]
  if (referenceDesignator === "U4") row[3] = "C131025"
  row[5] = Number(row[5])
  row[6] = sourcingNotes[referenceDesignator]
  const snapshot = JSON.parse(await fs.readFile(`${evidenceDirectory}/search-${row[3]}.json`, "utf8"))
  const match = snapshot.results.find((candidate) => `C${candidate.lcsc}` === row[3])
  assert.ok(match, `Missing exact stock snapshot for ${row[3]}`)
  assert.equal(match.mfr, row[2])
  assert.equal(match.is_basic, false)
  assert.equal(match.is_preferred, false)
  updatedRows.push([...row, match.stock, "tsci JLC search index snapshot; not reserved/live quote", "2026-10-25", "Extended", "No (search flag)", "JLC-listed; final assembler BOM/DFM match pending", "TOP", importStatuses[referenceDesignator], `https://jlcpcb.com/partdetail/${row[3]}`, "Seven-part unconnected audit only; controller BOM incomplete"])
}
sheet.getRange("A1:Q8").values = [header, ...updatedRows]
sheet.getRange("A1:Q8").format.font = { name: "Arial", size: 10 }
sheet.getRange("A1:Q1").format.font = { name: "Arial", size: 10, bold: true }
sheet.getRange("A1:F8").format.autofitColumns()
sheet.getRange("H1:N8").format.autofitColumns()
workbook.recalculate()
const inspection = await workbook.inspect({ kind: "table", sheetId: "BOM", range: "A1:Q8", tableMaxRows: 8, tableMaxCols: 17, maxChars: 20000 })
await fs.writeFile(`${evidenceDirectory}/bom-inspection.ndjson`, inspection.ndjson)
for (const [filename, range] of [["bom-identities", "A1:F8"], ["bom-stock", "H1:N8"]]) {
  const preview = await workbook.render({ sheetName: "BOM", range, scale: 1, format: "png" })
  await fs.writeFile(`${evidenceDirectory}/${filename}.png`, new Uint8Array(await preview.arrayBuffer()))
}
function csvField(cell) {
  return `"${String(cell ?? "").replaceAll('"', '""')}"`
}
function serializeCsv(rows) {
  return rows.map((row) => row.map(csvField).join(",")).join("\n") + "\n"
}
await fs.writeFile("BOM.csv", serializeCsv(sheet.getRange("A1:Q8").values))

const candidates = workbook.worksheets.add("Candidates")
const candidateRows = [
  ["Role", "Value", "Manufacturer Part Number", "LCSC Number", "Footprint", "Allocated Quantity", "Stock", "JLCPCB Class", "Import Status", "Disposition", "Source URL", "Checked Date"],
  ["USB-C alternative", "20 V 5 A receptacle", "TYPE-C-31-M-12", "C165948", "SMD with shell slots", 0, 330440, "Extended; not Preferred per search", "Exact import/build succeeds; pin warnings and footprint mismatch", "Not approved; I-013/I-014; no mainboard allocation", "https://jlcpcb.com/partdetail/C165948", "2026-10-25"],
  ["Logic decoupling candidate", "100 nF 16 V X7R 10%", "CL05B104KO5NNNC", "C1525", "0402", 0, "Unknown; empty search is not zero stock", "Basic (official JLC page)", "Exact import succeeds; see basic-passives build log", "Unallocated; manufacturer land-pattern and stock review pending; not raw PD/24 V rated", "https://jlcpcb.com/partdetail/C1525", "2026-10-25"],
  ["Logic rail capacitor candidate", "1 uF 25 V X5R 10%", "CL05A105KA5NQNC", "C52923", "0402", 0, "Unknown; empty search is not zero stock", "Basic (official JLC page)", "Exact import succeeds; see basic-passives build log", "Unallocated; manufacturer land-pattern/DC-bias and stock review pending; not approved on 24 V rail", "https://jlcpcb.com/partdetail/C52923", "2026-10-25"],
  ["Logic pull resistor candidate", "10 kohm 1% 62.5 mW", "0402WGF1002TCE", "C25744", "0402", 0, "Unknown; empty search is not zero stock", "Basic (official JLC page)", "Exact import succeeds; see basic-passives build log", "Unallocated; manufacturer land-pattern, dissipation and stock review pending", "https://jlcpcb.com/partdetail/C25744", "2026-10-25"],
  ["Logic series resistor candidate", "100 ohm 1% 62.5 mW", "0402WGF1000TCE", "C25076", "0402", 0, "Unknown; empty search is not zero stock", "Basic (official JLC page)", "Exact import succeeds; see basic-passives build log", "Unallocated; manufacturer land-pattern, dissipation and stock review pending; not RP2040 USB 27 ohm resistors", "https://jlcpcb.com/partdetail/C25076", "2026-10-25"],
]
candidates.getRange("A1:L6").values = candidateRows
workbook.recalculate()
assert.equal(candidates.getRange("F2:F6").values.flat().reduce((sum, quantity) => sum + quantity, 0), 0)
await fs.writeFile("SOURCING-CANDIDATES.csv", serializeCsv(candidates.getRange("A1:L6").values))
console.log("Updated seven exact BOM rows and five unallocated candidate rows; no fabricated stock or controller allocations.")
