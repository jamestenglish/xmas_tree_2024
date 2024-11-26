import {
  ReactSketchCanvas,
  ReactSketchCanvasRef,
  type CanvasPath,
} from "react-sketch-canvas";
import { useCallback, useEffect, useRef, useState } from "react";
import Button from "~/features/ui/components/Button";
import {
  HomepageDataType,
  loader,
  PositionPathsType,
  PositionsType,
} from "~/routes/_index";
import { useFetcher, useLoaderData } from "@remix-run/react";

interface useInitializeProps {
  canvasRef: React.RefObject<ReactSketchCanvasRef>;
  imgUrl?: string;
  pathsStorage: CanvasPath[];
}

const useInitialize = ({
  canvasRef,
  imgUrl,
  pathsStorage,
}: useInitializeProps) => {
  const [initialized, setInitialized] = useState<boolean>(false);

  useEffect(() => {
    if (!initialized && imgUrl) {
      if (canvasRef.current) {
        canvasRef.current.loadPaths(pathsStorage);

        setInitialized(true);
      }
    }
  }, [initialized, pathsStorage, imgUrl, canvasRef]);
};

const styles = {};

const defaultPathsStorage = [] as CanvasPath[];

interface CanvasProps {
  imgUrl?: string;
  height?: number;
  width?: number;
  deviceId: string;
  position: PositionsType;
  positionPaths: PositionPathsType;
}
export default function Canvas({
  deviceId,
  imgUrl,
  width,
  height,
  position,
  positionPaths,
}: CanvasProps) {
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const [eraseMode, setEraseMode] = useState<boolean>(false);
  const [strokeWidth, setStrokeWidth] = useState<number>(40);
  const [doShowBackground, setDoShowBackground] = useState<boolean>(true);
  const [currentPositionPaths, setCurrentPositionPaths] =
    useState<PositionPathsType>(positionPaths);

  const loaderData = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  // const [pathsStorage, setPathsStorage] = useLocalStorageInternal<CanvasPath[]>(
  //   `paths-${position}`,
  //   [],
  // );

  // const { homepagePaths, setHomepagePaths, setHomepageMasks } =
  //   useHomepageStore(
  //     useShallow((state) => ({
  //       homepagePaths: state.homepagePaths,
  //       setHomepagePaths: state.setHomepagePaths,
  //       setHomepageMasks: state.setHomepageMasks,
  //     })),
  //   );

  const setPaths = useCallback(
    (paths: CanvasPath[]) => {
      setCurrentPositionPaths((prev) => {
        return {
          ...prev,
          [position]: paths,
        };
      });
    },
    [position],
  );

  const pathsStorage = currentPositionPaths[position] ?? defaultPathsStorage;

  useInitialize({ canvasRef, imgUrl, pathsStorage });

  const handleEraserClick = useCallback(() => {
    setEraseMode(true);
    canvasRef.current?.eraseMode(true);
  }, []);

  const handlePenClick = useCallback(() => {
    setEraseMode(false);
    canvasRef.current?.eraseMode(false);
  }, []);

  const handleUndoClick = useCallback(() => {
    canvasRef.current?.undo();
  }, []);

  const handleRedoClick = useCallback(() => {
    canvasRef.current?.redo();
  }, []);

  const handleClearClick = useCallback(() => {
    canvasRef.current?.clearCanvas();
    setPaths([]);
  }, [setPaths]);

  const handlePlus = useCallback(() => {
    setStrokeWidth((prev) => prev + 5);
  }, []);

  const handleMinus = useCallback(() => {
    setStrokeWidth((prev) => Math.max(1, prev - 5));
  }, []);

  const handleToggle = useCallback(() => {
    setDoShowBackground((prev) => !prev);
  }, []);

  const handleSave = () => {
    const save = async () => {
      if (canvasRef.current && width && height) {
        const paths = await canvasRef.current.exportPaths();
        setPaths(paths);

        const canvas = document.getElementById(
          `maskCanvas-${deviceId}`,
        ) as HTMLCanvasElement;
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d");
        const maskImg = await canvasRef.current.exportImage("png");

        await new Promise((resolve) => {
          const img = new Image();
          img.onload = function () {
            context?.drawImage(img, 0, 0, width, height); // Or at whatever offset you like
            resolve(null);
          };
          img.src = maskImg;
        });

        const imageData = context?.getImageData(0, 0, width, height);
        const maskArray = new Array<boolean>(width * height);
        maskArray.fill(false);
        if (imageData) {
          for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
              const r = imageData.data[(y * width + x) * 4];
              const g = imageData.data[(y * width + x) * 4 + 1];
              const b = imageData.data[(y * width + x) * 4 + 2];

              if (r === 255 && g === 0 && b === 0) {
                maskArray[y * width + x] = true;
              }
            }
          }
        }
        const newData: HomepageDataType = {
          ...loaderData,
          intent: "state",
          positionMasks: {
            ...loaderData.positionMasks,
            [position]: maskArray,
          },
          positionPaths: currentPositionPaths,
        };
        fetcher.submit(newData, {
          method: "POST",
          encType: "application/json",
        });
      }
    };
    save();
  };

  if (!imgUrl || !width || !height) {
    return <></>;
  }

  return (
    <>
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
      <div>
        <div className="flex flex-col gap-2">
          <Button type="button" disabled={!eraseMode} onClick={handlePenClick}>
            Pen
          </Button>

          <Button
            type="button"
            disabled={eraseMode}
            onClick={handleEraserClick}
          >
            Eraser
          </Button>

          <Button type="button" onClick={handleUndoClick}>
            Undo
          </Button>
          <Button type="button" onClick={handleRedoClick}>
            Redo
          </Button>
          <Button type="button" onClick={handleClearClick}>
            Clear
          </Button>

          <Button type="button" onClick={handlePlus}>
            +
          </Button>
          <Button type="button" onClick={handleMinus}>
            -
          </Button>
          <Button type="button" onClick={handleToggle}>
            Toggle
          </Button>
          <Button type="button" onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
      <canvas
        id={`maskCanvas-${deviceId}`}
        style={{ width: `${width}px`, height: `${height}px` }}
      />
    </>
  );
}
