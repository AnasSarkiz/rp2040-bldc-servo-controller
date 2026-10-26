import objPath from "./TPS55340RTER.obj"
import stepPath from "./TPS55340RTER.step"
import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["SW3"],
  pin2: ["VIN"],
  pin3: ["EN"],
  pin4: ["SS"],
  pin5: ["SYNC"],
  pin6: ["AGND"],
  pin7: ["COMP"],
  pin8: ["FB"],
  pin9: ["FREQ"],
  pin10: ["NC2"],
  pin11: ["PGND3"],
  pin12: ["PGND2"],
  pin13: ["PGND1"],
  pin14: ["NC1"],
  pin15: ["SW2"],
  pin16: ["SW1"],
  pin17: ["EP"]
} as const

const pinAttributes = {
  pin2: {requiresPower: true},
  pin6: {requiresGround: true},
  pin10: {doNotConnect: true},
  pin11: {requiresGround: true},
  pin12: {requiresGround: true},
  pin13: {requiresGround: true},
  pin14: {doNotConnect: true}
} as const

export const TPS55340RTER = (props: ChipProps<typeof pinLabels>) => {
  return (
    <chip
      pinLabels={pinLabels}
      pinAttributes={pinAttributes}
      supplierPartNumbers={{
  "jlcpcb": [
    "C169167"
  ]
}}
      manufacturerPartNumber="TPS55340RTER"
      footprint={<footprint>
        <smtpad portHints={["pin17"]} points={[{x: "-0.849884mm", y: "-0.499872mm"}, {x: "-0.849884mm", y: "0.850138mm"}, {x: "0.850138mm", y: "0.850138mm"}, {x: "0.850138mm", y: "-0.849884mm"}, {x: "-0.499872mm", y: "-0.849884mm"}]} shape="polygon" />
<smtpad portHints={["pin16"]} pcbX="-1.499997mm" pcbY="-0.749173mm" width="0.7999984mm" height="0.2800096mm" shape="rect" />
<smtpad portHints={["pin15"]} pcbX="-1.499997mm" pcbY="-0.248793mm" width="0.7999984mm" height="0.2800096mm" shape="rect" />
<smtpad portHints={["pin14"]} pcbX="-1.499997mm" pcbY="0.249047mm" width="0.7999984mm" height="0.2800096mm" shape="rect" />
<smtpad portHints={["pin13"]} pcbX="-1.499997mm" pcbY="0.749427mm" width="0.7999984mm" height="0.2800096mm" shape="rect" />
<smtpad portHints={["pin12"]} pcbX="-0.749173mm" pcbY="1.499997mm" width="0.2800096mm" height="0.7999984mm" shape="rect" />
<smtpad portHints={["pin11"]} pcbX="-0.248793mm" pcbY="1.499997mm" width="0.2800096mm" height="0.7999984mm" shape="rect" />
<smtpad portHints={["pin10"]} pcbX="0.249047mm" pcbY="1.499997mm" width="0.2800096mm" height="0.7999984mm" shape="rect" />
<smtpad portHints={["pin9"]} pcbX="0.749427mm" pcbY="1.499997mm" width="0.2800096mm" height="0.7999984mm" shape="rect" />
<smtpad portHints={["pin8"]} pcbX="1.499997mm" pcbY="0.749427mm" width="0.7999984mm" height="0.2800096mm" shape="rect" />
<smtpad portHints={["pin7"]} pcbX="1.499997mm" pcbY="0.249047mm" width="0.7999984mm" height="0.2800096mm" shape="rect" />
<smtpad portHints={["pin6"]} pcbX="1.499997mm" pcbY="-0.248793mm" width="0.7999984mm" height="0.2800096mm" shape="rect" />
<smtpad portHints={["pin5"]} pcbX="1.499997mm" pcbY="-0.749173mm" width="0.7999984mm" height="0.2800096mm" shape="rect" />
<smtpad portHints={["pin4"]} pcbX="0.749427mm" pcbY="-1.499997mm" width="0.2800096mm" height="0.7999984mm" shape="rect" />
<smtpad portHints={["pin3"]} pcbX="0.249047mm" pcbY="-1.499997mm" width="0.2800096mm" height="0.7999984mm" shape="rect" />
<smtpad portHints={["pin2"]} pcbX="-0.248793mm" pcbY="-1.499997mm" width="0.2800096mm" height="0.7999984mm" shape="rect" />
<smtpad portHints={["pin1"]} pcbX="-0.749173mm" pcbY="-1.499997mm" width="0.2800096mm" height="0.7999984mm" shape="rect" />
<silkscreenpath route={[{"x":-1.5000477999999973,"y":1.5000986000000012},{"x":-1.0442956000000052,"y":1.5000986000000012}]} />
<silkscreenpath route={[{"x":1.0441939999999974,"y":1.5000986000000012},{"x":1.4999461999999966,"y":1.5000986000000012}]} />
<silkscreenpath route={[{"x":-1.5000477999999973,"y":-1.4998953999999998},{"x":-1.0442956000000052,"y":-1.4998953999999998}]} />
<silkscreenpath route={[{"x":1.0441939999999974,"y":-1.4998953999999998},{"x":1.4999461999999966,"y":-1.4998953999999998}]} />
<silkscreenpath route={[{"x":-1.5000477999999973,"y":1.5000986000000012},{"x":-1.5000477999999973,"y":1.044346399999995}]} />
<silkscreenpath route={[{"x":-1.5000477999999973,"y":-1.0441432000000077},{"x":-1.5000477999999973,"y":-1.4998953999999998}]} />
<silkscreenpath route={[{"x":1.4999461999999966,"y":-1.4998953999999998},{"x":1.4999461999999966,"y":-1.0441432000000077}]} />
<silkscreenpath route={[{"x":1.4999461999999966,"y":1.044346399999995},{"x":1.4999461999999966,"y":1.5000986000000012}]} />
<silkscreenpath route={[{"x":-1.251305600000002,"y":-1.7399508000000026},{"x":-1.250035600000004,"y":-1.7598850891640723},{"x":-1.2487655999999987,"y":-1.7399508000000026}]} />
<silkscreentext text="{NAME}" pcbX="-0.006985mm" pcbY="2.911985mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-2.149996199999997,"y":2.1499961999999897},{"x":2.149996199999997,"y":2.1499961999999897},{"x":2.149996199999997,"y":-2.1499961999999897},{"x":-2.149996199999997,"y":-2.1499961999999897},{"x":-2.149996199999997,"y":2.1499961999999897}]} />
      </footprint>}
      cadModel={{
        objUrl: objPath,
        stepUrl: stepPath,
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0.000012699999999199463, y: 0, z: -0.02 },
      }}
      {...props}
    />
  )
}