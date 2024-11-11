export type VideoStateType = "idle" | "capture";

export interface FormDataProps {
  frontDeviceId?: string;
  rightDeviceId?: string;
  leftDeviceId?: string;
  backDeviceId?: string;
  numLights?: number;
}

export type OnChangeFormEventType = React.ChangeEvent<
  HTMLSelectElement | HTMLInputElement
>;

export type OnChangeFormType = (event: OnChangeFormEventType) => void;
