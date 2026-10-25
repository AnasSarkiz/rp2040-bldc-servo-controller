import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { runInNewContext } from "node:vm"
import { test } from "node:test"

// Exercise the actual private importer helper embedded in the installed CLI.
// Do not maintain an independent copy of the algorithm in this regression test.
const bundle = readFileSync("node_modules/@tscircuit/cli/dist/cli/main.js", "utf8")
const helpers = [...bundle.matchAll(/^var (expandEasyEdaPathData\d*) = \(pathData\) => \{.*?^\};/gms)]
assert.equal(helpers.length, 2, "update this test if the pinned CLI bundle changes")
const raw = JSON.parse(readFileSync("evidence/easyeda-C37616412.json", "utf8"))
const source = raw.packageDetail.dataStr.shape.find((s) => s.startsWith("SOLIDREGION~12~")).split("~")[3]
for (const helper of helpers) {
  const arcName = helper[0].match(/(generateArcFromSweep\d*)\(/)[1]
  const arcStart = bundle.indexOf(`function ${arcName}(`)
  const arcEnd = bundle.indexOf("\n}", arcStart) + 2
  assert(arcStart >= 0 && arcEnd > arcStart)
  const expand = runInNewContext(`${bundle.slice(arcStart, arcEnd)}\n${helper[0]}\n${helper[1]}`)
  const local = (path) => JSON.parse(JSON.stringify(expand(path)))
  test(`${helper[1]}: all implicit M/L destinations survive`, () => {
    assert.deepEqual(local("M0 0 10 0 L10 10 0 10 0 0"), [
      {x:0,y:0},{x:10,y:0},{x:10,y:10},{x:0,y:10},{x:0,y:0},
    ])
  })
  test(`${helper[1]}: repeated A arguments equal explicit commands`, () => {
    assert.deepEqual(local("M0 0 A1 1 0 0 1 1 1 1 1 0 0 1 2 0 L3 0"), local("M0 0 A1 1 0 0 1 1 1 A1 1 0 0 1 2 0 L3 0"))
  })
  test(`${helper[1]}: real USB4215 marking is closed with no long diagonal`, () => {
    const route = local(source)
    assert.equal(route.length, 19)
    assert.deepEqual(route.at(-1), route[0])
    assert(route.some((p) => p.x===4013.9213 && p.y===3011.5906))
    assert(route.some((p) => p.x===4013.9213 && p.y===2992.7993))
    for (let i=1;i<route.length;i++) {
      assert(!(Math.abs(route[i].x-route[i-1].x)>1 && Math.abs(route[i].y-route[i-1].y)>1))
    }
  })
  test(`${helper[1]}: explicit single-group paths retain their vertices`, () => {
    assert.deepEqual(local("M1 2 L3 4 L5 6 L1 2 Z"), [{x:1,y:2},{x:3,y:4},{x:5,y:6},{x:1,y:2}])
  })
}
