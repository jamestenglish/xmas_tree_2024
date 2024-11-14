import { TimelineKeyframe, TimelineRow } from "animation-timeline-js";
import { TimelineGroup } from "animation-timeline-js/lib/models/timelineGroup";
import { v7 } from "uuid";

// TODO JTE use TimelineGroup for styling
export interface TimelineKeyframeExtra extends TimelineKeyframe {
  group?: string | TimelineGroup;
  groupId?: string;
}

export interface TimelineRowExtra extends TimelineRow {
  keyframes?: TimelineKeyframeExtra[] | null;
  id?: string;
}

//  export type TimelineRowExtra = TimelineRow & { id?: string };

type CreateRowArgs = {
  start?: number;
  end?: number;
};

const createRow = ({ start = 0, end = undefined }: CreateRowArgs = {}) => {
  const groupId = v7();
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
        group: groupId,
      },
      {
        val: end ?? start + 1000,
        group: groupId,
        // hidden: true,
      },
    ],
  };

  return row;
};

export default createRow;
