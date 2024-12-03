const sleep = async (time: number) => {
  const p = new Promise<void>((resolve) => {
    setTimeout(() => resolve(), time);
  });
  return p;
};
export default sleep;
