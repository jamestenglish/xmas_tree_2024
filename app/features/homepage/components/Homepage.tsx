import { useState } from "react";

import Button from "~/features/ui/components/Button";
import { useLocalStorageInternalRemove } from "~/features/common/hooks/useLocalStorageInternal";
import VideoSelector from "~/features/video-output/components/VideoSelector";
import useDeviceMeta from "../hooks/useDeviceMeta";
import useFormData from "~/features/common/hooks/useFormData";
import useQuadrantRefs from "../hooks/useQuadrantRefs";
import useCaptureDataLocalStorage, {
  CaptureDataType,
} from "../hooks/useCaptureDataLocalStorage";
import CalibrationButton from "./CalibrationButton";
import useOnCapture from "../hooks/useOnCapture";
import NormalizeButton from "./NormalizeButton";

export default function Homepage() {
  const { formData, onChangeForm } = useFormData();
  const refsObj = useQuadrantRefs();
  const { frontRef, backRef, leftRef, rightRef } = refsObj;
  const removeKeys = useLocalStorageInternalRemove();

  const deviceMetas = useDeviceMeta();
  const [captureData, setCaptureData] = useState<CaptureDataType>({});
  const [calibrationData, setCalibrationData] = useState<CaptureDataType>({});

  useCaptureDataLocalStorage(captureData, "captureData");
  useCaptureDataLocalStorage(calibrationData, "calibrationData");

  const { onCapture } = useOnCapture(refsObj, formData, setCaptureData);

  return (
    <>
      <div className="p-12">
        <p className="text-2xl">Inital Calibation</p>
        <CalibrationButton
          refsObj={refsObj}
          setCaptureData={setCalibrationData}
        />

        <NormalizeButton />

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
            deviceMetas={deviceMetas}
            selectedDeviceId={formData?.frontDeviceId}
            position="front"
            ref={frontRef}
          />
        </div>

        <div>
          <p>Right</p>
          <VideoSelector
            onChangeForm={onChangeForm}
            deviceMetas={deviceMetas}
            selectedDeviceId={formData?.rightDeviceId}
            position="right"
            ref={rightRef}
          />
        </div>

        <div>
          <p>Back</p>
          <VideoSelector
            onChangeForm={onChangeForm}
            deviceMetas={deviceMetas}
            selectedDeviceId={formData?.backDeviceId}
            position="back"
            ref={backRef}
          />
        </div>

        <div>
          <p>Left</p>
          <VideoSelector
            onChangeForm={onChangeForm}
            deviceMetas={deviceMetas}
            selectedDeviceId={formData?.leftDeviceId}
            position="left"
            ref={leftRef}
          />
        </div>
      </div>
    </>
  );
}
