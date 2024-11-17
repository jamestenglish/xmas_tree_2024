import { useCallback } from "react";

import { useShallow } from "zustand/react/shallow";
import useEditorStore from "~/features/tree-editor/state/useEditorStore";

export default function useOnMouseUp() {
  const { setCanvasInteractionMode } = useEditorStore(
    useShallow((state) => ({
      setCanvasInteractionMode: state.setCanvasInteractionMode,
    })),
  );
  return useCallback(() => {
    console.log("done draw");
    setCanvasInteractionMode("idle");
  }, [setCanvasInteractionMode]);
}
