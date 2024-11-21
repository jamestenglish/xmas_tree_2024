/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { motionValue } from "motion";

type EasingFunction = (v: number) => number;
// type EasingModifier = (easing: EasingFunction) => EasingFunction;
type BezierDefinition = readonly [number, number, number, number];
type EasingDefinition =
  | BezierDefinition
  | "linear"
  | "easeIn"
  | "easeOut"
  | "easeInOut"
  | "circIn"
  | "circOut"
  | "circInOut"
  | "backIn"
  | "backOut"
  | "backInOut"
  | "anticipate";

type Easing = EasingDefinition | EasingFunction;

// interface Point {
//   x: number;
//   y: number;
// }

interface SVGPathProperties {
  pathLength?: number;
  pathOffset?: number;
  pathSpacing?: number;
}

type GenericKeyframesTarget<V> = V[] | Array<null | V>;

/**
 * An update function. It accepts a timestamp used to advance the animation.
 */
type Update = (timestamp: number) => void;
/**
 * Drivers accept a update function and call it at an interval. This interval
 * could be a synchronous loop, a setInterval, or tied to the device's framerate.
 */
interface DriverControls {
  start: () => void;
  stop: () => void;
  now: () => number;
}
type Driver = (update: Update) => DriverControls;

interface SVGAttributes {
  accentHeight?: number | string | undefined;
  accumulate?: "none" | "sum" | undefined;
  additive?: "replace" | "sum" | undefined;
  alignmentBaseline?:
    | "auto"
    | "baseline"
    | "before-edge"
    | "text-before-edge"
    | "middle"
    | "central"
    | "after-edge"
    | "text-after-edge"
    | "ideographic"
    | "alphabetic"
    | "hanging"
    | "mathematical"
    | "inherit"
    | undefined;
  allowReorder?: "no" | "yes" | undefined;
  alphabetic?: number | string | undefined;
  amplitude?: number | string | undefined;
  arabicForm?: "initial" | "medial" | "terminal" | "isolated" | undefined;
  ascent?: number | string | undefined;
  attributeName?: string | undefined;
  attributeType?: string | undefined;
  autoReverse?: boolean | undefined;
  azimuth?: number | string | undefined;
  baseFrequency?: number | string | undefined;
  baselineShift?: number | string | undefined;
  baseProfile?: number | string | undefined;
  bbox?: number | string | undefined;
  begin?: number | string | undefined;
  bias?: number | string | undefined;
  by?: number | string | undefined;
  calcMode?: number | string | undefined;
  capHeight?: number | string | undefined;
  clip?: number | string | undefined;
  clipPath?: string | undefined;
  clipPathUnits?: number | string | undefined;
  clipRule?: number | string | undefined;
  colorInterpolation?: number | string | undefined;
  colorInterpolationFilters?:
    | "auto"
    | "sRGB"
    | "linearRGB"
    | "inherit"
    | undefined;
  colorProfile?: number | string | undefined;
  colorRendering?: number | string | undefined;
  contentScriptType?: number | string | undefined;
  contentStyleType?: number | string | undefined;
  cursor?: number | string | undefined;
  cx?: number | string | undefined;
  cy?: number | string | undefined;
  d?: string | undefined;
  decelerate?: number | string | undefined;
  descent?: number | string | undefined;
  diffuseConstant?: number | string | undefined;
  direction?: number | string | undefined;
  display?: number | string | undefined;
  divisor?: number | string | undefined;
  dominantBaseline?: number | string | undefined;
  dur?: number | string | undefined;
  dx?: number | string | undefined;
  dy?: number | string | undefined;
  edgeMode?: number | string | undefined;
  elevation?: number | string | undefined;
  enableBackground?: number | string | undefined;
  end?: number | string | undefined;
  exponent?: number | string | undefined;
  externalResourcesRequired?: boolean | undefined;
  fill?: string | undefined;
  fillOpacity?: number | string | undefined;
  fillRule?: "nonzero" | "evenodd" | "inherit" | undefined;
  filter?: string | undefined;
  filterRes?: number | string | undefined;
  filterUnits?: number | string | undefined;
  floodColor?: number | string | undefined;
  floodOpacity?: number | string | undefined;
  focusable?: boolean | "auto" | undefined;
  fontFamily?: string | undefined;
  fontSize?: number | string | undefined;
  fontSizeAdjust?: number | string | undefined;
  fontStretch?: number | string | undefined;
  fontStyle?: number | string | undefined;
  fontVariant?: number | string | undefined;
  fontWeight?: number | string | undefined;
  format?: number | string | undefined;
  fr?: number | string | undefined;
  from?: number | string | undefined;
  fx?: number | string | undefined;
  fy?: number | string | undefined;
  g1?: number | string | undefined;
  g2?: number | string | undefined;
  glyphName?: number | string | undefined;
  glyphOrientationHorizontal?: number | string | undefined;
  glyphOrientationVertical?: number | string | undefined;
  glyphRef?: number | string | undefined;
  gradientTransform?: string | undefined;
  gradientUnits?: string | undefined;
  hanging?: number | string | undefined;
  horizAdvX?: number | string | undefined;
  horizOriginX?: number | string | undefined;
  href?: string | undefined;
  ideographic?: number | string | undefined;
  imageRendering?: number | string | undefined;
  in2?: number | string | undefined;
  in?: string | undefined;
  intercept?: number | string | undefined;
  k1?: number | string | undefined;
  k2?: number | string | undefined;
  k3?: number | string | undefined;
  k4?: number | string | undefined;
  k?: number | string | undefined;
  kernelMatrix?: number | string | undefined;
  kernelUnitLength?: number | string | undefined;
  kerning?: number | string | undefined;
  keyPoints?: number | string | undefined;
  keySplines?: number | string | undefined;
  keyTimes?: number | string | undefined;
  lengthAdjust?: number | string | undefined;
  letterSpacing?: number | string | undefined;
  lightingColor?: number | string | undefined;
  limitingConeAngle?: number | string | undefined;
  local?: number | string | undefined;
  markerEnd?: string | undefined;
  markerHeight?: number | string | undefined;
  markerMid?: string | undefined;
  markerStart?: string | undefined;
  markerUnits?: number | string | undefined;
  markerWidth?: number | string | undefined;
  mask?: string | undefined;
  maskContentUnits?: number | string | undefined;
  maskUnits?: number | string | undefined;
  mathematical?: number | string | undefined;
  mode?: number | string | undefined;
  numOctaves?: number | string | undefined;
  offset?: number | string | undefined;
  opacity?: number | string | undefined;
  operator?: number | string | undefined;
  order?: number | string | undefined;
  orient?: number | string | undefined;
  orientation?: number | string | undefined;
  origin?: number | string | undefined;
  overflow?: number | string | undefined;
  overlinePosition?: number | string | undefined;
  overlineThickness?: number | string | undefined;
  paintOrder?: number | string | undefined;
  panose1?: number | string | undefined;
  path?: string | undefined;
  pathLength?: number | string | undefined;
  patternContentUnits?: string | undefined;
  patternTransform?: number | string | undefined;
  patternUnits?: string | undefined;
  pointerEvents?: number | string | undefined;
  points?: string | undefined;
  pointsAtX?: number | string | undefined;
  pointsAtY?: number | string | undefined;
  pointsAtZ?: number | string | undefined;
  preserveAlpha?: boolean | undefined;
  preserveAspectRatio?: string | undefined;
  primitiveUnits?: number | string | undefined;
  r?: number | string | undefined;
  radius?: number | string | undefined;
  refX?: number | string | undefined;
  refY?: number | string | undefined;
  renderingIntent?: number | string | undefined;
  repeatCount?: number | string | undefined;
  repeatDur?: number | string | undefined;
  requiredExtensions?: number | string | undefined;
  requiredFeatures?: number | string | undefined;
  restart?: number | string | undefined;
  result?: string | undefined;
  rotate?: number | string | undefined;
  rx?: number | string | undefined;
  ry?: number | string | undefined;
  scale?: number | string | undefined;
  seed?: number | string | undefined;
  shapeRendering?: number | string | undefined;
  slope?: number | string | undefined;
  spacing?: number | string | undefined;
  specularConstant?: number | string | undefined;
  specularExponent?: number | string | undefined;
  speed?: number | string | undefined;
  spreadMethod?: string | undefined;
  startOffset?: number | string | undefined;
  stdDeviation?: number | string | undefined;
  stemh?: number | string | undefined;
  stemv?: number | string | undefined;
  stitchTiles?: number | string | undefined;
  stopColor?: string | undefined;
  stopOpacity?: number | string | undefined;
  strikethroughPosition?: number | string | undefined;
  strikethroughThickness?: number | string | undefined;
  string?: number | string | undefined;
  stroke?: string | undefined;
  strokeDasharray?: string | number | undefined;
  strokeDashoffset?: string | number | undefined;
  strokeLinecap?: "butt" | "round" | "square" | "inherit" | undefined;
  strokeLinejoin?: "miter" | "round" | "bevel" | "inherit" | undefined;
  strokeMiterlimit?: number | string | undefined;
  strokeOpacity?: number | string | undefined;
  strokeWidth?: number | string | undefined;
  surfaceScale?: number | string | undefined;
  systemLanguage?: number | string | undefined;
  tableValues?: number | string | undefined;
  targetX?: number | string | undefined;
  targetY?: number | string | undefined;
  textAnchor?: string | undefined;
  textDecoration?: number | string | undefined;
  textLength?: number | string | undefined;
  textRendering?: number | string | undefined;
  to?: number | string | undefined;
  transform?: string | undefined;
  u1?: number | string | undefined;
  u2?: number | string | undefined;
  underlinePosition?: number | string | undefined;
  underlineThickness?: number | string | undefined;
  unicode?: number | string | undefined;
  unicodeBidi?: number | string | undefined;
  unicodeRange?: number | string | undefined;
  unitsPerEm?: number | string | undefined;
  vAlphabetic?: number | string | undefined;
  values?: string | undefined;
  vectorEffect?: number | string | undefined;
  version?: string | undefined;
  vertAdvY?: number | string | undefined;
  vertOriginX?: number | string | undefined;
  vertOriginY?: number | string | undefined;
  vHanging?: number | string | undefined;
  vIdeographic?: number | string | undefined;
  viewBox?: string | undefined;
  viewTarget?: number | string | undefined;
  visibility?: number | string | undefined;
  vMathematical?: number | string | undefined;
  widths?: number | string | undefined;
  wordSpacing?: number | string | undefined;
  writingMode?: number | string | undefined;
  x1?: number | string | undefined;
  x2?: number | string | undefined;
  x?: number | string | undefined;
  xChannelSelector?: string | undefined;
  xHeight?: number | string | undefined;
  xlinkActuate?: string | undefined;
  xlinkArcrole?: string | undefined;
  xlinkHref?: string | undefined;
  xlinkRole?: string | undefined;
  xlinkShow?: string | undefined;
  xlinkTitle?: string | undefined;
  xlinkType?: string | undefined;
  xmlBase?: string | undefined;
  xmlLang?: string | undefined;
  xmlns?: string | undefined;
  xmlnsXlink?: string | undefined;
  xmlSpace?: string | undefined;
  y1?: number | string | undefined;
  y2?: number | string | undefined;
  y?: number | string | undefined;
  yChannelSelector?: string | undefined;
  z?: number | string | undefined;
  zoomAndPan?: string | undefined;
}

