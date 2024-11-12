import saveCaptureResultsForIndex, {
  RefObjType,
} from "../functions/saveCaptureResultsForIndex";
import { useCallback } from "react";
import { CaptureDataType } from "./useCaptureDataLocalStorage";

const useOnCapture = (
  refsObj: RefObjType,
  numLights: number,
  setCaptureData: React.Dispatch<React.SetStateAction<CaptureDataType>>,
) => {
  const onCapture = useCallback(() => {
    const doCapture = async () => {
      for (let ledIndex = 0; ledIndex < numLights; ledIndex++) {
        await saveCaptureResultsForIndex({ refsObj, ledIndex, setCaptureData });
      }
    };

    doCapture();
  }, [numLights, refsObj, setCaptureData]);

  return { onCapture };
};

export default useOnCapture;
