import PreviousCaptureContainer from "./PreviousCaptureContainer";
import {
  useAnimationRefs,
  usePhotoboothImages,
} from "~/features/photobooth-state/components/PhotoboothStateProvider";

export default function PreviousCaptures() {
  const { images } = usePhotoboothImages();

  const { previousCapturesContainerRef } = useAnimationRefs();

  const imgTags = images.map((src, index) => {
    // normally index's are bad keys but this won't be reordered
    return <PreviousCaptureContainer key={index} src={src} />;
  });

  return (
    <>
      <div
        ref={previousCapturesContainerRef}
        className="mx-auto flex flex-1 flex-row content-start items-start justify-center gap-x-2"
      >
        {imgTags}
      </div>
    </>
  );
}
