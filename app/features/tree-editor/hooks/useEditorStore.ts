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
  TimelineKeyframeExtra,
  TimelineModelExtra,
  TimelineRowExtra,
} from "~/features/tree-timeline/functions/createRow";
import {
  Timeline,
  TimelineElementDragState,
  TimelineInteractionMode,
} from "animation-timeline-js";
import { produce } from "immer";

type IsBetweenArgs = {
  keyframeA: TimelineKeyframeExtra;
  keyframeB: TimelineKeyframeExtra;
  keyframeTest: TimelineKeyframeExtra;
};
const isBetween = ({ keyframeA, keyframeB, keyframeTest }: IsBetweenArgs) => {
  const { val: valA } = keyframeA;
  const { val: valB } = keyframeB;
  const { val: valTest } = keyframeTest;
  const result = valTest >= valA && valTest < valB;
  console.log({ result, valA, valB, valTest });
  return result;
};

const deconflictKeyframes = (keyframesIn: TimelineKeyframeExtra[]) => {
  if (keyframesIn.length <= 2) {
    console.log("AAA not enough to deconflict");
    return keyframesIn;
  }
  const initial: [TimelineKeyframeExtra, TimelineKeyframeExtra][] = [];
  const keyframeGroups = keyframesIn.reduce((acc, keyframe, index) => {
    if (index % 2 !== 0) {
      return acc;
    }
    acc.push([keyframe, keyframesIn[index + 1]]);
    return acc;
  }, initial);

  keyframeGroups.sort((a, b) => a[0].val - b[0].val);

  const keyframes = keyframeGroups.flat();

  console.log("deconflictKeyframes");
  keyframes.forEach((e) => {
    if (typeof e?.group !== "string") {
      console.log(e.val, e?.group?.id);
    }
  });
  const deconflictedIndicies = [0, 1];

  while (deconflictedIndicies.length < keyframes.length) {
    for (let i = 2; i < keyframes.length; i += 2) {
      if (deconflictedIndicies.includes(i)) {
        continue;
      }

      const keyframeTestC = keyframes[i];
      const keyframeTestD = keyframes[i + 1];
      const distance = Math.abs(keyframeTestC.val - keyframeTestD.val);
      let isDeconflicted = true;
      for (let j = 0; j < deconflictedIndicies.length; j += 2) {
        const indexA = deconflictedIndicies[j];
        const indexB = deconflictedIndicies[j + 1];
        const keyframeA = keyframes[indexA];
        const keyframeB = keyframes[indexB];
        const isCBetween = isBetween({
          keyframeA,
          keyframeB,
          keyframeTest: keyframeTestC,
        });
        const isDBetween = isBetween({
          keyframeA,
          keyframeB,
          keyframeTest: keyframeTestD,
        });
        console.log({ distance, isCBetween, isDBetween });
        if (isCBetween || isDBetween) {
          keyframeTestC.val = keyframeB.val;
          keyframeTestD.val = keyframeB.val + distance;
          isDeconflicted = false;
        }
      }
      if (isDeconflicted) {
        deconflictedIndicies.push(i, i + 1);
      }
    }
  }
  console.log("end");
  keyframes.forEach((e) => console.log(e.val));
};

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
  return produce(({ model, selectedGroupId: selectedGroupIdIn }) => {
    if (selectedGroupId !== selectedGroupIdIn) {
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
    }
  });
};

export type DragTypes = "started" | "continue" | "finished";
type DragCollectionType = {
  rowId: string;
  keyframeId: string;
  val: number;
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
  onDrag: (
    elements: TimelineElementDragState[] | null,
    dragType: DragTypes,
  ) => void;
  setSelectedLightId: (selectedLightId: number | null) => void;
  selectedLightId: number | null;
  toggleLightId: (selectedLightId: number | null) => void;
  selectedLightIds: number[];
}

const useEditorStore = create<EditorState>()(
  devtools(
    // persist(
    (set) => ({
      selectedGroupId: null,
      selectedLightId: null,
      selectedLightIds: [],
      setSelectedGroupId: (selectedGroupId) =>
        set(createSetSelectedGroupId(selectedGroupId)),
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
                const groupId = newGroup.id;

                prevRow?.keyframes?.push(
                  { id: `A_${groupId}`, val: currentTime, group: newGroup },
                  {
                    id: `B_${groupId}`,
                    val: currentTime + 1000,
                    group: newGroup,
                  },
                );

                if (prevRow?.keyframes) {
                  console.log("AAA can deconflict");
                  // prevRow.keyframes = deconflictKeyframes(prevRow.keyframes);

                  deconflictKeyframes(prevRow.keyframes);
                }
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
      onDrag: (elements, dragType) =>
        set(
          produce((state: EditorState) => {
            if (elements !== null) {
              const { model } = state;

              if (state.model) {
                const dragCollections: Array<DragCollectionType | null> =
                  elements.map((element) => {
                    if (!(element?.keyframe && element?.row)) {
                      return null;
                    }
                    const newKeyframe =
                      element?.keyframe as TimelineKeyframeExtra;
                    const newRow = element?.row as TimelineRowExtra;
                    if (!(newKeyframe.id && newRow.id)) {
                      return null;
                    }
                    const result: DragCollectionType = {
                      keyframeId: newKeyframe.id,
                      rowId: newRow.id,
                      val: newKeyframe.val,
                    };
                    return result;
                  });

                dragCollections.forEach((dragCollection) => {
                  if (dragCollection !== null) {
                    model?.rows?.forEach((row) => {
                      if (row?.id !== dragCollection?.rowId) {
                        return;
                      }
                      row?.keyframes?.forEach((keyframe) => {
                        if (keyframe?.id !== dragCollection?.keyframeId) {
                          return;
                        }
                        keyframe.val = dragCollection.val;
                      });
                    });
                  }
                });

                state?.model?.rows?.forEach((row) => {
                  if (row?.keyframes && dragType === "finished") {
                    // row.keyframes = deconflictKeyframes(row.keyframes);
                    console.log("dragType", dragType);
                    deconflictKeyframes(row.keyframes);
                  }
                });
              }
            }
          }),
        ),
      setSelectedLightId: (selectedLightId) =>
        set({ selectedLightId: selectedLightId }),

      toggleLightId: (selectedLightId: number | null) =>
        set(
          produce((state: EditorState) => {
            if (selectedLightId !== null) {
              const { selectedLightIds } = state;
              if (selectedLightIds.includes(selectedLightId)) {
                state.selectedLightIds = selectedLightIds.filter(
                  (id) => id !== selectedLightId,
                );
              } else {
                state.selectedLightIds.push(selectedLightId);
              }
            }
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
