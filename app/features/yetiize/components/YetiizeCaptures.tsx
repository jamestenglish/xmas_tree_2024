import YetiizeCaptureContainer from "./YetiizeCaptureContainer";
import { usePhotoboothImages } from "~/features/photobooth-state/components/PhotoboothStateProvider";

export default function YetiizeCaptures() {
  const { images, bgRemovedImages } = usePhotoboothImages();

  const imgTags = images.map((imgSrc, index) => {
    const bgRemovedImgSrc = bgRemovedImages[index];

    // normally index's are bad keys but this won't be reordered
    return (
      <YetiizeCaptureContainer
        key={index}
        imgSrc={imgSrc}
        index={index}
        bgRemovedImgSrc={bgRemovedImgSrc}
      />
    );
  });

  return <>{imgTags}</>;
}
