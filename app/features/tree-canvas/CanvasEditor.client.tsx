import Konva from "konva";
import { useRef, useCallback } from "react";
import { Stage, Layer, Line, Circle } from "react-konva";
import Button from "~/features/ui/components/Button";
import { canvasHeight, canvasWidth } from "../tree-editor/constants";
import useEditorStore, { LineType } from "../tree-editor/state/useEditorStore";
import { useShallow } from "zustand/shallow";
import "./assets/canvas.css";
import EditableImage, { ImageType } from "./EditableImage";
import useAddImage from "./hooks/useAddImage";
import useOnMouseDown from "./hooks/useOnMouseDown";
import useOnMouseMove from "./hooks/useOnMouseMove";
import useOnMouseUp from "./hooks/useOnMouseUp";
import useOnTransformEnd from "./hooks/useOnTransformEnd";
import useHandleExport from "./hooks/useHandleExport";
import ColorPickerDialog from "./ColorPickerDialog";
import memoize from "memoize";

const imgUrl =
  "https://images.chesscomfiles.com/uploads/v1/images_users/tiny_mce/petrikeckman/phpE4U0RQ.png";

type CanvasEditorProps = {
  setImgUrl: React.Dispatch<React.SetStateAction<string>>;
};

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
  // return combinedArray.reverse();
  // console.log({ combinedArray });
  // console.log(combinedArray.map((e) => e.id));
  combinedArray.map((element) => {
    console.log(
      `element.id: ${element.id} | type: ${element.type} | ${"globalCompositeOperation" in element ? element?.globalCompositeOperation : null}`,
    );
  });
  return combinedArray;
};

const memoizedCreateCanvasElements = memoize(createCanvasElements, {
  cacheKey: JSON.stringify,
});

export default function CanvasEditor({ setImgUrl }: CanvasEditorProps) {
  const stageRef = useRef<Konva.Stage>(null);

  const {
    color,
    addSelectedColor,
    // canvasLines,
    // canvasImages,
    canvasCursorPos,
    setCanvasCursorPos,
    setCanvasIsColorPickerOpen,
    canvasSelectedId,
    setCanvasSelectedId,
    canvasBrushSize,
    setCanvasBrushSize,
    canvasElements,
    canvasGlobalCompositeOperation,
    setCanvasGlobalCompositeOperation,
    canvasInteractionType,
    setCanvasInteractionType,
  } = useEditorStore(
    useShallow((state) => ({
      addSelectedColor: state.addSelectedColor,

      color: state.color,

      // canvasLines: state.canvasLines,

      // canvasImages: state.canvasImages,
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

  // Function to add an image
  const addImage = useAddImage();

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

  const onMouseLeave = useCallback(() => {
    setCanvasCursorPos(null);
  }, [setCanvasCursorPos]);

  // Select an image
  const onSelect = useCallback(
    (id: string) => {
      console.log(`onSelectId: ${id}`);
      setCanvasSelectedId(id);
    },
    [setCanvasSelectedId],
  );

  const handleExport = useHandleExport({
    setImgUrl,
    stageRef,
  });

  const onClickColorOpen = useCallback(() => {
    setCanvasIsColorPickerOpen(true);
  }, [setCanvasIsColorPickerOpen]);

  const onClickColorClose = useCallback(() => {
    setCanvasIsColorPickerOpen(false);
    if (color) {
      addSelectedColor(color);
    }
  }, [addSelectedColor, color, setCanvasIsColorPickerOpen]);

  return (
    <>
      <ColorPickerDialog onClickColorClose={onClickColorClose} />
      <div>
        <div className="mt-1 flex flex-row gap-1 pl-1">
          <Button
            variant="small"
            selected={canvasInteractionType === "selecting"}
            onClick={() => setCanvasInteractionType("selecting")}
          >
            <span className="mat-tw mat-icon material-icons mat-icon-no-color">
              pan_tool_alt
            </span>
          </Button>
          <Button
            variant="small"
            selected={
              canvasGlobalCompositeOperation === "source-over" &&
              canvasInteractionType === "drawing"
            }
            onClick={() => {
              setCanvasInteractionType("drawing");
              setCanvasGlobalCompositeOperation("source-over");
              setCanvasSelectedId(null);
            }}
          >
            <span className="mat-tw mat-icon material-icons mat-icon-no-color">
              brush
            </span>
          </Button>

          <Button
            variant="small"
            selected={
              canvasGlobalCompositeOperation === "destination-out" &&
              canvasInteractionType === "drawing"
            }
            onClick={() => {
              setCanvasInteractionType("drawing");
              setCanvasGlobalCompositeOperation("destination-out");
              setCanvasSelectedId(null);
            }}
          >
            <span className="mat-tw mat-icon material-icons mat-icon-no-color">
              do_not_disturb_on
            </span>
          </Button>

          <Button variant="small" onClick={onClickColorOpen}>
            Pick Color
            <div
              className="ml-2 inline-block"
              style={{ backgroundColor: color, minWidth: "15px" }}
            >
              &nbsp;
            </div>
          </Button>

          <Button variant="small" onClick={() => addImage(imgUrl)}>
            Add Image
          </Button>

          <label
            htmlFor="canvasBrushSize"
            className="mt-1 block text-sm font-medium text-gray-900 dark:text-white"
          >
            Brush
          </label>
          <input
            type="range"
            min="1"
            max="100"
            value={canvasBrushSize}
            className="slider"
            id="canvasBrushSize"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setCanvasBrushSize(parseInt(event.target.value));
            }}
          />
          <div className="grow"></div>
          <Button selected variant="small" onClick={handleExport}>
            Save
          </Button>
        </div>

        <Stage
          width={canvasWidth}
          height={canvasHeight}
          onMouseDown={onMouseDown}
          onMousemove={onMouseMove}
          onMouseup={onMouseUp}
          onMouseLeave={onMouseLeave}
          ref={stageRef}
          style={{ border: "1px solid blue" }}
        >
          <Layer>
            {canvasElements &&
              canvasElements.map((element) => {
                if ("stroke" in element) {
                  return (
                    // <Layer key={element.id}>
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
                    // </Layer>
                  );
                }
                if ("src" in element) {
                  return (
                    // <Layer key={element.id}>
                    <EditableImage
                      key={element.id}
                      img={element}
                      isSelected={element.id === canvasSelectedId}
                      onSelect={() => onSelect(element.id)}
                      onTransformEnd={(e: Konva.KonvaEventObject<Event>) =>
                        onTransformEnd(e, element.id)
                      }
                    />
                    // </Layer>
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
                    // stroke={color}
                    // opacity={0.5}

                    stroke="gray"
                  />

                  <Circle
                    x={canvasCursorPos.x}
                    y={canvasCursorPos.y}
                    radius={canvasBrushSize / 2}
                    fill={color}
                    // opacity={0.5}
                  />
                </>
              )}
            </Layer>
          )}
        </Stage>
      </div>
    </>
  );
}
