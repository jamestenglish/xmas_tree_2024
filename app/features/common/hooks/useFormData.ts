import { useCallback, useState } from "react";

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

const useFormData = () => {
  const [formData, setFormData] = useState<FormDataProps>({});
  const onChangeForm = useCallback((event: OnChangeFormEventType) => {
    console.group("useFormData.onChangeForm");
    console.info({ event, value: event.target.value });
    const { id, value } = event.target;
    setFormData((prev) => {
      const newFormData = {
        ...prev,
        [id]: value === "" ? undefined : value,
      };
      console.group("useFormData.onChangeForm.setFormData");
      console.info({ newFormData });
      console.groupEnd();
      return newFormData;
    });
    console.groupEnd();
  }, []);

  return { formData, onChangeForm };
};

export default useFormData;
