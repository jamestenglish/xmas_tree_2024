import Konva from "konva";
import { Stage } from "konva/lib/Stage";
import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import useEditorStore, {
  LineType,
} from "~/features/tree-editor/state/useEditorStore";

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
  } = useEditorStore(
    useShallow((state) => ({
      canvasLines: state.canvasLines,
      setCanvasLines: state.setCanvasLines,
      canvasSelectedId: state.canvasSelectedId,
      setCanvasSelectedId: state.setCanvasSelectedId,
      setCanvasInteractionMode: state.setCanvasInteractionMode,

      color: state.color,
      canvasBrushSize: state.canvasBrushSize,
    })),
  );
  return useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      console.log("useOnMouseDown");
      if (e.target === stageRef.current) {
        setCanvasSelectedId(null); // Deselect any selected images
      }
      const pos = e.target?.getStage()?.getPointerPosition();
      console.log({ pos });
      if (pos && color) {
        setCanvasInteractionMode("drawing");
        console.log("drawing");
        const newLine: LineType = {
          points: [pos.x, pos.y],
          stroke: color,
          strokeWidth: canvasBrushSize,
        };
        setCanvasLines([...canvasLines, newLine]);
      }
    },
    [
      canvasBrushSize,
      canvasLines,
      color,
      setCanvasLines,
      setCanvasSelectedId,
      setCanvasInteractionMode,
      stageRef,
    ],
  );
}
