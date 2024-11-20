import TreeViewer from "../tree-viewer/TreeViewer";
import { useRef } from "react";
import CanvasEditor from "../tree-canvas/CanvasEditor.client";
import { canvasHeight, canvasWidth } from "./constants";
import TimelineComponent from "../tree-timeline/TimelineComponent.client";
import useEditorStore from "./state/useEditorStore";
import { useShallow } from "zustand/react/shallow";
import ColorPicker from "../tree-canvas/ColorPicker.client";
// import memoizedCanvasStateSelector from "./state/memoizedCanvasInteractionModeSelector";
import Konva from "konva";

// const BLINK_SPEED = 300;

function TimelineExportStateDebugger() {
  //

  const { canvasCylinderImgUrls } = useEditorStore(
    useShallow((state) => ({
      canvasCylinderImgUrls: state.canvasCylinderImgUrls,
    })),
  );

  // TODO JTE here use memo
  return (
    <>
      <div className="flex flex-row gap-2">
        {canvasCylinderImgUrls &&
          canvasCylinderImgUrls.map((canvasCylinderImgUrl, index) => (
            <img key={index} src={canvasCylinderImgUrl} alt="foo" />
          ))}
      </div>
    </>
  );
}

export default function TreeEditor() {
  const { selectedGroupType, timelineSelectedGroupId } = useEditorStore(
    useShallow((state) => ({
      selectedGroupType: state.timelineSelectedGroupId ? "canvas" : "none",
      // there isn't a light type anymore
      // selectedGroupType: memoizedCanvasStateSelector(state.timelineModel.rows),
      timelineSelectedGroupId: state.timelineSelectedGroupId,
    })),
  );
  // const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // useEffect(() => {
  //   if (timeoutRef.current) {
  //     clearTimeout(timeoutRef.current);
  //   }
  //   timeoutRef.current = setInterval(() => {
  //     // toggleTreeViewerBlinkState();
  //   }, BLINK_SPEED);

  //   return () => {
  //     if (timeoutRef.current) {
  //       clearTimeout(timeoutRef.current);
  //     }
  //   };
  // }, [toggleTreeViewerBlinkState]);

  // const initial: CylinderFormDataProps = {
  //   cylinderOpacity: 0.3,
  // };

  // const { register, watch } = useForm<CylinderFormDataProps>({
  //   defaultValues: initial,
  // });

  // const cylinderOpacity = watch("cylinderOpacity") ?? 0.3;

  const testCanvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<Konva.Stage>(null);

  return (
    <>
      {" "}
      <div className="app-container">
        <div className="tmp-main">
          <div className="content">
            <div className="p-6">
              {/* <div className="mb-6 grid gap-6 md:grid-cols-6">
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
                  {JSON.stringify(treeViewerSelectedLightIds, null, 2)}{" "}
                  {JSON.stringify(color, null, 2)}
                </div>
              </div> */}
              {/* <div className="flex flex-row gap-2"> */}
              <div className="grid grid-cols-2 gap-2">
                <TreeViewer />

                <div
                  style={{
                    // width: "640px",
                    // height: "480px",
                    border: "1px solid black",
                  }}
                >
                  {timelineSelectedGroupId ? (
                    <>
                      {selectedGroupType === "canvas" && (
                        <CanvasEditor stageRef={stageRef} />
                      )}
                      {selectedGroupType === "light" && <ColorPicker />}
                      {selectedGroupType === "none" && (
                        <div>No timeline selection</div>
                      )}
                    </>
                  ) : (
                    <>
                      <div>Select a group in the timeline</div>
                    </>
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
      <TimelineExportStateDebugger />
    </>
  );
}
