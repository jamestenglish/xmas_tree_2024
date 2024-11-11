import { useEffect, useState } from "react";

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

export default useDeviceIds;
