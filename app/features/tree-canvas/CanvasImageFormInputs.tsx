import { useFormContext } from "react-hook-form";

export default function CanvasImageFormInputs({
  prepend = "",
  ButtonElement,
}: {
  prepend?: string;
  ButtonElement: JSX.Element;
}) {
  const { register } = useFormContext();

  const props = register(`${prepend}width`, { required: true });
  console.log({ otherProps: props });
  return (
    <div className="flex flex-row gap-2">
      <label className="font-small text-sm text-gray-900 dark:text-white">
        Width:
        <input
          className="blockrounded-sm ml-1 w-12 border border-gray-300 bg-gray-50 p-0.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          {...props}
        />
      </label>
      <label className="font-small text-sm text-gray-900 dark:text-white">
        Height:
        <input
          className="blockrounded-sm ml-1 w-12 border border-gray-300 bg-gray-50 p-0.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          {...register(`${prepend}height`, { required: true })}
        />
      </label>

      <label className="font-small text-sm text-gray-900 dark:text-white">
        x:
        <input
          className="blockrounded-sm ml-1 w-12 border border-gray-300 bg-gray-50 p-0.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          {...register(`${prepend}x`, { required: true })}
        />
      </label>

      <label className="font-small text-sm text-gray-900 dark:text-white">
        y:
        <input
          className="blockrounded-sm ml-1 w-12 border border-gray-300 bg-gray-50 p-0.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          {...register(`${prepend}y`, { required: true })}
        />
      </label>

      <label className="font-small text-sm text-gray-900 dark:text-white">
        rotation:
        <input
          className="blockrounded-sm ml-1 w-12 border border-gray-300 bg-gray-50 p-0.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          {...register(`${prepend}rotation`, { required: true })}
        />
      </label>

      {ButtonElement}
    </div>
  );
}
