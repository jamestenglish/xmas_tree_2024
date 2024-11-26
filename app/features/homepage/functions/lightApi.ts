const sleep = async (time: number) => {
  const p = new Promise<void>((resolve) => {
    setTimeout(() => resolve(), time);
  });
  return p;
};

const IS_DEBUG = false;
const turnLightOffDebug = async (_ledIndex: number) => {
  console.log("turnLightOffDebug");
  await sleep(2000);
};

const turnLightOffReal = async (ledIndex: number) => {
  console.log("turnLightOffReal");
  await fetch(`http://10.0.0.157:8080/light/${ledIndex}/0/0/0`);
  await sleep(500);
};

const turnLightOnDebug = async (_ledIndex: number) => {
  console.log("turnLightOnDebug");
  await sleep(1000);
};

const turnLightOnReal = async (ledIndex: number) => {
  console.log("turnLightOnReal");
  await fetch(`http://10.0.0.157:8080/light/${ledIndex}/255/255/255`);
  await sleep(500);
};

const turnLightOff = IS_DEBUG ? turnLightOffDebug : turnLightOffReal;

const turnLightOn = IS_DEBUG ? turnLightOnDebug : turnLightOnReal;

export { turnLightOff, turnLightOn };
