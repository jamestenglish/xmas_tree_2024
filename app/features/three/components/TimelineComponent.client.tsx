import { useEffect, useRef, useState } from "react";
import { Timeline, TimelineModel, TimelineRow } from "animation-timeline-js";

function generateHTMLOutlineListNodes(timeline: Timeline, rows: TimelineRow[]) {
  const outlineContainer = document.getElementById("outline-container");

  const options = timeline.getOptions();
  const headerElement = document.getElementById("outline-header");
  if (!headerElement) {
    return;
  }
  headerElement.style.maxHeight = headerElement.style.minHeight =
    options.headerHeight + "px";
  // headerElement.style.backgroundColor = options.headerFillColor;
  if (!outlineContainer) {
    console.log("Error: Cannot find html element to output outline/tree view");
    return;
  }
  outlineContainer.innerHTML = "";

  rows.forEach(function (row, index) {
    var div = document.createElement("div");
    div.classList.add("outline-node");
    const h =
      (row.style ? row.style.height : 0) ||
      (options.rowsStyle ? options.rowsStyle.height : 0);
    div.style.maxHeight = div.style.minHeight = h + "px";
    div.style.marginBottom =
      ((options.rowsStyle ? options.rowsStyle.marginBottom : 0) || 0) + "px";
    div.innerText = "Track " + index;
    div.id = div.innerText;
    var alreadyAddedWithSuchNameElement = document.getElementById(
      div.innerText,
    );
    // Combine outlines with the same name:
    if (alreadyAddedWithSuchNameElement) {
      var increaseSize =
        Number.parseInt(alreadyAddedWithSuchNameElement.style.maxHeight) +
        (h ?? 0);
      alreadyAddedWithSuchNameElement.style.maxHeight =
        alreadyAddedWithSuchNameElement.style.minHeight = increaseSize + "px";

      return;
    }
    if (outlineContainer) {
      outlineContainer.appendChild(div);
    }
  });
}

type TimelineComponentProps = {
  time?: number;
  model: TimelineModel;
};

function TimelineComponent({ model, time }: TimelineComponentProps) {
  const timelineElRef = useRef<HTMLDivElement>(null);
  const [timeline, setTimeline] = useState<Timeline>();

  useEffect(() => {
    let newTimeline: Timeline | null = null;
    // On component init
    if (timelineElRef.current) {
      newTimeline = new Timeline({ id: timelineElRef.current });
      // Here you can subscribe on timeline component events
      setTimeline(newTimeline);
    }

    // cleanup on component unmounted.
    return () => newTimeline?.dispose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timelineElRef.current]);

  // Example to subscribe and pass model or time update:
  useEffect(() => {
    timeline?.setModel(model);
  }, [model, timeline]);

  // Example to subscribe and pass model or time update:
  useEffect(() => {
    if (time || time === 0) {
      timeline?.setTime(time);
    }
  }, [time, timeline]);

  return (
    <>
      <div className="toolbar">
        <button
          className="button mat-icon material-icons mat-icon-no-color"
          title="Timeline selection mode"
          // onClick="selectMode()"
        >
          tab_unselected
        </button>
        <button
          className="button mat-icon material-icons mat-icon-no-color"
          title="Timeline pan mode with the keyframe selection."
          // onclick="panMode(true)"
        >
          pan_tool_alt
        </button>
        <button
          className="button mat-icon material-icons mat-icon-no-color"
          title="Timeline pan mode non interactive"
          // onclick="panMode(false)"
        >
          pan_tool
        </button>
        <button
          className="button mat-icon material-icons mat-icon-no-color"
          title="Timeline zoom mode. Also ctrl + scroll can be used."
          // onclick="zoomMode()"
        >
          search
        </button>
        <button
          className="button mat-icon material-icons mat-icon-no-color"
          title="Only view mode."
          // onclick="noneMode()"
        >
          visibility
        </button>
        <div
          style={{ width: "1px", background: "gray", height: "100%}" }}
        ></div>
        <button
          className="button mat-icon material-icons mat-icon-no-color"
          title="Use external player to play\stop the timeline. For the demo simple setInterval is used."
          // onclick="onPlayClick()"
        >
          play_arrow
        </button>
        <button
          className="button mat-icon material-icons mat-icon-no-color"
          title="Use external player to play\stop the timeline. For the demo simple setInterval is used."
          // onclick="onPauseClick()"
        >
          pause
        </button>
        <div style={{ flex: 1 }}></div>
        <button
          className="flex-left button mat-icon material-icons mat-icon-no-color"
          title="Remove selected keyframe"
          // onclick="removeKeyframe()"
        >
          close
        </button>
        <button
          className="flex-left button mat-icon material-icons mat-icon-no-color"
          title="Add new track with the keyframe"
          // onclick="addKeyframe()"
        >
          add
        </button>
        <div className="links">
          <a
            className="git-hub-link"
            href="https://github.com/ievgennaida/animation-timeline-control"
          >
            GitHub
          </a>
        </div>
      </div>
      <footer>
        <div className="outline">
          <div className="outline-header" id="outline-header"></div>
          <div
            className="outline-scroll-container"
            id="outline-scroll-container"
            // onWheel="outlineMouseWheel(arguments[0])"
          >
            <div className="outline-items" id="outline-container"></div>
          </div>
        </div>
        <div ref={timelineElRef} id="timeline"></div>
      </footer>
    </>
  );
}
export default TimelineComponent;
// return <div style={{ width: "100%", minHeight: 300 }} ref={timelineElRef} />;
