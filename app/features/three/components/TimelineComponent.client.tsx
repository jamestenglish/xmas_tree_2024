import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Timeline,
  TimelineInteractionMode,
  // TimelineKeyframe,
} from "animation-timeline-js";
import useInitTimelineListeners from "../hooks/useInitTimelineListeners";
import useInitTimeline from "../hooks/useInitTimeline";
import TimelineButtons from "./TimelineButtons";
import { v7 } from "uuid";
import createRow, { TimelineRowExtra } from "../functions/createRow";

type TimelineModelExtra = {
  rows: TimelineRowExtra[];
};

const initialRow = createRow();
const initialModel: TimelineModelExtra = {
  rows: [initialRow],
};

type OutlineNodeProps = {
  row: TimelineRowExtra;
  timeline: Timeline | undefined;
  setModel: (value: React.SetStateAction<TimelineModelExtra>) => void;
  index: number;
};

function OutlineNode({ row, timeline, setModel, index }: OutlineNodeProps) {
  const onAddTrackGroup = useCallback(() => {
    if (!timeline) {
      return;
    }
    setModel((prev) => {
      if (!prev) {
        return prev;
      }
      if (!row.id) {
        return prev;
      }

      const prevRowIndex = prev.rows.findIndex((prevRow) => {
        return prevRow?.id === row?.id;
      });

      if (prevRowIndex < 0) {
        return prev;
      }

      const prevRow = prev.rows[prevRowIndex];
      const prevKeyframes = prevRow?.keyframes ?? [];
      const groupId = v7();
      const currentTime = timeline.getTime();
      console.log({ currentTime, timeline });
      const newKeyframes = [
        ...prevKeyframes,
        { val: currentTime, group: groupId },
        { val: currentTime + 1000, group: groupId },
      ];
      const newRow = {
        ...prevRow,
        keyframes: newKeyframes,
      };
      const newRows = [
        ...prev.rows.slice(0, prevRowIndex),
        newRow,
        ...prev.rows.slice(prevRowIndex + 1),
      ];

      const next = {
        ...prev,
        rows: newRows,
      };

      console.log({ next });

      return next;
    });
  }, [row.id, setModel, timeline]);

  if (!timeline) {
    return null;
  }

  const options = timeline.getOptions();
  const h =
    (row.style ? row.style.height : 0) ||
    (options.rowsStyle ? options.rowsStyle.height : 0);

  const marginBottom =
    ((options.rowsStyle ? options.rowsStyle.marginBottom : 0) || 0) + "px";

  return (
    <div
      style={{ maxHeight: `${h}px`, minHeight: `${h}px`, marginBottom }}
      className="outline-node"
    >
      Track {index}
      <button
        className="button mat-icon material-icons mat-icon-no-color"
        title="Add a keyframe group"
        onClick={onAddTrackGroup}
      >
        add
      </button>
    </div>
  );
}

// type FindGroupStartIndexArgs = {
//   keyframes: TimelineKeyframe[];
//   selectedGroupId: string;
// };
// const findKeyframeStartIndex = ({
//   keyframes,
//   selectedGroupId,
// }: FindGroupStartIndexArgs) => {
//   const index = keyframes.findIndex(
//     (keyframe) => keyframe.group === selectedGroupId,
//   );

//   return index;
// };

// type UseSelectGroupArgs = {
//   selectedGroupId: string | null | undefined;
//   model: TimelineModelExtra;
// };
// const useSelectGroup = ({ selectedGroupId, model }: UseSelectGroupArgs) => {
//   if (!selectedGroupId) {
//     return;
//   }
//   // const rowIndex = model?.rows?.findIndex((row) => )
// };

function TimelineComponent() {
  const timelineElRef = useRef<HTMLDivElement>(null);
  const outlineContainerRef = useRef<HTMLDivElement>(null);
  const outlineScrollContainerRef = useRef<HTMLDivElement>(null);
  const [_selectedGroupId, setSelectedGroupId] = useState<string | null>();

  const [model, setModel] = useState<TimelineModelExtra>(initialModel);

  // useSelectGroup({ selectedGroupId });
  const [interactionMode, setInteractionMode] =
    useState<TimelineInteractionMode>(TimelineInteractionMode.Pan);

  const { timeline } = useInitTimeline({ timelineElRef });

  useInitTimelineListeners({
    timeline,
    outlineContainerRef,
    outlineScrollContainerRef,
    setSelectedGroupId,
  });

  // Example to subscribe and pass model or time update:
  useEffect(() => {
    timeline?.setModel(model);
    // timeline?.setTime(0);
  }, [model, timeline]);

  const onWheelScroll = useCallback(
    (event: React.WheelEvent<HTMLDivElement>) => {
      // Set scroll back to timeline when mouse scroll over the outline
      if (timeline) {
        const unknownEvent = event as unknown;
        const coercedEvent = unknownEvent as WheelEvent;
        timeline._handleWheelEvent(coercedEvent);
      }
    },
    [timeline],
  );

  return (
    <>
      <div className="timeline-component">
        <div className="toolbar">
          <TimelineButtons
            interactionMode={interactionMode}
            setInteractionMode={setInteractionMode}
            timeline={timeline}
            model={model}
            timelineElRef={timelineElRef}
            setModel={setModel}
          />
        </div>
        <footer>
          <div className="outline">
            <div className="outline-header" id="outline-header">
              .
            </div>
            <div
              className="outline-scroll-container"
              id="outline-scroll-container"
              ref={outlineScrollContainerRef}
              onWheel={onWheelScroll}
            >
              <div
                className="outline-items"
                id="outline-container"
                ref={outlineContainerRef}
              >
                {model.rows.map((row, index) => {
                  return (
                    <OutlineNode
                      /*TODO JTE*/
                      key={row?.id ?? index}
                      row={row}
                      timeline={timeline}
                      setModel={setModel}
                      index={index}
                    />
                  );
                })}
              </div>
            </div>
          </div>
          <div ref={timelineElRef} id="timeline"></div>
        </footer>
      </div>
    </>
  );
}
export default TimelineComponent;
// return <div style={{ width: "100%", minHeight: 300 }} ref={timelineElRef} />;
