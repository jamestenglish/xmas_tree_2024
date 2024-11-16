import {
  TimelineKeyframe,
  TimelineRanged,
  TimelineRow,
  TimelineSelectable,
} from "animation-timeline-js";
import { TimelineGroup } from "animation-timeline-js/lib/models/timelineGroup";
import { v7 } from "uuid";

export type TimelineModelExtra = {
  rows: TimelineRowExtra[];
};

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

type CreateRowArgs = {
  start?: number;
  end?: number;
};

export function createUnselectedGroup(existingGroupId?: string) {
  const groupId = existingGroupId ?? v7();

  const group: TimelineGroupExtra = {
    id: groupId,
    style: {
      // TODO JTE
      fillColor: "rgba(0,0,170,0.3)",
    },
    selected: false,
  };

  return group;
}

export function createSelectedGroup(existingGroupId?: string) {
  const groupId = existingGroupId ?? v7();

  const group: TimelineGroupExtra = {
    id: groupId,
    style: {
      // TODO JTE
      fillColor: "rgba(0,170,0,0.3)",
    },
    selected: false,
  };

  return group;
}

const createRow = ({ start = 0, end = undefined }: CreateRowArgs = {}) => {
  const group = createUnselectedGroup();
  const groupId = group?.id;
  const row: TimelineRowExtra = {
    id: v7(),
    style: {
      groupsStyle: {
        // fillColor: "rgba(10, 71, 112, 1)",
        fillColor: "rgba(10, 71, 255, 0.3)",
      },
    },
    keyframes: [
      {
        id: `A_${groupId}`,
        val: start,
        group: group,
      },
      {
        id: `B_${groupId}`,
        val: end ?? start + 1000,
        group: group,
      },
    ],
  };

  return row;
};

export default createRow;