interface ProgressTimeline {
  currentTime: null | {
    value: number;
  };
  cancel?: VoidFunction;
}

interface AnimationState<V> {
  value: V;
  done: boolean;
}
interface KeyframeGenerator<V> {
  calculatedDuration: null | number;
  next: (t: number) => AnimationState<V>;
}

interface AnimationPlaybackLifecycles<V> {
  onUpdate?: (latest: V) => void;
  onPlay?: () => void;
  onComplete?: () => void;
  onRepeat?: () => void;
  onStop?: () => void;
}
type GeneratorFactory = (
  options: ValueAnimationOptions<any>,
) => KeyframeGenerator<any>;
type AnimationGeneratorType =
  | GeneratorFactory
  | "decay"
  | "spring"
  | "keyframes"
  | "tween"
  | "inertia";
interface Transition
  extends AnimationPlaybackOptions,
    Omit<SpringOptions, "keyframes">,
    Omit<InertiaOptions, "keyframes">,
    KeyframeOptions {
  delay?: number;
  elapsed?: number;
  driver?: Driver;
  type?: AnimationGeneratorType;
  duration?: number;
  autoplay?: boolean;
  startTime?: number;
}
interface ValueAnimationTransition<V = any>
  extends Transition,
    AnimationPlaybackLifecycles<V> {}
