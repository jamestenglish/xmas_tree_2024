import { produce } from "immer";
import { EditorState, AttributeByGroupType } from "../useEditorStore";
import memoizedSelectedIdsSelector from "../memoizedSelectedIdsSelector";

type KeysMatchingValueType<T, TProp> = {
  [P in keyof T]: T[P] extends TProp ? P : never;
}[keyof T];

type ValueOf<T> = T[keyof T];

export default function createSetAttibuteByGroupId<T>(
  value: ValueOf<AttributeByGroupType<T>>,
  attributeName: KeysMatchingValueType<EditorState, AttributeByGroupType<T>>,
) {
  return produce((state: EditorState) => {
    if (value !== null) {
      const { timelineSelectedGroupId } = memoizedSelectedIdsSelector(
        state.timelineModel.rows,
      );
      if (timelineSelectedGroupId && state) {
        const attribute = state[attributeName] as AttributeByGroupType<T>;
        if (attribute !== null) {
          attribute[timelineSelectedGroupId] = value;
        }
      }
    }
  });
}
