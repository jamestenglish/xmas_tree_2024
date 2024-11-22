import {
  createSelectedGroup,
  createUnselectedGroup,
  TimelineGroupExtra,
  TimelineModelExtra,
  createUnexportedGroup,
} from "~/features/tree-timeline/functions/createRow";
import { produce } from "immer";
import { EditorState, GroupTypes } from "../useEditorStore";
import findAllTimelineObjectsByGroupId, {
  FindAllGroupIdsType,
} from "./findAllTimelineObjectsByGroupId";
import getIsExportedByGroupId from "./getIsExportedByGroupId";

const findAllGroupIds = ({ timelineModel }: FindAllGroupIdsType) => {
  const allGroupsById = findAllTimelineObjectsByGroupId({ timelineModel });
  const allGroupIds: string[] = Object.keys(allGroupsById);
  return allGroupIds;
};

interface ReplaceGroupWithIdType {
  timelineSelectedGroupId: string | null;
  timelineModel: TimelineModelExtra;
  newGroup: TimelineGroupExtra;
  state?: EditorState;
}

const replaceGroupWithId = ({
  timelineSelectedGroupId,
  timelineModel,
  newGroup,
}: ReplaceGroupWithIdType) => {
  timelineModel?.rows?.forEach((row) => {
    if (row?.keyframes) {
      row.keyframes.forEach((keyframe) => {
        if (typeof keyframe?.group !== "string" && keyframe?.group?.id) {
          const groupId = keyframe?.group?.id;
          if (groupId === timelineSelectedGroupId) {
            const selected = newGroup.selected;
            keyframe.selected = selected;
            keyframe.group = newGroup;
          }
        }
      });
    }
  });

  return timelineModel;
};

interface CopyAttributesArgs<T, V> {
  source: T;
  destination: V;
}

const copyAttributes = <T extends GroupTypes, V extends GroupTypes>({
  source,
  destination,
}: CopyAttributesArgs<T, V>) => {
  // Restrict keys to shared properties between T and V
  const keys = Object.keys(source) as (keyof T & keyof V)[];

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = source[key];

    // Use explicit type casting to ensure compatibility
    if (destination && key in destination && value !== undefined) {
      (destination[key] as unknown) = value as V[keyof T & keyof V];
    }
  }
};

const timestamp = -1;
//
export const defaultByGroup: GroupTypes = {
  color: "#D0021B",
  canvasLines: [],
  canvasImages: [],
  treeViewerSelectedLightIds: [],
  canvasExports: null,
  canvasLastEditTimestamp: timestamp,
  canvasLastExportTimestamp: timestamp,
  timelineKeyframeStart: 0,
  timelineKeyframeEnd: 1000,
};

const setAllGroupsToUnselected = ({
  timelineModel,
}: {
  timelineModel: TimelineModelExtra;
}) => {
  const allGroupsIds = findAllGroupIds({ timelineModel });

  let modelUpdates = timelineModel;
  allGroupsIds.forEach((groupId) => {
    const unselectedGroup = createUnselectedGroup(groupId);
    modelUpdates = replaceGroupWithId({
      timelineSelectedGroupId: groupId,
      timelineModel: modelUpdates,
      newGroup: unselectedGroup,
    });
  });

  return modelUpdates;
};

function setUnexportedGroups({
  state,
  timelineSelectedGroupId,
  timelineModel,
}: {
  state: EditorState;
  timelineSelectedGroupId: string | null;
  timelineModel: TimelineModelExtra;
}) {
  let modelUpdates = timelineModel;

  const isExportedByGroupId = getIsExportedByGroupId({
    attributesByGroup: state.attributesByGroup,
  });

  Object.keys(isExportedByGroupId).forEach((groupId) => {
    if (groupId === timelineSelectedGroupId) {
      return;
    }
    const isExported = isExportedByGroupId[groupId];
    if (!isExported) {
      const unexportedGroup = createUnexportedGroup(groupId);
      state.isTimelinePlayable = false;
      modelUpdates = replaceGroupWithId({
        timelineSelectedGroupId: groupId,
        timelineModel: modelUpdates,
        newGroup: unexportedGroup,
      });
    }
  });

  return modelUpdates;
}

export function setTimelineSelectedGroupIdRaw(
  state: EditorState,
  timelineSelectedGroupId: string | null,
) {
  const { timelineModel } = state;
  const prevGroupId = state.timelineSelectedGroupId;
  let modelUpdates = timelineModel;

  modelUpdates = setAllGroupsToUnselected({ timelineModel: modelUpdates });
  if (prevGroupId && state.attributesByGroup[prevGroupId]) {
    copyAttributes<EditorState, GroupTypes>({
      source: state,
      destination: state.attributesByGroup[prevGroupId],
    });
  } else {
    if (prevGroupId !== null) {
      state.attributesByGroup[prevGroupId] = defaultByGroup;
    }
  }
  if (timelineSelectedGroupId) {
    const selectedGroup = createSelectedGroup(timelineSelectedGroupId);
    modelUpdates = replaceGroupWithId({
      timelineSelectedGroupId: timelineSelectedGroupId,
      timelineModel: modelUpdates,
      newGroup: selectedGroup,
      state,
    });
    const existingAttributes = state.attributesByGroup[timelineSelectedGroupId];

    const valuesToUse = existingAttributes
      ? existingAttributes
      : defaultByGroup;

    copyAttributes<GroupTypes, EditorState>({
      source: valuesToUse,
      destination: state,
    });
    state.attributesByGroup[timelineSelectedGroupId] = valuesToUse;
  }

  modelUpdates = setUnexportedGroups({
    timelineModel: modelUpdates,
    state,
    timelineSelectedGroupId,
  });

  state.timelineModel = modelUpdates;
  state.timelineSelectedGroupId = timelineSelectedGroupId;
}

const createSetTimelineSelectedGroupId = (
  timelineSelectedGroupId: string | null,
) => {
  return produce((state: EditorState) => {
    setTimelineSelectedGroupIdRaw(state, timelineSelectedGroupId);
  });
};

export default createSetTimelineSelectedGroupId;
