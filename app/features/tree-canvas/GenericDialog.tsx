/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-no-comment-textnodes */
import { PropsWithChildren, useEffect } from "react";

// function HomePage({
//   children,
// }: PropsWithChildren<HomePageFormProviderProps>) {

type GenericDialogProps = {
  onClickClose: () => void;
  id: string;
  isOpen: boolean;
};
export default function GenericDialog({
  onClickClose,
  children,
  id,
  isOpen,
}: PropsWithChildren<GenericDialogProps>) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const genericDialog = document.getElementById(
        id,
      ) as HTMLDialogElement | null;
      if (genericDialog !== null) {
        const rect = genericDialog.getBoundingClientRect();
        const isInDialog =
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width;
        if (!isInDialog) {
          onClickClose();
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [id, onClickClose]);

  return (
    <>
      <dialog
        id={id}
        className="modal"
        open={isOpen}
        onCancel={() => console.log(`${id} cancel`)}
      >
        {children}
      </dialog>
    </>
  );
}