interface ValueAnimationOptions<V extends string | number = number>
  extends ValueAnimationTransition {
  keyframes: V[];
  name?: string;
  from?: V;
  isGenerator?: boolean;
}
// interface AnimationScope<T = any> {
//   readonly current: T;
//   animations: AnimationPlaybackControls[];
// }
type StyleTransitions = {
  [K in keyof CSSStyleDeclarationWithTransform]?: Transition;
};
type SVGPathTransitions = {
  [K in keyof SVGPathProperties]: Transition;
};
type SVGTransitions = {
  [K in keyof SVGAttributes]: Transition;
};
type VariableTransitions = {
  [key: `--${string}`]: Transition;
};
type AnimationOptionsWithValueOverrides<V = any> = StyleTransitions &
  SVGPathTransitions &
  SVGTransitions &
  VariableTransitions &
  ValueAnimationTransition<V>;
interface DynamicAnimationOptions
  extends Omit<AnimationOptionsWithValueOverrides, "delay"> {
  delay?: number | DynamicOption<number>;
}
type ElementOrSelector = Element | Element[] | NodeListOf<Element> | string;
/**
 * @public
 */
interface AnimationPlaybackControls {
  time: number;
  speed: number;
  startTime: number | null;
  state?: AnimationPlayState;
  duration: number;
  stop: () => void;
  play: () => void;
  pause: () => void;
  complete: () => void;
  cancel: () => void;
  then: (onResolve: VoidFunction, onReject?: VoidFunction) => Promise<void>;
  attachTimeline?: (
    timeline: ProgressTimeline,
    fallback?: (animation: AnimationPlaybackControls) => VoidFunction,
  ) => VoidFunction;
  flatten: () => void;
}
type DynamicOption<T> = (i: number, total: number) => T;
interface CSSStyleDeclarationWithTransform
  extends Omit<
    CSSStyleDeclaration,
    "direction" | "transition" | "x" | "y" | "z"
  > {
  x: number | string;
  y: number | string;
  z: number | string;
  rotateX: number | string;
  rotateY: number | string;
  rotateZ: number | string;
  scaleX: number;
  scaleY: number;
  scaleZ: number;
  skewX: number | string;
  skewY: number | string;
}
type ValueKeyframe = string | number;
type UnresolvedValueKeyframe = ValueKeyframe | null;
type ValueKeyframesDefinition =
  | ValueKeyframe
  | ValueKeyframe[]
  | UnresolvedValueKeyframe[];
