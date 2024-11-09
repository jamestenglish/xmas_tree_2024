import { DO_QUERY_PRINTER_PRINTER, MOCK_PRINT, PRINTER_URL } from "~/constants";
import { printActionFormSchema } from "./schema";
import sendPrint, {
  queryPrinterAttributes,
} from "~/features/print/helpers/print.server";
import { redirect } from "@remix-run/node";
import saveImg from "./saveImg";

const sleep = async (time: number) => {
  await new Promise((resolve) => {
    setTimeout(() => resolve(""), time);
  });
};

const printAction = async ({ formData }: { formData: FormData }) => {
  const formPayload = Object.fromEntries(formData);

  try {
    const printData = printActionFormSchema.parse(formPayload);
    const { imgSrc } = printData;

    saveImg({ imgSrc, type: "final" });

    const res: Response = await fetch(imgSrc);
    const blob: Blob = await res.blob();
    const processedFile = new File([blob], `final-blasted.png`, {
      type: "image/jpeg",
    });
    const dataArrayBuffer = await processedFile.arrayBuffer();
    const data = Buffer.from(dataArrayBuffer);

    const url = PRINTER_URL;
    console.log({ url });
    let jobId;

    try {
      if (DO_QUERY_PRINTER_PRINTER) {
        const printerAttributes = await queryPrinterAttributes({ url });
        console.info(JSON.stringify(printerAttributes, null, 2));
        console.info("==========\n==========\n==========\n==========\n");
      }
      if (MOCK_PRINT) {
        await sleep(5000);
        jobId = 1337;
      } else {
        const response = await sendPrint({ url, data });
        console.log("\n\nprint response: ");
        console.log({ response });
        jobId = response?.["job-attributes-tag"]?.["job-id"] ?? undefined;
      }
    } catch (error) {
      console.error("printer error:", { error });
      if (error instanceof Error) {
        const message = error.message;
        return redirect(`/error/?error=${message}`);
      }
      return redirect("/error/?error=unknown");
    }

    if (jobId === undefined) {
      return redirect("/error?error=undefined-job-id");
    }

    return redirect(`/printing/${jobId}`);
  } catch (error) {
    console.error(error);
    console.error(`print form not submitted ${error}`);
    return redirect(`/error/?error=form-not-submitted`);
  }
};

export default printAction;
