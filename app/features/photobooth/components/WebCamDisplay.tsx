import { useRef, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import { StatusType } from "~/features/photobooth-state/hooks/usePhotoboothState";
import { WEBCAM_HEIGHT, WEBCAM_WIDTH } from "~/constants";
import icon4 from "~/images/yeti-camera-icon-4-removebg-preview.png";
import { usePhotoboothStateMethods } from "~/features/photobooth-state/components/PhotoboothStateProvider";

export default function WebCamDisplay({
  onCapture,
  status,
}: {
  onCapture: (imgSrc: string) => void;
  status: StatusType;
}) {
  const webcamRef = useRef<Webcam>(null);
  const { photoboothStateDispatch } = usePhotoboothStateMethods();

  useEffect(() => {
    if (status === "capture") {
      if (webcamRef.current !== null) {
        const screenshot = webcamRef.current.getScreenshot();

        if (screenshot !== null) {
          onCapture(screenshot);
        }
      }
    }
  });

  const capture = useCallback(() => {
    photoboothStateDispatch({ type: "nextStatus" });
  }, []);

  return (
    <>
      <div className="min-h-[571px] border-4 border-dkblue">
        <Webcam
          height={WEBCAM_HEIGHT}
          width={WEBCAM_WIDTH}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          screenshotQuality={1}
          mirrored={true}
        />
      </div>

      {status === "ready" && (
        <button
          className="font-main my-12 inline-flex items-center rounded-3xl border-4 border-dkblue bg-transparent px-6 py-4 text-6xl font-bold text-dkblue hover:bg-ltblue"
          onClick={capture}
        >
          <img
            src={icon4}
            alt="yeti icon"
            className="mr-2 h-14 w-14 fill-current"
          />
          <span>Take Pictures</span>
          <img
            src={icon4}
            alt="yeti icon"
            className="ml-2 h-14 w-14 fill-current"
          />
        </button>
      )}
    </>
  );
}
