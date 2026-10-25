import { readFile, writeFile } from "node:fs/promises"
import { createHash } from "node:crypto"
import { chromium } from "playwright"

const json = JSON.parse(await readFile("dist/index/circuit.json", "utf8"))
const svg = await readFile("dist/index/pcb.svg", "utf8")
const raw = JSON.parse(await readFile("evidence/easyeda-C37616412.json", "utf8"))
const notes = json.filter((e) => e.type === "pcb_fabrication_note_path")
const sourceRegion = raw.packageDetail.dataStr.shape.find((s) => s.startsWith("SOLIDREGION~12~"))
const sourcePath = sourceRegion.split("~")[3]
await writeFile("evidence/fabrication.json", JSON.stringify(notes, null, 2) + "\n")
await writeFile("evidence/source-document-region.txt", sourceRegion + "\n")
const counts = Object.fromEntries([...new Set(json.map((e) => e.type))].sort().map((t) => [t, json.filter((e) => e.type === t).length]))
const sha256 = (data) => createHash("sha256").update(data).digest("hex")
const summary = {
  component: "C37616412 / USB4215-03-A",
  counts,
  segments: notes.flatMap((n) => n.route.slice(1).map((p, i) => {
    const from = n.route[i]
    return { index: i, from, to: p, length_mm: Math.hypot(p.x - from.x, p.y - from.y), diagonal: Math.abs(p.x-from.x) > 1 && Math.abs(p.y-from.y) > 1 }
  })),
  imported_tsx_sha256: sha256(await readFile("imports/USB4215_03_A/USB4215_03_A.tsx")),
  source_json_sha256: sha256(await readFile("evidence/easyeda-C37616412.json")),
  manufacturer_pdf_sha256: sha256(await readFile("../../datasheets/usb4215.pdf")),
}
await writeFile("evidence/geometry.json", JSON.stringify(summary, null, 2) + "\n")
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_EXECUTABLE_PATH, args: ["--no-sandbox"] })
const page = await browser.newPage({ viewport: { width: 800, height: 600 }, deviceScaleFactor: 1 })
// Layer view only: copy renderer output and remove non-fabrication graphic nodes.
// The surviving path's d/fill/stroke attributes stay exactly as emitted by the CLI.
await page.setContent(svg)
const fabSvg = await page.evaluate(() => {
  const root = document.querySelector("svg")
  root.querySelectorAll("[data-type]").forEach((node) => {
    if (!["pcb_background", "pcb_boundary", "pcb_board", "pcb_fabrication_note_path"].includes(node.getAttribute("data-type"))) node.remove()
  })
  return root.outerHTML
})
await writeFile("evidence/fabrication.svg", fabSvg + "\n")
await page.setContent(`<style>body{margin:0;background:black}svg{display:block}</style>${fabSvg}`)
await page.screenshot({ path: "evidence/fabrication.png" })
const rawSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="3977 2984 40 30"><rect x="3977" y="2984" width="40" height="30" fill="black"/><path d="${sourcePath}" fill="#aaa"/></svg>`
await writeFile("evidence/source-document-region.svg", rawSvg + "\n")
await page.setContent(`<style>body{margin:0}</style>${rawSvg}`)
await page.screenshot({ path: "evidence/source-document-region.png" })
// Annotation is a separate HTML overlay; the original CLI SVG and PNG are intact.
const bad = summary.segments.find((s) => s.diagonal)
if (bad) {
  await page.setContent(`<style>body{margin:0;background:black}.pcb{position:absolute;inset:0}.annotation{position:absolute;inset:0;font-family:sans-serif}</style><div class="pcb">${svg}</div><svg class="annotation" width="800" height="600"><defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="#ff6644"/></marker></defs><text x="350" y="65" fill="#ff8866" font-size="22">Unexpected diagonal / filled wedge</text><path d="M 510 82 L 454 350" stroke="#ff6644" fill="none" stroke-width="3" marker-end="url(#arrow)"/><circle cx="425" cy="380" r="32" stroke="#ff6644" fill="none" stroke-width="3"/></svg>`)
  await page.screenshot({ path: "evidence/pcb-highlighted.png" })
}
if (!bad) {
  const baselinePng = (await readFile("evidence/baseline/pcb.png")).toString("base64")
  const fixedPng = (await readFile("dist/index/pcb.png")).toString("base64")
  await page.setViewportSize({ width: 1600, height: 660 })
  await page.setContent(`<style>body{margin:0;background:#111;color:white;font:24px sans-serif}main{display:flex}section{width:800px}h1{margin:0;height:60px;display:grid;place-items:center;font-size:24px}img{display:block;width:800px;height:600px}</style><main><section><h1>Before: latest published CLI, unmodified import</h1><img src="data:image/png;base64,${baselinePng}"></section><section><h1>After: importer fix, freshly regenerated import</h1><img src="data:image/png;base64,${fixedPng}"></section></main>`)
  await page.screenshot({ path: "evidence/before-after.png" })
}
await browser.close()
console.log(`Captured ${notes.length} fabrication path(s); ${summary.segments.filter((s) => s.diagonal).length} long diagonal(s).`)