type StyleKeyframesDefinition = {
  [K in keyof CSSStyleDeclarationWithTransform]?: ValueKeyframesDefinition;
};
type SVGKeyframesDefinition = {
  [K in keyof SVGAttributes]?: ValueKeyframesDefinition;
};
type VariableKeyframesDefinition = {
  [key: `--${string}`]: ValueKeyframesDefinition;
};
type SVGPathKeyframesDefinition = {
  [K in keyof SVGPathProperties]?: ValueKeyframesDefinition;
};
type DOMKeyframesDefinition = StyleKeyframesDefinition &
  SVGKeyframesDefinition &
  SVGPathKeyframesDefinition &
  VariableKeyframesDefinition;
interface VelocityOptions {
  velocity?: number;
  restSpeed?: number;
  restDelta?: number;
}
type RepeatType = "loop" | "reverse" | "mirror";
interface AnimationPlaybackOptions {
  repeat?: number;
  repeatType?: RepeatType;
  repeatDelay?: number;
}
interface DurationSpringOptions {
  duration?: number;
  bounce?: number;
}
interface SpringOptions extends DurationSpringOptions, VelocityOptions {
  stiffness?: number;
  damping?: number;
  mass?: number;
}
interface DecayOptions extends VelocityOptions {
  keyframes?: number[];
  power?: number;
  timeConstant?: number;
  modifyTarget?: (v: number) => number;
}
interface InertiaOptions extends DecayOptions {
  bounceStiffness?: number;
  bounceDamping?: number;
  min?: number;
  max?: number;
}
interface KeyframeOptions {
  ease?: Easing | Easing[];
  times?: number[];
}

