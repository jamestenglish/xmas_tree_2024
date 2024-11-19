import { Timeline } from "animation-timeline-js";
import { useCallback, useEffect } from "react";
import { v7 } from "uuid";
import { useShallow } from "zustand/shallow";
import findAllTimelineObjectsByGroupId from "~/features/tree-editor/state/functions/findAllTimelineObjectsByGroupId";
import useEditorStore from "~/features/tree-editor/state/useEditorStore";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const hateMyself = (func: any) => {
  setTimeout(() => {
    func();
  }, 5000);
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
  const {
    timelineExportState,
    timelineModel,
    timelineActionId,
    canvasCylinderImgUrl,
    timelineSelectedGroupId,
    setTimelineExportState,
    setTimelineSelectedGroupId,
    setTimelineActionId,
    setTimelineCoarseTime,
  } = useEditorStore(
    useShallow((state) => ({
      timelineExportState: state.timelineExportState,
      timelineModel: state.timelineModel,
      setTimelineExportState: state.setTimelineExportState,
      timelineActionId: state.timelineActionId,
      canvasCylinderImgUrl: state.canvasCylinderImgUrl,
      setTimelineSelectedGroupId: state.setTimelineSelectedGroupId,
      setTimelineActionId: state.setTimelineActionId,
      setTimelineCoarseTime: state.setTimelineCoarseTime,
      timelineSelectedGroupId: state.timelineSelectedGroupId,
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
    // TODO JTE do I need this disable?
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timelineElRef.current, timelineIsPlaying]);

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

  useEffect(() => {
    const {
      status,
      groupIds,
      groupId,
      prevAttributes,
      allTimelineObjectsByGroupId,
    } = timelineExportState;
    const newPrevAttributes = `${timelineActionId}|${canvasCylinderImgUrl}`;

    if (status !== "IDLE") {
      console.log("----------------\n\n\n----------------");
      console.log(`timelineExportState status: ${status}`);
      console.log({ timelineExportState });
    }

    const error = (errorMessage: string) => {
      setTimelineExportState({
        ...timelineExportState,
        status: "ERROR",
        groupIds: [] as string[],
        errorMessage,
      });
    };

    switch (status) {
      case "IDLE":
        return;
      case "START": {
        const allTimelineObjectsByGroupId = findAllTimelineObjectsByGroupId({
          timelineModel,
        });
        console.log({ allTimelineObjectsByGroupId });
        console.log(Object.keys(allTimelineObjectsByGroupId));
        setTimelineExportState({
          status: "GROUP_EXPORT_INIT",
          groupIds: Object.keys(allTimelineObjectsByGroupId),
          allTimelineObjectsByGroupId,
        });

        return;
      }
      case "GROUP_EXPORT_INIT": {
        setTimelineSelectedGroupId(null);
        hateMyself(() => {
          setTimelineExportState({
            ...timelineExportState,
            status: "GROUP_EXPORT_START",
          });
        });
        setTimelineExportState({
          ...timelineExportState,
          status: "PAUSE",
        });
        return;
      }
      case "GROUP_EXPORT_START": {
        if (timelineSelectedGroupId === null) {
          if (groupIds?.length === 0) {
            hateMyself(() => {
              setTimelineExportState({
                ...timelineExportState,
                status: "PLAY",
                groupIds: [] as string[],
              });
            });
            return;
          }
          const [groupId, ...newGroupIds] = groupIds;
          hateMyself(() => {
            setTimelineExportState({
              ...timelineExportState,
              status: "GROUP_EXPORT_LOAD_CANVAS_START",
              groupIds: newGroupIds,
              groupId,
            });
          });
          setTimelineExportState({
            ...timelineExportState,
            status: "PAUSE",
          });
        }
        return;
      }

      case "GROUP_EXPORT_LOAD_CANVAS_START": {
        if (!groupId) {
          error("Error not groupId in GROUP_EXPORT_LOAD_CANVAS_START");
          return;
        }

        setTimelineSelectedGroupId(groupId);
        hateMyself(() => {
          setTimelineExportState({
            ...timelineExportState,
            status: "GROUP_EXPORT_LOAD_CANVAS_EXPORT",
            groupIds,
            groupId,
            prevAttributes: newPrevAttributes,
          });
        });
        setTimelineExportState({
          ...timelineExportState,
          status: "PAUSE",
        });

        return;
      }
      case "GROUP_EXPORT_LOAD_CANVAS_EXPORT": {
        if (timelineSelectedGroupId !== null) {
          setTimelineActionId(v7());
          hateMyself(() => {
            setTimelineExportState({
              ...timelineExportState,
              status: "GROUP_EXPORT_LOAD_CANVAS_WAIT",
            });
          });
          setTimelineExportState({
            ...timelineExportState,
            status: "PAUSE",
          });
        }

        return;
      }
      case "GROUP_EXPORT_LOAD_CANVAS_WAIT": {
        if (
          prevAttributes !== undefined &&
          newPrevAttributes !== prevAttributes
        ) {
          if (!groupId) {
            error("Error not groupId in GROUP_EXPORT_LOAD_CANVAS_WAIT");
            return;
          }
          if (!allTimelineObjectsByGroupId) {
            error(
              "Error not allTimelineObjectsByGroupId in GROUP_EXPORT_LOAD_CANVAS_WAIT",
            );
            return;
          }

          const timelineObjects = allTimelineObjectsByGroupId[groupId];
          if (!timelineObjects) {
            error("Error not timelineObjects in GROUP_EXPORT_LOAD_CANVAS_WAIT");
            return;
          }

          // so ugly, we should now have a canvasCylinderImgUrl
          const prevUrls = timelineExportState.canvasCylinderImgUrlsData ?? [];
          const start = Math.min(
            timelineObjects.keyframes[0].val,
            timelineObjects.keyframes[1].val,
          );
          const end = Math.max(
            timelineObjects.keyframes[0].val,
            timelineObjects.keyframes[1].val,
          );
          const newUrls = [
            ...prevUrls,
            { groupId, canvasCylinderImgUrl, start, end },
          ];

          hateMyself(() => {
            setTimelineExportState({
              ...timelineExportState,
              status: "GROUP_EXPORT_INIT",
              groupIds,
              groupId: null,
              prevAttributes: newPrevAttributes,
              canvasCylinderImgUrlsData: newUrls,
            });
          });
          setTimelineExportState({
            ...timelineExportState,
            status: "PAUSE",
          });
        }

        return;
      }
      case "ERROR": {
        console.error(timelineExportState.errorMessage);
        console.error({ timelineExportState });
        setTimelineExportState({
          status: "IDLE",
          groupIds: [] as string[],
          groupId: null,
          errorMessage: null,
          prevAttributes: null,
          canvasCylinderImgUrlsData: null,
          allTimelineObjectsByGroupId: null,
        });

        return;
      }
    }
  }, [
    canvasCylinderImgUrl,
    setTimelineActionId,
    setTimelineExportState,
    setTimelineSelectedGroupId,
    timelineActionId,
    timelineExportState,
    timelineModel,
    timelineSelectedGroupId,
  ]);

  return { onClickPlay };
}
