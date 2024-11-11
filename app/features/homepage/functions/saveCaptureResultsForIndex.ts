import { VideoContainerRef } from "~/features/video-output/components/VideoSelectorTypes";
import { PromiseStateType } from "~/features/led-detection/functions/imageProcessingTypes";

import { SetCaptureDataArgs } from "../hooks/useCaptureDataLocalStorage";

export type RefObjType = {
  frontRef: React.RefObject<VideoContainerRef>;
  backRef: React.RefObject<VideoContainerRef>;
  leftRef: React.RefObject<VideoContainerRef>;
  rightRef: React.RefObject<VideoContainerRef>;
};

const getCapturePromises = (
  refsObj: RefObjType,
  ledIndex: number,
  promiseObj?: PromiseStateType,
) => {
  const { frontRef, backRef, leftRef, rightRef } = refsObj;
  const refs = [frontRef, backRef, rightRef, leftRef];

  const promises = refs.map((ref) => {
    return ref && ref?.current
      ? ref.current.capture({
          ledIndex,
          promiseObj,
        })
      : Promise.resolve(null);
  });

  return promises;
};

export type SaveCaptureResultsForIndexArgs = {
  refsObj: RefObjType;
  ledIndex: number;
  setCaptureData: React.Dispatch<React.SetStateAction<SetCaptureDataArgs>>;
  promiseObj?: PromiseStateType;
  positionPrefix?: string;
};

const saveCaptureResultsForIndex = async ({
  refsObj,
  ledIndex,
  setCaptureData,
  promiseObj,
  positionPrefix,
}: SaveCaptureResultsForIndexArgs) => {
  const { frontRef, backRef, leftRef, rightRef } = refsObj;
  const capturePromises = getCapturePromises(
    { frontRef, backRef, leftRef, rightRef },
    ledIndex,
    promiseObj,
  );

  const captureResults = await Promise.all(capturePromises);

  captureResults.forEach((captureResult) => {
    if (captureResult !== null) {
      const { position, ledPositionMeta } = captureResult;
      setCaptureData((prev) => {
        const key = positionPrefix ? `${positionPrefix}${position}` : position;
        const oldArray = prev[key] ?? [];
        const newArray = [...oldArray, ledPositionMeta];
        const newValue = {
          ...prev,
          [key]: newArray,
        };
        console.group("saveCaptureResultsForIndex.setCaptureData");
        console.info({ newValue });

        console.groupEnd();
        return newValue;
      });
    }
  });

  return captureResults;
};

export default saveCaptureResultsForIndex;
