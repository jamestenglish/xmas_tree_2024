import { Stage } from "konva/lib/Stage";
import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import useEditorStore, {
  CanvasExport,
} from "~/features/tree-editor/state/useEditorStore";
import { ImageType } from "../EditableImage";
import { ShapeRefMeta } from "../CanvasEditor.client";

interface UseHandleExportArgs {
  stageRef: React.RefObject<Stage>;
  shapeRefsMeta: ShapeRefMeta[];
}

const sleep = async (time: number) => {
  const p = new Promise<void>((resolve) => {
    setTimeout(() => resolve(), time);
  });
  return p;
};

const getHasAnimation = (canvasImages: ImageType[]) => {
  const hasAnimation = canvasImages.reduce((acc, canvasImage) => {
    const length = canvasImage?.animationKeyFrames?.length ?? 0;
    return acc || length > 0;
  }, false);

  return hasAnimation;
};

export default function useHandleExport({
  stageRef,
  shapeRefsMeta: _shapeRefsMeta,
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
    if (stageRef.current && timelineSelectedGroupId) {
      setCanvasSelectedId(null);
      const hasAnimation = getHasAnimation(canvasImages);
      if (hasAnimation) {
        console.log("TODO JTE");
      } else {
        const uri = stageRef.current.toDataURL();

        const canvasExport: CanvasExport = {
          groupId: timelineSelectedGroupId,
          canvasCylinderImgUrl: uri,
          start: timelineKeyframeStart,
          end: timelineKeyframeEnd,
        };

        // TODO JTE fix this for animated canvas
        const canvasExports = [canvasExport];

        setCanvasExports(canvasExports);
      }
    }
  }, [
    canvasImages,
    setCanvasExports,
    setCanvasSelectedId,
    stageRef,
    timelineKeyframeEnd,
    timelineKeyframeStart,
    timelineSelectedGroupId,
  ]);
}
