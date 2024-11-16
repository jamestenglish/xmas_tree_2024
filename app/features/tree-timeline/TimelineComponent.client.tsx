import React, { useCallback, useEffect, useRef } from "react";
import { Timeline } from "animation-timeline-js";
import useInitTimelineListeners from "./hooks/useInitTimelineListeners";
import useInitTimeline from "./hooks/useInitTimeline";
import TimelineButtons from "./TimelineButtons";

import { setAutoFreeze } from "immer";
import "./assets/demo.css";
import Outline from "./Outline";
import useEditorStore from "../tree-editor/hooks/useEditorStore";

setAutoFreeze(false);

function useSyncModel(timeline: Timeline | undefined) {
  const model = useEditorStore((state) => state.model);
  useEffect(() => {
    // console.log("setting model", { model });
    timeline?.setModel(model);
  }, [model, timeline]);
}

function TimelineComponent() {
  const timelineElRef = useRef<HTMLDivElement>(null);
  const outlineContainerRef = useRef<HTMLDivElement>(null);
  const outlineScrollContainerRef = useRef<HTMLDivElement>(null);

  const { timeline } = useInitTimeline({ timelineElRef });

  useInitTimelineListeners({
    timeline,
    outlineContainerRef,
    outlineScrollContainerRef,
  });

  useSyncModel(timeline);

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
          <TimelineButtons timeline={timeline} timelineElRef={timelineElRef} />
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
                <Outline timeline={timeline} />
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
