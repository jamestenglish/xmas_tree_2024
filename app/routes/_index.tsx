import {
  ActionFunctionArgs,
  json,
  redirect,
  type MetaFunction,
} from "@remix-run/node";
import Homepage from "~/features/homepage/components/Homepage";
import fs from "node:fs";
import { z } from "zod";

export const meta: MetaFunction = () => {
  return [
    { title: "2024 Xmas Tree" },
    { name: "description", content: "2024 Xmas Tree" },
  ];
};

export const resultsDefaultPath = "ignore/capture-data";

const resultsFilePath = `${resultsDefaultPath}/tree-capture.json`;
const calibrationFilePath = `${resultsDefaultPath}/calibration.json`;

const pointSchema = z.object({
  x: z.number(),
  y: z.number(),
});

const canvasPathSchema = z.object({
  paths: z.array(pointSchema),
  strokeWidth: z.number(),
  strokeColor: z.string(),
  drawMode: z.boolean(),
  startTimestamp: z.number().optional(),
  endTimestamp: z.number().optional(),
});

const maskSchema = z.array(z.boolean());
const positionMasksSchema = z.object({
  front: maskSchema.optional(),
  back: maskSchema.optional(),
  left: maskSchema.optional(),
  right: maskSchema.optional(),
});

const positionCanvasPaths = z.object({
  front: z.array(canvasPathSchema).optional(),
  back: z.array(canvasPathSchema).optional(),
  left: z.array(canvasPathSchema).optional(),
  right: z.array(canvasPathSchema).optional(),
});

const ledPosSchema = z.object({
  x: z.number(),
  y: z.number(),
  maxDifference: z.number(),
  ledIndex: z.number().int(),
});

const captureResultSchema = z.object({
  position: z.string(),
  ledPositionMeta: ledPosSchema,
});

const captureResultsForIndexSchema = z.array(captureResultSchema.nullable());

const homepageSchema = z.object({
  intent: z.string().optional(),
  isRunning: z.boolean(),
  numLights: z.number().gt(0).int(),
  currentLedIndex: z.number().gte(-2).int(),
  captureResults: captureResultsForIndexSchema,
  positionMasks: positionMasksSchema,
  positionPaths: positionCanvasPaths,
});

export type PositionsType = "front" | "back" | "left" | "right";
export type HomepageDataType = z.infer<typeof homepageSchema>;
export type PositionMasksType = z.infer<typeof positionMasksSchema>;
export type PositionPathsType = z.infer<typeof positionCanvasPaths>;

export type LedPosProps = z.infer<typeof ledPosSchema>;
export type CaptureResultType = z.infer<typeof captureResultSchema>;
export type CaptureResultsForIndexType = z.infer<
  typeof captureResultsForIndexSchema
>;

const defaultResult: HomepageDataType = {
  isRunning: false,
  numLights: 1000,
  currentLedIndex: 0,
  captureResults: [] as CaptureResultsForIndexType,
  positionMasks: {} as PositionMasksType,
  positionPaths: {} as PositionPathsType,
};

const actionCapture = async (unverifiedFormData: unknown) => {
  // const formData = homepageSchema.parse(unverifiedFormData);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formData = unverifiedFormData as any;

  console.log("_index actionCapture formData: ", formData);

  // fs.writeFileSync(resultsFilePath, JSON.stringify(formData, null, 2));
  const { numLights, currentLedIndex } = formData;
  const newCurrentLedIndex = currentLedIndex + 1;
  const isRunning = newCurrentLedIndex < numLights;
  const result: HomepageDataType = {
    ...formData,
    isRunning,
    currentLedIndex: newCurrentLedIndex,
  };

  fs.writeFileSync(resultsFilePath, JSON.stringify(result, null, 2));

  return json(result);
};

const actionReset = async () => {
  const newPath = `${resultsDefaultPath}-${new Date().getTime()}`;
  console.log(`oldpath: ${resultsDefaultPath} | newPath: ${newPath}`);
  fs.renameSync(resultsDefaultPath, newPath);
  return redirect("/");
};

const actionState = async (unverifiedFormData: unknown) => {
  const formData = homepageSchema.parse(unverifiedFormData);
  console.log("_index actionState formData: ", formData);

  fs.writeFileSync(resultsFilePath, JSON.stringify(formData, null, 2));

  return json(formData);
};

const calibrateSchem = z.object({
  calibrationData: captureResultsForIndexSchema,
});

const actionCalibrate = async (unverifiedFormData: unknown) => {
  console.log("_index actionCalibrate formData: ", unverifiedFormData);

  const formData = calibrateSchem.parse(unverifiedFormData);
  let json = "{}";
  try {
    json = fs.readFileSync(calibrationFilePath).toString();
  } catch (_e) {
    // do nothing;
  }

  const obj = JSON.parse(json);

  const newKey = `${new Date().getTime()}`;

  const newObj = {
    ...obj,
    [newKey]: formData,
  };

  fs.writeFileSync(calibrationFilePath, JSON.stringify(newObj, null, 2));

  return redirect("/");
};

export type HomepageFormIntents = "capture" | "reset" | "state" | "calibrate";

export const action = async (actionArgs: ActionFunctionArgs) => {
  const { request } = actionArgs;
  console.log(request.headers);
  const { intent: intentIn, ...unverifiedFormData } = await request.json();
  const intent = intentIn as HomepageFormIntents;
  switch (intent) {
    case "capture":
      return actionCapture(unverifiedFormData);
    case "reset":
      return actionReset();
    case "state":
      return actionState(unverifiedFormData);
    case "calibrate":
      return actionCalibrate(unverifiedFormData);
  }
};

export const loader = async () => {
  fs.mkdirSync(resultsDefaultPath, { recursive: true });
  try {
    const treeCaptureJson = fs.readFileSync(resultsFilePath);
    const treeCapture = JSON.parse(
      treeCaptureJson.toString(),
    ) as HomepageDataType;
    return json(treeCapture);
  } catch (_e) {
    return json(defaultResult);
  }
};

export default function Index() {
  return (
    <>
      <Homepage />
    </>
  );
}
