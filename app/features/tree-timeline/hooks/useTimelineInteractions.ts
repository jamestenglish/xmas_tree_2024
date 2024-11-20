import { Timeline, TimelineInteractionMode } from "animation-timeline-js";
import { useCallback, useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import useEditorStore from "~/features/tree-editor/state/useEditorStore";

interface UseTimelineInteractionsType {
  timeline: Timeline | undefined;
}

export type OnSelectModelType = () => void;
export type OnPaneModeType = (interactive: boolean) => void;
export type OnZoomModeType = OnSelectModelType;
export type OnNoneModeType = OnSelectModelType;

const useTimelineInteractions = ({ timeline }: UseTimelineInteractionsType) => {
  //
  const { setTimelineInteractionMode, timelineInteractionMode } =
    useEditorStore(
      useShallow((state) => ({
        timelineInteractionMode: state.timelineInteractionMode,
        setTimelineInteractionMode: state.setTimelineInteractionMode,
      })),
    );

  // sync to timeline
  useEffect(() => {
    if (timeline) {
      timeline.setInteractionMode(timelineInteractionMode);
    }
  }, [timelineInteractionMode, timeline]);

  const onSelectModel = useCallback(() => {
    if (timeline) {
      setTimelineInteractionMode(TimelineInteractionMode.Selection);
    }
  }, [setTimelineInteractionMode, timeline]);

  const onPaneMode = useCallback(
    (interactive: boolean) => {
      if (timeline) {
        setTimelineInteractionMode(
          interactive
            ? TimelineInteractionMode.Pan
            : TimelineInteractionMode.NonInteractivePan,
        );
      }
    },
    [setTimelineInteractionMode, timeline],
  );

  const onZoomMode = useCallback(() => {
    if (timeline) {
      setTimelineInteractionMode(TimelineInteractionMode.Zoom);
    }
  }, [setTimelineInteractionMode, timeline]);

  const onNoneMode = useCallback(() => {
    if (timeline) {
      setTimelineInteractionMode(TimelineInteractionMode.None);
    }
  }, [setTimelineInteractionMode, timeline]);

  return {
    timelineInteractionMode,
    onSelectModel,
    onPaneMode,
    onZoomMode,
    onNoneMode,
  };
};

export default useTimelineInteractions;
