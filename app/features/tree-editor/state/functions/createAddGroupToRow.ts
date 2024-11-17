import { produce } from "immer";
import { Timeline } from "animation-timeline-js";
import { createUnselectedGroup } from "~/features/tree-timeline/functions/createRow";
import deconflictKeyframes from "./deconflictKeyframes";
import { EditorState } from "../useEditorStore";

export default function createAddGroupToRow(timeline: Timeline, rowId: string) {
  return produce((state: EditorState) => {
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

          deconflictKeyframes(prevRow.keyframes);
        }
      }
    });
  });
}
