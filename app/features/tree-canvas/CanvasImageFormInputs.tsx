import { useFormContext } from "react-hook-form";

export default function CanvasImageFormInputs({
  prepend = "",
  ButtonElement,
}: {
  prepend?: string;
  ButtonElement: JSX.Element;
}) {
  const { register } = useFormContext();

  return (
    <div className="flex flex-row gap-2">
      <label className="font-small text-sm text-gray-900 dark:text-white">
        Width:
        <input
          type="number"
          className="blockrounded-sm ml-1 w-12 border border-gray-300 bg-gray-50 p-0.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          {...register(`${prepend}width`, {
            valueAsNumber: true,
            required: true,
          })}
        />
      </label>
      <label className="font-small text-sm text-gray-900 dark:text-white">
        Height:
        <input
          type="number"
          className="blockrounded-sm ml-1 w-12 border border-gray-300 bg-gray-50 p-0.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          {...register(`${prepend}height`, {
            valueAsNumber: true,
            required: true,
          })}
        />
      </label>

      <label className="font-small text-sm text-gray-900 dark:text-white">
        x:
        <input
          type="number"
          className="blockrounded-sm ml-1 w-12 border border-gray-300 bg-gray-50 p-0.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          {...register(`${prepend}x`, { valueAsNumber: true, required: true })}
        />
      </label>

      <label className="font-small text-sm text-gray-900 dark:text-white">
        y:
        <input
          type="number"
          className="blockrounded-sm ml-1 w-12 border border-gray-300 bg-gray-50 p-0.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          {...register(`${prepend}y`, { valueAsNumber: true, required: true })}
        />
      </label>

      <label className="font-small text-sm text-gray-900 dark:text-white">
        rotation:
        <input
          type="number"
          className="blockrounded-sm ml-1 w-12 border border-gray-300 bg-gray-50 p-0.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          {...register(`${prepend}rotation`, {
            valueAsNumber: true,
            required: true,
          })}
        />
      </label>

      {ButtonElement}
    </div>
  );
}
