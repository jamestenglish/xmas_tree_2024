import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

import {
  EffectComposer,
  Bloom,
  ToneMapping,
} from "@react-three/postprocessing";
import { useCallback, useMemo } from "react";

import getCrunchedNumbers from "./functions/getCrunchedNumbers";
import { PositionsType } from "~/routes/_index";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type {} from "@redux-devtools/extension"; // required for devtools typing
import { useShallow } from "zustand/shallow";
import TreeVisScatter from "./TreeVisScatter";
import { useForm } from "react-hook-form";

interface BearState {
  sphere: SphereVisProps | null;
  setSphere: (sphere: SphereVisProps) => void;
  min: number;
  setMin: (min: number) => void;
  max: number;
  setMax: (max: number) => void;
  radius: number;
  setRadius: (radius: number) => void;
  plotsOn: string;
  setPlotsOn: (plotsOn: string) => void;
}

export const useStore = create<BearState>()(
  devtools((set) => ({
    sphere: null,
    setSphere: (sphere) => set({ sphere }),
    min: 59,
    setMin: (min) => set({ min }),
    max: 63,
    setMax: (max) => set({ max }),
    radius: 6,
    setRadius: (radius) => set({ radius }),
    plotsOn: "01234",
    setPlotsOn: (plotsOn) => set({ plotsOn }),
  })),
);

interface PositionMeta {
  x: number;
  y: number;
  maxDifference: number;
  ledIndex: number;
}

interface PositionData {
  position: PositionsType;
  ledPositionMeta: PositionMeta;
}

interface PositionsObj {
  front?: Array<PositionData>;
  back?: Array<PositionData>;
  left?: Array<PositionData>;
  right?: Array<PositionData>;
}

interface CandidatePoint {
  ledIndex: string;
  x: number;
  y: number;
  z: number;
  maxDifference: number;
  positionsUsed: Array<PositionsType>;
}

interface DataElement {
  positionsObj: PositionsObj;
  candidatePoints: Array<CandidatePoint>;
}

interface Data {
  [key: string]: DataElement;
}

interface LightSphereVisProps {
  sphere: SphereVisProps;
  index: number;
}
function LightSphereVis({ sphere }: LightSphereVisProps) {
  //
  const { setSphere, radius } = useStore(
    useShallow((state) => ({
      radius: state.radius,
      setSphere: state.setSphere,
    })),
  );
  const { color } = sphere;

  const onClick = useCallback(() => {
    console.log(JSON.stringify(sphere, null, 2));

    setSphere(sphere);
  }, [setSphere, sphere]);

  return (
    <group>
      <mesh position={sphere.position} frustumCulled={false} onClick={onClick}>
        <sphereGeometry args={[radius, 16, 16]} />

        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          opacity={undefined}
        />
      </mesh>
    </group>
  );
}

export interface SphereVisProps {
  position: [number, number, number];
  color: THREE.Color;
  id: unknown;
  ledIndex: unknown;
  positionsUsed: Array<PositionsType>;
}

const getSpheres = (min: number, max: number) => {
  const json = getCrunchedNumbers() as Data;
  const allSpheres: SphereVisProps[] = [];
  const bestSpheres: SphereVisProps[] = [];

  Object.keys(json).forEach((key, _index) => {
    if (_index > max || _index < min) {
      return;
    }
    const led = json[key];
    led.candidatePoints.forEach((candidatePoint, i) => {
      const { x, y, z, ledIndex, positionsUsed } = candidatePoint;

      let color: THREE.Color = new THREE.Color(0xffffff);
      if (i === 0) {
        color = new THREE.Color(0xffffff);
      } else if (i === 1) {
        color = new THREE.Color(0xff0000);
      } else if (i === 2) {
        color = new THREE.Color(0x00ff00);
      } else if (i === 4) {
        color = new THREE.Color(0x0000ff);
      }

      console.log({ x, y, z });
      const sphere: SphereVisProps = {
        // position: [x / 10.0, y / 10.0, z / 10.0],
        position: [x, y, z],

        color,
        id: key,
        ledIndex,
        positionsUsed,
      };
      allSpheres.push(sphere);

      if (i === 0) {
        bestSpheres.push(sphere);
      }
    });
  });

  console.log(allSpheres.length);
  return { allSpheres, bestSpheres };
};

// const TreeVisScene = () => {
//   const { min, max } = useStore(
//     useShallow((state) => ({ min: state.min, max: state.max })),
//   );
//   const spheres = useMemo(() => getSpheres(min, max), [max, min]);

//   return (
//     <>
//       {spheres.map((sphere, index) => {
//         return <LightSphereVis key={index} index={index} sphere={sphere} />;
//       })}
//     </>
//   );
// };

export default function TreeVis() {
  const {
    plotsOn,
    setPlotsOn,
    sphere,
    setMin,
    setMax,
    setRadius,
    radius,
    min,
    max,
  } = useStore(
    useShallow((state) => ({
      sphere: state.sphere,
      setMin: state.setMin,
      setMax: state.setMax,
      setRadius: state.setRadius,
      radius: state.radius,
      min: state.min,
      max: state.max,
      plotsOn: state.plotsOn,
      setPlotsOn: state.setPlotsOn,
    })),
  );

  const { register } = useForm({ values: { plotsOn, radius, min, max } });

  const { allSpheres, bestSpheres } = useMemo(
    () => getSpheres(min, max),
    [max, min],
  );
  console.log({ sphere2: sphere });
  return (
    <>
      <div className="app-container">
        <div className="tmp-main">
          <div className="content">
            <div className="p-6">
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-8">
                  <TreeVisScatter
                    allSpheres={allSpheres}
                    bestSpheres={bestSpheres}
                  />
                </div>
                <div>
                  <input
                    style={{ border: "1px solid black" }}
                    type="number"
                    {...register("min", { valueAsNumber: true })}
                    onBlur={(
                      event: React.FocusEvent<HTMLInputElement, Element>,
                    ) => setMin(Number(event.target.value))}
                  />
                  <input
                    style={{ border: "1px solid black" }}
                    type="number"
                    {...register("max", { valueAsNumber: true })}
                    onBlur={(
                      event: React.FocusEvent<HTMLInputElement, Element>,
                    ) => setMax(Number(event.target.value))}
                  />

                  <input
                    style={{ border: "1px solid black" }}
                    type="number"
                    {...register("radius", { valueAsNumber: true })}
                    onBlur={(
                      event: React.FocusEvent<HTMLInputElement, Element>,
                    ) => setRadius(Number(event.target.value))}
                  />
                  <input
                    style={{ border: "1px solid black" }}
                    {...register("plotsOn")}
                    onBlur={(
                      event: React.FocusEvent<HTMLInputElement, Element>,
                    ) => setPlotsOn(event.target.value)}
                  />

                  <pre>{sphere ? JSON.stringify(sphere, null, 2) : <></>}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/*

     <Canvas
                    style={{ height: "100vh" }}
                    camera={{
                      position: [0, 0, 50],
                      fov: 75,
                      near: 0.01,
                      far: 8000,
                    }}
                  >
                    <color attach="background" args={["#112233"]} />
                    <EffectComposer>
                      <Bloom
                        mipmapBlur
                        luminanceThreshold={0.1}
                        levels={8}
                        intensity={0.4 * 4}
                      />
                      <ToneMapping />
                    </EffectComposer>
                    <TreeVisScene />
                    <OrbitControls />
                  </Canvas> 
                  */
