import { Stage } from "konva/lib/Stage";
import { useCallback } from "react";

type UseHandleExportArgs = {
  stageRef: React.RefObject<Stage>;
  setImgUrl: React.Dispatch<React.SetStateAction<string>>;
};
export default function useHandleExport({
  setImgUrl,
  stageRef,
}: UseHandleExportArgs) {
  return useCallback(() => {
    const handleExportAsync = async () => {
      if (stageRef.current) {
        const uri = stageRef.current.toDataURL();

        // if (testCanvasRef.current) {
        //   const context = testCanvasRef.current.getContext("2d");
        //   await new Promise((resolve) => {
        //     const img = new Image();
        //     const ii = document.getElementById("testImg") as HTMLImageElement;
        //     ii.src = uri;
        //     img.onload = function () {
        //       context?.drawImage(img, 0, 0); //, canvasWidth, canvasHeight); // Or at whatever offset you like
        //       resolve(null);
        //     };
        //     img.src = uri;
        //   });

        setImgUrl(uri);
        // }
        // console.log(uri);
        // we also can save uri as file
        // but in the demo on Konva website it will not work
        // because of iframe restrictions
        // but feel free to use it in your apps:
        // downloadURI(uri, 'stage.png');
      }
    };
    handleExportAsync();
  }, [setImgUrl, stageRef]);
}
