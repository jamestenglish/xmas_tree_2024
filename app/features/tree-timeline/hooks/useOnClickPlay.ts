import { Timeline } from "animation-timeline-js";
import { useCallback, useEffect } from "react";
import { useShallow } from "zustand/shallow";
// import useOnClickPlayStateMachine from "./useOnClickPlayStateMachine";
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
  const { setTimelineExportState, timelineExportState, setTimelineCoarseTime } =
    useEditorStore(
      useShallow((state) => ({
        setTimelineCoarseTime: state.setTimelineCoarseTime,
        timelineExportState: state.timelineExportState,
        setTimelineExportState: state.setTimelineExportState,
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

  // useOnClickPlayStateMachine();

  return { onClickPlay };
}
