import { useCallback } from "react";
import useEditorStore from "~/features/tree-editor/state/useEditorStore";
import { useShallow } from "zustand/react/shallow";

export default function useAddImage() {
  const { canvasImages, setCanvasImages } = useEditorStore(
    useShallow((state) => ({
      canvasImages: state.canvasImages,
      setCanvasImages: state.setCanvasImages,
    })),
  );

  const addImage = useCallback(
    (src: string) => {
      const newImage = {
        id: `img-${Date.now()}`,
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
