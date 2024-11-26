import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type {} from "@redux-devtools/extension"; // required for devtools typing
import createHomepageSlice, { HomepageState } from "./createHomepageSlice";

const useHomepageStore = create<HomepageState>()(
  devtools((...a) => ({
    ...createHomepageSlice(...a),
  })),
);

export { useHomepageStore };
