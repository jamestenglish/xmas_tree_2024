import Konva from "konva";
import { useRef, useEffect } from "react";
import { Image as KonvaImage, Transformer } from "react-konva";
import useImage from "use-image";

export type ImageType = {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
};

type EditableImageProps = {
  img: ImageType;
  isSelected: boolean;
  onSelect: (e: Konva.KonvaEventObject<MouseEvent>) => void;
  onTransformEnd: (e: Konva.KonvaEventObject<Event>) => void;
};
// Separate component for each editable image with transformer support
export default function EditableImage({
  img,
  isSelected,
  onSelect,
  onTransformEnd,
}: EditableImageProps) {
  const [image] = useImage(img.src);
  const shapeRef = useRef<Konva.Image>(null);
  const trRef = useRef<Konva.Transformer>(null);

  // Attach transformer on image selection
  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <KonvaImage
        image={image}
        x={img.x}
        y={img.y}
        width={img.width}
        height={img.height}
        rotation={img.rotation}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        onTransformEnd={onTransformEnd}
        onDragEnd={onTransformEnd}

        // onDragEnd={(e) => {
        //   // Update image position on drag end
        //   const node = e.target;
        //   onTransformEnd(e, img.id, { x: node.x(), y: node.y() });
        // }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          rotateEnabled={true}
          boundBoxFunc={(oldBox, newBox) => {
            // Limit resizing to avoid negative sizes
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
}
