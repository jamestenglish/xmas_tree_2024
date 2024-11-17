/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-no-comment-textnodes */
import { useEffect } from "react";
import useEditorStore from "../tree-editor/state/useEditorStore";
import { useShallow } from "zustand/shallow";
import ColorPicker from "./ColorPicker.client";

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dialog = document.getElementById(
        "modal",
      ) as HTMLDialogElement | null;
      if (dialog !== null) {
        console.log({ dialog });
        const rect = dialog.getBoundingClientRect();
        const isInDialog =
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width;
        if (!isInDialog) {
          onClickColorClose();
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClickColorClose]);

  return (
    <>
      <dialog
        id="modal"
        className="modal"
        open={canvasIsColorPickerOpen}
        onCancel={() => console.log("cancl")}
        onClick={(event) => {
          console.log("aaaclick");
          const dialog = document.getElementById("modal") as HTMLDialogElement;
          if (dialog !== null) {
            const rect = dialog.getBoundingClientRect();
            const isInDialog =
              rect.top <= event.clientY &&
              event.clientY <= rect.top + rect.height &&
              rect.left <= event.clientX &&
              event.clientX <= rect.left + rect.width;
            console.log({ isInDialog });
            if (!isInDialog) {
              onClickColorClose();
            }
          }
        }}
      >
        <button id="closeModal" className="modal-close-btn">
          Close
        </button>
        <ColorPicker />
      </dialog>
    </>
  );
}
