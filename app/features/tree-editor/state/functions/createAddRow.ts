import { produce } from "immer";
import createRow from "~/features/tree-timeline/functions/createRow";
import { Timeline } from "animation-timeline-js";
import { EditorState } from "../useEditorStore";

export default function createAddRow(timeline: Timeline) {
  return produce((state: EditorState) => {
    const newRow = createRow({ start: timeline.getTime() });
    const rows = state.model?.rows;
    if (rows) {
      state.model.rows = [newRow, ...rows];
    }
  });
}
