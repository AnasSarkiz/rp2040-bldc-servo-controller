"""Validate rendered A4 sheet frames and component coverage, not circuitry."""

import json
import xml.etree.ElementTree as ET
from pathlib import Path


def check_schematic_sheets():
    circuit = json.loads(Path("dist/index/circuit.json").read_text())
    sheets = [record for record in circuit if record["type"] == "schematic_sheet"]
    assert len(sheets) == 3
    reviewed = []
    for sheet in sheets:
        sheet_id = sheet["schematic_sheet_id"]
        assert sheet["sheet_size"] == "a4"
        assert (sheet["sheet_width"], sheet["sheet_height"]) == (297, 210)
        path = Path("dist/index") / f'schematic-{sheet["name"]}.svg'
        svg = ET.fromstring(path.read_text())
        frames = [element for element in svg.iter()
                  if element.get("data-schematic-rect-id") == f"{sheet_id}_outer"]
        assert len(frames) == 1, f"Missing or duplicate frame: {path}"
        frame = frames[0]
        for dimension in ["width", "height"]:
            assert float(frame.get(dimension)) > 0
        assert float(frame.get("x")) >= 0 and float(frame.get("y")) >= 0
        assert float(frame.get("x")) + float(frame.get("width")) <= float(svg.get("width"))
        assert float(frame.get("y")) + float(frame.get("height")) <= float(svg.get("height"))
        expected_components = {
            record["schematic_component_id"] for record in circuit
            if record["type"] == "schematic_component"
            and record.get("schematic_sheet_id") == sheet_id
        }
        rendered_components = {
            element.get("data-schematic-component-id") for element in svg.iter()
            if element.get("data-circuit-json-type") == "schematic_component"
        }
        assert rendered_components == expected_components, path
        reviewed.append({"sheet": sheet["name"], "a4_frame_in_viewport": True,
                         "component_count": len(rendered_components)})
    stacked = ET.fromstring(Path("dist/index/schematic-all-sheets.svg").read_text())
    stacked_sheets = [element.get("data-schematic-sheet-id") for element in stacked.iter()
                      if element.get("data-circuit-json-type") == "schematic_sheet"]
    assert sorted(stacked_sheets) == sorted(sheet["schematic_sheet_id"] for sheet in sheets)
    print(json.dumps({"sheets": reviewed, "native_stacked_sheet_count": len(stacked_sheets),
                      "electrical_review_passed": False}, indent=2))


if __name__ == "__main__":
    check_schematic_sheets()
