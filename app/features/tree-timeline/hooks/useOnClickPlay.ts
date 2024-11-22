import { Timeline } from "animation-timeline-js";
import { useCallback, useEffect } from "react";
import { useShallow } from "zustand/shallow";
import { SAMPLE_TIME_IN_MS } from "~/features/tree-canvas/functions/getSequenceArgs";
import useEditorStore from "~/features/tree-editor/state/useEditorStore";

const playStep = 50;

interface UseOnPlayClickArgs {
  timeline: Timeline | undefined;
  timelineElRef: React.RefObject<HTMLDivElement>;
}

export default function useOnClickPlay({
  timeline,
  timelineElRef,
}: UseOnPlayClickArgs) {
  //
  const {
    timelinePlayingState,
    setTimelinePlayingState,
    setTimelineCoarseTime,
    timelineKeyframeEnd,

    attributesByGroup,
  } = useEditorStore(
    useShallow((state) => ({
      setTimelineCoarseTime: state.setTimelineCoarseTime,
      timelinePlayingState: state.timelinePlayingState,
      setTimelinePlayingState: state.setTimelinePlayingState,
      timelineKeyframeEnd: state.timelineKeyframeEnd,

      attributesByGroup: state.attributesByGroup,
    })),
  );

  const groupIds = Object.keys(attributesByGroup);
  const potentialMax = groupIds.reduce((acc, groupId) => {
    return Math.max(acc, attributesByGroup[groupId].timelineKeyframeEnd);
  }, 0);

  const max = Math.max(potentialMax, timelineKeyframeEnd);

  const isTimelinePlaying = timelinePlayingState === "playing";

  const moveTimelineIntoTheBounds = useCallback(() => {
    if (timeline) {
      if (
        timeline._startPosMouseArgs ||
        timeline._scrollAreaClickOrDragStarted
      ) {
        // User is manipulating items, don't move screen in this case.
        return;
      }
      const fromPx = timeline.scrollLeft;
      const toPx = timeline.scrollLeft + timeline.getClientWidth();

      const positionInPixels =
        timeline.valToPx(timeline.getTime()) + timeline._leftMargin();
      // Scroll to timeline position if timeline is out of the bounds:
      if (positionInPixels <= fromPx || positionInPixels >= toPx) {
        timeline.scrollLeft = positionInPixels;
      }
    }
  }, [timeline]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;
    // On component init
    if (timelineElRef.current) {
      intervalId = setInterval(() => {
        if (isTimelinePlaying && timeline) {
          let newTime = timeline.getTime() + playStep;
          if (newTime - 1 > max) {
            newTime = 0;
          }
          timeline.setTime(newTime);
          moveTimelineIntoTheBounds();
          if (newTime % SAMPLE_TIME_IN_MS === 0) {
            setTimelineCoarseTime(newTime);
          }
        }
      }, playStep);
    }

    // cleanup on component unmounted.
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [
    isTimelinePlaying,
    max,
    moveTimelineIntoTheBounds,
    setTimelineCoarseTime,
    timeline,
    timelineElRef,
  ]);

  const onClickPlay = useCallback(
    (_event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setTimelinePlayingState("playing");

      if (timeline) {
        moveTimelineIntoTheBounds();
        // Don't allow to manipulate timeline during playing (optional).
        timeline.setOptions({ timelineDraggable: false });
      }
    },
    [moveTimelineIntoTheBounds, setTimelinePlayingState, timeline],
  );

  return { onClickPlay };
}
