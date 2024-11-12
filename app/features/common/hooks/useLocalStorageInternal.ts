import { Dispatch, SetStateAction, useCallback, useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";

type UseLocalStorageOptions<T> = {
  /** A function to serialize the value before storing it. */
  serializer?: (value: T) => string;
  /** A function to deserialize the stored value. */
  deserializer?: (value: string) => T;
  /**
   * If `true` (default), the hook will initialize reading the local storage. In SSR, you should set it to `false`, returning the initial value initially.
   * @default true
   */
  initializeWithValue?: boolean;
};

export default function useLocalStorageInternal<T>(
  key: string,
  initialValue: T | (() => T),
  options: UseLocalStorageOptions<T> = {},
): [T, Dispatch<SetStateAction<T>>, () => void] {
  const [_, setKeys] = useLocalStorage<Array<string>>("INTERNAL_KEYS", [], {
    initializeWithValue: false,
  });

  useEffect(() => {
    setKeys((prev) => {
      const set = new Set([...prev, key]);
      return Array.from(set);
    });
  }, [key, setKeys]);

  const result = useLocalStorage<T>(key, initialValue, {
    initializeWithValue: false,
    ...options,
  });

  return result;
}

export function useLocalStorageInternalRemove() {
  const [keys] = useLocalStorage<Array<string>>("INTERNAL_KEYS", []);

  const remove = useCallback(() => {
    keys.forEach((key) => {
      window.localStorage.removeItem(key);
      window.dispatchEvent(new StorageEvent("local-storage", { key }));
    });
    // removeKeys();
  }, [keys]);

  return remove;
}
