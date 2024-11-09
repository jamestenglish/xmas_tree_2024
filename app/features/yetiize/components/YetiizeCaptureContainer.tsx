import { useEffect, useCallback } from "react";
import {
  usePhotoboothImages,
  usePhotoboothStateMethods,
  usePhotoboothStatus,
} from "~/features/photobooth-state/components/PhotoboothStateProvider";
import { YETIS } from "~/constants";
import icon1 from "~/images/yeti-cameria-icon-1-removebg-preview.png";
import icon2 from "~/images/yeti-camera-icon-2-removebg-preview.png";
import icon3 from "~/images/yeti-camera-icon-3-removebg-preview.png";

import sadIcon1 from "~/images/sad-yeti-icon-1.png";
import sadIcon2 from "~/images/sad-yeti-icon-2.png";
import sadIcon3 from "~/images/sad-yeti-icon-3.png";
import { useFetcher } from "@remix-run/react";
import { action } from "~/routes/_index";

const icons = [icon1, icon2, icon3];
const sadIcons = [sadIcon1, sadIcon2, sadIcon3];

export default function YetiizeCaptureContainer({
  imgSrc,
  index,
  bgRemovedImgSrc,
}: {
  imgSrc: string;
  index: number;
  bgRemovedImgSrc: string;
}) {
  const { photoboothStateDispatch } = usePhotoboothStateMethods();
  const { yetiBgIndicies, origImages } = usePhotoboothImages();
  const yetiBgIndex = yetiBgIndicies[index];
  const origImg = origImages[index];

  const status = usePhotoboothStatus();
  const isBgRemovedImgEmpty = bgRemovedImgSrc.length === 0;
  const doesBgRemovedMatchSrc =
    bgRemovedImgSrc === imgSrc && !isBgRemovedImgEmpty;

  const fetcher = useFetcher<typeof action>();
  const { state, data } = fetcher;
  const imgBgRemovedSrcResult = data?.imgBgRemovedSrcResult ?? "";
  const formResultIndex = data?.index ?? `${index}`;

  useEffect(() => {
    if (formResultIndex === `${index}`) {
      if (isBgRemovedImgEmpty) {
        if (state === "submitting") {
          photoboothStateDispatch({ type: "yetiizeStart" });
        } else if (
          status === "yetiizeStart" &&
          state === "idle" &&
          imgBgRemovedSrcResult !== ""
        ) {
          photoboothStateDispatch({
            type: "yetiizeFinish",
            payload: { imgBgRemovedSrc: imgBgRemovedSrcResult, index },
          });
        }
      }
    }
  }, [
    state,
    status,
    isBgRemovedImgEmpty,
    imgBgRemovedSrcResult,
    formResultIndex,
  ]);

  const onClickYetiize = useCallback(async () => {
    if (status === "yetiizeReady") {
      if (doesBgRemovedMatchSrc) {
        photoboothStateDispatch({ type: "shuffleYetiBgIndex", payload: index });
      } else {
        photoboothStateDispatch({ type: "setBgRemovedImg", payload: index });
      }
    }
  }, [
    doesBgRemovedMatchSrc,
    isBgRemovedImgEmpty,
    index,
    photoboothStateDispatch,
    status,
  ]);

  const onClickUnYetiize = useCallback(async () => {
    if (
      status === "yetiizeReady" &&
      doesBgRemovedMatchSrc &&
      !isBgRemovedImgEmpty
    ) {
      photoboothStateDispatch({ type: "setOriginalImg", payload: index });
    }
  }, [doesBgRemovedMatchSrc, isBgRemovedImgEmpty, index, status]);

  return (
    <div className="mt-6 flex flex-col items-center gap-6">
      <div className="grid-col-1 grid-row-1 grid">
        <div className="col-start-1 row-start-1 max-h-[316px] max-w-[424px] overflow-hidden">
          <img
            className="preview-img max-w-full object-fill"
            src={YETIS[yetiBgIndex]}
          />
        </div>
        <img
          className="preview-img col-start-1 row-start-1 border-2 border-dkblue object-scale-down"
          src={imgSrc}
        />
      </div>

      {bgRemovedImgSrc !== "" && (
        <button
          disabled={status !== "yetiizeReady"}
          onClick={onClickYetiize}
          className="font-main inline-flex items-center rounded-3xl border-4 border-dkblue px-6 py-4 text-5xl font-bold text-dkblue hover:bg-ltblue disabled:cursor-not-allowed disabled:border-gray-400 disabled:bg-gray-300 disabled:text-gray-400 disabled:hover:bg-gray-200"
        >
          <img
            src={icons[index]}
            alt="yeti icon"
            className="mr-2 h-14 w-14 fill-current"
          />
          <span>Yeti-ize!</span>
        </button>
      )}
      {isBgRemovedImgEmpty && (
        <fetcher.Form
          id={`yetiize-form-${index}`}
          key={`yetiize-form-${index}`}
          method="post"
        >
          <input defaultValue={origImg} name="imgSrc" type="hidden" />
          <input defaultValue={index} name="index" type="hidden" />

          <button
            disabled={status !== "yetiizeReady"}
            className="font-main inline-flex items-center rounded-3xl border-4 border-dkblue px-6 py-4 text-5xl font-bold text-dkblue hover:bg-ltblue disabled:cursor-not-allowed disabled:border-gray-400 disabled:bg-gray-300 disabled:text-gray-400 disabled:hover:bg-gray-200"
            name="intent"
            value="yetiize"
          >
            <img
              src={icons[index]}
              alt="yeti icon"
              className="mr-2 h-14 w-14 fill-current"
            />
            <span>Yeti-ize!</span>
          </button>
        </fetcher.Form>
      )}
      {doesBgRemovedMatchSrc && (
        <button
          onClick={onClickUnYetiize}
          className="align-center font-main inline-flex content-center items-center rounded-3xl border-4 border-pastel px-4 py-2 text-3xl font-bold text-pastel hover:bg-ltblue hover:text-dkblue"
        >
          <img
            src={sadIcons[index]}
            alt="yeti icon"
            className="mr-2 h-12 w-12 fill-current"
          />
          <span>Un-Yeti</span>
        </button>
      )}
    </div>
  );
}
