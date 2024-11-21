import { ShapeRefMeta } from "../CanvasEditor.client";
import {
  ImageType,
  ImageTypeAnimationValues,
  ImageTypeParent,
} from "../EditableImage";
import { animate } from "motion";

type ImageKeyframeType<T> = {
  [K in keyof T]: T[K][];
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

  const init: ImageKeyframeType<ImageTypeAnimationValues> = {
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
      (acc[key] as number[]) = [...prev, Number(value)];
    });
    return acc;
  }, init);

  return keyframes;
};

// interface GetAnimationArgs {
//   initialState: InitialStateType;
// }

interface GetAnimationArgs {
  canvasImage: ImageType;
  duration: number;
  shapeRefMeta: ShapeRefMeta;
}

export default function getAnimation({
  canvasImage,
  duration,
  shapeRefMeta,
}: GetAnimationArgs) {
  const { animationKeyFrames, animationOptions, ...initialState } = canvasImage;
  const animationObject = { ...initialState };
  if (animationKeyFrames) {
    const keyframes = formDataToKeyframes({
      initialState,
      animationKeyFrames,
    });

    console.log({ keyframes });
    // TODO JTE just return the args?
    const result = animate(
      animationObject,
      {
        ...keyframes,
      },
      {
        ...animationOptions,
        duration,
        onUpdate: (...latest) => {
          console.log(latest, animationObject);
          shapeRefMeta.ref.current?.position(animationObject);
          shapeRefMeta.ref.current?.rotation(animationObject.rotation);
          shapeRefMeta.ref.current?.height(animationObject.height);
          shapeRefMeta.ref.current?.width(animationObject.width);
        },
      },
    );
    result.pause();

    return result;
  }
  return null;
}
