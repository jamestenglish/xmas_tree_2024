import { useCallback } from "react";
import { usePhotoboothStateMethods } from "~/features/photobooth-state/components/PhotoboothStateProvider";
import icon1 from "~/images/yeti-leaving-icon.png";

export default function Cancel() {
  const { photoboothStateDispatch } = usePhotoboothStateMethods();

  const onClick = useCallback(() => {
    photoboothStateDispatch({ type: "reset" });
  }, [photoboothStateDispatch]);

  return (
    <>
      <div className="justify-left col-span-3 col-start-1 row-span-2 row-start-8 mb-12 ml-4 grid items-end">
        <div>
          <button
            onClick={onClick}
            className="font-main flex items-center rounded-3xl border-4 border-ltblue bg-error px-6 py-4 text-6xl font-bold text-dkblue hover:border-error hover:bg-ltblue"
          >
            <img
              src={icon1}
              alt="yeti icon"
              className="mr-2 h-12 w-12 fill-current"
            />
            <span>cancel</span>
          </button>
        </div>
      </div>
    </>
  );
}
