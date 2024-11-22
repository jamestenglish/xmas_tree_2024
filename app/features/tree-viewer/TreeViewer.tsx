import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

import {
  EffectComposer,
  Bloom,
  ToneMapping,
} from "@react-three/postprocessing";

import TreeViewerControls from "./TreeViewerControls";
import CylinderScene from "./CylinderScene";

THREE.ColorManagement.enabled = true;

// https://github.com/ievgennaida/animation-timeline-control
// https://github.com/diogocapela/flatdraw
// https://github.com/mindfiredigital/react-canvas-editor <----
// https://fabricjs.com/demos/free-drawing/
// https://www.npmjs.com/package/fabricjs-react
// https://konvajs.org/docs/sandbox/Scale_Image_To_Fit.html
// https://konvajs.org/docs/sandbox/Image_Resize.html
// https://react-canvas-editor.github.io/react-canvas-editor/ <------
// https://github.com/React-Canvas-Editor/react-canvas-editor <-----
// const imgUrl =
//   "https://images.chesscomfiles.com/uploads/v1/images_users/tiny_mce/petrikeckman/phpE4U0RQ.png";

export interface CylinderFormDataProps {
  cylinderOpacity?: number;
}

const TreeViewer = () => {
  return (
    <>
      <div className="flex flex-col">
        <div>
          <TreeViewerControls />
        </div>
        <div>
          <Canvas
            style={{ height: "100vh" }}
            camera={{ position: [0, 0, 15], fov: 75 }}
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
            <CylinderScene />
            <OrbitControls />
          </Canvas>
        </div>
      </div>
    </>
  );
};

export default TreeViewer;
