import { VideoContainerRef } from "~/features/video-output/components/VideoSelectorTypes";
import { PromiseStateType } from "~/features/led-detection/functions/imageProcessingTypes";
import { turnLightOff, turnLightOn } from "./lightApi";

export type RefObjType = {
  frontRef: React.RefObject<VideoContainerRef>;
  backRef: React.RefObject<VideoContainerRef>;
  leftRef: React.RefObject<VideoContainerRef>;
  rightRef: React.RefObject<VideoContainerRef>;
};

const getNoLedCapturePromises = (
  refsObj: RefObjType,
  promiseObj?: PromiseStateType,
) => {
  const { frontRef, backRef, leftRef, rightRef } = refsObj;
  const refs = [frontRef, backRef, rightRef, leftRef];

  const promises = refs.map((ref) => {
    return ref && ref?.current
      ? ref.current.captureNoLed({
          promiseObj,
        })
      : Promise.resolve(null);
  });

  return promises;
};

const getLedCapturePromises = (
  refsObj: RefObjType,
  imageBytesNoLedsArray: (Uint8Array | null)[],
  ledIndex: number,
) => {
  const { frontRef, backRef, leftRef, rightRef } = refsObj;
  const refs = [frontRef, backRef, rightRef, leftRef];

  const promises = refs.map((ref, index) => {
    return ref && ref?.current && imageBytesNoLedsArray[index]
      ? ref.current.captureLed({
          ledIndex,
          imageBytesNoLeds: imageBytesNoLedsArray[index],
        })
      : Promise.resolve(null);
  });

  return promises;
};
// const getCapturePromises = (
//   refsObj: RefObjType,
//   ledIndex: number,
//   promiseObj?: PromiseStateType,
// ) => {
//   const { frontRef, backRef, leftRef, rightRef } = refsObj;
//   const refs = [frontRef, backRef, rightRef, leftRef];

//   const promises = refs.map((ref) => {
//     return ref && ref?.current
//       ? ref.current.capture({
//           ledIndex,
//           promiseObj,
//         })
//       : Promise.resolve(null);
//   });

//   return promises;
// };

export type GetCaptureResultsForIndexArgs = {
  refsObj: RefObjType;
  ledIndex: number;
  // setCaptureData: React.Dispatch<React.SetStateAction<CaptureDataType>>;
  promiseObj?: PromiseStateType;
  // positionPrefix?: string;
};

const getCaptureResultsForIndex = async ({
  refsObj,
  ledIndex,
  // setCaptureData,
  promiseObj,
  // positionPrefix,
}: GetCaptureResultsForIndexArgs) => {
  const { frontRef, backRef, leftRef, rightRef } = refsObj;
  // const capturePromises = getCapturePromises(
  //   { frontRef, backRef, leftRef, rightRef },
  //   ledIndex,
  //   promiseObj,
  // );

  await turnLightOff(ledIndex - 1);
  const noLedCapturePromises = getNoLedCapturePromises(
    { frontRef, backRef, leftRef, rightRef },
    promiseObj,
  );

  const noLedCaptureResults = await Promise.all(noLedCapturePromises);

  const imageBytesNoLedsArray = noLedCaptureResults.map((a) =>
    a ? a.imageBytesNoLeds : a,
  );

  await turnLightOn(ledIndex);

  const ledCapturePromises = getLedCapturePromises(
    { frontRef, backRef, leftRef, rightRef },
    imageBytesNoLedsArray,
    ledIndex,
  );

  const captureResults = await Promise.all(ledCapturePromises);

  // captureResults.forEach((captureResult) => {
  //   if (captureResult !== null) {
  //     const { position, ledPositionMeta } = captureResult;
  //     setCaptureData((prev) => {
  //       const key = positionPrefix ? `${positionPrefix}${position}` : position;
  //       const oldArray = prev[key] ?? [];
  //       const newArray = [...oldArray, ledPositionMeta];
  //       const newValue = {
  //         ...prev,
  //         [key]: newArray,
  //       };
  //       console.group("saveCaptureResultsForIndex.setCaptureData");
  //       console.info({ newValue });

  //       console.groupEnd();
  //       return newValue;
  //     });
  //   }
  // });

  return captureResults;
};

export default getCaptureResultsForIndex;
