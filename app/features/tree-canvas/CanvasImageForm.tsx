import {
  FormProvider,
  SubmitHandler,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import Button from "../ui/components/Button";
import { ImageType } from "./EditableImage";
import { useCallback } from "react";
import useEditorStore from "../tree-editor/state/useEditorStore";
import { useShallow } from "zustand/shallow";
import JSON5 from "json5";
import { ShapeRefMeta } from "./CanvasEditor.client";
import { animate } from "motion";
import CodeTextArea, { animationOptionsStringDefault } from "./CodeTextArea";
import CanvasImageFormInputs from "./CanvasImageFormInputs";
import findAllTimelineObjectsByGroupId from "../tree-editor/state/functions/findAllTimelineObjectsByGroupId";
import getSequenceArgs, { resetAnimation } from "./functions/getSequenceArgs";

interface ImageTypeForm extends ImageType {
  animationOptionsString?: string;
}

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
  const { handleSubmit, control, watch } = useFormContext<ImageTypeForm>();

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
  const onClickAnimationPlay = useCallback(async () => {
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
      // const {
      //   animationKeyFrames,
      //   animationOptions: _animationOptions,
      //   ...initialState
      // } = form;

      const canvasImage = {
        ...form,
        animationOptions,
      };

      const shapeRefMeta = shapeRefsMeta.find(
        (sr) => sr.id === selectedImage.id,
      );

      if (shapeRefMeta && shapeRefMeta?.ref?.current) {
        const allTimelineObjectsByGroupId = findAllTimelineObjectsByGroupId({
          timelineModel,
        });

        const selectedGroup =
          allTimelineObjectsByGroupId[timelineSelectedGroupId];

        const durationInSeconds =
          Math.abs(
            selectedGroup.keyframes[0].val - selectedGroup.keyframes[1].val,
          ) / 1000;

        const sequenceArgs = getSequenceArgs({
          canvasImage,
          durationInSeconds,
          shapeRefMeta,
        });

        if (sequenceArgs) {
          console.log({ sequenceArgs });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const controls = animate(sequenceArgs as any);

          await controls;

          resetAnimation({
            canvasImage,
            shapeRefMeta,
          });

          controls.cancel();
          console.log("click");
        }
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
    (dataInitial) => {
      console.log("ImageTypeForm", dataInitial);
      const { animationOptionsString } = dataInitial;
      const animationOptions = animationOptionsString
        ? JSON5.parse(animationOptionsString)
        : undefined;
      const data = {
        ...dataInitial,
        animationOptions,
        updatedTime: new Date().getTime(),
      };
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
    },
    [canvasImages, setCanvasImages, setSelectedImage],
  );

  if (!selectedImage) {
    return <></>;
  }

  const isAnimation = fields && fields.length > 0;
  // animate: https://motion.dev/docs/animate

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
        {isAnimation && <CodeTextArea />}
        <div className="flex flex-row gap-2">
          {isAnimation && (
            <Button onClick={onClickAnimationPlay} variant="small">
              Play
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
  selectedImage: ImageType;
  setSelectedImage: React.Dispatch<React.SetStateAction<ImageTypeForm | null>>;
  shapeRefsMeta: ShapeRefMeta[];
}) {
  const { animationOptions } = selectedImage;
  const animationOptionsString = animationOptions
    ? JSON5.stringify(animationOptions, null, 2)
    : undefined;
  const values = {
    ...selectedImage,
    animationOptionsString:
      animationOptionsString ?? animationOptionsStringDefault,
  };
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
