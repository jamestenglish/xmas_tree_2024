import { Timeline } from "animation-timeline-js";
import { TimelineGroupExtra } from "../functions/createRow";
import useEditorStore from "~/features/tree-editor/hooks/useEditorStore";
import { useShallow } from "zustand/react/shallow";
import { useEffect } from "react";

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
};

const useInitTimelineListeners = ({
  timeline,
  outlineContainerRef,
  outlineScrollContainerRef,
}: UseInitTimelineListenersType) => {
  const { setSelectedGroupId, onDrag } = useEditorStore(
    useShallow((state) => ({
      setSelectedGroupId: state.setSelectedGroupId,
      onDrag: state.onDrag,
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
          onDrag(obj.elements, "continue");
        }
        // logDraggingMessage(obj, "drag");
      });

      // timeline.onKeyframeChanged(function (obj) {
      //   console.log("keyframe: " + obj.val);
      // });

      timeline.onDragFinished(function (obj) {
        if (obj.elements) {
          onDrag(obj.elements, "finished");
        }
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
          let groupId: string | null = null;
          let from = "";
          if (obj?.target?.group) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const unknownGroup = obj?.target?.group as any;
            if (unknownGroup?.id) {
              const groupExtra = unknownGroup as TimelineGroupExtra;
              groupId = groupExtra.id ?? null;
              from = "group";
            }
          }
          if (obj?.target?.keyframe) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const unknownGroup = obj.target.keyframe.group as any;
            if (unknownGroup?.id) {
              const groupExtra = unknownGroup as TimelineGroupExtra;
              groupId = groupExtra.id ?? null;
              from = "keyframe";
            }
          }
          if (groupId) {
            console.log("groupId", groupId, from);
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
            outlineContainerRef.current.style.minHeight =
              obj.scrollHeight + "px";

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
  }, [
    onDrag,
    outlineContainerRef,
    outlineScrollContainerRef,
    setSelectedGroupId,
    timeline,
  ]);
};

export default useInitTimelineListeners;
