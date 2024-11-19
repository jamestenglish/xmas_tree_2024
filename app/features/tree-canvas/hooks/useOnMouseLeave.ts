import { useCallback } from "react";

import { useShallow } from "zustand/react/shallow";
import useEditorStore from "~/features/tree-editor/state/useEditorStore";

export default function useOnMouseLeave() {
  const { setCanvasCursorPos, setCanvasSelectedId } = useEditorStore(
    useShallow((state) => ({
      setCanvasCursorPos: state.setCanvasCursorPos,
      setCanvasSelectedId: state.setCanvasSelectedId,
    })),
  );
  return useCallback(() => {
    setCanvasCursorPos(null);
    setCanvasSelectedId(null);
  }, [setCanvasCursorPos, setCanvasSelectedId]);
}
