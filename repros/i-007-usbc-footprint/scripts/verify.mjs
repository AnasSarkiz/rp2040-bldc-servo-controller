import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
const json = JSON.parse(await readFile("dist/index/circuit.json", "utf8"))
const notes = json.filter((e) => e.type === "pcb_fabrication_note_path")
assert.equal(json.filter((e) => e.type === "source_component").length, 1)
assert.equal(json.filter((e) => e.type === "pcb_smtpad").length, 12)
assert.equal(json.filter((e) => e.type === "pcb_plated_hole").length, 4)
assert.equal(json.filter((e) => /trace$/.test(e.type)).length, 0)
assert.equal(json.filter((e) => /_error$/.test(e.type)).length, 0)
assert.equal(notes.length, 1)
const route = notes[0].route
const diagonals = route.slice(1).filter((p, i) => Math.abs(p.x-route[i].x)>1 && Math.abs(p.y-route[i].y)>1)
assert.equal(diagonals.length, 1, "baseline must reproduce the unwanted long diagonal")
assert.equal(route.length, 12)
console.log("Verified one component, 12 pads, 4 shell holes, zero traces/errors, and the original malformed 12-point fabrication path.")
