import {
  TimelineKeyframe,
  TimelineRanged,
  TimelineRow,
  TimelineSelectable,
} from "animation-timeline-js";
import { TimelineGroup } from "animation-timeline-js/lib/models/timelineGroup";
import { v7 } from "uuid";

export interface TimelineGroupExtra extends TimelineGroup {
  id?: string;
  selected?: boolean;
}

export interface TimelineKeyframeExtra
  extends TimelineKeyframe,
    TimelineSelectable,
    TimelineRanged {
  group?: string | TimelineGroupExtra;
}

export interface TimelineRowExtra extends TimelineRow, TimelineRanged {
  keyframes?: TimelineKeyframeExtra[] | null;
  id?: string;
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
      fillColor: "green",
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
      fillColor: "blue",
    },
    selected: false,
  };

  return group;
}

const createRow = ({ start = 0, end = undefined }: CreateRowArgs = {}) => {
  const group = createUnselectedGroup();
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
        val: start,
        group: group,
      },
      {
        val: end ?? start + 1000,
        group: group,
      },
    ],
  };

  return row;
};

export default createRow;
