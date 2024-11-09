import { createContext, useContext } from "react";
import usePhotoboothState, {
  ActionsType,
  StatusType,
} from "~/features/photobooth-state/hooks/usePhotoboothState";
import { AnimationStatusType } from "~/features/photobooth-state/hooks/useAnimation";

export type PhotoboothMethodsType = {
  photoboothStateDispatch: React.Dispatch<ActionsType>;
  setFinalImg: React.Dispatch<React.SetStateAction<string>>;
};

export type PhotoboothImagesType = {
  images: Array<string>;
  origImages: Array<string>;
  bgRemovedImages: Array<string>;
  yetiBgIndicies: Array<number>;
  finalImg: string;
};

export type PhotoboothAnimationRefsType = {
  containerRef: React.RefObject<HTMLDivElement>;
  previousCapturesContainerRef: React.RefObject<HTMLDivElement>;
  webcamDisplayRef: React.RefObject<HTMLDivElement>;
};

const PhotoboothStatusContext = createContext<StatusType>("ready");
const PhotoboothMethodsContext = createContext<PhotoboothMethodsType | {}>(
  {},
) as React.Context<PhotoboothMethodsType>;

const PhotoboothImagesContext = createContext<PhotoboothImagesType | {}>(
  {},
) as React.Context<PhotoboothImagesType>;

const PhotoboothAnimationRefsContext = createContext<
  PhotoboothAnimationRefsType | {}
>({}) as React.Context<PhotoboothAnimationRefsType>;

export default function PhotoboothStateProvider({
  children,
  startAnimation,
  animationStatus,
  containerRef,
  previousCapturesContainerRef,
  webcamDisplayRef,
  resetAnimation,
}: {
  children: React.ReactNode;
  startAnimation: () => void;
  animationStatus: AnimationStatusType;
  containerRef: React.RefObject<HTMLDivElement>;
  previousCapturesContainerRef: React.RefObject<HTMLDivElement>;
  webcamDisplayRef: React.RefObject<HTMLDivElement>;
  resetAnimation: () => void;
}) {
  const {
    status,
    images,
    origImages,
    bgRemovedImages,
    yetiBgIndicies,
    photoboothStateDispatch,
    finalImg,
    setFinalImg,
  } = usePhotoboothState({
    startAnimation,
    animationStatus,
    resetAnimation,
  });

  const methodsValue: PhotoboothMethodsType = {
    photoboothStateDispatch,
    setFinalImg,
  };

  const imagesValue: PhotoboothImagesType = {
    images,
    origImages,
    bgRemovedImages,
    yetiBgIndicies,
    finalImg,
  };
  const animationRefs = {
    containerRef,
    previousCapturesContainerRef,
    webcamDisplayRef,
  };

  return (
    <PhotoboothAnimationRefsContext.Provider value={animationRefs}>
      <PhotoboothMethodsContext.Provider value={methodsValue}>
        <PhotoboothStatusContext.Provider value={status}>
          <PhotoboothImagesContext.Provider value={imagesValue}>
            {children}
          </PhotoboothImagesContext.Provider>
        </PhotoboothStatusContext.Provider>
      </PhotoboothMethodsContext.Provider>
    </PhotoboothAnimationRefsContext.Provider>
  );
}

export function usePhotoboothStatus() {
  return useContext(PhotoboothStatusContext);
}

export function usePhotoboothStateMethods() {
  return useContext(PhotoboothMethodsContext);
}

export function usePhotoboothImages() {
  return useContext(PhotoboothImagesContext);
}

export function useAnimationRefs() {
  return useContext(PhotoboothAnimationRefsContext);
}
