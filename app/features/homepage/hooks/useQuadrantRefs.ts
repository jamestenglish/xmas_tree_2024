import { useRef } from "react";
import { VideoContainerRef } from "~/features/video-output/components/VideoSelectorTypes";

const useQuadrantRefs = () => {
  const frontRef = useRef<VideoContainerRef>(null);
  const backRef = useRef<VideoContainerRef>(null);
  const leftRef = useRef<VideoContainerRef>(null);
  const rightRef = useRef<VideoContainerRef>(null);

  return { frontRef, backRef, leftRef, rightRef };
};

export default useQuadrantRefs;
