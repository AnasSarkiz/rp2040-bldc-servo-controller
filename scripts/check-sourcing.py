"""Check audit BOM against generated hardware records, never fabrication approval."""

import csv
import hashlib
import json
from collections import Counter
from pathlib import Path


def load_json(path):
    return json.loads(Path(path).read_text())


def check_sourcing():
    circuit_path = Path("dist/index/circuit.json")
    circuit = load_json(circuit_path)
    with Path("BOM.csv").open(newline="") as bom_file:
        bom_rows = list(csv.DictReader(bom_file))
    components = {
        record["name"]: record
        for record in circuit
        if record["type"] == "source_component"
    }
    expected_parts = {
        "U1": "C2040",
        "U2": "C5218861",
        "U3": "C2678061",
        "U4": "C131025",
        "U5": "C2671361",
        "U6": "C962063",
        "J1": "C37616412",
    }
    assert len(bom_rows) == len(components) == len(expected_parts)
    assert {row["Reference Designator"] for row in bom_rows} == set(components)
    for bom_row in bom_rows:
        reference_designator = bom_row["Reference Designator"]
        component = components[reference_designator]
        supplier_number = bom_row["LCSC Number"]
        assert supplier_number == expected_parts[reference_designator]
        assert component["supplier_part_numbers"]["jlcpcb"] == [supplier_number]
        assert bom_row["Manufacturer Part Number"] == component["manufacturer_part_number"]
        assert int(bom_row["Quantity"]) == 1
        assert bom_row["Assembly Side"] == "TOP"
        assert bom_row["Verified Import Status"]
        assert "incomplete" in bom_row["BOM Scope"]
        search = load_json(f"evidence/sourcing-20261025/search-{supplier_number}.json")
        exact_match = next(part for part in search["results"] if f'C{part["lcsc"]}' == supplier_number)
        assert int(bom_row["Stock"]) == exact_match["stock"]
        assert not exact_match["is_basic"] and not exact_match["is_preferred"]
        assert bom_row["JLCPCB Class"] == "Extended"

    board = next(record for record in circuit if record["type"] == "pcb_board")
    assert (board["width"], board["height"], board["num_layers"]) == (42, 42, 4)
    placed_components = [record for record in circuit if record["type"] == "pcb_component"]
    pads = [record for record in circuit if record["type"] == "pcb_smtpad"]
    assert len(placed_components) == 7
    assert all(component["layer"] == "top" for component in placed_components)
    assert all(pad["layer"] == "top" for pad in pads)
    sheets = [record for record in circuit if record["type"] == "schematic_sheet"]
    assert len(sheets) == 3 and all(sheet["sheet_size"] == "a4" for sheet in sheets)
    record_counts = Counter(record["type"] for record in circuit)
    assert not record_counts["source_trace"]
    assert not record_counts["pcb_trace"]
    assert not record_counts["pcb_via"]
    assert load_json("tscircuit.config.json")["build"]["routingDisabled"] is True

    with Path("SOURCING-CANDIDATES.csv").open(newline="") as candidate_file:
        candidate_rows = list(csv.DictReader(candidate_file))
    assert {row["LCSC Number"] for row in candidate_rows} == {
        "C165948", "C1525", "C52923", "C25744", "C25076"
    }
    assert all(int(row["Allocated Quantity"]) == 0 for row in candidate_rows)

    # These counts expose the still-failing hardware build. They are not waived
    # by a successful consistency audit, and are not prerequisites for its exit.
    summary = {
        "revision": "sourcing-prototype-0.0.2",
        "audit_bom_matches_generated_fixture": True,
        "bom_component_rows": len(bom_rows),
        "unallocated_candidate_rows": len(candidate_rows),
        "outline_mm": [board["width"], board["height"]],
        "layers": board["num_layers"],
        "placed_component_side": "top",
        "smt_pad_side": "top",
        "smt_pad_count": len(pads),
        "required_pin_error_count": record_counts["source_pin_must_be_connected_error"],
        "electrical_design_complete": False,
        "fabrication_ready": False,
        "circuit_json_sha256": hashlib.sha256(circuit_path.read_bytes()).hexdigest(),
    }
    Path("evidence/sourcing-20261025/bom-consistency.json").write_text(json.dumps(summary, indent=2) + "\n")
    print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    check_sourcing()
