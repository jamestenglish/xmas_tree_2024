/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-no-comment-textnodes */
import useEditorStore from "../tree-editor/state/useEditorStore";
import { useShallow } from "zustand/shallow";
import ColorPicker from "./ColorPicker.client";
import GenericDialog from "./GenericDialog";

type ColorPickerDialogProps = {
  onClickColorClose: () => void;
};
export default function ColorPickerDialog({
  onClickColorClose,
}: ColorPickerDialogProps) {
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
