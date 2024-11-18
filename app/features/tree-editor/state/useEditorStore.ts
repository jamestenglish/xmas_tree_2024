import { create } from "zustand";
import {
  devtools,
  // persist
} from "zustand/middleware";
import type {} from "@redux-devtools/extension"; // required for devtools typing
import createRow, {
  TimelineModelExtra,
} from "~/features/tree-timeline/functions/createRow";
import {
  Timeline,
  TimelineElementDragState,
  TimelineInteractionMode,
} from "animation-timeline-js";
import { produce } from "immer";
import createSetSelectedGroupId, {
  defaultByGroup,
} from "./functions/createSetSelectedGroupId";
import createAddRow from "./functions/createAddRow";
import createAddGroupToRow from "./functions/createAddGroupToRow";
import createOnDrag from "./functions/createOnDrag";
import createToggeLightId from "./functions/createToggleLightId";
import { ImageType } from "~/features/tree-canvas/EditableImage";

export type CanvasGlobalCompositeOperationType =
  | "destination-out"
  | "source-over";

export type LineType = {
  points: Array<number>;
  stroke: string;
  strokeWidth: number;
  id: string;
  type: string;
  globalCompositeOperation: CanvasGlobalCompositeOperationType;
};

export function is(input: unknown, type: string) {
  return typeof input === type;
}

// TODO JTE if you want more than drawing
// const initialRowA = createRow();
const initialRowB = createRow({ isSelected: true });

// TODO JTE if you want more than drawing
// const initialModel: TimelineModelExtra = {
//   rows: [initialRowA, initialRowB],
// };

const initialModel: TimelineModelExtra = {
  rows: [initialRowB],
};

const initialGroup = initialRowB?.keyframes?.[0]?.group;
const initialSelectedGroup =
  (typeof initialGroup !== "string" ? initialGroup?.id : null) ?? null;

export type SetSelectedGroupIdType = (selectedGroupId: string | null) => void;
export type DragTypes = "started" | "continue" | "finished";

export type AttributeByGroupType<T> = {
  [key: string]: T;
};

type CanvasCusorA = { x: number; y: number };
type CanvasCursorPos = CanvasCusorA | null;

export type CanvasInteractionMode = "drawing" | "selecting" | "idle";

export type CanvasInteractionType = "drawing" | "selecting";

export interface GroupTypes {
  color: string | undefined;
  canvasLines: Array<LineType>;
  canvasImages: Array<ImageType>;
  selectedLightIds: number[];
}
export interface ByGroupType {
  [key: string]: GroupTypes;
}

export interface TimelineState {
  setSelectedGroupId: SetSelectedGroupIdType;
  selectedGroupId: string;

  model: TimelineModelExtra;
  setModel: (newMode: TimelineModelExtra) => void;
  timelineInteractionMode: TimelineInteractionMode;
  setTimelineInteractionMode: (
    timelineInteractionMode: TimelineInteractionMode,
  ) => void;
  addTimelineRow: (timeline: Timeline) => void;
  addTimelineGroupToRow: (timeline: Timeline, rowId: string) => void;
  deleteTimelineRow: (indexToDelete: number) => void;
  onDragTimeline: (
    elements: TimelineElementDragState[] | null,
    dragType: DragTypes,
  ) => void;
}

export interface CanvasState {
  previousSelectedColors: string[];
  addSelectedColor: (color: string) => void;

  canvasInteractionMode: CanvasInteractionMode;
  setCanvasInteractionMode: (state: CanvasInteractionMode) => void;

  canvasIsColorPickerOpen: boolean;
  setCanvasIsColorPickerOpen: (canvasIsColorPickerOpen: boolean) => void;

  canvasCursorPos: CanvasCursorPos;
  setCanvasCursorPos: (canvasCursorPos: CanvasCursorPos) => void;

  canvasBrushSize: number;
  setCanvasBrushSize: (canvasBrushSize: number) => void;

  canvasGlobalCompositeOperation: CanvasGlobalCompositeOperationType;
  setCanvasGlobalCompositeOperation: (
    canvasGlobalCompositeOperation: CanvasGlobalCompositeOperationType,
  ) => void;

  canvasInteractionType: CanvasInteractionType;
  setCanvasInteractionType: (
    canvasInteractionType: CanvasInteractionType,
  ) => void;

  // ----
  canvasSelectedId: string | null;
  setCanvasSelectedId: (canvasSelectedId: string | null) => void;

