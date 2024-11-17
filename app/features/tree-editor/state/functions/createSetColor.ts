// import { produce } from "immer";
// import { EditorState } from "../useEditorStore";
// import memoizedSelectedIdsSelector from "../memoizedSelectedIdsSelector";

// const createSetColor = (color: string | null) => {
//   return produce((state: EditorState) => {
//     if (color !== null) {
//       const { selectedGroupId } = memoizedSelectedIdsSelector(state.model.rows);
//       if (selectedGroupId !== undefined) {
//         state.colorByGroup[selectedGroupId] = color;
//       }
//     }
//   });
// };

// export default createSetColor;
