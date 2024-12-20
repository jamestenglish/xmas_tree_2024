import { forwardRef } from "react";
import Select from "~/features/ui/components/Select";
import VideoContainer from "~/features/video-output/components/VideoContainer";
import type { VideoContainerRef } from "./VideoSelectorTypes";
import { DeviceMetaType } from "~/features/homepage/hooks/useDeviceMeta";
import { useFormContext } from "react-hook-form";
import {
  PositionMasksType,
  PositionPathsType,
  PositionsType,
} from "~/routes/_index";

interface DeviceSelectorProps {
  deviceMetas: DeviceMetaType[];
  position: PositionsType;
}

export interface VideoSelectorProps extends DeviceSelectorProps {
  selectedDeviceId?: string;
  positionMasks: PositionMasksType;
  positionPaths: PositionPathsType;
}

const DeviceSelector = ({ position, deviceMetas }: DeviceSelectorProps) => {
  const { register } = useFormContext();
  return (
    <div className="mb-6 grid gap-6 md:grid-cols-6">
      <Select {...register(`${position}DeviceId`)}>
        <option value=""></option>
        {deviceMetas.map(({ deviceId, label }) => {
          return (
            <option key={deviceId} value={deviceId}>
              {label}-{deviceId}
            </option>
          );
        })}
      </Select>
    </div>
  );
};

const VideoSelector = forwardRef<VideoContainerRef, VideoSelectorProps>(
  (
    { deviceMetas, position, positionMasks, positionPaths }: VideoSelectorProps,
    ref,
  ) => {
    const { watch } = useFormContext();
    const selectedDeviceId = watch(`${position}DeviceId`);
    return (
      <>
        <DeviceSelector deviceMetas={deviceMetas} position={position} />
        {selectedDeviceId && (
          <VideoContainer
            ref={ref}
            deviceId={selectedDeviceId}
            position={position}
            positionMasks={positionMasks}
            positionPaths={positionPaths}
          />
        )}
      </>
    );
  },
);

VideoSelector.displayName = "VideoSelector";

export default VideoSelector;

export type VideoSelectorType = React.ForwardRefExoticComponent<
  VideoSelectorProps & React.RefAttributes<VideoContainerRef>
>;
