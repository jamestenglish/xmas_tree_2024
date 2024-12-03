/* eslint-disable @typescript-eslint/no-explicit-any */
// import fs from "node:fs";

import combinedObjIn from "../../../../data/11-combined.json";

const canvasWidth = 640;
const canvasHeight = 480;
const backXDiff = 1112.9759827375926 - 42.848424501056115;
// const backXDiff = 0;

// 93 br y bl y
// const leftYDiff = -58.963813147326164 - 1075.4200204571503;

// 91
// const backYDiff = 1148.0886762360446 - -51.73864711548555;
const backYDiff = 0;

const leftXDiff = 1157.0886762360446 - 224.65225293825955 + 56.639;
// const leftXDiff = 0;

// const leftYDiff = 135.0133 - 12.42962;
// index: 59
const leftYDiff = 150.8579 - 6.266837;

const getCrunchedNumbers = () => {
  const combinedObj = combinedObjIn as any;
  // const combinedObj = JSON.parse(fs.readFileSync("data/11-combined.json"));

  // from ledIndex: 60
  const x = 518.0886762360446;
  const y = 317.4956937799043;

  const calibratedData = {
    ...combinedObj,
    captureResults: combinedObj.captureResults.map((result: any) => {
      return {
        ...result,
        ledPositionMeta: {
          ...result.ledPositionMeta,
          x: result.ledPositionMeta.x - x,
          y: canvasHeight - result.ledPositionMeta.y - y,
        },
      };
    }),
  };
  // const calibratedData = combinedObj;

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
  // const POSITION_TO_MIRROR = ["back"];

  const POSITION_TO_OFFSET = ["back", "left"];

  // const POSITION_TO_MIRROR: string[] = [];

  const ORTHAGONAL_POSITIONS: any = {
    front: ["left", "right"],
    back: ["left", "right"],
  };

  const reorientedData2 = Object.keys(reorientedData).reduce(
    (acc: any, key) => {
      const positionsArr = reorientedData[key];

      const positionsObj = positionsArr.reduce(
        (acc2: any, positionMeta: any) => {
          const position = positionMeta.position;
          const prevArray = acc2[position] ?? [];
          const tmpPositionMeta: any = { ...positionMeta };
          if (POSITION_TO_MIRROR.includes(position)) {
            const oldX = tmpPositionMeta.ledPositionMeta.x;

            tmpPositionMeta.ledPositionMeta.x = canvasWidth - oldX;
          }
          if (POSITION_TO_OFFSET.includes(position)) {
            let offsetX = 0;
            // eslint-disable-next-line prefer-const
            let offsetY = 0;
            if (position === "back") {
              offsetX = backXDiff;
            }
            if (position === "left") {
              offsetX = leftYDiff + leftXDiff;
              // offsetY = leftYDiff;
            }
            tmpPositionMeta.ledPositionMeta.x =
              tmpPositionMeta.ledPositionMeta.x - offsetX;
            tmpPositionMeta.ledPositionMeta.y =
              tmpPositionMeta.ledPositionMeta.y - offsetY;
          }
          const newArray = [...prevArray, tmpPositionMeta];
          newArray.sort((a, b) => b.maxDifference - a.maxDifference);
          acc2[position] = newArray;
          return acc2;
        },
        {},
      );

      const prevObj = acc[key] ?? {};
      const newObj = {
        ...prevObj,
        positionsObj,
      };

      acc[key] = newObj;
      return acc;
    },
    {},
  );

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
                frontBackPosition.maxDifference +
                leftRightPosition.maxDifference,
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

  const reorientedData3 = Object.keys(reorientedData2).reduce(
    (acc, ledIndex) => {
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
    },
    {},
  );

  return reorientedData3;
};
export default getCrunchedNumbers;

// const json = jsonIn as Data;
/*
{
    "sphere": {
        "position": [
            41.849492900608524,
            39.988403041825094,
            3.3580121703853956
        ],
        "color": 16777215,
        "id": "890",
        "ledIndex": "890",
        "positionsUsed": [
            "front",
            "left"
        ]
    }
}
  {
    "sphere": {
        "position": [
            41.849492900608524,
            40.1734335839599,
            3.3580121703853956
        ],
        "color": 65280,
        "id": "890",
        "ledIndex": "890",
        "positionsUsed": [
            "front",
            "right"
        ]
    }
}

---

{
    "sphere": {
        "position": [
            38.818938547486034,
            46.40632350434635,
            16.8495530726257
        ],
        "color": 16777215,
        "id": "952",
        "ledIndex": "952",
        "positionsUsed": [
            "front",
            "left"
        ]
    }
}
{
    "sphere": {
        "position": [
            38.818938547486034,
            46.34678899082569,
            16.8495530726257
        ],
        "color": 16711680,
        "id": "952",
        "ledIndex": "952",
        "positionsUsed": [
            "front",
            "right"
        ]
    }
}
    ------------
{
  "position": [
    55.98634285714286,
    51.1138067061144,
    38.469771428571434
  ],
  "color": 16777215,
  "id": "61",
  "ledIndex": "61",
  "positionsUsed": [
    "front",
    "right"
  ]
}
{
  "position": [
    55.98634285714286,
    46.83925065117211,
    38.469771428571434
  ],
  "color": 65280,
  "id": "61",
  "ledIndex": "61",
  "positionsUsed": [
    "front",
    "left"
  ]
}


--------------
{
  "position": [
    56.09371007371008,
    47.09867498051442,
    38.23061425061425
  ],
  "color": 16777215,
  "id": "60",
  "ledIndex": "60",
  "positionsUsed": [
    "front",
    "left"
  ]
}
TreeVis.client.tsx:103 {
  "position": [
    56.09371007371008,
    51.80886762360446,
    38.23061425061425
  ],
  "color": 16711680,
  "id": "60",
  "ledIndex": "60",
  "positionsUsed": [
    "front",
    "right"
  ]
}
TreeVis.client.tsx:103 {
  "position": [
    59.4887306501548,
    47.09867498051442,
    41.473065015479875
  ],
  "color": 65280,
  "id": "60",
  "ledIndex": "60",
  "positionsUsed": [
    "back",
    "left"
  ]
}
    */

/*
{
  "position": [
    -256.5605698178506,
    1157.0886762360446,
    112.74098862063516
  ],
  "color": 16711680,
  "id": "736",
  "ledIndex": "736",
  "positionsUsed": [
    "front",
    "left"
  ]
}
{
  "position": [
    -256.5605698178506,
    -224.65225293825955,
    112.74098862063516
  ],
  "color": 16777215,
  "id": "736",
  "ledIndex": "736",
  "positionsUsed": [
    "front",
    "right"
  ]
}
  */
