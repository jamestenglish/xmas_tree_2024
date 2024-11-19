import {
  FormProvider,
  SubmitHandler,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import Button from "../ui/components/Button";
import CodeEditor from "@uiw/react-textarea-code-editor";
import { ImageType, ImageTypeAnimationValues } from "./EditableImage";
import { forwardRef, TextareaHTMLAttributes, useCallback } from "react";
import useEditorStore from "../tree-editor/state/useEditorStore";
import { useShallow } from "zustand/shallow";
import JSON5 from "json5";
import { ShapeRefMeta } from "./CanvasEditor.client";
import { animate } from "motion";

interface ImageTypeForm extends ImageType {
  animationOptionsString?: string;
}

const animationOptionsStringDefault = `{
  ease: "linear"
}
`;

const CodeTextArea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>((props: TextareaHTMLAttributes<HTMLTextAreaElement>, ref) => {
  return (
    <CodeEditor
      ref={ref}
      language="js"
      //   placeholder="Please enter JS code."
      padding={15}
      style={{
        backgroundColor: "#f5f5f5",
        fontFamily:
          "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
      }}
      value={animationOptionsStringDefault}
      {...props}
    />
  );
});
CodeTextArea.displayName = "CodeTextArea";

function FormInputs({
  prepend = "",
  ButtonElement,
}: {
  prepend?: string;
  ButtonElement: JSX.Element;
}) {
  const { register } = useFormContext();

  const props = register(`${prepend}width`, { required: true });
  console.log({ otherProps: props });
  return (
    <div className="flex flex-row gap-2">
      <label className="font-small text-sm text-gray-900 dark:text-white">
        Width:
        <input
          className="blockrounded-sm ml-1 w-12 border border-gray-300 bg-gray-50 p-0.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          {...props}
        />
      </label>
      <label className="font-small text-sm text-gray-900 dark:text-white">
        Height:
        <input
          className="blockrounded-sm ml-1 w-12 border border-gray-300 bg-gray-50 p-0.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          {...register(`${prepend}height`, { required: true })}
        />
      </label>

      <label className="font-small text-sm text-gray-900 dark:text-white">
        x:
        <input
          className="blockrounded-sm ml-1 w-12 border border-gray-300 bg-gray-50 p-0.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          {...register(`${prepend}x`, { required: true })}
        />
      </label>

      <label className="font-small text-sm text-gray-900 dark:text-white">
        y:
        <input
          className="blockrounded-sm ml-1 w-12 border border-gray-300 bg-gray-50 p-0.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          {...register(`${prepend}y`, { required: true })}
        />
      </label>

      <label className="font-small text-sm text-gray-900 dark:text-white">
        rotation:
        <input
          className="blockrounded-sm ml-1 w-12 border border-gray-300 bg-gray-50 p-0.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          {...register(`${prepend}rotation`, { required: true })}
        />
      </label>
      {/* <Button variant="small" onClick={() => append(restImage)}>
        Add Animation Keyframe
      </Button> */}
      {ButtonElement}
    </div>
  );
}
type ImageKeyframeType<T> = {
  [K in keyof T]: T[K][];
};

function CanvasImageFormInner({
  selectedImage,
  setSelectedImage,
  shapeRefsMeta,
}: {
  selectedImage: ImageType | null;
  setSelectedImage: React.Dispatch<React.SetStateAction<ImageTypeForm | null>>;
  shapeRefsMeta: ShapeRefMeta[];
}) {
  //
  const { register, handleSubmit, control, watch } =
    useFormContext<ImageTypeForm>();

  const {
    animationOptions: _animationOptions,
    animationKeyFrames: _animationKeyFrames,
    ...restImage
  } = selectedImage ?? ({} as ImageType);

  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormProvider)
    name: "animationKeyFrames", // unique name for your Field Array
  });

  const { canvasImages, setCanvasImages } = useEditorStore(
    useShallow((state) => ({
      canvasImages: state.canvasImages,
      setCanvasImages: state.setCanvasImages,
    })),
  );

  const form = watch();
  const onClickAnimationPlay = () => {
    const { animationOptionsString } = form;
    console.log({ animationOptionsString });
    if (
      animationOptionsString &&
      animationOptionsString.trim().length > 0 &&
      selectedImage
    ) {
      // TODO JTE error handling
      const options = JSON5.parse(animationOptionsString);
      console.log({ options });
      const {
        animationKeyFrames,
        animationOptions: _animationOptions,
        ...initialState
      } = form;
      const shapeRefMeta = shapeRefsMeta.find(
        (sr) => sr.id === selectedImage.id,
      );

      if (shapeRefMeta && shapeRefMeta?.ref?.current && animationKeyFrames) {
        const foo = { ...initialState };
        const combined = [{ ...initialState }, ...animationKeyFrames];

        const init: ImageKeyframeType<ImageTypeAnimationValues> = {
          x: [],
          y: [],
          height: [],
          width: [],
          rotation: [],
        };

        const keyframes = combined.reduce((acc, keyframe) => {
          const keys = Object.keys(
            keyframe,
          ) as (keyof ImageTypeAnimationValues)[];
          keys.forEach((key) => {
            const value = keyframe[key];
            const prev = acc[key];
            if (!prev) {
              return acc;
            }
            (acc[key] as number[]) = [...prev, Number(value)];
          });
          return acc;
        }, init);
        console.log({ keyframes });
        animate(
          foo,
          {
            ...keyframes,
          },
          {
            duration: 5,
            // repeat: Infinity,
            onUpdate: (...latest) => {
              console.log(latest, foo);
              shapeRefMeta.ref.current?.position(foo);
              shapeRefMeta.ref.current?.rotation(foo.rotation);
              shapeRefMeta.ref.current?.height(foo.height);
              shapeRefMeta.ref.current?.width(foo.width);
            },
            ease: "linear",
          },
        );

        console.log("click");
      }
    }
  };

  const onSubmit = useCallback<SubmitHandler<ImageTypeForm>>(
    (data) => {
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
    },
    [canvasImages, setCanvasImages, setSelectedImage],
  );

  if (!selectedImage) {
    return <></>;
  }

  const isAnimation = fields && fields.length > 0;
  // TODO JTE animate: https://motion.dev/docs/animate

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <FormInputs
          ButtonElement={
            <Button variant="small" onClick={() => append(restImage)}>
              Add Animation Keyframe
            </Button>
          }
        />

        {fields.map((field, i) => {
          return (
            <FormInputs
              key={field.id}
              ButtonElement={
                <Button variant="small" onClick={() => remove(i)}>
                  Delete
                </Button>
              }
              prepend={`animationKeyFrames.${i}.`}
            />
          );
        })}
        {isAnimation && (
          <CodeTextArea {...register("animationOptionsString")} />
        )}
        <div className="flex flex-row gap-2">
          {isAnimation && (
            <Button onClick={onClickAnimationPlay} variant="small">
              Play/Pause
            </Button>
          )}
          <Button variant="small" type="submit">
            Submit
          </Button>
        </div>
      </form>
    </>
  );
}

export default function CanvasImageForm({
  selectedImage,
  setSelectedImage,
  shapeRefsMeta,
}: {
  selectedImage: ImageType | null;
  setSelectedImage: React.Dispatch<React.SetStateAction<ImageTypeForm | null>>;
  shapeRefsMeta: ShapeRefMeta[];
}) {
  const values = selectedImage
    ? {
        ...selectedImage,
        animationOptionsString: animationOptionsStringDefault,
      }
    : undefined;
  console.log({ values });
  const methods = useForm<ImageTypeForm>({
    values,
    defaultValues: values,
  });

  return (
    <FormProvider {...methods}>
      <CanvasImageFormInner
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        shapeRefsMeta={shapeRefsMeta}
      />
    </FormProvider>
  );
}
