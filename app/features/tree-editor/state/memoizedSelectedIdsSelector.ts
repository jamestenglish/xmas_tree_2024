import memoize from "memoize";
import { TimelineRowExtra } from "~/features/tree-timeline/functions/createRow";

export function selectedIdsSelector(rows: TimelineRowExtra[]) {
  // const rows = state.model.rows;
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const selectedRowId = row?.id;
    const keyframes = row?.keyframes ?? [];
    for (let j = 0; j < keyframes.length; j++) {
      const keyframe = keyframes[j];
      const group = keyframe?.group;
      if (!(typeof group === "string")) {
        if (group?.selected) {
          console.log("result");
          return { selectedGroupId: group?.id, selectedRowId };
        }
      }
    }
  }
  return {};
}

const memoizedSelectedIdsSelector = memoize(selectedIdsSelector, {
  cacheKey: JSON.stringify,
});

export default memoizedSelectedIdsSelector;
