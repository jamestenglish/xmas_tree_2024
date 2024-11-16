import { Canvas } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useRef, useEffect, useMemo } from "react";
import pos2 from "./pos2";
import useEditorStore from "../tree-editor/hooks/useEditorStore";
import { useShallow } from "zustand/react/shallow";
import {
  EffectComposer,
  Bloom,
  ToneMapping,
} from "@react-three/postprocessing";

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

interface LineBetweenPointsProps {
  start: [number, number, number];
  end: [number, number, number];
}

const LineBetweenPoints: React.FC<LineBetweenPointsProps> = ({
  start,
  end,
}: LineBetweenPointsProps) => {
  const lineRef = useRef<THREE.BufferGeometry>(null);

  useEffect(() => {
    if (lineRef.current) {
      lineRef.current.setFromPoints([
        new THREE.Vector3(...start),
        new THREE.Vector3(...end),
      ]);
    }
  }, [start, end]);

  return (
    <line>
      <bufferGeometry ref={lineRef} />
      <lineBasicMaterial color={0xff0000} />
    </line>
  );
};

interface SphereProps {
  position: [number, number, number];
  color: THREE.Color;
  samplePoint: [number, number, number];
  id: number;
}

const points = [new THREE.Vector3(0, -10, 0), new THREE.Vector3(0, 10, 0)];

export type CylinderSceneProps = {
  cylinderOpacity?: number;
  imgUrl: string;
};

const CylinderScene = ({
  cylinderOpacity = 0.3,
  imgUrl,
}: CylinderSceneProps) => {
  const texture = useTexture(imgUrl);
  const cylinderHeight = 20;
  const cylinderRef = useRef<THREE.Mesh>(null);
  const lineRef = useRef<THREE.BufferGeometry>(null);

  const { setSelectedLightId, toggleLightId, selectedLightIds } =
    useEditorStore(
      useShallow((state) => ({
        setSelectedLightId: state.setSelectedLightId,
        toggleLightId: state.toggleLightId,
        selectedLightIds: state.selectedLightIds,
      })),
    );

  const spheres = useMemo(() => {
    // console.log({ version });
    // function generateSpheres(): SphereProps[] {
    const generatedSpheres: SphereProps[] = [];

    const sampleCanvas = document.getElementById(
      "testCanvas",
    ) as HTMLCanvasElement;
    const sampleContext = sampleCanvas.getContext("2d");
    // // TODO JTE turn off
    if (sampleContext && texture.image) {
      sampleCanvas.width = texture.image.width;
      sampleCanvas.height = texture.image.height;
      sampleContext.drawImage(texture.image, 0, 0);
    }

    const sampleCanvas2 = document.getElementById(
      "testCanvas2",
    ) as HTMLCanvasElement;
    const sampleContext2 = sampleCanvas2.getContext("2d");
    if (sampleContext2 && texture.image) {
      sampleCanvas2.width = texture.image.width;
      sampleCanvas2.height = texture.image.height;
      sampleContext2.drawImage(texture.image, 0, 0);
    }

    pos2.forEach(({ x, y, z, angle }, index) => {
      const u =
        (360 - (((Math.atan2(z, x) * 180) / Math.PI + 270) % 360)) / 360;
      const v = (y + cylinderHeight / 2) / cylinderHeight;

      const color = sampleContext
        ? getTextureColor(sampleContext, u, v, sampleContext2)
        : new THREE.Color(0xffffff);

      // Calculate the sample point on the cylinder surface
      const sampleX = 6 * Math.cos(angle);
      const sampleZ = 6 * Math.sin(angle);
      const samplePoint: [number, number, number] = [sampleX, y, sampleZ];
      generatedSpheres.push({
        position: [x, y, z],
        color,
        samplePoint,
        id: index,
      });
    });

    return generatedSpheres;
    // }
    // return generateSpheres();
  }, [texture.image]);

  useEffect(() => {
    console.log({ curent: lineRef.current });
    if (lineRef.current) {
      lineRef.current.setFromPoints(points);
    }
  }, []);

  function getTextureColor(
    context: CanvasRenderingContext2D,
    u: number,
    v: number,
    sampleContext2: CanvasRenderingContext2D | null,
  ): THREE.Color {
    const x = Math.floor(u * context.canvas.width);
    const y = Math.floor((1 - v) * context.canvas.height);
    const pixel = context.getImageData(x, y, 1, 1).data;
    if (sampleContext2 !== null) {
      sampleContext2.strokeStyle = "purple";
      sampleContext2.lineWidth = 3;
      sampleContext2.strokeRect(x - 2, y - 2, 4, 4);
    }

    const r = pixel[0];
    const g = pixel[1];
    const b = pixel[2];

    return new THREE.Color(`rgb(${r}, ${g}, ${b})`);
  }

  return (
    <>
      <mesh ref={cylinderRef} position={[0, 0, 0]}>
        <cylinderGeometry args={[5, 5, cylinderHeight, 64, 1, true]} />
        <meshBasicMaterial
          map={texture}
          side={THREE.DoubleSide}
          transparent
          opacity={cylinderOpacity}
        />
      </mesh>
      <line>
        <bufferGeometry ref={lineRef} />

        <lineBasicMaterial color={0x00ff00} />
      </line>

      {spheres.map((sphere, index) => {
        const isOn = selectedLightIds.includes(sphere.id);
        return (
          <group key={index}>
            {/* Sphere */}
            <mesh
              position={sphere.position}
              onClick={() => {
                console.log(`${index}foo`);
                setSelectedLightId(sphere.id);
                toggleLightId(sphere.id);
              }}
            >
              <sphereGeometry args={[0.3, 16, 16]} />
              {isOn ? (
                <meshStandardMaterial
                  color={sphere.color}
                  emissive={sphere.color}
                  emissiveIntensity={8}
                />
              ) : (
                <meshBasicMaterial color={sphere.color} />
              )}
            </mesh>
            {/* Line from sphere to sample point on the cylinder */}
            <LineBetweenPoints
              start={sphere.position}
              end={sphere.samplePoint}
            />
          </group>
        );
      })}
    </>
  );
};

// TODO JTE move most of this to tree-editor
export type TreeViewerProps = {
  cylinderOpacity: number;
  imgUrl: string;
};
const TreeViewer = ({ cylinderOpacity, imgUrl }: TreeViewerProps) => {
  return (
    <>
      <Canvas
        style={{ height: "100vh" }}
        camera={{ position: [0, 0, 15], fov: 75 }}
      >
        <color attach="background" args={["#112233"]} />
        <EffectComposer>
          <Bloom
            mipmapBlur
            luminanceThreshold={1}
            levels={8}
            intensity={0.4 * 4}
          />
          <ToneMapping />
        </EffectComposer>
        <CylinderScene cylinderOpacity={cylinderOpacity} imgUrl={imgUrl} />
        <OrbitControls />
      </Canvas>
    </>
  );
};

export default TreeViewer;
