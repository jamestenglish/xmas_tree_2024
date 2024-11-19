import { Timeline } from "animation-timeline-js";
import { useCallback, useEffect } from "react";
import { v7 } from "uuid";
import { useShallow } from "zustand/shallow";
import findAllTimelineObjectsByGroupId from "~/features/tree-editor/state/functions/findAllTimelineObjectsByGroupId";
import useEditorStore from "~/features/tree-editor/state/useEditorStore";
import useOnClickPlayStateMachine from "./useOnClickPlayStateMachine";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const hateMyself = (func: any, _pause: any) => {
  // setTimeout(() => {
  func();
  // }, 1000);
  // _pause();
};
const playStep = 50;

type UseOnPlayClickArgs = {
  timeline: Timeline | undefined;
  timelineElRef: React.RefObject<HTMLDivElement>;
};

export default function useOnClickPlay({
  timeline,
  timelineElRef,
}: UseOnPlayClickArgs) {
  const { timelineExportState, setTimelineExportState, setTimelineCoarseTime } =
    useEditorStore(
      useShallow((state) => ({
        timelineExportState: state.timelineExportState,
        setTimelineExportState: state.setTimelineExportState,
        setTimelineCoarseTime: state.setTimelineCoarseTime,
      })),
    );

  const timelineIsPlaying = timelineExportState.status === "PLAY";

  const max =
    timelineExportState?.canvasCylinderImgUrlsData?.reduce((acc, datum) => {
      if (datum.end > acc) {
        return datum.end;
      }
      return acc;
    }, -1) ?? 0;

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
        if (timelineIsPlaying && timeline) {
          let newTime = timeline.getTime() + playStep;
          if (newTime - 1 > max) {
            newTime = 0;
          }
          timeline.setTime(newTime);
          moveTimelineIntoTheBounds();
          if (newTime % 200 === 0) {
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
    max,
    moveTimelineIntoTheBounds,
    setTimelineCoarseTime,
    timeline,
    timelineElRef,
    timelineIsPlaying,
  ]);

  const onClickPlay = useCallback(
    (_event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      // const startPlaying = () => {

      setTimelineExportState({ status: "START", groupIds: [] as string[] });

      if (timeline) {
        moveTimelineIntoTheBounds();
        // Don't allow to manipulate timeline during playing (optional).
        timeline.setOptions({ timelineDraggable: false });
      }
      // };

      // startPlaying();
    },
    [moveTimelineIntoTheBounds, setTimelineExportState, timeline],
  );

  useOnClickPlayStateMachine();

  return { onClickPlay };
}
