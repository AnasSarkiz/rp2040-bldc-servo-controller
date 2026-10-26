import fs from "node:fs/promises"
import assert from "node:assert/strict"
import { Workbook } from "@oai/artifact-tool"

const evidenceDirectory = "evidence/tooling-20261026"
const coreStock = JSON.parse(await fs.readFile(`${evidenceDirectory}/core-stock-browser.json`, "utf8"))
const basicStock = JSON.parse(await fs.readFile(`${evidenceDirectory}/basic-stock-browser.json`, "utf8"))
const boostStock = JSON.parse(await fs.readFile(`${evidenceDirectory}/boost-stock-browser.json`, "utf8"))
const bom = await Workbook.fromCSV(await fs.readFile("BOM.csv", "utf8"), { sheetName: "BOM" })
const bomSheet = bom.worksheets.getItem("BOM")
const bomRows = bomSheet.getRange("A1:Q8").values
const headers = [...bomRows[0], "Available Order Quantity"]
for (const row of bomRows.slice(1)) {
  const listing = coreStock.find((part) => part.lcsc === row[3])
  assert.ok(listing?.identity_visible)
  assert.equal(listing.mpn, row[2])
  assert.equal(listing.classification, "Extended")
  assert.equal(listing.assembly_support_visible, true)
  assert.equal(typeof listing.stock, "number")
  assert.equal(typeof listing.available_order_quantity, "number")
  row[5] = Number(row[5])
  row[7] = listing.stock
  row[8] = "Official JLCPCB rendered listing; snapshot, not reserved"
  row[9] = listing.checked_date
  row[10] = listing.classification
  row[11] = "Not indicated on listing"
  row[12] = "SMT assembly listed; final assembler BOM/DFM match pending"
  row.push(listing.available_order_quantity)
}
bomSheet.getRange("A1:R8").values = [headers, ...bomRows.slice(1)]
bomSheet.getRange("A1:R8").format.font = { name: "Arial", size: 10 }
bomSheet.getRange("A1:R1").format.font = { name: "Arial", size: 10, bold: true }
bomSheet.getRange("A1:R8").format.autofitColumns()
bom.recalculate()
for (const [filename, range] of [["bom-identities", "A1:F8"], ["bom-stock", "H1:L8"], ["bom-order-quantity", "R1:R8"]]) {
  const preview = await bom.render({ sheetName: "BOM", range, scale: 1, format: "png" })
  await fs.writeFile(`${evidenceDirectory}/${filename}.png`, new Uint8Array(await preview.arrayBuffer()))
}

function csvField(cell) {
  return `"${String(cell ?? "").replaceAll('"', '""')}"`
}
function serializeCsv(rows) {
  return rows.map((row) => row.map(csvField).join(",")).join("\n") + "\n"
}
await fs.writeFile("BOM.csv", serializeCsv(bomSheet.getRange("A1:R8").values))

const catalog = await Workbook.fromCSV(await fs.readFile("SOURCING-CANDIDATES.csv", "utf8"), { sheetName: "Candidates" })
const candidateSheet = catalog.worksheets.getItem("Candidates")
const candidateRows = candidateSheet.getRange("A1:L6").values
candidateRows.push(["Boost regulator screening", "5 A internal switch; adjustable output to 38 V", "TPS55340RTER", "C169167", "WQFN-16-EP(3x3)", 0, boostStock.stock, "Extended", "Exact import succeeds; BLOCKED: pins 10/14 incorrectly doNotConnect", "Unallocated; I-018; current limit is switch current, not 5 A output; no qualified converter", boostStock.source_url, boostStock.checked_date])
const candidateHeaders = [...candidateRows[0], "Stock Basis", "Available Order Quantity"]
for (const row of candidateRows.slice(1)) {
  const listing = [...coreStock, ...basicStock, boostStock].find((part) => part.lcsc === row[3])
  assert.ok(listing)
  assert.equal(listing.mpn, row[2])
  assert.equal(typeof listing.stock, "number")
  if (listing.footprint !== undefined) row[4] = listing.footprint
  row[5] = Number(row[5])
  row[6] = listing.stock
  row[7] = listing.classification
  row[11] = listing.checked_date
  if (row[7] === "Basic") {
    row[8] = "Exact import/build succeeds; tsci index availability warning is contradicted by official stock listing"
    row[9] = "Unallocated; stock verified; manufacturer land-pattern and per-use electrical review pending"
  }
  row.push("Official JLCPCB rendered listing; snapshot, not reserved", listing.available_order_quantity)
}
candidateSheet.getRange("E1:E7").setNumberFormat("@")
candidateSheet.getRange("A1:N7").values = [candidateHeaders, ...candidateRows.slice(1)]
candidateSheet.getRange("A1:N7").format.font = { name: "Arial", size: 10 }
candidateSheet.getRange("A1:N1").format.font = { name: "Arial", size: 10, bold: true }
candidateSheet.getRange("A1:N7").format.autofitColumns()
candidateSheet.getRange("E1:E7").setNumberFormat("@")
catalog.recalculate()
const identifierInspection = await catalog.inspect({ kind: "computedStyle", sheetId: "Candidates", range: "E3:E6", maxChars: 3000 })
await fs.writeFile(`${evidenceDirectory}/candidate-identifier-style.ndjson`, identifierInspection.ndjson)
const candidatePreview = await catalog.render({ sheetName: "Candidates", range: "C1:H7", scale: 1, format: "png" })
await fs.writeFile(`${evidenceDirectory}/candidate-stock-v003.png`, new Uint8Array(await candidatePreview.arrayBuffer()))
await fs.writeFile("SOURCING-CANDIDATES.csv", serializeCsv(candidateSheet.getRange("A1:N7").values))
console.log("Refreshed seven BOM rows and six unallocated candidates from official rendered stock listings.")
