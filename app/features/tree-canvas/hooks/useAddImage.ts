import { useCallback } from "react";
import useEditorStore from "~/features/tree-editor/state/useEditorStore";
import { useShallow } from "zustand/react/shallow";
import { v7 } from "uuid";
import { ImageType } from "../EditableImage";

export default function useAddImage() {
  const { canvasImages, setCanvasImages } = useEditorStore(
    useShallow((state) => ({
      canvasImages: state.canvasImages,
      setCanvasImages: state.setCanvasImages,
    })),
  );

  const addImage = useCallback(
    (src: string) => {
      const newImage: ImageType = {
        // id: `${new Date().getTime()}`,
        id: v7(),
        type: "image",
        src,
        x: 50,
        y: 50,
        width: 100,
        height: 100,
        rotation: 0,
      };
      setCanvasImages([...canvasImages, newImage]);
    },
    [canvasImages, setCanvasImages],
  );

  return addImage;
}
