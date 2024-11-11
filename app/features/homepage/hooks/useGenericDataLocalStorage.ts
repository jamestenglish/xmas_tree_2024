import { useEffect } from "react";

import useLocalStorageInternal from "~/features/common/hooks/useLocalStorageInternal";
import { LedPosProps } from "~/features/led-detection/functions/imageProcessingTypes";

export interface CaptureDataType {
  [key: string]: Array<LedPosProps>;
}
function useGenericDataLocalStorage<T>(
  captureData: T,
  key: string,
  initial: T,
) {
  const [_captureDataStorage, setGenericDataStorage] =
    useLocalStorageInternal<T>(key, initial);

  useEffect(() => {
    setGenericDataStorage(captureData);
  }, [captureData, setGenericDataStorage]);
}

export default useGenericDataLocalStorage;
