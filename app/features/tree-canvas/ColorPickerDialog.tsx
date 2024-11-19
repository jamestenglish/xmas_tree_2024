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
      {/* <dialog
        id="ColorDialog"
        className="modal"
        open={canvasIsColorPickerOpen}
        onCancel={() => console.log("cancl")}
        // onClick={(event) => {
        //   console.log("aaaclick");
        //   const dialog = document.getElementById("ColorDialog") as HTMLDialogElement;
        //   if (dialog !== null) {
        //     const rect = dialog.getBoundingClientRect();
        //     const isInDialog =
        //       rect.top <= event.clientY &&
        //       event.clientY <= rect.top + rect.height &&
        //       rect.left <= event.clientX &&
        //       event.clientX <= rect.left + rect.width;
        //     console.log({ isInDialog });
        //     if (!isInDialog) {
        //       onClickColorClose();
        //     }
        //   }
        // }}
      >
        <ColorPicker />
      </dialog> */}
    </>
  );
}
