import { Timeline, TimelineInteractionMode } from "animation-timeline-js";
import { useCallback, useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import useEditorStore from "~/features/tree-editor/hooks/useEditorStore";

type UseTimelineInteractionsType = {
  timeline: Timeline | undefined;
};

export type OnSelectModelType = () => void;
export type OnPaneModeType = (interactive: boolean) => void;
export type OnZoomModeType = OnSelectModelType;
export type OnNoneModeType = OnSelectModelType;

const useTimelineInteractions = ({ timeline }: UseTimelineInteractionsType) => {
  const { interactionMode, setInteractionMode } = useEditorStore(
    useShallow((state) => ({
      interactionMode: state.interactionMode,
      setInteractionMode: state.setInteractionMode,
    })),
  );
  // sync to timeline
  useEffect(() => {
    if (timeline) {
      timeline.setInteractionMode(interactionMode);
    }
  }, [interactionMode, timeline]);

  const onSelectModel = useCallback(() => {
    if (timeline) {
      setInteractionMode(TimelineInteractionMode.Selection);
    }
  }, [setInteractionMode, timeline]);

  const onPaneMode = useCallback(
    (interactive: boolean) => {
      if (timeline) {
        setInteractionMode(
          interactive
            ? TimelineInteractionMode.Pan
            : TimelineInteractionMode.NonInteractivePan,
        );
      }
    },
    [setInteractionMode, timeline],
  );

  const onZoomMode = useCallback(() => {
    if (timeline) {
      setInteractionMode(TimelineInteractionMode.Zoom);
    }
  }, [setInteractionMode, timeline]);

  const onNoneMode = useCallback(() => {
    if (timeline) {
      setInteractionMode(TimelineInteractionMode.None);
    }
  }, [setInteractionMode, timeline]);

  return { interactionMode, onSelectModel, onPaneMode, onZoomMode, onNoneMode };
};

export default useTimelineInteractions;
