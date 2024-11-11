import { printActionFormSchema } from "./schema";

import { redirect } from "@remix-run/node";
import saveImg from "./saveImg";

const printAction = async ({ formData }: { formData: FormData }) => {
  const formPayload = Object.fromEntries(formData);

  try {
    const printData = printActionFormSchema.parse(formPayload);
    const { imgSrc } = printData;

    saveImg({ imgSrc, type: "final" });

    let jobId;

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
