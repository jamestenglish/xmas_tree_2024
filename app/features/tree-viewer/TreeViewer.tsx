import { Canvas } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useRef, useEffect, useMemo } from "react";
import pos2 from "./pos2";
import {
  EffectComposer,
  Bloom,
  ToneMapping,
} from "@react-three/postprocessing";
import LightSphere, { SphereProps } from "./LightSphere";
import useEditorStore, {
  EditorState,
} from "../tree-editor/state/useEditorStore";
import { useShallow } from "zustand/react/shallow";
import TreeViewerControls from "./TreeViewerControls";
import { TimelineExportState } from "../tree-editor/state/createTimelineSlice";
import findAllTimelineObjectsByGroupId from "../tree-editor/state/functions/findAllTimelineObjectsByGroupId";

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

const TRANSPARENT_IMG =
  "data:image/png;base64,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L2V4aWYvMS4wLyIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iPgogICAgICAgICA8ZXhpZjpQaXhlbFhEaW1lbnNpb24+NDwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOlVzZXJDb21tZW50PlNjcmVlbnNob3Q8L2V4aWY6VXNlckNvbW1lbnQ+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj42PC9leGlmOlBpeGVsWURpbWVuc2lvbj4KICAgICAgICAgPHRpZmY6UmVzb2x1dGlvblVuaXQ+MjwvdGlmZjpSZXNvbHV0aW9uVW5pdD4KICAgICAgICAgPHRpZmY6WVJlc29sdXRpb24+MTQ0PC90aWZmOllSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpYUmVzb2x1dGlvbj4xNDQ8L3RpZmY6WFJlc29sdXRpb24+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgqcT/B1AAAADElEQVQIHWNgoAcAAABmAAEb1nnsAAAAAElFTkSuQmCC";

const getTextureUrls = (
  timelineExportState: TimelineExportState,
  canvasCylinderImgUrls: string[],
) => {
  const defaultResult = canvasCylinderImgUrls.flat();
  if (timelineExportState.status === "PLAY") {
    // TODO JTE figure out
    const initial =
      timelineExportState?.canvasCylinderImgUrlsData?.map(
        (obj) => obj.canvasCylinderImgUrl,
      ) ?? [];
    return [TRANSPARENT_IMG, ...initial];
  }

  return defaultResult;
};

const getTextureIndex = (
  timelineExportState: TimelineExportState,
  timelineCoarseTime: number,
) => {
  if (timelineExportState.status === "PLAY") {
    const data = timelineExportState?.canvasCylinderImgUrlsData ?? [];
    const max = data.reduce((acc, datum) => {
      return Math.max(acc, datum.end);
    }, 0);
    for (let i = 0; i < data.length; i++) {
      const { start, end } = data[i];
      if (
        timelineCoarseTime >= start &&
        (timelineCoarseTime < end || timelineCoarseTime == max)
      ) {
        return i + 1;
      }
    }
  }

  return 0;
};

export interface CylinderFormDataProps {
  cylinderOpacity?: number;
}

const points = [new THREE.Vector3(0, -10, 0), new THREE.Vector3(0, 10, 0)];

const CylinderScene = () => {
  //

  const {
    canvasCylinderImgUrls,

    timelineCoarseTime,

    treeViewerCylinderOpacity,
  } = useEditorStore(
    useShallow((state) => ({
      canvasCylinderImgUrls: state.canvasCylinderImgUrls,

      timelineCoarseTime: state.timelineCoarseTime,

      treeViewerCylinderOpacity: state.treeViewerCylinderOpacity,
    })),
  );

  const urlsToUse = useMemo(() => {
    const result = getTextureUrls(timelineExportState, canvasCylinderImgUrls);
    // console.log({ result });
    return result;
  }, [canvasCylinderImgUrls, timelineExportState]);

  const texturesIndex = useMemo(() => {
    const result = getTextureIndex(timelineExportState, timelineCoarseTime);
    // console.log(result);
    return result;
  }, [timelineCoarseTime, timelineExportState]);

  const textures = useTexture(urlsToUse);

  const texture = textures[texturesIndex];

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
          opacity={treeViewerCylinderOpacity}
        />
      </mesh>
      <line>
        <bufferGeometry ref={lineRef} />

        <lineBasicMaterial color={0x00ff00} />
      </line>

      {spheres.map((sphere, index) => {
        return <LightSphere key={index} index={index} sphere={sphere} />;
      })}
    </>
  );
};

const TreeViewer = () => {
  // const sphereRef = useEditorStore((state) => state.sphereRefs[0]);
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
                // luminanceThreshold={1}
                luminanceThreshold={0.1}
                levels={8}
                intensity={0.4 * 4}
              />
              {/* <Outline selection={sphereRef ? [sphereRef] : []} /> */}
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
