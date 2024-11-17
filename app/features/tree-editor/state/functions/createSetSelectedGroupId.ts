import {
  createSelectedGroup,
  createUnselectedGroup,
  TimelineGroupExtra,
  TimelineModelExtra,
} from "~/features/tree-timeline/functions/createRow";
import { produce } from "immer";
import { EditorState, GroupTypes } from "../useEditorStore";

type FindAllGroupIdsType = {
  model: TimelineModelExtra;
};

const findAllGroupIds = ({ model }: FindAllGroupIdsType) => {
  const allGroupIds: string[] = [];
  model?.rows?.forEach((row) => {
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
  state?: EditorState;
};

const replaceGroupWithId = ({
  selectedGroupId,
  model,
  newGroup,
}: ReplaceGroupWithIdType) => {
  model?.rows?.forEach((row) => {
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

  return model;
};

export const defaultByGroup: GroupTypes = {
  color: "#D0021B",
  canvasLines: [],
  canvasImages: [],
  selectedLightIds: [],
};

const createSetSelectedGroupId = (selectedGroupId: string | null) => {
  return produce((state: EditorState) => {
    const { model } = state;
    const prevGroupId = state.selectedGroupId;

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

    console.log(
      `createSetSelectedGroupId prev: ${prevGroupId} | cur: ${selectedGroupId}`,
    );

    if (selectedGroupId) {
      console.log("createSetSelectedGroupId has selectedGroupId");
      const selectedGroup = createSelectedGroup(selectedGroupId);

      modelUpdates = replaceGroupWithId({
        selectedGroupId: selectedGroupId,
        model: modelUpdates,
        newGroup: selectedGroup,
        state,
      });

      state.selectedGroupId = selectedGroupId;
      if (prevGroupId) {
        console.log(`createSetSelectedGroupId has prevId`);

        state.attributesByGroup[prevGroupId] = {
          color: state.color,
          canvasLines: state.canvasLines,
          canvasImages: state.canvasImages,
          selectedLightIds: state.selectedLightIds,
        };
      } else {
        state.attributesByGroup[prevGroupId] = defaultByGroup;
      }

      console.log(
        `createSetSelectedGroupId`,
        state.attributesByGroup[selectedGroupId],
      );

      const valuesToUse = state.attributesByGroup[selectedGroupId]
        ? state.attributesByGroup[selectedGroupId]
        : defaultByGroup;

      const keys = Object.keys(valuesToUse);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i] as keyof GroupTypes & keyof EditorState;
        if (key) {
          const value = valuesToUse[key];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const tempState = state as any;
          tempState[key] = value;
        }
      }
    }
  });
};

export default createSetSelectedGroupId;
