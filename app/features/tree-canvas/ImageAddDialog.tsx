import useEditorStore from "../tree-editor/state/useEditorStore";
import { useShallow } from "zustand/shallow";
import GenericDialog from "./GenericDialog";
import { SubmitHandler, useForm } from "react-hook-form";
import Button from "../ui/components/Button";
import { useCallback, useState } from "react";
import { ImageType } from "./EditableImage";
import { v7 } from "uuid";

export interface AddImageFormDataProps {
  imgUrl: string;
}
const initial: AddImageFormDataProps = {
  imgUrl: "/imgs/test_pattern.png",
};

export default function ImageAddDialog() {
  //
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { canvasImages, setCanvasImages } = useEditorStore(
    useShallow((state) => ({
      canvasImages: state.canvasImages,
      setCanvasImages: state.setCanvasImages,
    })),
  );

  const addImage = useCallback(
    async (src: string) => {
      const dimensions = await new Promise<{ w: number; h: number }>(
        (resolve) => {
          const img = new Image();
          img.onload = function () {
            console.log("useHandleExport onload");
            resolve({ w: img.width, h: img.height });
          };
          img.src = src;
        },
      );

      const newImage: ImageType = {
        id: v7(),
        type: "image",
        src,
        x: 50,
        y: 50,
        width: dimensions.w,
        height: dimensions.h,
        rotation: 0,
      };
      setCanvasImages([...canvasImages, newImage]);
    },
    [canvasImages, setCanvasImages],
  );

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<AddImageFormDataProps>({
    defaultValues: initial,
  });

  const onSubmit: SubmitHandler<AddImageFormDataProps> = useCallback(
    async (data) => {
      console.log(data);
      const canvas = document.getElementById(
        "AddImageDialogCanvas",
      ) as HTMLCanvasElement;

      if (canvas) {
        const imgLoader = new Image();
        imgLoader.crossOrigin = "anonymous";
        imgLoader.src = data.imgUrl;
        const dimension = await new Promise<{ h: number; w: number }>(
          (resolve) => {
            imgLoader.onload = function () {
              resolve({ h: imgLoader.height, w: imgLoader.width });
            };
          },
        );
        canvas.height = dimension.h;
        canvas.width = dimension.w;
        const context = canvas.getContext("2d");
        if (context) {
          context.clearRect(0, 0, canvas.width, canvas.height);

          context.drawImage(imgLoader, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL("image/png");

          addImage(dataUrl);
        }
      }
      setIsOpen(false);
    },
    [addImage],
  );

  const onClickClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const onClickOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  return (
    <>
      <GenericDialog
        id="AddImageDialog"
        isOpen={isOpen}
        onClickClose={onClickClose}
      >
        <div className="flex w-screen flex-row bg-gray-700 p-5">
          <div className="w-1/4"></div>
          <div className="flex grow flex-row gap-2">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex grow flex-row gap-2"
            >
              <input
                className="blockrounded-lg grow border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                {...register("imgUrl", { required: true })}
              />
              <Button disabled={isSubmitting} type="submit">
                Submit
              </Button>
            </form>
          </div>
          <div className="w-1/4"></div>
        </div>
      </GenericDialog>
      <Button variant="small" onClick={onClickOpen}>
        Add Img
      </Button>
      <div className="hidden">
        <canvas id="AddImageDialogCanvas"></canvas>
      </div>
    </>
  );
}
