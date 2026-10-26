import objPath from "./USB4215_03_A.obj"
import stepPath from "./USB4215_03_A.step"
import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin13: ["EH2"],
  pin14: ["EH1"],
  pin15: ["EH3"],
  pin16: ["EH4"],
  pin17: ["GND1","A1B12"],
  pin18: ["VBUS1","A4B9"],
  pin19: ["SBU2","B8"],
  pin20: ["CC1","A5"],
  pin21: ["Dn2","B7"],
  pin22: ["Dp1","A6"],
  pin23: ["Dn1","A7"],
  pin24: ["Dp2","B6"],
  pin25: ["SBU1","A8"],
  pin26: ["CC2","B5"],
  pin27: ["VBUS2","B4A9"],
  pin28: ["GND2","B1A12"]
} as const

export const USB4215_03_A = (props: ChipProps<typeof pinLabels>) => {
  return (
    <chip
      pinLabels={pinLabels}
      supplierPartNumbers={{
  "jlcpcb": [
    "C37616412"
  ]
}}
      manufacturerPartNumber="USB4215-03-A"
      footprint={<footprint>
        <platedhole  portHints={["pin14"]} pcbX="4.319905mm" pcbY="1.4250226mm" holeWidth="0.5999988mm" holeHeight="1.3999972mm" outerWidth="0.999998mm" outerHeight="1.7999964mm" shape="pill" />
<platedhole  portHints={["pin13"]} pcbX="-4.319905mm" pcbY="1.4250226mm" holeWidth="0.5999988mm" holeHeight="1.3999972mm" outerWidth="0.999998mm" outerHeight="1.7999964mm" shape="pill" />
<platedhole  portHints={["pin15"]} pcbX="-4.319905mm" pcbY="-2.5749694mm" holeWidth="0.5999988mm" holeHeight="1.7999964mm" outerWidth="0.999998mm" outerHeight="2.1999956mm" shape="pill" />
<platedhole  portHints={["pin16"]} pcbX="4.319905mm" pcbY="-2.5749694mm" holeWidth="0.5999988mm" holeHeight="1.7999964mm" outerWidth="0.999998mm" outerHeight="2.1999956mm" shape="pill" />
<smtpad portHints={["pin17"]} pcbX="-3.200019mm" pcbY="2.0249706mm" width="0.5999988mm" height="1.1999976mm" shape="rect" />
<smtpad portHints={["pin18"]} pcbX="-2.399919mm" pcbY="2.0249706mm" width="0.5999988mm" height="1.1999976mm" shape="rect" />
<smtpad portHints={["pin19"]} pcbX="-1.749933mm" pcbY="2.0249706mm" width="0.2999994mm" height="1.1999976mm" shape="rect" />
<smtpad portHints={["pin20"]} pcbX="-1.249807mm" pcbY="2.0249706mm" width="0.2999994mm" height="1.1999976mm" shape="rect" />
<smtpad portHints={["pin21"]} pcbX="-0.749935mm" pcbY="2.0249706mm" width="0.2999994mm" height="1.1999976mm" shape="rect" />
<smtpad portHints={["pin22"]} pcbX="-0.249809mm" pcbY="2.0249706mm" width="0.2999994mm" height="1.1999976mm" shape="rect" />
<smtpad portHints={["pin23"]} pcbX="0.250063mm" pcbY="2.0249706mm" width="0.2999994mm" height="1.1999976mm" shape="rect" />
<smtpad portHints={["pin24"]} pcbX="0.750189mm" pcbY="2.0249706mm" width="0.2999994mm" height="1.1999976mm" shape="rect" />
<smtpad portHints={["pin25"]} pcbX="1.250061mm" pcbY="2.0249706mm" width="0.2999994mm" height="1.1999976mm" shape="rect" />
<smtpad portHints={["pin26"]} pcbX="1.750187mm" pcbY="2.0249706mm" width="0.2999994mm" height="1.1999976mm" shape="rect" />
<smtpad portHints={["pin27"]} pcbX="2.400173mm" pcbY="2.0249706mm" width="0.5999988mm" height="1.1999976mm" shape="rect" />
<smtpad portHints={["pin28"]} pcbX="3.200019mm" pcbY="2.0249706mm" width="0.5999988mm" height="1.1999976mm" shape="rect" />
<silkscreenpath route={[{"x":4.2999913999999535,"y":-1.2441872000000558},{"x":4.2999913999999535,"y":0.29408760000001166}]} />
<silkscreenpath route={[{"x":4.2999913999999535,"y":-4.675041400000168},{"x":4.2999913999999535,"y":-3.9059040000000778}]} />
<silkscreenpath route={[{"x":-4.2999913999999535,"y":-1.2441872000000558},{"x":-4.2999913999999535,"y":0.29408760000001166}]} />
<silkscreenpath route={[{"x":-4.2999913999999535,"y":-4.675041400000168},{"x":-4.2999913999999535,"y":-3.9059040000000778}]} />
<silkscreenpath route={[{"x":4.2999913999999535,"y":-4.675041400000168},{"x":-4.2999913999999535,"y":-4.675041400000168}]} />
<silkscreentext text="{NAME}" pcbX="0.000381mm" pcbY="3.6345706mm" anchorAlignment="center" fontSize="1mm" />
<fabricationnotepath route={[{"x":4.526991200000111,"y":-4.475041800000099},{"x":4.489793761210763,"y":-4.564844361210817},{"x":4.399991200000045,"y":-4.602041800000052},{"x":-4.399991200000045,"y":-4.602041800000052},{"x":-4.489793761210763,"y":-4.564844361210817},{"x":-4.526991200000111,"y":-4.475041800000099},{"x":-4.526991200000111,"y":0.4249483999998347},{"x":-4.489793761210763,"y":0.5147509612105523},{"x":-4.399991200000045,"y":0.5519483999999011},{"x":-4.272991200000092,"y":-4.348041800000033},{"x":4.399991200000045,"y":0.5519483999999011},{"x":4.526991200000111,"y":-4.475041800000099}]} strokeWidth="0mm" isFilled hasStroke={false} />
<courtyardoutline outline={[{"x":-5.069904000000179,"y":2.874969399999941},{"x":5.069904000000065,"y":2.874969399999941},{"x":5.069904000000065,"y":-4.896034600000235},{"x":-5.069904000000179,"y":-4.896034600000235},{"x":-5.069904000000179,"y":2.874969399999941}]} />
      </footprint>}
      cadModel={{
        objUrl: objPath,
        stepUrl: stepPath,
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0.000012699999956566899, y: 1.3960414000001946, z: -1.6800016000000002 },
      }}
      {...props}
    />
  )
}