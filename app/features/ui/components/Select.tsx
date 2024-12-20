import { forwardRef, SelectHTMLAttributes } from "react";
// export default function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {

const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement>
>((props: SelectHTMLAttributes<HTMLSelectElement>, ref) => {
  const { children, ...otherProps } = props;
  return (
    <select
      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
      ref={ref}
      {...otherProps}
    >
      {children}
    </select>
  );
});

Select.displayName = "Select";

export default Select;
