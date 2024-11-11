export type ResolveFunctionType = (value: PromiseLike<null> | null) => void;
export type ResolveType = null | ResolveFunctionType;

const getPromiseWithResolver = () => {
  let resolve: ResolveType = null;
  const promise = new Promise<null>((resolveInner) => {
    resolve = resolveInner;
  });

  return { resolve, promise };
};

export default getPromiseWithResolver;
