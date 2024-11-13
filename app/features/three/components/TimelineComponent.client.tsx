import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Timeline,
  TimelineInteractionMode,
  TimelineModel,
  TimelineRow,
} from "animation-timeline-js";
import useInitTimelineListeners from "../hooks/useInitTimelineListeners";
import useInitTimeline from "../hooks/useInitTimeline";
import TimelineButtons from "./TimelineButtons";

const initialModel: TimelineModel = {
  rows: [
    {
      keyframes: [
        {
          val: 0,
          group: "a",
        },
        {
          val: 3000,
          group: "a",
        },
        {
          val: 3500,
          group: "b",
        },
        {
          val: 4000,
          group: "b",
        },
      ],
    },
    {
      keyframes: [
        {
          val: 50,
          group: "c",
        },
        {
          val: 1000,
          group: "c",
        },
      ],
    },
    {
      keyframes: [
        {
          val: 100,
        },
        {
          val: 1500,
        },
      ],
    },
    {
      keyframes: [
        {
          val: 100,
        },
        {
          val: 1500,
        },
      ],
    },
    {
      keyframes: [
        {
          val: 100,
        },
        {
          val: 1500,
        },
      ],
    },
    {
      keyframes: [
        {
          val: 100,
        },
        {
          val: 1500,
        },
      ],
    },
    {
      keyframes: [
        {
          val: 100,
        },
        {
          val: 1500,
        },
      ],
    },
    {
      keyframes: [
        {
          val: 100,
        },
        {
          val: 1500,
        },
      ],
    },
  ],
} as const;

type OutlineNodeProps = {
  row: TimelineRow;
  timeline: Timeline | undefined;
  index: number;
};

function OutlineNode({ row, timeline, index }: OutlineNodeProps) {
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
    </div>
  );
}

function TimelineComponent() {
  const timelineElRef = useRef<HTMLDivElement>(null);
  const outlineContainerRef = useRef<HTMLDivElement>(null);
  const outlineScrollContainerRef = useRef<HTMLDivElement>(null);

  const [model, setModel] = useState<TimelineModel>(initialModel);

  const [interactionMode, setInteractionMode] =
    useState<TimelineInteractionMode>(TimelineInteractionMode.Pan);

  const { timeline } = useInitTimeline({ timelineElRef });

  useInitTimelineListeners({
    timeline,
    outlineContainerRef,
    outlineScrollContainerRef,
  });

  // Example to subscribe and pass model or time update:
  useEffect(() => {
    timeline?.setModel(model);
    timeline?.setTime(0);
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
            <div className="outline-header" id="outline-header"></div>
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
                      key={index}
                      row={row}
                      index={index}
                      timeline={timeline}
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
