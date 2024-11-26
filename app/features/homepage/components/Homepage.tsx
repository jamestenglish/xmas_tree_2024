import { useCallback, useEffect, useState } from "react";

import Button from "~/features/ui/components/Button";
// import { useLocalStorageInternalRemove } from "~/features/common/hooks/useLocalStorageInternal";
import VideoSelector from "~/features/video-output/components/VideoSelector";
import useDeviceMeta from "../hooks/useDeviceMeta";
import { FormDataProps } from "~/features/common/hooks/useFormData";
import useQuadrantRefs from "../hooks/useQuadrantRefs";
import CalibrationButton from "./CalibrationButton";
import NormalizeButton from "./NormalizeButton";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { HomepageDataType, LedPosProps, loader } from "~/routes/_index";
import getCaptureResultsForIndex from "../functions/getCaptureResultsForIndex";
import { produce } from "immer";

export interface CaptureDataType {
  [key: string]: Array<LedPosProps>;
}

// type HomePageFormProviderProps = {};

// function HomePage({
//   children,
// }: PropsWithChildren<HomePageFormProviderProps>) {
// TODO JTE starting light
// TODO JTE better calibration
// TODO JTE configurable wait
// TODO JTE send api call
// TODO JTE save results to JSON
// TODO JTE stop/pause
export default function HomePage() {
  const { numLights, currentLedIndex } = useLoaderData<typeof loader>();

  const methods = useForm<FormDataProps>({
    values: { numLights, currentLedIndex },
  });

  return (
    <FormProvider {...methods}>
      <HomepageForm />
    </FormProvider>
  );
}
function HomepageForm() {
  const loaderData = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof loader>();
  const { isRunning, currentLedIndex, positionMasks, positionPaths } =
    loaderData;

  console.log({ loaderData });
  const refsObj = useQuadrantRefs();
  const { frontRef, backRef, leftRef, rightRef } = refsObj;
  // const removeKeys = useLocalStorageInternalRemove();

  const deviceMetas = useDeviceMeta();
  // const [_captureData, setCaptureData] = useState<CaptureDataType>({});
  // const [_calibrationData, setCalibrationData] = useState<CaptureDataType>({});
  const [capturePromise, setCapturePromise] = useState<Promise<void>>(
    Promise.resolve(),
  );

  const {
    register,
    // watch,
    handleSubmit,
  } = useFormContext();

  // const numLights = watch("numLights");

  // const { onCapture } = useOnCapture(refsObj, numLights, setCaptureData);

  useEffect(() => {
    const capture = async () => {
      if (isRunning) {
        const captureResultsForIndex = await getCaptureResultsForIndex({
          refsObj,
          ledIndex: currentLedIndex,
        });

        const nextState = produce(loaderData, (state) => {
          const { captureResults = [] } = state;
          captureResults.push(...captureResultsForIndex);
          state.captureResults = captureResults;
          state.intent = "capture";
        });

        fetcher.submit(nextState, {
          method: "POST",
          encType: "application/json",
        });
      }
    };

    if (isRunning) {
      capturePromise.then(() => {
        const newCapturePromise = capture();
        console.log("capture!");
        setCapturePromise(newCapturePromise);
      });
    }
    // JTE we only want this to run when these change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, currentLedIndex]);

  const onSubmit = useCallback(
    (data: FormDataProps) => {
      const newData: HomepageDataType = {
        ...loaderData,
        isRunning: true,
        numLights: data?.numLights ?? loaderData.numLights,
        currentLedIndex: (data?.currentLedIndex ?? 0) - 1,
        intent: "capture",
      };
      fetcher.submit(newData, { method: "POST", encType: "application/json" });
    },
    [fetcher, loaderData],
  );

  const onClickReset = useCallback(() => {
    fetcher.submit(
      { intent: "reset" },
      { method: "POST", encType: "application/json" },
    );
  }, [fetcher]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-12">
          {isRunning && <p>Running on: {currentLedIndex}</p>}
          <p className="text-2xl">Inital Calibation</p>
          <CalibrationButton refsObj={refsObj} />

          <NormalizeButton />

          <p className="text-2xl">Tree Light Calibrator</p>

          <Button onClick={onClickReset}>Reset All</Button>
          {/* <Button onClick={onCapture}>Capture</Button> */}
          {!isRunning && <Button type="submit">Capture</Button>}

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
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder="100"
                required
                {...register("numLights", {
                  valueAsNumber: true,
                })}
              />
            </div>
            <div>
              <label
                htmlFor="first_name"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Start Index
              </label>
              <input
                type="number"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder="0"
                required
                {...register("currentLedIndex", {
                  valueAsNumber: true,
                })}
              />
            </div>
          </div>

          <div>
            <p>Front</p>
            <VideoSelector
              deviceMetas={deviceMetas}
              position="front"
              ref={frontRef}
              positionMasks={positionMasks}
              positionPaths={positionPaths}
            />
          </div>

          <div>
            <p>Right</p>
            <VideoSelector
              deviceMetas={deviceMetas}
              positionMasks={positionMasks}
              position="right"
              ref={rightRef}
              positionPaths={positionPaths}
            />
          </div>

          <div>
            <p>Back</p>
            <VideoSelector
              deviceMetas={deviceMetas}
              positionMasks={positionMasks}
              position="back"
              ref={backRef}
              positionPaths={positionPaths}
            />
          </div>

          <div>
            <p>Left</p>
            <VideoSelector
              deviceMetas={deviceMetas}
              position="left"
              ref={leftRef}
              positionMasks={positionMasks}
              positionPaths={positionPaths}
            />
          </div>
        </div>
      </form>
    </>
  );
}
