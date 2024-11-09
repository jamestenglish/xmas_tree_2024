import { useEffect, useState } from "react";
import { COUNTDOWN_TIME_IN_MS } from "~/constants";
import {
  usePhotoboothStateMethods,
  usePhotoboothStatus,
} from "~/features/photobooth-state/components/PhotoboothStateProvider";

export default function Countdowner() {
  const status = usePhotoboothStatus();
  const { photoboothStateDispatch } = usePhotoboothStateMethods();

  const [countdown, setCountdown] = useState<number>(3);

  useEffect(() => {
    let id: NodeJS.Timeout;
    if (status === "countdown") {
      id = setTimeout(() => {
        const newCountdown = countdown - 1;
        if (newCountdown === 0) {
          photoboothStateDispatch({ type: "nextStatus" });
          setCountdown(3);
        } else {
          setCountdown(newCountdown);
        }
      }, COUNTDOWN_TIME_IN_MS);
    }
    return () => {
      if (id !== undefined) {
        clearTimeout(id);
      }
    };
  }, [status, countdown, photoboothStateDispatch]);

  if (status !== "countdown") {
    return <></>;
  }

  return (
    <div className="z-10 col-span-9 col-start-1 row-span-2 row-start-1 grid items-center justify-center">
      <span
        style={{
          fontSize: "16rem",
          animation: "ping 1.2s cubic-bezier(0, 0, 0.2, 1) infinite",
        }}
        className="font-main text-outline animate-ping font-bold text-white drop-shadow-[0_3px_3px_rgba(0,0,0,0.8)]"
      >
        {countdown}
      </span>
    </div>
  );
}
