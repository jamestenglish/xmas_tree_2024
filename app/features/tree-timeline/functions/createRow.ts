import {
  TimelineKeyframe,
  TimelineRanged,
  TimelineRow,
  TimelineSelectable,
} from "animation-timeline-js";
import { TimelineGroup } from "animation-timeline-js/lib/models/timelineGroup";
import { v7 } from "uuid";

export interface TimelineModelExtra {
  rows: TimelineRowExtra[];
}

export interface TimelineRowExtra extends TimelineRow, TimelineRanged {
  keyframes?: TimelineKeyframeExtra[] | null;
  id?: string;
}
export interface TimelineKeyframeExtra
  extends TimelineKeyframe,
    TimelineSelectable,
    TimelineRanged {
  group?: TimelineGroupExtra | string;
  id?: string;
}

export interface TimelineGroupExtra extends TimelineGroup {
  id?: string;
  selected?: boolean;
}

function createGroup(
  fillColor: string,
  selected: boolean,
  existingGroupId?: string,
) {
  const groupId = existingGroupId ?? `group_${v7()}`;

  const group: TimelineGroupExtra = {
    id: groupId,
    style: {
      fillColor,
    },
    selected,
  };

  return group;
}

export function createUnselectedGroup(existingGroupId?: string) {
  return createGroup("rgba(0,0,170,0.3)", false, existingGroupId);
}

export function createSelectedGroup(existingGroupId?: string) {
  return createGroup("rgba(0,170,0,0.3)", true, existingGroupId);
}

export function createUnexportedGroup(existingGroupId?: string) {
  return createGroup("rgba(170,0,0.3)", false, existingGroupId);
}

interface CreateRowArgs {
  start?: number;
  end?: number;
  isSelected?: boolean;
}

const createRow = ({
  start = 0,
  end = undefined,
  isSelected = false,
}: CreateRowArgs = {}) => {
  const group = isSelected ? createSelectedGroup() : createUnselectedGroup();
  const groupId = group?.id;
  const row: TimelineRowExtra = {
    id: `row_${v7()}`,

    keyframes: [
      {
        id: `A_keyframe_${groupId}`,
        val: start,
        group: group,
      },
      {
        id: `B_keyframe_${groupId}`,
        val: end ?? start + 1000,
        group: group,
      },
    ],
  };

  return row;
};

export default createRow;
