import {
  json,
  redirect,
  type ActionFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { useInterval } from "usehooks-ts";

import {
  MAX_PRINTER_STATUS_CHECKS,
  PRINTER_URL,
  PRINTER_POLL_RATE,
} from "~/constants";
import PhotoboothContainer from "~/features/photobooth-state/components/PhotoboothContainer";
import { getJobAttributes } from "~/features/print/helpers/print.server";
import PrintingLoading from "~/features/wip/components/PrintingLoading";

export const meta: MetaFunction = () => {
  return [
    { title: "Photobooth Printing..." },
    { name: "description", content: "Cool photobooth!" },
  ];
};

type ParamsType = {
  jobId: number;
};

export const loader = async ({ params }: { params: ParamsType }) => {
  return json({ jobId: params.jobId, count: 0 });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  try {
    const actionUrl = new URL(request.url);
    const count = parseInt(actionUrl.searchParams.get("count") ?? "0");
    console.log({ count });
    if (count > MAX_PRINTER_STATUS_CHECKS) {
      return redirect("/error?error=print-timed-out");
    }
    console.log("action");
    const jobId = parseInt(params.jobId ?? "");
    const url = PRINTER_URL;
    const jobAttributes = await getJobAttributes({ url, jobId });

    console.log("\njobAttributes: ");
    console.log({ jobAttributes });

    const isDone =
      jobAttributes?.["job-attributes-tag"]?.["job-state"] === "completed";
    if (isDone) {
      return redirect("/");
    }
    return redirect(`/printing/${jobId}?count=${count + 1}`);
  } catch (error) {
    console.error(error);
    console.error(`print form not submitted ${error}`);
    return redirect(`/error/?error=form-not-submitted`);
  }
};

export default function Printing() {
  const { jobId } = useLoaderData<typeof loader>();

  const fetcher = useFetcher<typeof action>();

  useInterval(() => {
    fetcher.submit({}, { method: "post" });
  }, PRINTER_POLL_RATE);

  return (
    <>
      <PhotoboothContainer>
        <div className="grid h-full w-full grid-cols-9 grid-rows-9 bg-snow">
          <PrintingLoading />
        </div>

        <div>{jobId}</div>
      </PhotoboothContainer>
      {/* <fetcher.Form id="printer-form" method="post" className="hidden">
        <span className="hidden">Check Status</span>
      </fetcher.Form> */}
    </>
  );
}
