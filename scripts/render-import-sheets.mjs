import { readFileSync, writeFileSync } from "node:fs"
import {
  convertCircuitJsonToSchematicSvg,
  convertCircuitJsonToStackedSchematicSheetsSvg,
} from "circuit-to-svg"
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

const stackedSvg = convertCircuitJsonToStackedSchematicSheetsSvg(circuitJson, {
  width: 1800,
  height: 1273,
})
writeFileSync("dist/index/schematic-all-sheets.svg", stackedSvg)
writeFileSync(
  "dist/index/schematic-all-sheets.png",
  new Resvg(stackedSvg).render().asPng(),
)
console.log(`Rendered all ${sheets.length} sheets using the native stacked API`)
