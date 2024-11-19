import { Timeline, TimelineInteractionMode } from "animation-timeline-js";
import clsx from "clsx";
import { useCallback } from "react";
import useTimelineInteractions from "./hooks/useTimelineInteractions";
import useEditorStore from "../tree-editor/state/useEditorStore";
import { useShallow } from "zustand/react/shallow";
import useOnClickPlay from "./hooks/useOnClickPlay";

type TimelineButtonsProps = {
  timeline: Timeline | undefined;
  timelineElRef: React.RefObject<HTMLDivElement>;
};

// const playStep = 50;

export default function TimelineButtons({
  timeline,
  timelineElRef,
}: TimelineButtonsProps) {
  const { onSelectModel, onPaneMode, onZoomMode, onNoneMode } =
    useTimelineInteractions({
      timeline,
    });

  const {
    timelineSelectedGroupId,

    deleteSeletedTimelineGroup,
    timelineInteractionMode,
    setTimelineExportState,
    timelineExportState,
  } = useEditorStore(
    useShallow((state) => ({
      timelineSelectedGroupId: state.timelineSelectedGroupId,
      deleteSeletedTimelineGroup: state.deleteSeletedTimelineGroup,
      timelineInteractionMode: state.timelineInteractionMode,
      setTimelineExportState: state.setTimelineExportState,
      timelineExportState: state.timelineExportState,
    })),
  );

  const timelineIsPlaying = timelineExportState.status === "PLAY";

  const { onClickPlay } = useOnClickPlay({ timeline, timelineElRef });

  // const moveTimelineIntoTheBounds = useCallback(() => {
  //   if (timeline) {
  //     if (
  //       timeline._startPosMouseArgs ||
  //       timeline._scrollAreaClickOrDragStarted
  //     ) {
  //       // User is manipulating items, don't move screen in this case.
  //       return;
  //     }
  //     const fromPx = timeline.scrollLeft;
  //     const toPx = timeline.scrollLeft + timeline.getClientWidth();

  //     const positionInPixels =
  //       timeline.valToPx(timeline.getTime()) + timeline._leftMargin();
  //     // Scroll to timeline position if timeline is out of the bounds:
  //     if (positionInPixels <= fromPx || positionInPixels >= toPx) {
  //       timeline.scrollLeft = positionInPixels;
  //     }
  //   }
  // }, [timeline]);

  // useEffect(() => {
  //   let intervalId: NodeJS.Timeout | undefined;
  //   // On component init
  //   if (timelineElRef.current) {
  //     intervalId = setInterval(() => {
  //       if (timelineIsPlaying && timeline) {
  //         timeline.setTime(timeline.getTime() + playStep);
  //         moveTimelineIntoTheBounds();
  //       }
  //     }, playStep);
  //   }

  //   // cleanup on component unmounted.
  //   return () => {
  //     if (intervalId) {
  //       clearInterval(intervalId);
  //     }
  //   };
  // }, [timelineElRef.current, timelineIsPlaying]);

  // const onPlayClick = useCallback(
  //   (_event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  //     // const startPlaying = () => {

  //     setTimelineIsPlaying(true);

  //     if (timeline) {
  //       moveTimelineIntoTheBounds();
  //       // Don't allow to manipulate timeline during playing (optional).
  //       timeline.setOptions({ timelineDraggable: false });
  //     }
  //     // };

  //     // startPlaying();
  //   },
  //   [moveTimelineIntoTheBounds, setTimelineIsPlaying, timeline],
  // );

  // type TimelineExportStates =
  //   | "IDLE"
  //   | "START"
  //   | "groupExportStart"
  //   | "groupExportDone";

  // let timelineExportState: TimelineExportStates = "IDLE";
  // useEffect(() => {
  //   if (timelineExportState === "IDLE") {
  //     return;
  //   }
  //   if(timelineExportState === "START") {

  //   }
  // }, [timelineExportState]);

  const onPauseClick = useCallback(() => {
    setTimelineExportState({
      status: "IDLE",
      groupIds: [] as string[],
      groupId: null,
      errorMessage: null,
      prevAttributes: null,
      canvasCylinderImgUrlsData: null,
      allTimelineObjectsByGroupId: null,
    });

    if (timeline) {
      timeline.setOptions({ timelineDraggable: true });
    }
  }, [setTimelineExportState, timeline]);

  // const onRemoveKeyFrame = useCallback(() => {
  //   if (timeline) {
  //     // Add keyframe
  //     const currentModel = timeline.getModel();
  //     if (currentModel && currentModel.rows) {
  //       currentModel.rows.forEach((row) => {
  //         if (row.keyframes) {
  //           row.keyframes = row.keyframes.filter((p) => !p.selected);
  //         }
  //       });
  //       timeline.setTimelineModel(currentModel);
  //     }
  //   }
  // }, [timeline]);

  // const onAddTrack = useCallback(() => {
  //   if (timeline) {
  //     addTimelineRow(timeline);
  //   }
  // }, [addTimelineRow, timeline]);

  const onDeleteGroup = useCallback(() => {
    if (timeline) {
      deleteSeletedTimelineGroup();
    }
  }, [deleteSeletedTimelineGroup, timeline]);

  // TODO JTE rewind interaction
  // TODO JTE reset zoom interaction

  return (
    <>
      <button
        className={clsx("button mat-icon material-icons mat-icon-no-color", {
          "button-hover":
            timelineInteractionMode === TimelineInteractionMode.Selection,
        })}
        title="Timeline selection mode"
        onClick={onSelectModel}
      >
        tab_unselected
      </button>
      <button
        className={clsx("button mat-icon material-icons mat-icon-no-color", {
          "button-hover":
            timelineInteractionMode === TimelineInteractionMode.Pan,
        })}
        title="Timeline pan mode with the keyframe selection."
        onClick={() => onPaneMode(true)}
      >
        pan_tool_alt
      </button>
      <button
        className={clsx("button mat-icon material-icons mat-icon-no-color", {
          "button-hover":
            timelineInteractionMode ===
            TimelineInteractionMode.NonInteractivePan,
        })}
        title="Timeline pan mode non interactive"
        onClick={() => onPaneMode(false)}
      >
        pan_tool
      </button>
      <button
        className={clsx("button mat-icon material-icons mat-icon-no-color", {
          "button-hover":
            timelineInteractionMode === TimelineInteractionMode.Zoom,
        })}
        title="Timeline zoom mode. Also ctrl + scroll can be used."
        onClick={onZoomMode}
      >
        search
      </button>
      <button
        className={clsx("button mat-icon material-icons mat-icon-no-color", {
          "button-hover":
            timelineInteractionMode === TimelineInteractionMode.None,
        })}
        title="Only view mode."
        onClick={onNoneMode}
      >
        visibility
      </button>
      <div style={{ width: "1px", background: "gray", height: "100%}" }}></div>
      {!timelineIsPlaying ? (
        <button
          className="button mat-icon material-icons mat-icon-no-color"
          title="Use external player to play\stop the timeline. For the demo simple setInterval is used."
          onClick={onClickPlay}
        >
          play_arrow
        </button>
      ) : (
        <button
          className="button mat-icon material-icons mat-icon-no-color button-hover"
          title="Use external player to play\stop the timeline. For the demo simple setInterval is used."
          onClick={onPauseClick}
        >
          pause
        </button>
      )}
      <button
        className="button mat-icon material-icons mat-icon-no-color"
        title="Use external player to play\stop the timeline. For the demo simple setInterval is used."
        onClick={onPauseClick}
      >
        fast_rewind
      </button>
      <div style={{ flex: 1 }}></div>
      {/* <button
        className="flex-left button mat-icon material-icons mat-icon-no-color"
        title="Remove selected keyframe"
        onClick={onRemoveKeyFrame}
      >
        close
      </button> */}
      {timelineSelectedGroupId && (
        <button
          className="flex-left button"
          title="Remove keyframe group"
          onClick={onDeleteGroup}
        >
          <span> Remove Group</span>
        </button>
      )}
      {/* <button
        className="flex-left button"
        title="Add new track with the keyframe"
        onClick={onAddTrack}
      >
        <span className="mat-icon material-icons mat-icon-no-color">add</span>
        <span> Add Track</span>
      </button> */}
    </>
  );
}
