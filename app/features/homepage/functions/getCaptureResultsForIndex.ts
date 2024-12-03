import { VideoContainerRef } from "~/features/video-output/components/VideoSelectorTypes";
import { PromiseStateType } from "~/features/led-detection/functions/imageProcessingTypes";
import { turnLightOff, turnLightOn } from "./lightApi";
import sleep from "~/features/common/functions/sleep";

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

export type GetCaptureResultsForIndexArgs = {
  refsObj: RefObjType;
  ledIndex: number;
  promiseObj?: PromiseStateType;
};

const getCaptureResultsForIndex = async ({
  refsObj,
  ledIndex,
  promiseObj,
}: GetCaptureResultsForIndexArgs) => {
  const { frontRef, backRef, leftRef, rightRef } = refsObj;

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
  // await sleep(10000);

  return captureResults;
};

export default getCaptureResultsForIndex;
