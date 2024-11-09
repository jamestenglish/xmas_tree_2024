import { type MetaFunction } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";

import PhotoboothContainer from "~/features/photobooth-state/components/PhotoboothContainer";
import Error from "~/features/wip/components/Error";
import { useCallback } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Photobooth" },
    { name: "description", content: "Cool photobooth!" },
  ];
};

export default function ErrorRoot() {
  const navigate = useNavigate();
  const onClick = useCallback(() => {
    navigate("/");
  }, []);

  return (
    <>
      <PhotoboothContainer>
        <div
          onClick={onClick}
          className="grid h-full w-full grid-cols-9 grid-rows-9 bg-snow"
        >
          <Error />
        </div>
      </PhotoboothContainer>
    </>
  );
}
