import objPath from "./RP2040.obj"
import stepPath from "./RP2040.step"
import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["IOVDD6"],
  pin2: ["GPIO0"],
  pin3: ["GPIO1"],
  pin4: ["GPIO2"],
  pin5: ["GPIO3"],
  pin6: ["GPIO4"],
  pin7: ["GPIO5"],
  pin8: ["GPIO6"],
  pin9: ["GPIO7"],
  pin10: ["IOVDD5"],
  pin11: ["GPIO8"],
  pin12: ["GPIO9"],
  pin13: ["GPIO10"],
  pin14: ["GPIO11"],
  pin15: ["GPIO12"],
  pin16: ["GPIO13"],
  pin17: ["GPIO14"],
  pin18: ["GPIO15"],
  pin19: ["TESTEN"],
  pin20: ["XIN"],
  pin21: ["XOUT"],
  pin22: ["IOVDD4"],
  pin23: ["DVDD2"],
  pin24: ["SWCLK"],
  pin25: ["SWD"],
  pin26: ["RUN"],
  pin27: ["GPIO16"],
  pin28: ["GPIO17"],
  pin29: ["GPIO18"],
  pin30: ["GPIO19"],
  pin31: ["GPIO20"],
  pin32: ["GPIO21"],
  pin33: ["IOVDD3"],
  pin34: ["GPIO22"],
  pin35: ["GPIO23"],
  pin36: ["GPIO24"],
  pin37: ["GPIO25"],
  pin38: ["GPIO26_ADC0"],
  pin39: ["GPIO27_ADC1"],
  pin40: ["GPIO28_ADC2"],
  pin41: ["GPIO29_ADC3"],
  pin42: ["IOVDD2"],
  pin43: ["ADC_AVDD"],
  pin44: ["VREG_IN"],
  pin45: ["VREG_VOUT"],
  pin46: ["USB_DM"],
  pin47: ["USB_DP"],
  pin48: ["USB_VDD"],
  pin49: ["IOVDD1"],
  pin50: ["DVDD1"],
  pin51: ["QSPI_SD3"],
  pin52: ["QSPI_SCLK"],
  pin53: ["QSPI_SD0"],
  pin54: ["QSPI_SD2"],
  pin55: ["QSPI_SD1"],
  pin56: ["QSPI_SS"],
  pin57: ["GND"]
} as const

