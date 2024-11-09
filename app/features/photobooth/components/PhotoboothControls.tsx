import WebCamDisplay from "./WebCamDisplay";

import {
  useAnimationRefs,
  usePhotoboothStatus,
} from "~/features/photobooth-state/components/PhotoboothStateProvider";
import clsx from "clsx";

export default function PhotoboothControls({
  onCapture,
}: {
  onCapture: (imgSrc: string) => void;
}) {
  const status = usePhotoboothStatus();

  const { webcamDisplayRef } = useAnimationRefs();

  const areControlsVisible = status !== "capturePreview";

  return (
    <>
      <div
        ref={webcamDisplayRef}
        className={clsx(
          { hidden: !areControlsVisible },
          "mx-auto flex flex-col items-center gap-y-2",
        )}
      >
        <WebCamDisplay onCapture={onCapture} status={status} />
      </div>
    </>
  );
}
