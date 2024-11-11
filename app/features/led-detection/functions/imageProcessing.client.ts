import { LedPosProps, PromiseStateType } from "./imageProcessingTypes";

const delay = async (time: number) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(null), time);
  });
};

type ForEachPixelCallbackArgs = { x: number; y: number };
type ForEachPixelCallbackType = (args: ForEachPixelCallbackArgs) => void;

const forEachPixel = ({
  height,
  width,
  callback,
}: {
  height: number;
  width: number;
  callback: ForEachPixelCallbackType;
}) => {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      callback({ x, y });
    }
  }
};

// https://raw.githubusercontent.com/atomic14/self-organising-leds/40ac412504d0867dfde33adfe9c2e268f5b19a3b/frontend/src/imageProcessing/imageProcessing.tsx
export function getVideoFrame(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  maskArray: Array<boolean>,
) {
  console.group("getVideoFrame");
  const width = video.videoWidth;
  const height = video.videoHeight;
  const context = canvas.getContext("2d");
  // draw the video to the canvas
  context!.drawImage(video, 0, 0, width, height);
  // get the raw image bytes
  const imageData = context!.getImageData(0, 0, width, height);
  // convert to greyscale
  const bytes = new Uint8Array(width * height);
  const doUseMaskArray = maskArray.length === bytes.length;
  console.info({ doUseMaskArray });

  const grayScaleCallback = ({ x, y }: ForEachPixelCallbackArgs) => {
    if (doUseMaskArray && maskArray[y * width + x]) {
      bytes[y * width + x] = 0;
      return;
    }
    const r = imageData.data[(y * width + x) * 4];
    const g = imageData.data[(y * width + x) * 4 + 1];
    const b = imageData.data[(y * width + x) * 4 + 2];
    // https://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale
    const grey = Math.min(255, 0.299 * r + 0.587 * g + 0.114 * b);
    bytes[y * width + x] = grey;
  };
  forEachPixel({ height, width, callback: grayScaleCallback });

  console.groupEnd();
  return bytes;
}

function blur(
  image: Uint8Array,
  width: number,
  height: number,
  maskArray: Array<boolean>,
): Uint8Array {
  console.group("blur");
  const kernel = [
    0.03426, 0.037671, 0.04101, 0.044202, 0.047168, 0.049832, 0.052124,
    0.053979, 0.055344, 0.05618, 0.056461, 0.05618, 0.055344, 0.053979,
    0.052124, 0.049832, 0.047168, 0.044202, 0.04101, 0.037671, 0.03426,
  ];
  const horizontal = new Uint8Array(width * height);

  const doUseMaskArray = horizontal.length === maskArray.length;

  console.info({ doUseMaskArray });

  const blurHorizontalCallback = ({ x, y }: ForEachPixelCallbackArgs) => {
    const row = y * width;

    if (doUseMaskArray && maskArray[row + x]) {
      horizontal[row + x] = 0;
      return;
    }
    let value = 0;
    let divider = 0;
    for (let k = -10; k <= 10; k++) {
      if (k + x >= 0 && k + x < width) {
        value += image[row + x + k] * kernel[k + 10];
        divider += kernel[k + 10];
      }
    }
    horizontal[row + x] = value / divider;
  };

  forEachPixel({ height, width, callback: blurHorizontalCallback });

  const vertical = new Uint8Array(width * height);

  const blurVerticalCallback = ({ x, y }: ForEachPixelCallbackArgs) => {
    if (doUseMaskArray && maskArray[y * width + x]) {
      vertical[y * width + x] = 0;
      return;
    }
    let value = 0;
    let divider = 0;
    for (let k = -10; k <= 10; k++) {
      if (k + y >= 0 && k + y < height) {
        value += horizontal[(k + y) * width + x] * kernel[k + 10];
        divider += kernel[k + 10];
      }
    }
    vertical[y * width + x] = value / divider;
  };

  forEachPixel({ height, width, callback: blurVerticalCallback });
  console.groupEnd();
  return vertical;
}

function debugImage(bytes: Uint8Array, canvas: HTMLCanvasElement) {
  const width = canvas.width;
  const height = canvas.height;
  const context = canvas.getContext("2d");
  const imageData = context!.getImageData(0, 0, width, height);

  const debugImageCallback = ({ x, y }: ForEachPixelCallbackArgs) => {
    imageData.data[(y * width + x) * 4] = bytes[y * width + x];
    imageData.data[(y * width + x) * 4 + 1] = bytes[y * width + x];
    imageData.data[(y * width + x) * 4 + 2] = bytes[y * width + x];
  };
  forEachPixel({ height, width, callback: debugImageCallback });

  context!.putImageData(imageData, 0, 0);
  return imageData;
}

export async function calibrateUsingCamera(
  deviceId: string,
  video: HTMLVideoElement,
  maskArray: Array<boolean>,
  ledIndex: number,
  promiseObj?: PromiseStateType,
) {
  console.group("calibrateUsingCamera");
  const width = video.videoWidth;
  const height = video.videoHeight;
  // create a canvas element to capture video stills
  const canvas = document.getElementById(
    `calibrate${deviceId}`,
  ) as HTMLCanvasElement;
  canvas.width = width;
  canvas.height = height;

  const sleepA = 1000;
  console.info(`sleepA ${sleepA}`);
  await delay(sleepA);
  // capture a frame with all the LEDs off
  const imageBytesNoLeds = blur(
    getVideoFrame(video, canvas, maskArray),
    width,
    height,
    maskArray,
  );
  debugImage(imageBytesNoLeds, canvas);
  // await api.setLeds(espHost, colors);
  // await delay(200);
  // capture a frame

  if (promiseObj !== undefined && promiseObj !== null) {
    console.info("awaiting custom promise");
    await promiseObj.promise;
    console.info("custom promise resolved");
  } else {
    const sleepB = 5000;
    console.info(`sleepB ${sleepB}`);
    await delay(sleepB);
  }

  const imageBytesOneLed = blur(
    getVideoFrame(video, canvas, maskArray),
    width,
    height,
    maskArray,
  );
  debugImage(imageBytesOneLed, canvas);
  // get the maximum difference between the two images
  let maxDifference = 0;
  for (let i = 0; i < imageBytesNoLeds.length; i++) {
    maxDifference = Math.max(
      maxDifference,
      imageBytesOneLed[i] - imageBytesNoLeds[i],
    );
  }
  // now work out the approximate location of the led
  let xPos = 0;
  let yPos = 0;
  let total = 0;
  const positionCallback = ({ x, y }: ForEachPixelCallbackArgs) => {
    const index = y * width + x;
    const diff = imageBytesOneLed[index] - imageBytesNoLeds[index];
    if (diff > 0.5 * maxDifference) {
      xPos += x * diff;
      yPos += y * diff;
      total += diff;
    }
  };
  forEachPixel({ height, width, callback: positionCallback });

  const ledPosMetaInitial: LedPosProps = {
    x: xPos / total,
    y: yPos / total,
    maxDifference,
    ledIndex,
  };
  // await api.setLeds(espHost, colors);
  // }
  const context = canvas.getContext("2d");
  context!.strokeStyle = "red";
  context!.strokeRect(ledPosMetaInitial.x - 2, ledPosMetaInitial.y - 2, 4, 4);
  const highlightedImageData = context!.getImageData(0, 0, width, height);

  const ledPosMeta: LedPosProps = {
    ...ledPosMetaInitial,
    highlightedImageData,
  };
  console.info({ ledPosMeta, maxDifference, total, ledPosMetaInitial });

  console.groupEnd();
  return ledPosMeta;
}