type Subscriber<T> = (v: T) => void;

interface MotionValueEventCallbacks<V> {
  animationStart: () => void;
  animationComplete: () => void;
  animationCancel: () => void;
  change: (latestValue: V) => void;
  renderRequest: () => void;
}
interface ResolvedValues {
  [key: string]: string | number;
}
interface Owner {
  current: HTMLElement | unknown;
  getProps: () => {
    onUpdate?: (latest: ResolvedValues) => void;
  };
}
// interface MotionValueOptions {
//   owner?: Owner;
// }

declare class MotionValue<V = any> {
  version: string;
  owner?: Owner;
  private current;
  private prev;
  private prevFrameValue;
  private updatedAt;
  private prevUpdatedAt;
  private stopPassiveEffect?;

  animation?: AnimationPlaybackControls;
  setCurrent(current: V): void;
  setPrevFrameValue(prevFrameValue?: V | undefined): void;

  onChange(subscription: Subscriber<V>): () => void;

  private events;
  on<EventName extends keyof MotionValueEventCallbacks<V>>(
    eventName: EventName,
    callback: MotionValueEventCallbacks<V>[EventName],
  ): VoidFunction;
  clearListeners(): void;

  set(v: V, render?: boolean): void;
  setWithVelocity(prev: V, current: V, delta: number): void;

  jump(v: V, endAnimation?: boolean): void;
  updateAndNotify: (v: V, render?: boolean) => void;

  get(): NonNullable<V>;

  getPrevious(): V | undefined;

  getVelocity(): number;
  hasAnimated: boolean;

  stop(): void;

  isAnimating(): boolean;
  private clearAnimation;

  destroy(): void;
}
// declare function motionValue<V>(
//   init: V,
//   options?: MotionValueOptions,
// ): MotionValue<V>;

