import { type MetaFunction } from "@remix-run/node";

// import Three from "~/features/three/components/Three.jsx";

import TreeEditor from "~/features/tree-editor/TreeEditor";
import { ClientOnly } from "remix-utils/client-only";

export const meta: MetaFunction = () => {
  return [
    { title: "Photobooth" },
    { name: "description", content: "Cool photobooth!" },
  ];
};

export default function ThreePage() {
  return <ClientOnly fallback={null}>{() => <TreeEditor />}</ClientOnly>;
}
