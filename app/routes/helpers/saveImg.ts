import { writeFileSync } from "fs";

export default function saveImg({
  imgSrc,
  type,
}: {
  imgSrc: string;
  type: string;
}) {
  const imgSrcSplit = imgSrc.split(",");
  const fileType = imgSrcSplit[0]
    .replace("data:image/", "")
    .replace(";base64", "");
  const timestamp = new Date().getTime();

  const buf = Buffer.from(imgSrcSplit[1], "base64");

  const file = `ignore/imgs/${timestamp}-${type}.${fileType}`;
  console.log(`writing file ${file}`);
  writeFileSync(file, buf);
}
