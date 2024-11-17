import { produce } from "immer";
import {
  TimelineKeyframeExtra,
  TimelineRowExtra,
} from "~/features/tree-timeline/functions/createRow";
import { TimelineElementDragState } from "animation-timeline-js";
import deconflictKeyframes from "./deconflictKeyframes";
import { DragTypes, EditorState } from "../useEditorStore";

type DragCollectionType = {
  rowId: string;
  keyframeId: string;
  val: number;
};
export default function createOnDrag(
  elements: TimelineElementDragState[] | null,
  dragType: DragTypes,
) {
  return produce((state: EditorState) => {
    if (elements !== null) {
      const { model } = state;

      if (state.model) {
        const dragCollections: Array<DragCollectionType | null> = elements.map(
          (element) => {
            if (!(element?.keyframe && element?.row)) {
              return null;
            }
            const newKeyframe = element?.keyframe as TimelineKeyframeExtra;
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
          },
        );

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
            console.log("dragType", dragType);
            deconflictKeyframes(row.keyframes);
          }
        });
      }
    }
  });
}
