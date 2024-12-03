import Plot from "react-plotly.js";
import { SphereVisProps, useStore } from "./TreeVis.client";
import { useShallow } from "zustand/shallow";
import { Data } from "plotly.js";

interface TreeVisScatterProps {
  allSpheres: SphereVisProps[];
  bestSpheres: SphereVisProps[];
}
export default function TreeVisScatter({
  allSpheres,
  bestSpheres,
}: TreeVisScatterProps) {
  const { plotsOn } = useStore(
    useShallow((state) => ({
      plotsOn: state.plotsOn,
    })),
  );
  const xs = allSpheres.map((sphere) => sphere.position[0]);
  const ys = allSpheres.map((sphere) => sphere.position[1]);
  const zs = allSpheres.map((sphere) => sphere.position[2]);

  const frSpheres = allSpheres.filter(
    (s) =>
      s.positionsUsed.includes("front") && s.positionsUsed.includes("right"),
  );
  const flSpheres = allSpheres.filter(
    (s) =>
      s.positionsUsed.includes("front") && s.positionsUsed.includes("left"),
  );

  const brSpheres = allSpheres.filter(
    (s) =>
      s.positionsUsed.includes("back") && s.positionsUsed.includes("right"),
  );

  const blSpheres = allSpheres.filter(
    (s) => s.positionsUsed.includes("back") && s.positionsUsed.includes("left"),
  );

  const { radius } = useStore(
    useShallow((state) => ({
      radius: state.radius,
    })),
  );

  const data: Data[] = [];
  if (plotsOn.includes("0")) {
    data.push({
      x: bestSpheres.map((sphere) => sphere.position[0]),
      y: bestSpheres.map((sphere) => sphere.position[1]),
      z: bestSpheres.map((sphere) => sphere.position[2]),
      text: bestSpheres.map(
        (sphere) =>
          `ledIndex: ${sphere.ledIndex}<br />${JSON.stringify(sphere.positionsUsed)}`,
      ),

      type: "scatter3d",
      mode: "markers",
      marker: {
        color: "pink",
        size: radius + 2 * 4,
        symbol: "circle",
        line: {
          color: "black",
          width: 1,
        },
        opacity: 0.8,
      },
    });
  }

  if (plotsOn.includes("1")) {
    data.push({
      x: frSpheres.map((sphere) => sphere.position[0]),
      y: frSpheres.map((sphere) => sphere.position[1]),
      z: frSpheres.map((sphere) => sphere.position[2]),
      text: frSpheres.map(
        (sphere) =>
          `ledIndex: ${sphere.ledIndex}<br />${JSON.stringify(sphere.positionsUsed)}`,
      ),
      type: "scatter3d",
      mode: "markers",
      marker: {
        color: "red",
        size: radius + 2 * 3,
        symbol: "circle",
        line: {
          color: "rgb(127, 127, 127)",
          width: 1,
        },
        opacity: 0.8,
      },
    });
  }

  if (plotsOn.includes("2")) {
    data.push({
      x: flSpheres.map((sphere) => sphere.position[0]),
      y: flSpheres.map((sphere) => sphere.position[1]),
      z: flSpheres.map((sphere) => sphere.position[2]),
      text: flSpheres.map(
        (sphere) =>
          `ledIndex: ${sphere.ledIndex}<br />${JSON.stringify(sphere.positionsUsed)}`,
      ),
      type: "scatter3d",
      mode: "markers",
      marker: {
        color: "blue",
        size: radius + 2 * 2,
        symbol: "circle",
        line: {
          color: "rgb(127, 127, 127)",
          width: 1,
        },
        opacity: 0.8,
      },
    });
  }
  if (plotsOn.includes("3")) {
    data.push({
      x: blSpheres.map((sphere) => sphere.position[0]),
      y: blSpheres.map((sphere) => sphere.position[1]),
      z: blSpheres.map((sphere) => sphere.position[2]),
      text: blSpheres.map(
        (sphere) =>
          `ledIndex: ${sphere.ledIndex}<br />${JSON.stringify(sphere.positionsUsed)}`,
      ),
      type: "scatter3d",
      mode: "markers",
      marker: {
        color: "green",
        size: radius + 2,
        symbol: "circle",
        line: {
          color: "rgb(127, 127, 127)",
          width: 1,
        },
        opacity: 0.8,
      },
    });
  }
  if (plotsOn.includes("4")) {
    data.push({
      x: brSpheres.map((sphere) => sphere.position[0]),
      y: brSpheres.map((sphere) => sphere.position[1]),
      z: brSpheres.map((sphere) => sphere.position[2]),
      text: brSpheres.map(
        (sphere) =>
          `ledIndex: ${sphere.ledIndex}<br />${JSON.stringify(sphere.positionsUsed)}`,
      ),
      type: "scatter3d",
      mode: "markers",
      marker: {
        color: "yellow",
        size: radius,
        symbol: "circle",
        line: {
          color: "rgb(127, 127, 127)",
          width: 1,
        },
        opacity: 0.8,
      },
    });
  }
  return (
    <Plot
      data={data}
      layout={{
        width: 320 * 2.5,
        height: 240 * 2.5,
        title: { text: "A Fancy Plot" },
      }}
    />
  );
}
