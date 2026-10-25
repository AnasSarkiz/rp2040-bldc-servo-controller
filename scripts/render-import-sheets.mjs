import { readFileSync, writeFileSync } from "node:fs"
import { convertCircuitJsonToSchematicSvg } from "circuit-to-svg"
import { Resvg } from "@resvg/resvg-js"

const circuitJson = JSON.parse(readFileSync("dist/index/circuit.json", "utf8"))
const sheets = circuitJson.filter((element) => element.type === "schematic_sheet")
for (const sheet of sheets) {
  const svg = convertCircuitJsonToSchematicSvg(circuitJson, {
    schematicSheetId: sheet.schematic_sheet_id,
    width: 1800,
    height: 1273,
  })
  const basename = `dist/index/schematic-${sheet.name}`
  writeFileSync(`${basename}.svg`, svg)
  writeFileSync(`${basename}.png`, new Resvg(svg).render().asPng())
  console.log(`Rendered ${sheet.name}`)
}
