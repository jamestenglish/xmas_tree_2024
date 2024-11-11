import { CaptureDataType } from "~/features/homepage/hooks/useCaptureDataLocalStorage";
import { LedPosProps } from "~/features/led-detection/functions/imageProcessingTypes";

export type MapDataArgs = {
  captureData: CaptureDataType;
  numCaptures: number;
};

export type OptionLedPosArrayType = Array<LedPosProps | null>;

export interface MappedCaptureDataType {
  [key: string]: OptionLedPosArrayType;
}

type PutLedPositionInArrayArgs = {
  initialLedPositionArray: OptionLedPosArrayType;
  unmappedLedPositionArray: Array<LedPosProps>;
};
const putLedPositionInArray = ({
  initialLedPositionArray,
  unmappedLedPositionArray,
}: PutLedPositionInArrayArgs) => {
  unmappedLedPositionArray.forEach((ledPosition) => {
    const { ledIndex } = ledPosition;
    initialLedPositionArray[ledIndex] = ledPosition;
  });
  return unmappedLedPositionArray;
};

const createInitialArray = (numCaptures: number) => {
  const initialArray = new Array<LedPosProps | null>(numCaptures);
  initialArray.fill(null);
  return initialArray;
};

const mapData = ({ captureData, numCaptures }: MapDataArgs) => {
  const keys = Object.keys(captureData);

  const intial: MappedCaptureDataType = {};

  const mappedData = keys.reduce((acc, key) => {
    const ledPositionArray = createInitialArray(numCaptures);
    const unmappedLedPositionArray = captureData[key];
    const newData = putLedPositionInArray({
      initialLedPositionArray: ledPositionArray,
      unmappedLedPositionArray,
    });
    return {
      ...acc,
      [key]: newData,
    };
  }, intial);

  return mappedData;
};

export default mapData;
