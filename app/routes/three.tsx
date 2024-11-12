import { type MetaFunction } from "@remix-run/node";

import Three from "~/features/three/components/Three.jsx";
export const meta: MetaFunction = () => {
  return [
    { title: "Photobooth" },
    { name: "description", content: "Cool photobooth!" },
  ];
};

export default function ThreePage() {
  return (
    <>
      <Three />
    </>
  );
}
