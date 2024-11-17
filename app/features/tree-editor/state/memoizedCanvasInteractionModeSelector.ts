import memoize from "memoize";
import { TimelineRowExtra } from "~/features/tree-timeline/functions/createRow";
import { selectedIdsSelector } from "./memoizedSelectedIdsSelector";

export type SelectedGroupType = "canvas" | "light" | "none";

export function canvasInteractionModeSelector(
  rows: TimelineRowExtra[],
): SelectedGroupType {
  const { selectedRowId = null } = selectedIdsSelector(rows) ?? {};
  if (selectedRowId === null) {
    return "none";
  }
  const rowIndex = rows.findIndex((row) => row?.id === selectedRowId);
  if (rowIndex === rows.length - 1) {
    return "canvas";
  }

  return "light";
}
const memoizedCanvasInteractionModeSelector = memoize(
  canvasInteractionModeSelector,
  {
    cacheKey: JSON.stringify,
  },
);

export default memoizedCanvasInteractionModeSelector;
