import { ActionFunctionArgs, json, type MetaFunction } from "@remix-run/node";
import { resultsDefaultPath } from "./_index";

// @ts-expect-error no types
import imageDataURI from "image-data-uri";

export const meta: MetaFunction = () => {
  return [
    { title: "2024 Xmas Tree" },
    { name: "description", content: "2024 Xmas Tree" },
  ];
};

export const action = async (actionArgs: ActionFunctionArgs) => {
  const { request } = actionArgs;
  console.log(request.headers);
  const data = await request.json();
  const { dataUrl, blurDataUrl, ledIndex, position } = data;

  await imageDataURI.outputFile(
    dataUrl,
    `${resultsDefaultPath}/${ledIndex}-${position}-img.png`,
  );

  await imageDataURI.outputFile(
    blurDataUrl,
    `${resultsDefaultPath}/${ledIndex}-${position}-blur-img.png`,
  );
  return json({});
};

export const loader = async () => {
  return json({});
};

export default function Index() {
  return <></>;
}
