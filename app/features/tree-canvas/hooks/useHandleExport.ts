import { Stage } from "konva/lib/Stage";
import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import useEditorStore, {
  CanvasExport,
} from "~/features/tree-editor/state/useEditorStore";
import { ImageType } from "../EditableImage";
import { ShapeRefMeta } from "../CanvasEditor.client";
import getSequenceArgs, {
  resetAllAnimations,
  SAMPLE_TIME_IN_MS,
} from "../functions/getSequenceArgs";
import { animate } from "motion";

interface UseHandleExportArgs {
  stageRef: React.RefObject<Stage>;
  shapeRefsMeta: ShapeRefMeta[];
}

const SLEEP_TIME_IN_MS = 50;

const sleep = async (time: number) => {
  const p = new Promise<void>((resolve) => {
    setTimeout(() => resolve(), time);
  });
  return p;
};

const getHasAnimation = (canvasImages: ImageType[]) => {
  console.group("getHasAnimation");
  const hasAnimation = canvasImages.reduce((acc, canvasImage) => {
    const length = canvasImage?.animationKeyFrames?.length ?? 0;
    console.log({
      length,
      animationKeyFrames: canvasImage?.animationKeyFrames,
    });
    return acc || length > 0;
  }, false);

  console.groupEnd();
  return hasAnimation;
};

interface GetSequenceAnimationArgsArgs {
  canvasImages: ImageType[];
  durationInSeconds: number;
  shapeRefsMeta: ShapeRefMeta[];
}
const getSequenceAnimationArgs = ({
  canvasImages,
  durationInSeconds,
  shapeRefsMeta,
}: GetSequenceAnimationArgsArgs) => {
  console.group("getSequenceAnimationArgs");
  const sequenceAnimationArgsInitial = canvasImages.map((canvasImage) => {
    console.group("canvasImages.map");
    console.log("canvasImage", canvasImage);
    const { id, animationOptions, animationKeyFrames } = canvasImage;
    if (animationOptions && animationKeyFrames) {
      const shapeRefMeta = shapeRefsMeta?.find(
        (shapeRefMeta) => shapeRefMeta?.id === id,
      );
      console.log("shapeRefMeta", shapeRefMeta);
      if (shapeRefMeta) {
        const sequenceArgs = getSequenceArgs({
          canvasImage,
          durationInSeconds,
          shapeRefMeta,
        });
        console.log("sequenceArgs", sequenceArgs);
        if (sequenceArgs) {
          console.groupEnd();
          return sequenceArgs;
        }
      }
    }
    console.groupEnd();

    return null;
  });

  const sequenceAnimationArgs = sequenceAnimationArgsInitial
    .flat()
    .filter((arg) => arg !== null);

  console.log({ sequenceAnimationArgsInitial, sequenceAnimationArgs });

  console.groupEnd();
  return sequenceAnimationArgs;
};

interface GetSequencedAnimationArgsArgs {
  canvasImages: ImageType[];
  duration: number;
  shapeRefsMeta: ShapeRefMeta[];
}

const getSequencedAnimationArgs = ({
  canvasImages,
  duration,
  shapeRefsMeta,
}: GetSequencedAnimationArgsArgs) => {
  console.group("getSequencedAnimationControls");
  const hasAnimation = getHasAnimation(canvasImages);
  console.log("hasAnimation:", hasAnimation);
  if (hasAnimation) {
    const durationInSeconds = duration / 1000;
    const sequenceAnimationArgs = getSequenceAnimationArgs({
      canvasImages,
      durationInSeconds,
      shapeRefsMeta,
    });

    console.log("sequenceAnimationArgs", sequenceAnimationArgs);

    if (sequenceAnimationArgs.length > 0) {
      console.groupEnd();

      return sequenceAnimationArgs;
    }
  }
  console.log("returning null");
  console.groupEnd();
  return null;
};

export default function useHandleExport({
  stageRef,
  shapeRefsMeta: shapeRefsMeta,
}: UseHandleExportArgs) {
  //

  const {
    setCanvasExports,
    setCanvasSelectedId,
    timelineKeyframeEnd,
    timelineKeyframeStart,
    timelineSelectedGroupId,
    canvasImages,
  } = useEditorStore(
    useShallow((state) => ({
      setCanvasExports: state.setCanvasExports,

      setCanvasSelectedId: state.setCanvasSelectedId,

      timelineKeyframeEnd: state.timelineKeyframeEnd,
      timelineKeyframeStart: state.timelineKeyframeStart,
      timelineSelectedGroupId: state.timelineSelectedGroupId,
      canvasImages: state.canvasImages,
    })),
  );
  return useCallback(async () => {
    console.group("useHandleExports callback");
    if (stageRef.current && timelineSelectedGroupId) {
      setCanvasSelectedId(null);
      const duration = Math.abs(timelineKeyframeEnd - timelineKeyframeStart);
      const sequencedAnimationArgs = getSequencedAnimationArgs({
        canvasImages,
        duration,
        shapeRefsMeta,
      });
      const canvasExports: CanvasExport[] = [];

      console.log({ sequencedAnimationArgs });

      if (sequencedAnimationArgs && sequencedAnimationArgs?.length > 0) {
        for (let t = 0; t < duration; t += SAMPLE_TIME_IN_MS) {
          console.log("animating");
          const timeInSeconds = t / 1000;
          console.log({ timeInSeconds });

          const sequencedAnimationControls = animate(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            sequencedAnimationArgs as any,
          );

          sequencedAnimationControls.pause();

          sequencedAnimationControls.time = timeInSeconds;
          sequencedAnimationControls.play();
          sequencedAnimationControls.pause();

          console.log("sleeping");
          await sleep(SLEEP_TIME_IN_MS);
          const uri = stageRef.current.toDataURL();
          await sleep(SLEEP_TIME_IN_MS);
          sequencedAnimationControls.cancel();

          const canvasExport: CanvasExport = {
            groupId: timelineSelectedGroupId,
            canvasCylinderImgUrl: uri,
            start: timelineKeyframeStart + t,
            end: timelineKeyframeStart + t + SAMPLE_TIME_IN_MS,
          };
          console.log("animation canvasExport: ", canvasExport);
          canvasExports.push(canvasExport);
        }

        resetAllAnimations({
          canvasImages,
          shapeRefsMeta,
        });
        console.log("done");
      } else {
        const uri = stageRef.current.toDataURL();

        const canvasExport: CanvasExport = {
          groupId: timelineSelectedGroupId,
          canvasCylinderImgUrl: uri,
          start: timelineKeyframeStart,
          end: timelineKeyframeEnd,
        };

        canvasExports.push(canvasExport);
      }
      setCanvasExports(canvasExports);
    }
    console.groupEnd();
  }, [
    canvasImages,
    setCanvasExports,
    setCanvasSelectedId,
    shapeRefsMeta,
    stageRef,
    timelineKeyframeEnd,
    timelineKeyframeStart,
    timelineSelectedGroupId,
  ]);
}
