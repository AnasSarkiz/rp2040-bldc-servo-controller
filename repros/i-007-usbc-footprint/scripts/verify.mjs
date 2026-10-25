import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
const json = JSON.parse(await readFile("dist/index/circuit.json", "utf8"))
const baseline = JSON.parse(await readFile("evidence/baseline/circuit.json", "utf8"))
const notes = json.filter((e) => e.type === "pcb_fabrication_note_path")
assert.equal(json.filter((e) => e.type === "source_component").length, 1)
assert.equal(json.filter((e) => e.type === "pcb_smtpad").length, 12)
assert.equal(json.filter((e) => e.type === "pcb_plated_hole").length, 4)
assert.equal(json.filter((e) => /trace$/.test(e.type)).length, 0)
assert.equal(json.filter((e) => /_error$/.test(e.type)).length, 0)
assert.equal(notes.length, 1)
const route = notes[0].route
assert.equal(route.length, 19)
assert.deepEqual(route.at(-1), route[0])
for (let i=1;i<route.length;i++) {
  assert(!(Math.abs(route[i].x-route[i-1].x)>1 && Math.abs(route[i].y-route[i-1].y)>1), "no body-spanning diagonal")
}
assert.equal(notes[0].is_filled, true)
assert.equal(notes[0].has_stroke, false)
assert.equal(notes[0].stroke_width, 0)
// Source digest necessarily changes after re-import. All other non-fabrication
// records, including copper, holes, schematic ports and warnings, must match.
const stable = (records) => records.filter((e) => !["pcb_fabrication_note_path", "source_project_metadata"].includes(e.type))
assert.deepEqual(stable(json), stable(baseline))
const imported = await readFile("imports/USB4215_03_A/USB4215_03_A.tsx", "utf8")
const original = await readFile("evidence/baseline/imported.tsx", "utf8")
const withoutFab = (s) => s.replace(/^<fabricationnotepath.*$/m, "")
assert.deepEqual(withoutFab(imported), withoutFab(original))
assert.notEqual(imported, original)
assert.notEqual(await readFile("dist/index/pcb.svg", "utf8"), await readFile("evidence/baseline/pcb.svg", "utf8"))
console.log(`Verified fixed 19-point U marking, zero long diagonals, and ${stable(json).length} identical non-fabrication records. Only generated fabrication TSX and source digest change.`)
