import { ButtonHTMLAttributes } from "react";

type ButtonProps = {
  variant?: "small";
} & ButtonHTMLAttributes<HTMLButtonElement>;
export default function Button(props: ButtonProps) {
  const { children, variant, ...otherProps } = props;

  if (variant === "small") {
    return (
      <button
        type="button"
        className="mb-1 me-1 rounded-md border border-gray-200 bg-white px-2.5 py-0.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
        {...otherProps}
      >
        {children}
      </button>
    );
  }
  return (
    <button
      type="button"
      className="mb-2 me-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
      {...otherProps}
    >
      {children}
    </button>
  );
}
