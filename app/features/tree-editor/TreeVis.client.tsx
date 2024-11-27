import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

import {
  EffectComposer,
  Bloom,
  ToneMapping,
} from "@react-three/postprocessing";
import { useMemo } from "react";

import json from "./functions/getCrunchedNumbers";

/*
{
    "sphere": {
        "position": [
            41.849492900608524,
            39.988403041825094,
            3.3580121703853956
        ],
        "color": 16777215,
        "id": "890",
        "ledIndex": "890",
        "positionsUsed": [
            "front",
            "left"
        ]
    }
}
  {
    "sphere": {
        "position": [
            41.849492900608524,
            40.1734335839599,
            3.3580121703853956
        ],
        "color": 65280,
        "id": "890",
        "ledIndex": "890",
        "positionsUsed": [
            "front",
            "right"
        ]
    }
}

---

{
    "sphere": {
        "position": [
            38.818938547486034,
            46.40632350434635,
            16.8495530726257
        ],
        "color": 16777215,
        "id": "952",
        "ledIndex": "952",
        "positionsUsed": [
            "front",
            "left"
        ]
    }
}
{
    "sphere": {
        "position": [
            38.818938547486034,
            46.34678899082569,
            16.8495530726257
        ],
        "color": 16711680,
        "id": "952",
        "ledIndex": "952",
        "positionsUsed": [
            "front",
            "right"
        ]
    }
}
    ------------
{
  "position": [
    55.98634285714286,
    51.1138067061144,
    38.469771428571434
  ],
  "color": 16777215,
  "id": "61",
  "ledIndex": "61",
  "positionsUsed": [
    "front",
    "right"
  ]
}
{
  "position": [
    55.98634285714286,
    46.83925065117211,
    38.469771428571434
  ],
  "color": 65280,
  "id": "61",
  "ledIndex": "61",
  "positionsUsed": [
    "front",
    "left"
  ]
}


--------------
{
  "position": [
    56.09371007371008,
    47.09867498051442,
    38.23061425061425
  ],
  "color": 16777215,
  "id": "60",
  "ledIndex": "60",
  "positionsUsed": [
    "front",
    "left"
  ]
}
TreeVis.client.tsx:103 {
  "position": [
    56.09371007371008,
    51.80886762360446,
    38.23061425061425
  ],
  "color": 16711680,
  "id": "60",
  "ledIndex": "60",
  "positionsUsed": [
    "front",
    "right"
  ]
}
TreeVis.client.tsx:103 {
  "position": [
    59.4887306501548,
    47.09867498051442,
    41.473065015479875
  ],
  "color": 65280,
  "id": "60",
  "ledIndex": "60",
  "positionsUsed": [
    "back",
    "left"
  ]
}
    */

interface LightSphereVisProps {
  sphere: SphereVisProps;
  index: number;
}
function LightSphereVis({ sphere }: LightSphereVisProps) {
  //

  const { color } = sphere;

  return (
    <group>
      {/* Sphere */}
      <mesh
        position={sphere.position}
        frustumCulled={false}
        onClick={() => {
          console.log(JSON.stringify(sphere, null, 2));
        }}
      >
        <sphereGeometry args={[0.1, 16, 16]} />

        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          opacity={undefined}
        />
      </mesh>
      {/* Line from sphere to sample point on the cylinder */}
    </group>
  );
}

export interface SphereVisProps {
  position: [number, number, number];
  color: THREE.Color;
  id: unknown;
  ledIndex: unknown;
  positionsUsed: unknown;
}

const getSpheres = () => {
  const generatedSpheres: SphereVisProps[] = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newJson = json as any;
  Object.keys(json).forEach((key, _index) => {
    if (_index > 63 || _index < 59) {
      return;
    }
    const led = newJson[key];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    led.candidatePoints.forEach((candidatePoint: any, i: number) => {
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

      generatedSpheres.push({
        position: [x / 10, y / 10, z / 10],
        color,
        id: key,
        ledIndex,
        positionsUsed,
      });
    });
  });

  return generatedSpheres;
};

const TreeVisScene = () => {
  const spheres = useMemo(() => getSpheres(), []);

  return (
    <>
      {spheres.map((sphere, index) => {
        return <LightSphereVis key={index} index={index} sphere={sphere} />;
      })}
    </>
  );
};

export default function TreeVis() {
  return (
    <>
      <div className="app-container">
        <div className="tmp-main">
          <div className="content">
            <div className="p-6">
              <div className="grid grid-cols-1 gap-2">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
