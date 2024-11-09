import { printActionFormSchema } from "./schema";
import { redirect } from "@remix-run/node";
import saveImg from "./saveImg";

export default async function saveImgAction({
  formData,
}: {
  formData: FormData;
}) {
  const formPayload = Object.fromEntries(formData);

  const printData = printActionFormSchema.parse(formPayload);
  const { imgSrc } = printData;
  saveImg({ imgSrc, type: "capture" });

  return redirect("?save-img");
}
