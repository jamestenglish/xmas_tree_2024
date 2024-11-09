import { useCallback, useEffect, useState } from "react";
import Canvas from "./Canvas.client";
interface IVideoContainer {
  id: string;
  deviceId: string;
}

interface IImageMeta {
  imgUrl?: string;
  height?: number;
  width?: number;
}

export default function VideoContainer({ id, deviceId }: IVideoContainer) {
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(
    null,
  );

  const [imgUrlMeta, setImgUrlMeta] = useState<IImageMeta | undefined>();

  useEffect(() => {
    const playVideo = async ({ id, deviceId }: IVideoContainer) => {
      console.log({ deviceId, id });
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: {
            exact: deviceId,
          },
          //   width: { max: 1920, ideal: 1920 },
          //   height: { max: 1080, ideal: 1080 },
        },
      });

      const video = document.getElementById(id) as HTMLVideoElement;
      video.srcObject = stream;
      video.onloadedmetadata = () => {
        console.log("onloadedmetadata", { deviceId, id });
        video.play();
        setVideoElement(video);
      };
    };

    playVideo({ id, deviceId });
  }, []);

  const onTakePicture = useCallback(() => {
    if (videoElement !== null) {
      const canvas = document.getElementById(
        `canvas${id}`,
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
  }, [videoElement]);

  return (
    <>
      <button className="btn" onClick={onTakePicture}>
        Take Picture
      </button>
      <video id={id} />
      <Canvas
        imgUrl={imgUrlMeta?.imgUrl}
        height={imgUrlMeta?.height}
        width={imgUrlMeta?.width}
      />
      <canvas id={`canvas${id}`} style={{ display: "none" }} />
    </>
  );
}
