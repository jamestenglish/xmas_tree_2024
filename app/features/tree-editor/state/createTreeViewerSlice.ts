import { StateCreator } from "zustand";
import { StateIntersection } from "./useEditorStore";

export interface TreeViewerState {
  treeViewerCylinderOpacity: number;
  setTreeViewerCylinderOpacity: (treeViewerCylinderOpacity: number) => void;
}

const createTreeViewerSlice: StateCreator<
  StateIntersection,
  [["zustand/devtools", never]],
  [],
  TreeViewerState
> = (set) => ({
  treeViewerCylinderOpacity: 0.3,
  setTreeViewerCylinderOpacity: (treeViewerCylinderOpacity) =>
    set({ treeViewerCylinderOpacity }),
});

export default createTreeViewerSlice;
