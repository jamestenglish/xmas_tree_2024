/* eslint-disable react/jsx-no-comment-textnodes */
import { useShallow } from "zustand/shallow";
import ColorPicker from "./ColorPicker.client";
import GenericDialog from "./GenericDialog";
import useEditorStore from "../tree-editor/state/useEditorStore";

interface ColorPickerDialogProps {
  onClickColorClose: () => void;
}

export default function ColorPickerDialog({
  onClickColorClose,
}: ColorPickerDialogProps) {
  //

  const { canvasIsColorPickerOpen } = useEditorStore(
    useShallow((state) => ({
      canvasIsColorPickerOpen: state.canvasIsColorPickerOpen,
    })),
  );

  return (
    <>
      <GenericDialog
        id="ColorDialog"
        isOpen={canvasIsColorPickerOpen}
        onClickClose={onClickColorClose}
      >
        <ColorPicker />
      </GenericDialog>
    </>
  );
}
