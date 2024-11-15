import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Timeline, TimelineInteractionMode } from "animation-timeline-js";
import useInitTimelineListeners from "./hooks/useInitTimelineListeners";
import useInitTimeline from "./hooks/useInitTimeline";
import TimelineButtons from "./TimelineButtons";
import createRow, {
  createSelectedGroup,
  createUnselectedGroup,
  TimelineGroupExtra,
  TimelineRowExtra,
} from "./functions/createRow";
import { produce, setAutoFreeze } from "immer";
import "./assets/demo.css";

setAutoFreeze(false);

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

      const next = produce(prev, (draft) => {
        draft.rows.forEach((prevRow) => {
          if (prevRow?.id === row?.id) {
            const newGroup = createUnselectedGroup();
            const currentTime = timeline.getTime();
            prevRow?.keyframes?.push(
              { val: currentTime, group: newGroup },
              { val: currentTime + 1000, group: newGroup },
            );
          }
        });
      });

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

type FindAllGroupIdsType = {
  model: TimelineModelExtra;
};
const findAllGroupIds = ({ model }: FindAllGroupIdsType) => {
  const allGroupIds: string[] = [];
  model.rows.forEach((row) => {
    if (row?.keyframes) {
      row.keyframes.forEach((keyframe) => {
        if (typeof keyframe?.group !== "string" && keyframe?.group?.id) {
          allGroupIds.push(keyframe?.group?.id);
        }
      });
    }
  });
  return allGroupIds;
};

type ReplaceGroupWithIdType = {
  selectedGroupId: string | null;
  model: TimelineModelExtra;
  newGroup: TimelineGroupExtra;
};

const replaceGroupWithId = ({
  selectedGroupId,
  model,
  newGroup,
}: ReplaceGroupWithIdType) => {
  const newModel = produce(model, (draft) => {
    draft.rows.forEach((row) => {
      if (row?.keyframes) {
        row.keyframes.forEach((keyframe) => {
          if (typeof keyframe?.group !== "string" && keyframe?.group?.id) {
            const groupId = keyframe?.group?.id;
            if (groupId === selectedGroupId) {
              const selected = newGroup.selected;
              keyframe.selected = selected;
              keyframe.group = newGroup;
            }
          }
        });
      }
    });
  });

  return newModel;
};

type UseSelectedGroupIdType = {
  selectedGroupId: string | null;
  model: TimelineModelExtra;
};

const useSelectedGroupId = ({
  selectedGroupId,
  model,
}: UseSelectedGroupIdType) => {
  const newModel = useMemo(() => {
    console.log({ selectedGroupId });
    const allGroupsIds = findAllGroupIds({ model });
    let modelUpdates = model;

    allGroupsIds.forEach((groupId) => {
      const unselectedGroup = createUnselectedGroup(groupId);
      modelUpdates = replaceGroupWithId({
        selectedGroupId: groupId,
        model: modelUpdates,
        newGroup: unselectedGroup,
      });
    });

    if (selectedGroupId) {
      const selectedGroup = createSelectedGroup(selectedGroupId);

      modelUpdates = replaceGroupWithId({
        selectedGroupId: selectedGroupId,
        model: modelUpdates,
        newGroup: selectedGroup,
      });
    }
    return modelUpdates;
  }, [model, selectedGroupId]);

  return newModel;
};

function TimelineComponent() {
  const timelineElRef = useRef<HTMLDivElement>(null);
  const outlineContainerRef = useRef<HTMLDivElement>(null);
  const outlineScrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  const [oldModel, setModel] = useState<TimelineModelExtra>(initialModel);

  const model = useSelectedGroupId({
    selectedGroupId,
    model: oldModel,
  });

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
    console.log("setting model", { model });
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
