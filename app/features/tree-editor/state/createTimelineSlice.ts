import { StateCreator } from "zustand";

import { TimelineInteractionMode } from "animation-timeline-js/lib/enums/timelineInteractionMode";
import { StateIntersection } from "./useEditorStore";

export type TimelinePlayingState = "idle" | "loading" | "playing";

export interface TimelineState {
  timelineCoarseTime: number;
  setTimelineCoarseTime: (timelineCoarseTime: number) => void;

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

  timelineInteractionMode: TimelineInteractionMode.Pan,
  setTimelineInteractionMode: (timelineInteractionMode) =>
    set({ timelineInteractionMode }),

  timelinePlayingState: "idle",
  setTimelinePlayingState: (timelinePlayingState) =>
    set({ timelinePlayingState }),
});

export default createTimelineSlice;
