import { Timeline } from "animation-timeline-js";
import { useEffect, useState } from "react";

interface UseInitTimelineArgs {
  timelineElRef: React.RefObject<HTMLDivElement>;
}

const useInitTimeline = ({ timelineElRef }: UseInitTimelineArgs) => {
  const [timeline, setTimeline] = useState<Timeline>();

  useEffect(() => {
    let newTimeline: Timeline | null = null;
    // On component init
    if (timelineElRef.current) {
      newTimeline = new Timeline({
        id: timelineElRef.current,
        headerHeight: 45,
        snapEnabled: true,
        snapAllKeyframesOnMove: true,
        snapStep: 200,
        rowsStyle: {
          fillColor: "white",
        },
      });
      // Here you can subscribe on timeline component events
      setTimeline(newTimeline);
      console.log({ newTimeline });
    }

    // cleanup on component unmounted.
    return () => {
      newTimeline?.dispose();
    };
  }, [timelineElRef]);

  return { timeline };
};

export default useInitTimeline;
