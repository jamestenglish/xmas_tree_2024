import { create } from "zustand";
import {
  devtools,
  // persist
} from "zustand/middleware";
import type {} from "@redux-devtools/extension"; // required for devtools typing
import createRow, {
  createSelectedGroup,
  createUnselectedGroup,
  TimelineGroupExtra,
  TimelineModelExtra,
} from "~/features/tree-timeline/functions/createRow";
import { Timeline, TimelineInteractionMode } from "animation-timeline-js";
import { produce } from "immer";

const initialRowA = createRow();
const initialRowB = createRow();

const initialModel: TimelineModelExtra = {
  rows: [initialRowA, initialRowB],
};
type ReplaceGroupWithIdType = {
  selectedGroupId: string | null;
  model: TimelineModelExtra;
  newGroup: TimelineGroupExtra;
};

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

type SetSelectedGroupIdType = (selectedGroupId: string | null) => void;

const createSetSelectedGroupId = (selectedGroupId: string | null) => {
  return produce(({ model }) => {
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
    //    return { model: modelUpdates };
  });
};

interface EditorState {
  selectedGroupId: string | null;
  setSelectedGroupId: SetSelectedGroupIdType;
  model: TimelineModelExtra;
  setModel: (newMode: TimelineModelExtra) => void;
  interactionMode: TimelineInteractionMode;
  setInteractionMode: (interactionMode: TimelineInteractionMode) => void;
  addRow: (timeline: Timeline) => void;
  addGroupToRow: (timeline: Timeline, rowId: string) => void;
  deleteRow: (indexToDelete: number) => void;
}

const useEditorStore = create<EditorState>()(
  devtools(
    // persist(
    (set) => ({
      selectedGroupId: null,
      // setSelectedGroupId: (selectedGroupId) =>
      //   set(createSetSelectedGroupId(selectedGroupId)),
      setSelectedGroupId: (selectedGroupId) =>
        set(
          createSetSelectedGroupId(selectedGroupId),
          // produce(({ model }) => {
          //   const allGroupsIds = findAllGroupIds({ model });
          //   let modelUpdates = model;

          //   allGroupsIds.forEach((groupId) => {
          //     const unselectedGroup = createUnselectedGroup(groupId);
          //     modelUpdates = replaceGroupWithId({
          //       selectedGroupId: groupId,
          //       model: modelUpdates,
          //       newGroup: unselectedGroup,
          //     });
          //   });

          //   if (selectedGroupId) {
          //     const selectedGroup = createSelectedGroup(selectedGroupId);

          //     modelUpdates = replaceGroupWithId({
          //       selectedGroupId: selectedGroupId,
          //       model: modelUpdates,
          //       newGroup: selectedGroup,
          //     });
          //   }
          //   // return { model: modelUpdates };
          // }),
        ),
      model: initialModel,
      setModel: (model) => set({ model }),
      interactionMode: TimelineInteractionMode.Pan,
      setInteractionMode: (interactionMode) => set({ interactionMode }),
      addRow: (timeline: Timeline) =>
        set(
          produce((state: EditorState) => {
            const newRow = createRow({ start: timeline.getTime() });
            const rows = state.model?.rows;
            if (rows) {
              state.model.rows = [newRow, ...rows];
            }
          }),
        ),
      addGroupToRow: (timeline: Timeline, rowId: string) =>
        set(
          produce((state: EditorState) => {
            const rows = state.model.rows;
            rows.forEach((prevRow) => {
              if (prevRow?.id === rowId) {
                const newGroup = createUnselectedGroup();
                const currentTime = timeline.getTime();
                prevRow?.keyframes?.push(
                  { val: currentTime, group: newGroup },
                  { val: currentTime + 1000, group: newGroup },
                );
              }
            });
          }),
        ),
      deleteRow: (indexToDelete: number) =>
        set(
          produce((state: EditorState) => {
            state.model.rows.splice(indexToDelete, 1);
          }),
        ),
    }),
    // ),
    //   {
    //     name: "editor-storage",
    //   },
  ),
);

export default useEditorStore;
