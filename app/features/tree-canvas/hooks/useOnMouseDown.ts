import Konva from "konva";
import { Stage } from "konva/lib/Stage";
import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
// import memoizedColorSelector from "~/features/tree-editor/state/memoizedColorSelector";
import useEditorStore, {
  LineType,
} from "~/features/tree-editor/state/useEditorStore";
// import memoizedAttributeByGroupSelector from "../../tree-editor/state/memoizedattributeByGroupSelector";

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
      // canvasLines:
      //   memoizedAttributeByGroupSelector<Array<LineType>>(
      //     state.model.rows,
      //     state.canvasLinesByGroup,
      //   ) ?? [],
      canvasLines: state.canvasLines,
      setCanvasLines: state.setCanvasLines,
      canvasSelectedId: state.canvasSelectedId,
      setCanvasSelectedId: state.setCanvasSelectedId,
      setCanvasInteractionMode: state.setCanvasInteractionMode,
      // color:
      //   memoizedColorSelector(state.colorByGroup, state.model.rows) ??
      //   undefined,
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
