export interface LedPosProps {
  x: number;
  y: number;
  maxDifference: number;
  ledIndex: number;
  highlightedImageData?: ImageData;
}

export type ResolveType = () => void;

export interface PromiseState {
  promise: Promise<null>;
  resolve: null | ResolveType;
}

export type PromiseStateType = PromiseState | null;