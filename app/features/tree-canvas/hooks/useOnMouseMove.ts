import Konva from "konva";
import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import useEditorStore from "~/features/tree-editor/state/useEditorStore";

export default function useOnMouseMove() {
  const {
    canvasInteractionMode,
    setCanvasCursorPos,
    canvasLines,
    setCanvasLines,
  } = useEditorStore(
    useShallow((state) => ({
      setCanvasCursorPos: state.setCanvasCursorPos,
      canvasLines: state.canvasLines,
      setCanvasLines: state.setCanvasLines,
      canvasSelectedId: state.canvasSelectedId,
      setCanvasSelectedId: state.setCanvasSelectedId,
      setCanvasInteractionMode: state.setCanvasInteractionMode,
      canvasInteractionMode: state.canvasInteractionMode,
    })),
  );

  const isDrawing = canvasInteractionMode === "drawing";
  return useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      const stage = e.target.getStage();
      const point = stage?.getPointerPosition();
      if (point) {
        setCanvasCursorPos({ x: point.x, y: point.y });

        if (!isDrawing) {
          return;
        }

        const lastLine = canvasLines[canvasLines.length - 1];
        if (lastLine) {
          lastLine.points = lastLine.points.concat([point.x, point.y]);
          canvasLines.splice(canvasLines.length - 1, 1, lastLine);
          // setCanvasLines(canvasLines.concat());
          setCanvasLines(canvasLines);
        }
      }
    },
    [canvasLines, isDrawing, setCanvasCursorPos, setCanvasLines],
  );
}
