import {
  FormProvider,
  SubmitHandler,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import Button from "../ui/components/Button";
import {
  ImageType,
  ImageTypeAnimationValues,
  ImageTypeParent,
} from "./EditableImage";
import { useCallback } from "react";
import useEditorStore from "../tree-editor/state/useEditorStore";
import { useShallow } from "zustand/shallow";
import JSON5 from "json5";
import { ShapeRefMeta } from "./CanvasEditor.client";
import { animate } from "motion";
import CodeTextArea, { animationOptionsStringDefault } from "./CodeTextArea";
import CanvasImageFormInputs from "./CanvasImageFormInputs";
import findAllTimelineObjectsByGroupId from "../tree-editor/state/functions/findAllTimelineObjectsByGroupId";

interface ImageTypeForm extends ImageType {
  animationOptionsString?: string;
}

type ImageKeyframeType<T> = {
  [K in keyof T]: T[K][];
};

type FormDataToKeyFramesArgs = {
  initialState: {
    animationOptionsString?: string;
    currentAnimationFrame?: ImageTypeParent;
    id: string;
    src: string;
    type: string;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
  };
  animationKeyFrames: ImageTypeParent[];
};
const formDataToKeyframes = ({
  initialState,
  animationKeyFrames,
}: FormDataToKeyFramesArgs) => {
  const combined = [{ ...initialState }, ...animationKeyFrames];

  const init: ImageKeyframeType<ImageTypeAnimationValues> = {
    x: [],
    y: [],
    height: [],
    width: [],
    rotation: [],
  };

  const keyframes = combined.reduce((acc, keyframe) => {
    const keys = Object.keys(keyframe) as (keyof ImageTypeAnimationValues)[];
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

  return keyframes;
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
    control,
    name: "animationKeyFrames",
  });

  const {
    timelineSelectedGroupId,
    canvasImages,
    setCanvasImages,
    timelineModel,
  } = useEditorStore(
    useShallow((state) => ({
      canvasImages: state.canvasImages,
      setCanvasImages: state.setCanvasImages,
      timelineModel: state.timelineModel,
      timelineSelectedGroupId: state.timelineSelectedGroupId,
    })),
  );

  const form = watch();
  const onClickAnimationPlay = useCallback(() => {
    const { animationOptionsString } = form;
    console.log({ animationOptionsString });
    if (
      animationOptionsString &&
      animationOptionsString.trim().length > 0 &&
      selectedImage &&
      timelineSelectedGroupId
    ) {
      // TODO JTE error handling
      const animationOptions = JSON5.parse(animationOptionsString);
      console.log({ animationOptions });
      const {
        animationKeyFrames,
        animationOptions: _animationOptions,
        ...initialState
      } = form;

      const shapeRefMeta = shapeRefsMeta.find(
        (sr) => sr.id === selectedImage.id,
      );

      if (shapeRefMeta && shapeRefMeta?.ref?.current && animationKeyFrames) {
        const allTimelineObjectsByGroupId = findAllTimelineObjectsByGroupId({
          timelineModel,
        });

        const selectedGroup =
          allTimelineObjectsByGroupId[timelineSelectedGroupId];

        const duration =
          Math.abs(
            selectedGroup.keyframes[0].val - selectedGroup.keyframes[1].val,
          ) / 1000;

        const animationObject = { ...initialState };

        const keyframes = formDataToKeyframes({
          initialState,
          animationKeyFrames,
        });

        console.log({ keyframes });
        animate(
          animationObject,
          {
            ...keyframes,
          },
          {
            ...animationOptions,
            duration,
            onUpdate: (...latest) => {
              console.log(latest, animationObject);
              shapeRefMeta.ref.current?.position(animationObject);
              shapeRefMeta.ref.current?.rotation(animationObject.rotation);
              shapeRefMeta.ref.current?.height(animationObject.height);
              shapeRefMeta.ref.current?.width(animationObject.width);
            },
          },
        );

        console.log("click");
      }
    }
  }, [
    form,
    selectedImage,
    shapeRefsMeta,
    timelineModel,
    timelineSelectedGroupId,
  ]);

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
        <CanvasImageFormInputs
          ButtonElement={
            <Button variant="small" onClick={() => append(restImage)}>
              Add Animation Keyframe
            </Button>
          }
        />

        {fields.map((field, i) => {
          return (
            <CanvasImageFormInputs
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
