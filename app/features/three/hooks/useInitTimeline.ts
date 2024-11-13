import { Timeline } from "animation-timeline-js";
import { useEffect, useState } from "react";

type UseInitTimelineArgs = {
  timelineElRef: React.RefObject<HTMLDivElement>;
};

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
        // snapStep: 3,
        snapStep: 250,
        // stepSmallPx: 119,
        // stepPx: 120,
        // stepSmallPx: 120 / 4 + 85,

        // denominators: [1, 12],
        // denominators: [1, 30],
      });
      // Here you can subscribe on timeline component events
      setTimeline(newTimeline);
    }

    // cleanup on component unmounted.
    return () => {
      newTimeline?.dispose();
    };
    // TODO JTE do I need this disable?
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timelineElRef.current]);

  return { timeline };
};

export default useInitTimeline;
