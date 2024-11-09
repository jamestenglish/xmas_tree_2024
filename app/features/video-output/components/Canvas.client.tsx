import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";
import { LegacyRef, useRef, useState } from "react";

const styles = {
  border: "0.0625rem solid #9c9c9c",
  borderRadius: "0.25rem",
};

interface ICanvas {
  imgUrl?: string;
  height?: number;
  width?: number;
}
export default function Canvas({ imgUrl, width, height }: ICanvas) {
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const [eraseMode, setEraseMode] = useState<boolean>(false);
  const [strokeWidth, setStrokeWidth] = useState<number>(10);
  const [doShowBackground, setDoShowBackground] = useState<boolean>(true);
  console.log({ width, height });

  const handleEraserClick = () => {
    setEraseMode(true);
    canvasRef.current?.eraseMode(true);
  };

  const handlePenClick = () => {
    setEraseMode(false);
    canvasRef.current?.eraseMode(false);
  };

  const handleUndoClick = () => {
    canvasRef.current?.undo();
  };

  const handleRedoClick = () => {
    canvasRef.current?.redo();
  };

  const handleClearClick = () => {
    canvasRef.current?.clearCanvas();
  };

  const handleResetClick = () => {
    canvasRef.current?.resetCanvas();
  };

  const handlePlus = () => {
    setStrokeWidth((prev) => prev + 1);
  };

  const handleMinus = () => {
    setStrokeWidth((prev) => Math.max(1, prev - 1));
  };

  const handleToggle = () => {
    setDoShowBackground((prev) => !prev);
  };

  if (!imgUrl || !width || !height) {
    return <></>;
  }

  return (
    <>
      <div className="d-flex align-items-center gap-2">
        <button
          type="button"
          className="btn btn-sm btn-outline-primary"
          disabled={!eraseMode}
          onClick={handlePenClick}
        >
          Pen
        </button>
        <button
          type="button"
          className="btn btn-sm btn-outline-primary"
          disabled={eraseMode}
          onClick={handleEraserClick}
        >
          Eraser
        </button>
        <div className="vr" />
        <button
          type="button"
          className="btn btn-sm btn-outline-primary"
          onClick={handleUndoClick}
        >
          Undo
        </button>
        <button
          type="button"
          className="btn btn-sm btn-outline-primary"
          onClick={handleRedoClick}
        >
          Redo
        </button>
        <button
          type="button"
          className="btn btn-sm btn-outline-primary"
          onClick={handleClearClick}
        >
          Clear
        </button>
        <button
          type="button"
          className="btn btn-sm btn-outline-primary"
          onClick={handleResetClick}
        >
          Reset
        </button>
        <button
          type="button"
          className="btn btn-sm btn-outline-primary"
          onClick={handlePlus}
        >
          +
        </button>
        <button
          type="button"
          className="btn btn-sm btn-outline-primary"
          onClick={handleMinus}
        >
          -
        </button>
        <button
          type="button"
          className="btn btn-sm btn-outline-primary"
          onClick={handleToggle}
        >
          toggle
        </button>
      </div>
      <div style={{ width, height }}>
        <ReactSketchCanvas
          ref={canvasRef}
          style={styles}
          width={`${width}px`}
          height={`${height}px`}
          strokeWidth={strokeWidth}
          strokeColor="red"
          backgroundImage={doShowBackground ? imgUrl : undefined}
        />
      </div>
    </>
  );
}
