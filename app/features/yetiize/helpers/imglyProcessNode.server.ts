// import { removeBackground } from "@imgly/background-removal-node";

export async function processImage({
  imgSrc,
  name,
}: {
  imgSrc: string;
  name: string;
}): Promise<File | null> {
  // try {
  //   const buf = Buffer.from(imgSrc.split(",")[1], "base64");

  //   const photoSrcBlob = new Blob([buf], {
  //     type: "image/jpeg",
  //   });

  //   const imgBlob = await removeBackground(photoSrcBlob, {
  //     output: { quality: 1 },
  //   });

  //   const processedFile = new File([imgBlob], `${name}-bg-blasted.png`, {
  //     type: "image/png",
  //   });
  //   return processedFile;
  // } catch (err) {
  //   console.error(err);
  // }
  return null;
}
