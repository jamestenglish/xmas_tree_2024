import CodeEditor from "@uiw/react-textarea-code-editor";
import { forwardRef, TextareaHTMLAttributes } from "react";

export const animationOptionsStringDefault = `{
  ease: "linear"
}
`;

const CodeTextArea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>((props: TextareaHTMLAttributes<HTMLTextAreaElement>, ref) => {
  return (
    <CodeEditor
      ref={ref}
      language="js"
      padding={15}
      style={{
        backgroundColor: "#f5f5f5",
        fontFamily:
          "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
      }}
      value={animationOptionsStringDefault}
      {...props}
    />
  );
});
CodeTextArea.displayName = "CodeTextArea";

export default CodeTextArea;
