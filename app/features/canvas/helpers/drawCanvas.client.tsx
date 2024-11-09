import { YETIS } from "~/constants";
import { COLORS } from "~/constants/colors";
import SETTINGS from "~/constants/canvas";

export function createImageLoadPromise(img: HTMLImageElement) {
  return new Promise((resolve) => {
    img.onload = () => {
      resolve(true);
    };
  });
}

const drawText = ({
  text,
  x,
  y,
  ctx,
}: {
  text: string;
  x: number;
  y: number;
  ctx: CanvasRenderingContext2D;
}) => {
  ctx.strokeText(text, x, y, 598);
  ctx.fillText(text, x, y, 598);

  ctx.strokeText(text, x + SETTINGS.X_OFFSET, y, SETTINGS.X_OFFSET);
  ctx.fillText(text, x + SETTINGS.X_OFFSET, y, SETTINGS.X_OFFSET);
};

export default async function drawCanvas({
  promiseRef,
  images,
  snipPng,
  yetiBgImages,
  yetiBgIndicies,
  setFinalImg,
}: {
  promiseRef: React.MutableRefObject<Promise<void>[]>;
  images: string[];
  snipPng: string;
  yetiBgImages: HTMLImageElement[];
  yetiBgIndicies: number[];
  setFinalImg: React.Dispatch<React.SetStateAction<string>>;
}) {
  await Promise.all(promiseRef.current);
  promiseRef.current = [Promise.resolve()];
  const snipImg = new Image();
  const templateImages = [new Image(), new Image(), new Image()];

  const promises = [...templateImages, snipImg].map((img) => {
    return createImageLoadPromise(img);
  });

  templateImages.forEach((img, index) => {
    img.src = images[index];
  });

  snipImg.src = snipPng;

  const canvas = document.getElementById("c") as HTMLCanvasElement;
  canvas.width = SETTINGS.WIDTH;
  canvas.height = SETTINGS.HEIGHT;
  const ctx = canvas.getContext("2d");
  await Promise.all(promises);

  if (ctx !== null) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = SETTINGS.BG_COLOR;
    ctx.fillRect(0, 0, SETTINGS.WIDTH, SETTINGS.HEIGHT);
    ctx.drawImage(snipImg, 0, 0);

    [0, SETTINGS.X_OFFSET].forEach((offset) => {
      SETTINGS.Y_OFFSETS.forEach((y, index) => {
        ctx.lineWidth = SETTINGS.FRAME_WIDTH;
        ctx.strokeStyle = SETTINGS.PRIMARY_COLOR;
        ctx.strokeRect(
          offset + (SETTINGS.INITIAL_X - SETTINGS.FRAME_WIDTH / 4),
          y - SETTINGS.FRAME_WIDTH / 4,
          SETTINGS.PICTURE_WIDTH + SETTINGS.FRAME_WIDTH / 2,
          SETTINGS.PICTURE_HEIGHT + SETTINGS.FRAME_WIDTH / 2,
        );

        const yetiBgImg = yetiBgImages[yetiBgIndicies[index]];

        ctx.drawImage(
          yetiBgImg,
          0,
          0,
          yetiBgImg.width,
          (SETTINGS.PICTURE_HEIGHT / SETTINGS.PICTURE_WIDTH) * yetiBgImg.height,
          SETTINGS.INITIAL_X + offset,
          y,
          SETTINGS.PICTURE_WIDTH,
          SETTINGS.PICTURE_HEIGHT,
        );
        ctx.drawImage(
          templateImages[index],
          SETTINGS.INITIAL_X + offset,
          y,
          SETTINGS.PICTURE_WIDTH,
          SETTINGS.PICTURE_HEIGHT,
        );
      });
    });
    ctx.font = `normal 700 120px "${SETTINGS.FONT}"`;
    ctx.textAlign = "center";
    ctx.fillStyle = SETTINGS.SECONDARY_COLOR;
    ctx.strokeStyle = SETTINGS.PRIMARY_COLOR;
    ctx.lineWidth = SETTINGS.TEXT_OUTLINE_WIDTH;

    drawText({
      text: SETTINGS.LINE_1,
      x: SETTINGS.X_TEXT,
      y: SETTINGS.Y_TEXT_1,
      ctx,
    });

    drawText({
      text: SETTINGS.LINE_2,
      x: SETTINGS.X_TEXT,
      y: SETTINGS.Y_TEXT_2,
      ctx,
    });

    ctx.font = `normal 700 70px "${SETTINGS.FONT}", serif`;

    drawText({
      text: SETTINGS.LINE_3,
      x: SETTINGS.X_TEXT,
      y: SETTINGS.Y_TEXT_3,
      ctx,
    });

    ctx.font = `normal 700 40px "${SETTINGS.FONT}", serif`;

    drawText({
      text: SETTINGS.LINE_3_SUPER,
      x: SETTINGS.X_TEXT_SUPER_SCRIPT + SETTINGS.LINE_3_SUPER_OFFSET,
      y: SETTINGS.Y_TEXT_3_SUPER,
      ctx,
    });
  }

  setFinalImg(canvas.toDataURL("image/jpeg"));
}

export async function loadFonts(fontsToLoad: any) {
  if (fontsToLoad.length) {
    for (let i = 0; i < fontsToLoad.length; i++) {
      let fontProps = fontsToLoad[i];
      let fontFamily = fontProps["font-family"];
      let fontWeight = fontProps["font-weight"];
      let fontStyle = fontProps["font-style"];
      let fontUrl = Array.isArray(fontProps["src"])
        ? fontProps["src"][0][0]
        : fontProps["src"];
      if (fontUrl.indexOf("url(") === -1) {
        fontUrl = "url(" + fontUrl + ")";
      }
      let fontFormat = fontProps["src"][0][1] ? fontProps["src"][1] : "";
      const font = new FontFace(fontFamily, fontUrl);
      font.weight = fontWeight;
      font.style = fontStyle;
      await font.load();
      document.fonts.add(font);

      // apply font styles to body
      let fontDOMEl = document.createElement("div");
      fontDOMEl.textContent = "";
      document.body.appendChild(fontDOMEl);
      fontDOMEl.setAttribute(
        "style",
        `position:fixed; height:0; width:0; overflow:hidden; font-family:${fontFamily}; font-weight:${fontWeight}; font-style:${fontStyle}`,
      );
    }
  }
}
const fonts = [
  {
    "font-family": "${SETTINGS.FONT}",
    "font-style": "normal",
    "font-weight": 700,
    src: "https://fonts.gstatic.com/s/mountainsofchristmas/v22/3y9z6a4zcCnn5X0FDyrKi2ZRUBIy8uxoUo7eBGqJJPxIO7yLeEE.woff2",
  },
];

export const yetiBgImages = YETIS.map(() => new Image());

export const loadStaticAssets = async ({
  yetiBgImages,
  setIsStaticLoaded,
}: {
  yetiBgImages: HTMLImageElement[];
  setIsStaticLoaded: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  await loadFonts(fonts);

  const promises = [...yetiBgImages].map((img) => {
    createImageLoadPromise(img);
  });

  yetiBgImages.forEach((img, index) => {
    img.src = YETIS[index];
  });

  await Promise.all(promises);
  setIsStaticLoaded(true);
};
