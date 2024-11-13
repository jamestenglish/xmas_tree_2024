import Konva from "konva";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  Stage,
  Layer,
  Line,
  Image as KonvaImage,
  Transformer,
} from "react-konva";
import useImage from "use-image";
import Button from "~/features/ui/components/Button";
import { canvasHeight, canvasWidth } from "./constants";

const imgUrl =
  "https://images.chesscomfiles.com/uploads/v1/images_users/tiny_mce/petrikeckman/phpE4U0RQ.png";

type EditableImageProps = {
  img: ImageType;
  isSelected: boolean;
  onSelect: (e: Konva.KonvaEventObject<MouseEvent>) => void;
  onTransformEnd: (e: Konva.KonvaEventObject<Event>) => void;
};
// Separate component for each editable image with transformer support
function EditableImage({
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
type ImageType = {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
};

type LineType = {
  points: Array<number>;
};

type CanvasEditorProps = {
  setImgUrl: React.Dispatch<React.SetStateAction<string>>;
};
function CanvasEditor({ setImgUrl }: CanvasEditorProps) {
  const [lines, setLines] = useState<Array<LineType>>([]);
  const [images, setImages] = useState<Array<ImageType>>([]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const stageRef = useRef<Konva.Stage>(null);

  // Function to add an image
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
      setImages([...images, newImage]);
    },
    [images],
  );

  // Start drawing freehand
  const handleMouseDown = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      console.log("foo");
      if (e.target === stageRef.current) {
        setSelectedId(null); // Deselect any selected images
      }
      const pos = e.target?.getStage()?.getPointerPosition();
      console.log({ pos });
      if (pos) {
        setIsDrawing(true);
        console.log("drawing");
        setLines([...lines, { points: [pos.x, pos.y] }]);
      }
    },
    [lines],
  );

  // Continue freehand drawing
  const handleMouseMove = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (!isDrawing) return;
      const stage = e.target.getStage();
      const point = stage?.getPointerPosition();

      if (point) {
        const lastLine = lines[lines.length - 1];
        lastLine.points = lastLine.points.concat([point.x, point.y]);
        lines.splice(lines.length - 1, 1, lastLine);
        console.log("adding lines");
        setLines(lines.concat());
      }
    },
    [isDrawing, lines],
  );

  // End freehand drawing
  const handleMouseUp = useCallback(() => {
    console.log("done draw");
    setIsDrawing(false);
  }, []);

  // Update image position, rotation, and size
  const handleTransformEnd = useCallback(
    (e: Konva.KonvaEventObject<Event>, id: string) => {
      const node = e.target;
      const scaleX = node.scaleX();
      const scaleY = node.scaleY();
      const rotation = node.rotation();

      setImages(
        images.map((img) =>
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
    [images],
  );

  // Select an image
  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const handleExport = useCallback(() => {
    const handleExportAsync = async () => {
      if (stageRef.current) {
        const uri = stageRef.current.toDataURL();

        // if (testCanvasRef.current) {
        //   const context = testCanvasRef.current.getContext("2d");
        //   await new Promise((resolve) => {
        //     const img = new Image();
        //     const ii = document.getElementById("testImg") as HTMLImageElement;
        //     ii.src = uri;
        //     img.onload = function () {
        //       context?.drawImage(img, 0, 0); //, canvasWidth, canvasHeight); // Or at whatever offset you like
        //       resolve(null);
        //     };
        //     img.src = uri;
        //   });

        setImgUrl(uri);
        // }
        // console.log(uri);
        // we also can save uri as file
        // but in the demo on Konva website it will not work
        // because of iframe restrictions
        // but feel free to use it in your apps:
        // downloadURI(uri, 'stage.png');
      }
    };
    handleExportAsync();
  }, [setImgUrl]);

  return (
    <div>
      <Button onClick={() => addImage(imgUrl)}>Add Image</Button>
      <Button onClick={handleExport}>Save</Button>

      <Stage
        // width={window.innerWidth}
        // height={window.innerHeight}
        width={canvasWidth}
        height={canvasHeight}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        ref={stageRef}
        style={{ border: "1px solid blue" }}
      >
        <Layer>
          {/* Freehand Drawing */}
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke="purple"
              strokeWidth={20}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
            />
          ))}

          {/* Images */}
          {images.map((img) => (
            <EditableImage
              key={img.id}
              img={img}
              isSelected={img.id === selectedId}
              onSelect={() => handleSelect(img.id)}
              onTransformEnd={(e: Konva.KonvaEventObject<Event>) =>
                handleTransformEnd(e, img.id)
              }
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}

export default CanvasEditor;
