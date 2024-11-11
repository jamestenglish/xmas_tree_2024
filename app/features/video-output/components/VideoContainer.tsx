import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import Canvas from "./Canvas.client";
import Button from "~/features/ui/components/Button";
import { calibrateUsingCamera } from "~/features/led-detection/functions/imageProcessing.client";
import useLocalStorageInternal from "~/features/common/hooks/useLocalStorageInternal";
import type { CaptureArgs, VideoContainerRef } from "./VideoSelectorTypes";

interface PlayVideoProps {
  deviceId: string;
}

interface VideoContainerProps extends PlayVideoProps {
  position: string;
}

interface ImageMetaProps {
  imgUrl?: string;
  height?: number;
  width?: number;
}

interface UsePlayVideoProps {
  setVideoElement: React.Dispatch<
    React.SetStateAction<HTMLVideoElement | null>
  >;
  deviceId: string;
  position: string;
  setDimensions: React.Dispatch<
    React.SetStateAction<{
      height: number;
      width: number;
    } | null>
  >;
}

const usePlayVideo = ({
  setVideoElement,
  deviceId,
  position,
  setDimensions,
}: UsePlayVideoProps) => {
  useEffect(() => {
    const playVideo = async ({ deviceId }: PlayVideoProps) => {
      console.group("usePlayVideo.playVideo");
      console.info({ deviceId });
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: {
            exact: deviceId,
          },
          //   width: { max: 1920, ideal: 1920 },
          //   height: { max: 1080, ideal: 1080 },
        },
      });
      const tracks = stream.getVideoTracks();
      console.log({ tracks });
      const settings = tracks[0].getSettings();
      setDimensions(
        settings.height && settings.width
          ? { height: settings.height, width: settings.width }
          : null,
      );

      console.log("-----", { settings });
      const video = document.getElementById(deviceId) as HTMLVideoElement;
      video.srcObject = stream;
      video.onloadedmetadata = () => {
        console.group("usePlayVideo.playVideo.onloadedmetadata");

        console.info({ deviceId });
        video.play();
        setVideoElement(video);
        console.groupEnd();
      };
      console.groupEnd();
    };

    playVideo({ deviceId });
  }, [deviceId, position, setDimensions, setVideoElement]);
};

// const defaultPromiseArg = {
//   promise: Promise.resolve(null),
//   resolve: () => true,
// };
const VideoContainer = forwardRef<VideoContainerRef, VideoContainerProps>(
  ({ deviceId, position }: VideoContainerProps, ref) => {
    const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(
      null,
    );
    const [imgUrlMeta, setImgUrlMeta] = useState<ImageMetaProps | undefined>();
    const [maskArrayStorage, setMaskArrayStorage] = useLocalStorageInternal<
      Array<boolean>
    >(`mask-${position}`, []);
    const [dimensions, setDimensions] = useState<{
      height: number;
      width: number;
    } | null>(null);
    usePlayVideo({
      setVideoElement,
      deviceId,
      position,
      setDimensions,
    });

    const onCreateMask = useCallback(() => {
      if (videoElement !== null) {
        const canvas = document.getElementById(
          `onCreateMask${deviceId}`,
        ) as HTMLCanvasElement;
        const context = canvas.getContext("2d");
        if (context !== null) {
          const { videoWidth: width, videoHeight: height } = videoElement;

          canvas.width = width;
          canvas.height = height;
          context.drawImage(videoElement, 0, 0, width, height);

          const data = canvas.toDataURL("image/png");
          setImgUrlMeta({ imgUrl: data, width, height });
        }
      }
    }, [deviceId, videoElement]);

    useImperativeHandle(ref, () => {
      return {
        // TODO JTE
        capture: async ({ ledIndex, promiseObj }: CaptureArgs) => {
          if (videoElement !== null) {
            // const promiseArg = promiseObj ?? defaultPromiseArg;
            const ledPositionMeta = await calibrateUsingCamera(
              deviceId,
              videoElement,
              maskArrayStorage,
              ledIndex,
              promiseObj,
            );

            return { position, ledPositionMeta };
          }
          return null;
        },
      };
    }, [deviceId, maskArrayStorage, position, videoElement]);

    return (
      <>
        <div>
          <Button onClick={onCreateMask}>Create Mask</Button>
        </div>
        <div className="flex flex-row content-start">
          <video
            id={deviceId}
            style={
              dimensions
                ? {
                    width: `${dimensions.width}px`,
                    height: `${dimensions.height}px`,
                  }
                : undefined
            }
          />
          <canvas
            id={`calibrate${deviceId}`}
            style={
              dimensions
                ? {
                    width: `${dimensions.width}px`,
                    height: `${dimensions.height}px`,
                  }
                : undefined
            }
          />

          <Canvas
            imgUrl={imgUrlMeta?.imgUrl}
            height={imgUrlMeta?.height}
            width={imgUrlMeta?.width}
            deviceId={deviceId}
            position={position}
            setMaskArrayStorage={setMaskArrayStorage}
          />
          <canvas
            id={`onCreateMask${deviceId}`}
            style={
              dimensions
                ? {
                    width: `${dimensions.width}px`,
                    height: `${dimensions.height}px`,
                    display: "none",
                  }
                : { display: "none" }
            }
          />
        </div>
      </>
    );
  },
);

VideoContainer.displayName = "VideoContainer";

export default VideoContainer;
