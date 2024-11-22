import createRow, {
  TimelineModelExtra,
} from "~/features/tree-timeline/functions/createRow";

// TODO JTE undo if you want more than drawing
// const initialRowA = createRow();
const initialRowB = createRow({ isSelected: true });

// TODO JTE undo if you want more than drawing
// const initialModel: TimelineModelExtra = {
//   rows: [initialRowA, initialRowB],
// };

const initialModel: TimelineModelExtra = {
  rows: [initialRowB],
};

const initialGroup = initialRowB?.keyframes?.[0]?.group;
const initialSelectedGroup =
  (typeof initialGroup !== "string" ? initialGroup?.id : null) ?? null;

export { initialModel, initialSelectedGroup };
