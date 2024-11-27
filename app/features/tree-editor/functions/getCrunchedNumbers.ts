/* eslint-disable @typescript-eslint/no-explicit-any */
// import fs from "node:fs";

import combinedObjIn from "../../../../data/11-combined.json";

const combinedObj = combinedObjIn as any;
const canvasWidth = 640;
// const combinedObj = JSON.parse(fs.readFileSync("data/11-combined.json"));

const calibratedData = combinedObj;

// fs.writeFileSync(
//   "data/11-calibrated-data.json",
//   JSON.stringify(calibratedData, null, 2),
// );

const reorientedData = calibratedData.captureResults.reduce(
  (acc: any, result: any) => {
    if (result && typeof result?.ledPositionMeta?.ledIndex === "number") {
      const key = result?.ledPositionMeta?.ledIndex;
      const prevArray = acc[key] ?? [];
      const newArray = [...prevArray, result];
      acc[key] = newArray;
    }
    return acc;
  },
  {},
);

// fs.writeFileSync(
//   "data/11-data-1.json",
//   JSON.stringify(reorientedData, null, 2),
// );

const POSITIONS = ["front", "back", "right", "left"];
const POSITION_TO_MIRROR = ["back", "left"];
// const POSITION_TO_MIRROR: string[] = [];

const ORTHAGONAL_POSITIONS: any = {
  front: ["left", "right"],
  back: ["left", "right"],
};

const reorientedData2 = Object.keys(reorientedData).reduce((acc: any, key) => {
  const positionsArr = reorientedData[key];

  const positionsObj = positionsArr.reduce((acc2: any, positionMeta: any) => {
    const position = positionMeta.position;
    const prevArray = acc2[position] ?? [];
    const tmpPositionMeta: any = { ...positionMeta };
    if (POSITION_TO_MIRROR.includes(position)) {
      const oldX = tmpPositionMeta.ledPositionMeta.x;
      tmpPositionMeta.ledPositionMeta.x = canvasWidth - oldX;
    }
    const newArray = [...prevArray, tmpPositionMeta];
    newArray.sort((a, b) => b.maxDifference - a.maxDifference);
    acc2[position] = newArray;
    return acc2;
  }, {});

  const prevObj = acc[key] ?? {};
  const newObj = {
    ...prevObj,
    positionsObj,
  };

  acc[key] = newObj;
  return acc;
}, {});

// fs.writeFileSync(
//   "data/11-data-2.json",
//   JSON.stringify(reorientedData2, null, 2),
// );

const getCandidatePoints = ({
  positions,
  positionsObj,
  ledIndex,
}: {
  positions: any;
  positionsObj: any;
  ledIndex: any;
}) => {
  const frontBack = Object.keys(ORTHAGONAL_POSITIONS);

  const candidatePoints = positions.reduce((acc2: any, frontBackKey: any) => {
    if (frontBack.includes(frontBackKey)) {
      const orthagonalPositions = ORTHAGONAL_POSITIONS[frontBackKey];
      orthagonalPositions.forEach((leftRightKey: any) => {
        const frontBackPosition =
          positionsObj?.[frontBackKey]?.[0]?.ledPositionMeta;
        const leftRightPosition =
          positionsObj?.[leftRightKey]?.[0]?.ledPositionMeta;

        if (frontBackPosition && leftRightPosition) {
          const newPoint = {
            ledIndex,
            positionsUsed: [frontBackKey, leftRightKey],
            x: frontBackPosition.x,
            y: leftRightPosition.x,
            z: frontBackPosition.y,
            maxDifference:
              frontBackPosition.maxDifference + leftRightPosition.maxDifference,
          };
          acc2.push(newPoint);
        }
      });
    }
    return acc2;
  }, []);

  candidatePoints.sort((a: any, b: any) => b.maxDifference - a.maxDifference);
  return candidatePoints;
};

const reorientedData3 = Object.keys(reorientedData2).reduce((acc, ledIndex) => {
  const positionsObj = reorientedData2[ledIndex].positionsObj;
  const positions = Object.keys(positionsObj);
  const candidatePoints = getCandidatePoints({
    positions,
    positionsObj,
    ledIndex,
  });
  const newAcc = {
    ...acc,
    [ledIndex]: {
      positionsObj,
      candidatePoints,
    },
  };

  return newAcc;
}, {});

export default reorientedData3;
