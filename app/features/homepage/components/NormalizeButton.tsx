import { useCallback, useState } from "react";

import Button from "~/features/ui/components/Button";
import { CaptureDataType } from "../hooks/useCaptureDataLocalStorage";

import useLocalStorageInternal from "~/features/common/hooks/useLocalStorageInternal";
import normalizeData, {
  NormalizedCaptureDataType,
} from "~/features/calibration/functions/normalizeData";
import mapData from "~/features/calibration/functions/mapData";
import useGenericDataLocalStorage from "../hooks/useGenericDataLocalStorage";

const NormalizeButton = () => {
  // TODO JTE use state
  const [captureDataStorage] = useLocalStorageInternal<CaptureDataType>(
    "calibrationData",
    {},
  );

  const [calibrationDataStorage] = useLocalStorageInternal<CaptureDataType>(
    "calibrationData",
    {},
  );

  const [normalizedData, setNormalizedData] =
    useState<NormalizedCaptureDataType>({});

  useGenericDataLocalStorage<NormalizedCaptureDataType>(
    normalizedData,
    "normalizedData",
    {},
  );

  const numCaptures = 3; // TODO JTE
  const onClickNormalize = useCallback(() => {
    const mappedData = mapData({
      captureData: captureDataStorage,
      numCaptures,
    });

    const newNormalizedData = normalizeData({
      unnormalizedData: mappedData,
      calibrationData: calibrationDataStorage,
    });

    setNormalizedData(newNormalizedData);
  }, [calibrationDataStorage, captureDataStorage]);

  return (
    <>
      <Button onClick={onClickNormalize}>Normalize</Button>
    </>
  );
};

export default NormalizeButton;
