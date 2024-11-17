import { ColorChangeHandler, SketchPicker } from "react-color";
import useEditorStore from "../tree-editor/state/useEditorStore";
import { useShallow } from "zustand/react/shallow";
// import memoizedColorSelector from "../tree-editor/state/memoizedColorSelector";
import { useCallback } from "react";

export default function ColorPicker() {
  const { color, setColor, previousSelectedColors } = useEditorStore(
    useShallow((state) => ({
      // color:
      //   memoizedColorSelector(state.colorByGroup, state.model.rows) ??
      //   undefined,
      color: state.color,
      setColor: state.setColor,
      previousSelectedColors: state.previousSelectedColors,
    })),
  );

  const onChangeComplete: ColorChangeHandler = useCallback(
    (color) => {
      setColor(color.hex);
    },
    [setColor],
  );
  return (
    <>
      <SketchPicker
        color={color}
        onChangeComplete={onChangeComplete}
        presetColors={previousSelectedColors}
      />
    </>
  );
}
