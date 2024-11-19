import { TimelineModelExtra } from "~/features/tree-timeline/functions/createRow";
import { produce } from "immer";
import { EditorState } from "../useEditorStore";
import findAllTimelineObjectsByGroupId, {
  GroupMetaType,
} from "./findAllTimelineObjectsByGroupId";

type DeleteGroupObjectsArgs = {
  groupObjects: GroupMetaType;
  timelineModel: TimelineModelExtra;
};
const deleteGroupObjects = ({
  groupObjects,
  timelineModel,
}: DeleteGroupObjectsArgs) => {
  const row = timelineModel?.rows?.find(
    (row) => row?.id === groupObjects.rowId,
  );
  if (row) {
    const { keyframes = [] } = row;
    const keyframeIds =
      groupObjects?.keyframes?.map((keyframe) => keyframe.id) ?? [];
    const newKeyframes = keyframes?.filter(
      (keyframe) => !keyframeIds.includes(keyframe.id),
    );
    row.keyframes = newKeyframes;
  }
};

const createDeleteSeletedTimelineGroup = () => {
  return produce((state: EditorState) => {
    const { timelineModel } = state;
    const timelineSelectedGroupId = state.timelineSelectedGroupId;

    console.log(
      "createDeleteSeletedTimelineGroup timelineSelectedGroupId: ",
      timelineSelectedGroupId,
    );
    if (timelineSelectedGroupId) {
      const allTimelineObjectsByGroupId = findAllTimelineObjectsByGroupId({
        timelineModel,
      });

      console.log(
        "createDeleteSeletedTimelineGroup allTimelineObjectsByGroupId: ",
        allTimelineObjectsByGroupId,
      );

      // don't delete last group
      const groupCount = Object.keys(allTimelineObjectsByGroupId).length;
      console.log("createDeleteSeletedTimelineGroup groupCount: ", groupCount);

      if (groupCount > 1) {
        const groupObjects =
          allTimelineObjectsByGroupId[timelineSelectedGroupId];

        deleteGroupObjects({ groupObjects, timelineModel });
        state.timelineSelectedGroupId = null;
      }
    }
  });
};

export default createDeleteSeletedTimelineGroup;
