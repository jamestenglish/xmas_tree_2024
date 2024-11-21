import { ShapeRefMeta } from "../CanvasEditor.client";
import {
  ImageType,
  ImageTypeAnimationValues,
  ImageTypeParent,
} from "../EditableImage";
import { AnimateArgs } from "./getAnimationArgsTypes";
import { motionValue } from "motion";

export const SAMPLE_TIME_IN_MS = 100;

// type ImageKeyframeType<T> = {
//   [K in keyof T]: T[K][];
// };

// type ImageKeyframeType = {
//   x: MotionValue<number>[];
//   y: MotionValue<number>[];
//   width: MotionValue<number>[];
//   height: MotionValue<number>[];
//   rotation: MotionValue<number>[];
// };

type ImageKeyframeType = {
  x: number[];
  y: number[];
  width: number[];
  height: number[];
  rotation: number[];
};

interface FormDataToKeyFramesArgs {
  initialState: {
    animationOptionsString?: string;
    currentAnimationFrame?: ImageTypeParent;
    id: string;
    src: string;
    type: string;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
  };
  animationKeyFrames: ImageTypeParent[];
}

const formDataToKeyframes = ({
  initialState,
  animationKeyFrames,
}: FormDataToKeyFramesArgs) => {
  const combined = [{ ...initialState }, ...animationKeyFrames];

  // const init: ImageKeyframeType<ImageTypeAnimationValues> = {
  //   x: [],
  //   y: [],
  //   height: [],
  //   width: [],
  //   rotation: [],
  // };

  const init: ImageKeyframeType = {
    x: [],
    y: [],
    height: [],
    width: [],
    rotation: [],
  };

  const keyframes = combined.reduce((acc, keyframe) => {
    const keys = Object.keys(keyframe) as (keyof ImageTypeAnimationValues)[];
    keys.forEach((key) => {
      const value = keyframe[key];
      const prev = acc[key];
      if (!prev) {
        return acc;
      }
      // (acc[key] as number[]) = [...prev, Math.round(Number(value))];
      acc[key] = [...prev, Math.round(Number(value))];
    });
    return acc;
  }, init);

  return keyframes;
};

// interface GetAnimationArgs {
//   initialState: InitialStateType;
// }

interface GetAnimationArgsArgs {
  canvasImage: ImageType;
  durationInSeconds: number;
  shapeRefMeta: ShapeRefMeta;
}

export interface AnimationObject {
  currentAnimationFrame?: ImageTypeParent;
  id: string;
  src: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

// export default function getAnimationArgs({
//   canvasImage,
//   durationInSeconds,
//   shapeRefMeta,
// }: GetAnimationArgsArgs) {
//   const { animationKeyFrames, animationOptions, ...initialState } = canvasImage;
//   const animationObject: AnimationObject = { ...initialState };
//   if (animationKeyFrames) {
//     const keyframes = formDataToKeyframes({
//       initialState,
//       animationKeyFrames,
//     });

//     console.log({ keyframes });

//     const value = motionValue<AnimationObject>(animationObject);
//     const result: AnimateArgs<MotionValue<AnimationObject>> = [
//       // animationObject,
//       value,
//       {
//         ...keyframes,
//       },
//       {
//         ...animationOptions,
//         duration: durationInSeconds - SAMPLE_TIME_IN_MS / 1000, // fence post problem
//         onUpdate: (...latest) => {
//           console.log("onUpdate", {
//             latest,
//             animationObject,
//             shapeRefMeta: shapeRefMeta.ref.current,
//           });
//           shapeRefMeta.ref.current?.position(animationObject);
//           shapeRefMeta.ref.current?.rotation(animationObject.rotation);
//           shapeRefMeta.ref.current?.height(animationObject.height);
//           shapeRefMeta.ref.current?.width(animationObject.width);
//         },
//       },
//     ];

//     return result;
//   }
//   return null;
// }

const keysObj = { x: 0, y: 0, height: 0, width: 0, rotation: 0 } as const;

const getAnimationArgForKey = ({
  key,
  canvasImage,
  shapeRefMeta,
  durationInSeconds,
}: {
  key: keyof typeof keysObj;
  canvasImage: ImageType;
  shapeRefMeta: ShapeRefMeta;
  durationInSeconds: number;
}) => {
  const { animationKeyFrames, animationOptions, ...initialState } = canvasImage;
  console.log("getAnimationArgForKey", key);
  if (animationKeyFrames) {
    const animationObject = { ...initialState } as AnimationObject;
    const keyframes = formDataToKeyframes({
      initialState,
      animationKeyFrames,
    });

    const value = motionValue<number>(animationObject[key] as number);
    value.on("change", (latestValue) => {
      // console.log(`${key} latestValue`, latestValue);
      shapeRefMeta.ref.current?.[key](latestValue);
    });
    const result: AnimateArgs = [
      // animationObject,
      value,

      keyframes[key],

      {
        ...animationOptions,
        duration: durationInSeconds - SAMPLE_TIME_IN_MS / 1000, // fence post problem
      },
    ];

    return result;
  }
  return null;
};

function getAnimationArgs({
  canvasImage,
  durationInSeconds,
  shapeRefMeta,
}: GetAnimationArgsArgs) {
  // const { animationKeyFrames, animationOptions, ...initialState } = canvasImage;
  const args = Object.keys(keysObj).map((key) => {
    return getAnimationArgForKey({
      key: key as keyof typeof keysObj,
      canvasImage,
      shapeRefMeta,
      durationInSeconds,
    });
  });
  const filtered = args.filter((arg) => arg !== null);
  console.log({ filtered });

  return filtered;
}

interface ResetAnimationArg {
  canvasImage: ImageType;
  shapeRefMeta: ShapeRefMeta;
}
export function resetAnimation({
  canvasImage,
  shapeRefMeta,
}: ResetAnimationArg) {
  const { ...initialState } = canvasImage;
  Object.keys(keysObj).forEach((untypedKey) => {
    const key = untypedKey as keyof typeof keysObj;
    shapeRefMeta.ref.current?.[key](initialState[key]);
  });
}

interface ResetAllAnimationsArg {
  canvasImages: ImageType[];
  shapeRefsMeta: ShapeRefMeta[];
}
export function resetAllAnimations({
  canvasImages,
  shapeRefsMeta,
}: ResetAllAnimationsArg) {
  canvasImages.forEach((canvasImage) => {
    const { id, animationOptions, animationKeyFrames } = canvasImage;
    if (animationOptions && animationKeyFrames) {
      const shapeRefMeta = shapeRefsMeta?.find(
        (shapeRefMeta) => shapeRefMeta?.id === id,
      );

      if (shapeRefMeta) {
        resetAnimation({
          canvasImage,
          shapeRefMeta,
        });
      }
    }
  });
}

export default function getSequenceArgs({
  canvasImage,
  durationInSeconds,
  shapeRefMeta,
}: GetAnimationArgsArgs) {
  const animationArgs = getAnimationArgs({
    canvasImage,
    durationInSeconds,
    shapeRefMeta,
  });

  const sequenceArgs = animationArgs.map((arg) => {
    const [a, b, origOptions] = arg;
    const newOptions = {
      ...origOptions,
      at: 0,
    };
    return [a, b, newOptions];
  });

  if (sequenceArgs?.length > 0) {
    return sequenceArgs;
  }

  return null;
}
