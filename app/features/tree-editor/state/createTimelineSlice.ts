import { StateCreator } from "zustand";
import { GroupMetaType } from "./functions/findAllTimelineObjectsByGroupId";

import { TimelineInteractionMode } from "animation-timeline-js";
import { StateIntersection } from "./useEditorStore";

type TimelineExportStatus =
  | "IDLE"
  | "START"
  | "INIT_STATE"
  | "INIT_STATE_A"
  | "GROUP_EXPORT_INIT"
  | "GROUP_EXPORT_START"
  | "GROUP_EXPORT_LOAD_CANVAS_START"
  | "GROUP_EXPORT_LOAD_CANVAS_EXPORT"
  | "GROUP_EXPORT_LOAD_CANVAS_WAIT"
  | "GROUP_EXPORT_LOAD_CANVAS_FINISH"
  | "PLAY"
  | "PAUSE"
  | "ERROR";

// interface TimelineExportMeta {
//   groupIdsToProcess: string[];
//   currentGroupId: string;
// }

export interface TimelineExportState {
  status: TimelineExportStatus;
  groupIds: string[];
  groupId?: string | null;
  errorMessage?: string | null;
  prevAttributes?: string | null;
  canvasCylinderImgUrlsData?: Array<{
    groupId: string;
    canvasCylinderImgUrl: string;
    start: number;
    end: number;
  }> | null;
  allTimelineObjectsByGroupId?: { [key: string]: GroupMetaType } | null;
  initGroupIds?: string[] | null;
  prevGroupId?: string | null;
}

export interface TimelineState {
  timelineCoarseTime: number;
  setTimelineCoarseTime: (timelineCoarseTime: number) => void;

  // timelineExportState: TimelineExportState;
  // setTimelineExportState: (timelineExportState: TimelineExportState) => void;

  timelineActionId: string | null;
  setTimelineActionId: (timelineActionId: string | null) => void;

  timelineInteractionMode: TimelineInteractionMode;
  setTimelineInteractionMode: (
    timelineInteractionMode: TimelineInteractionMode,
  ) => void;
}

const createTimelineSlice: StateCreator<
  StateIntersection,
  [["zustand/devtools", never]],
  [],
  TimelineState
> = (set) => ({
  timelineCoarseTime: 0,
  setTimelineCoarseTime: (timelineCoarseTime) => set({ timelineCoarseTime }),

  // timelineExportState: { status: "IDLE", groupIds: [] },
  // setTimelineExportState: (timelineExportState) => set({ timelineExportState }),

  timelineActionId: null,
  setTimelineActionId: (timelineActionId) => set({ timelineActionId }),

  timelineInteractionMode: TimelineInteractionMode.Pan,
  setTimelineInteractionMode: (timelineInteractionMode) =>
    set({ timelineInteractionMode }),
});

export default createTimelineSlice;
