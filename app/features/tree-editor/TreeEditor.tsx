import { useForm } from "react-hook-form";
import TreeViewer, { CylinderFormDataProps } from "../tree-viewer/TreeViewer";
import { useRef, useState } from "react";
import CanvasEditor from "../tree-canvas/CanvasEditor.client";
import { canvasHeight, canvasWidth } from "../tree-editor/constants";
import TimelineComponent from "../tree-timeline/TimelineComponent.client";

export default function TreeEditor() {
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
                    type="number"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    placeholder="100"
                    required
                    {...register("cylinderOpacity")}
                  />
                </div>
              </div>
              <div className="flex flex-row gap-2">
                <TreeViewer imgUrl={imgUrl} cylinderOpacity={cylinderOpacity} />
                <div
                  style={{
                    // width: "640px",
                    // height: "480px",
                    border: "1px solid black",
                  }}
                >
                  <CanvasEditor setImgUrl={setImgUrl} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <TimelineComponent></TimelineComponent>
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
