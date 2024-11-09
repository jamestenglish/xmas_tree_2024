export const SCREEN_HEIGHT = 800;
export const SCREEN_WIDTH = 1280;

export const CAMERA_WIDTH_ASPECT = 3;
export const CAMERA_HEIGHT_ASPECT = 4;

export const WEBCAM_HEIGHT = Math.trunc((5 / 7) * SCREEN_HEIGHT);
export const WEBCAM_WIDTH = Math.trunc(WEBCAM_HEIGHT * (4 / 3));

console.log({ SCREEN_HEIGHT, SCREEN_WIDTH, WEBCAM_HEIGHT, WEBCAM_WIDTH });
