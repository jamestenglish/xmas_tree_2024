import Konva from "konva";
import { useCallback } from "react";

import { useShallow } from "zustand/react/shallow";
import useEditorStore from "~/features/tree-editor/state/useEditorStore";

export default function useOnTransformEnd() {
  const { canvasImages, setCanvasImages } = useEditorStore(
    useShallow((state) => ({
      canvasImages: state.canvasImages,
      setCanvasImages: state.setCanvasImages,
    })),
  );
  return useCallback(
    (e: Konva.KonvaEventObject<Event>, id: string) => {
      const node = e.target;
      const scaleX = node.scaleX();
      const scaleY = node.scaleY();
      const rotation = node.rotation();

      setCanvasImages(
        canvasImages.map((img) =>
          img.id === id
            ? {
                ...img,
                x: node.x(),
                y: node.y(),
                width: node.width() * scaleX,
                height: node.height() * scaleY,
                rotation: rotation,
              }
            : img,
        ),
      );
      node.scaleX(1);
      node.scaleY(1);
    },
    [canvasImages, setCanvasImages],
  );
}
