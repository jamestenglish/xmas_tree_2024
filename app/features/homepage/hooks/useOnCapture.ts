import { FormDataProps } from "~/features/common/hooks/useFormData";
import saveCaptureResultsForIndex, {
  RefObjType,
} from "../functions/saveCaptureResultsForIndex";
import { useCallback } from "react";
import { CaptureDataType } from "./useCaptureDataLocalStorage";

const useOnCapture = (
  refsObj: RefObjType,
  formData: FormDataProps,
  setCaptureData: React.Dispatch<React.SetStateAction<CaptureDataType>>,
) => {
  const onCapture = useCallback(() => {
    const doCapture = async () => {
      if (!formData?.numLights) {
        throw new Error("Invalid formData.numLight");
      }

      const numLights = formData.numLights;

      for (let ledIndex = 0; ledIndex < numLights; ledIndex++) {
        await saveCaptureResultsForIndex({ refsObj, ledIndex, setCaptureData });
      }
    };

    doCapture();
  }, [formData.numLights, refsObj, setCaptureData]);

  return { onCapture };
};

export default useOnCapture;
