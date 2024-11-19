import { useEffect, useRef } from "react";
import * as THREE from "three";
import useEditorStore from "../tree-editor/state/useEditorStore";
import { useShallow } from "zustand/react/shallow";
import cloneDeep from "lodash/cloneDeep";

export interface SphereProps {
  position: [number, number, number];
  color: THREE.Color;
  samplePoint: [number, number, number];
  id: number;
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

type LightSphereProps = {
  sphere: SphereProps;
  index: number;
};
export default function LightSphere({ sphere, index }: LightSphereProps) {
  const { toggleTreeViewerLightId, isSelected } = useEditorStore(
    useShallow((state) => ({
      toggleTreeViewerLightId: state.toggleTreeViewerLightId,
      isSelected:
        state.treeViewerSelectedLightIds.includes(sphere.id) &&
        state.treeViewerBlinkState,
    })),
  );

  const { color } = sphere;

  const newColor = cloneDeep(color);

  const isBlack =
    (color.r === 0 || color.r === 1) &&
    (color.g === 0 || color.g === 1) &&
    (color.b === 0 || color.b === 1);
  if (isBlack) {
    // opacity works better with very light gray
    newColor.r = 1;
    newColor.g = 1;
    newColor.b = 1;
  }

  return (
    <group>
      {/* Sphere */}
      <mesh
        position={sphere.position}
        onClick={() => {
          console.log(`sphere onClick: ${index}`);
          toggleTreeViewerLightId(sphere.id);
        }}
        // ref={sphereRef}
      >
        <sphereGeometry args={[isSelected ? 0.4 : 0.3, 16, 16]} />

        <meshStandardMaterial
          color={newColor}
          emissive={newColor}
          emissiveIntensity={isBlack ? 0.1 : 8}
          opacity={isBlack ? 0.01 : undefined}
        />
      </mesh>
      {/* Line from sphere to sample point on the cylinder */}
      <LineBetweenPoints start={sphere.position} end={sphere.samplePoint} />
    </group>
  );
}
