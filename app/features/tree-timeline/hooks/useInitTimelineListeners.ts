import { Timeline } from "animation-timeline-js";
import { TimelineGroupExtra } from "../functions/createRow";
import useEditorStore from "~/features/tree-editor/state/useEditorStore";
import { useShallow } from "zustand/react/shallow";
import { useEffect } from "react";

const logMessage = (..._args: Array<unknown>) => {
  // console.log("TIMELINE LOG", ...args);
};

const logDraggingMessage = (..._args: Array<unknown>) => {
  // console.log("TIMELINE DRAG", ...args);
};

interface UseInitTimelineListenersType {
  timeline: Timeline | undefined;
  outlineContainerRef: React.RefObject<HTMLDivElement>;
  outlineScrollContainerRef: React.RefObject<HTMLDivElement>;
}

const useInitTimelineListeners = ({
  timeline,
  outlineContainerRef,
  outlineScrollContainerRef,
}: UseInitTimelineListenersType) => {
  const { setTimelineSelectedGroupId, onDragTimeline } = useEditorStore(
    useShallow((state) => ({
      setTimelineSelectedGroupId: state.setTimelineSelectedGroupId,
      onDragTimeline: state.onDragTimeline,
    })),
  );

  useEffect(() => {
    if (timeline) {
      console.log("-------USE EFFECT CALLED");
      timeline.offAll();
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
        if (obj.elements) {
          onDragTimeline(obj.elements, "continue");
        }
      });

      timeline.onDragFinished(function (obj) {
        if (obj.elements) {
          onDragTimeline(obj.elements, "finished");
        }
        logDraggingMessage(obj, "dragfinished");
      });

      timeline.onMouseDown(function (obj) {
        const type = obj.target ? obj.target.type : "";
        if (obj.pos) {
          console.log({ targ: obj.target });
          let groupId: string | null = null;
          if (obj?.target?.group) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const unknownGroup = obj?.target?.group as any;
            if (unknownGroup?.id) {
              const groupExtra = unknownGroup as TimelineGroupExtra;
              groupId = groupExtra.id ?? null;
            }
          }
          if (obj?.target?.keyframe) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const unknownGroup = obj.target.keyframe.group as any;
            if (unknownGroup?.id) {
              const groupExtra = unknownGroup as TimelineGroupExtra;
              groupId = groupExtra.id ?? null;
            }
          }
          if (groupId) {
            setTimelineSelectedGroupId(groupId);
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
            outlineContainerRef.current.style.minHeight =
              obj.scrollHeight + "px";

            if (outlineScrollContainerRef.current) {
              outlineScrollContainerRef.current.scrollTop = obj.scrollTop;
            }
          }
        }
      });

      timeline.onScrollFinished(function (_) {
        // Stop move component screen to the timeline when user start manually scrolling.
        logMessage("on scroll finished", 2);
      });
    }
  }, [
    onDragTimeline,
    outlineContainerRef,
    outlineScrollContainerRef,
    setTimelineSelectedGroupId,
    timeline,
  ]);
};

export default useInitTimelineListeners;
