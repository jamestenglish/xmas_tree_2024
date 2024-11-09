import { useReducer, useEffect, useMemo, useState } from "react";
import { FLASH_TIME_IN_MS, PREVIEW_TIME_IN_MS } from "~/constants";
import { AnimationStatusType } from "./useAnimation";
import { YETIS } from "~/constants";

export type StatusType =
  | "ready"
  | "countdown"
  | "captureFlash"
  | "capture"
  | "capturePreview"
  | "animateStart"
  | "animateInProgress"
  | "yetiizeReady"
  | "yetiizeStart"
  | "yetiizeFinish"
  | "print"
  | "resetting"
  | "noop";

type YetiizeFinishPayloadType = {
  imgBgRemovedSrc: string;
  index: number;
};

export type ActionsType =
  | { type: "nextStatus" }
  | { type: "yetiizeStart" }
  | { type: "yetiizeFinish"; payload: YetiizeFinishPayloadType }
  | { type: "captureImg"; payload: string }
  | { type: "setOriginalImg"; payload: number }
  | { type: "setBgRemovedImg"; payload: number }
  | { type: "reset" }
  | { type: "resetFinish" }
  | { type: "shuffleYetiBgIndex"; payload: number };

type ActionType = ActionsType[keyof ActionsType];

export type StateType = {
  status: StatusType;
  imgIndex: 0 | 1 | 2;
  images: Array<string>;
  origImages: Array<string>;
  bgRemovedImages: Array<string>;
  yetiBgIndicies: Array<number>;
};

type StatusMapType = { [key in StatusType]: (state: StateType) => StatusType };

// const capturePreviewNextStatus = "noop";
const capturePreviewNextStatus = "animateStart";

const statusMap: StatusMapType = {
  ready: (state) => "countdown",
  countdown: (state) => "captureFlash",
  captureFlash: (state) => "capture",
  capture: (state) => "capturePreview",
  capturePreview: (state) => {
    const { images } = state;

    const capturePreviewNext =
      images.length < 3 ? "countdown" : capturePreviewNextStatus;
    return capturePreviewNext;
  },
  animateStart: (state) => "animateInProgress",
  animateInProgress: (state) => "yetiizeReady",
  yetiizeReady: (state) => "print",
  yetiizeStart: (state) => "yetiizeFinish",
  yetiizeFinish: (state) => "yetiizeReady",
  resetting: () => "ready",
  print: (state) => "ready",
  noop: (state) => "noop",
};

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}
function getNextYetiIndex(prevIndex: number) {
  const newIndex = (prevIndex + 1) % YETIS.length;
  return newIndex;
}

function replace<Type>({
  index,
  array,
  value,
}: {
  index: number;
  array: Array<Type>;
  value: Type;
}) {
  return [
    ...array.slice(0, index),
    value,
    ...array.slice(index + 1, array.length),
  ];
}

const initialState: StateType = {
  imgIndex: 0,
  images: [],
  status: "ready",
  origImages: [],
  bgRemovedImages: [],
  yetiBgIndicies: [
    getRandomInt(YETIS.length),
    getRandomInt(YETIS.length),
    getRandomInt(YETIS.length),
  ],
};

const getNextStatus = ({
  currentState,
}: {
  currentState: StateType;
}): StatusType => {
  const { status } = currentState;

  const nextStatus = statusMap[status](currentState);

  return nextStatus;
};

const noAdvanceStatusActions: Array<ActionType> = [
  "captureImg",
  "shuffleYetiBgIndex",
  "setOriginalImg",
  "setBgRemovedImg",
];

