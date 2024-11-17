import { produce } from "immer";
import { EditorState } from "../useEditorStore";
// import memoizedSelectedIdsSelector from "../memoizedSelectedIdsSelector";

// export default function createToggeLightId(selectedLightId: number | null) {
//   return produce((state: EditorState) => {
//     if (selectedLightId !== null) {
//       const { selectedGroupId } = memoizedSelectedIdsSelector(state.model.rows);
//       if (selectedGroupId !== undefined) {
//         let selectedLightIds =
//           state.selectedLightIdsByGroup[selectedGroupId] ?? [];

//         // const { selectedLightIds } = state;
//         if (selectedLightIds.includes(selectedLightId)) {
//           selectedLightIds = selectedLightIds.filter(
//             (id) => id !== selectedLightId,
//           );
//         } else {
//           selectedLightIds.push(selectedLightId);
//         }
//         state.selectedLightIdsByGroup[selectedGroupId] = selectedLightIds;
//       }
//     }
//   });
// }

export default function createToggeLightId(selectedLightId: number | null) {
  return produce((state: EditorState) => {
    if (selectedLightId !== null) {
      let selectedLightIds = state.selectedLightIds ?? [];

      // const { selectedLightIds } = state;
      if (selectedLightIds.includes(selectedLightId)) {
        selectedLightIds = selectedLightIds.filter(
          (id) => id !== selectedLightId,
        );
      } else {
        selectedLightIds.push(selectedLightId);
      }
      state.selectedLightIds = selectedLightIds;
    }
  });
}
