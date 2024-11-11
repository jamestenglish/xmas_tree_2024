import { type MetaFunction } from "@remix-run/node";
import Homepage from "~/features/homepage/components/Homepage";

export const meta: MetaFunction = () => {
  return [
    { title: "Photobooth" },
    { name: "description", content: "Cool photobooth!" },
  ];
};

export default function Index() {
  return (
    <>
      <Homepage />
    </>
  );
}
