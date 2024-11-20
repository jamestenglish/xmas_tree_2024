import { create, StateCreator } from "zustand";
import {
  devtools,
  // persist
} from "zustand/middleware";
import type {} from "@redux-devtools/extension"; // required for devtools typing
import createRow, {
  TimelineModelExtra,
} from "~/features/tree-timeline/functions/createRow";
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
import findAllTimelineObjectsByGroupId from "./functions/findAllTimelineObjectsByGroupId";

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

export type AttributeByGroupType<T> = {
  [key: string]: T;
};

type TimelineSelectedGroupIdType = string | null;

type SetTimelineSelectedGroupIdType = (
  timelineSelectedGroupId: TimelineSelectedGroupIdType,
) => void;

interface BaseState {
  setColor: (color: string) => void;
  setCanvasLines: (canvasLines: Array<LineType>) => void;
  setCanvasImages: (canvasImages: Array<ImageType>) => void;
  setCanvasCylinderImgUrls: (canvasCylinderImgUrls: string[]) => void;
  setTimelineSelectedGroupId: SetTimelineSelectedGroupIdType;
}

export interface GroupTypes {
  color: string | undefined;
  canvasLines: Array<LineType>;
  canvasImages: Array<ImageType>;
  treeViewerSelectedLightIds: number[];
  canvasCylinderImgUrls: string[];
  canvasLastEditTimestamp: number | null;
  canvasLastExportTimestamp: number | null;
}

interface ByGroupType {
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
}

interface TimelineTexture {
  groupId: string;
  canvasCylinderImgUrls: string[];
  start: number;
  end: number;
}

const defaultAttributesByGroup = initialSelectedGroup
  ? {
      [initialSelectedGroup]: defaultByGroup,
    }
  : {};

const allCanvasCylinderImgUrls = (state: EditorState) => {
  const { timelineModel } = state;

  const allTimelineObjectsByGroupId = findAllTimelineObjectsByGroupId({
    timelineModel,
  });
  const groupIds = Object.keys(allTimelineObjectsByGroupId);

  const timelineTextures: Array<TimelineTexture> = groupIds.map((groupId) => {
    const timelineObjects = allTimelineObjectsByGroupId[groupId];
    const { canvasCylinderImgUrls } = state.attributesByGroup[groupId];

    const start = Math.min(
      timelineObjects.keyframes[0].val,
      timelineObjects.keyframes[1].val,
    );
    const end = Math.max(
      timelineObjects.keyframes[0].val,
      timelineObjects.keyframes[1].val,
    );

    const timelineTexture: TimelineTexture = {
      start,
      end,
      groupId,
      canvasCylinderImgUrls,
    };

    return timelineTexture;
  });
};

const createEditorSlice: StateCreator<
  StateIntersection,
  [["zustand/devtools", never]],
  [],
  EditorState
> = (set) => ({
  canvasCylinderImgUrls: defaultByGroup.canvasCylinderImgUrls,
  setCanvasCylinderImgUrls: (canvasCylinderImgUrls) => {
    const canvasLastExportTimestamp = new Date().getTime();
    set({ canvasCylinderImgUrls, canvasLastExportTimestamp });
  },

  attributesByGroup: defaultAttributesByGroup,

  // --------

  canvasLines: defaultByGroup.canvasLines,
  setCanvasLines: (canvasLines) => {
    const canvasLastEditTimestamp = new Date().getTime();
    set({ canvasLines, canvasLastEditTimestamp });
  },

  setCanvasImages: (canvasImages) => {
    const canvasLastEditTimestamp = new Date().getTime();
    set({ canvasImages, canvasLastEditTimestamp });
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

  onDragTimeline: (elements, dragType) => set(createOnDrag(elements, dragType)),

  toggleTreeViewerLightId: (selectedLightId: number | null) =>
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
