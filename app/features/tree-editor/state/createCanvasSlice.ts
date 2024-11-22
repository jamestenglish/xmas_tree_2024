import { StateCreator } from "zustand";

import { produce } from "immer";
import { StateIntersection } from "./useEditorStore";

export type CanvasGlobalCompositeOperationType =
  | "destination-out"
  | "source-over";

export interface LineType {
  points: Array<number>;
  stroke: string;
  strokeWidth: number;
  id: string;
  type: string;
  globalCompositeOperation: CanvasGlobalCompositeOperationType;
}

export type CanvasInteractionMode = "drawing" | "selecting" | "idle";

export type CanvasInteractionType = "drawing" | "selecting";

type CanvasCursorPos = { x: number; y: number } | null;

export interface CanvasState {
  previousSelectedColors: string[];
  addSelectedColor: (color: string) => void;

  canvasInteractionMode: CanvasInteractionMode;
  setCanvasInteractionMode: (
    canvasInteractionMode: CanvasInteractionMode,
  ) => void;

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

  canvasSelectedId: string | null;
  setCanvasSelectedId: (canvasSelectedId: string | null) => void;
}

const createCanvasSlice: StateCreator<
  StateIntersection,
  [["zustand/devtools", never]],
  [],
  CanvasState
> = (set) => ({
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
  canvasInteractionMode: "idle",
  setCanvasInteractionMode: (canvasInteractionMode: CanvasInteractionMode) =>
    set({ canvasInteractionMode }),
  canvasIsColorPickerOpen: false,
  setCanvasIsColorPickerOpen: (canvasIsColorPickerOpen) =>
    set({ canvasIsColorPickerOpen }),
  canvasCursorPos: null,
  setCanvasCursorPos: (canvasCursorPos) => set({ canvasCursorPos }),
  canvasBrushSize: 10,
  setCanvasBrushSize: (canvasBrushSize) => set({ canvasBrushSize }),
  canvasGlobalCompositeOperation: "source-over",
  setCanvasGlobalCompositeOperation: (
    canvasGlobalCompositeOperation: CanvasGlobalCompositeOperationType,
  ) => set({ canvasGlobalCompositeOperation }),
  canvasInteractionType: "drawing",
  setCanvasInteractionType: (canvasInteractionType: CanvasInteractionType) =>
    set({ canvasInteractionType }),
  canvasSelectedId: null,
  setCanvasSelectedId: (canvasSelectedId) => set({ canvasSelectedId }),
});

export default createCanvasSlice;
