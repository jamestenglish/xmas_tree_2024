import fs from "node:fs";

const canvasWidth = 640;
const combinedObj = JSON.parse(fs.readFileSync("data/11-combined.json"));

// const calibrationMap = combinedObj.calibrationData.reduce((acc, meta) => {
//   const { position, ledPositionMeta } = meta;
//   return {
//     ...acc,
//     [position]: {
//       ...ledPositionMeta,
//     },
//   };
// }, {});

// const calibratedData = {
//   ...combinedObj,
//   captureResults: combinedObj.captureResults.map((result) => {
//     const { position, ledPositionMeta } = result;
//     return {
//       position,
//       ledPositionMeta: {
//         ...ledPositionMeta,
//         x: ledPositionMeta.x - calibrationMap[position].x,
//         y: ledPositionMeta.x - calibrationMap[position].y,
//       },
//     };
//   }),
// };

const calibratedData = combinedObj;

fs.writeFileSync(
  "data/11-calibrated-data.json",
  JSON.stringify(calibratedData, null, 2),
);

const reorientedData = calibratedData.captureResults.reduce((acc, result) => {
  if (result && typeof result?.ledPositionMeta?.ledIndex === "number") {
    const key = result?.ledPositionMeta?.ledIndex;
    const prevArray = acc[key] ?? [];
    const newArray = [...prevArray, result];
    acc[key] = newArray;
  }
  return acc;
}, {});

fs.writeFileSync(
  "data/11-data-1.json",
  JSON.stringify(reorientedData, null, 2),
);

const POSITIONS = ["front", "back", "right", "left"];
// const POSITION_TO_MIRROR = ["back", "left"];
const POSITION_TO_MIRROR = [];

const ORTHAGONAL_POSITIONS = {
  front: ["left", "right"],
  back: ["left", "right"],
};

const reorientedData2 = Object.keys(reorientedData).reduce((acc, key) => {
  const positionsArr = reorientedData[key];

  const positionsObj = positionsArr.reduce((acc2, positionMeta) => {
    const position = positionMeta.position;
    const prevArray = acc2[position] ?? [];
    let tmpPositionMeta = { ...positionMeta };
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

fs.writeFileSync(
  "data/11-data-2.json",
  JSON.stringify(reorientedData2, null, 2),
);

const getCandidatePoints = ({ positions, positionsObj, ledIndex }) => {
  const frontBack = Object.keys(ORTHAGONAL_POSITIONS);

  const candidatePoints = positions.reduce((acc2, frontBackKey) => {
    if (frontBack.includes(frontBackKey)) {
      const orthagonalPositions = ORTHAGONAL_POSITIONS[frontBackKey];
      orthagonalPositions.forEach((leftRightKey) => {
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

  candidatePoints.sort((a, b) => b.maxDifference - a.maxDifference);
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

fs.writeFileSync(
  "data/11-data-3.json",
  JSON.stringify(reorientedData3, null, 2),
);
