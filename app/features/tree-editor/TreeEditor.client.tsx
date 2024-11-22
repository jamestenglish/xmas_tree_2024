import TreeViewer from "../tree-viewer/TreeViewer";
import { useRef } from "react";
import CanvasEditor from "../tree-canvas/CanvasEditor.client";
import { canvasHeight, canvasWidth } from "./constants";
import TimelineComponent from "../tree-timeline/TimelineComponent.client";
import useEditorStore, { CanvasExport } from "./state/useEditorStore";
import { useShallow } from "zustand/react/shallow";
import ColorPicker from "../tree-canvas/ColorPicker.client";
import Konva from "konva";

function TimelineExportDebugRow({
  canvasExports,
}: {
  canvasExports: CanvasExport[] | null;
}) {
  return (
    <div className="flex max-h-64 flex-row gap-2">
      {canvasExports &&
        canvasExports.map((canvasExport, index) => (
          <img
            className="object-contain"
            key={index}
            src={canvasExport.canvasCylinderImgUrl}
            alt="foo"
          />
        ))}
    </div>
  );
}

function TimelineExportStateDebugger() {
  //

  const { canvasExports, attributesByGroup } = useEditorStore(
    useShallow((state) => ({
      canvasExports: state.canvasExports,
      attributesByGroup: state.attributesByGroup,
    })),
  );

  // TODO JTE here use memo
  return (
    <>
      <TimelineExportDebugRow canvasExports={canvasExports} />

      <div className="flex flex-row gap-2">
        {attributesByGroup &&
          Object.keys(attributesByGroup).map((key, j) => {
            const { canvasExports } = attributesByGroup[key];

            return (
              <TimelineExportDebugRow key={j} canvasExports={canvasExports} />
            );
          })}
      </div>
    </>
  );
}

export default function TreeEditor() {
  const { selectedGroupType, timelineSelectedGroupId } = useEditorStore(
    useShallow((state) => ({
      selectedGroupType: state.timelineSelectedGroupId ? "canvas" : "none",

      timelineSelectedGroupId: state.timelineSelectedGroupId,
    })),
  );

  const testCanvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<Konva.Stage>(null);

  return (
    <>
      {" "}
      <div className="app-container">
        <div className="tmp-main">
          <div className="content">
            <div className="p-6">
              <div className="grid grid-cols-2 gap-2">
                <TreeViewer />

                <div
                  style={{
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
      <div className="flex max-h-64 flex-row gap-2">
        <canvas
          id="testCanvas"
          className="object-contain"
          ref={testCanvasRef}
          width={canvasWidth}
          height={canvasHeight}
        />
        <canvas id="testCanvas2" className="object-contain" />
      </div>
      <div className="hidden max-h-64">
        <img className="object-contain" id="testImg" alt="foo" />
      </div>
      <TimelineExportStateDebugger />
    </>
  );
}
