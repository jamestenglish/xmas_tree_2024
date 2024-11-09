import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import { usePhotoboothStatus } from "~/features/photobooth-state/components/PhotoboothStateProvider";

import yetiLove1 from "~/images/yeti-love-1-removebg-preview.png";
import yetiLove2 from "~/images/yeti-love-2-removebg-preview.png";
import yetiLove3 from "~/images/yeti-love-3-removebg-preview.png";
import yetiPeek1 from "~/images/yeti-peek-1-bg.png";
import yetiPeek2 from "~/images/yeti-peek-2-bg.png";

const YETI_PEEK_RETRY = 100;

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

type PeekYetiMetaType = {
  index: number;
  previousIndicies: Array<number>;
};

export default function CapturePreview({
  lastImg,
}: {
  lastImg: string | undefined;
}) {
  const status = usePhotoboothStatus();

  const fetcher = useFetcher();

  useEffect(() => {
    if (status === "capturePreview" && lastImg !== undefined) {
      fetcher.submit(
        { imgSrc: lastImg, intent: "saveImg" },
        { method: "post" },
      );
    }
  }, [status, lastImg]);

  const initialState: PeekYetiMetaType = {
    index: -1,
    previousIndicies: [-1],
  };

  const [peekYetiMeta, setPeekYetiMeta] =
    useState<PeekYetiMetaType>(initialState);

  const isCapturePreview = status === "capturePreview";

  useEffect(() => {
    if (status === "captureFlash") {
      setPeekYetiMeta((prev) => {
        for (let i = 0; i < YETI_PEEK_RETRY; i++) {
          const rand = getRandomInt(5);

          if (prev.previousIndicies.includes(rand)) {
            continue;
          }
          const newIndiciesTemp = [...prev.previousIndicies, rand];
          const newIndicies =
            newIndiciesTemp.length === 4 ? [rand] : newIndiciesTemp;

          return {
            index: rand,
            previousIndicies: newIndicies,
          };
        }
        return prev;
      });
    }
  }, [status]);

  const { index } = peekYetiMeta;

  const doShow = isCapturePreview && lastImg !== undefined;

  if (!doShow) {
    return <></>;
  }

  return (
    <>
      <div className="z-10 col-span-9 col-start-1 row-span-9 row-start-1 grid items-center justify-center bg-white">
        <img src={lastImg} className="my-auto" />
      </div>

      {index === 0 && (
        <div className="justify-right z-20 col-span-3 col-start-1 row-span-3 row-start-4 grid items-center">
          <img src={yetiLove1} className="ml-6" />
        </div>
      )}

      {index === 1 && (
        <div className="z-20 col-span-3 col-start-7 row-span-6 row-start-3 grid items-center justify-center">
          <img src={yetiLove2} className="my-auto" />
        </div>
      )}

      {index === 2 && (
        <div className="z-20 col-span-6 col-start-6 row-span-9 row-start-1 mt-40 grid items-center justify-center">
          <img src={yetiLove3} />
        </div>
      )}
      {index === 3 && (
        <div className="z-20 col-span-3 col-start-1 row-span-3 row-start-3 grid items-center justify-center">
          <img src={yetiPeek1} className="ml-[60px]" />
        </div>
      )}
      {index === 4 && (
        <div className="justify-right z-20 col-span-3 col-start-8 row-span-9 row-start-1 grid items-center">
          <img src={yetiPeek2} className="ml-6 max-h-[480px]" />
        </div>
      )}
    </>
  );
}
