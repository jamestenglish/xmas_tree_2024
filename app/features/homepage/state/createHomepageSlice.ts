import { StateCreator } from "zustand";
import { type CanvasPath } from "react-sketch-canvas";
import { produce } from "immer";

interface HomepageMasks {
  [key: string]: Array<boolean>;
}

interface HomepagePaths {
  [key: string]: CanvasPath[];
}

export interface HomepageState {
  homepageMasks: HomepageMasks;
  setHomepageMasks: (position: string, homepageMask: Array<boolean>) => void;
  homepagePaths: HomepagePaths;
  setHomepagePaths: (position: string, pathsForPosition: CanvasPath[]) => void;
}

const createHomepageSlice: StateCreator<
  HomepageState,
  [["zustand/devtools", never]],
  [],
  HomepageState
> = (set) => ({
  homepageMasks: {},
  setHomepageMasks: (position, maskForPosition) =>
    set(
      produce((state: HomepageState) => {
        state.homepageMasks[position] = maskForPosition;
      }),
    ),
  homepagePaths: {},
  setHomepagePaths: (position, pathsForPosition) =>
    set(
      produce((state: HomepageState) => {
        state.homepagePaths[position] = pathsForPosition;
      }),
    ),
});

export default createHomepageSlice;
