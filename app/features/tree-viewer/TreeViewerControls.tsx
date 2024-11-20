import { useForm } from "react-hook-form";
import { useShallow } from "zustand/shallow";
import { CylinderFormDataProps } from "./TreeViewer";
import { useEffect } from "react";
import useEditorStore from "../tree-editor/state/useEditorStore";

export default function TreeViewerControls() {
  const { setTreeViewerCylinderOpacity } = useEditorStore(
    useShallow((state) => ({
      setTreeViewerCylinderOpacity: state.setTreeViewerCylinderOpacity,
    })),
  );

  const initial: CylinderFormDataProps = {
    cylinderOpacity: 0.3,
  };

  const { register, watch } = useForm<CylinderFormDataProps>({
    defaultValues: initial,
  });

  const cylinderOpacity = watch("cylinderOpacity") ?? 0.3;

  useEffect(() => {
    setTreeViewerCylinderOpacity(cylinderOpacity);
  }, [cylinderOpacity, setTreeViewerCylinderOpacity]);

  return (
    <>
      <div className="mt-1 flex flex-row gap-1 pl-1">
        <label
          htmlFor="cylinderOpacity"
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
    </>
  );
}