type ObjectTarget<O> = {
  [K in keyof O]?: O[K] | GenericKeyframesTarget<O[K]>;
};
type SequenceTime = number | "<" | `+${number}` | `-${number}` | `${string}`;
type SequenceLabel = string;
interface SequenceLabelWithTime {
  name: SequenceLabel;
  at: SequenceTime;
}
interface At {
  at?: SequenceTime;
}
type MotionValueSegment = [
  MotionValue,
  UnresolvedValueKeyframe | UnresolvedValueKeyframe[],
];
type MotionValueSegmentWithTransition = [
  MotionValue,
  UnresolvedValueKeyframe | UnresolvedValueKeyframe[],
  Transition & At,
];
type DOMSegment = [ElementOrSelector, DOMKeyframesDefinition];
type DOMSegmentWithTransition = [
  ElementOrSelector,
  DOMKeyframesDefinition,
  DynamicAnimationOptions & At,
];
type ObjectSegment<O extends {} = {}> = [O, ObjectTarget<O>];
type ObjectSegmentWithTransition<O extends {} = {}> = [
  O,
  ObjectTarget<O>,
  DynamicAnimationOptions & At,
];
type Segment =
  | ObjectSegment
  | ObjectSegmentWithTransition
  | SequenceLabel
  | SequenceLabelWithTime
  | MotionValueSegment
  | MotionValueSegmentWithTransition
  | DOMSegment
  | DOMSegmentWithTransition;
// interface SequenceOptions extends AnimationPlaybackOptions {
//   delay?: number;
//   duration?: number;
//   defaultTransition?: Transition;
// }

// declare function createScopedAnimate(scope?: AnimationScope): {
//   (
//     sequence: AnimationSequence,
//     options?: SequenceOptions,
//   ): AnimationPlaybackControls;
//   (
//     value: string | MotionValue<string>,
//     keyframes: string | GenericKeyframesTarget<string>,
//     options?: ValueAnimationTransition<string>,
//   ): AnimationPlaybackControls;
//   (
//     value: number | MotionValue<number>,
//     keyframes: number | GenericKeyframesTarget<number>,
//     options?: ValueAnimationTransition<number>,
//   ): AnimationPlaybackControls;
//   <V>(
//     value: V | MotionValue<V>,
//     keyframes: V | GenericKeyframesTarget<V>,
//     options?: ValueAnimationTransition<V>,
//   ): AnimationPlaybackControls;
//   (
//     element: ElementOrSelector,
//     keyframes: DOMKeyframesDefinition,
//     options?: DynamicAnimationOptions,
//   ): AnimationPlaybackControls;
//   <O extends {}>(
//     object: O | O[],
//     keyframes: ObjectTarget<O>,
//     options?: DynamicAnimationOptions,
//   ): AnimationPlaybackControls;
// };
// declare const animate: {
//   (
//     sequence: AnimationSequence,
//     options?: SequenceOptions,
//   ): AnimationPlaybackControls;
//   (
//     value: string | MotionValue<string>,
//     keyframes: string | GenericKeyframesTarget<string>,
//     options?: ValueAnimationTransition<string>,
//   ): AnimationPlaybackControls;
//   (
//     value: number | MotionValue<number>,
//     keyframes: number | GenericKeyframesTarget<number>,
//     options?: ValueAnimationTransition<number>,
//   ): AnimationPlaybackControls;
//   <V>(
//     value: V | MotionValue<V>,
//     keyframes: V | GenericKeyframesTarget<V>,
//     options?: ValueAnimationTransition<V>,
//   ): AnimationPlaybackControls;
//   (
//     element: ElementOrSelector,
//     keyframes: DOMKeyframesDefinition,
//     options?: DynamicAnimationOptions,
//   ): AnimationPlaybackControls;
//   <O extends {}>(
//     object: O | O[],
//     keyframes: ObjectTarget<O>,
//     options?: DynamicAnimationOptions,
//   ): AnimationPlaybackControls;
// };

// declare const animateMini: (
//   elementOrSelector: ElementOrSelector,
//   keyframes: DOMKeyframesDefinition,
//   options?: DynamicAnimationOptions,
// ) => AnimationPlaybackControls;

