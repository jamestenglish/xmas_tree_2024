import { produce } from "immer";
import { EditorState } from "../useEditorStore";

export default function createToggeLightId(selectedLightId: number | null) {
  return produce((state: EditorState) => {
    if (selectedLightId !== null) {
      let treeViewerSelectedLightIds = state.treeViewerSelectedLightIds ?? [];

      if (treeViewerSelectedLightIds.includes(selectedLightId)) {
        treeViewerSelectedLightIds = treeViewerSelectedLightIds.filter(
          (id) => id !== selectedLightId,
        );
      } else {
        treeViewerSelectedLightIds.push(selectedLightId);
      }
      state.treeViewerSelectedLightIds = treeViewerSelectedLightIds;
    }
  });
}
