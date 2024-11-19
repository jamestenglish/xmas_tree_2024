import { Stage } from "konva/lib/Stage";
import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import useEditorStore from "~/features/tree-editor/state/useEditorStore";

type UseHandleExportArgs = {
  stageRef: React.RefObject<Stage>;
};
export default function useHandleExport({ stageRef }: UseHandleExportArgs) {
  const { setCanvasCylinderImgUrl, setCanvasSelectedId } = useEditorStore(
    useShallow((state) => ({
      setCanvasCylinderImgUrl: state.setCanvasCylinderImgUrl,
      setCanvasSelectedId: state.setCanvasSelectedId,
    })),
  );
  return useCallback(() => {
    if (stageRef.current) {
      setCanvasSelectedId(null);
      const uri = stageRef.current.toDataURL();

      setCanvasCylinderImgUrl(uri);
    }
  }, [setCanvasCylinderImgUrl, setCanvasSelectedId, stageRef]);
}
