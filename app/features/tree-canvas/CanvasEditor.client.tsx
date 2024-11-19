import Konva from "konva";
import { useCallback } from "react";
import { Stage, Layer, Line, Circle } from "react-konva";
import { canvasHeight, canvasWidth } from "../tree-editor/constants";
import useEditorStore, { LineType } from "../tree-editor/state/useEditorStore";
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

export default function CanvasEditor({
  stageRef,
}: {
  stageRef: React.RefObject<Konva.Stage>;
}) {
  // const stageRef = useRef<Konva.Stage>(null);

  const {
    color,
    canvasCursorPos,
    canvasSelectedId,
    setCanvasSelectedId,
    canvasBrushSize,
    canvasElements,
    canvasInteractionType,
  } = useEditorStore(
    useShallow((state) => ({
      addSelectedColor: state.addSelectedColor,

      color: state.color,

      canvasCursorPos: state.canvasCursorPos,
      setCanvasCursorPos: state.setCanvasCursorPos,
      setCanvasIsColorPickerOpen: state.setCanvasIsColorPickerOpen,
      canvasSelectedId: state.canvasSelectedId,
      setCanvasSelectedId: state.setCanvasSelectedId,
      canvasBrushSize: state.canvasBrushSize,
      setCanvasBrushSize: state.setCanvasBrushSize,
      canvasElements: memoizedCreateCanvasElements(
        state.canvasImages,
        state.canvasLines,
      ),
      canvasGlobalCompositeOperation: state.canvasGlobalCompositeOperation,
      setCanvasGlobalCompositeOperation:
        state.setCanvasGlobalCompositeOperation,

      canvasInteractionType: state.canvasInteractionType,
      setCanvasInteractionType: state.setCanvasInteractionType,
    })),
  );

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
                        img={element}
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
      </div>
    </>
  );
}
