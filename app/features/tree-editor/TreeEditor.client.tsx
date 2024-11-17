import { useForm } from "react-hook-form";
import TreeViewer, { CylinderFormDataProps } from "../tree-viewer/TreeViewer";
import { useEffect, useRef, useState } from "react";
import CanvasEditor from "../tree-canvas/CanvasEditor.client";
import { canvasHeight, canvasWidth } from "./constants";
import TimelineComponent from "../tree-timeline/TimelineComponent.client";
import useEditorStore from "./state/useEditorStore";
import { useShallow } from "zustand/react/shallow";
import ColorPicker from "../tree-canvas/ColorPicker.client";
import memoizedCanvasStateSelector from "./state/memoizedCanvasInteractionModeSelector";

const BLINK_SPEED = 300;

export default function TreeEditor() {
  const { color, toggleBlinkState, selectedLightIds, selectedGroupType } =
    useEditorStore(
      useShallow((state) => ({
        toggleBlinkState: state.toggleBlinkState,

        selectedLightIds: state.selectedLightIds,
        selectedGroupType: memoizedCanvasStateSelector(state.model.rows),

        color: state.color,
      })),
    );
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setInterval(() => {
      // toggleBlinkState();
    }, BLINK_SPEED);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [toggleBlinkState]);

  const initial: CylinderFormDataProps = {
    cylinderOpacity: 0.3,
  };

  const { register, watch } = useForm<CylinderFormDataProps>({
    defaultValues: initial,
  });

  const cylinderOpacity = watch("cylinderOpacity") ?? 0.3;

  const testCanvasRef = useRef<HTMLCanvasElement>(null);
  const [imgUrl, setImgUrl] = useState<string>(
    "https://images.chesscomfiles.com/uploads/v1/images_users/tiny_mce/petrikeckman/phpE4U0RQ.png",
  );

  return (
    <>
      {" "}
      <div className="app-container">
        <div className="tmp-main">
          <div className="content">
            <div className="p-6">
              <div className="mb-6 grid gap-6 md:grid-cols-6">
                <div>
                  <label
                    htmlFor="first_name"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Opacity
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    {...register("cylinderOpacity")}
                  />
                </div>
                <div>
                  {" "}
                  {JSON.stringify(selectedLightIds, null, 2)}{" "}
                  {JSON.stringify(color, null, 2)}
                </div>
              </div>
              {/* <div className="flex flex-row gap-2"> */}
              <div className="grid grid-cols-2 gap-2">
                <TreeViewer imgUrl={imgUrl} cylinderOpacity={cylinderOpacity} />

                <div
                  style={{
                    // width: "640px",
                    // height: "480px",
                    border: "1px solid black",
                  }}
                >
                  {selectedGroupType === "canvas" && (
                    <CanvasEditor setImgUrl={setImgUrl} />
                  )}
                  {selectedGroupType === "light" && <ColorPicker />}
                  {selectedGroupType === "none" && (
                    <div>No timeline selection</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-6">
          <TimelineComponent></TimelineComponent>
        </div>
      </div>
      <div className="flex flex-row gap-2">
        <canvas
          id="testCanvas"
          ref={testCanvasRef}
          width={canvasWidth}
          height={canvasHeight}
          style={{
            width: `${canvasWidth}px`,
            height: `${canvasHeight}px`,
          }}
        />
        <canvas
          id="testCanvas2"
          style={{
            width: `${canvasWidth}px`,
            height: `${canvasHeight}px`,
          }}
        />
      </div>
      <img id="testImg" alt="foo" />
    </>
  );
}
