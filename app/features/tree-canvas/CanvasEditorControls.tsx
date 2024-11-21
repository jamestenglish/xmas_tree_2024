import { useCallback, useEffect } from "react";
import Button from "~/features/ui/components/Button";
import useEditorStore from "../tree-editor/state/useEditorStore";
import { useShallow } from "zustand/shallow";

import useHandleExport from "./hooks/useHandleExport";
import ColorPickerDialog from "./ColorPickerDialog";
import { Stage } from "konva/lib/Stage";
import ImageAddDialog from "./ImageAddDialog";
import { ShapeRefMeta } from "./CanvasEditor.client";

// const imgUrl =
//   "https://images.chesscomfiles.com/uploads/v1/images_users/tiny_mce/petrikeckman/phpE4U0RQ.png";

export default function CanvasEditorControls({
  stageRef,
  shapeRefsMeta,
}: {
  stageRef: React.RefObject<Stage>;
  shapeRefsMeta: ShapeRefMeta[];
}) {
  //

  const {
    color,

    setCanvasBrushSize,
    canvasBrushSize,
    setCanvasIsColorPickerOpen,
    addSelectedColor,
    canvasGlobalCompositeOperation,
    setCanvasGlobalCompositeOperation,
    canvasInteractionType,
    setCanvasInteractionType,
    setCanvasSelectedId,

    timelineActionId,
  } = useEditorStore(
    useShallow((state) => ({
      color: state.color,

      addSelectedColor: state.addSelectedColor,
      setCanvasIsColorPickerOpen: state.setCanvasIsColorPickerOpen,
      canvasBrushSize: state.canvasBrushSize,
      setCanvasBrushSize: state.setCanvasBrushSize,
      canvasGlobalCompositeOperation: state.canvasGlobalCompositeOperation,
      setCanvasGlobalCompositeOperation:
        state.setCanvasGlobalCompositeOperation,
      canvasInteractionType: state.canvasInteractionType,
      setCanvasInteractionType: state.setCanvasInteractionType,
      setCanvasSelectedId: state.setCanvasSelectedId,

      timelineActionId: state.timelineActionId,
    })),
  );

  const handleExport = useHandleExport({
    stageRef,
    shapeRefsMeta,
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

  // this is ugly but I can't store the ref in the store
  useEffect(() => {
    // TODO JTE would be nice to remove this
    if (timelineActionId !== null) {
      handleExport();
    }
  }, [handleExport, timelineActionId]);

  return (
    <>
      <ColorPickerDialog onClickColorClose={onClickColorClose} />
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

        <ImageAddDialog />

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
    </>
  );
}
