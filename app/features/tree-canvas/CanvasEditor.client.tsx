import Konva from "konva";
import { useRef, useCallback } from "react";
import { Stage, Layer, Line, Circle } from "react-konva";
import Button from "~/features/ui/components/Button";
import { canvasHeight, canvasWidth } from "../tree-editor/constants";
import useEditorStore from "../tree-editor/state/useEditorStore";
import { useShallow } from "zustand/shallow";
import "./assets/canvas.css";
import EditableImage from "./EditableImage";
import useAddImage from "./hooks/useAddImage";
import useOnMouseDown from "./hooks/useOnMouseDown";
import useOnMouseMove from "./hooks/useOnMouseMove";
import useOnMouseUp from "./hooks/useOnMouseUp";
import useOnTransformEnd from "./hooks/useOnTransformEnd";
import useHandleExport from "./hooks/useHandleExport";
import ColorPickerDialog from "./ColorPickerDialog";
const imgUrl =
  "https://images.chesscomfiles.com/uploads/v1/images_users/tiny_mce/petrikeckman/phpE4U0RQ.png";

type CanvasEditorProps = {
  setImgUrl: React.Dispatch<React.SetStateAction<string>>;
};

export default function CanvasEditor({ setImgUrl }: CanvasEditorProps) {
  const stageRef = useRef<Konva.Stage>(null);

  const {
    color,
    addSelectedColor,
    canvasLines,
    canvasImages,
    canvasCursorPos,
    setCanvasCursorPos,
    setCanvasIsColorPickerOpen,
    canvasSelectedId,
    setCanvasSelectedId,
    canvasBrushSize,
    setCanvasBrushSize,
  } = useEditorStore(
    useShallow((state) => ({
      addSelectedColor: state.addSelectedColor,
      // color:
      //   memoizedColorSelector(state.colorByGroup, state.model.rows) ??
      //   undefined,
      color: state.color,
      // canvasLines: memoizedAttributeByGroupSelector<Array<LineType>>(
      //   state.model.rows,
      //   state.canvasLinesByGroup,
      // ),
      canvasLines: state.canvasLines,
      // canvasImages: memoizedAttributeByGroupSelector<Array<ImageType>>(
      //   state.model.rows,
      //   state.canvasImagesByGroup,
      // ),
      canvasImages: state.canvasImages,
      canvasCursorPos: state.canvasCursorPos,
      setCanvasCursorPos: state.setCanvasCursorPos,
      setCanvasIsColorPickerOpen: state.setCanvasIsColorPickerOpen,
      canvasSelectedId: state.canvasSelectedId,
      setCanvasSelectedId: state.setCanvasSelectedId,
      canvasBrushSize: state.canvasBrushSize,
      setCanvasBrushSize: state.setCanvasBrushSize,
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
        <div className="mt-1 flex flex-row gap-1">
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
          <Button variant="small" onClick={handleExport}>
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
            {/* Freehand Drawing */}
            {canvasLines &&
              canvasLines.map((line, i) => (
                <Line
                  key={i}
                  points={line.points}
                  stroke={line.stroke}
                  strokeWidth={line.strokeWidth}
                  tension={0.5}
                  lineCap="round"
                  lineJoin="round"
                />
              ))}

            {/* Images */}
            {canvasImages &&
              canvasImages.map((img) => (
                <EditableImage
                  key={img.id}
                  img={img}
                  isSelected={img.id === canvasSelectedId}
                  onSelect={() => onSelect(img.id)}
                  onTransformEnd={(e: Konva.KonvaEventObject<Event>) =>
                    onTransformEnd(e, img.id)
                  }
                />
              ))}
          </Layer>
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
        </Stage>
      </div>
    </>
  );
}
