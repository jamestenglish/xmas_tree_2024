import Konva from "konva";
import { Stage } from "konva/lib/Stage";
import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import useEditorStore, {
  LineType,
} from "~/features/tree-editor/state/useEditorStore";
import { v7 } from "uuid";

type UseOnMouseDownArgs = {
  stageRef: React.RefObject<Stage>;
};

export default function useOnMouseDown({ stageRef }: UseOnMouseDownArgs) {
  const {
    canvasBrushSize,
    color,
    canvasLines,
    setCanvasLines,
    setCanvasSelectedId,
    setCanvasInteractionMode,
    canvasGlobalCompositeOperation,
    canvasInteractionType,
  } = useEditorStore(
    useShallow((state) => ({
      canvasLines: state.canvasLines,
      setCanvasLines: state.setCanvasLines,
      canvasSelectedId: state.canvasSelectedId,
      setCanvasSelectedId: state.setCanvasSelectedId,
      setCanvasInteractionMode: state.setCanvasInteractionMode,
      canvasGlobalCompositeOperation: state.canvasGlobalCompositeOperation,
      color: state.color,
      canvasBrushSize: state.canvasBrushSize,
      canvasInteractionType: state.canvasInteractionType,
    })),
  );
  return useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      console.log("useOnMouseDown");
      if (canvasInteractionType === "drawing") {
        if (e.target === stageRef.current) {
          setCanvasSelectedId(null); // Deselect any selected images
        }
        const pos = e.target?.getStage()?.getPointerPosition();
        console.log({ pos });
        if (pos && color) {
          setCanvasInteractionMode("drawing");
          console.log("drawing");
          const newLine: LineType = {
            // id: `${new Date().getTime()}`,
            id: v7(),
            type: "line",
            points: [pos.x, pos.y],
            stroke: color,
            strokeWidth: canvasBrushSize,
            globalCompositeOperation: canvasGlobalCompositeOperation,
          };
          setCanvasLines([...canvasLines, newLine]);
        }
      }
    },
    [
      canvasInteractionType,
      stageRef,
      color,
      setCanvasSelectedId,
      setCanvasInteractionMode,
      canvasBrushSize,
      canvasGlobalCompositeOperation,
      setCanvasLines,
      canvasLines,
    ],
  );
}
