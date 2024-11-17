import { useEffect, useRef } from "react";
import * as THREE from "three";
import useEditorStore from "../tree-editor/state/useEditorStore";
import { useShallow } from "zustand/react/shallow";

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
  const { toggleLightId, isSelected } = useEditorStore(
    useShallow((state) => ({
      toggleLightId: state.toggleLightId,
      isSelected:
        state.selectedLightIds.includes(sphere.id) && state.blinkState,
    })),
  );

  return (
    <group>
      {/* Sphere */}
      <mesh
        position={sphere.position}
        onClick={() => {
          console.log(`sphere onClick: ${index}`);
          toggleLightId(sphere.id);
        }}
        // ref={sphereRef}
      >
        <sphereGeometry args={[isSelected ? 0.4 : 0.3, 16, 16]} />

        <meshStandardMaterial
          color={sphere.color}
          emissive={sphere.color}
          emissiveIntensity={1}
          // TODO JTE Íchange to 8 to make glow
        />
      </mesh>
      {/* Line from sphere to sample point on the cylinder */}
      <LineBetweenPoints start={sphere.position} end={sphere.samplePoint} />
    </group>
  );
}