// interface ScrollOptions {
//   source?: HTMLElement;
//   container?: HTMLElement;
//   target?: Element;
//   axis?: "x" | "y";
//   offset?: ScrollOffset;
// }
// type OnScrollProgress = (progress: number) => void;
// type OnScrollWithInfo = (progress: number, info: ScrollInfo) => void;
// type OnScroll = OnScrollProgress | OnScrollWithInfo;
// interface AxisScrollInfo {
//   current: number;
//   offset: number[];
//   progress: number;
//   scrollLength: number;
//   velocity: number;
//   targetOffset: number;
//   targetLength: number;
//   containerLength: number;
//   interpolatorOffsets?: number[];
//   interpolate?: EasingFunction;
// }
// interface ScrollInfo {
//   time: number;
//   x: AxisScrollInfo;
//   y: AxisScrollInfo;
// }
// type OnScrollInfo = (info: ScrollInfo) => void;
// type SupportedEdgeUnit = "px" | "vw" | "vh" | "%";
// type EdgeUnit = `${number}${SupportedEdgeUnit}`;
// type NamedEdges = "start" | "end" | "center";
// type EdgeString = NamedEdges | EdgeUnit | `${number}`;
// type Edge = EdgeString | number;
// type ProgressIntersection = [number, number];
// type Intersection = `${Edge} ${Edge}`;
// type ScrollOffset = Array<Edge | Intersection | ProgressIntersection>;
// interface ScrollInfoOptions {
//   container?: HTMLElement;
//   target?: Element;
//   axis?: "x" | "y";
//   offset?: ScrollOffset;
// }

// declare class ScrollTimeline implements ProgressTimeline {
//   constructor(options: ScrollOptions);
//   currentTime: null | {
//     value: number;
//   };
//   cancel?: VoidFunction;
// }
// declare global {
//   interface Window {
//     ScrollTimeline: ScrollTimeline;
//   }
// }
// declare function scroll(
//   onScroll: OnScroll | AnimationPlaybackControls,
//   { axis, ...options }?: ScrollOptions,
// ): VoidFunction;

// declare function scrollInfo(
//   onScroll: OnScrollInfo,
//   { container, ...options }?: ScrollInfoOptions,
// ): () => void;

// type ViewChangeHandler = (entry: IntersectionObserverEntry) => void;
// type MarginValue = `${number}${"px" | "%"}`;
// type MarginType =
//   | MarginValue
//   | `${MarginValue} ${MarginValue}`
//   | `${MarginValue} ${MarginValue} ${MarginValue}`
//   | `${MarginValue} ${MarginValue} ${MarginValue} ${MarginValue}`;
// interface InViewOptions {
//   root?: Element | Document;
//   margin?: MarginType;
//   amount?: "some" | "all" | number;
// }
// declare function inView(
//   elementOrSelector: ElementOrSelector,
//   onStart: (entry: IntersectionObserverEntry) => void | ViewChangeHandler,
//   { root, margin: rootMargin, amount }?: InViewOptions,
// ): VoidFunction;

// declare const anticipate: (p: number) => number;

// interface TransformOptions<T> {

//   clamp?: boolean;

//   ease?: EasingFunction | EasingFunction[];

//   mixer?: (from: T, to: T) => (v: number) => any;
// }

// declare function transform<T>(
//   inputValue: number,
//   inputRange: number[],
//   outputRange: T[],
//   options?: TransformOptions<T>,
// ): T;

// declare function transform<T>(
//   inputRange: number[],
//   outputRange: T[],
//   options?: TransformOptions<T>,
// ): (inputValue: number) => T;

// type Process = (data: FrameData) => void;
// type Schedule = (
//   process: Process,
//   keepAlive?: boolean,
//   immediate?: boolean,
// ) => Process;
// interface Step {
//   schedule: Schedule;
//   cancel: (process: Process) => void;
//   process: (data: FrameData) => void;
// }
// type StepId =
//   | "read"
//   | "resolveKeyframes"
//   | "update"
//   | "preRender"
//   | "render"
//   | "postRender";
// type Batcher = {
//   [key in StepId]: Schedule;
// };
// type Steps = {
//   [key in StepId]: Step;
// };
// interface FrameData {
//   delta: number;
//   timestamp: number;
//   isProcessing: boolean;
// }

