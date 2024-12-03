import { ActionFunctionArgs, json, type MetaFunction } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { useCallback, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import fs from "node:fs";
import img1 from "~/features/assets/IMG_4646.jpg";
import img2 from "~/features/assets/IMG_4647.jpg";
import img3 from "~/features/assets/IMG_4648.jpg";

import img4 from "~/features/assets/IMG_4649.jpg";

export const resultsDefaultPath = "ignore/click-data";
const resultsFilePath = `${resultsDefaultPath}/click-capture.json`;

export const meta: MetaFunction = () => {
  return [
    { title: "2024 Xmas Tree" },
    { name: "description", content: "2024 Xmas Tree" },
  ];
};

export const action = async (actionArgs: ActionFunctionArgs) => {
  const { request } = actionArgs;
  const data = await request.json();

  let jsonA = "{}";
  try {
    jsonA = fs.readFileSync(resultsFilePath).toString();
  } catch (_e) {
    // do nothing;
  }
  const obj = JSON.parse(jsonA);

  const newKey = `${new Date().getTime()}`;

  const newObj = {
    ...obj,
    [newKey]: data,
  };

  fs.writeFileSync(resultsFilePath, JSON.stringify(newObj, null, 2));

  return json({});
};

export const loader = async () => {
  fs.mkdirSync(resultsDefaultPath, { recursive: true });
  let jsonA = "{}";
  try {
    jsonA = fs.readFileSync(resultsFilePath).toString();
  } catch (_e) {
    // do nothing;
  }
  const obj = JSON.parse(jsonA);

  return json(obj);
};

export default function Index() {
  const ref1 = useRef<HTMLCanvasElement | null>(null);
  const ref2 = useRef<HTMLCanvasElement | null>(null);
  const ref3 = useRef<HTMLCanvasElement | null>(null);
  const ref4 = useRef<HTMLCanvasElement | null>(null);
  const { register, watch } = useForm();
  const indexInput = watch("index");
  const fetcher = useFetcher();
  const data = useLoaderData();

  useEffect(() => {
    const go = async () => {
      const canvases = [ref1.current, ref2.current, ref3.current, ref4.current];
      const images = [img1, img2, img3, img4];
      for (let i = 0; i < canvases.length; i++) {
        const canvas = canvases[i];
        if (canvas) {
          const imgLoader = new Image();
          imgLoader.crossOrigin = "anonymous";
          imgLoader.src = images[i];
          const dimension = await new Promise<{ h: number; w: number }>(
            (resolve) => {
              imgLoader.onload = function () {
                resolve({ h: imgLoader.height, w: imgLoader.width });
              };
            },
          );
          canvas.height = dimension.h;
          canvas.width = dimension.w;
          const div = document.getElementById(`div${i}`);
          const divStyle = div?.style;
          if (divStyle) {
            divStyle.width = `${dimension.w}px`;
            divStyle.height = `${dimension.h}px`;
          }
          const context = canvas.getContext("2d");
          if (context) {
            context.clearRect(0, 0, canvas.width, canvas.height);

            context.drawImage(imgLoader, 0, 0, canvas.width, canvas.height);

            Object.entries(data).forEach((datum) => {
              const [_key, values] = datum;
              if (values.index == i) {
                context!.strokeStyle = "red";
                context!.strokeRect(values.x - 2, values.y - 2, 4, 4);
              }
            });
          }
        }
      }
    };
    go();
  }, [data]);

  const onClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
      const canvases = [ref1.current, ref2.current, ref3.current, ref4.current];
      console.log(event);
      const canvas = canvases[index];
      if (canvas) {
        const context = canvas.getContext("2d");
        context!.strokeStyle = "red";
        // const x = event.clientX;
        // const y = event.clientY;
        const bounds = event.target.getBoundingClientRect();
        const x = event.clientX - bounds.left;
        const y = event.clientY - bounds.top;

        context!.strokeRect(x - 2, y - 2, 4, 4);

        fetcher.submit(
          { x, y, indexInput, index },
          {
            method: "POST",
            encType: "application/json",
          },
        );
      }
    },
    [fetcher, indexInput],
  );

  return (
    <>
      <div>
        <input type="text" {...register("index")} />
      </div>
      <div
        id="div0"
        onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
          onClick(event, 0);
        }}
      >
        <canvas id="img1" ref={ref1} />
        <img className="hidden" src={img1} />
      </div>
      <div
        id="div1"
        onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
          onClick(event, 1);
        }}
      >
        <canvas id="img2" ref={ref2} />

        <img className="hidden" src={img2} />
      </div>
      <div
        id="div2"
        onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
          onClick(event, 2);
        }}
      >
        <canvas id="img3" ref={ref3} />

        <img className="hidden" src={img3} />
      </div>
      <div
        id="div3"
        onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
          onClick(event, 3);
        }}
      >
        <canvas id="img4" ref={ref4} />

        <img className="hidden" src={img4} />
      </div>
    </>
  );
}
