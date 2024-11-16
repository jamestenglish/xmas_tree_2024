import { Timeline, TimelineInteractionMode } from "animation-timeline-js";
import clsx from "clsx";
import { useCallback, useEffect, useState } from "react";
import useTimelineInteractions from "./hooks/useTimelineInteractions";
import useEditorStore from "../tree-editor/hooks/useEditorStore";
import { useShallow } from "zustand/react/shallow";

type TimelineButtonsProps = {
  timeline: Timeline | undefined;
  timelineElRef: React.RefObject<HTMLDivElement>;
};

const playStep = 50;

export default function TimelineButtons({
  timeline,
  timelineElRef,
}: TimelineButtonsProps) {
  const { onSelectModel, onPaneMode, onZoomMode, onNoneMode } =
    useTimelineInteractions({
      timeline,
    });
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

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
        if (isPlaying && timeline) {
          timeline.setTime(timeline.getTime() + playStep);
          moveTimelineIntoTheBounds();
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
  }, [timelineElRef.current, isPlaying]);

  const onPlayClick = useCallback(
    (_event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setIsPlaying(true);
      if (timeline) {
        moveTimelineIntoTheBounds();
        // Don't allow to manipulate timeline during playing (optional).
        timeline.setOptions({ timelineDraggable: false });
      }
    },
    [moveTimelineIntoTheBounds, timeline],
  );

  const onPauseClick = useCallback(() => {
    setIsPlaying(false);
    if (timeline) {
      timeline.setOptions({ timelineDraggable: true });
    }
  }, [timeline]);

  // const onRemoveKeyFrame = useCallback(() => {
  //   if (timeline) {
  //     // Add keyframe
  //     // TODO JTE
  //     const currentModel = timeline.getModel();
  //     if (currentModel && currentModel.rows) {
  //       currentModel.rows.forEach((row) => {
  //         if (row.keyframes) {
  //           row.keyframes = row.keyframes.filter((p) => !p.selected);
  //         }
  //       });
  //       timeline.setModel(currentModel);
  //     }
  //   }
  // }, [timeline]);

  const { addRow, interactionMode } = useEditorStore(
    useShallow((state) => ({
      addRow: state.addRow,
      interactionMode: state.interactionMode,
    })),
  );
  const onAddTrack = useCallback(() => {
    if (timeline) {
      addRow(timeline);
    }
  }, [addRow, timeline]);

  // TODO JTE rewind interaction
  // TODO JTE reset zoom interaction
  // TODO JTE add group, remove group

  return (
    <>
      <button
        className={clsx("button mat-icon material-icons mat-icon-no-color", {
          "button-hover": interactionMode === TimelineInteractionMode.Selection,
        })}
        title="Timeline selection mode"
        onClick={onSelectModel}
      >
        tab_unselected
      </button>
      <button
        className={clsx("button mat-icon material-icons mat-icon-no-color", {
          "button-hover": interactionMode === TimelineInteractionMode.Pan,
        })}
        title="Timeline pan mode with the keyframe selection."
        onClick={() => onPaneMode(true)}
      >
        pan_tool_alt
      </button>
      <button
        className={clsx("button mat-icon material-icons mat-icon-no-color", {
          "button-hover":
            interactionMode === TimelineInteractionMode.NonInteractivePan,
        })}
        title="Timeline pan mode non interactive"
        onClick={() => onPaneMode(false)}
      >
        pan_tool
      </button>
      <button
        className={clsx("button mat-icon material-icons mat-icon-no-color", {
          "button-hover": interactionMode === TimelineInteractionMode.Zoom,
        })}
        title="Timeline zoom mode. Also ctrl + scroll can be used."
        onClick={onZoomMode}
      >
        search
      </button>
      <button
        className={clsx("button mat-icon material-icons mat-icon-no-color", {
          "button-hover": interactionMode === TimelineInteractionMode.None,
        })}
        title="Only view mode."
        onClick={onNoneMode}
      >
        visibility
      </button>
      <div style={{ width: "1px", background: "gray", height: "100%}" }}></div>
      {!isPlaying ? (
        <button
          className="button mat-icon material-icons mat-icon-no-color"
          title="Use external player to play\stop the timeline. For the demo simple setInterval is used."
          onClick={onPlayClick}
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
      <button
        className="flex-left button"
        title="Add new track with the keyframe"
        onClick={onAddTrack}
      >
        <span className="mat-icon material-icons mat-icon-no-color">add</span>
        <span> Add Track</span>
      </button>
    </>
  );
}
