/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import Konva from "konva";
import { useCallback, useState } from "react";
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
import { SubmitHandler, useForm } from "react-hook-form";
import Button from "../ui/components/Button";

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

function CanvasForm({
  selectedImage,
  setSelectedImage,
}: {
  selectedImage: ImageType | null;
  setSelectedImage: React.Dispatch<React.SetStateAction<ImageType | null>>;
}) {
  //
  const { register, handleSubmit } = useForm<ImageType>({
    values: selectedImage ?? undefined,
    defaultValues: selectedImage ?? undefined,
  });

  const { canvasImages, setCanvasImages } = useEditorStore(
    useShallow((state) => ({
      canvasImages: state.canvasImages,
      setCanvasImages: state.setCanvasImages,
    })),
  );

  const onSubmit: SubmitHandler<ImageType> = (data) => {
    console.log(data);
    const { id } = data;
    const index = canvasImages.findIndex(({ id: idIn }) => idIn === id);
    if (index >= 0) {
      const newCanvasImages = [
        ...canvasImages.slice(0, index),
        data,
        ...canvasImages.slice(index + 1),
      ];
      setCanvasImages(newCanvasImages);
    }
    setSelectedImage(null);
    // setIsOpen(false);
    // addImage(data.imgUrl);
  };

  if (!selectedImage) {
    return <></>;
  }

  // TODO JTE animate: https://motion.dev/docs/animate
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex w-screen flex-row p-1">
          <div className="flex flex-row gap-2">
            <label
              htmlFor="width"
              className="font-small text-sm text-gray-900 dark:text-white"
            >
              Width:
              <input
                className="blockrounded-sm ml-1 w-12 border border-gray-300 bg-gray-50 p-0.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                {...register("width", { required: true })}
              />
            </label>
            <label
              htmlFor="height"
              className="font-small text-sm text-gray-900 dark:text-white"
            >
              Height:
              <input
                className="blockrounded-sm ml-1 w-12 border border-gray-300 bg-gray-50 p-0.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                {...register("height", { required: true })}
              />
            </label>

            <label
              htmlFor="height"
              className="font-small text-sm text-gray-900 dark:text-white"
            >
              x:
              <input
                className="blockrounded-sm ml-1 w-12 border border-gray-300 bg-gray-50 p-0.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                {...register("x", { required: true })}
              />
            </label>

            <label
              htmlFor="height"
              className="font-small text-sm text-gray-900 dark:text-white"
            >
              y:
              <input
                className="blockrounded-sm ml-1 w-12 border border-gray-300 bg-gray-50 p-0.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                {...register("y", { required: true })}
              />
            </label>

            <label
              htmlFor="height"
              className="font-small text-sm text-gray-900 dark:text-white"
            >
              rotation:
              <input
                className="blockrounded-sm ml-1 w-12 border border-gray-300 bg-gray-50 p-0.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                {...register("rotation", { required: true })}
              />
            </label>

            <Button variant="small" type="submit">
              Submit
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}

function CanvasImgs() {
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
      <div className="mt-2 flex max-h-16 flex-row gap-2">
        <CanvasForm
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
        />
      </div>
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
                className="row-0 col-0 bg-white"
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
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

export default function CanvasEditor({
  stageRef,
}: {
  stageRef: React.RefObject<Konva.Stage>;
}) {
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
        <CanvasImgs />
      </div>
    </>
  );
}
