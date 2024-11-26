import { create, StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import type {} from "@redux-devtools/extension"; // required for devtools typing
import { TimelineModelExtra } from "~/features/tree-timeline/functions/createRow";
import { Timeline, TimelineElementDragState } from "animation-timeline-js";
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
import createCanvasSlice, { LineType, CanvasState } from "./createCanvasSlice";
import createTreeViewerSlice, {
  TreeViewerState,
} from "./createTreeViewerSlice";
import createTimelineSlice, { TimelineState } from "./createTimelineSlice";
import { initialModel, initialSelectedGroup } from "./storeInitials";
import getIsExportedByGroupId from "./functions/getIsExportedByGroupId";
// import createHomepageSlice, { HomepageState } from "./createHomepageSlice";

export function is(input: unknown, type: string) {
  return typeof input === type;
}

export type AttributeByGroupType<T> = {
  [key: string]: T;
};

export type TimelineSelectedGroupIdType = string | null;

type SetTimelineSelectedGroupIdType = (
  timelineSelectedGroupId: TimelineSelectedGroupIdType,
) => void;

interface BaseState {
  setColor: (color: string) => void;
  setCanvasLines: (canvasLines: Array<LineType>) => void;
  setCanvasImages: (canvasImages: Array<ImageType>) => void;
  setCanvasExports: (canvasExports: CanvasExport[]) => void;
  setTimelineSelectedGroupId: SetTimelineSelectedGroupIdType;
}

export interface GroupTypes {
  color: string | undefined;
  canvasLines: Array<LineType>;
  canvasImages: Array<ImageType>;
  treeViewerSelectedLightIds: number[];
  canvasExports: CanvasExport[] | null;
  canvasLastEditTimestamp: number;
  canvasLastExportTimestamp: number;
  timelineKeyframeStart: number;
  timelineKeyframeEnd: number;
}

export interface ByGroupType {
  [key: string]: GroupTypes;
}
interface AttributeByGroupState {
  attributesByGroup: ByGroupType;
}

export type DragTypes = "started" | "continue" | "finished";

export type StateIntersection = TreeViewerState &
  CanvasState &
  TimelineState &
  EditorState;

export interface EditorState
  extends GroupTypes,
    AttributeByGroupState,
    BaseState {
  timelineSelectedGroupId: TimelineSelectedGroupIdType;
  timelineModel: TimelineModelExtra;
  setTimelineModel: (newMode: TimelineModelExtra) => void;
  addTimelineRow: (timeline: Timeline) => void;

  addTimelineGroupToRow: (timeline: Timeline, rowId: string) => void;
  deleteSeletedTimelineGroup: () => void;

  deleteTimelineRow: (indexToDelete: number) => void;
  onDragTimeline: (
    elements: TimelineElementDragState[] | null,
    dragType: DragTypes,
  ) => void;

  toggleTreeViewerLightId: (selectedLightId: number | null) => void;
  treeViewerSelectedLightIds: number[];

  treeViewerBlinkState: boolean;
  toggleTreeViewerBlinkState: () => void;

  isTimelinePlayable: boolean;
}

export interface CanvasExport {
  groupId: string;
  canvasCylinderImgUrl: string;
  start: number;
  end: number;
}

const defaultAttributesByGroup = initialSelectedGroup
  ? {
      [initialSelectedGroup]: defaultByGroup,
    }
  : {};

const createEditorSlice: StateCreator<
  StateIntersection,
  [["zustand/devtools", never]],
  [],
  EditorState
> = (set) => ({
  timelineKeyframeEnd: defaultByGroup.timelineKeyframeEnd,
  timelineKeyframeStart: defaultByGroup.timelineKeyframeStart,

  canvasExports: defaultByGroup.canvasExports,

  setCanvasExports: (canvasExports) =>
    set(
      produce((state: EditorState) => {
        const canvasLastExportTimestamp = new Date().getTime();

        state.canvasExports = canvasExports;
        state.canvasLastExportTimestamp = canvasLastExportTimestamp;

        const { timelineSelectedGroupId } = state;
        const exportedByGroupId = getIsExportedByGroupId({
          attributesByGroup: state.attributesByGroup,
        });
        console.log("setCanvasExports", { exportedByGroupId });

        let isTimelinePlayable = true;
        Object.keys(exportedByGroupId).forEach((groupId) => {
          if (groupId === timelineSelectedGroupId) {
            return;
          }
          const isExported = exportedByGroupId[groupId];
          if (!isExported) {
            isTimelinePlayable = false;
          }
        });

        state.isTimelinePlayable = isTimelinePlayable;
      }),
    ),

  attributesByGroup: defaultAttributesByGroup,

  // --------

  canvasLines: defaultByGroup.canvasLines,
  setCanvasLines: (canvasLines) => {
    const canvasLastEditTimestamp = new Date().getTime();
    set({ canvasLines, canvasLastEditTimestamp, isTimelinePlayable: false });
  },

  setCanvasImages: (canvasImages) => {
    const canvasLastEditTimestamp = new Date().getTime();
    set({ canvasImages, canvasLastEditTimestamp, isTimelinePlayable: false });
  },
  canvasImages: defaultByGroup.canvasImages,

  canvasLastEditTimestamp: defaultByGroup.canvasLastEditTimestamp,
  canvasLastExportTimestamp: defaultByGroup.canvasLastExportTimestamp,
  // --------

  setColor: (color) => set({ color }),
  color: defaultByGroup.color,

  timelineSelectedGroupId: initialSelectedGroup ?? "",

  timelineModel: initialModel,
  setTimelineModel: (timelineModel) => set({ timelineModel }),

  addTimelineRow: (timeline) => set(createAddRow(timeline)),
  deleteTimelineRow: (indexToDelete) =>
    set(
      produce((state: EditorState) => {
        state.timelineModel.rows.splice(indexToDelete, 1);
      }),
    ),

  addTimelineGroupToRow: (timeline, rowId) =>
    set(createAddGroupToRow(timeline, rowId)),
  deleteSeletedTimelineGroup: () => set(createDeleteSeletedTimelineGroup()),

  onDragTimeline: (elements, dragType) => set(createOnDrag(elements, dragType)),

  toggleTreeViewerLightId: (selectedLightId) =>
    set(createToggeLightId(selectedLightId)),
  treeViewerSelectedLightIds: defaultByGroup.treeViewerSelectedLightIds,
  treeViewerBlinkState: false,
  toggleTreeViewerBlinkState: () =>
    set((state) => {
      return { treeViewerBlinkState: !state.treeViewerBlinkState };
    }),

  // --- global
  setTimelineSelectedGroupId: (timelineSelectedGroupId) =>
    set(createSetTimelineSelectedGroupId(timelineSelectedGroupId)),

  isTimelinePlayable: false,
});

const useEditorStore = create<StateIntersection>()(
  devtools((...a) => ({
    ...createTreeViewerSlice(...a),
    ...createCanvasSlice(...a),
    ...createTimelineSlice(...a),
    ...createEditorSlice(...a),
  })),
);

export default useEditorStore;
