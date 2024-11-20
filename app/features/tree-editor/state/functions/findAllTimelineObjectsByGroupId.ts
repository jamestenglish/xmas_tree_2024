import {
  TimelineGroupExtra,
  TimelineKeyframeExtra,
  TimelineModelExtra,
} from "~/features/tree-timeline/functions/createRow";

export interface FindAllGroupIdsType {
  timelineModel: TimelineModelExtra;
}

export interface GroupMetaType {
  groups: Array<TimelineGroupExtra>;
  keyframes: TimelineKeyframeExtra[];
  rowId: string | undefined;
}

// TODO JTE use this for serialize/deserial
const findAllTimelineObjectsByGroupId = ({
  timelineModel,
}: FindAllGroupIdsType) => {
  const init: { [key: string]: GroupMetaType } = {};
  // console.group("findAllTimelineObjectsByGroupId");
  const allGroupsById = timelineModel?.rows?.reduce((acc, row) => {
    if (row?.keyframes) {
      row.keyframes.forEach((keyframe) => {
        const group = keyframe?.group;
        if (typeof group !== "string" && group?.id) {
          const id = group.id;

          const existingMeta = acc[id] ?? {};

          // console.log(
          //   "findAllTimelineObjectsByGroupId existingMeta:",
          //   existingMeta,
          // );
          const existingGroups = existingMeta.groups ?? [];
          const existingKeyframes = existingMeta.keyframes ?? [];

          existingGroups.push(group);
          existingKeyframes.push(keyframe);

          existingMeta.rowId = row?.id;
          existingMeta.groups = existingGroups;
          existingMeta.keyframes = existingKeyframes;

          acc[id] = existingMeta;
        }
      });
    }
    return acc;
  }, init);
  // console.groupEnd();
  return allGroupsById;
};

export default findAllTimelineObjectsByGroupId;
