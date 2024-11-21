import { type MetaFunction } from "@remix-run/node";
import Homepage from "~/features/homepage/components/Homepage";

export const meta: MetaFunction = () => {
  return [
    { title: "2024 Xmas Tree" },
    { name: "description", content: "2024 Xmas Tree" },
  ];
};

export default function Index() {
  return (
    <>
      <Homepage />
    </>
  );
}