  canvasLines: Array<LineType>;
  setCanvasLines: (canvasLines: Array<LineType>) => void;
  setCanvasImages: (canvasImages: Array<ImageType>) => void;
  canvasImages: Array<ImageType>;
}

export interface EditorState extends TimelineState, CanvasState, GroupTypes {
  attributesByGroup: ByGroupType;
  toggleLightId: (selectedLightId: number | null) => void;
  selectedLightIds: number[];

  setColor: (color: string) => void;
  color: string | undefined;

  blinkState: boolean;
  toggleBlinkState: () => void;
}

const useEditorStore = create<EditorState>()(
  devtools(
    // persist(
    (set) => ({
      canvasInteractionType: "drawing",
      setCanvasInteractionType: (
        canvasInteractionType: CanvasInteractionType,
      ) => set({ canvasInteractionType }),

      canvasGlobalCompositeOperation: "source-over",
      setCanvasGlobalCompositeOperation: (
        canvasGlobalCompositeOperation: CanvasGlobalCompositeOperationType,
      ) => set({ canvasGlobalCompositeOperation }),

      attributesByGroup: initialSelectedGroup
        ? {
            [initialSelectedGroup]: defaultByGroup,
          }
        : {},

      // --------
      canvasSelectedId: null,
      setCanvasSelectedId: (canvasSelectedId) => set({ canvasSelectedId }),

      canvasLines: defaultByGroup.canvasLines,
      setCanvasLines: (canvasLines) => set({ canvasLines }),

      setCanvasImages: (canvasImages) => set({ canvasImages }),
      canvasImages: defaultByGroup.canvasImages,
      // --------
      canvasBrushSize: 10,
      setCanvasBrushSize: (canvasBrushSize) => set({ canvasBrushSize }),

      canvasCursorPos: null,
      setCanvasCursorPos: (canvasCursorPos) => set({ canvasCursorPos }),

      canvasIsColorPickerOpen: false,
      setCanvasIsColorPickerOpen: (canvasIsColorPickerOpen) =>
        set({ canvasIsColorPickerOpen }),

      canvasInteractionMode: "idle",
      setCanvasInteractionMode: (canvasInteractionMode) =>
        set({ canvasInteractionMode }),
      addSelectedColor: (color) =>
        set(
          produce((state) => {
            const { previousSelectedColors: tmpColors } = state;
            let previousSelectedColors = tmpColors;
            if (!previousSelectedColors.includes(color)) {
              if (previousSelectedColors.length === 16) {
                previousSelectedColors.pop();
              }
              previousSelectedColors = [color, ...previousSelectedColors];
            }
            state.previousSelectedColors = previousSelectedColors;
          }),
        ),
      previousSelectedColors: [
        "#D0021B",
        "#F5A623",
        "#F8E71C",
        "#8B572A",
        "#7ED321",
        "#417505",
        "#BD10E0",
        "#9013FE",
        "#4A90E2",
        "#50E3C2",
        "#B8E986",
        "#000000",
        "#4A4A4A",
        "#9B9B9B",
        "#FFFFFF",
      ],
      setColor: (color) => set({ color }),
      color: defaultByGroup.color,

      setSelectedGroupId: (selectedGroupId) =>
        set(createSetSelectedGroupId(selectedGroupId)),
      selectedGroupId: initialSelectedGroup ?? "",
      model: initialModel,
      setModel: (model) => set({ model }),
      timelineInteractionMode: TimelineInteractionMode.Pan,
      setTimelineInteractionMode: (timelineInteractionMode) =>
        set({ timelineInteractionMode }),
      addTimelineRow: (timeline: Timeline) => set(createAddRow(timeline)),
      addTimelineGroupToRow: (timeline: Timeline, rowId: string) =>
        set(createAddGroupToRow(timeline, rowId)),
      deleteTimelineRow: (indexToDelete: number) =>
        set(
          produce((state: EditorState) => {
            state.model.rows.splice(indexToDelete, 1);
          }),
        ),
      onDragTimeline: (elements, dragType) =>
        set(createOnDrag(elements, dragType)),
      toggleLightId: (selectedLightId: number | null) =>
        set(createToggeLightId(selectedLightId)),
      selectedLightIds: defaultByGroup.selectedLightIds,
      blinkState: false,
      toggleBlinkState: () =>
        set((state) => {
          return { blinkState: !state.blinkState };
        }),
    }),
    // ),
    //   {
    //     name: "editor-storage",
    //   },
  ),
);

export default useEditorStore;
