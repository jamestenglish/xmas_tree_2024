import { produce } from "immer";
import {
  TimelineKeyframeExtra,
  TimelineRowExtra,
} from "~/features/tree-timeline/functions/createRow";
import { TimelineElementDragState } from "animation-timeline-js";
import deconflictKeyframes from "./deconflictKeyframes";
import { DragTypes, EditorState } from "../useEditorStore";
import updateTimelineKeyframes from "./updateTimelineKeyframes";

interface DragCollectionType {
  rowId: string;
  keyframeId: string;
  val: number;
}

export default function createOnDrag(
  elements: TimelineElementDragState[] | null,
  dragType: DragTypes,
) {
  return produce((state: EditorState) => {
    if (elements !== null) {
      const { timelineModel } = state;

      if (state.timelineModel) {
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
            timelineModel?.rows?.forEach((row) => {
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

        if (dragType === "finished") {
          state?.timelineModel?.rows?.forEach((row) => {
            if (row?.keyframes) {
              deconflictKeyframes(row.keyframes);
            }
          });

          updateTimelineKeyframes({ state });

          state.isTimelinePlayable = false;
        }
      }
    }
  });
}
