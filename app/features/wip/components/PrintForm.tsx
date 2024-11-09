import { useFetcher } from "@remix-run/react";
import icon1 from "~/images/yeti-paint-icons-1.png";
import icon2 from "~/images/yeti-paint-icons-2.png";

export default function PrintForm({ imgSrc }: { imgSrc: string }) {
  const fetcher = useFetcher();
  const { state } = fetcher;
  return (
    <>
      <div className="col-span-5 col-start-3 col-end-8 row-span-2 row-start-8 mb-8 grid items-end justify-center">
        <fetcher.Form id="printer-form" method="post">
          <input value={imgSrc} name="imgSrc" type="hidden" />
          <button
            className="font-main inline-flex items-center rounded-3xl border-4 border-dkblue bg-pastel px-6 py-4 text-8xl font-bold text-ltblue hover:bg-ltblue hover:text-dkblue disabled:cursor-not-allowed disabled:border-gray-400 disabled:bg-gray-300 disabled:text-gray-400 disabled:hover:bg-gray-200"
            type="submit"
            name="intent"
            value="print"
            disabled={state !== "idle"}
          >
            <img
              src={icon1}
              alt="yeti icon"
              className="mr-2 h-24 w-24 fill-current"
            />
            <span>Print!</span>
            <img
              src={icon2}
              alt="yeti icon"
              className="ml-2 h-24 w-24 fill-current"
            />
          </button>
        </fetcher.Form>
      </div>
    </>
  );
}
