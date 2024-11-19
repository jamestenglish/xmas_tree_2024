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
import createSetTimelineSelectedGroupId, {
  defaultByGroup,
} from "./functions/createSetTimelineSelectedGroupId";
import createAddRow from "./functions/createAddRow";
import createAddGroupToRow from "./functions/createAddGroupToRow";
import createOnDrag from "./functions/createOnDrag";
import createToggeLightId from "./functions/createToggleLightId";
import { ImageType } from "~/features/tree-canvas/EditableImage";
import createDeleteSeletedTimelineGroup from "./functions/createDeleteSeletedTimelineGroup";
import { GroupMetaType } from "./functions/findAllTimelineObjectsByGroupId";

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

export type TimelineSelectedGroupIdType = string | null;

export type SetTimelineSelectedGroupIdType = (
  timelineSelectedGroupId: TimelineSelectedGroupIdType,
) => void;
export type DragTypes = "started" | "continue" | "finished";

export type AttributeByGroupType<T> = {
  [key: string]: T;
};

type CanvasCusorA = { x: number; y: number };
type CanvasCursorPos = CanvasCusorA | null;

export type CanvasInteractionMode = "drawing" | "selecting" | "idle";

export type CanvasInteractionType = "drawing" | "selecting";

export interface BaseState {
  setColor: (color: string) => void;
  color: string | undefined;
}

export interface GroupTypes {
  color: string | undefined;
  canvasLines: Array<LineType>;
  canvasImages: Array<ImageType>;
  treeViewerSelectedLightIds: number[];
  canvasCylinderImgUrl: string;
}

export interface ByGroupType {
  [key: string]: GroupTypes;
}

export interface AttributeByGroupState {
  attributesByGroup: ByGroupType;
}

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

export type TimelineExportState = {
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
};

export type TimelineExportMeta = {
  groupIdsToProcess: string[];
  currentGroupId: string;
};

export interface TimelineState
  extends AttributeByGroupState,
    BaseState,
    GroupTypes {
  timelineCoarseTime: number;
  setTimelineCoarseTime: (timelineCoarseTime: number) => void;
  timelineExportState: TimelineExportState;
  setTimelineExportState: (timelineExportState: TimelineExportState) => void;

  timelineActionId: string | null;
  setTimelineActionId: (timelineActionId: string | null) => void;

  setTimelineSelectedGroupId: SetTimelineSelectedGroupIdType;
  timelineSelectedGroupId: TimelineSelectedGroupIdType;

  timelineModel: TimelineModelExtra;
  setTimelineModel: (newMode: TimelineModelExtra) => void;
  timelineInteractionMode: TimelineInteractionMode;
  setTimelineInteractionMode: (
    timelineInteractionMode: TimelineInteractionMode,
  ) => void;
  addTimelineRow: (timeline: Timeline) => void;

  addTimelineGroupToRow: (timeline: Timeline, rowId: string) => void;
  deleteSeletedTimelineGroup: () => void;

  deleteTimelineRow: (indexToDelete: number) => void;
  onDragTimeline: (
    elements: TimelineElementDragState[] | null,
    dragType: DragTypes,
  ) => void;
}

export interface EditorState
  extends TimelineState,
    CanvasState,
    GroupTypes,
    TreeViewerState,
    AttributeByGroupState,
    BaseState {}

export interface TreeViewerState {
  toggleTreeViewerLightId: (selectedLightId: number | null) => void;
  treeViewerSelectedLightIds: number[];
  treeViewerBlinkState: boolean;
  toggleTreeViewerBlinkState: () => void;
  treeViewerCylinderOpacity: number;
  setTreeViewerCylinderOpacity: (treeViewerCylinderOpacity: number) => void;
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

  setCanvasCylinderImgUrl: (canvasCylinderImgUrl: string) => void;
}

const useEditorStore = create<EditorState>()(
  devtools(
    // persist(
    (set) => ({
      timelineCoarseTime: 0,
      setTimelineCoarseTime: (timelineCoarseTime) =>
        set({ timelineCoarseTime }),

      timelineExportState: { status: "IDLE", groupIds: [] },
      setTimelineExportState: (timelineExportState) =>
        set({ timelineExportState }),
      timelineActionId: null,
      setTimelineActionId: (timelineActionId) => set({ timelineActionId }),

      treeViewerCylinderOpacity: 0.3,
      setTreeViewerCylinderOpacity: (treeViewerCylinderOpacity) =>
        set({ treeViewerCylinderOpacity }),

      canvasCylinderImgUrl: defaultByGroup.canvasCylinderImgUrl,
      setCanvasCylinderImgUrl: (canvasCylinderImgUrl: string) =>
        set({ canvasCylinderImgUrl }),

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

      setTimelineSelectedGroupId: (timelineSelectedGroupId) =>
        set(createSetTimelineSelectedGroupId(timelineSelectedGroupId)),

      timelineSelectedGroupId: initialSelectedGroup ?? "",

      timelineModel: initialModel,
      setTimelineModel: (timelineModel) => set({ timelineModel }),

      timelineInteractionMode: TimelineInteractionMode.Pan,
      setTimelineInteractionMode: (timelineInteractionMode) =>
        set({ timelineInteractionMode }),

      addTimelineRow: (timeline: Timeline) => set(createAddRow(timeline)),
      deleteTimelineRow: (indexToDelete: number) =>
        set(
          produce((state: EditorState) => {
            state.timelineModel.rows.splice(indexToDelete, 1);
          }),
        ),

      addTimelineGroupToRow: (timeline: Timeline, rowId: string) =>
        set(createAddGroupToRow(timeline, rowId)),
      deleteSeletedTimelineGroup: () => set(createDeleteSeletedTimelineGroup()),

      onDragTimeline: (elements, dragType) =>
        set(createOnDrag(elements, dragType)),
      toggleTreeViewerLightId: (selectedLightId: number | null) =>
        set(createToggeLightId(selectedLightId)),
      treeViewerSelectedLightIds: defaultByGroup.treeViewerSelectedLightIds,
      treeViewerBlinkState: false,
      toggleTreeViewerBlinkState: () =>
        set((state) => {
          return { treeViewerBlinkState: !state.treeViewerBlinkState };
        }),
    }),
    // ),
    //   {
    //     name: "editor-storage",
    //   },
  ),
);

export default useEditorStore;
