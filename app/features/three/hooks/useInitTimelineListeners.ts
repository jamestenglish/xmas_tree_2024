import { Timeline } from "animation-timeline-js";

const logMessage = (...args: Array<unknown>) => {
  console.log("TIMELINE LOG", ...args);
};

const logDraggingMessage = (...args: Array<unknown>) => {
  console.log("TIMELINE DRAG", ...args);
};

type UseInitTimelineListenersType = {
  timeline: Timeline | undefined;
  outlineContainerRef: React.RefObject<HTMLDivElement>;
  outlineScrollContainerRef: React.RefObject<HTMLDivElement>;
  setSelectedGroupId: React.Dispatch<
    React.SetStateAction<string | null | undefined>
  >;
};

const useInitTimelineListeners = ({
  timeline,
  outlineContainerRef,
  outlineScrollContainerRef,
  setSelectedGroupId,
}: UseInitTimelineListenersType) => {
  if (timeline) {
    timeline.onSelected(function (obj) {
      logMessage(
        "Selected Event: (" +
          obj.selected.length +
          "). changed selection :" +
          obj.changed.length,
        2,
      );
    });

    timeline.onDragStarted(function (obj) {
      logDraggingMessage(obj, "dragstarted");
    });

    timeline.onDrag(function (obj) {
      logDraggingMessage(obj, "drag");
    });

    timeline.onKeyframeChanged(function (obj) {
      console.log("keyframe: " + obj.val);
    });

    timeline.onDragFinished(function (obj) {
      logDraggingMessage(obj, "dragfinished");
    });

    // timeline.onContextMenu(function (obj) {
    //   if (obj.args) {
    //     obj.args.preventDefault();
    //   }
    //   logDraggingMessage(obj, "addKeyframe");

    //   obj.elements.forEach((p) => {
    //     if (p.type === "row" && p.row) {
    //       if (!p.row?.keyframes) {
    //         p.row.keyframes = [];
    //       }
    //       p.row?.keyframes?.push({ val: obj.point?.val || 0 });
    //     }
    //   });
    //   timeline.redraw();
    // });

    timeline.onMouseDown(function (obj) {
      const type = obj.target ? obj.target.type : "";
      if (obj.pos) {
        console.log({ targ: obj.target });
        let groupId: string | null | undefined;
        if (obj?.target?.group) {
          if (typeof obj.target.group === "string") {
            groupId = obj.target.group;
          }
        }
        if (obj?.target?.keyframe) {
          if (typeof obj.target.keyframe.group === "string") {
            groupId = obj.target.keyframe.group;
          }
        }
        if (groupId) {
          setSelectedGroupId(groupId);
        }
        logMessage(
          "mousedown:" +
            obj.val +
            ".  target:" +
            type +
            ". " +
            Math.floor(obj.pos.x) +
            "x" +
            Math.floor(obj.pos.y),
          2,
        );
      }
    });

    timeline.onDoubleClick(function (obj) {
      const type = obj.target ? obj.target.type : "";
      if (obj.pos) {
        logMessage(
          "doubleclick:" +
            obj.val +
            ".  target:" +
            type +
            ". " +
            Math.floor(obj.pos.x) +
            "x" +
            Math.floor(obj.pos.y),
          2,
        );
      }
    });

    // Synchronize component scroll renderer with HTML list of the nodes.
    timeline.onScroll(function (obj) {
      const options = timeline.getOptions();
      if (options) {
        if (outlineContainerRef.current) {
          outlineContainerRef.current.style.minHeight = obj.scrollHeight + "px";

          if (outlineScrollContainerRef.current) {
            outlineScrollContainerRef.current.scrollTop = obj.scrollTop;
          }
        }
      }
      // showActivePositionInformation();
    });

    timeline.onScrollFinished(function (_) {
      // Stop move component screen to the timeline when user start manually scrolling.
      logMessage("on scroll finished", 2);
    });
  }
};

export default useInitTimelineListeners;
