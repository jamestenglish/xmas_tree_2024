import { Canvas } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useRef, useEffect, useMemo, useState } from "react";
import pos2 from "./pos2";
// import Button from "~/features/ui/components/Button";
import { useForm } from "react-hook-form";
import CanvasEditor from "../tree-canvas/CanvasEditor.client";
import { canvasHeight, canvasWidth } from "../tree-editor/constants";
import TimelineComponent from "../tree-timeline/TimelineComponent.client";

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
}

const points = [new THREE.Vector3(0, -10, 0), new THREE.Vector3(0, 10, 0)];

type CylinderSceneProps = {
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

    pos2.forEach(({ x, y, z, angle }) => {
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
      generatedSpheres.push({ position: [x, y, z], color, samplePoint });
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

      {spheres.map((sphere, index) => (
        <group key={index}>
          {/* Sphere */}
          <mesh
            position={sphere.position}
            onClick={() => {
              console.log(`${index}foo`);
            }}
          >
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshBasicMaterial color={sphere.color} />
          </mesh>
          {/* Line from sphere to sample point on the cylinder */}
          <LineBetweenPoints start={sphere.position} end={sphere.samplePoint} />
        </group>
      ))}
    </>
  );
};

// TODO JTE move most of this to tree-editor
const TreeViewer = () => {
  const initial: CylinderFormDataProps = {
    cylinderOpacity: 0.3,
  };

  const { register, watch } = useForm<CylinderFormDataProps>({
    defaultValues: initial,
  });

  const cylinderOpacity = watch("cylinderOpacity");

  const testCanvasRef = useRef<HTMLCanvasElement>(null);

  const [imgUrl, setImgUrl] = useState<string>(
    "https://images.chesscomfiles.com/uploads/v1/images_users/tiny_mce/petrikeckman/phpE4U0RQ.png",
  );
  // const [version] = useState<number>(0);

  // const strokeWidth = 20;

  // const handleSave = () => {
  //   const save = async () => {
  //     if (canvasRef.current && width && height) {
  //       const paths = await canvasRef.current.exportPaths();

  //       const canvas = document.getElementById(
  //         `testCanvas`,
  //       ) as HTMLCanvasElement;
  //       canvas.width = width;
  //       canvas.height = height;
  //       const context = canvas.getContext("2d");
  //       const maskImg = await canvasRef.current.exportImage("png");

  //       await new Promise((resolve) => {
  //         const img = new Image();
  //         img.onload = function () {
  //           context?.drawImage(img, 0, 0, width, height); // Or at whatever offset you like
  //           resolve(null);
  //         };
  //         img.src = maskImg;
  //       });

  //       const imageData = context?.getImageData(0, 0, width, height);
  //       const maskArray = new Array<boolean>(width * height);
  //       maskArray.fill(false);
  //       if (imageData) {
  //         for (let y = 0; y < height; y++) {
  //           for (let x = 0; x < width; x++) {
  //             const r = imageData.data[(y * width + x) * 4];
  //             const g = imageData.data[(y * width + x) * 4 + 1];
  //             const b = imageData.data[(y * width + x) * 4 + 2];

  //             if (r === 255 && g === 0 && b === 0) {
  //               maskArray[y * width + x] = true;
  //             }
  //           }
  //         }
  //       }
  //       setVersion((prev) => prev + 1);
  //     }
  //   };
  //   save();
  // };

  return (
    <>
      <div className="app-container">
        <div className="tmp-main">
          <div className="content">
            <div className="p-6">
              <div className="mb-6 grid gap-6 md:grid-cols-6">
                <div>
                  <label
                    htmlFor="first_name"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Opacity
                  </label>
                  <input
                    type="number"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    placeholder="100"
                    required
                    {...register("cylinderOpacity")}
                  />
                </div>
              </div>
              <div className="flex flex-row gap-2">
                <Canvas
                  style={{ height: "100vh" }}
                  camera={{ position: [0, 0, 15], fov: 75 }}
                >
                  <color attach="background" args={["#112233"]} />
                  <CylinderScene
                    cylinderOpacity={cylinderOpacity}
                    imgUrl={imgUrl}
                  />
                  <OrbitControls />
                </Canvas>
                <div
                  style={{
                    // width: "640px",
                    // height: "480px",
                    border: "1px solid black",
                  }}
                >
                  <CanvasEditor setImgUrl={setImgUrl} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <TimelineComponent></TimelineComponent>
      </div>

      <div className="flex flex-row gap-2">
        <canvas
          id="testCanvas"
          ref={testCanvasRef}
          width={canvasWidth}
          height={canvasHeight}
          style={{
            width: `${canvasWidth}px`,
            height: `${canvasHeight}px`,
          }}
        />
        <canvas
          id="testCanvas2"
          style={{
            width: `${canvasWidth}px`,
            height: `${canvasHeight}px`,
          }}
        />
      </div>

      <img id="testImg" alt="foo" />
    </>
  );
};

export default TreeViewer;
