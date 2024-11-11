import {
  // redirect,
  // type ActionFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
// import util from "util";
import { useCallback, useEffect, useRef, useState } from "react";

import Button from "~/features/ui/components/Button";
import { useLocalStorageInternalRemove } from "~/features/common/hooks/useLocalStorageInternal";
import VideoSelector from "~/features/video-output/components/VideoSelector";
import { FormDataProps, OnChangeFormEventType } from "./helpers/indexTypes";
import { VideoContainerRef } from "~/features/video-output/components/VideoSelectorTypes";
import {
  LedPosProps,
  PromiseStateType,
} from "~/features/led-detection/functions/imageProcessingTypes";

type ResolveFunctionType = (value: PromiseLike<null> | null) => void;
type ResolveType = null | ResolveFunctionType;
export const meta: MetaFunction = () => {
  return [
    { title: "Photobooth" },
    { name: "description", content: "Cool photobooth!" },
  ];
};

const getPromiseWithResolver = () => {
  let resolve: ResolveType = null;
  const promise = new Promise<null>((resolveInner) => {
    resolve = resolveInner;
  });

  return { resolve, promise };
};

const getDeviceIds = async () => {
  const deviceIds: Array<string> = [];
  console.group("getDeviceIds");

  if (!navigator.mediaDevices?.enumerateDevices) {
    console.info("enumerateDevices() not supported.");
  } else {
    const result = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
    console.info({ result });
    // List cameras and microphones.
    const devices = await navigator.mediaDevices.enumerateDevices();
    devices.forEach((device) => {
      console.info(`${device.kind}: ${device.label} id = ${device.deviceId}`, {
        device,
      });
      if (device.kind == "videoinput") {
        console.info(`  pushing ${device.deviceId}`);
        deviceIds.push(device.deviceId);
      }
    });

    console.info({ deviceIds });
  }
  console.groupEnd();
  return deviceIds;
};

const useDeviceIds = () => {
  const [intialized, setInitialized] = useState<boolean>(false);
  const [deviceIds, setDeviceIds] = useState<Array<string>>([]);

  useEffect(() => {
    const intialize = async () => {
      console.group("useDeviceIds");
      if (intialized) {
        console.info("already initialized");
        console.groupEnd();

        return;
      }
      console.info(`start initialized: ${intialized}`);

      setDeviceIds(await getDeviceIds());
      console.groupEnd();
    };

    intialize();
    setInitialized(true);
  }, [intialized]);

  return deviceIds;
};

export interface SetCaptureDataProps {
  [key: string]: Array<LedPosProps>;
}

type RefObjType = {
  frontRef: React.RefObject<VideoContainerRef>;
  backRef: React.RefObject<VideoContainerRef>;
  leftRef: React.RefObject<VideoContainerRef>;
  rightRef: React.RefObject<VideoContainerRef>;
};

const getCapturePromises = (
  refsObj: RefObjType,
  ledIndex: number,
  promiseObj?: PromiseStateType,
) => {
  const { frontRef, backRef, leftRef, rightRef } = refsObj;
  const refs = [frontRef, backRef, rightRef, leftRef];

  const promises = refs.map((ref) => {
    return ref && ref?.current
      ? ref.current.capture({
          ledIndex,
          promiseObj,
        })
      : Promise.resolve(null);
  });

  return promises;
};

const saveCaptureResultsForIndex = async (
  refsObj: RefObjType,
  ledIndex: number,
  setCaptureData: React.Dispatch<React.SetStateAction<SetCaptureDataProps>>,
  promiseObj?: PromiseStateType,
) => {
  const { frontRef, backRef, leftRef, rightRef } = refsObj;
  const capturePromises = getCapturePromises(
    { frontRef, backRef, leftRef, rightRef },
    ledIndex,
    promiseObj,
  );

  const captureResults = await Promise.all(capturePromises);

  captureResults.forEach((captureResult) => {
    if (captureResult !== null) {
      const { position, ledPositionMeta } = captureResult;
      setCaptureData((prev) => {
        const oldArray = prev[position] ?? [];
        const newArray = [...oldArray, ledPositionMeta];
        const newValue = {
          ...prev,
          [position]: newArray,
        };
        console.group("saveCaptureResultsForIndex.setCaptureData");
        console.dir({ newValue }, { depth: 5 });
        // console.log(util.inspect(newValue, { depth: null }));

        console.groupEnd();
        return newValue;
      });
    }
  });
};

const useFormData = () => {
  const [formData, setFormData] = useState<FormDataProps>({});
  const onChangeForm = useCallback((event: OnChangeFormEventType) => {
    console.group("useFormData.onChangeForm");
    console.info({ event, value: event.target.value });
    const { id, value } = event.target;
    setFormData((prev) => {
      const newFormData = {
        ...prev,
        [id]: value === "" ? undefined : value,
      };
      console.group("useFormData.onChangeForm.setFormData");
      console.info({ newFormData });
      console.groupEnd();
      return newFormData;
    });
    console.groupEnd();
  }, []);

  return { formData, onChangeForm };
};

const useQuadrantRefs = () => {
  const frontRef = useRef<VideoContainerRef>(null);
  const backRef = useRef<VideoContainerRef>(null);
  const leftRef = useRef<VideoContainerRef>(null);
  const rightRef = useRef<VideoContainerRef>(null);

  return { frontRef, backRef, leftRef, rightRef };
};

const useOnCapture = (
  refsObj: RefObjType,
  formData: FormDataProps,
  setCaptureData: React.Dispatch<React.SetStateAction<SetCaptureDataProps>>,
) => {
  const { frontRef, backRef, leftRef, rightRef } = refsObj;

  const onCapture = useCallback(() => {
    const doCapture = async () => {
      if (!formData?.numLights) {
        throw new Error("Invalid formData.numLight");
      }

      const numLights = formData.numLights;

      for (let ledIndex = 0; ledIndex < numLights; ledIndex++) {
        await saveCaptureResultsForIndex(
          { frontRef, backRef, leftRef, rightRef },
          ledIndex,
          setCaptureData,
        );
      }
    };

    doCapture();
  }, [
    backRef,
    formData.numLights,
    frontRef,
    leftRef,
    rightRef,
    setCaptureData,
  ]);

  return { onCapture };
};

type CalibrationButtonProps = {
  refsObj: RefObjType;
  setCaptureData: React.Dispatch<React.SetStateAction<SetCaptureDataProps>>;
};

type CalibrationStateType =
  | "Calibrate A"
  | "Calibrate A Finish"
  // | "Finish A"
  // | "Finish A Loading"
  | "Calibrate B"
  | "Calibrate B Finish"
  // | "Finish B"
  // | "Finish B Loading"
  | "Calibrate C"
  | "Calibrate C Finish";
// | "Finish C";
// | "Finish C Loading";

type CalibrationStateMachineType = {
  [key in CalibrationStateType]: {
    nextState: CalibrationStateType;
    ledIndex: number;
    doCreatePromise: boolean;
    // disabled: boolean;
  };
};

const calibrationStateMachine: CalibrationStateMachineType = {
  ["Calibrate A"]: {
    nextState: "Calibrate A Finish",
    ledIndex: -1,
    doCreatePromise: true,
    // disabled: false,
  },
  ["Calibrate A Finish"]: {
    nextState: "Calibrate B",
    ledIndex: -1,
    doCreatePromise: false,
    // disabled: true,
  },

  ["Calibrate B"]: {
    nextState: "Calibrate B Finish",
    ledIndex: -2,
    doCreatePromise: true,
    // disabled: false,
  },
  ["Calibrate B Finish"]: {
    nextState: "Calibrate C",
    ledIndex: -2,
    doCreatePromise: false,
    // disabled: true,
  },

  ["Calibrate C"]: {
    nextState: "Calibrate C Finish",
    ledIndex: -3,
    doCreatePromise: true,
    // disabled: false,
  },
  ["Calibrate C Finish"]: {
    nextState: "Calibrate A",
    ledIndex: -3,
    doCreatePromise: false,
    // disabled: true,
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
      await saveCaptureResultsForIndex(
        refsObj,
        ledIndex,
        setCaptureData,
        newPromiseObj,
      );

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

export default function Index() {
  const { formData, onChangeForm } = useFormData();
  const refsObj = useQuadrantRefs();
  const { frontRef, backRef, leftRef, rightRef } = refsObj;
  const removeKeys = useLocalStorageInternalRemove();

  const deviceIds = useDeviceIds();
  const [_captureData, setCaptureData] = useState<SetCaptureDataProps>({});

  const { onCapture } = useOnCapture(refsObj, formData, setCaptureData);

  return (
    <>
      <div className="p-12">
        <p className="text-2xl">Inital Calibation</p>
        <CalibrationButton refsObj={refsObj} setCaptureData={setCaptureData} />

        <p className="text-2xl">Tree Light Calibrator</p>

        <Button onClick={removeKeys}>Reset All</Button>
        <Button onClick={onCapture}>Capture</Button>
        <div className="mb-6 grid gap-6 md:grid-cols-6">
          <div>
            <label
              htmlFor="first_name"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Num Lights
            </label>
            <input
              type="number"
              id="numLights"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="100"
              required
              onChange={onChangeForm}
            />
          </div>
        </div>

        <div>
          <p>Front</p>
          <VideoSelector
            onChangeForm={onChangeForm}
            deviceIds={deviceIds}
            selectedDeviceId={formData?.frontDeviceId}
            position="front"
            ref={frontRef}
          />
        </div>

        <div>
          <p>Right</p>
          <VideoSelector
            onChangeForm={onChangeForm}
            deviceIds={deviceIds}
            selectedDeviceId={formData?.rightDeviceId}
            position="right"
            ref={rightRef}
          />
        </div>

        <div>
          <p>Back</p>
          <VideoSelector
            onChangeForm={onChangeForm}
            deviceIds={deviceIds}
            selectedDeviceId={formData?.backDeviceId}
            position="back"
            ref={backRef}
          />
        </div>

        <div>
          <p>Left</p>
          <VideoSelector
            onChangeForm={onChangeForm}
            deviceIds={deviceIds}
            selectedDeviceId={formData?.leftDeviceId}
            position="left"
            ref={leftRef}
          />
        </div>
      </div>
    </>
  );
}

// const calibrationStateMachine: CalibrationStateMachineType = {
//   ["Start A"]: {
//     nextState: "Start A Loading",
//     ledIndex: -1,
//     doCreatePromise: true,
//     disabled: false,
//   },
//   ["Start A Loading"]: {
//     nextState: "Finish A",
//     ledIndex: -1,
//     doCreatePromise: true,
//     disabled: true,
//   },
//   ["Finish A"]: {
//     nextState: "Finish A Loading",
//     ledIndex: -1,
//     doCreatePromise: false,
//     disabled: false,
//   },
//   ["Finish A Loading"]: {
//     nextState: "Start B",
//     ledIndex: -1,
//     doCreatePromise: false,
//     disabled: true,
//   },
//   ["Start B"]: {
//     nextState: "Start B Loading",
//     ledIndex: -2,
//     doCreatePromise: true,
//     disabled: false,
//   },
//   ["Start B Loading"]: {
//     nextState: "Finish B",
//     ledIndex: -2,
//     doCreatePromise: true,
//     disabled: true,
//   },
//   ["Finish B"]: {
//     nextState: "Finish B Loading",
//     ledIndex: -2,
//     doCreatePromise: false,
//     disabled: false,
//   },
//   ["Finish B Loading"]: {
//     nextState: "Start C",
//     ledIndex: -2,
//     doCreatePromise: false,
//     disabled: true,
//   },
//   ["Start C"]: {
//     nextState: "Start C Loading",
//     ledIndex: -3,
//     doCreatePromise: true,
//     disabled: false,
//   },
//   ["Start C Loading"]: {
//     nextState: "Finish C",
//     ledIndex: -3,
//     doCreatePromise: true,
//     disabled: true,
//   },
//   ["Finish C"]: {
//     nextState: "Finish C Loading",
//     ledIndex: -3,
//     doCreatePromise: false,
//     disabled: false,
//   },
//   ["Finish C Loading"]: {
//     nextState: "Start A",
//     ledIndex: -3,
//     doCreatePromise: false,
//     disabled: true,
//   },
// };

// const calibrationStateMachine: CalibrationStateMachineType = {
//   ["Start A"]: {
//     nextState: "Finish A",
//     ledIndex: -1,
//     doCreatePromise: true,
//   },

//   ["Finish A"]: {
//     nextState: "Start B",
//     ledIndex: -1,
//     doCreatePromise: false,
//   },

//   ["Start B"]: {
//     nextState: "Finish B",
//     ledIndex: -2,
//     doCreatePromise: true,
//   },

//   ["Finish B"]: {
//     nextState: "Start C",
//     ledIndex: -2,
//     doCreatePromise: false,
//   },

//   ["Start C"]: {
//     nextState: "Finish C",
//     ledIndex: -3,
//     doCreatePromise: true,
//   },

//   ["Finish C"]: {
//     nextState: "Start A",
//     ledIndex: -3,
//     doCreatePromise: false,
//   },
// };
