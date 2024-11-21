import { StateCreator } from "zustand";

import { TimelineInteractionMode } from "animation-timeline-js";
import { StateIntersection } from "./useEditorStore";

export type TimelinePlayingState = "idle" | "loading" | "playing";

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

  timelinePlayingState: TimelinePlayingState;
  setTimelinePlayingState: (timelinePlayingState: TimelinePlayingState) => void;
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

  timelinePlayingState: "idle",
  setTimelinePlayingState: (timelinePlayingState) =>
    set({ timelinePlayingState }),
});

export default createTimelineSlice;
