import { produce } from "immer";
import { EditorState, AttributeByGroupType } from "../useEditorStore";
import memoizedSelectedIdsSelector from "../memoizedSelectedIdsSelector";

// type KeysMatchingValueType<T, V> = {
//   [K in keyof T]-?: T[K] extends V ? K : never;
// }[keyof T];

// type KeysMatchingValueType<T, V> = keyof {
//   [P in keyof T as T[P] extends V ? P : never]: any;
// };

type KeysMatchingValueType<T, TProp> = {
  [P in keyof T]: T[P] extends TProp ? P : never;
}[keyof T];

// type _Foo = KeysMatchingValueType<
//   EditorState,
//   AttributeByGroupType<number[]>
// >;

type ValueOf<T> = T[keyof T];

// type _Bar<T> = ValueOf<AttributeByGroupType<T>>;

export default function createSetAttibuteByGroupId<
  T,
  // K, // extends KeysMatchingValueType<EditorState, { [key: string]: T }>,
>(
  value: ValueOf<AttributeByGroupType<T>>,
  attributeName: KeysMatchingValueType<EditorState, AttributeByGroupType<T>>,
) {
  return produce((state: EditorState) => {
    if (value !== null) {
      const { selectedGroupId } = memoizedSelectedIdsSelector(state.model.rows);
      if (selectedGroupId && state) {
        const attribute = state[attributeName] as AttributeByGroupType<T>;
        if (attribute !== null) {
          attribute[selectedGroupId] = value;
        }
      }
    }
  });
}
