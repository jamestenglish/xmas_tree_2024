import { useSpring, easings, useSpringRef } from "@react-spring/web";
import { useCallback, useRef, useState } from "react";
import {
  MAX_HEIGHT_START_RM,
  MAX_HEIGHT_TARGET_RM,
  COLUMN_GAP_START_RM,
  COLUMN_GAP_TARGET_RM,
  ANIMATION_DURATION_MS,
} from "~/constants";

export type AnimationStatusType = "ready" | "running" | "finished";
export default function useAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [animationStatus, setAnimationStatus] =
    useState<AnimationStatusType>("ready");

  const previousCapturesContainerRef = useRef<HTMLDivElement>(null);

  const webcamDisplayRef = useRef<HTMLDivElement>(null);

  const from = {
    scrollY: 0,
    maxHeight: MAX_HEIGHT_START_RM,
    columnGap: COLUMN_GAP_START_RM,
    height: 0,
  };

  const [_props, api] = useSpring(() => ({
    config: {
      easing: easings.easeInCubic,
      duration: ANIMATION_DURATION_MS,
    },
    from,
    onChange: (result) => {
      if (
        previousCapturesContainerRef?.current?.style.columnGap !== undefined
      ) {
        previousCapturesContainerRef.current.style.columnGap = `${result.value.columnGap}rem`;

        const images = Array.from(
          previousCapturesContainerRef.current.getElementsByClassName(
            "preview-img",
          ),
        );
        images.forEach((el) => {
          const img = el as HTMLImageElement;
          img.style.maxHeight = `${result.value.maxHeight}rem`;
        });
      }

      if (webcamDisplayRef?.current?.style !== undefined) {
        webcamDisplayRef.current.style.marginTop = `${result.value.height}px`;
      }
    },
    onResolve: () => {
      console.log(`onResolve: ${new Date()}`);
    },
    onRest: () => {
      console.log(`onRest: ${new Date()}`);
      setAnimationStatus("finished");
    },
  }));
  const finishRef = useSpringRef();

  useSpring(() => ({
    ref: finishRef,
    config: {
      easing: easings.easeInCubic,
      duration: 1,
    },
    from,
    onStart: () => {
      console.log(`secondOnStart: ${new Date()}`);
    },
  }));

  const startAnimation = useCallback(() => {
    setAnimationStatus("running");
    const top =
      previousCapturesContainerRef?.current?.getBoundingClientRect()?.top ?? 0;
    const height =
      webcamDisplayRef?.current?.getBoundingClientRect()?.height ?? 0;
    console.log(`startAnimation: ${new Date()}`);
    api.start({
      to: {
        scrollY: top,
        height: -height,
        columnGap: COLUMN_GAP_TARGET_RM,
        maxHeight: MAX_HEIGHT_TARGET_RM,
      },
      from: {
        scrollY: 0,
        maxHeight: MAX_HEIGHT_START_RM,
        columnGap: COLUMN_GAP_START_RM,
        height: 0,
      },
    });
  }, [api, setAnimationStatus]);

  const resetAnimation = useCallback(() => {
    setAnimationStatus("ready");
    if (previousCapturesContainerRef?.current?.style.columnGap !== undefined) {
      previousCapturesContainerRef.current.style.columnGap = `${from.columnGap}rem`;

      const images = Array.from(
        previousCapturesContainerRef.current.getElementsByClassName(
          "preview-img",
        ),
      );
      images.forEach((el) => {
        const img = el as HTMLImageElement;
        img.style.maxHeight = `${from.height}rem`;
      });
    }

    if (webcamDisplayRef?.current?.style !== undefined) {
      webcamDisplayRef.current.style.marginTop = `${from.height}px`;
    }
  }, [setAnimationStatus]);

  return {
    containerRef,
    previousCapturesContainerRef,
    animationStatus,
    startAnimation,
    resetAnimation,
    webcamDisplayRef,
  };
}
