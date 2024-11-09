import { COLORS } from "./colors";

const SETTINGS = {
  WIDTH: 1200,
  HEIGHT: 1800,
  PICTURE_WIDTH: 566,
  PICTURE_HEIGHT: 426,
  INITIAL_X: 18,
  X_OFFSET: 600,
  Y_OFFSETS: [30, 477, 922],
  SECONDARY_COLOR: COLORS.SECONDARY,
  PRIMARY_COLOR: COLORS.PRIMARY,
  BG_COLOR: COLORS.BG,
  FRAME_WIDTH: 8,
  TEXT_OUTLINE_WIDTH: 8,
  X_TEXT: 300,
  X_TEXT_SUPER_SCRIPT: 410,
  Y_TEXT_1: 1480,
  Y_TEXT_2: 1620,
  Y_TEXT_3: 1750,
  Y_TEXT_3_SUPER: 1730,
  FONT: "Mountains of Christmas",
  LINE_1: import.meta.env.VITE_LINE_1 ?? "James'",
  LINE_2: import.meta.env.VITE_LINE_2 ?? "Birthday!",
  LINE_3: import.meta.env.VITE_LINE_3 ?? "September 27   2024",
  LINE_3_SUPER: import.meta.env.VITE_LINE_3_SUPERSCRIPT ?? "th",
  LINE_3_SUPER_OFFSET: parseInt(
    import.meta.env.VITE_LINE_3_SUPERSCRIPT_OFFSET ?? 0,
  ),
} as const;

export default SETTINGS;
