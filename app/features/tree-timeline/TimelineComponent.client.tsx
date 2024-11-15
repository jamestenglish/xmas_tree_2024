import React, {
  useCallback,
  useEffect,
  // useMemo,
  useRef,
  // useState,
  // useReducer,
} from "react";
import {
  Timeline,
  // TimelineInteractionMode
} from "animation-timeline-js";
import useInitTimelineListeners from "./hooks/useInitTimelineListeners";
import useInitTimeline from "./hooks/useInitTimeline";
import TimelineButtons from "./TimelineButtons";
// import createRow, {
//   createSelectedGroup,
//   createUnselectedGroup,
//   TimelineGroupExtra,
//   TimelineModelExtra,
// } from "./functions/createRow";
import {
  // produce,
  setAutoFreeze,
} from "immer";
import "./assets/demo.css";
import Outline from "./Outline";
import useEditorStore from "../tree-editor/hooks/useEditorStore";

setAutoFreeze(false);

// const initialRowA = createRow();
// const initialRowB = createRow();

// const initialModel: TimelineModelExtra = {
//   rows: [initialRowA, initialRowB],
// };

// type FindAllGroupIdsType = {
//   model: TimelineModelExtra;
// };
// const findAllGroupIds = ({ model }: FindAllGroupIdsType) => {
//   const allGroupIds: string[] = [];
//   model.rows.forEach((row) => {
//     if (row?.keyframes) {
//       row.keyframes.forEach((keyframe) => {
//         if (typeof keyframe?.group !== "string" && keyframe?.group?.id) {
//           allGroupIds.push(keyframe?.group?.id);
//         }
//       });
//     }
//   });
//   return allGroupIds;
// };

// type ReplaceGroupWithIdType = {
//   selectedGroupId: string | null;
//   model: TimelineModelExtra;
//   newGroup: TimelineGroupExtra;
// };

// const replaceGroupWithId = ({
//   selectedGroupId,
//   model,
//   newGroup,
// }: ReplaceGroupWithIdType) => {
//   const newModel = produce(model, (draft) => {
//     draft.rows.forEach((row) => {
//       if (row?.keyframes) {
//         row.keyframes.forEach((keyframe) => {
//           if (typeof keyframe?.group !== "string" && keyframe?.group?.id) {
//             const groupId = keyframe?.group?.id;
//             if (groupId === selectedGroupId) {
//               const selected = newGroup.selected;
//               keyframe.selected = selected;
//               keyframe.group = newGroup;
//             }
//           }
//         });
//       }
//     });
//   });

//   return newModel;
// };

// type UseSelectedGroupIdType = {
//   selectedGroupId: string | null;
//   model: TimelineModelExtra;
// };

// const useSelectedGroupId = ({
//   selectedGroupId,
//   model,
// }: UseSelectedGroupIdType) => {
//   const newModel = useMemo(() => {
//     console.log({ selectedGroupId });
//     const allGroupsIds = findAllGroupIds({ model });
//     let modelUpdates = model;

//     allGroupsIds.forEach((groupId) => {
//       const unselectedGroup = createUnselectedGroup(groupId);
//       modelUpdates = replaceGroupWithId({
//         selectedGroupId: groupId,
//         model: modelUpdates,
//         newGroup: unselectedGroup,
//       });
//     });

//     if (selectedGroupId) {
//       const selectedGroup = createSelectedGroup(selectedGroupId);

//       modelUpdates = replaceGroupWithId({
//         selectedGroupId: selectedGroupId,
//         model: modelUpdates,
//         newGroup: selectedGroup,
//       });
//     }
//     return modelUpdates;
//   }, [model, selectedGroupId]);

//   return newModel;
// };

// type Action =
//   | { type: "groupSelected"; selectedGroupId: string | null }
//   | { type: "updateModel"; newModel: TimelineModelExtra }
//   | { type: "failure"; error: string };

// function reducer(state: StateType, action: Action) {
//   return state;
//   // ...
// }

// type StateType = {
//   selectedGroupId: string | null;
//   oldModel: TimelineModelExtra;
//   interactionMode: TimelineInteractionMode;
// };

// const intitialState: StateType = {
//   selectedGroupId: null,
//   oldModel: initialModel,
//   interactionMode: TimelineInteractionMode.Pan,
// };

function useSyncModel(timeline: Timeline | undefined) {
  const model = useEditorStore((state) => state.model);
  useEffect(() => {
    console.log("setting model", { model });
    timeline?.setModel(model);
    // timeline?.setTime(0);
  }, [model, timeline]);
}

function TimelineComponent() {
  const timelineElRef = useRef<HTMLDivElement>(null);
  const outlineContainerRef = useRef<HTMLDivElement>(null);
  const outlineScrollContainerRef = useRef<HTMLDivElement>(null);

  // const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  // const [oldModel, setModel] = useState<TimelineModelExtra>(initialModel);

  // const model = useSelectedGroupId({
  //   selectedGroupId,
  //   model: oldModel,
  // });

  // const [interactionMode, setInteractionMode] =
  //   useState<TimelineInteractionMode>(TimelineInteractionMode.Pan);

  const { timeline } = useInitTimeline({ timelineElRef });

  useInitTimelineListeners({
    timeline,
    outlineContainerRef,
    outlineScrollContainerRef,
    // setSelectedGroupId,
  });

  // Example to subscribe and pass model or time update:
  // useEffect(() => {
  //   console.log("setting model", { model });
  //   timeline?.setModel(model);
  //   // timeline?.setTime(0);
  // }, [model, timeline]);

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
          <TimelineButtons
            // interactionMode={interactionMode}
            // setInteractionMode={setInteractionMode}
            timeline={timeline}
            // model={model}
            timelineElRef={timelineElRef}
            // setModel={setModel}
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
                <Outline
                  // rows={model.rows}
                  timeline={timeline}
                  // setModel={setModel}
                />
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