// declare const optimizedAppearDataAttribute: "data-framer-appear-id";

// interface WithAppearProps {
//   props: {
//     [optimizedAppearDataAttribute]?: string;
//     values?: {
//       [key: string]: MotionValue<number> | MotionValue<string>;
//     };
//   };
// }
// type HandoffFunction = (
//   storeId: string,
//   valueName: string,
//   frame: Batcher,
// ) => number | null;

// declare function spring({
//   keyframes,
//   restDelta,
//   restSpeed,
//   ...options
// }: ValueAnimationOptions<number>): KeyframeGenerator<number>;

// type DelayedFunction = (overshoot: number) => void;
// declare function delayInSeconds(
//   callback: DelayedFunction,
//   timeout: number,
// ): () => void;

// declare const backOut: (t: number) => number;
// declare const backIn: EasingFunction;
// declare const backInOut: EasingFunction;

// declare const circIn: EasingFunction;
// declare const circOut: EasingFunction;
// declare const circInOut: EasingFunction;

// declare const easeIn: (t: number) => number;
// declare const easeOut: (t: number) => number;
// declare const easeInOut: (t: number) => number;

// declare function cubicBezier(
//   mX1: number,
//   mY1: number,
//   mX2: number,
//   mY2: number,
// ): (t: number) => number;

// type Direction = "start" | "end";
// declare function steps(numSteps: number, direction?: Direction): EasingFunction;

// declare const mirrorEasing: EasingModifier;

// declare const reverseEasing: EasingModifier;

// declare function inertia({
//   keyframes,
//   velocity,
//   power,
//   timeConstant,
//   bounceDamping,
//   bounceStiffness,
//   modifyTarget,
//   min,
//   max,
//   restDelta,
//   restSpeed,
// }: ValueAnimationOptions<number>): KeyframeGenerator<number>;

// declare function keyframes<T extends string | number>({
//   duration,
//   keyframes: keyframeValues,
//   times,
//   ease,
// }: ValueAnimationOptions<T>): KeyframeGenerator<T>;

// type StaggerOrigin = "first" | "last" | "center" | number;
// type StaggerOptions = {
//   startDelay?: number;
//   from?: StaggerOrigin;
//   ease?: Easing;
// };
// declare function stagger(
//   duration?: number,
//   { startDelay, from, ease }?: StaggerOptions,
// ): DynamicOption<number>;

// declare const clamp: (min: number, max: number, v: number) => number;

// declare const distance: (a: number, b: number) => number;
// declare function distance2D(a: Point, b: Point): number;

// type DevMessage = (check: boolean, message: string) => void;
// declare let warning: DevMessage;
// declare let invariant: DevMessage;

// type Mix<T> = (v: number) => T;
// type MixerFactory<T> = (from: T, to: T) => Mix<T>;
// interface InterpolateOptions<T> {
//   clamp?: boolean;
//   ease?: EasingFunction | EasingFunction[];
//   mixer?: MixerFactory<T>;
// }

// -----
export type AnimationSequence = Segment[];

// export type AnimateArgs<O extends {}> = [
//   object: O | O[],
//   keyframes: ObjectTarget<O>,
//   options?: DynamicAnimationOptions,
// ];

// export type AnimateArgs<V> = [
//   value: V | MotionValue<V>,
//   keyframes: V | GenericKeyframesTarget<V>,
//   options?: ValueAnimationTransition<V>,
// ];
//     value: V | MotionValue<V>,
//     keyframes: V | GenericKeyframesTarget<V>,
//     options?: ValueAnimationTransition<V>,

export type AnimateArgs = [
  value: ReturnType<typeof motionValue<number>>,
  keyframes: number | GenericKeyframesTarget<number>,
  options?: ValueAnimationTransition<number>,
];
//     value: number | MotionValue<number>,
//     keyframes: number | GenericKeyframesTarget<number>,
//     options?: ValueAnimationTransition<number>,
