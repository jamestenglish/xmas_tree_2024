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
    console.log("asdfsfsa", stageRef.current);
    // const handleExportAsync = async () => {
    if (stageRef.current) {
      setCanvasSelectedId(null);
      const uri = stageRef.current.toDataURL();

      // // if (testCanvasRef.current) {
      // //   const context = testCanvasRef.current.getContext("2d");
      // await new Promise((resolve) => {
      // const img = new Image();
      const ii = document.getElementById("testImg") as HTMLImageElement;
      ii.src = uri;
      console.log({ ii });
      //   img.onload = function () {
      //     console.log("useHandleExport onload");
      //     resolve(null);
      //   };
      // img.src = uri;
      // });

      setCanvasCylinderImgUrl(uri);
      // }
      // console.log(uri);
      // we also can save uri as file
      // but in the demo on Konva website it will not work
      // because of iframe restrictions
      // but feel free to use it in your apps:
      // downloadURI(uri, 'stage.png');
    }
    // };
    // handleExportAsync();
  }, [setCanvasCylinderImgUrl, setCanvasSelectedId, stageRef]);
}
