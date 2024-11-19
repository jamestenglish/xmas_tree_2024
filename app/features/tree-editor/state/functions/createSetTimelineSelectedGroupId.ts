import {
  createSelectedGroup,
  createUnselectedGroup,
  TimelineGroupExtra,
  TimelineModelExtra,
} from "~/features/tree-timeline/functions/createRow";
import { produce } from "immer";
import { TimelineState, GroupTypes } from "../useEditorStore";
import findAllTimelineObjectsByGroupId, {
  FindAllGroupIdsType,
} from "./findAllTimelineObjectsByGroupId";

const findAllGroupIds = ({ timelineModel }: FindAllGroupIdsType) => {
  const allGroupsById = findAllTimelineObjectsByGroupId({ timelineModel });
  const allGroupIds: string[] = Object.keys(allGroupsById);
  return allGroupIds;
};

type ReplaceGroupWithIdType = {
  timelineSelectedGroupId: string | null;
  timelineModel: TimelineModelExtra;
  newGroup: TimelineGroupExtra;
  state?: TimelineState;
};

// TODO JTE reduce state interface scope like this ^^^

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

export const defaultByGroup: GroupTypes = {
  color: "#D0021B",
  canvasLines: [],
  canvasImages: [],
  treeViewerSelectedLightIds: [],
  canvasCylinderImgUrl:
    "https://images.chesscomfiles.com/uploads/v1/images_users/tiny_mce/petrikeckman/phpE4U0RQ.png",
};

// TODO JTE there is a bug when created a new group
const createSetTimelineSelectedGroupId = (
  timelineSelectedGroupId: string | null,
) => {
  return produce((state: TimelineState) => {
    const { timelineModel } = state;
    const prevGroupId = state.timelineSelectedGroupId;
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
    // console.log(
    //   `createSetTimelineSelectedGroupId prev: ${prevGroupId} | cur: ${timelineSelectedGroupId}`,
    // );
    if (timelineSelectedGroupId) {
      // console.log(
      //   "createSetTimelineSelectedGroupId has timelineSelectedGroupId",
      // );
      const selectedGroup = createSelectedGroup(timelineSelectedGroupId);
      modelUpdates = replaceGroupWithId({
        timelineSelectedGroupId: timelineSelectedGroupId,
        timelineModel: modelUpdates,
        newGroup: selectedGroup,
        state,
      });
      state.timelineSelectedGroupId = timelineSelectedGroupId;
      if (prevGroupId && state.attributesByGroup[prevGroupId]) {
        // console.log(`createSetTimelineSelectedGroupId has prevId`);
        copyAttributes<TimelineState, GroupTypes>({
          source: state,
          destination: state.attributesByGroup[prevGroupId],
        });
        // state.attributesByGroup[prevGroupId] = {
        //   color: state.color,
        //   canvasLines: state.canvasLines,
        //   canvasImages: state.canvasImages,
        //   treeViewerSelectedLightIds: state.treeViewerSelectedLightIds,
        // };
      } else {
        if (prevGroupId !== null) {
          state.attributesByGroup[prevGroupId] = defaultByGroup;
        }
      }
      console.log(
        `createSetTimelineSelectedGroupId`,
        state.attributesByGroup[timelineSelectedGroupId],
      );
      const valuesToUse = state.attributesByGroup[timelineSelectedGroupId]
        ? state.attributesByGroup[timelineSelectedGroupId]
        : defaultByGroup;
      copyAttributes<GroupTypes, TimelineState>({
        source: valuesToUse,
        destination: state,
      });

      // const keys = Object.keys(valuesToUse);
      // for (let i = 0; i < keys.length; i++) {
      //   const key = keys[i] as keyof GroupTypes & keyof EditorState;
      //   if (key) {
      //     const value = valuesToUse[key];
      //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
      //     const tempState = state as any;
      //     tempState[key] = value;
      //   }
      // }
    }
    state.timelineSelectedGroupId = timelineSelectedGroupId;
  });
};

export default createSetTimelineSelectedGroupId;
