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
                x: Math.round(Number(node.x())),
                y: Math.round(Number(node.y())),
                width: Math.round(Number(node.width() * scaleX)),
                height: Math.round(Number(node.height() * scaleY)),
                rotation: Math.round(Number(rotation)),
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