function reducerInner(state: StateType, action: ActionsType): StateType {
  const nextStatus = getNextStatus({
    currentState: state,
  });
  // TODO JTE reducer log
  // console.log(
  //   `reducer || shouldAdvance: ${!noAdvanceStatusActions.includes(action.type)} | type: ${action.type} | currentStatus: ${state.status} | nextStatus: ${nextStatus}`,
  //   { action, state }
  // );
  const { images } = state;
  switch (action.type) {
    case "yetiizeFinish":
      const { payload: payloadYetiizeFinish } = action;
      const { index, imgBgRemovedSrc } = payloadYetiizeFinish;
      const bgRemovedImages = replace<string>({
        index,
        array: state.bgRemovedImages,
        value: imgBgRemovedSrc,
      });

      let newYetiizeImages = [...state.images] as Array<string>;
      if (bgRemovedImages[index] !== null) {
        newYetiizeImages = replace<string>({
          index,
          array: state.images,
          value: bgRemovedImages[index],
        });
      }

      return {
        ...state,
        status: nextStatus,
        bgRemovedImages: bgRemovedImages,
        images: newYetiizeImages,
      };

    case "nextStatus":
      return { ...state, status: nextStatus };
    case "yetiizeStart":
      return { ...state, status: "yetiizeStart" };
    case "reset":
      return { ...state, status: "resetting" };
    case "resetFinish":
      return initialState;
    // -------- types that don't change status
    case "setOriginalImg":
      const { payload: setOrigImgIndex } = action;
      const newSetOrigImages = replace<string>({
        index: setOrigImgIndex,
        array: state.images,
        value: state.origImages[setOrigImgIndex],
      });
      return {
        ...state,
        images: newSetOrigImages,
      };
    case "setBgRemovedImg":
      const { payload: setBgRemovedImgIndex } = action;
      const newSetBgRemovedImages = replace<string>({
        index: setBgRemovedImgIndex,
        array: state.images,
        value: state.bgRemovedImages[setBgRemovedImgIndex],
      });
      return {
        ...state,
        images: newSetBgRemovedImages,
      };
    case "captureImg":
      const { payload: payloadCaptureImg } = action;
      const newImages = [...images, payloadCaptureImg];
      const newBgRemovedImages = newImages.map(() => "");

      return {
        ...state,
        images: newImages,
        origImages: newImages,
        bgRemovedImages: newBgRemovedImages,
      };

    case "shuffleYetiBgIndex":
      const captureIndex = action.payload;
      const nextYetiBgIndex = getNextYetiIndex(
        state.yetiBgIndicies[captureIndex],
      );
      const newYetiBgIndicies = replace<number>({
        index: captureIndex,
        array: state.yetiBgIndicies,
        value: nextYetiBgIndex,
      });
      return {
        ...state,
        yetiBgIndicies: newYetiBgIndicies,
      };
  }
}

function reducerValidator(state: StateType, action: ActionsType): StateType {
  const newState = reducerInner(state, action);
  if (noAdvanceStatusActions.includes(action.type)) {
    if (newState.status !== state.status) {
      console.error("tried to advance", { action, state, newState });
      return { ...newState, status: state.status };
    }
  }
  return newState;
}

function reducer(state: StateType, action: ActionsType): StateType {
  // TODO JTE put in localstorage here
  const newState = reducerValidator(state, action);
  return newState;
}

export default function usePhotoboothState({
  startAnimation,
  animationStatus,
  resetAnimation,
}: {
  startAnimation: () => void;
  animationStatus: AnimationStatusType;
  resetAnimation: () => void;
}) {
  const [state, photoboothStateDispatch] = useReducer(reducer, initialState);
  const [finalImg, setFinalImg] = useState<string>("");
  const {
    status: statusRaw,
    images: imagesRaw,
    origImages: origImagesRaw,
    bgRemovedImages: bgRemovedImagesRaw,
    yetiBgIndicies: yetiBgIndiciesRaw,
  } = state;

  const status = useMemo(() => statusRaw, [statusRaw]);
  const images = useMemo(() => imagesRaw, [imagesRaw]);
  const origImages = useMemo(() => origImagesRaw, [origImagesRaw]);
  const bgRemovedImages = useMemo(
    () => bgRemovedImagesRaw,
    [bgRemovedImagesRaw],
  );
  const yetiBgIndicies = useMemo(() => yetiBgIndiciesRaw, [yetiBgIndiciesRaw]);

  useEffect(() => {
    const ids: Array<NodeJS.Timeout> = [];

    if (status === "captureFlash") {
      ids.push(
        setTimeout(() => {
          photoboothStateDispatch({ type: "nextStatus" });
        }, FLASH_TIME_IN_MS),
      );
    }

    if (status === "capturePreview") {
      ids.push(
        setTimeout(() => {
          photoboothStateDispatch({ type: "nextStatus" });
        }, PREVIEW_TIME_IN_MS),
      );
    }

    if (status === "animateStart" && animationStatus === "ready") {
      startAnimation();
      photoboothStateDispatch({ type: "nextStatus" });
    }

    if (status === "animateInProgress" && animationStatus === "finished") {
      photoboothStateDispatch({ type: "nextStatus" });
    }

    if (status === "yetiizeFinish") {
      photoboothStateDispatch({ type: "nextStatus" });
    }

    if (status === "resetting") {
      resetAnimation();
      photoboothStateDispatch({ type: "resetFinish" });
    }

    return () => {
      ids.forEach((id) => {
        if (id !== undefined) {
          clearTimeout(id);
        }
      });
    };
  }, [status, animationStatus, resetAnimation, photoboothStateDispatch]);

  return {
    status,
    images,
    origImages,
    bgRemovedImages,
    yetiBgIndicies,
    photoboothStateDispatch,
    finalImg,
    setFinalImg,
  };
}
