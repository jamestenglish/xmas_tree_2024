import Countdowner from "./Countdowner";
import Flash from "./Flash";
import CapturePreview from "./CapturePreview";
import PhotoboothControls from "./PhotoboothControls";
import { YETIIZE_STATUSES, SCREEN_HEIGHT } from "~/constants";
import {
  useAnimationRefs,
  usePhotoboothImages,
  usePhotoboothStateMethods,
  usePhotoboothStatus,
} from "~/features/photobooth-state/components/PhotoboothStateProvider";
import YetiizeLoading from "~/features/yetiize/components/YetiizeLoading";
import YetiizeControls from "~/features/yetiize/components/YetiizeControls";
import PrintForm from "~/features/wip/components/PrintForm";
import PreviousCaptures from "./PreviousCaptures";
import Cancel from "~/features/wip/components/Cancel";
import clsx from "clsx";
import { useCallback } from "react";
import useIsHydrated from "../hooks/useIsHydrated";
import { useWindowSize } from "usehooks-ts";

export default function Photobooth() {
  const { photoboothStateDispatch } = usePhotoboothStateMethods();
  const { images, finalImg } = usePhotoboothImages();

  const status = usePhotoboothStatus();
  const { containerRef } = useAnimationRefs();

  const onCapture = (imgSrc: string) => {
    photoboothStateDispatch({ type: "captureImg", payload: imgSrc });
    photoboothStateDispatch({ type: "nextStatus" });
  };

  const lastImg = images.length > 0 ? images[images.length - 1] : undefined;

  const areControlsPresent = !YETIIZE_STATUSES.includes(status);
  // default for SSR
  const { height = 0 } = useWindowSize();

  const isFullScreen = height > SCREEN_HEIGHT - 1;

  const makeFullScreen = useCallback(() => {
    const body = document.getElementsByTagName("body")[0];

    body.requestFullscreen();
  }, []);

  const isHydrated = useIsHydrated();

  return (
    <>
      <div className="grid h-full w-full grid-cols-9 grid-rows-9 bg-snow">
        {isHydrated && (
          <div
            className={clsx(
              { hidden: isFullScreen },
              "col-span-3 col-start-1 row-span-3 row-start-1 items-center align-middle",
            )}
          >
            <button
              onClick={makeFullScreen}
              className="align-center font-main inline-flex content-center items-center rounded-3xl border-4 border-pastel px-4 py-2 text-3xl font-bold text-pastel hover:bg-ltblue hover:text-dkblue"
            >
              full
            </button>
          </div>
        )}

        <Flash />
        <Countdowner />
        <YetiizeLoading />
        <CapturePreview lastImg={lastImg} />
        {/* Want to leave this element here so the webcam stays on */}
        {/* because that can take a second to initialize */}
        <div
          className={clsx(
            { hidden: !areControlsPresent },
            "col-span-9 col-start-1 row-span-9 row-start-1 items-center align-middle",
          )}
        >
          <div
            ref={containerRef}
            className="flex h-full flex-col gap-6 overflow-hidden"
          >
            <PhotoboothControls onCapture={onCapture} />

            <PreviousCaptures />
          </div>
        </div>
        {!areControlsPresent && (
          <>
            <YetiizeControls />

            <Cancel />
            <PrintForm imgSrc={finalImg} />
          </>
        )}
      </div>
    </>
  );
}