const pinAttributes = {
  pin57: {capabilities: [], requiresGround: true, requiresVoltage: 0, mustBeConnected: true},
  pin56: {isInput: true, isOutput: true, isBidirectional: true, capabilities: ["spi_cs"], canUseInternalPullup: true, canUseInternalPulldown: true, canUsePushPull: true, isGpio: true},
  pin55: {isInput: true, isOutput: true, isBidirectional: true, capabilities: ["spi_miso"], canUseInternalPullup: true, canUseInternalPulldown: true, canUsePushPull: true, isGpio: true},
  pin54: {isInput: true, isOutput: true, isBidirectional: true, capabilities: [], canUseInternalPullup: true, canUseInternalPulldown: true, canUsePushPull: true, isGpio: true},
  pin53: {isInput: true, isOutput: true, isBidirectional: true, capabilities: ["spi_mosi"], canUseInternalPullup: true, canUseInternalPulldown: true, canUsePushPull: true, isGpio: true},
  pin52: {isInput: true, isOutput: true, isBidirectional: true, capabilities: ["spi_sck"], canUseInternalPullup: true, canUseInternalPulldown: true, canUsePushPull: true, isGpio: true},
  pin51: {isInput: true, isOutput: true, isBidirectional: true, capabilities: [], canUseInternalPullup: true, canUseInternalPulldown: true, canUsePushPull: true, isGpio: true},
  pin50: {isInput: true, capabilities: [], requiresPower: true, mustBeConnected: true, shouldHaveDecouplingCapacitor: true, recommendedDecouplingCapacitorCapacitance: "100nF"},
  pin49: {isInput: true, capabilities: [], requiresPower: true, mustBeConnected: true, shouldHaveDecouplingCapacitor: true, recommendedDecouplingCapacitorCapacitance: "100nF"},
  pin48: {isInput: true, capabilities: [], requiresPower: true, mustBeConnected: true, shouldHaveDecouplingCapacitor: true, recommendedDecouplingCapacitorCapacitance: "100nF"},
  pin47: {isInput: true, isOutput: true, isBidirectional: true, capabilities: [], canUseInternalPullup: true, canUseInternalPulldown: true},
  pin46: {isInput: true, isOutput: true, isBidirectional: true, capabilities: [], canUseInternalPullup: true, canUseInternalPulldown: true},
  pin45: {isOutput: true, canUseTriState: true, capabilities: [], providesPower: true, shouldHaveDecouplingCapacitor: true, recommendedDecouplingCapacitorCapacitance: "1uF"},
  pin44: {isInput: true, capabilities: [], requiresPower: true, mustBeConnected: true, shouldHaveDecouplingCapacitor: true, recommendedDecouplingCapacitorCapacitance: "1uF"},
  pin43: {isInput: true, capabilities: [], requiresPower: true, mustBeConnected: true, shouldHaveDecouplingCapacitor: true, recommendedDecouplingCapacitorCapacitance: "100nF"},
  pin42: {isInput: true, capabilities: [], requiresPower: true, mustBeConnected: true, shouldHaveDecouplingCapacitor: true, recommendedDecouplingCapacitorCapacitance: "100nF"},
  pin41: {isInput: true, isOutput: true, isBidirectional: true, capabilities: ["spi_cs","i2c_scl","uart_rx"], canUseInternalPullup: true, canUseInternalPulldown: true, canUsePushPull: true, isGpio: true},
  pin40: {isInput: true, isOutput: true, isBidirectional: true, capabilities: ["spi_miso","i2c_sda","uart_tx"], canUseInternalPullup: true, canUseInternalPulldown: true, canUsePushPull: true, isGpio: true},
  pin39: {isInput: true, isOutput: true, isBidirectional: true, capabilities: ["spi_mosi","i2c_scl"], canUseInternalPullup: true, canUseInternalPulldown: true, canUsePushPull: true, isGpio: true},
  pin38: {isInput: true, isOutput: true, isBidirectional: true, capabilities: ["spi_sck","i2c_sda"], canUseInternalPullup: true, canUseInternalPulldown: true, canUsePushPull: true, isGpio: true},
  pin37: {isInput: true, isOutput: true, isBidirectional: true, capabilities: ["spi_cs","i2c_scl","uart_rx"], canUseInternalPullup: true, canUseInternalPulldown: true, canUsePushPull: true, isGpio: true},
  pin36: {isInput: true, isOutput: true, isBidirectional: true, capabilities: ["spi_miso","i2c_sda","uart_tx"], canUseInternalPullup: true, canUseInternalPulldown: true, canUsePushPull: true, isGpio: true},
  pin35: {isInput: true, isOutput: true, isBidirectional: true, capabilities: ["spi_mosi","i2c_scl"], canUseInternalPullup: true, canUseInternalPulldown: true, canUsePushPull: true, isGpio: true},
  pin34: {isInput: true, isOutput: true, isBidirectional: true, capabilities: ["spi_sck","i2c_sda"], canUseInternalPullup: true, canUseInternalPulldown: true, canUsePushPull: true, isGpio: true},
  pin33: {isInput: true, capabilities: [], requiresPower: true, mustBeConnected: true, shouldHaveDecouplingCapacitor: true, recommendedDecouplingCapacitorCapacitance: "100nF"},
  pin32: {isInput: true, isOutput: true, isBidirectional: true, capabilities: ["spi_cs","i2c_scl","uart_rx"], canUseInternalPullup: true, canUseInternalPulldown: true, canUsePushPull: true, isGpio: true},
  pin31: {isInput: true, isOutput: true, isBidirectional: true, capabilities: ["spi_miso","i2c_sda","uart_tx"], canUseInternalPullup: true, canUseInternalPulldown: true, canUsePushPull: true, isGpio: true},
  pin30: {isInput: true, isOutput: true, isBidirectional: true, capabilities: ["spi_mosi","i2c_scl"], canUseInternalPullup: true, canUseInternalPulldown: true, canUsePushPull: true, isGpio: true},
  pin29: {isInput: true, isOutput: true, isBidirectional: true, capabilities: ["spi_sck","i2c_sda"], canUseInternalPullup: true, canUseInternalPulldown: true, canUsePushPull: true, isGpio: true},
  pin28: {isInput: true, isOutput: true, isBidirectional: true, capabilities: ["spi_cs","i2c_scl","uart_rx"], canUseInternalPullup: true, canUseInternalPulldown: true, canUsePushPull: true, isGpio: true},
  pin27: {isInput: true, isOutput: true, isBidirectional: true, capabilities: ["spi_miso","i2c_sda","uart_tx"], canUseInternalPullup: true, canUseInternalPulldown: true, canUsePushPull: true, isGpio: true},
  pin26: {isInput: true, capabilities: [], canUseInternalPullup: true},
  pin25: {isInput: true, isOutput: true, isBidirectional: true, capabilities: [], canUseInternalPullup: true, canUseInternalPulldown: true},
  pin24: {isInput: true, capabilities: [], canUseInternalPullup: true, canUseInternalPulldown: true},
  pin23: {isInput: true, capabilities: [], requiresPower: true, mustBeConnected: true, shouldHaveDecouplingCapacitor: true, recommendedDecouplingCapacitorCapacitance: "100nF"},
  pin22: {isInput: true, capabilities: [], requiresPower: true, mustBeConnected: true, shouldHaveDecouplingCapacitor: true, recommendedDecouplingCapacitorCapacitance: "100nF"},
  pin21: {isOutput: true, capabilities: []},
  pin20: {isInput: true, capabilities: []},
  pin19: {isInput: true, capabilities: [], requiresGround: true, requiresVoltage: 0, mustBeConnected: true},
  pin18: {isInput: true, isOutput: true, isBidirectional: true, capabilities: ["spi_mosi","i2c_scl"], canUseInternalPullup: true, canUseInternalPulldown: true, canUsePushPull: true, isGpio: true},
  pin17: {isInput: true, isOutput: true, isBidirectional: true, capabilities: ["spi_sck","i2c_sda"], canUseInternalPullup: true, canUseInternalPulldown: true, canUsePushPull: true, isGpio: true},
  pin16: {isInput: true, isOutput: true, isBidirectional: true, capabilities: ["spi_cs","i2c_scl","uart_rx"], canUseInternalPullup: true, canUseInternalPulldown: true, canUsePushPull: true, isGpio: true},
  pin15: {isInput: true, isOutput: true, isBidirectional: true, capabilities: ["spi_miso","i2c_sda","uart_tx"], canUseInternalPullup: true, canUseInternalPulldown: true, canUsePushPull: true, isGpio: true},
  pin14: {isInput: true, isOutput: true, isBidirectional: true, capabilities: ["spi_mosi","i2c_scl"], canUseInternalPullup: true, canUseInternalPulldown: true, canUsePushPull: true, isGpio: true},
  pin13: {isInput: true, isOutput: true, isBidirectional: true, capabilities: ["spi_sck","i2c_sda"], canUseInternalPullup: true, canUseInternalPulldown: true, canUsePushPull: true, isGpio: true},
  pin12: {isInput: true, isOutput: true, isBidirectional: true, capabilities: ["spi_cs","i2c_scl","uart_rx"], canUseInternalPullup: true, canUseInternalPulldown: true, canUsePushPull: true, isGpio: true},
  pin11: {isInput: true, isOutput: true, isBidirectional: true, capabilities: ["spi_miso","i2c_sda","uart_tx"], canUseInternalPullup: true, canUseInternalPulldown: true, canUsePushPull: true, isGpio: true},
  pin10: {isInput: true, capabilities: [], requiresPower: true, mustBeConnected: true, shouldHaveDecouplingCapacitor: true, recommendedDecouplingCapacitorCapacitance: "100nF"},
  pin9: {isInput: true, isOutput: true, isBidirectional: true, capabilities: ["spi_mosi","i2c_scl"], canUseInternalPullup: true, canUseInternalPulldown: true, canUsePushPull: true, isGpio: true},
  pin8: {isInput: true, isOutput: true, isBidirectional: true, capabilities: ["spi_sck","i2c_sda"], canUseInternalPullup: true, canUseInternalPulldown: true, canUsePushPull: true, isGpio: true},
  pin7: {isInput: true, isOutput: true, isBidirectional: true, capabilities: ["spi_cs","i2c_scl","uart_rx"], canUseInternalPullup: true, canUseInternalPulldown: true, canUsePushPull: true, isGpio: true},
  pin6: {isInput: true, isOutput: true, isBidirectional: true, capabilities: ["spi_miso","i2c_sda","uart_tx"], canUseInternalPullup: true, canUseInternalPulldown: true, canUsePushPull: true, isGpio: true},
  pin5: {isInput: true, isOutput: true, isBidirectional: true, capabilities: ["spi_mosi","i2c_scl"], canUseInternalPullup: true, canUseInternalPulldown: true, canUsePushPull: true, isGpio: true},
  pin4: {isInput: true, isOutput: true, isBidirectional: true, capabilities: ["spi_sck","i2c_sda"], canUseInternalPullup: true, canUseInternalPulldown: true, canUsePushPull: true, isGpio: true},
  pin3: {isInput: true, isOutput: true, isBidirectional: true, capabilities: ["spi_cs","i2c_scl","uart_rx"], canUseInternalPullup: true, canUseInternalPulldown: true, canUsePushPull: true, isGpio: true},
  pin2: {isInput: true, isOutput: true, isBidirectional: true, capabilities: ["spi_miso","i2c_sda","uart_tx"], canUseInternalPullup: true, canUseInternalPulldown: true, canUsePushPull: true, isGpio: true},
  pin1: {isInput: true, capabilities: [], requiresPower: true, mustBeConnected: true, shouldHaveDecouplingCapacitor: true, recommendedDecouplingCapacitorCapacitance: "100nF"}
} satisfies NonNullable<ChipProps["pinAttributes"]>

const footprinterPinLabels = {
  ...pinLabels,
  "pin57": [...pinLabels["pin57"], "thermalpad"],
} as const

export const RP2040 = (props: ChipProps<typeof pinLabels>) => {
  return (
    <chip
      pinLabels={footprinterPinLabels}
      pinAttributes={pinAttributes}
      supplierPartNumbers={{
  "jlcpcb": [
    "C2040"
  ]
}}
      manufacturerPartNumber="RP2040"
      footprint="qfn56_thermalpad3.1mmx3.1mm_p0.4mm_h7.9mm_pw0.2mm_pl0.85mm"
      cadModel={{
        objUrl: objPath,
        stepUrl: stepPath,
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0.000012699999956566899, y: -0.0001269999999067295, z: -0.02 },
      }}
      {...props}
    />
  )
}