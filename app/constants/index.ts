import { StatusType } from "~/features/photobooth-state/hooks/usePhotoboothState";
export { YETIS } from "./yetis";
export * from "./screen";

// export const MOCK_PRINT = false;
export const MOCK_PRINT = true;

// export const DO_QUERY_PRINTER_PRINTER = true;
export const DO_QUERY_PRINTER_PRINTER = false;

const isNormal = true;

export const PRINTER_POLL_RATE = isNormal ? 10000 : 3000;

export const COUNTDOWN_TIME_IN_MS = isNormal ? 1000 : 500;

export const PREVIEW_TIME_IN_MS = isNormal ? 3000 : 500;

export const ANIMATION_DURATION_MS = isNormal ? 1000 : 500;

export const MAX_PRINTER_STATUS_CHECKS = 30;

export const MAX_HEIGHT_TARGET_RM = 26;
export const MAX_HEIGHT_START_RM = 12;
export const COLUMN_GAP_TARGET_RM = 0.5;
export const COLUMN_GAP_START_RM = 0.5;

export const YETIIZE_STATUSES: StatusType[] = [
  "yetiizeReady",
  "yetiizeStart",
  "yetiizeFinish",
];

export const PRINTER_URL = "http://10.0.0.145:631/";

export const FLASH_TIME_IN_MS = 200;
// export const FLASH_TIME_IN_MS = 20000;
