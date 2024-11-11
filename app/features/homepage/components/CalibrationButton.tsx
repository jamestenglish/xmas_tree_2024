import { useCallback, useState } from "react";

import Button from "~/features/ui/components/Button";
import { PromiseStateType } from "~/features/led-detection/functions/imageProcessingTypes";
import getPromiseWithResolver from "~/features/common/functions/getPromiseWithResolver";
import { CaptureDataType } from "../hooks/useCaptureDataLocalStorage";
import saveCaptureResultsForIndex, {
  RefObjType,
} from "../functions/saveCaptureResultsForIndex";

export type CalibrationButtonProps = {
  refsObj: RefObjType;
  setCaptureData: React.Dispatch<React.SetStateAction<CaptureDataType>>;
};

type CalibrationStateType =
  | "Calibrate A"
  | "Calibrate A Finish"
  | "Calibrate B"
  | "Calibrate B Finish"
  | "Calibrate C"
  | "Calibrate C Finish"
  | "Restart";

type CalibrationStateMachineType = {
  [key in CalibrationStateType]: {
    nextState: CalibrationStateType;
    ledIndex: number;
    doCreatePromise: boolean;
  };
};

const calibrationStateMachine: CalibrationStateMachineType = {
  ["Calibrate A"]: {
    nextState: "Calibrate A Finish",
    ledIndex: 0,
    doCreatePromise: true,
  },
  ["Calibrate A Finish"]: {
    nextState: "Calibrate B",
    ledIndex: 0,
    doCreatePromise: false,
  },

  ["Calibrate B"]: {
    nextState: "Calibrate B Finish",
    ledIndex: 1,
    doCreatePromise: true,
  },
  ["Calibrate B Finish"]: {
    nextState: "Calibrate C",
    ledIndex: 1,
    doCreatePromise: false,
  },

  ["Calibrate C"]: {
    nextState: "Calibrate C Finish",
    ledIndex: 2,
    doCreatePromise: true,
  },
  ["Calibrate C Finish"]: {
    nextState: "Restart",
    ledIndex: 2,
    doCreatePromise: false,
  },
  ["Restart"]: {
    nextState: "Calibrate A",
    ledIndex: -1,
    doCreatePromise: false,
  },
};

const advanceCalibrationState = (prev: CalibrationStateType) => {
  console.group("advanceCalibrationState");
  const { nextState } = calibrationStateMachine[prev];
  console.log({ nextState });
  console.groupEnd();
  return nextState;
};

const CalibrationButton = ({
  refsObj,
  setCaptureData,
}: CalibrationButtonProps) => {
  const [calibrationState, setCalibrationState] =
    useState<CalibrationStateType>("Calibrate A");

  const [promiseObj, setPromiseObj] = useState<PromiseStateType | null>(null);

  const onCalibrationClick = useCallback(() => {
    console.group("CalibrationButton.onCalibrationClick");
    console.log("advance 1");
    setCalibrationState(advanceCalibrationState);

    const { ledIndex, doCreatePromise } =
      calibrationStateMachine[calibrationState];

    const newPromiseObj = doCreatePromise ? getPromiseWithResolver() : null;
    setPromiseObj(newPromiseObj);
    console.info({ newPromiseObj });

    const saveCaptureResult = async () => {
      console.group("onCalibrationClick.saveCaptureResult");
      await saveCaptureResultsForIndex({
        refsObj,
        ledIndex,
        setCaptureData,
        promiseObj: newPromiseObj,
      });

      console.log("advance 2");

      setCalibrationState(advanceCalibrationState);
      console.groupEnd();
    };

    console.info({ doCreatePromise });
    if (doCreatePromise) {
      saveCaptureResult();
    }
    console.groupEnd();
  }, [calibrationState, refsObj, setCaptureData]);

  const onCalibrationFinishClick = useCallback(() => {
    const { doCreatePromise } = calibrationStateMachine[calibrationState];
    if (!doCreatePromise) {
      if (promiseObj?.resolve) {
        promiseObj?.resolve();
      }
    }
  }, [calibrationState, promiseObj]);

  const { doCreatePromise } = calibrationStateMachine[calibrationState];

  return (
    <>
      {doCreatePromise ? (
        <Button onClick={onCalibrationClick}>{calibrationState}</Button>
      ) : (
        <Button onClick={onCalibrationFinishClick}>{calibrationState}</Button>
      )}
    </>
  );
};

export default CalibrationButton;
