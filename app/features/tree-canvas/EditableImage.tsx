import Konva from "konva";
import { useRef, useEffect } from "react";
import { Image as KonvaImage, Transformer } from "react-konva";
import useImage from "use-image";
import { ShapeRefMeta } from "./CanvasEditor.client";

export interface ImageTypeAnimationValues {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

export interface ImageTypeParent extends ImageTypeAnimationValues {
  id: string;
  src: string;

  type: string;
}

interface ImageAnimationValue {
  value: unknown;
}

interface ImageAnimationOptions {
  [key: string]: ImageAnimationValue;
}

export interface ImageTypeAnimation {
  options: ImageAnimationOptions;
}

export interface ImageType extends ImageTypeParent, ImageTypeAnimationValues {
  animationOptions?: ImageAnimationOptions;
  animationKeyFrames?: Array<ImageTypeParent>;
  currentAnimationFrame?: ImageTypeParent;
  updatedTime?: number;
}

interface EditableImageProps {
  img: ImageType;
  isSelected: boolean;
  onSelect: (e: Konva.KonvaEventObject<MouseEvent>) => void;
  onTransformEnd: (e: Konva.KonvaEventObject<Event>) => void;
  addShapeRef: (meta: ShapeRefMeta) => void;
  removeShapeRef: (meta: ShapeRefMeta) => void;
  id: string;
}

// Separate component for each editable image with transformer support
export default function EditableImage({
  img,
  isSelected,
  onSelect,
  onTransformEnd,
  addShapeRef,
  removeShapeRef,
  id,
}: EditableImageProps) {
  const [image] = useImage(img.src, "anonymous");
  const shapeRef = useRef<Konva.Image>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const animate = undefined;

  // Attach transformer on image selection
  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected, shapeRef]);

  useEffect(() => {
    addShapeRef({ ref: shapeRef, id, animate });

    return () => removeShapeRef({ ref: shapeRef, id, animate });
  }, [addShapeRef, animate, id, removeShapeRef, shapeRef]);

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
        onClick={(e) => {
          console.log("----uhhh");
          onSelect(e);
        }}
        onTap={onSelect}
        ref={shapeRef}
        onTransformEnd={onTransformEnd}
        onDragEnd={onTransformEnd}
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
