import { EditorState } from "../useEditorStore";
import findAllTimelineObjectsByGroupId from "./findAllTimelineObjectsByGroupId";

const updateTimelineKeyframes = ({
  state,
  // timelineModel,
}: {
  // timelineModel: TimelineModelExtra;
  state: EditorState;
}) => {
  // ---
  const { timelineModel } = state;
  const allTimelineObjectsByGroupId = findAllTimelineObjectsByGroupId({
    timelineModel,
  });

  const groupIds = Object.keys(allTimelineObjectsByGroupId);

  let currentTimelineKeyframeEnd = 0;
  let currentTimelineKeyframeStart = 0;
  groupIds.forEach((groupId) => {
    const timelineObjects = allTimelineObjectsByGroupId[groupId];
    const start = Math.min(
      timelineObjects.keyframes[0].val,
      timelineObjects.keyframes[1].val,
    );
    const end = Math.max(
      timelineObjects.keyframes[0].val,
      timelineObjects.keyframes[1].val,
    );

    const attributes = state.attributesByGroup[groupId];

    if (
      attributes.timelineKeyframeEnd !== end ||
      attributes.timelineKeyframeStart !== start
    ) {
      console.log("updateTimelineKeyframes");
      attributes.canvasLastEditTimestamp = new Date().getTime();
    }

    attributes.timelineKeyframeEnd = end;
    attributes.timelineKeyframeStart = start;

    if (groupId === state.timelineSelectedGroupId) {
      currentTimelineKeyframeEnd = end;
      currentTimelineKeyframeStart = start;
    }
  });

  if (state.timelineSelectedGroupId) {
    if (
      state.timelineKeyframeEnd !== currentTimelineKeyframeEnd ||
      state.timelineKeyframeStart !== currentTimelineKeyframeStart
    ) {
      state.canvasLastEditTimestamp = new Date().getTime();
    }
    state.timelineKeyframeEnd = currentTimelineKeyframeEnd;
    state.timelineKeyframeStart = currentTimelineKeyframeStart;
  }
};

export default updateTimelineKeyframes;
