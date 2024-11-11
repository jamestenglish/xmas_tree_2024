import { useEffect } from "react";

import useLocalStorageInternal from "~/features/common/hooks/useLocalStorageInternal";
import { LedPosProps } from "~/features/led-detection/functions/imageProcessingTypes";

export interface CaptureDataType {
  [key: string]: Array<LedPosProps>;
}
const useCaptureDataLocalStorage = (
  captureData: CaptureDataType,
  key: string,
) => {
  const [_captureDataStorage, setCaptureDataStorage] =
    useLocalStorageInternal<CaptureDataType>(key, {});

  useEffect(() => {
    const captureDataWithoutImages = Object.keys(captureData).reduce(
      (acc, key) => {
        const value = captureData[key];
        const newValue = value.map(
          ({ highlightedImageData: _highlightedImageData, ...rest }) => {
            return { ...rest };
          },
        );

        return {
          ...acc,
          [key]: newValue,
        };
      },
      {},
    );

    setCaptureDataStorage(captureDataWithoutImages);
  }, [captureData, setCaptureDataStorage]);
};

export default useCaptureDataLocalStorage;
