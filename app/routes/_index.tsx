import {
  // redirect,
  type ActionFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";

import { useEffect, useState } from "react";

import { calibrateUsingCamera } from "~/features/led-detection/functions/imageProcessing.client";
import VideoContainer from "~/features/video-output/components/VideoContainer";

// import { processImage } from "~/features/yetiize/helpers/imglyProcessNode.server";

// import { Params } from "@remix-run/react";
// import { z } from "zod";

export const meta: MetaFunction = () => {
  return [
    { title: "Photobooth" },
    { name: "description", content: "Cool photobooth!" },
  ];
};

export const action = async ({ params, request }: ActionFunctionArgs) => {};

interface IPromiseState {
  promise: Promise<null>;
  resolve: any;
}

type PromiseStateType = IPromiseState | null;

export default function Index() {
  const [intialized, setInitialized] = useState<boolean>(false);
  const [videoElements, setVideoElements] = useState<Array<HTMLVideoElement>>(
    [],
  );
  const [promiseObj, setPromiseObj] = useState<PromiseStateType>(null);
  const [deviceIds, setDeviceIds] = useState<Array<string>>([]);

  useEffect(() => {
    const playVideo = async (deviceId: string, elId: string) => {
      console.log({ deviceId, elId });
      const streamA = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: {
            exact: deviceId,
          },
          width: { max: 1920, ideal: 1920 },
          height: { max: 1080, ideal: 1080 },
        },
      });

      const videoA = document.getElementById(elId) as HTMLVideoElement;
      videoA.srcObject = streamA;
      videoA.onloadedmetadata = () => {
        console.log("onloadedmetadata", { deviceId, elId });
        videoA.play();
        setVideoElements((prev) => {
          return [...prev, videoA];
        });
      };
    };

    const start = async () => {
      if (intialized) {
        console.log("already initialized");
        return;
      }
      // setInitialized(true);
      console.log(`start ${intialized}`);
      if (!navigator.mediaDevices?.enumerateDevices) {
        console.log("enumerateDevices() not supported.");
      } else {
        const result = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        console.log({ result });
        // List cameras and microphones.
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras: Array<string> = [];
        devices.forEach((device) => {
          console.log(
            `${device.kind}: ${device.label} id = ${device.deviceId}`,
          );
          if (device.kind == "videoinput") {
            console.log(`pushing ${device.deviceId}`);
            cameras.push(device.deviceId);
          }
        });

        console.log(cameras);
        setDeviceIds(cameras);

        // if (cameras.length > 0) {
        //   await playVideo(cameras[0], "videoA");
        // }
        // if (cameras.length > 1) {
        //   await playVideo(cameras[1], "videoB");
        // }
      }

      let resolve: any;
      const promise = new Promise<null>((resolveInner) => {
        resolve = resolveInner;
      });
      setPromiseObj({ promise, resolve });
    };

    start();
    setInitialized(true);
  }, []);

  return (
    <>
      <div>foo bar</div>
      <button
        onClick={() => calibrateUsingCamera("", videoElements[0], promiseObj)}
      >
        Calibrate
      </button>
      <button
        onClick={() => {
          if (promiseObj !== null) {
            console.log("resolving");
            promiseObj.resolve(null);
          }
        }}
      >
        Resolve
      </button>
      {/* <video id="videoA" /> */}
      <canvas id="canvasA" />
      {/* <video id="videoB" /> */}
      {deviceIds.map((deviceId, index) => {
        if (index > 0) {
          return <></>;
        }
        return (
          <VideoContainer key={deviceId} id={deviceId} deviceId={deviceId} />
        );
      })}
    </>
  );
}
