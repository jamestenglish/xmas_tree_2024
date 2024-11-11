import { forwardRef } from "react";
import Select from "~/features/ui/components/Select";
import VideoContainer from "~/features/video-output/components/VideoContainer";
import type { VideoContainerRef } from "./VideoSelectorTypes";
import { OnChangeFormType } from "~/features/common/hooks/useFormData";
import { DeviceMetaType } from "~/features/homepage/hooks/useDeviceMeta";

interface DeviceSelectorProps {
  onChangeForm: OnChangeFormType;
  deviceMetas: DeviceMetaType[];
  position: string;
}

export interface VideoSelectorProps extends DeviceSelectorProps {
  selectedDeviceId?: string;
}

const DeviceSelector = ({
  position,
  onChangeForm,
  deviceMetas,
}: DeviceSelectorProps) => {
  return (
    <div className="mb-6 grid gap-6 md:grid-cols-6">
      <Select id={`${position}DeviceId`} onChange={onChangeForm}>
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
    {
      onChangeForm,
      deviceMetas,
      selectedDeviceId,
      position,
    }: VideoSelectorProps,
    ref,
  ) => {
    return (
      <>
        <DeviceSelector
          onChangeForm={onChangeForm}
          deviceMetas={deviceMetas}
          position={position}
        />
        {selectedDeviceId && (
          <VideoContainer
            ref={ref}
            deviceId={selectedDeviceId}
            position={position}
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
