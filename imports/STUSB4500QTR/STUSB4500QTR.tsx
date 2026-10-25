import objPath from "./STUSB4500QTR.obj"
import stepPath from "./STUSB4500QTR.step"
import { type ChipProps } from "tscircuit"
const pinLabels = {
  "pin1": [
    "CC1DB"
  ],
  "pin2": [
    "CC1"
  ],
  "pin3": [
    "NC"
  ],
  "pin4": [
    "CC2"
  ],
  "pin5": [
    "CC2DB"
  ],
  "pin6": [
    "RESET"
  ],
  "pin7": [
    "SCL"
  ],
  "pin8": [
    "SDA"
  ],
  "pin9": [
    "DISCH"
  ],
  "pin10": [
    "GND"
  ],
  "pin11": [
    "ATTACH"
  ],
  "pin12": [
    "ADDR0"
  ],
  "pin13": [
    "ADDR1"
  ],
  "pin14": [
    "POWER_OK3"
  ],
  "pin15": [
    "GPIO"
  ],
  "pin16": [
    "VBUS_EN_SNK"
  ],
  "pin17": [
    "A_B_SIDE"
  ],
  "pin18": [
    "VBUS_VS_DISCH"
  ],
  "pin19": [
    "ALERT"
  ],
  "pin20": [
    "POWER_OK2"
  ],
  "pin21": [
    "VREG_1V2"
  ],
  "pin22": [
    "VSYS"
  ],
  "pin23": [
    "VREG_2V7"
  ],
  "pin24": [
    "VDD"
  ],
  "pin25": [
    "EP"
  ]
} as const
export const STUSB4500QTR = (props: ChipProps<typeof pinLabels>) => (
  <chip
    footprint={<footprint>
        <smtpad portHints={["pin1"]} pcbX="-1.249934000000053mm" pcbY="-1.99999600000001mm" layer="top" width="0.2800096mm" height="0.6999986mm" radius="0.1400048mm" shape="pill" />
<smtpad portHints={["pin2"]} pcbX="-0.7500620000000708mm" pcbY="-1.99999600000001mm" layer="top" width="0.2800096mm" height="0.6999986mm" radius="0.1400048mm" shape="pill" />
<smtpad portHints={["pin3"]} pcbX="-0.2499359999999342mm" pcbY="-1.99999600000001mm" layer="top" width="0.2800096mm" height="0.6999986mm" radius="0.1400048mm" shape="pill" />
<smtpad portHints={["pin4"]} pcbX="0.24993599999982052mm" pcbY="-1.99999600000001mm" layer="top" width="0.2800096mm" height="0.6999986mm" radius="0.1400048mm" shape="pill" />
<smtpad portHints={["pin5"]} pcbX="0.7500619999999572mm" pcbY="-1.99999600000001mm" layer="top" width="0.2800096mm" height="0.6999986mm" radius="0.1400048mm" shape="pill" />
<smtpad portHints={["pin6"]} pcbX="1.2499339999999393mm" pcbY="-1.99999600000001mm" layer="top" width="0.2800096mm" height="0.6999986mm" radius="0.1400048mm" shape="pill" />
<smtpad portHints={["pin7"]} pcbX="1.9999960000001238mm" pcbY="-1.249934000000053mm" layer="top" width="0.6999986mm" height="0.2800096mm" radius="0.1400048mm" shape="pill" />
<smtpad portHints={["pin8"]} pcbX="1.9999960000001238mm" pcbY="-0.7500619999999572mm" layer="top" width="0.6999986mm" height="0.2800096mm" radius="0.1400048mm" shape="pill" />
<smtpad portHints={["pin9"]} pcbX="1.9999960000001238mm" pcbY="-0.2499360000000479mm" layer="top" width="0.6999986mm" height="0.2800096mm" radius="0.1400048mm" shape="pill" />
<smtpad portHints={["pin10"]} pcbX="1.9999960000001238mm" pcbY="0.2499360000000479mm" layer="top" width="0.6999986mm" height="0.2800096mm" radius="0.1400048mm" shape="pill" />
<smtpad portHints={["pin11"]} pcbX="1.9999960000001238mm" pcbY="0.7500620000001845mm" layer="top" width="0.6999986mm" height="0.2800096mm" radius="0.1400048mm" shape="pill" />
<smtpad portHints={["pin12"]} pcbX="1.9999960000001238mm" pcbY="1.249934000000053mm" layer="top" width="0.6999986mm" height="0.2800096mm" radius="0.1400048mm" shape="pill" />
<smtpad portHints={["pin13"]} pcbX="1.2499339999999393mm" pcbY="1.99999600000001mm" layer="top" width="0.2800096mm" height="0.6999986mm" radius="0.1400048mm" shape="pill" />
<smtpad portHints={["pin14"]} pcbX="0.7500619999999572mm" pcbY="1.99999600000001mm" layer="top" width="0.2800096mm" height="0.6999986mm" radius="0.1400048mm" shape="pill" />
<smtpad portHints={["pin15"]} pcbX="0.24993599999982052mm" pcbY="1.99999600000001mm" layer="top" width="0.2800096mm" height="0.6999986mm" radius="0.1400048mm" shape="pill" />
<smtpad portHints={["pin16"]} pcbX="-0.2499359999999342mm" pcbY="1.99999600000001mm" layer="top" width="0.2800096mm" height="0.6999986mm" radius="0.1400048mm" shape="pill" />
<smtpad portHints={["pin17"]} pcbX="-0.7500620000000708mm" pcbY="1.99999600000001mm" layer="top" width="0.2800096mm" height="0.6999986mm" radius="0.1400048mm" shape="pill" />
<smtpad portHints={["pin18"]} pcbX="-1.249934000000053mm" pcbY="1.99999600000001mm" layer="top" width="0.2800096mm" height="0.6999986mm" radius="0.1400048mm" shape="pill" />
<smtpad portHints={["pin19"]} pcbX="-1.99999600000001mm" pcbY="1.249934000000053mm" layer="top" width="0.6999986mm" height="0.2800096mm" radius="0.1400048mm" shape="pill" />
<smtpad portHints={["pin20"]} pcbX="-1.99999600000001mm" pcbY="0.7500620000001845mm" layer="top" width="0.6999986mm" height="0.2800096mm" radius="0.1400048mm" shape="pill" />
<smtpad portHints={["pin21"]} pcbX="-1.99999600000001mm" pcbY="0.2499360000000479mm" layer="top" width="0.6999986mm" height="0.2800096mm" radius="0.1400048mm" shape="pill" />
<smtpad portHints={["pin22"]} pcbX="-1.99999600000001mm" pcbY="-0.2499360000000479mm" layer="top" width="0.6999986mm" height="0.2800096mm" radius="0.1400048mm" shape="pill" />
<smtpad portHints={["pin23"]} pcbX="-1.99999600000001mm" pcbY="-0.7500619999999572mm" layer="top" width="0.6999986mm" height="0.2800096mm" radius="0.1400048mm" shape="pill" />
<smtpad portHints={["pin24"]} pcbX="-1.99999600000001mm" pcbY="-1.249934000000053mm" layer="top" width="0.6999986mm" height="0.2800096mm" radius="0.1400048mm" shape="pill" />
<smtpad portHints={["pin25"]} pcbX="0.01269999999999527mm" pcbY="0mm" layer="top" width="2.7999944mm" height="2.7999944mm" shape="rect" />
<silkscreenpath route={[{"x":2.1628099999998085,"y":1.7500345999999354},{"x":2.1628099999998085,"y":2.1501353999999537},{"x":1.7627599999999575,"y":2.1501353999999537}]} strokeWidth={0.19999959999999997} />
<silkscreenpath route={[{"x":-2.137384599999905,"y":1.7500345999999354},{"x":-2.137384599999905,"y":2.1501353999999537},{"x":-1.737359999999967,"y":2.1501353999999537}]} strokeWidth={0.19999959999999997} />
<silkscreenpath route={[{"x":-1.737359999999967,"y":-2.1501353999999537},{"x":-2.137384599999905,"y":-2.1501353999999537},{"x":-2.137384599999905,"y":-1.750085399999989}]} strokeWidth={0.19999959999999997} />
<silkscreenpath route={[{"x":2.1628099999998085,"y":-1.750085399999989},{"x":2.1628099999998085,"y":-2.1501353999999537},{"x":1.7627599999999575,"y":-2.1501353999999537}]} strokeWidth={0.19999959999999997} />
<courtyardoutline outline={[{"x":-2.599995300000046,"y":2.599995300000046},{"x":2.5999953000001597,"y":2.599995300000046},{"x":2.5999953000001597,"y":-2.599995300000046},{"x":-2.599995300000046,"y":-2.599995300000046},{"x":-2.599995300000046,"y":2.599995300000046}]} layer="top" />
      </footprint>}
    pinLabels={pinLabels}
    pinAttributes={{
  "pin1": {
    "isBidirectional": true
  },
  "pin2": {
    "isBidirectional": true
  },
  "pin3": {
    "doNotConnect": true
  },
  "pin4": {
    "isBidirectional": true
  },
  "pin5": {
    "isBidirectional": true
  },
  "pin6": {
    "isInput": true
  },
  "pin7": {
    "isInput": true,
    "needsExternalPullup": true,
    "capabilities": [
      "i2c_scl"
    ]
  },
  "pin8": {
    "isBidirectional": true,
    "needsExternalPullup": true,
    "canUseOpenDrain": true,
    "capabilities": [
      "i2c_sda"
    ]
  },
  "pin9": {
    "isBidirectional": true,
    "canUseOpenDrain": true
  },
  "pin10": {
    "requiresGround": true
  },
  "pin11": {
    "isOutput": true,
    "needsExternalPullup": true,
    "canUseOpenDrain": true
  },
  "pin12": {
    "isInput": true
  },
  "pin13": {
    "isInput": true
  },
  "pin14": {
    "isOutput": true,
    "needsExternalPullup": true,
    "canUseOpenDrain": true
  },
  "pin15": {
    "isOutput": true,
    "needsExternalPullup": true,
    "canUseOpenDrain": true
  },
  "pin16": {
    "isOutput": true,
    "needsExternalPullup": true,
    "canUseOpenDrain": true
  },
  "pin17": {
    "isOutput": true,
    "needsExternalPullup": true,
    "canUseOpenDrain": true
  },
  "pin18": {
    "isBidirectional": true
  },
  "pin19": {
    "isOutput": true,
    "needsExternalPullup": true,
    "canUseOpenDrain": true
  },
  "pin20": {
    "isOutput": true,
    "needsExternalPullup": true,
    "canUseOpenDrain": true
  },
  "pin21": {
    "isOutput": true,
    "providesVoltage": "1.2V",
    "shouldHaveDecouplingCapacitor": true,
    "recommendedDecouplingCapacitorCapacitance": "1uF"
  },
  "pin22": {
    "requiresPower": true
  },
  "pin23": {
    "isOutput": true,
    "providesVoltage": "2.7V",
    "shouldHaveDecouplingCapacitor": true,
    "recommendedDecouplingCapacitorCapacitance": "1uF"
  },
  "pin24": {
    "requiresPower": true
  },
  "pin25": {
    "requiresGround": true
  }
}}
    supplierPartNumbers={{
  "jlcpcb": [
    "C2678061"
  ]
}}
    manufacturerPartNumber="STUSB4500QTR"
    cadModel={{
        objUrl: objPath,
        stepUrl: stepPath,
        pcbRotationOffset: 0,
        modelOriginPosition: {"x":-0.000012699999842880061,"y":-0.000012700000070253736,"z":0},
    }}
    {...props}
  />
)