import {
  // LedPosProps,
  PromiseStateType,
} from "~/features/led-detection/functions/imageProcessingTypes";
import { CaptureResultType } from "~/routes/_index";

export interface CaptureArgs {
  ledIndex: number;
  promiseObj?: PromiseStateType;
}

export interface CaptureNoLedArgs {
  promiseObj?: PromiseStateType;
}

// export type CaptureResultType = {
//   position: string;
//   ledPositionMeta: LedPosProps;
// };

export interface CaptureLedRefTypeArgs {
  ledIndex: number;
  imageBytesNoLeds: Uint8Array;
}

export type CaptureLedRefType = ({
  ledIndex,
  imageBytesNoLeds,
}: CaptureLedRefTypeArgs) => Promise<CaptureResultType | null>;

export type CaptureNoLedResultType = {
  position: string;
  imageBytesNoLeds: Uint8Array;
};

export type CaptureNoLedRefType = (
  args: CaptureNoLedArgs,
) => Promise<CaptureNoLedResultType | null>;

export interface VideoContainerRef {
  captureNoLed: CaptureNoLedRefType;
  captureLed: CaptureLedRefType;
}
