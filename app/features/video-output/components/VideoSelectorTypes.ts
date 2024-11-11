import {
  LedPosProps,
  PromiseStateType,
} from "~/features/led-detection/functions/imageProcessingTypes";

export interface CaptureArgs {
  ledIndex: number;
  promiseObj?: PromiseStateType;
}

export type CaptureResultType = {
  position: string;
  ledPositionMeta: LedPosProps;
};

export type CaptureType = ({
  ledIndex,
}: CaptureArgs) => Promise<CaptureResultType | null>;

export interface VideoContainerRef {
  capture: CaptureType;
}
