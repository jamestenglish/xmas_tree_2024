import { LedPosProps } from "~/features/led-detection/functions/imageProcessingTypes";
import { MappedCaptureDataType, OptionLedPosArrayType } from "./mapData";

type NormalizeArrayArgs = {
  unnormalizedArray: OptionLedPosArrayType;
  origin: LedPosProps | null;
};
const normalizeArray = ({ unnormalizedArray, origin }: NormalizeArrayArgs) => {
  if (origin === null) {
    return unnormalizedArray;
  }
  const normalizedData = unnormalizedArray.map((ledPos) => {
    if (ledPos === null) {
      return ledPos;
    }
    const updatedX = Math.trunc(ledPos.x - origin.x);
    const updatedY = Math.trunc(ledPos.y - origin.y);

    return {
      ...ledPos,
      x: updatedX,
      y: updatedY,
    };
  });

  return normalizedData;
};

type NormalizeDataArgs = {
  unnormalizedData: MappedCaptureDataType;
  calibrationData: MappedCaptureDataType;
};

export type NormalizedCaptureDataType = MappedCaptureDataType;

const normalizeData = ({
  unnormalizedData,
  calibrationData,
}: NormalizeDataArgs) => {
  const keys = Object.keys(unnormalizedData);

  const initialData: NormalizedCaptureDataType = {};
  const normalizedData = keys.reduce((acc, key) => {
    const unnormalizedArray = unnormalizedData[key];
    const origin = calibrationData[key][0];
    const normalizedArray = normalizeArray({ unnormalizedArray, origin });
    return {
      ...acc,
      [key]: normalizedArray,
    };
  }, initialData);

  return normalizedData;
};

export default normalizeData;
