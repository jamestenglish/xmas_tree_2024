import { type MetaFunction } from "@remix-run/node";

// import Three from "~/features/three/components/Three.jsx";

// import Konva from "~/features/three/components/CanvasEditor";
// import { ClientOnly } from "remix-utils/client-only";

export const meta: MetaFunction = () => {
  return [
    { title: "2024 Xmas Tree" },
    { name: "description", content: "2024 Xmas Tree" },
  ];
};

// export default function ThreePage() {
//   return <ClientOnly fallback={null}>{() => <Konva />}</ClientOnly>;
// }
