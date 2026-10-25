import objPath from "./W25Q16JVSSIQ.obj"
import stepPath from "./W25Q16JVSSIQ.step"
import { type ChipProps } from "tscircuit"
const pinLabels = {
  "pin1": [
    "CS"
  ],
  "pin2": [
    "DO",
    "IO1"
  ],
  "pin3": [
    "IO2"
  ],
  "pin4": [
    "GND"
  ],
  "pin8": [
    "VCC"
  ],
  "pin7": [
    "IO3"
  ],
  "pin6": [
    "CLK"
  ],
  "pin5": [
    "DI",
    "IO0"
  ]
} as const
export const W25Q16JVSSIQ = (props: ChipProps<typeof pinLabels>) => (
  <chip
    footprint={<footprint>
        <smtpad portHints={["pin1"]} pcbX="-1.9050000000000864mm" pcbY="-3.5300920000000815mm" layer="top" width="0.6299962mm" height="2.2500082mm" radius="0.3149981mm" shape="pill" />
<smtpad portHints={["pin2"]} pcbX="-0.6349999999999909mm" pcbY="-3.5300920000000815mm" layer="top" width="0.6299962mm" height="2.2500082mm" radius="0.3149981mm" shape="pill" />
<smtpad portHints={["pin3"]} pcbX="0.6349999999999909mm" pcbY="-3.5300920000000815mm" layer="top" width="0.6299962mm" height="2.2500082mm" radius="0.3149981mm" shape="pill" />
<smtpad portHints={["pin4"]} pcbX="1.9049999999999727mm" pcbY="-3.5300920000000815mm" layer="top" width="0.6299962mm" height="2.2500082mm" radius="0.3149981mm" shape="pill" />
<smtpad portHints={["pin8"]} pcbX="-1.9050000000000864mm" pcbY="3.5300920000000815mm" layer="top" width="0.6299962mm" height="2.2500082mm" radius="0.3149981mm" shape="pill" />
<smtpad portHints={["pin7"]} pcbX="-0.6349999999999909mm" pcbY="3.5300920000000815mm" layer="top" width="0.6299962mm" height="2.2500082mm" radius="0.3149981mm" shape="pill" />
<smtpad portHints={["pin6"]} pcbX="0.6349999999999909mm" pcbY="3.5300920000000815mm" layer="top" width="0.6299962mm" height="2.2500082mm" radius="0.3149981mm" shape="pill" />
<smtpad portHints={["pin5"]} pcbX="1.9049999999999727mm" pcbY="3.5300920000000815mm" layer="top" width="0.6299962mm" height="2.2500082mm" radius="0.3149981mm" shape="pill" />
<silkscreenpath route={[{"x":-2.6387044000000515,"y":-2.1763989999999467},{"x":-2.6387044000000515,"y":2.1763990000000604},{"x":2.6387044000000515,"y":2.1763990000000604},{"x":2.6387044000000515,"y":-2.1763989999999467},{"x":-2.6387044000000515,"y":-2.1763989999999467}]} strokeWidth={0.15239999999999998} />
<silkscreencircle pcbX={-1.9050000000000864} pcbY={-1.4239240000000564} radius={0.150114} layer="top" strokeWidth={0.29999939999999997} />
<silkscreencircle pcbX={-2.6723340000000917} pcbY={-3.5300920000000815} radius={0.150114} layer="top" strokeWidth={0.29999939999999997} />
<courtyardoutline outline={[{"x":-2.9000074000000495,"y":4.905096100000037},{"x":2.8999820000000227,"y":4.905096100000037},{"x":2.8999820000000227,"y":-4.905096100000037},{"x":-2.9000074000000495,"y":-4.905096100000037},{"x":-2.9000074000000495,"y":4.905096100000037}]} layer="top" />
      </footprint>}
    pinLabels={pinLabels}
    pinAttributes={{
  "pin1": {
    "isInput": true,
    "capabilities": [
      "spi_cs"
    ]
  },
  "pin2": {
    "isBidirectional": true,
    "canUseTriState": true,
    "canUsePushPull": true,
    "capabilities": [
      "spi_miso"
    ]
  },
  "pin3": {
    "isBidirectional": true,
    "canUseTriState": true,
    "canUsePushPull": true
  },
  "pin4": {
    "requiresGround": true
  },
  "pin8": {
    "requiresPower": true,
    "shouldHaveDecouplingCapacitor": true
  },
  "pin7": {
    "isBidirectional": true,
    "canUseTriState": true,
    "canUsePushPull": true
  },
  "pin6": {
    "isInput": true,
    "capabilities": [
      "spi_sck"
    ]
  },
  "pin5": {
    "isBidirectional": true,
    "canUseTriState": true,
    "canUsePushPull": true,
    "capabilities": [
      "spi_mosi"
    ]
  }
}}
    supplierPartNumbers={{
  "jlcpcb": [
    "C82317"
  ]
}}
    manufacturerPartNumber="W25Q16JVSSIQ"
    cadModel={{
        objUrl: objPath,
        stepUrl: stepPath,
        pcbRotationOffset: 0,
        modelOriginPosition: {"x":0.000012700000070253736,"y":-0.000012699999956566899,"z":-0.069425},
    }}
    {...props}
  />
)