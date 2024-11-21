import { Timeline, TimelineInteractionMode } from "animation-timeline-js";
import clsx from "clsx";
import { useCallback } from "react";
import useTimelineInteractions from "./hooks/useTimelineInteractions";
import useEditorStore from "../tree-editor/state/useEditorStore";
import { useShallow } from "zustand/react/shallow";
import useOnClickPlay from "./hooks/useOnClickPlay";

interface TimelineButtonsProps {
  timeline: Timeline | undefined;
  timelineElRef: React.RefObject<HTMLDivElement>;
}

// const playStep = 50;

export default function TimelineButtons({
  timeline,
  timelineElRef,
}: TimelineButtonsProps) {
  //
  const { onSelectModel, onPaneMode, onZoomMode, onNoneMode } =
    useTimelineInteractions({
      timeline,
    });

  const {
    timelineSelectedGroupId,
    deleteSeletedTimelineGroup,

    timelineInteractionMode,
    timelinePlayingState,
    setTimelinePlayingState,
    isTimelinePlayable,
  } = useEditorStore(
    useShallow((state) => ({
      timelineSelectedGroupId: state.timelineSelectedGroupId,
      deleteSeletedTimelineGroup: state.deleteSeletedTimelineGroup,

      timelineInteractionMode: state.timelineInteractionMode,
      timelinePlayingState: state.timelinePlayingState,
      setTimelinePlayingState: state.setTimelinePlayingState,
      isTimelinePlayable: state.isTimelinePlayable,
    })),
  );

  const { onClickPlay } = useOnClickPlay({ timeline, timelineElRef });

  const isTimelinePlaying = timelinePlayingState === "playing";
  const onPauseClick = useCallback(() => {
    setTimelinePlayingState("idle");

    if (timeline) {
      timeline.setOptions({ timelineDraggable: true });
    }
  }, [setTimelinePlayingState, timeline]);

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
      {isTimelinePlayable ? (
        <>
          {!isTimelinePlaying ? (
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
        </>
      ) : (
        <span className="pl-2 pr-2">Save All Canvases To Play</span>
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
