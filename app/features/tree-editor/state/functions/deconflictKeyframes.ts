import { TimelineKeyframeExtra } from "~/features/tree-timeline/functions/createRow";

type IsBetweenArgs = {
  keyframeA: TimelineKeyframeExtra;
  keyframeB: TimelineKeyframeExtra;
  keyframeTest: TimelineKeyframeExtra;
};

const isBetween = ({ keyframeA, keyframeB, keyframeTest }: IsBetweenArgs) => {
  const { val: valA } = keyframeA;
  const { val: valB } = keyframeB;
  const { val: valTest } = keyframeTest;
  const result = valTest >= valA && valTest < valB;
  console.log({ result, valA, valB, valTest });
  return result;
};

const deconflictKeyframes = (keyframesIn: TimelineKeyframeExtra[]) => {
  if (keyframesIn.length <= 2) {
    console.log("AAA not enough to deconflict");
    return keyframesIn;
  }
  const initial: [TimelineKeyframeExtra, TimelineKeyframeExtra][] = [];
  const keyframeGroups = keyframesIn.reduce((acc, keyframe, index) => {
    if (index % 2 !== 0) {
      return acc;
    }
    acc.push([keyframe, keyframesIn[index + 1]]);
    return acc;
  }, initial);

  keyframeGroups.sort((a, b) => a[0].val - b[0].val);

  const keyframes = keyframeGroups.flat();

  console.log("deconflictKeyframes");
  keyframes.forEach((e) => {
    if (typeof e?.group !== "string") {
      console.log(e.val, e?.group?.id);
    }
  });
  const deconflictedIndicies = [0, 1];

  while (deconflictedIndicies.length < keyframes.length) {
    for (let i = 2; i < keyframes.length; i += 2) {
      if (deconflictedIndicies.includes(i)) {
        continue;
      }

      const keyframeTestC = keyframes[i];
      const keyframeTestD = keyframes[i + 1];
      const distance = Math.abs(keyframeTestC.val - keyframeTestD.val);
      let isDeconflicted = true;
      for (let j = 0; j < deconflictedIndicies.length; j += 2) {
        const indexA = deconflictedIndicies[j];
        const indexB = deconflictedIndicies[j + 1];
        const keyframeA = keyframes[indexA];
        const keyframeB = keyframes[indexB];
        const isCBetween = isBetween({
          keyframeA,
          keyframeB,
          keyframeTest: keyframeTestC,
        });
        const isDBetween = isBetween({
          keyframeA,
          keyframeB,
          keyframeTest: keyframeTestD,
        });
        console.log({ distance, isCBetween, isDBetween });
        if (isCBetween || isDBetween) {
          keyframeTestC.val = keyframeB.val;
          keyframeTestD.val = keyframeB.val + distance;
          isDeconflicted = false;
        }
      }
      if (isDeconflicted) {
        deconflictedIndicies.push(i, i + 1);
      }
    }
  }
  console.log("end");
  keyframes.forEach((e) => console.log(e.val));
};

export default deconflictKeyframes;
