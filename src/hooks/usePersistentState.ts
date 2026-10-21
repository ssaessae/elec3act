import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import { parseJSON, readStored, writeStored } from '../lib/storage';

/**
 * useState that mirrors itself into localStorage.
 *
 *  - Initial value: read + sanitised from localStorage (safe against corrupt data).
 *  - Every change: written back automatically.
 *  - Other browser tabs: kept in sync through the `storage` event.
 */
export function usePersistentState<T>(
  key: string,
  sanitize: (raw: unknown) => T,
): [T, Dispatch<SetStateAction<T>>] {
  const sanitizeRef = useRef(sanitize);
  sanitizeRef.current = sanitize;

  const [value, setValue] = useState<T>(() => sanitize(readStored(key)));

  // State -> localStorage
  useEffect(() => {
    writeStored(key, value);
  }, [key, value]);

  // Another tab changed the key -> localStorage -> state
  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (event.storageArea !== window.localStorage || event.key !== key) return;
      setValue(sanitizeRef.current(parseJSON(event.newValue)));
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [key]);

  return [value, setValue];
}
