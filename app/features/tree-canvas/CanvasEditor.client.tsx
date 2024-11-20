import Konva from "konva";
import { useCallback, useState } from "react";
import { Stage, Layer, Line, Circle } from "react-konva";
import { canvasHeight, canvasWidth } from "../tree-editor/constants";
import useEditorStore from "../tree-editor/state/useEditorStore";
import { useShallow } from "zustand/shallow";
import "./assets/canvas.css";
import EditableImage, { ImageType } from "./EditableImage";
import useOnMouseDown from "./hooks/useOnMouseDown";
import useOnMouseMove from "./hooks/useOnMouseMove";
import useOnMouseUp from "./hooks/useOnMouseUp";
import useOnTransformEnd from "./hooks/useOnTransformEnd";

import memoize from "memoize";
import useOnMouseLeave from "./hooks/useOnMouseLeave";
import CanvasEditorControls from "./CanvasEditorControls";
import CanvasImageForm from "./CanvasImageForm";
import { LineType } from "../tree-editor/state/createCanvasSlice";

const createCanvasElements = (
  canvasImages: ImageType[],
  canvasLines: LineType[],
) => {
  const combinedArray: Array<ImageType | LineType> = [
    ...canvasImages,
    ...canvasLines,
  ];
  combinedArray.sort((a, b) => {
    return a.id.localeCompare(b.id);
  });

  return combinedArray;
};

const memoizedCreateCanvasElements = memoize(createCanvasElements, {
  cacheKey: JSON.stringify,
});

function CanvasImgs({ shapeRefsMeta }: { shapeRefsMeta: ShapeRefMeta[] }) {
  //
  const { canvasImages, setCanvasImages } = useEditorStore(
    useShallow((state) => ({
      canvasImages: state.canvasImages,
      setCanvasImages: state.setCanvasImages,
    })),
  );

  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);

  return (
    <>
      {selectedImage && (
        <CanvasImageForm
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          shapeRefsMeta={shapeRefsMeta}
        />
      )}

      <div className="mt-2 flex max-h-16 flex-row gap-2">
        {canvasImages.map((img) => {
          return (
            <div
              key={img.id}
              // style={{ width: `${img.width}px`, height: `${img.height}px` }}
              className="grid max-h-16 max-w-16 grid-cols-12 grid-rows-12"
            >
              <img
                key={img.id}
                src={img.src}
                alt={`${img.id}`}
                className="col-span-full row-span-full object-contain"
                onClick={() => setSelectedImage(img)}
              />
              <svg
                className="col-start-1 col-end-1 row-start-1 row-end-1 bg-white"
                xmlns="http://www.w3.org/2000/svg"
                height="16px"
                viewBox="0 -960 960 960"
                width="16px"
                fill="#5f6368"
                onClick={() => {
                  const index = canvasImages.findIndex((i) => i.id === img.id);
                  if (index >= 0) {
                    const newImages = [
                      ...canvasImages.slice(0, index),
                      ...canvasImages.slice(index + 1),
                    ];
                    setCanvasImages(newImages);
                  }
                }}
              >
                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
              </svg>
            </div>
          );
        })}
      </div>
    </>
  );
}

export interface ShapeRefMeta {
  ref: React.RefObject<Konva.Image>;
  id: string;
  animate?: unknown;
}

export default function CanvasEditor({
  stageRef,
}: {
  stageRef: React.RefObject<Konva.Stage>;
}) {
  //

  const {
    color,
    canvasElements,

    canvasSelectedId,
    canvasInteractionType,
    canvasBrushSize,
    canvasCursorPos,
    setCanvasSelectedId,
  } = useEditorStore(
    useShallow((state) => ({
      color: state.color,
      canvasElements: memoizedCreateCanvasElements(
        state.canvasImages,
        state.canvasLines,
      ),

      canvasCursorPos: state.canvasCursorPos,
      canvasBrushSize: state.canvasBrushSize,
      canvasInteractionType: state.canvasInteractionType,
      canvasSelectedId: state.canvasSelectedId,
      setCanvasSelectedId: state.setCanvasSelectedId,
    })),
  );

  const [shapeRefsMeta, setShapeRef] = useState<Array<ShapeRefMeta>>([]);

  const addShapeRef = useCallback((meta: ShapeRefMeta) => {
    setShapeRef((prev) => {
      const index = prev.findIndex((sr) => sr.id === meta.id);
      if (index < 0) {
        return [...prev, meta];
      }
      return [...prev.slice(0, index), meta, ...prev.slice(index)];
    });
  }, []);

  const removeShapeRef = useCallback((meta: ShapeRefMeta) => {
    setShapeRef((prev) => {
      const index = prev.findIndex((sr) => sr.id === meta.id);
      if (index < 0) {
        return prev;
      }
      return [...prev.slice(0, index), ...prev.slice(index)];
    });
  }, []);

  // Start drawing freehand
  const onMouseDown = useOnMouseDown({
    stageRef,
  });

  // Continue freehand drawing
  const onMouseMove = useOnMouseMove();

  // End freehand drawing
  const onMouseUp = useOnMouseUp();

  // Update image position, rotation, and size
  const onTransformEnd = useOnTransformEnd();

  const onMouseLeave = useOnMouseLeave();

  // Select an image
  const onSelect = useCallback(
    (id: string) => {
      console.log(`onSelectId: ${id}`);
      setCanvasSelectedId(id);
    },
    [setCanvasSelectedId],
  );

  return (
    <>
      <div>
        <CanvasEditorControls stageRef={stageRef} />

        <div
          style={{
            border: "1px solid blue",
            width: `${canvasWidth}px`,
            height: `${canvasHeight}px`,
          }}
        >
          <Stage
            width={canvasWidth}
            height={canvasHeight}
            onMouseDown={onMouseDown}
            onMousemove={onMouseMove}
            onMouseup={onMouseUp}
            onMouseLeave={onMouseLeave}
            ref={stageRef}
          >
            <Layer>
              {canvasElements &&
                canvasElements.map((element) => {
                  if ("stroke" in element) {
                    return (
                      <Line
                        key={element.id}
                        points={element.points}
                        stroke={element.stroke}
                        strokeWidth={element.strokeWidth}
                        tension={0.5}
                        lineCap="round"
                        lineJoin="round"
                        globalCompositeOperation={
                          element.globalCompositeOperation
                        }
                      />
                    );
                  }
                  if ("src" in element) {
                    return (
                      <EditableImage
                        key={element.id}
                        id={element.id}
                        img={element}
                        addShapeRef={addShapeRef}
                        removeShapeRef={removeShapeRef}
                        isSelected={element.id === canvasSelectedId}
                        onSelect={() => onSelect(element.id)}
                        onTransformEnd={(e: Konva.KonvaEventObject<Event>) =>
                          onTransformEnd(e, element.id)
                        }
                      />
                    );
                  }
                  return null;
                })}
            </Layer>

            {canvasInteractionType === "drawing" && (
              <Layer>
                {canvasCursorPos !== null && (
                  <>
                    <Circle
                      x={canvasCursorPos.x}
                      y={canvasCursorPos.y}
                      radius={canvasBrushSize / 2}
                      stroke="gray"
                    />

                    <Circle
                      x={canvasCursorPos.x}
                      y={canvasCursorPos.y}
                      radius={canvasBrushSize / 2}
                      fill={color}
                    />
                  </>
                )}
              </Layer>
            )}
          </Stage>
        </div>
        <CanvasImgs shapeRefsMeta={shapeRefsMeta} />
      </div>
    </>
  );
}
