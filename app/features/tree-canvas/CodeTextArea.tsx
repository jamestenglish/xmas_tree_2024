import CodeEditor from "@uiw/react-textarea-code-editor";
import { useFormContext, Controller } from "react-hook-form";

export const animationOptionsStringDefault = `{
  ease: "linear"
}
`;

const CodeTextArea = () => {
  const { control } = useFormContext();

  return (
    <Controller
      name="animationOptionsString"
      control={control}
      render={({ field }) => (
        <CodeEditor
          language="js"
          padding={15}
          style={{
            backgroundColor: "#f5f5f5",
            fontFamily:
              "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
          }}
          {...field}
        />
      )}
    />
  );
};

export default CodeTextArea;
