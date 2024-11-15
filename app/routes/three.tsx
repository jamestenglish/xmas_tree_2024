import { type MetaFunction } from "@remix-run/node";

// import Three from "~/features/three/components/Three.jsx";

import Three from "~/features/tree-viewer/TreeViewer";
import { ClientOnly } from "remix-utils/client-only";

export const meta: MetaFunction = () => {
  return [
    { title: "Photobooth" },
    { name: "description", content: "Cool photobooth!" },
  ];
};

export default function ThreePage() {
  return <ClientOnly fallback={null}>{() => <Three />}</ClientOnly>;
}
