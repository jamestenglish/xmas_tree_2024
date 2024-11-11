import { useEffect, useState } from "react";

export type DeviceMetaType = {
  deviceId: string;
  label: string;
};

const getDeviceMetas = async () => {
  const deviceMetas: Array<DeviceMetaType> = [];
  console.group("getDeviceMetas");

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
        deviceMetas.push({ deviceId: device.deviceId, label: device.label });
      }
    });

    console.info({ deviceMetas });
  }
  console.groupEnd();
  return deviceMetas;
};

const useDeviceMeta = () => {
  const [intialized, setInitialized] = useState<boolean>(false);
  const [deviceMetas, setDeviceMetas] = useState<Array<DeviceMetaType>>([]);

  useEffect(() => {
    const intialize = async () => {
      console.group("useDeviceMeta");
      if (intialized) {
        console.info("already initialized");
        console.groupEnd();

        return;
      }
      console.info(`start initialized: ${intialized}`);

      setDeviceMetas(await getDeviceMetas());
      console.groupEnd();
    };

    intialize();
    setInitialized(true);
  }, [intialized]);

  return deviceMetas;
};

export default useDeviceMeta;
