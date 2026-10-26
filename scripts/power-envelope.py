"""Screen the USB PD power envelope. This is not a converter simulation."""

import json
from pathlib import Path


def screen_operating_point(operating_point, assumptions):
    input_voltage = operating_point["input_voltage_v"]
    output_current = operating_point["output_current_a"]
    output_voltage = assumptions["output_voltage_v"]
    output_power = output_voltage * output_current
    boost_input_current = output_power / (assumptions["boost_efficiency_assumed"] * input_voltage)
    total_input_current = boost_input_current + assumptions["other_load_power_assumed_w"] / input_voltage
    current_limit_low = assumptions["input_current_limit_nominal_a"] * (1 - assumptions["input_current_limit_tolerance_assumed"])
    duty_cycle = 1 - input_voltage / (output_voltage + assumptions["diode_drop_assumed_v"])
    ripple_current = input_voltage * duty_cycle / (assumptions["inductance_min_assumed_h"] * assumptions["switching_frequency_screen_hz"])
    peak_inductor_current = boost_input_current + ripple_current / 2
    input_limited_power = (input_voltage * current_limit_low - assumptions["other_load_power_assumed_w"]) * assumptions["boost_efficiency_assumed"]
    switch_limited_power = (assumptions["switch_current_limit_datasheet_min_a"] - ripple_current / 2) * assumptions["boost_efficiency_assumed"] * input_voltage
    return {
        **operating_point,
        "output_power_w": output_power,
        "total_input_current_a": total_input_current,
        "input_current_budget_margin_a": current_limit_low - total_input_current,
        "inductor_ripple_peak_to_peak_a": ripple_current,
        "peak_inductor_current_a": peak_inductor_current,
        "switch_current_limit_margin_a": assumptions["switch_current_limit_datasheet_min_a"] - peak_inductor_current,
        "screened_max_output_current_a": min(input_limited_power, switch_limited_power) / output_voltage,
        "input_budget_screen_pass": total_input_current <= current_limit_low,
        "switch_current_screen_pass": peak_inductor_current <= assumptions["switch_current_limit_datasheet_min_a"],
    }


def main():
    assumptions = {
        "output_voltage_v": 24,
        "negotiated_current_required_a": 5,
        "input_current_limit_nominal_a": 4.5,
        "input_current_limit_tolerance_assumed": 0.05,
        "other_load_power_assumed_w": 2,
        "boost_efficiency_assumed": 0.90,
        "diode_drop_assumed_v": 0.5,
        "inductance_min_assumed_h": 8e-6,
        "switching_frequency_screen_hz": 460000,
        "switch_current_limit_datasheet_min_a": 5.25,
        "switch_current_limit_datasheet_max_a": 7.75,
    }
    current_limit_low = assumptions["input_current_limit_nominal_a"] * (1 - assumptions["input_current_limit_tolerance_assumed"])
    current_limit_high = assumptions["input_current_limit_nominal_a"] * (1 + assumptions["input_current_limit_tolerance_assumed"])
    assert current_limit_high < assumptions["negotiated_current_required_a"]
    cases = [screen_operating_point({"input_voltage_v": input_voltage, "output_current_a": output_current}, assumptions)
             for input_voltage in [18, 19, 20] for output_current in [1.8, 2, 3]]
    at_18v_3a = next(case for case in cases if case["input_voltage_v"] == 18 and case["output_current_a"] == 3)
    at_18v_2a = next(case for case in cases if case["input_voltage_v"] == 18 and case["output_current_a"] == 2)
    assert not at_18v_3a["input_budget_screen_pass"]
    assert at_18v_2a["input_budget_screen_pass"] and at_18v_2a["switch_current_screen_pass"]
    minimum_input_for_3a = (24 * 3 / assumptions["boost_efficiency_assumed"] + assumptions["other_load_power_assumed_w"]) / current_limit_low
    result = {
        "screening_only": True,
        "candidate": "TPS55340RTER / C169167; imported but blocked by NC metadata defect I-018",
        "source": "TI TPS55340 SLVSBD4E sections 6.5 and 8.2.1; actual parts and operating bounds remain unselected",
        "assumptions": assumptions,
        "assumption_limits": [
            "Efficiency, overhead, board-input range, current-limit tolerance, inductance and diode drop are screening assumptions, not validated component limits.",
            "460 kHz is the datasheet lower frequency at RFREQ=80 kohm; no actual frequency resistor/tolerance is selected.",
            "5.25/7.75 A are internal switch current-limit bounds, not output-current ratings.",
            "Input current limiting, output-short disconnection, hardware interlocks and regenerative braking remain undesigned.",
            "Only a verified 20 V / 5 A contract may enable the motor; 5/9/15 V and inadequate current contracts keep it disabled.",
        ],
        "input_limit_low_a": current_limit_low,
        "input_limit_high_a": current_limit_high,
        "minimum_input_for_24v_3a_under_assumptions_v": minimum_input_for_3a,
        "capacitor_for_1a_500us_0p5v_sag_f": 1 * 500e-6 / 0.5,
        "energy_in_1mf_from_24v_to_28v_j": 0.5 * 1e-3 * (28**2 - 24**2),
        "cases": cases,
        "motor_startup_verified": False,
        "thermal_rating_verified": False,
        "power_design_complete": False,
    }
    Path("evidence/tooling-20261026/power-envelope.json").write_text(json.dumps(result, indent=2) + "\n")
    print(f"Input current limiter assumed range: {current_limit_low:.3f}–{current_limit_high:.3f} A")
    print(f"24 V / 3 A requires board input >= {minimum_input_for_3a:.3f} V under these assumptions")
    print(f"18 V input screening ceiling: {at_18v_3a['screened_max_output_current_a']:.3f} A at 24 V")
    print("Startup, thermal performance and completed protection: NOT VERIFIED")


if __name__ == "__main__":
    main()
