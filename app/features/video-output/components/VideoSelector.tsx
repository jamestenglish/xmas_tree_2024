import { forwardRef } from "react";
import Select from "~/features/ui/components/Select";
import VideoContainer from "~/features/video-output/components/VideoContainer";
import { OnChangeFormType } from "~/routes/helpers/indexTypes";
import type { VideoContainerRef } from "./VideoSelectorTypes";

interface DeviceSelectorProps {
  onChangeForm: OnChangeFormType;
  deviceIds: string[];
  position: string;
}

export interface VideoSelectorProps extends DeviceSelectorProps {
  selectedDeviceId?: string;
}

const DeviceSelector = ({
  position,
  onChangeForm,
  deviceIds,
}: DeviceSelectorProps) => {
  return (
    <div className="mb-6 grid gap-6 md:grid-cols-6">
      <Select id={`${position}DeviceId`} onChange={onChangeForm}>
        <option value=""></option>
        {deviceIds.map((deviceId) => {
          return (
            <option key={deviceId} value={deviceId}>
              {deviceId}
            </option>
          );
        })}
      </Select>
    </div>
  );
};

const VideoSelector = forwardRef<VideoContainerRef, VideoSelectorProps>(
  (
    { onChangeForm, deviceIds, selectedDeviceId, position }: VideoSelectorProps,
    ref,
  ) => {
    return (
      <>
        <DeviceSelector
          onChangeForm={onChangeForm}
          deviceIds={deviceIds}
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
